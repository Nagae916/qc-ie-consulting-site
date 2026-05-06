import Head from "next/head";
import Link from "next/link";

const learningRoutes = [
  {
    title: "経営工学 学習マップ",
    description: "品質管理、統計、生産管理、技術士演習のつながりを確認する全体入口です。",
    href: "/guides/engineer/learning-map",
    category: "全体像",
    nextGuides: [
      { title: "生産計画", href: "/guides/engineer/production-planning" },
      { title: "TQM", href: "/guides/engineer/tqm" },
    ],
    nextTools: [
      { title: "過去問トレンドマップ", href: "/guides/engineer/past-exam-trend-map" },
    ],
  },
  {
    title: "技術士第一次試験ロードマップ",
    description: "基礎科目、適性科目、専門科目を経営工学と第二次試験へ接続します。",
    href: "/guides/engineer/first-exam-roadmap",
    category: "技術士",
    nextGuides: [
      { title: "IEの基本", href: "/guides/engineer/ie-overview" },
      { title: "OR", href: "/guides/engineer/operations-research" },
    ],
    nextTools: [
      { title: "問題マトリクス", href: "/guides/engineer/problem-matrix" },
    ],
  },
  {
    title: "統計学習ロードマップ",
    description: "データサイエンス、品質管理、技術士答案に共通する統計の土台を整理します。",
    href: "/guides/stat/data-science-stat-roadmap",
    category: "統計",
    nextGuides: [
      { title: "記述統計", href: "/guides/stat/descriptive-statistics" },
      { title: "データ型と尺度", href: "/guides/stat/data-types-and-scales" },
    ],
    nextTools: [
      { title: "カイ二乗ツール", href: "/tools/chi-square" },
    ],
  },
];

const starterPaths = [
  { title: "QCから始める", href: "/guides/qc", description: "品質管理、QC検定、実験計画法、OC曲線へ進みます。" },
  { title: "統計から始める", href: "/guides/stat", description: "記述統計、データ型、検定、回帰へ進みます。" },
  { title: "技術士から始める", href: "/guides/engineer", description: "経営工学、生産管理、答案構成へ進みます。" },
];

const learningFlow = [
  { title: "学習方針", description: "何から学ぶかを決める", href: "/learn" },
  { title: "ガイド", description: "個別テーマを理解する", href: "/guides" },
  { title: "演習・ツール", description: "操作して考え方を試す", href: "/tools" },
  { title: "参考資料", description: "白書・法令・過去問で背景を補強する", href: "/references" },
];

export default function LearningIndex() {
  return (
    <>
      <Head>
        <title>学習方針 | n-ie-qclab</title>
        <meta name="description" content="経営工学、品質管理、統計、技術士試験の学習方針とロードマップを整理した入口です。" />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="text-sm font-semibold text-teal-700">Learning routes</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">学習方針</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              学習方針は、何から学ぶかを決めるページです。
              ここでは、何をどの順で学ぶか、試験や実務へどう接続するかを確認できます。
              個別テーマを学ぶページは「ガイド」、操作して理解する教材は「演習・ツール」に分けています。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-2xl font-bold">基本の流れ</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {learningFlow.map((step, index) => (
              <Link key={step.href} href={step.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-bold text-teal-700">STEP {index + 1}</div>
                <h3 className="mt-2 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-10">
          <h2 className="text-2xl font-bold">まず見るロードマップ</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {learningRoutes.map((route) => (
              <article key={route.href} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{route.category}</span>
                <h3 className="mt-3 font-bold">{route.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{route.description}</p>
                <Link href={route.href} className="mt-4 inline-block text-sm font-semibold text-teal-700 underline">
                  ロードマップを見る
                </Link>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="text-xs font-semibold text-slate-500">次に読むガイド</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {route.nextGuides.map((guide) => (
                      <Link key={guide.href} href={guide.href} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-teal-50">
                        {guide.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-500">使うツール</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {route.nextTools.map((tool) => (
                      <Link key={tool.href} href={tool.href} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">
                        {tool.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-14">
          <h2 className="text-2xl font-bold">目的別の入口</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {starterPaths.map((path) => (
              <Link key={path.href} href={path.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <h3 className="font-bold">{path.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{path.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
