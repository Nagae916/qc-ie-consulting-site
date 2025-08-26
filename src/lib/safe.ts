// src/lib/safe.ts
// 何が来ても string[] にそろえる共通関数（カンマ/空白区切り文字列もOK）
export function normalizeStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (typeof v === "string") {
    return v
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}
