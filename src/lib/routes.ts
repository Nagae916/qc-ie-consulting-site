// src/lib/routes.ts

// ====== 既存APIを維持しつつ拡張 ======
export type GuideSlug =
  | "qc-seven-tools"
  | "new-qc-seven-tools"
  | "stat-tests"
  | "regression-anova"
  // ★ 追加分
  | "oc-curve"
  | "reliability";

export const guidesTop = "/guides" as const;
export const guidesQcTop = "/guides/qc" as const;

// 任意の exam/slug
export function guideHref(exam: string, slug: string): string {
  return `/guides/${exam}/${slug}`;
}

// 互換：QC固定（既存コード向け）
export function guideUrl(slug: GuideSlug): `/guides/qc/${GuideSlug}` {
  return `/guides/qc/${slug}`;
}

// ====== 一覧カード用のメタ定義（新規追加） ======
export type GuideCard = {
  slug: GuideSlug;             // /guides/qc/${slug}
  title: string;
  description: string;
  tags: string[];
  published?: boolean;         // true のみ一覧表示
};

// 学習コンテンツ一覧がこの配列を参照する想定
export const GUIDE_CARDS: GuideCard[] = [
  {
    slug: "regression-anova",
    title: "回帰分析・分散分析スタディガイド",
    description: "目的に応じて手法を選べるナビ＋用語・理解度チェック付き",
    tags: ["統計", "QC"],
    published: true,
  },
  {
    slug: "stat-tests",
    title: "統計手法スタディガイド（t / Z / F / χ² / ANOVA）",
    description: "平均・分散・カテゴリの観点から最適な検定をナビゲート",
    tags: ["検定", "品質管理"],
    published: true,
  },
  {
    slug: "qc-seven-tools",
    title: "QC七つ道具",
    description: "現場のデータ整理・可視化・安定化の定番ツール群",
    tags: ["QC", "現場改善"],
    published: true,
  },
  {
    slug: "new-qc-seven-tools",
    title: "新QC七つ道具",
    description: "定性情報の整理や計画立案に強い7手法",
    tags: ["IE", "企画設計"],
    published: true,
  },
  // ★ 新規ガイド
  {
    slug: "oc-curve",
    title: "計数基準型抜取検査（OC曲線）ガイド",
    description: "n と c を動かして合格確率の変化を体感できるインタラクティブ解説",
    tags: ["検査", "QC"],
    published: true,
  },
  {
    slug: "reliability",
    title: "信頼性工学スタディガイド（Availability）",
    description: "MTBF/MTTR を動かして稼働率の感覚を掴むインタラクティブ解説",
    tags: ["信頼性", "品質管理"],
    published: true,
  },
];

// 公開カードだけを使いたい場合はこれを参照
export const PUBLISHED_GUIDE_CARDS = GUIDE_CARDS.filter(c => c.published);
