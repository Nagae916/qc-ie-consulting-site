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
    title: "記述統計",
    description: "平均、中央値、分散、標準偏差、ヒストグラムでデータの全体像を読みます。",
    href: "/guides/stat/descriptive-statistics",
    status: "published",
  },
  {
    step: "STEP 2",
    title: "確率分布",
    description: "正規分布、二項分布、ポアソン分布を品質や需要のばらつきに接続します。",
    href: "/guides/stat/normal-distribution",
    status: "published",
  },
  {
    step: "STEP 3",
    title: "推定・検定",
    description: "標本から母集団を推測し、改善効果や差の有無を判断します。",
    href: "/guides/stat/hypothesis-testing",
    status: "published",
  },
  {
    step: "STEP 4",
    title: "回帰分析・分散分析",
    description: "要因と結果の関係、複数群の差、共変量調整を品質改善や経営工学の仮説検証に使います。",
    href: "/guides/stat/anova",
    status: "published",
  },
  {
    step: "STEP 5",
    title: "多変量解析・機械学習入門",
    description: "主成分分析、分類指標、交差検証など、データ分析の入口を押さえます。",
    href: "/guides/stat/principal-component-analysis",
    status: "published",
  },
  {
    step: "STEP 6",
    title: "品質データ分析・技術士答案への活用",
    description: "統計を工程能力、効果検証、品質改善、技術士答案の根拠づけに使います。",
    href: "/guides/qc/stat-methods",
    status: "published",
  },
];

const routes: Route[] = [
  {
    title: "統計検定ルート",
    description: "記述統計、分布、推定・検定、回帰を順に固めるルートです。",
    items: "記述統計、確率分布、検定、回帰分析",
  },
  {
    title: "データサイエンティスト検定ルート",
    description: "前処理、評価指標、機械学習の基本へ広げるルートです。",
    items: "前処理、分類指標、ROC、交差検証",
  },
  {
    title: "品質データ分析ルート",
    description: "ばらつき、工程能力、管理図、検査設計へ接続するルートです。",
    items: "工程能力、管理図、検定、相関・回帰",
  },
  {
    title: "技術士・経営工学ルート",
    description: "データを根拠にして、課題設定と改善効果を説明するルートです。",
    items: "効果検証、品質改善、DX、意思決定",
  },
];

const interactiveMaterials: Step[] = [
  { step: "教材", title: "χ二乗検定", description: "カテゴリデータの偏りや独立性を確認します。", href: "/tools/chi-square", status: "published" },
  { step: "教材", title: "信頼区間", description: "推定値の不確かさを幅で理解します。", href: "/guides/stat/confidence-interval", status: "published" },
  { step: "教材", title: "回帰分析", description: "要因と結果の関係をモデルで見ます。", href: "/tools/simple-linear-regression", status: "published" },
  { step: "教材", title: "分散分析", description: "複数群の差を整理します。", href: "/guides/stat/anova", status: "published" },
  { step: "教材", title: "共分散分析", description: "共変量を調整して群間差を比較します。", href: "/guides/stat/ancova", status: "published" },
  { step: "教材", title: "MMRM", description: "複数時点データの群間差を整理します。", href: "/guides/stat/mmrm", status: "published" },
  { step: "教材", title: "混同行列・ROC", description: "分類モデルの良し悪しを評価します。", href: "/guides/stat/confusion-matrix", status: "published" },
  { step: "教材", title: "品質データ分析ワーク", description: "工程データから改善仮説を作る教材です。", status: "planned" },
];

const relatedLinks = [
  { title: "経営工学 学習マップ", href: "/guides/engineer/learning-map" },
  { title: "技術士二次試験ロードマップ", href: "/guides/engineer/second-exam-roadmap" },
  { title: "品質管理・QMS 学習ロードマップ", href: "/guides/qc/learning-map" },
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
    <a href={item.href} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-400 hover:shadow-md">
      {body}
    </a>
  );
}

export default function StatLearningMap() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-sky-700">統計・データ分析の入口</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">統計・データ分析 学習ロードマップ</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          統計を試験対策だけで終わらせず、品質改善、経営工学、技術士答案の根拠づけに接続するためのページです。
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
            <a key={link.href} href={link.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-400 hover:shadow-md">
              <span className="font-bold text-sky-800">{link.title}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
