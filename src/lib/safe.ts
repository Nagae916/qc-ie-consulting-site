// src/lib/safe.ts
export function toArray<T = unknown>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v == null) return [];
  return [v as T];
}

export function normalizeStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (typeof v === "string") {
    return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}
