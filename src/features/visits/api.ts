// src/features/visits/api.ts
import { apiFetch } from "@/features/auth/apiFetch";
import type { Visit } from "./types";

// При необходимости поменяй на "/admin/visits"
const BASE = "/visits";

function getMsg(data: any, fallback: string) {
  if (!data) return fallback;
  if (Array.isArray(data?.message)) return data.message.join("\n");
  return data?.message || fallback;
}

function unwrapArray(data: any): Visit[] {
  const items = data?.data?.items ?? data?.items ?? data?.data ?? data ?? [];
  return Array.isArray(items) ? (items as Visit[]) : [];
}

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

/** Получить список визитов */
export async function fetchVisits(): Promise<Visit[]> {
  const res = await apiFetch(`${BASE}`, { method: "GET" });
  const data = await parseJson(res);
  if (!res.ok)
    throw new Error(getMsg(data, `Failed to load visits (${res.status})`));
  return unwrapArray(data);
}

/** Заблокировать всех */
export async function blockAllVisits(): Promise<void> {
  const res = await apiFetch(`${BASE}/block-all`, { method: "POST" });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(getMsg(data, "Не удалось заблокировать всех"));
}

/** Разблокировать всех */
export async function unblockAllVisits(): Promise<void> {
  const res = await apiFetch(`${BASE}/unblock-all`, { method: "POST" });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(getMsg(data, "Не удалось разблокировать всех"));
}

/* (опционально) Блок/разблок по выбору — если добавишь на бэке:
export async function blockVisits(payload: { ids?: string[]; ips?: string[] }) {
  const res = await apiFetch(`${BASE}/block`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(getMsg(data, "Не удалось заблокировать выбранных"));
}

export async function unblockVisits(payload: { ids?: string[]; ips?: string[] }) {
  const res = await apiFetch(`${BASE}/unblock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(getMsg(data, "Не удалось разблокировать выбранных"));
}
*/

export async function blockByIp(ip: string): Promise<void> {
  const res = await apiFetch(`${BASE}/block/ip/${ip}`, { method: "POST" });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(getMsg(data, "Не удалось заблокировать IP"));
}

export async function unblockByIp(ip: string): Promise<void> {
  const res = await apiFetch(`${BASE}/unblock/ip/${ip}`, { method: "POST" });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(getMsg(data, "Не удалось разблокировать IP"));
}
