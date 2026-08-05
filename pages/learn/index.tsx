import Link from "next/link";

import { ContentCard } from "@/components/site/ContentCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";
import { learningAreas } from "@/data/n-ie-lab";

const roadmaps = [
  {
    title: "ものづくり全体の学習マップ",
    description: "品質、生産、統計、経営工学のつながりを確認し、今の業務に近い入口を決めます。",
    href: "/guides/engineer/learning-map",
  },
  {
    title: "技術士第一次試験ロードマップ",
    description: "基礎・適性・専門科目を、経営工学の実務理解へつなげます。",
    href: "/guides/engineer/first-exam-roadmap",
  },
  {
    title: "技術士第二次試験ロードマップ",
    description: "過去問、設問型、答案骨子、キーワード、練習の順で進みます。",
    href: "/guides/engineer/how-to-study",
  },
  {
    title: "統計学習ロードマップ",
    description: "データの種類、記述統計、分布、推定・検定、回帰へ段階的に進みます。",
    href: "/guides/stat/data-science-stat-roadmap",
  },
] as const;

const tesLinks = [
  {
    title: "外部試験結果の妥当性",
    description: "試料、試験条件、測定結果を品質判断へつなぐケースです。",
    href: "/cases/third-party-testing-validity",
  },
  {
    title: "LCA",
    description: "原料から廃棄までの環境負荷をライフサイクルで捉えます。",
    href: "/guides/engineer/lca",
  },
  {
    title: "グリーン調達",
    description: "品質・取引条件と環境要求をサプライチェーンで管理します。",
    href: "/guides/engineer/green-procurement",
  },
] as const;

export default function LearningIndex() {
  return (
    <>
      <SiteMeta
        title="学びを深める"
        description="技術士、QC検定、統計検定、生産オペレーション、TESを、ものづくりの実務理解へつなげる学習入口です。"
        path="/learn"
      />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <p className="text-xs font-bold uppercase text-teal-700">Deepen learning</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">学びを深める</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              資格はサイトの目的ではなく、理解を体系化し、説明できる力を確認する手段です。今の業務や学習目標に近い入口から進んでください。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading title="目的から選ぶ" description="各領域の既存ガイドと演習を、そのまま利用できます。" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningAreas.map((area) => (
              <ContentCard key={area.title} href={area.href} eyebrow="学びを深める" title={area.title} description={area.description} action="学習を始める" />
            ))}
            <ContentCard
              href="/guides/engineer/learning-map"
              eyebrow="全体像"
              title="学習マップ"
              description="資格や分野をまたいで、品質、生産、データ、改善のつながりを確認します。"
              action="マップを見る"
            />
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionHeading title="おすすめの学習順" description="全体像を確認してから、個別ガイドと演習へ進みます。" />
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {roadmaps.map((roadmap, index) => (
                <ContentCard
                  key={roadmap.href}
                  href={roadmap.href}
                  eyebrow={`STEP ${index + 1}`}
                  title={roadmap.title}
                  description={roadmap.description}
                  action="ロードマップを見る"
                />
              ))}
            </div>
          </div>
        </section>

        <section id="tes" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
          <SectionHeading
            title="TESの学習を、品質と評価へつなげる"
            description="専用ページを重複して増やさず、品質評価、外部試験、環境配慮など共通する既存教材から学びます。"
          />
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {tesLinks.map((item) => (
              <ContentCard key={item.href} href={item.href} eyebrow="TES関連" title={item.title} description={item.description} action="関連教材を見る" />
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">資格を離れて、実務テーマから探す</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">4テーマから、今の課題に近い記事・ケース・ツールへ進めます。</p>
            </div>
            <Link href="/themes" className="w-fit rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">4テーマを見る</Link>
          </div>
        </section>
      </main>
    </>
  );
}
