export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export type LoginDto = { email: string; password: string };
export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  message?: string;
};

function extractMsg(data: any, fallback = "Request failed") {
  if (!data) return fallback;
  if (Array.isArray(data?.message)) return data.message.join("\n");
  return data?.message || fallback;
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const payload = { login: dto.email, password: dto.password };
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(extractMsg(json, "Login failed"));
  return json;
}

export async function refreshToken(): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
    credentials: "include",
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(extractMsg(json, "Refresh failed"));
  return json;
}
