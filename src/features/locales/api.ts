import { apiFetch } from "@/features/auth/apiFetch";
import type { LocaleContent, LocaleKey, LocaleMeta } from "./types";

/* -------- helpers -------- */
async function parseJSON(res: Response) {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
function msg(d: any, fallback: string) {
  if (!d) return fallback;
  if (Array.isArray(d?.message)) return d.message.join("\n");
  return d?.message || fallback;
}

const ADMIN = "/admin/site-content"; // → /api/admin/site-content/...
const PUBLIC = "/content"; // → /api/content/...

export const emptyLocale: LocaleContent = {
  textBeforeWallet: "",
  wallet: "",
  textAfterWallet: "",
  blocks: [],
};

/* -------- admin API -------- */

export async function listLocales(): Promise<LocaleMeta[]> {
  const res = await apiFetch(`${ADMIN}/locales`, { method: "GET" });
  const data = await parseJSON(res);
  if (!res.ok) throw new Error(msg(data, "Не удалось загрузить локали"));
  const items = data?.data?.items ?? data?.items ?? data?.data ?? data ?? [];
  return Array.isArray(items) ? (items as LocaleMeta[]) : [];
}

export async function getLocaleContent(
  locale: LocaleKey
): Promise<LocaleContent> {
  const res = await apiFetch(`${ADMIN}/${locale}`, { method: "GET" });
  if (res.status === 404) return { ...emptyLocale }; // новой ещё нет
  const data = await parseJSON(res);
  if (!res.ok)
    throw new Error(msg(data, "Не удалось загрузить контент локали"));
  const p = data?.data ?? data ?? {};
  return {
    textBeforeWallet: p?.textBeforeWallet ?? "",
    wallet: p?.wallet ?? "",
    textAfterWallet: p?.textAfterWallet ?? "",
    blocks: p?.blocks ?? [],
  };
}

export async function saveLocaleContent(
  locale: LocaleKey,
  body: LocaleContent
): Promise<{ created: boolean }> {
  let res = await apiFetch(`${ADMIN}/${locale}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 404) {
    res = await apiFetch(`${ADMIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, ...body }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(msg(data, "Не удалось создать локаль"));
    return { created: true };
  }

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(msg(data, "Не удалось сохранить локаль"));
  return { created: false };
}

export async function deleteLocale(locale: LocaleKey): Promise<void> {
  const res = await apiFetch(`${ADMIN}/${locale}`, { method: "DELETE" });
  const data = await parseJSON(res);
  if (!res.ok) throw new Error(msg(data, "Не удалось удалить локаль"));
}

/* -------- public API -------- */

export async function listPublicLocales(): Promise<string[]> {
  const res = await apiFetch(`${PUBLIC}/locales`, { method: "GET" });
  const data = await parseJSON(res);
  if (!res.ok)
    throw new Error(msg(data, "Не удалось загрузить публичные локали"));
  const items = data?.data?.items ?? data?.items ?? data?.data ?? data ?? [];
  return Array.isArray(items) ? (items as string[]) : [];
}

export async function getPublicLocale(
  locale: LocaleKey
): Promise<LocaleContent> {
  const res = await apiFetch(`${PUBLIC}/${locale}`, { method: "GET" });
  const data = await parseJSON(res);
  if (!res.ok)
    throw new Error(
      msg(data, "Не удалось загрузить публичную страницу локали")
    );
  const p = data?.data ?? data ?? {};
  return {
    textBeforeWallet: p?.textBeforeWallet ?? "",
    wallet: p?.wallet ?? "",
    textAfterWallet: p?.textAfterWallet ?? "",
    blocks: p?.blocks ?? [],
  };
}
