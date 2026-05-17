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
    id: "covariate-adjustment-ds-202506",
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
      "ANCOVAページのFDAガイダンス背景、共変量調整、統計的効率、事前規定の説明に使う。",
  },
  {
    id: "small-sample-rct-covariate-adjustment-2023",
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
    id: "sas-ancova-usergroup-2009",
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
      "ANOVA/ANCOVAの初学者向け説明、交絡、調整平均、未調整差と調整後差の図解に使う。",
  },
  {
    id: "ancova-multiple-comparison-himichi",
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
    id: "cluster-randomized-mixed-model-ancova-2023",
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
    id: "sisaqol-initial-recommendations-pro-qol",
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
];
