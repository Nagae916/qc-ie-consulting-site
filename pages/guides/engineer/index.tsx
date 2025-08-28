// pages/guides/engineer/index.tsx
import Link from "next/link";
import type { GetStaticProps } from "next";
import { allGuides } from "contentlayer/generated";

export const getStaticProps: GetStaticProps = async () => ({ props: {}, revalidate: 60 });

export default function EngineerGuides() {
  // engineer カテゴリのみ抽出（draft は除外）
  const items = allGuides.filter(
    (g) => g.status !== "draft" && g.exam === "engineer"
  );

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">技術士ガイド</h1>
      <p className="text-gray-600">試験対策や実務ノウハウをまとめています。</p>

      {items.length === 0 ? (
        <div className="rounded-lg border p-5 text-gray-600">
          まだ公開ガイドがありません。準備中です。
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((g) => (
            <Link
              key={g._id}
              href={`/guides/${g.exam}/${g._raw.flattenedPath.split("/").pop()}`}
              className="block rounded-lg border p-5 hover:shadow"
            >
              <h2 className="font-semibold">{g.title}</h2>
              <p className="text-sm mt-2 text-gray-600">{g.description}</p>

              {Array.isArray(g.tags) && g.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {g.tags.map((t: string) => (
                    <span
                      key={t}
                      className="text-xs rounded bg-gray-100 px-2 py-0.5 text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
