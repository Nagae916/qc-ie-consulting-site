// src/lib/routes.ts
// 既存API互換を保ちながら、外部フィード用の共通パスヘルパを追加。
// シンプル運用・見通し優先で最小限の型と関数に留めています。

// ====== ガイド関連（既存） ======
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

// ====== 一覧カード用のメタ定義（既存＋拡張余地） ======
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
export const PUBLISHED_GUIDE_CARDS = GUIDE_CARDS.filter((c) => c.published);

// =====================================================
// 外部フィード API のパス生成（集約API /api/feeds/[key] を想定）
// =====================================================

export type FeedKey = "news" | "blog" | "note" | "instagram" | "x";

/**
 * 共通APIエンドポイント生成。
 * - limit のほか、任意のクエリ（例：{ user: "nieqc_0713" }）も付与可能。
 * - 例）feedApiPath("note", 6, { user: "nieqc_0713" })
 */
export function feedApiPath(
  key: FeedKey,
  limit?: number,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const qs = new URLSearchParams();
  if (typeof limit === "number") qs.set("limit", String(limit));
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      const s = String(v);
      if (s.trim() !== "") qs.set(k, s);
    }
  }
  const q = qs.toString();
  return q ? `/api/feeds/${key}?${q}` : `/api/feeds/${key}`;
}

// 便利ショートカット（使わなければ削除可）
export const newsApi = (limit?: number) => feedApiPath("news", limit);
export const blogApi = (limit?: number) => feedApiPath("blog", limit);
export const noteApi = (limit?: number, user?: string) =>
  feedApiPath("note", limit, user ? { user: user.replace(/^@/, "") } : undefined);
export const instagramApi = (limit?: number) => feedApiPath("instagram", limit);
export const xApi = (limit?: number, user?: string) =>
  // X は通常 .env の既定URLで取得するが、必要なら user をクエリに渡せる
  feedApiPath("x", limit, user ? { user: user.replace(/^@/, "") } : undefined);
