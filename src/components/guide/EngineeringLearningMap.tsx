'use client';

type StepStatus = 'published' | 'planned' | 'draft' | 'missing';

type RouteStep = {
  title: string;
  description: string;
  href: string;
  status: StepStatus;
};

type LearningRoute = {
  title: string;
  description: string;
  steps: RouteStep[];
};

type Field = {
  title: string;
  description: string;
  themes: string;
  relation: string;
};

const fields: Field[] = [
  {
    title: '品質管理・QMS',
    description: '工程を安定させ、再発防止と標準化につなげる領域。',
    themes: 'QC七つ道具、管理図、工程能力、是正処置、QMS改善',
    relation: 'QC検定、品質保証、内部監査、現場改善',
  },
  {
    title: '生産管理・オペレーション',
    description: '需要、在庫、設備、人をつなげて、流れと能力を設計する領域。',
    themes: '生産方式、工程管理、在庫管理、ラインバランシング、TOC',
    relation: '技術士二次、工場運営、生産性改善、物流改善',
  },
  {
    title: '統計・データ分析',
    description: 'ばらつきや関係性を読み取り、判断の根拠を作る領域。',
    themes: '記述統計、推定・検定、回帰分析、分散分析、品質データ分析',
    relation: '統計検定、データサイエンス、品質解析、工程解析',
  },
  {
    title: '技術士演習・統合',
    description: '複数分野を統合し、課題抽出から答案構成までつなげる領域。',
    themes: '課題抽出、解決策、リスク、倫理、答案骨子、白書活用',
    relation: '技術士二次、論文答案、実務課題の整理',
  },
];

const learningRoutes: LearningRoute[] = [
  {
    title: '統計検定ルート',
    description: '統計の基礎から品質データ分析まで、判断の根拠を作る流れです。',
    steps: [
      {
        title: '統計の基本',
        description: '母集団、標本、平均、分散など、データを見るための土台を確認します。',
        href: '/guides/stat/descriptive-statistics',
        status: 'published',
      },
      {
        title: '推定・検定',
        description: '偶然のばらつきと意味のある差を区別する考え方を学びます。',
        href: '/guides/stat/hypothesis-testing',
        status: 'published',
      },
      {
        title: '回帰分析・分散分析',
        description: '要因と結果の関係を整理し、品質や工程の改善仮説につなげます。',
        href: '/guides/qc/regression-anova',
        status: 'published',
      },
      {
        title: '品質データ分析への接続',
        description: '統計を工程能力、管理図、検査設計などの実務判断に接続します。',
        href: '/guides/qc/stat-methods',
        status: 'published',
      },
    ],
  },
  {
    title: 'QC検定ルート',
    description: '品質管理の基本から、工程管理とQMS改善へつなげるルートです。',
    steps: [
      {
        title: '品質管理の基本',
        description: '品質を作り込む考え方と、現場で見るべき管理対象を整理します。',
        href: '/guides/qc/daily-management',
        status: 'published',
      },
      {
        title: 'QC七つ道具',
        description: '数値データや不良現象を見える化し、原因追究の入口を作ります。',
        href: '/guides/qc/qc-seven-tools',
        status: 'published',
      },
      {
        title: '管理図・工程能力',
        description: '工程が安定しているか、規格を満たせる能力があるかを確認します。',
        href: '/guides/stat/process-capability',
        status: 'published',
      },
      {
        title: 'OC曲線・抜取検査',
        description: '検査でどの程度のリスクを受け入れているかを把握します。',
        href: '/guides/qc/oc-curve',
        status: 'published',
      },
      {
        title: 'QMS改善への接続',
        description: '是正処置、標準化、内部監査の改善へ品質管理を接続します。',
        href: '/guides/engineer/qms-improvement',
        status: 'planned',
      },
    ],
  },
  {
    title: '生産管理ルート',
    description: '生産方式、在庫、能力、全体最適を段階的に押さえるルートです。',
    steps: [
      {
        title: '生産方式',
        description: 'MTS、ATO、MTO、ETOなど、生産の基本パターンを整理します。',
        href: '/guides/engineer/production-modes',
        status: 'published',
      },
      {
        title: '工程管理',
        description: '工程の流れ、能力、標準時間を見て、改善対象を明確にします。',
        href: '/guides/engineer/production-planning',
        status: 'published',
      },
      {
        title: '在庫管理',
        description: '安全在庫、発注量、需要変動を見ながら欠品と過剰在庫を防ぎます。',
        href: '/guides/engineer/inventory-management',
        status: 'published',
      },
      {
        title: 'ラインバランシング',
        description: '作業配分とボトルネックを整理し、ライン全体の流れを整えます。',
        href: '/guides/engineer/line-balancing',
        status: 'published',
      },
      {
        title: '全体最適・TOC',
        description: '制約条件に注目し、部分最適ではなく全体の成果を高めます。',
        href: '/guides/engineer/toc',
        status: 'published',
      },
    ],
  },
  {
    title: '技術士二次ルート',
    description: '経営工学の全体像から、課題抽出、答案骨子、背景情報までつなげます。',
    steps: [
      {
        title: '技術士第一次試験ロードマップ',
        description: '基礎科目・適性科目・専門科目を整理し、経営工学と第二次試験につなげる入口ページです。',
        href: '/guides/engineer/first-exam-roadmap',
        status: 'published',
      },
      {
        title: '経営工学の全体像',
        description: '品質、統計、生産管理、技術士答案の関係を学習マップで確認します。',
        href: '/guides/engineer/learning-map',
        status: 'published',
      },
      {
        title: '課題抽出',
        description: '多面的な観点から課題を比較し、最重要課題を選定する練習をします。',
        href: '/guides/engineer/issue-decomposition-matrix',
        status: 'published',
      },
      {
        title: '解決策・リスク整理',
        description: '解決策、リスク、倫理、持続可能性を答案構成に落とし込みます。',
        href: '/guides/engineer/risk-management',
        status: 'published',
      },
      {
        title: '白書情報の活用',
        description: '一次情報や白書を使い、課題の背景に説得力を持たせます。',
        href: '/guides/engineer/white-paper-board',
        status: 'planned',
      },
      {
        title: '答案骨子作成',
        description: '設問要求に合わせて、課題、解決策、リスクを骨子化します。',
        href: '/guides/engineer/answer-structure-builder',
        status: 'published',
      },
    ],
  },
  {
    title: 'QMS改善ルート',
    description: '品質マネジメントを、現場改善と経営課題に接続するルートです。',
    steps: [
      {
        title: '品質マネジメントの基本',
        description: 'QMSを文書管理ではなく、改善を回す仕組みとして理解します。',
        href: '/guides/engineer/tqm',
        status: 'published',
      },
      {
        title: '工程管理・品質KPI',
        description: '工程の安定、不良率、再発率などを改善指標として整理します。',
        href: '/guides/qc/stat-methods',
        status: 'published',
      },
      {
        title: '是正処置・予防処置',
        description: '原因追究と再発防止を、仕組みの改善に接続します。',
        href: '/guides/engineer/capa',
        status: 'planned',
      },
      {
        title: '内部監査の改善',
        description: '監査を指摘活動で終わらせず、プロセス改善につなげます。',
        href: '/guides/engineer/internal-audit',
        status: 'planned',
      },
      {
        title: 'QMS再構築',
        description: '事業環境やDXに合わせ、QMSの運用を再設計します。',
        href: '/guides/engineer/qms-redesign',
        status: 'planned',
      },
    ],
  },
];

