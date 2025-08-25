// src/lib/routes.ts
export type GuideSlug =
  | "qc-seven-tools"
  | "new-qc-seven-tools"
  | "stat-tests"
  | "regression-anova";

export const guidesTop = "/guides" as const;
export const guidesQcTop = "/guides/qc" as const;

export const guideUrl = (slug: GuideSlug) => `/guides/qc/${slug}` as const;
