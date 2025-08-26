// src/lib/routes.ts

// --- QC専用のスラッグ（型安全を維持）
export type GuideSlug =
  | "qc-seven-tools"
  | "new-qc-seven-tools"
  | "stat-tests"
  | "regression-anova";

// ガイドのトップ
export const guidesTop = "/guides" as const;
export const guidesQcTop = "/guides/qc" as const;

// --- 正（単一情報源）：任意の exam/slug からURLを生成
export function guideHref(exam: string, slug: string): string {
  return `/guides/${exam}/${slug}`;
}

// --- 互換用ラッパ：QC向け（内部で正の関数を呼ぶ）
// 既存コードの破壊を避け、将来の仕様変更も1ヶ所で反映。
export function guideUrl(slug: GuideSlug): `/guides/qc/${GuideSlug}` {
  return `/guides/qc/${slug}`;
  // もしくは下記でもOK（正への一点化がより明示的）
  // return guideHref("qc", slug) as `/guides/qc/${GuideSlug}`;
}
