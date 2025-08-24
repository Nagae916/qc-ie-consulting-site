// src/components/learn/Guides.tsx
import Link from "next/link";

/** 学習ガイドの型 */
export type Guide = {
  id: string;            // ルーティング: /guide/[id]
  title: string;         // タイトル
  description: string;   // 説明
  tags: string[];        // タグ（任意）
};

/** 一覧定義（ここに増やすだけでOK） */
export const GUIDES: Guide[] = [
  {
    id: "regression-anova",
    title: "回帰分析・分散分析スタディガイド",
    description: "目的に応じて手法を選べるナビ＋用語・理解度チェック付き",
    tags: ["統計", "QC"],
  },
  {
    id: "stat-tests",
    title: "統計手法スタディガイド（t / Z / F / χ² / ANOVA）",
    description: "平均・分散・カテゴリの観点から最適な検定をナビゲート",
    tags: ["検定", "品質管理"],
  },
];

/** グリッド表示 */
export function GuidesGrid({ items = GUIDES }: { items?: Guide[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((g) => (
        <article key={g.id} className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-5">
          <h3 className="font-semibold text-brand-900">{g.title}</h3>
          <p className="text-sm text-gray-700 mt-2">{g.description}</p>
          {g.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {g.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded bg-brand-100/70 border border-brand-200">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-4">
            <Link href={`/guide/${g.id}`} className="text-brand-800 hover:underline">
              詳細を見る →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Guides() {
  return <GuidesGrid />;
}
