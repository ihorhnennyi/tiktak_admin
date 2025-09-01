import type { Visit } from "./types";

export type VisitsFilters = {
  q: string;
  lang: string;
  platform: string;
  blocked: "any" | "yes" | "no";
  online: "any" | "yes" | "no";
  secure: "any" | "yes" | "no";
  minVisits?: number;
  maxVisits?: number;
};

export const defaultVisitsFilters: VisitsFilters = {
  q: "",
  lang: "",
  platform: "",
  blocked: "any",
  online: "any",
  secure: "any",
  minVisits: undefined,
  maxVisits: undefined,
};

const boolOk = (val: boolean | undefined, f: "any" | "yes" | "no") =>
  f === "any" ? true : f === "yes" ? !!val : !val;

export function applyVisitsFilters(rows: Visit[], f: VisitsFilters): Visit[] {
  const q = f.q.trim().toLowerCase();
  return rows.filter((r) => {
    if (q) {
      const hay =
        `${r.ip} ${r.userAgent} ${r.referrer} ${r.socketId} ${r.pageId}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.lang && !(r.lang || "").toLowerCase().includes(f.lang.toLowerCase()))
      return false;
    if (
      f.platform &&
      !(r.platform || "").toLowerCase().includes(f.platform.toLowerCase())
    )
      return false;
    if (!boolOk(r.isBlocked, f.blocked)) return false;
    if (!boolOk(r.online, f.online)) return false;
    if (!boolOk(r.secure, f.secure)) return false;
    if (typeof f.minVisits === "number" && (r.visitsCount ?? 0) < f.minVisits)
      return false;
    if (typeof f.maxVisits === "number" && (r.visitsCount ?? 0) > f.maxVisits)
      return false;
    return true;
  });
}
