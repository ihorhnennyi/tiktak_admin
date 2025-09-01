// src/features/auth/apiFetch.ts
import { API_URL } from "./api"; // у тебя уже есть
import { token } from "./tokenService";

// Собираем абсолютный URL из относительного пути
function buildUrl(input: string) {
  if (/^https?:\/\//i.test(input)) return input;
  const base = API_URL.replace(/\/+$/, "");
  const path = input.replace(/^\/+/, "");
  return `${base}/${path}`;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        headers: token.refresh ? { "Content-Type": "application/json" } : {},
        body: token.refresh
          ? JSON.stringify({ refreshToken: token.refresh })
          : undefined,
        credentials: "include", // на случай httpOnly куки
      });

      const data: any = await res.json().catch(() => ({}));
      if (!res.ok || !data?.accessToken) throw new Error("refresh failed");

      token.set(data.accessToken, data.refreshToken);
      return true;
    } catch {
      token.clear();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function redirectToLogin() {
  if (location.pathname !== "/login") {
    // жёсткий редирект, чтобы гарантированно сбросить состояние
    location.replace("/login");
  }
}

/**
 * Обёртка над fetch:
 * - добавляет Authorization Bearer
 * - на 401/403 пытается обновить токен и ретраит 1 раз
 * - при неудаче — чистит токены и редиректит на /login
 */
export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = buildUrl(input);
  const headers = new Headers(init.headers || {});
  if (token.access) headers.set("Authorization", `Bearer ${token.access}`);

  const doFetch = (h: Headers) =>
    fetch(url, {
      ...init,
      headers: h,
      credentials: init.credentials ?? "include",
    });

  // 1-й запрос
  let res = await doFetch(headers);
  if (res.status !== 401 && res.status !== 403) return res;

  // Пытаемся обновить токен (глобально, чтобы не плодить параллельных рефрешей)
  const ok = await refreshTokens();
  if (!ok) {
    redirectToLogin();
    return res;
  }

  // retry c новым access-токеном
  const retryHeaders = new Headers(init.headers || {});
  if (token.access) retryHeaders.set("Authorization", `Bearer ${token.access}`);
  res = await doFetch(retryHeaders);

  if (res.status === 401 || res.status === 403) {
    token.clear();
    redirectToLogin();
  }
  return res;
}
