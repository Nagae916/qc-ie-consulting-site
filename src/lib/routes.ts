// src/lib/routes.ts

// QC専用のスラッグ（従来互換）
export type GuideSlug =
  | "qc-seven-tools"
  | "new-qc-seven-tools"
  | "stat-tests"
  | "regression-anova";

export const guidesTop = "/guides" as const;
export const guidesQcTop = "/guides/qc" as const;

// 正（単一情報源）: 任意の exam/slug からURL生成
export function guideHref(exam: string, slug: string): string {
  return `/guides/${exam}/${slug}`;
}

// 既存互換のQC用ラッパ（必要なら残す）
export function guideUrl(slug: GuideSlug): `/guides/qc/${GuideSlug}` {
  return `/guides/qc/${slug}`;
}
