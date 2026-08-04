const DEFAULT_GUIDE_STATUS = "published";

export const GUIDE_STATUS_VALUES = ["published", "draft", "planned", "needs-review", "wip"] as const;
export type GuideStatus = (typeof GUIDE_STATUS_VALUES)[number];

const GUIDE_STATUS_SET = new Set<string>(GUIDE_STATUS_VALUES);

export function normalizeFrontmatterEnumValue(value: unknown, fallback = ""): string {
  const normalized = String(value ?? "").replace(/^\uFEFF/, "").trim();
  return normalized || fallback;
}

export function normalizeGuideStatus(value: unknown): GuideStatus {
  const normalized = normalizeFrontmatterEnumValue(value, DEFAULT_GUIDE_STATUS);

  if (!GUIDE_STATUS_SET.has(normalized)) {
    throw new Error(`Invalid guide status: ${JSON.stringify(normalized)}`);
  }

  return normalized as GuideStatus;
}

export function isPublishedGuideStatus(value: unknown): boolean {
  try {
    return normalizeGuideStatus(value) === "published";
  } catch {
    return false;
  }
}
