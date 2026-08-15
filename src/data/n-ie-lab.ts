export type ThemeSlug = "quality" | "production" | "data" | "improvement";

export type ContentType =
  | "explanation"
  | "visual"
  | "simulation"
  | "tool"
  | "case-study"
  | "learning";

export type Difficulty = "introductory" | "practical" | "advanced";

export type ContentLink = {
  title: string;
  description: string;
  href: string;
  contentType: ContentType;
  difficulty: Difficulty;
  tags?: string[];
};

export type ThemeDefinition = {
  slug: ThemeSlug;
  title: string;
  description: string;
  question: string;
  introductory: ContentLink[];
  practical: ContentLink[];
  cases: ContentLink[];
  tools: ContentLink[];
  learning: ContentLink[];
  relatedThemes: ThemeSlug[];
};

export const siteIdentity = {
  name: "N-IE Lab",
  domain: "n-ie-qclab.com",
  siteUrl: "https://n-ie-qclab.com",
  message: "ものづくりは、仕組みが見えるともっと面白い。",
  subMessage:
    "品質、生産、データ、組織。製品が生まれ、安定して届けられるまでを、経営工学の視点から読み解きます。",
  description:
    "品質管理、生産管理、統計、改善を経営工学の視点から読み解く、製造業の若手・中堅実務者向け専門メディアです。",
} as const;

export const primaryNavigation = [
  { label: "テーマから探す", href: "/themes" },
  { label: "ケース", href: "/cases" },
  { label: "ツール", href: "/tools" },
  { label: "学びを深める", href: "/learn" },
  { label: "N-IE Labについて", href: "/about" },
] as const;

export const manufacturingQuestions = [
  {
    question: "品質規格は、何を根拠に決める？",
    answerHint: "顧客・法令・用途要求から、規格値、管理値、見直し条件を組み立てます。",
    href: "/guides/qc/how-to-set-quality-standards",
  },
  {
    question: "在庫は、本当に少ないほど良い？",
    answerHint: "欠品、リードタイム、需要変動、資金のバランスを生産の流れから考えます。",
    href: "/themes/production",
  },
  {
    question: "外部試験の数値を、どこまで信頼できる？",
    answerHint: "試料、方法、結果、判定の4層から、品質判断に使える条件を確認します。",
    href: "/guides/qc/third-party-testing-validity",
  },
] as const;