const engineerExamSteps: RouteStep[] = [
  {
    title: '経営工学の全体像を確認する',
    description: 'まず分野間のつながりを見て、どこから学ぶべきかを把握します。',
    href: '/guides/engineer/learning-map',
    status: 'published',
  },
  {
    title: '頻出テーマを整理する',
    description: '生産管理、品質管理、統計、DX、サプライチェーンなどの頻出語を押さえます。',
    href: '/guides/engineer/past-exam-trend-map',
    status: 'published',
  },
  {
    title: '課題分解マトリクスで課題抽出を練習する',
    description: '多面的な課題抽出と、最重要課題の選定を操作しながら練習します。',
    href: '/guides/engineer/issue-decomposition-matrix',
    status: 'published',
  },
  {
    title: '答案骨子ビルダーで構成を作る',
    description: '設問要求に合わせて、課題、解決策、リスク、倫理を骨子化します。',
    href: '/guides/engineer/answer-structure-builder',
    status: 'published',
  },
  {
    title: '600字答案で短くまとめる',
    description: '短い字数で、論点を落とさず説明する練習をします。',
    href: '/guides/engineer/short-answer-600',
    status: 'planned',
  },
  {
    title: '1800字答案で展開する',
    description: '課題、解決策、リスク、持続可能性を一貫した論文に展開します。',
    href: '/guides/engineer/essay-1800',
    status: 'planned',
  },
  {
    title: '白書・一次情報で背景を補強する',
    description: '白書や公的情報を使い、課題設定の社会的背景を補強します。',
    href: '/guides/engineer/white-paper-board',
    status: 'planned',
  },
];

const interactiveMaterials: RouteStep[] = [
  {
    title: 'Cp/Cpkシミュレーター',
    description: '規格幅、平均、ばらつきを動かして工程能力を確認します。',
    href: '/guides/stat/cp-cpk',
    status: 'published',
  },
  {
    title: 'χ二乗検定インタラクティブ表',
    description: 'カテゴリデータの偏りや独立性を、表を動かして理解します。',
    href: '/tools/chi-square',
    status: 'published',
  },
  {
    title: '管理図シミュレーター',
    description: '工程の安定状態と異常兆候を、点の動きから確認します。',
    href: '/tools/control-chart',
    status: 'published',
  },
  {
    title: '技術士第一次試験ロードマップ',
    description: '基礎科目・適性科目・専門科目を整理し、経営工学と第二次試験につなげる入口ページです。',
    href: '/guides/engineer/first-exam-roadmap',
    status: 'published',
  },
  {
    title: '技術士 経営工学 過去問トレンドマップ',
    description: '過去問の出題傾向をテーマ・設問パターン別に整理し、答案骨子作成につなげるページです。',
    href: '/guides/engineer/past-exam-trend-map',
    status: 'published',
  },
  {
    title: '課題分解マトリクス',
    description: '技術士二次で使う多面的な課題抽出を練習します。',
    href: '/guides/engineer/issue-decomposition-matrix',
    status: 'published',
  },
  {
    title: '技術士ケース演習ジェネレーター',
    description: 'テーマに応じて、設問と論点を生成する教材です。',
    href: '/guides/engineer/case-generator',
    status: 'planned',
  },
  {
    title: '答案骨子ビルダー',
    description: '課題、解決策、リスク、倫理を答案骨子にまとめる教材です。',
    href: '/guides/engineer/answer-structure-builder',
    status: 'published',
  },
  {
    title: '白書アップデートボード',
    description: '白書や公的機関の情報を、答案背景として使いやすく整理します。',
    href: '/guides/engineer/white-paper-board',
    status: 'planned',
  },
];

