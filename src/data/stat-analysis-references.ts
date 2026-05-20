export type StatReference = {
  id: string;
  title: string;
  fileName: string;
  sourceType: "guideline" | "paper" | "slide" | "report";
  year?: string;
  language: "ja" | "en";
  topics: string[];
  methods: string[];
  keyPoints: string[];
  relatedGuides: string[];
  usageNote: string;
};

export const STAT_ANALYSIS_REFERENCES: StatReference[] = [
  {
    id: "covariate-adjustment-fda-review",
    title: "共変量調整とRCT解析の実務論点",
    fileName: "DS_202506_CovAd_Main.pdf",
    sourceType: "report",
    year: "2025",
    language: "ja",
    topics: ["ランダム化比較試験", "共変量調整", "FDAガイダンス", "estimand", "統計的効率", "モデル誤特定"],
    methods: ["ANCOVA", "ANOVA", "ANHECOVA", "IPTW", "model-assisted"],
    keyPoints: [
      "ベースライン共変量調整は統計的効率の向上に関係する",
      "共変量は事前規定が重要である",
      "線形モデルと非線形モデルでは考慮点が異なる",
      "estimand と estimator を区別して理解する必要がある",
    ],
    relatedGuides: ["/guides/stat/ancova", "/guides/stat/anova", "/guides/stat/mmrm"],
    usageNote:
      "ANCOVAページで、共変量調整、統計的効率、事前規定、estimandとestimatorの区別を説明する根拠資料として使う。",
  },
  {
    id: "small-sample-rct-covariate-adjustment",
    title: "小標本RCTにおける共変量調整手法の比較",
    fileName: "s13063-022-06967-6.pdf",
    sourceType: "paper",
    year: "2023",
    language: "en",
    topics: ["小標本RCT", "共変量調整", "モデル誤特定", "treatment-covariate interaction"],
    methods: ["ANCOVA", "G-computation", "IPTW", "AIPTW", "TMLE"],
    keyPoints: [
      "ANCOVAはRCTでよく用いられる共変量調整法である",
      "モデル誤特定や小標本では注意が必要である",
      "代替的な調整手法との比較観点を提供する",
    ],
    relatedGuides: ["/guides/stat/ancova"],
    usageNote:
      "ANCOVAの頑健性、限界、代替手法の位置づけを説明する補足資料として使う。",
  },
  {
    id: "sas-ancova-anova-seminar",
    title: "SASによる分散分析・共分散分析の実務整理",
    fileName: "usergroups09-a-17.pdf",
    sourceType: "slide",
    year: "2009",
    language: "ja",
    topics: ["SAS", "共分散分析", "分散分析", "交絡", "共変量調整", "調整平均"],
    methods: ["ANOVA", "ANCOVA"],
    keyPoints: [
      "ANOVAはばらつきを要因に分解する方法である",
      "ANCOVAは共変量を考慮した群間比較である",
      "共変量調整には偏り除去と精度向上の役割がある",
      "未調整平均差と調整後平均差は異なる場合がある",
    ],
    relatedGuides: ["/guides/stat/anova", "/guides/stat/ancova"],
    usageNote:
      "ANOVAを「ばらつきの分解」、ANCOVAを「共変量を考慮した群間比較」として初学者向けに説明する基礎資料として使う。",
  },
  {
    id: "ancova-lecture-himichi",
    title: "ANCOVAと多重比較の論点整理",
    fileName: "himichi.pdf",
    sourceType: "slide",
    language: "ja",
    topics: ["ANCOVA", "ANOVA", "多重比較", "Bonferroni", "共変量調整"],
    methods: ["ANOVA", "ANCOVA"],
    keyPoints: [
      "ANCOVAの講義資料として、分散分析・共分散分析・多重比較を補足できる",
      "初学者向けの概念整理に使える",
    ],
    relatedGuides: ["/guides/stat/anova", "/guides/stat/ancova"],
    usageNote:
      "ANOVAとANCOVAの関連、Bonferroniなど多重比較の補足に使う。",
  },
  {
    id: "mixed-model-ancova-cluster-rct",
    title: "クラスターランダム化試験におけるmixed-model ANCOVA",
    fileName: "2112.00832.pdf",
    sourceType: "paper",
    year: "2023",
    language: "en",
    topics: ["cluster randomized trial", "mixed-model ANCOVA", "model robustness", "precision", "intracluster correlation"],
    methods: ["mixed-model ANCOVA", "ANCOVA1", "ANCOVA2", "linear mixed model"],
    keyPoints: [
      "クラスターランダム化試験では混合モデルANCOVAがよく用いられる",
      "クラスター内相関を考慮しながら共変量調整できる",
      "モデル誤特定下での頑健性と精度が論点になる",
    ],
    relatedGuides: ["/guides/stat/ancova", "/guides/stat/mmrm"],
    usageNote:
      "混合モデル、クラスター構造、MMRMやmixed modelの発展的理解に使う。",
  },
  {
    id: "sisaqol-repeated-measures-recommendations",
    title: "PRO/QOL解析における統計手法選択の初期推奨",
    fileName: "SISAQOL-Initial-Recommendations-pre-print.pdf",
    sourceType: "paper",
    language: "en",
    topics: ["PRO", "QOL", "repeated measures", "missing data", "statistical method selection", "linear mixed model"],
    methods: ["linear mixed model", "repeated measures ANOVA", "linear regression", "Cox proportional hazards"],
    keyPoints: [
      "PRO/QOLの解析では研究目的に応じた統計手法選択が重要である",
      "ベースライン＋複数フォローアップでは線形混合モデルが推奨される",
      "欠測データや反復測定の扱いが重要である",
      "複雑なモデルより解釈可能性とのバランスが重要である",
    ],
    relatedGuides: ["/guides/stat/mmrm", "/guides/stat/ancova"],
    usageNote:
      "MMRMページの中核資料として、複数時点データ、欠測、PRO/QOL解析の説明に使う。",
  },
  {
    id: "soumu-stat-ds-advanced",
    title: "高校からの統計・データサイエンス活用 ～上級編～",
    fileName: "000607858.pdf",
    sourceType: "report",
    year: "2017",
    language: "ja",
    topics: [
      "統計的探究",
      "PPDAC",
      "記述統計",
      "確率",
      "推測統計",
      "相関分析",
      "回帰分析",
      "統計的検定",
      "公的統計",
      "データサイエンス",
    ],
    methods: [
      "descriptive statistics",
      "data visualization",
      "correlation analysis",
      "regression analysis",
      "hypothesis testing",
      "sampling",
      "PPDAC",
    ],
    keyPoints: [
      "統計的探究の流れをPPDACとして整理できる",
      "記述統計、可視化、推測統計を初学者向けに接続できる",
      "公的統計や身近なデータを用いたデータサイエンス学習の構成参考になる",
    ],
    relatedGuides: [
      "/guides/stat/learning-map",
      "/guides/stat/data-science-stat-roadmap",
      "/guides/stat/descriptive-statistics",
      "/guides/stat/correlation-causation",
      "/guides/stat/regression-analysis",
      "/guides/stat/hypothesis-testing",
      "/guides/stat/anova",
      "/guides/stat/ds-certification-roadmap",
    ],
    usageNote:
      "統計部門の基礎学習マップ、基本の勉強、統計検定、DS検定の3導線設計、初学者向け統計ガイドの構成参考として使う。",
  },
];
