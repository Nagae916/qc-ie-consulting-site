import Link from "next/link";

/** 学習ガイドの型 */
export type Guide = {
  id: string;            // ルーティング用: /guide/[id]
  title: string;         // タイトル
  description: string;   // 一言説明
  tags: string[];        // タグ表示（任意）
};

/** トップと /learn で使う “定義一覧” */
export const GUIDES: Guide[] = [
  {
    id: "regression-anova",
    title: "回帰分析・分散分析スタディガイド",
    description:
      "目的別に手法を選べるナビ + 用語・理解度チェック付き",
    tags: ["統計", "QC"],
  },
  {
    id: "stat-tests",
    title: "統計手法スタディガイド（t/z/F/χ²/ANOVA）",
    description:
      "平均・分散・カテゴリの観点から最適な検定をナビゲート",
    tags: ["検定", "品質管理"],
  },
];

/** グリッド表示用の小さな UI（必要な画面で使えます） */
export function GuidesGrid({ items = GUIDES }: { items?: Guide[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((g) => (
        <article
          key={g.id}
          className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5"
        >
          <h3 className="text-base font-semibold">{g.title}</h3>
          <p className="mt-1 text-sm leading-6 text-gray-700">{g.description}</p>
          {g.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {g.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-200"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3">
            <Link
              href={`/guide/${g.id}`}
              className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:underline"
            >
              詳細を見る →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

/** デフォルトはグリッド（使わなければ未使用でもOK） */
export default function Guides() {
  return <GuidesGrid />;
}