function statusLabel(status: StepStatus) {
  if (status === 'published') return '公開中';
  if (status === 'planned') return '準備中';
  if (status === 'draft') return '下書き';
  return '未作成';
}

function statusClassName(status: StepStatus) {
  if (status === 'published') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (status === 'planned') return 'border-amber-200 bg-amber-50 text-amber-800';
  if (status === 'draft') return 'border-sky-200 bg-sky-50 text-sky-800';
  return 'border-slate-200 bg-slate-100 text-slate-600';
}

function StatusBadge({ status }: { status: StepStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassName(status)}`}>
      {statusLabel(status)}
    </span>
  );
}

function StepCard({ step, index }: { step: RouteStep; index: number }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">STEP {index + 1}</span>
        <StatusBadge status={step.status} />
      </div>
      <h4 className="mt-3 text-base font-bold text-slate-950">{step.title}</h4>
      <p className="mt-2 text-sm leading-7 text-slate-700">{step.description}</p>
    </>
  );

  if (step.status !== 'published') {
    return <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-90">{body}</div>;
  }

  return (
    <a href={step.href} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md">
      {body}
    </a>
  );
}

function MaterialCard({ material }: { material: RouteStep }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-base font-bold text-slate-950">{material.title}</h4>
        <StatusBadge status={material.status} />
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-700">{material.description}</p>
    </>
  );

  if (material.status !== 'published') {
    return <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">{content}</div>;
  }

  return (
    <a href={material.href} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
      {content}
    </a>
  );
}

export default function EngineeringLearningMap() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">n-ie-qclab learning map</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">経営工学 学習マップ</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          品質管理・生産管理・統計・技術士演習をつなげて学ぶための入口ページです。
          試験対策を入口にしながら、本質理解と現場改善・QMS改善まで接続します。
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="text-xl font-bold">このページの使い方</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          まず中央の「経営工学」を軸に4領域の関係を確認し、次に目的別ルートから今の学習目的に合う入口を選んでください。
          技術士二次を目指す場合は、下のおすすめ学習順に沿って、課題抽出から答案骨子まで進める構成です。
        </p>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">全体像マップ</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">経営工学を中心に、試験対策と実務改善をつなぐ4つの領域として整理します。</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px_minmax(0,1fr)]">
          <div className="space-y-5">
            {fields.slice(0, 2).map((field) => (
              <FieldCard key={field.title} field={field} />
            ))}
          </div>
          <div className="flex min-h-56 items-center justify-center rounded-2xl border-2 border-emerald-600 bg-white p-6 text-center shadow-sm">
            <div>
              <p className="text-sm font-semibold text-emerald-700">中心軸</p>
              <p className="mt-2 text-3xl font-bold">経営工学</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">品質・生産・統計・人と組織をつなげ、現場と経営の意思決定を支える考え方。</p>
            </div>
          </div>
          <div className="space-y-5">
            {fields.slice(2).map((field) => (
              <FieldCard key={field.title} field={field} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">目的別おすすめルート</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">公開済みのステップはリンクとして開けます。準備中の項目も、今後の学習導線として見えるように残しています。</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {learningRoutes.map((route) => (
            <section key={route.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">{route.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{route.description}</p>
              <div className="mt-4 space-y-3">
                {route.steps.map((step, index) => (
                  <StepCard key={`${route.title}-${step.title}`} step={step} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-2xl font-bold">技術士二次試験までのおすすめ学習順</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            技術士二次試験に向けて、経営工学の全体像から課題抽出、答案骨子作成、白書活用まで段階的に学ぶためのルートです。
          </p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {engineerExamSteps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">触って学べる教材</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">数値や課題を動かしながら、概念を自分の言葉に変えるための教材です。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interactiveMaterials.map((material) => (
            <MaterialCard key={material.title} material={material} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FieldCard({ field }: { field: Field }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-bold">{field.title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{field.description}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-slate-950">主なテーマ</dt>
          <dd className="mt-1 leading-7 text-slate-700">{field.themes}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-950">関連する試験・実務</dt>
          <dd className="mt-1 leading-7 text-slate-700">{field.relation}</dd>
        </div>
      </dl>
    </article>
  );
}
