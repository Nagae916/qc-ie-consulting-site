// pages/guides/engineer/index.tsx
import Link from "next/link";
import type { GetStaticProps } from "next";
import { allGuides } from "contentlayer/generated";
import { guideHref } from "@/lib/routes";

export const getStaticProps: GetStaticProps = async () => ({ props: {}, revalidate: 60 });

export default function EngineerGuides() {
  const guides = allGuides
    .filter(g => g.status !== "draft" && g.exam === "engineer")
    .sort((a, b) => (a.title || "").localeCompare(b.title || "", "ja"));

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">技術士ガイド</h1>
      <p className="text-gray-600">学習ロードマップ、要点整理、事例解説などを追加していきます。</p>

      {guides.length === 0 ? (
        <p className="text-gray-500">まだ公開中のガイドはありません。順次追加予定です。</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {guides.map(g => (
            <Link
              key={g._id}
              href={guideHref("engineer", g.slug)}
              className="block rounded-lg border p-5 hover:shadow"
            >
              <h2 className="font-semibold">{g.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{g.description}</p>
              {g.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {g.tags.map(t => (
                    <span key={t} className="text-xs rounded bg-gray-100 px-2 py-0.5 text-gray-700">
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