export const themes: ThemeDefinition[] = [
  {
    slug: "quality",
    title: "品質をつくる",
    description: "検査だけではなく、要求、工程、標準、判断の仕組みから品質を考えます。",
    question: "顧客が必要とする品質を、工程でどう再現し続けるか。",
    introductory: [
      {
        title: "QC七つ道具",
        description: "現場データを整理し、問題の姿を見えるようにする基本手法です。",
        href: "/guides/qc/qc-seven-tools",
        contentType: "explanation",
        difficulty: "introductory",
      },
      {
        title: "日常管理",
        description: "標準と異常対応を日々の管理へ組み込む考え方を確認します。",
        href: "/guides/qc/daily-management",
        contentType: "explanation",
        difficulty: "introductory",
      },
    ],
    practical: [
      {
        title: "WHYから考える品質問題解決",
        description: "手法を選ぶ前に、目的、要求、品質特性、評価尺度を整理します。",
        href: "/guides/qc/why-before-how-quality-problem-solving",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "品質規格は、どのように決めるのか",
        description: "要求と限られたデータから、規格値、管理値、見直し条件を設計します。",
        href: "/guides/qc/how-to-set-quality-standards",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "第三者試験の結果を、品質判断に使うための確認事項",
        description: "試料、方法、結果、判定を分け、外部データを使える条件を整理します。",
        href: "/guides/qc/third-party-testing-validity",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "工程能力",
        description: "規格と工程のばらつきから、安定して作れる状態かを判断します。",
        href: "/guides/engineer/process-capability",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "FMEA",
        description: "故障モードと影響を整理し、未然防止の優先順位を決めます。",
        href: "/guides/engineer/fmea",
        contentType: "explanation",
        difficulty: "practical",
      },
    ],
    cases: [
      {
        title: "実績ゼロから、品質規格をどう決めるか",
        description: "量産データがない段階の暫定規格と見直しプロセスを考えます。",
        href: "/cases/quality-standard-before-production",
        contentType: "case-study",
        difficulty: "advanced",
      },
      {
        title: "外部試験の結果を、そのまま信じてよいのか",
        description: "外部データを品質判断へ使うための妥当性確認を考えます。",
        href: "/cases/third-party-testing-validity",
        contentType: "case-study",
        difficulty: "advanced",
      },
    ],
    tools: [
      {
        title: "管理図ツール",
        description: "工程の安定状態と異常の兆候をサンプルデータで確認します。",
        href: "/tools/control-chart",
        contentType: "tool",
        difficulty: "practical",
      },
      {
        title: "OC曲線シミュレーター",
        description: "抜取検査の判定条件と生産者・消費者リスクを体感します。",
        href: "/tools/oc-simulator",
        contentType: "simulation",
        difficulty: "practical",
      },
    ],
    learning: [
      {
        title: "QC・品質管理ガイド",
        description: "QC検定を含む品質管理の体系へ進みます。",
        href: "/guides/qc",
        contentType: "learning",
        difficulty: "introductory",
      },
    ],
    relatedThemes: ["production", "data", "improvement"],
  },
  {
    slug: "production",
    title: "生産を整える",
    description: "人、設備、材料、時間の流れを整え、納期と生産性の関係を読み解きます。",
    question: "変動する需要に対して、人・設備・在庫をどう組み合わせるか。",
    introductory: [
      {
        title: "生産計画",
        description: "需要と能力をつなぎ、何をいつ作るかを決める基本を学びます。",
        href: "/guides/engineer/production-planning",
        contentType: "explanation",
        difficulty: "introductory",
      },
      {
        title: "在庫管理",
        description: "欠品と過剰在庫の両方を抑える考え方を整理します。",
        href: "/guides/engineer/inventory-management",
        contentType: "explanation",
        difficulty: "introductory",
      },
    ],
    practical: [
      {
        title: "S&OP",
        description: "販売・生産・在庫・経営判断を一つの計画へつなげます。",
        href: "/guides/engineer/s-and-op",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "GT（グループテクノロジー）",
        description: "類似部品をまとめ、工程・設備・標準を再利用する考え方を学びます。",
        href: "/guides/engineer/group-technology",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "OEE",
        description: "設備の停止、速度低下、不良を分けて改善機会を捉えます。",
        href: "/guides/engineer/oee",
        contentType: "explanation",
        difficulty: "practical",
      },
    ],
    cases: [],
    tools: [
      {
        title: "可用性シミュレーター",
        description: "MTBFとMTTRから、設備改善が稼働率へ与える影響を確認します。",
        href: "/tools/availability-simulator",
        contentType: "simulation",
        difficulty: "practical",
      },
    ],
    learning: [
      {
        title: "生産管理を体系的に学ぶ",
        description: "計画、工程、在庫、設備、SCMの入口です。",
        href: "/guides/production",
        contentType: "learning",
        difficulty: "introductory",
      },
    ],
    relatedThemes: ["quality", "data", "improvement"],
  },
  {
    slug: "data",
    title: "データで確かめる",
    description: "平均やグラフの先にある、ばらつき、比較、予測、意思決定を扱います。",
    question: "限られたデータから、何を言えて、何をまだ言えないか。",
    introductory: [
      {
        title: "記述統計",
        description: "平均、中央値、標準偏差からデータの全体像を読みます。",
        href: "/guides/stat/descriptive-statistics",
        contentType: "explanation",
        difficulty: "introductory",
      },
      {
        title: "データの種類と尺度",
        description: "データに合う可視化と分析方法を選ぶ土台を作ります。",
        href: "/guides/stat/data-types-and-scales",
        contentType: "explanation",
        difficulty: "introductory",
      },
    ],
    practical: [
      {
        title: "品質規格は、どのように決めるのか",
        description: "少ないデータを過信せず、暫定管理と見直しを組み合わせます。",
        href: "/guides/qc/how-to-set-quality-standards",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "第三者試験の結果を、品質判断に使うための確認事項",
        description: "数値の前提を確認し、測定結果を意思決定へつなげます。",
        href: "/guides/qc/third-party-testing-validity",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "仮説検定",
        description: "見えた差が偶然か、改善判断に使える差かを考えます。",
        href: "/guides/stat/hypothesis-testing",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "回帰分析",
        description: "要因と結果の関係を定量化し、予測と改善仮説へつなげます。",
        href: "/guides/stat/simple-linear-regression",
        contentType: "explanation",
        difficulty: "practical",
      },
    ],
    cases: [
      {
        title: "外部試験の結果を、そのまま信じてよいのか",
        description: "測定条件、試料、比較設計から外部データの質を確認します。",
        href: "/cases/third-party-testing-validity",
        contentType: "case-study",
        difficulty: "advanced",
      },
    ],
    tools: [
      {
        title: "単回帰分析ツール",
        description: "散布図、回帰直線、決定係数を一つの画面で確認します。",
        href: "/tools/simple-linear-regression",
        contentType: "tool",
        difficulty: "practical",
      },
      {
        title: "カイ二乗ツール",
        description: "カテゴリデータの関係と期待度数を順に確かめます。",
        href: "/tools/chi-square",
        contentType: "tool",
        difficulty: "practical",
      },
    ],
    learning: [
      {
        title: "統計・データ分析ガイド",
        description: "統計検定を含む体系的な学習へ進みます。",
        href: "/guides/stat",
        contentType: "learning",
        difficulty: "introductory",
      },
    ],
    relatedThemes: ["quality", "production", "improvement"],
  },
  {
    slug: "improvement",
    title: "改善を仕組みにする",
    description: "一時的な対策を、標準、教育、管理、組織の仕組みへ変えていきます。",
    question: "個人の工夫を、再現可能で続く仕組みへどう変えるか。",
    introductory: [
      {
        title: "PDCA",
        description: "仮説、実行、確認、標準化を改善の循環として捉えます。",
        href: "/guides/engineer/pdca",
        contentType: "explanation",
        difficulty: "introductory",
      },
      {
        title: "標準化",
        description: "改善結果を誰でも再現できる仕事の基準へ変えます。",
        href: "/guides/engineer/standardization",
        contentType: "explanation",
        difficulty: "introductory",
      },
    ],
    practical: [
      {
        title: "変更管理",
        description: "変更の影響、承認、教育、定着確認を一つのプロセスにします。",
        href: "/guides/engineer/change-management",
        contentType: "explanation",
        difficulty: "practical",
      },
      {
        title: "KPI管理",
        description: "目的と現場指標をつなぎ、改善が続く評価方法を考えます。",
        href: "/guides/engineer/kpi-management",
        contentType: "explanation",
        difficulty: "practical",
      },
    ],
    cases: [
      {
        title: "実績ゼロから、品質規格をどう決めるか",
        description: "暫定運用、データ蓄積、見直し条件を仕組みとして設計します。",
        href: "/cases/quality-standard-before-production",
        contentType: "case-study",
        difficulty: "advanced",
      },
    ],
    tools: [
      {
        title: "課題分解マトリクス",
        description: "複数の観点から課題を比較し、優先課題を整理します。",
        href: "/guides/engineer/issue-decomposition-matrix",
        contentType: "tool",
        difficulty: "practical",
      },
    ],
    learning: [
      {
        title: "経営工学の学習マップ",
        description: "品質、生産、データ、組織を横断して学びます。",
        href: "/guides/engineer/learning-map",
        contentType: "learning",
        difficulty: "introductory",
      },
    ],
    relatedThemes: ["quality", "production", "data"],
  },
];

