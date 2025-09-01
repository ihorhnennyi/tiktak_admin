export function isTrue(v: any): boolean {
  return (
    v === true ||
    v === 1 ||
    v === "1" ||
    v === "Да" ||
    v === "yes" ||
    v === "true"
  );
}

export function getIP(v: any): string | undefined {
  return v?.ip ?? v?.ip4 ?? v?.ipAddr ?? v?.ipv4 ?? undefined;
}

export function shallowPrimitives(obj: any) {
  const out: Record<string, string | number | boolean> = {};
  if (!obj || typeof obj !== "object") return out;
  for (const [k, val] of Object.entries(obj)) {
    if (val == null) continue;
    const t = typeof val;
    if (t === "string" || t === "number" || t === "boolean")
      out[k] = val as any;
  }
  return out;
}

export function toCSV(rows: any[]): string {
  if (!rows.length) return "";
  const primRows = rows.map(shallowPrimitives);
  const cols = Array.from(
    primRows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );
  const esc = (s: any) =>
    `"${String(s)
      .replaceAll('"', '""')
      .replaceAll("\n", "\\n")
      .replaceAll("\r", "\\r")}"`;
  const header = cols.map(esc).join(",");
  const body = primRows
    .map((r) => cols.map((c) => (c in r ? esc((r as any)[c]) : "")).join(","))
    .join("\n");
  return header + "\n" + body;
}

export function downloadCSV(rows: any[], name = "visits.csv") {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
