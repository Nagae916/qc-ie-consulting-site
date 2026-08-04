const DEFAULT_GUIDE_STATUS = "published";

export function normalizeFrontmatterEnumValue(value: unknown, fallback = ""): string {
  const normalized = String(value ?? "").replace(/^\uFEFF/, "").trim();
  return normalized || fallback;
}

export function normalizeGuideStatus(value: unknown): string {
  return normalizeFrontmatterEnumValue(value, DEFAULT_GUIDE_STATUS);
}
