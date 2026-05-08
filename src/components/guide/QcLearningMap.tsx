type Status = "published" | "planned";

type Step = {
  step: string;
  title: string;
  description: string;
  href?: string;
  status: Status;
};

type Route = {
  title: string;
  description: string;
  items: string;
};

const learningSteps: Step[] = [
  {
    step: "STEP 1",
    title: "品質管理の基本",
    description: "品質を作り込む考え方、管理対象、現場で見るべきデータを整理します。",
    href: "/guides/qc/daily-management",
    status: "published",
  },
  {
    step: "STEP 2",
    title: "QC七つ道具・新QC七つ道具",
    description: "事実を見える化し、原因追究や合意形成につなげる道具を押さえます。",
    href: "/guides/qc/qc-seven-tools",
    status: "published",
  },
  {
    step: "STEP 3",
    title: "管理図・工程能力",
    description: "工程の安定性と規格を満たす力を、ばらつきから判断します。",
    href: "/guides/stat/process-capability",
    status: "published",
  },
  {
    step: "STEP 4",
    title: "抜取検査・OC曲線",
    description: "検査で受け入れているリスクを理解し、検査設計に接続します。",
    href: "/guides/qc/oc-curve",
    status: "published",
  },
  {
    step: "STEP 5",
    title: "実験計画法・信頼性工学",
    description: "要因の影響を整理し、条件設計や信頼性向上に活かします。",
    href: "/guides/qc/design-of-experiments-basic",
    status: "published",
  },
  {
    step: "STEP 6",
    title: "品質マネジメント・QMS改善",
    description: "是正処置、標準化、内部監査を仕組みの改善につなげます。",
    href: "/guides/engineer/tqm",
    status: "published",
  },
  {
    step: "STEP 7",
    title: "技術士答案・実務改善への活用",
    description: "品質課題を、課題抽出、解決策、リスク、倫理へ展開します。",
    href: "/guides/engineer/second-exam-roadmap",
    status: "published",
  },
];

const routes: Route[] = [
  {
    title: "QC検定1級ルート",
    description: "品質管理手法と統計的品質管理を体系的に押さえるルートです。",
    items: "QC七つ道具、管理図、工程能力、実験計画法",
  },
  {
    title: "実務品質管理ルート",
    description: "日常管理から不良低減、標準化、再発防止へつなげるルートです。",
    items: "日常管理、原因分析、是正処置、標準化",
  },
  {
    title: "QMS改善ルート",
    description: "品質マネジメントを、監査や仕組みの改善に接続するルートです。",
    items: "TQM、内部監査、CAPA、QMS再構築",
  },
  {
    title: "技術士・経営工学ルート",
    description: "品質課題を経営工学の課題解決と答案構成に展開するルートです。",
    items: "品質課題、QMS改善、リスク、倫理",
  },
];

const interactiveMaterials: Step[] = [
  { step: "教材", title: "管理図シミュレーター", description: "工程の安定状態と異常兆候を確認します。", href: "/tools/control-chart", status: "published" },
  { step: "教材", title: "Cp/Cpkシミュレーター", description: "規格幅、平均、ばらつきから工程能力を理解します。", href: "/guides/stat/cp-cpk", status: "published" },
  { step: "教材", title: "OC曲線", description: "抜取検査の生産者危険と消費者危険を確認します。", href: "/guides/qc/oc-curve", status: "published" },
  { step: "教材", title: "実験計画法", description: "要因と水準から効果を整理する入口です。", href: "/guides/qc/design-of-experiments-basic", status: "published" },
  { step: "教材", title: "FMEA", description: "故障モード、影響、対策を整理する教材です。", href: "/guides/engineer/fmea", status: "published" },
  { step: "教材", title: "QMS改善ワーク", description: "監査・是正処置・標準化をつなぐ演習です。", status: "planned" },
];

const relatedLinks = [
  { title: "経営工学 学習マップ", href: "/guides/engineer/learning-map" },
  { title: "技術士二次試験ロードマップ", href: "/guides/engineer/second-exam-roadmap" },
  { title: "統計・データ分析 学習ロードマップ", href: "/guides/stat/learning-map" },
];

function StatusBadge({ status }: { status: Status }) {
  if (status === "planned") {
    return <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">準備中</span>;
  }

  return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">公開中</span>;
}

function LearningCard({ item }: { item: Step }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">{item.step}</span>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
    </>
  );

  if (item.status === "planned" || !item.href) {
    return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">{body}</div>;
  }

  return (
    <a href={item.href} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md">
      {body}
    </a>
  );
}

export default function QcLearningMap() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-amber-700">品質管理・QMSの入口</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">品質管理・QMS 学習ロードマップ</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          QC検定1級、品質管理、品質マネジメント、QMS改善、技術士答案をつなげて学ぶためのページです。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">学習ステップ</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningSteps.map((step) => (
            <LearningCard key={step.title} item={step} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">目的別ルート</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {routes.map((route) => (
            <article key={route.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">{route.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{route.description}</p>
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700">{route.items}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">触って学ぶ教材</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interactiveMaterials.map((item) => (
            <LearningCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">関連導線</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {relatedLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md">
              <span className="font-bold text-amber-800">{link.title}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
