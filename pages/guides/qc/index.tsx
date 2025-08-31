// pages/guides/qc/index.tsx
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

// QC専用: 下書き除外 → 更新日降順
function pickQCGuides(): Guide[] {
  return allGuides
    .filter((g) => g.status !== "draft" && g.exam === "qc")
    .sort((a, b) => {
      const ta = Date.parse(String(a.updatedAt ?? a.date ?? "")) || 0;
      const tb = Date.parse(String(b.updatedAt ?? b.date ?? "")) || 0;
      return tb - ta;
    });
}

export default function QCGuidesIndex() {
  const guides = pickQCGuides();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">QC ガイド</h1>
        <p className="text-gray-600 mt-1">
          品質管理の基礎〜管理図・検定・推定、新QC七つ道具など。
        </p>
      </header>

      {/* 2カラムのカードレイアウト */}
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((g) => {
          const href = g.url || `/guides/qc/${g.slug}`;
          const updated =
            g.updatedAt || g.date
              ? new Date(String(g.updatedAt || g.date)).toLocaleDateString("ja-JP")
              : "";

        return (
          <article
            key={g._id}
            className="rounded-2xl border shadow-sm bg-white border-amber-200"
          >
            {/* アクセント（QC=薄いオレンジ） */}
            <div className="h-1 w-full rounded-t-2xl bg-amber-300/70" />

            <div className="p-5">
              <h2 className="text-lg font-bold leading-snug">
                <Link href={href} className="text-amber-800 hover:underline">
                  {g.title}
                </Link>
              </h2>

              {/* section / タグ */}
              {(g.section || (g.tags && g.tags.length)) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.section && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs">
                      {g.section}
                    </span>
                  )}
                  {(g.tags ?? []).slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* 説明 */}
              {g.description && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                  {g.description}
                </p>
              )}

              {/* フッタ */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {updated ? `更新: ${updated}` : ""}
                </span>
                <Link
                  href={href}
                  className="inline-block rounded-full bg-amber-500 text-white text-sm font-semibold px-3 py-1.5 hover:bg-amber-600"
                >
                  開く
                </Link>
              </div>
            </div>
          </article>
        );
        })}
      </div>

      {/* 空の場合 */}
      {guides.length === 0 && (
        <p className="text-gray-500">公開済みのQCガイドはまだありません。</p>
      )}
    </main>
  );
}