export const homeToolHrefs = [
  "/tools/control-chart",
  "/tools/oc-simulator",
  "/tools/availability-simulator",
  "/tools/simple-linear-regression",
] as const;

export const featuredGuideHrefs = [
  "/guides/qc/daily-management",
  "/guides/engineer/production-planning",
  "/guides/stat/descriptive-statistics",
  "/guides/engineer/standardization",
] as const;

export const learningAreas = [
  {
    title: "技術士",
    description: "経営工学の知識を、課題分析と提案へつなげます。",
    href: "/guides/engineer",
  },
  {
    title: "QC検定",
    description: "品質管理の基本手法と判断の土台を体系的に学びます。",
    href: "/guides/qc",
  },
  {
    title: "統計検定",
    description: "データを読み、比較し、判断するための数理を学びます。",
    href: "/guides/stat",
  },
  {
    title: "生産オペレーション",
    description: "計画、工程、在庫、設備、物流を一つの流れで学びます。",
    href: "/guides/production",
  },
  {
    title: "TES",
    description: "繊維製品の品質、評価、ものづくりを関連テーマから深めます。",
    href: "/learn#tes",
  },
] as const;

export const homeCtas = [
  {
    title: "テーマから記事を探す",
    description: "品質、生産、データ、改善の4つの視点から始めます。",
    href: "/themes",
  },
  {
    title: "ケースとプロフィールを見る",
    description: "判断の進め方と、N-IE Labが扱う専門領域を確認します。",
    href: "/cases",
  },
  {
    title: "相談できる内容を見る",
    description: "品質規格、評価設計、研修、図解・ツール化の支援領域です。",
    href: "/services",
  },
] as const;

export const getTheme = (slug: string) => themes.find((theme) => theme.slug === slug);

export const contentTypeLabels: Record<ContentType, string> = {
  explanation: "読み解く",
  visual: "図で見る",
  simulation: "試してみる",
  tool: "現場で使う",
  "case-study": "ケースから学ぶ",
  learning: "学びを深める",
};

export const difficultyLabels: Record<Difficulty, string> = {
  introductory: "入門",
  practical: "実務",
  advanced: "発展",
};
