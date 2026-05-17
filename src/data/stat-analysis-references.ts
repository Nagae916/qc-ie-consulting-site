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
    topics: ["RCT", "共変量調整", "FDAガイダンス", "estimand", "model-assisted"],
    methods: ["ANCOVA", "ANOVA", "ANHECOVA", "IPTW"],
    keyPoints: [
      "RCTで共変量調整を行う目的を、推定精度、estimand、規制上の説明可能性の観点から整理する",
      "単純な群間比較、ANOVA、ANCOVA、model-assisted推定の使い分けを考えるための参照資料にする",
      "共変量を事前に定義し、解析計画で扱いを明確にする重要性を説明する際に使う",
    ],
    relatedGuides: ["/guides/stat/ancova", "/guides/stat/anova"],
    usageNote:
      "ANOVAとANCOVAの違い、RCTにおける共変量調整、解析計画書での手法選択を説明する統計ガイドの根拠整理に使う。",
  },
  {
    id: "small-sample-rct-covariate-adjustment-2022",
    title: "小標本RCTにおける共変量調整手法の比較",
    fileName: "s13063-022-06967-6.pdf",
    sourceType: "paper",
    year: "2022",
    language: "en",
    topics: ["小標本RCT", "モデル誤特定", "共変量調整"],
    methods: ["ANCOVA", "G-computation", "IPTW", "AIPTW", "TMLE"],
    keyPoints: [
      "小標本RCTでは、調整手法の選択やモデル誤特定が推定結果に与える影響を確認する必要がある",
      "ANCOVAだけでなく、重み付け推定や二重ロバスト推定を比較する導入資料として使える",
      "精度向上とロバスト性のバランスを、解析手法選択ガイドで説明する際の背景資料にする",
    ],
    relatedGuides: ["/guides/stat/ancova"],
    usageNote:
      "小標本RCTでANCOVAを使うときの注意点、代替推定法、モデル仮定の確認を説明する際に参照する。",
  },
  {
    id: "sas-ancova-usergroup-2009",
    title: "SASによる分散分析・共分散分析の実務整理",
    fileName: "usergroups09-a-17.pdf",
    sourceType: "slide",
    year: "2009",
    language: "ja",
    topics: ["SAS", "共分散分析", "交絡", "共変量調整"],
    methods: ["ANOVA", "ANCOVA"],
    keyPoints: [
      "ANOVAとANCOVAを実務解析の流れとして比較し、共変量を入れる意味を整理する",
      "交絡やベースライン差を考慮するために共変量調整を行う考え方を説明する",
      "SAS出力の読み方ではなく、サイト内では手法選択と解釈の観点に絞って参照する",
    ],
    relatedGuides: ["/guides/stat/anova", "/guides/stat/ancova"],
    usageNote:
      "ANOVAからANCOVAへ進む学習導線で、共変量調整の目的、モデル式、解釈の違いを説明する材料にする。",
  },
  {
    id: "ancova-multiple-comparison-himichi",
    title: "ANCOVAと多重比較の論点整理",
    fileName: "himichi.pdf",
    sourceType: "slide",
    language: "ja",
    topics: ["ANCOVA", "多重比較", "Bonferroni", "共変量調整"],
    methods: ["ANOVA", "ANCOVA"],
    keyPoints: [
      "ANCOVAを使う場面と、群間比較や多重比較を行う際の注意点を整理する",
      "Bonferroniなどの補正を、検定の多重性と誤検出の観点から説明する際に参照する",
      "共変量を調整した平均差の解釈と、単純平均の比較との違いを示す材料にする",
    ],
    relatedGuides: ["/guides/stat/anova", "/guides/stat/ancova"],
    usageNote:
      "多群比較、共変量調整、多重比較補正を同時に扱う統計ガイドで、論点の整理用メタデータとして使う。",
  },
  {
    id: "cluster-randomized-mixed-model-ancova-2021",
    title: "クラスターランダム化試験におけるmixed-model ANCOVA",
    fileName: "2112.00832.pdf",
    sourceType: "paper",
    year: "2021",
    language: "en",
    topics: ["cluster randomized trial", "mixed-model ANCOVA", "model robustness", "precision"],
    methods: ["mixed-model ANCOVA", "ANCOVA1", "ANCOVA2"],
    keyPoints: [
      "クラスターランダム化試験では、個体レベルとクラスター水準の構造を考慮した解析が必要になる",
      "mixed-model ANCOVAを、通常のANCOVAから混合モデルへ拡張する学習導線に接続する",
      "モデルのロバスト性と推定精度を比較し、MMRMや混合モデルの導入前段として使う",
    ],
    relatedGuides: ["/guides/stat/ancova", "/guides/stat/mmrm"],
    usageNote:
      "ANCOVA、混合モデル、クラスター構造を扱う解析手法選択ガイドで、階層構造を持つデータの例として参照する。",
  },
  {
    id: "sisaqol-initial-recommendations-pro-qol",
    title: "PRO/QOL解析における統計手法選択の初期推奨",
    fileName: "SISAQOL-Initial-Recommendations-pre-print.pdf",
    sourceType: "paper",
    language: "en",
    topics: ["PRO", "QOL", "repeated measures", "missing data", "statistical method selection"],
    methods: ["linear mixed model", "repeated measures ANOVA", "Cox PH", "linear regression"],
    keyPoints: [
      "PRO/QOLデータでは、繰り返し測定、欠測、時間経過を考慮した解析手法選択が重要になる",
      "repeated measures ANOVAとlinear mixed modelの使い分けを説明する際の参照資料にする",
      "臨床試験解析で、評価尺度、欠測、解析目的に応じて手法を選ぶ考え方を整理する",
    ],
    relatedGuides: ["/guides/stat/mmrm", "/guides/stat/ancova"],
    usageNote:
      "MMRM、反復測定、欠測を扱う統計ガイドで、QOL/PROデータの解析手法選択を説明するために使う。",
  },
];
