// src/lib/routes.ts
export type GuideSlug =
  | "qc-seven-tools"
  | "new-qc-seven-tools"
  | "stat-tests"
  | "regression-anova";

export const guidesTop = "/guides" as const;
export const guidesQcTop = "/guides/qc" as const;

// 正：任意の exam/slug
export function guideHref(exam: string, slug: string): string {
  return `/guides/${exam}/${slug}`;
}

// 互換：QC固定
export function guideUrl(slug: GuideSlug): `/guides/qc/${GuideSlug}` {
  return `/guides/qc/${slug}`;
}
