// pages/guides/engineer/index.tsx
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

// 技術士のみ抽出（下書き除外）→ 更新日降順
function pickEngineerGuides(): Guide[] {
  return allGuides
    .filter((g) => g.status !== "draft" && g.exam === "engineer")
    .sort((a, b) => {
      const ta = Date.parse(String(a.updatedAt ?? a.date ?? "")) || 0;
      const tb = Date.parse(String(b.updatedAt ?? b.date ?? "")) || 0;
      return tb - ta;
    });
}

export default function EngineerGuidesIndex() {
  const guides = pickEngineerGuides();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">技術士ガイド</h1>
        <p className="text-gray-600 mt-1">論文構成・キーワード整理・演習添削など実務的な対策。</p>
      </header>

      {/* 2カラムカード */}
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((g) => {
          const href = g.url || `/guides/engineer/${g.slug}`;
          const updated =
            g.updatedAt || g.date
              ? new Date(String(g.updatedAt || g.date)).toLocaleDateString("ja-JP")
              : "";

          return (
            <article
              key={g._id}
              className="rounded-2xl border shadow-sm bg-white border-emerald-200"
            >
              {/* アクセント（技術士=緑） */}
              <div className="h-1 w-full rounded-t-2xl bg-emerald-300/70" />

              <div className="p-5">
                <h2 className="text-lg font-bold leading-snug">
                  <Link href={href} className="text-emerald-800 hover:underline">
                    {g.title}
                  </Link>
                </h2>

                {(g.section || (g.tags && g.tags.length)) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {g.section && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-xs">
                        {g.section}
                      </span>
                    )}
                    {(g.tags ?? []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {g.description && (
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">{g.description}</p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {updated ? `更新: ${updated}` : ""}
                  </span>
                  <Link
                    href={href}
                    className="inline-block rounded-full bg-emerald-600 text-white text-sm font-semibold px-3 py-1.5 hover:bg-emerald-700"
                  >
                    開く
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {guides.length === 0 && (
        <p className="text-gray-500">公開済みの技術士ガイドはまだありません。</p>
      )}
    </main>
  );
}
