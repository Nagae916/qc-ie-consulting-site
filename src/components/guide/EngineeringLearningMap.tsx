import Link from "next/link";

type Area = {
  title: string;
  summary: string;
  href: string;
};

type Step = {
  label: string;
  title: string;
  description: string;
};

type Route = {
  title: string;
  description: string;
  href: string;
};

type Tool = {
  title: string;
  description: string;
  href?: string;
  status: "available" | "planned";
};

const areas: Area[] = [
  {
    title: "品質管理・QMS",
    summary: "ばらつき、標準化、工程管理、QMS改善を扱う領域。",
    href: "/guides/qc",
  },
  {
    title: "生産管理・オペレーション",
    summary: "生産方式、在庫、PSI、物流、制約条件を扱う領域。",
    href: "/guides/engineer",
  },
  {
    title: "統計・データ分析",
    summary: "検定、回帰、管理図、データ活用を扱う領域。",
    href: "/guides/stat",
  },
  {
    title: "技術士演習・統合",
    summary: "課題分解、答案骨子、ケース演習で知識を統合する領域。",
    href: "/guides/engineer",
  },
];

const steps: Step[] = [
  {
    label: "STEP1",
    title: "基礎理解",
    description: "経営工学、品質管理、統計、生産管理の基本用語を押さえる。",
  },
  {
    label: "STEP2",
    title: "応用理解",
    description: "手法の使いどころ、前提条件、限界、分野間のつながりを整理する。",
  },
  {
    label: "STEP3",
    title: "実践統合",
    description: "技術士答案、QMS改善、現場課題の分解に知識を接続する。",
  },
];

const routes: Route[] = [
  {
    title: "統計検定",
    description: "記述統計、検定、回帰、データ分析の基礎から進める。",
    href: "/guides/stat",
  },
  {
    title: "QC検定",
    description: "QC七つ道具、管理図、工程能力、信頼性を中心に学ぶ。",
    href: "/guides/qc",
  },
  {
    title: "生産管理",
    description: "PSI、在庫、工程、制約条件、オペレーションをつなげる。",
    href: "/guides/engineer",
  },
  {
    title: "技術士",
    description: "経営工学のキーワードを答案骨子とケース演習へ接続する。",
    href: "/guides/engineer",
  },
  {
    title: "QMS改善",
    description: "品質管理の知識を標準化、監査、改善活動に展開する。",
    href: "/guides/qc",
  },
];

const tools: Tool[] = [
  {
    title: "Cp/Cpkシミュレーター",
    description: "工程能力と規格幅の関係を数値で確認する教材。",
    status: "planned",
  },
  {
    title: "χ二乗検定インタラクティブ表",
    description: "クロス集計から期待度数と検定結果を確認する教材。",
    href: "/tools/chi-square",
    status: "available",
  },
  {
    title: "管理図シミュレーター",
    description: "工程が安定しているかを時系列データで確認する教材。",
    href: "/tools/control-chart",
    status: "available",
  },
  {
    title: "技術士ケース演習ジェネレーター",
    description: "経営工学のキーワードをケース問題に変換する教材。",
    status: "planned",
  },
  {
    title: "課題分解マトリクス",
    description: "現場課題を品質・コスト・納期・リスクに分解する教材。",
    status: "planned",
  },
  {
    title: "答案骨子ビルダー",
    description: "課題、原因、対策、効果を技術士答案の骨子に整理する教材。",
    status: "planned",
  },
];

export default function EngineeringLearningMap() {
  return (
    <div className="space-y-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">ENGINEERING MANAGEMENT</p>
        <h1 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
          経営工学 学習マップ
        </h1>
        <p className="mt-3 text-lg font-semibold text-slate-700">
          品質管理・生産管理・統計・技術士演習をつなげて学ぶ
        </p>
        <p className="mt-5 max-w-3xl leading-8 text-slate-600">
          経営工学を中心に、品質管理、生産管理、統計、技術士演習をつなげて学ぶためのページです。
          試験対策を入口にしながら、本質理解と現場改善・QMS改善まで接続します。
        </p>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold text-teal-700">MAP</p>
          <h2 className="text-2xl font-bold text-slate-900">全体像マップ</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
          <div className="space-y-4">
            {areas.slice(0, 2).map((area) => (
              <AreaCard key={area.title} area={area} />
            ))}
          </div>
          <div className="grid place-items-center rounded-lg border border-teal-200 bg-teal-50 p-6 text-center">
            <div>
              <p className="text-sm font-semibold text-teal-700">CENTER</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900">経営工学</h3>
              <p className="mt-3 leading-7 text-slate-600">
                現場課題を、品質・生産・データ・人の仕組みで解くための軸。
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {areas.slice(2).map((area) => (
              <AreaCard key={area.title} area={area} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold text-teal-700">STEPS</p>
          <h2 className="text-2xl font-bold text-slate-900">学習ステップ</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.label} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="text-sm font-bold text-teal-700">{step.label}</div>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold text-teal-700">ROUTES</p>
          <h2 className="text-2xl font-bold text-slate-900">目的別おすすめルート</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <Link key={route.title} href={route.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
              <h3 className="font-bold text-slate-900">{route.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{route.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold text-teal-700">TOOLS</p>
          <h2 className="text-2xl font-bold text-slate-900">触って学べる教材</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) =>
            tool.href ? (
              <Link key={tool.title} href={tool.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <ToolContent tool={tool} />
              </Link>
            ) : (
              <div key={tool.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <ToolContent tool={tool} />
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

function AreaCard({ area }: { area: Area }) {
  return (
    <Link href={area.href} className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
      <h3 className="font-bold text-slate-900">{area.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{area.summary}</p>
    </Link>
  );
}

function ToolContent({ tool }: { tool: Tool }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-slate-900">{tool.title}</h3>
        <span className={tool.status === "available" ? "rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700" : "rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500"}>
          {tool.status === "available" ? "利用可" : "準備中"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
    </>
  );
}
