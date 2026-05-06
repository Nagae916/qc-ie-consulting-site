const basicCategories = [
  {
    title: '設計・計画',
    description: '要求を整理し、制約条件の中で目的を満たす案を考える分野。',
    connection: '経営工学では、工程設計、品質計画、改善計画、投資判断につながります。',
    planned: '設計思考、QCD、制約条件、改善計画',
  },
  {
    title: '情報・論理',
    description: '情報処理、論理的思考、アルゴリズム、データの扱いを学ぶ分野。',
    connection: '統計、データ分析、DX、品質データ活用の入口になります。',
    planned: 'データ活用、情報セキュリティ、論理思考',
  },
  {
    title: '解析',
    description: '数理的に現象を捉え、原因や関係性を説明する分野。',
    connection: '統計、OR、工程能力、効果検証、品質改善に接続します。',
    planned: '統計基礎、推定・検定、最適化、シミュレーション',
  },
  {
    title: '材料・化学・バイオ',
    description: 'ものづくりの基盤となる材料、化学、生命科学の基礎を扱う分野。',
    connection: '品質特性、製造条件、工程異常、製品安全を理解する土台になります。',
    planned: '品質特性、工程条件、製品安全',
  },
  {
    title: '環境・エネルギー・技術',
    description: '環境負荷、エネルギー、技術と社会の関係を扱う分野。',
    connection: '脱炭素、GX、持続可能性、技術者倫理の論点に接続します。',
    planned: 'GX、脱炭素、環境マネジメント、持続可能性',
  },
];

const aptitudeItems = ['信用失墜行為の禁止', '秘密保持', '公益確保', '資質向上', '名称表示', '技術者倫理'];

const specialistCategories = [
  {
    title: '品質管理',
    first: 'QC七つ道具、管理図、工程能力、品質保証の基本を押さえる。',
    second: 'QMS再構築、品質課題、工程管理、是正処置の論点として使う。',
    category: '品質管理・QMS',
  },
  {
    title: '生産管理',
    first: '生産方式、工程管理、日程計画、生産性の基本を押さえる。',
    second: '生産性向上、物流改革、在庫最適化、全体最適の論点として使う。',
    category: '生産管理・オペレーション',
  },
  {
    title: 'IE',
    first: '作業研究、時間研究、標準作業、ECRSを押さえる。',
    second: '作業改善、標準化、ラインバランシング、人材育成に接続する。',
    category: 'IE・現場改善',
  },
  {
    title: 'OR',
    first: '最適化、待ち行列、シミュレーション、意思決定の基礎を押さえる。',
    second: '制約条件、全体最適、投資判断、物流設計に使う。',
    category: 'OR・意思決定',
  },
  {
    title: '統計・データ分析',
    first: '記述統計、推定、検定、回帰、分散の基本を押さえる。',
    second: 'データ活用、効果検証、品質改善、DXの根拠づけに使う。',
    category: '統計・データ分析',
  },
  {
    title: '物流・在庫管理',
    first: '在庫、発注、物流、サプライチェーンの基本を押さえる。',
    second: '物流効率化、物流2024年問題、サプライチェーン強靭化に接続する。',
    category: '物流・在庫管理',
  },
  {
    title: 'サービスマネジメント',
    first: 'サービス品質、顧客価値、サービス提供プロセスを押さえる。',
    second: 'サービス品質、業務プロセス改善、顧客価値向上の論点として使う。',
    category: 'サービスマネジメント',
  },
  {
    title: '経営管理',
    first: '経営資源、KPI、投資判断、組織運営の基本を押さえる。',
    second: '経営効果、人的資本、リスク、持続可能性の論点に接続する。',
    category: '経営管理',
  },
];

const connectionRows = [
  ['品質管理', 'QMS再構築・品質課題・工程管理'],
  ['生産管理', '生産性向上・物流改革・在庫最適化'],
  ['IE', '作業改善・標準化・ラインバランシング'],
  ['OR', '最適化・制約条件・全体最適'],
  ['統計', 'データ活用・効果検証・品質改善'],
  ['適性科目', '技術者倫理・公益確保・社会の持続可能性'],
] as const;

const nextLinks = [
  { title: '経営工学 学習マップ', href: '/guides/engineer/learning-map' },
  { title: '技術士第二次試験 過去問トレンドマップ', href: '/guides/engineer/past-exam-trend-map' },
  { title: '課題分解マトリクス', href: '/guides/engineer/issue-decomposition-matrix' },
  { title: '答案骨子ビルダー', href: '/guides/engineer/answer-structure-builder' },
];

export default function FirstExamRoadmap() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">技術士試験の入口</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">技術士第一次試験ロードマップ</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          技術士第一次試験は、基礎科目・適性科目・専門科目の3科目で構成されます。このページでは、それぞれの学習範囲を整理し、経営工学部門の専門科目対策と、第二次試験への接続を示します。
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <h2 className="text-xl font-bold">このページの位置づけ</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            '第一次試験は、技術士として必要な基礎知識を確認する試験です。',
            '本サイトでは、第一次試験を「経営工学を学ぶ入口」として整理します。',
            '詳細な合格体験記や教材の使い方はnoteで整理予定です。',
            'サイトでは、基礎・適性・専門を学習カテゴリとして整理し、第二次試験へ接続します。',
          ].map((item) => (
            <p key={item} className="rounded-xl border border-emerald-200 bg-white p-4 text-sm leading-7 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">試験全体像</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <OverviewCard title="基礎科目" text="技術者に必要な基礎的な科学技術知識を問う科目。" />
          <OverviewCard title="適性科目" text="技術者倫理、技術士法上の義務、公益確保などを問う科目。" />
          <OverviewCard title="専門科目" text="選択した技術部門の基礎・専門知識を問う科目。経営工学部門では品質管理、生産管理、IE、OR、統計、サービスマネジメントなどが重要になります。" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">基礎科目カテゴリ</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {basicCategories.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.connection}</p>
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700">今後作成予定：{item.planned}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold">適性科目カテゴリ</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          適性科目は、第二次試験の「技術者倫理・社会の持続可能性」と直結します。単なる法令暗記ではなく、公益、説明責任、秘密保持、資質向上を実務判断に接続します。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {aptitudeItems.map((item) => (
            <span key={item} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">専門科目：経営工学カテゴリ</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {specialistCategories.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{item.category}</span>
              </div>
              <dl className="mt-4 space-y-3 text-sm leading-7">
                <div>
                  <dt className="font-bold text-slate-950">一次試験で押さえる意味</dt>
                  <dd className="text-slate-700">{item.first}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">二次試験での使い方</dt>
                  <dd className="text-slate-700">{item.second}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold">一次試験から二次試験への接続表</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {connectionRows.map(([first, second]) => (
            <div key={first} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-950">{first}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{second}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">3か月合格体験記について</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          第一次試験の合格体験記、使用教材、学習順、やらなくてよかった勉強については、noteで整理予定です。サイトでは学習範囲と二次試験への接続を中心に整理します。
        </p>
        <span className="mt-4 inline-flex rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-bold text-amber-800">note記事を準備中</span>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">第二次試験対策へ進む</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {nextLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
              <h3 className="text-lg font-bold">{link.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">一次試験の知識を、二次試験の課題解決と答案構成へ接続します。</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function OverviewCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{text}</p>
    </article>
  );
}
