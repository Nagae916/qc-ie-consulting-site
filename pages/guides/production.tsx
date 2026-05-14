import Head from "next/head";
import Link from "next/link";

const learningAreas = [
  {
    title: "生産計画",
    description: "需要と供給能力を整合させる",
    keywords: [
      { label: "S&OP", href: "/guides/engineer/s-and-op" },
      { label: "需給調整", href: "/guides/engineer/demand-supply-adjustment" },
      { label: "MRP", href: "/guides/engineer/mrp" },
    ],
  },
  {
    title: "工程管理",
    description: "工程の進捗・負荷・納期を管理する",
    keywords: [
      { label: "リードタイム短縮", href: "/guides/engineer/lead-time-reduction" },
      { label: "TOC理論", href: "/guides/engineer/toc" },
      { label: "平準化", href: "/guides/engineer/heijunka" },
    ],
  },
  {
    title: "在庫管理",
    description: "欠品と過剰在庫のバランスを取る",
    keywords: [
      { label: "在庫最適化", href: "/guides/engineer/inventory-optimization" },
      { label: "安全在庫", href: "/guides/engineer/safety-stock" },
      { label: "ABC分析", href: "/guides/engineer/abc-analysis" },
    ],
  },
  {
    title: "IE・作業改善",
    description: "作業・工程・レイアウトを改善する",
    keywords: [
      { label: "作業研究", href: "/guides/engineer/work-study" },
      { label: "標準時間", href: "/guides/engineer/standard-time" },
      { label: "ラインバランシング", href: "/guides/engineer/line-balancing" },
    ],
  },
  {
    title: "設備管理",
    description: "設備ロスを可視化し生産性を高める",
    keywords: [
      { label: "OEE", href: "/guides/engineer/oee" },
      { label: "段取短縮", href: "/guides/engineer/setup-time-reduction" },
      { label: "SMED", href: "/guides/engineer/smed" },
    ],
  },
  {
    title: "SCM",
    description: "調達・生産・物流を全体最適化する",
    keywords: [
      { label: "SCM", href: "/guides/engineer/scm" },
      { label: "デカップリングポイント", href: "/guides/engineer/decoupling-point" },
      { label: "ブルウィップ効果", href: "/guides/engineer/bullwhip-effect" },
    ],
  },
  {
    title: "物流管理",
    description: "保管・荷役・輸配送を最適化する",
    keywords: [
      { label: "WMS", href: "/guides/engineer/wms" },
      { label: "TMS", href: "/guides/engineer/tms" },
      { label: "モーダルシフト", href: "/guides/engineer/modal-shift" },
    ],
  },
];

const learningSteps = [
  "生産管理の全体像をつかむ",
  "生産計画・需給調整を理解する",
  "工程管理・リードタイム短縮を学ぶ",
  "在庫管理・SCMを学ぶ",
  "IE・設備効率・作業改善を学ぶ",
  "物流管理・サプライチェーン全体最適へ広げる",
];

const linkGroups = [
  {
    title: "生産計画・需給調整",
    links: [
      { label: "S&OP", href: "/guides/engineer/s-and-op" },
      { label: "需給調整", href: "/guides/engineer/demand-supply-adjustment" },
      { label: "MRP", href: "/guides/engineer/mrp" },
      { label: "平準化", href: "/guides/engineer/heijunka" },
    ],
  },
  {
    title: "工程管理・改善",
    links: [
      { label: "リードタイム短縮", href: "/guides/engineer/lead-time-reduction" },
      { label: "TOC理論", href: "/guides/engineer/toc" },
      { label: "OEE", href: "/guides/engineer/oee" },
      { label: "段取短縮", href: "/guides/engineer/setup-time-reduction" },
      { label: "SMED", href: "/guides/engineer/smed" },
      { label: "多品種混流生産", href: "/guides/engineer/mixed-model-production" },
    ],
  },
  {
    title: "SCM・在庫管理",
    links: [
      { label: "SCM", href: "/guides/engineer/scm" },
      { label: "デカップリングポイント", href: "/guides/engineer/decoupling-point" },
      { label: "ブルウィップ効果", href: "/guides/engineer/bullwhip-effect" },
      { label: "デマンドドリブン", href: "/guides/engineer/demand-driven" },
      { label: "JIT", href: "/guides/engineer/jit" },
    ],
  },
  {
    title: "物流管理",
    links: [
      { label: "WMS", href: "/guides/engineer/wms" },
      { label: "TMS", href: "/guides/engineer/tms" },
      { label: "モーダルシフト", href: "/guides/engineer/modal-shift" },
      { label: "フィジカルインターネット", href: "/guides/engineer/physical-internet" },
      { label: "物流2024年問題", href: "/guides/engineer/logistics-2024" },
    ],
  },
  {
    title: "DX・データ活用",
    links: [
      { label: "DX", href: "/guides/engineer/dx" },
      { label: "データドリブン", href: "/guides/engineer/data-driven" },
      { label: "ERP", href: "/guides/engineer/erp" },
      { label: "MES", href: "/guides/engineer/mes" },
    ],
  },
];

