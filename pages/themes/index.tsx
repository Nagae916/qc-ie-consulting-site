import Link from "next/link";

import { ContentCard } from "@/components/site/ContentCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";
import { themes } from "@/data/n-ie-lab";

const themeAccents = [
  "border-rose-200",
  "border-teal-200",
  "border-sky-200",
  "border-amber-200",
] as const;

export default function ThemesIndexPage() {
  return (
    <>
      <SiteMeta
        title="4つのテーマ"
        description="品質、生産、データ、改善の4つの視点から、ものづくりの課題と仕組みを学べます。"
        path="/themes"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "N-IE Lab 4つのテーマ",
          url: "https://n-ie-qclab.com/themes",
        }}
      />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
            <p className="text-xs font-bold uppercase text-teal-700">Themes</p>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">ものづくりを4つの視点で見る</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              品質、生産、データ、改善は別々の仕事ではありません。今の疑問に近いテーマから入り、関連する記事、ケース、ツールへ進んでください。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading
            title="今の仕事に近い入口を選ぶ"
            description="各テーマでは、入門、実務、ケース、ツール、体系学習を一つの流れで確認できます。"
          />
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {themes.map((theme, index) => (
              <ContentCard
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                eyebrow={`視点 ${index + 1}`}
                title={theme.title}
                description={theme.description}
                meta={`${theme.introductory.length + theme.practical.length + theme.tools.length + theme.cases.length}件の入口`}
                action="このテーマを見る"
                className={themeAccents[index] ?? "border-slate-200"}
              />
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">手を動かして確かめたい方へ</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">計算、可視化、演習を使って理解を確かめられます。</p>
            </div>
            <Link href="/tools" className="w-fit rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">
              ツールを見る
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
