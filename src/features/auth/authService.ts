export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export type LoginDto = { email: string; password: string };
export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  message?: string;
};

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const payload = { login: dto.email, password: dto.password };
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join("\n")
      : data?.message;
    throw new Error(msg || "Login failed");
  }
  return data;
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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join("\n")
      : data?.message;
    throw new Error(msg || "Refresh failed");
  }
  return data;
}