const futureTopics = [
  "生産計画の基本",
  "工程管理の基本",
  "在庫管理の基本",
  "IE・作業研究",
  "ラインバランシング",
  "標準時間",
  "設備効率とOEE",
  "生産リードタイム短縮",
  "多品種少量生産",
  "SCMと生産管理",
  "物流管理との接続",
];

const nextLinks = [
  { label: "技術士 経営工学部門の使い方ガイド", href: "/guides/engineer/how-to-study" },
  { label: "技術士 経営工学 最重要キーワード100", href: "/guides/engineer/keyword-priority-100" },
  { label: "SCM", href: "/guides/engineer/scm" },
  { label: "S&OP", href: "/guides/engineer/s-and-op" },
  { label: "OEE", href: "/guides/engineer/oee" },
  { label: "リードタイム短縮", href: "/guides/engineer/lead-time-reduction" },
  { label: "MRP", href: "/guides/engineer/mrp" },
];

export default function ProductionGuidePage() {
  return (
    <>
      <Head>
        <title>生産管理を学ぶ｜経営工学の中核領域 | n-ie-qclab</title>
        <meta
          name="description"
          content="生産管理を、経営工学における中核領域として、生産計画・工程管理・在庫管理・IE・設備効率・SCM・物流管理の観点から整理します。"
        />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="text-sm text-slate-500">
              <Link href="/" className="underline">トップ</Link> / <Link href="/guides" className="underline">ガイド</Link> / 生産管理
            </div>
            <p className="mt-6 text-sm font-semibold tracking-[0.18em] text-teal-700">PRODUCTION MANAGEMENT</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">生産管理を学ぶ</h1>
            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              生産管理は、需要・生産能力・在庫・工程・人員・設備・物流をつなぎ、QCDを実現する経営工学の中核領域です。
              このページでは、工程を管理する技術だけでなく、経営資源を使って価値を安定的に生み出す仕組みとして整理します。
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10">
          <section className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">このページの役割</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              このページは、生産管理の学習入口です。今後、生産計画、工程管理、在庫管理、IE、設備効率、SCM、物流管理などのコンテンツを追加していきます。
              現時点では、既存の経営工学・技術士キーワードページも活用しながら、学習領域の全体像を示します。
            </p>
          </section>

          <section className="mt-8">
            <SectionHeader title="生産管理で学ぶ主な領域" description="生産管理を、計画・工程・在庫・作業・設備・SCM・物流の切り口で整理します。" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {learningAreas.map((area) => (
                <section key={area.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-bold text-slate-900">{area.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {area.keywords.map((keyword) => (
                      <Link key={keyword.href} href={keyword.href} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:border-teal-500">
                        {keyword.label}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title="生産管理の学習フロー" description="最初は全体像をつかみ、計画・工程・在庫・改善・物流へ順に広げます。" />
            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {learningSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="text-xs font-bold text-teal-700">STEP {index + 1}</span>
                  <p className="mt-2 font-bold text-slate-900">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title="既存ページから学び始める" description="生産管理の個別ページは今後拡充します。まずは関連する経営工学キーワードから学習できます。" />
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {linkGroups.map((group) => (
                <section key={group.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-bold text-slate-900">{group.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.links.map((link) => (
                      <Link key={link.href} href={link.href} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-teal-500">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold">技術士・QC・統計との関係</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <RelationCard title="QC・品質管理" description="生産管理の中で品質を安定させるために使います。QMS、管理図、工程能力、実験計画法は工程改善と品質保証に接続します。" />
              <RelationCard title="統計・データ分析" description="需要予測、工程能力、品質管理、改善効果検証に使います。データで現状を読み、施策の効果を確認する土台です。" />
              <RelationCard title="技術士 経営工学部門" description="生産管理の知識を、課題抽出・解決策・リスク・倫理・社会の持続可能性へ展開します。" />
              <RelationCard title="生産管理" description="需要、工程、在庫、設備、物流をつなぎ、QCDを安定的に実現する実務中核領域です。" />
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader title="今後拡充予定" description="生産管理は4本柱の1つとして、今後専用コンテンツを増やしていきます。" />
            <div className="mt-5 flex flex-wrap gap-2">
              {futureTopics.map((topic) => (
                <span key={topic} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                  {topic}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-teal-100 bg-teal-50 p-6">
            <h2 className="text-2xl font-bold text-teal-950">次に読むページ</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nextLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl border border-white bg-white px-4 py-3 text-sm font-bold text-teal-900 hover:border-teal-400">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function RelationCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
