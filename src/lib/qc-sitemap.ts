export type QcGuideStatus = 'ready' | 'draft' | 'planned';

export type QcGuideItem = {
  title: string;
  description?: string;
  href: string;
  category: string;
  priority: number;
  status: QcGuideStatus;
  interactive: boolean;
  examLevel: 'QC検定1級' | 'QC検定共通' | '実務' | '技術士接続';
};

export type QcGuideCategory = {
  title: string;
  description: string;
  items: QcGuideItem[];
};

export const qcRoadmapCategories = [
  '品質管理の基本・QMS',
  'QC七つ道具・新QC七つ道具',
  'QCのための統計基礎',
  '管理図・工程能力',
  '抜取検査・OC曲線',
  '実験計画法',
  '相関・回帰・多変量解析',
  '信頼性工学・未然防止',
  '品質工学・タグチメソッド',
  '技術士・実務接続',
];

export const highlightedDoeItems: QcGuideItem[] = [
  {
    title: '実験計画法の基本',
    description: '要因・水準・特性値・主効果・交互作用・誤差の入口を整理します。',
    href: '/guides/qc/design-of-experiments-basic',
    category: '実験計画法',
    priority: 1,
    status: 'ready',
    interactive: false,
    examLevel: 'QC検定1級',
  },
  {
    title: '一元配置実験',
    href: '/guides/qc/one-way-anova',
    category: '実験計画法',
    priority: 2,
    status: 'planned',
    interactive: false,
    examLevel: 'QC検定1級',
  },
  {
    title: '二元配置実験',
    href: '/guides/qc/two-way-anova',
    category: '実験計画法',
    priority: 3,
    status: 'planned',
    interactive: false,
    examLevel: 'QC検定1級',
  },
  {
    title: '交互作用の見方',
    href: '/guides/qc/interaction-effect',
    category: '実験計画法',
    priority: 4,
    status: 'planned',
    interactive: false,
    examLevel: 'QC検定1級',
  },
  {
    title: '直交表の基本',
    href: '/guides/qc/orthogonal-array-basic',
    category: '実験計画法',
    priority: 5,
    status: 'planned',
    interactive: false,
    examLevel: 'QC検定1級',
  },
];

export const qcGuideCategories: QcGuideCategory[] = [
  {
    title: '品質管理の基本・QMS',
    description: '品質管理の考え方、QMS、標準化、監査・診断を整理します。',
    items: [
      item('品質とは何か', '/guides/qc/quality-concept', '品質管理の基本・QMS'),
      item('QC的ものの見方・考え方', '/guides/qc/qc-thinking', '品質管理の基本・QMS'),
      item('QCストーリー', '/guides/qc/qc-story', '品質管理の基本・QMS'),
      item('品質マネジメントシステム', '/guides/qc/qms-basic', '品質管理の基本・QMS'),
      item('標準化と日常管理', '/guides/qc/standardization', '品質管理の基本・QMS'),
      item('品質監査・品質診断', '/guides/qc/audit-diagnosis', '品質管理の基本・QMS'),
    ],
  },
  {
    title: 'QC七つ道具・新QC七つ道具',
    description: '数値データと言語情報を整理し、問題解決につなげる道具群です。',
    items: [
      item('QC七つ道具の全体像', '/guides/qc/seven-tools', 'QC七つ道具・新QC七つ道具'),
      item('パレート図', '/guides/qc/pareto-chart', 'QC七つ道具・新QC七つ道具'),
      item('特性要因図', '/guides/qc/cause-effect-diagram', 'QC七つ道具・新QC七つ道具'),
      item('ヒストグラム', '/guides/qc/histogram', 'QC七つ道具・新QC七つ道具'),
      item('散布図', '/guides/qc/scatter-diagram', 'QC七つ道具・新QC七つ道具'),
      item('チェックシート', '/guides/qc/check-sheet', 'QC七つ道具・新QC七つ道具'),
      item('層別', '/guides/qc/stratification', 'QC七つ道具・新QC七つ道具'),
      item('新QC七つ道具', '/guides/qc/new-seven-tools', 'QC七つ道具・新QC七つ道具'),
      item('連関図法', '/guides/qc/relation-diagram', 'QC七つ道具・新QC七つ道具'),
      item('系統図法', '/guides/qc/tree-diagram', 'QC七つ道具・新QC七つ道具'),
      item('PDPC法', '/guides/qc/pdpc', 'QC七つ道具・新QC七つ道具'),
      item('アローダイアグラム', '/guides/qc/arrow-diagram', 'QC七つ道具・新QC七つ道具'),
    ],
  },
  {
    title: 'QCのための統計基礎',
    description: '検定・推定、分布、サンプリングを品質管理の文脈で扱います。',
    items: [
      item('データの取り方とサンプリング', '/guides/qc/data-sampling', 'QCのための統計基礎'),
      item('基本統計量', '/guides/qc/basic-statistics', 'QCのための統計基礎'),
      item('QCで使う分布', '/guides/qc/distribution-basic', 'QCのための統計基礎'),
      item('検定・推定の基本', '/guides/qc/estimation-test-basic', 'QCのための統計基礎'),
      item('不適合品率の検定', '/guides/qc/proportion-test', 'QCのための統計基礎'),
      item('分割表による検定', '/guides/qc/contingency-table', 'QCのための統計基礎'),
    ],
  },
  {
    title: '管理図・工程能力',
    description: '工程の安定性と規格適合性を、データから判断します。',
    items: [
      item('管理図の基本', '/guides/qc/control-chart-basic', '管理図・工程能力'),
      item('Xbar-R管理図', '/guides/qc/xbar-r-chart', '管理図・工程能力'),
      item('Xbar-s管理図', '/guides/qc/xbar-s-chart', '管理図・工程能力'),
      item('p管理図・np管理図', '/guides/qc/p-np-chart', '管理図・工程能力'),
      item('c管理図・u管理図', '/guides/qc/c-u-chart', '管理図・工程能力'),
      item('工程能力指数 Cp/Cpk', '/guides/qc/process-capability', '管理図・工程能力'),
      item('工程能力指数の区間推定', '/guides/qc/process-capability-ci', '管理図・工程能力'),
    ],
  },
  {
    title: '抜取検査・OC曲線',
    description: '検査のリスクと判定性能を、OC曲線から理解します。',
    items: [
      item('抜取検査の基本', '/guides/qc/sampling-inspection-basic', '抜取検査・OC曲線'),
      item('OC曲線', '/guides/qc/oc-curve', '抜取検査・OC曲線', 'ready'),
      item('計数規準型抜取検査', '/guides/qc/attribute-sampling', '抜取検査・OC曲線'),
      item('計量規準型抜取検査', '/guides/qc/variable-sampling', '抜取検査・OC曲線'),
      item('調整型抜取検査', '/guides/qc/adjusted-sampling', '抜取検査・OC曲線'),
    ],
  },
  {
    title: '実験計画法',
    description: 'QC検定1級の山場。条件最適化、交互作用、誤差評価へ進みます。',
    items: [
      ...highlightedDoeItems,
      item('多元配置実験', '/guides/qc/multi-way-anova', '実験計画法'),
      item('乱塊法', '/guides/qc/randomized-block-design', '実験計画法'),
      item('分割法', '/guides/qc/split-plot-design', '実験計画法'),
      item('枝分かれ実験', '/guides/qc/nested-design', '実験計画法'),
      item('直交表と交互作用', '/guides/qc/orthogonal-array-interaction', '実験計画法'),
      item('多水準法・擬水準法', '/guides/qc/multi-level-pseudo-level', '実験計画法'),
      item('応答曲面法', '/guides/qc/response-surface', '実験計画法'),
      item('直交多項式', '/guides/qc/orthogonal-polynomial', '実験計画法'),
    ],
  },
  {
    title: '相関・回帰・多変量解析',
    description: '品質特性と要因の関係を分析し、改善仮説につなげます。',
    items: [
      item('相関分析', '/guides/qc/correlation-analysis', '相関・回帰・多変量解析'),
      item('単回帰分析', '/guides/qc/regression-analysis', '相関・回帰・多変量解析'),
      item('重回帰分析', '/guides/qc/multiple-regression', '相関・回帰・多変量解析'),
      item('主成分分析', '/guides/qc/principal-component-analysis', '相関・回帰・多変量解析'),
      item('クラスター分析', '/guides/qc/cluster-analysis', '相関・回帰・多変量解析'),
    ],
  },
  {
    title: '信頼性工学・未然防止',
    description: '故障、リスク、設計段階の未然防止を扱います。',
    items: [
      item('信頼性工学の基本', '/guides/qc/reliability-engineering-basic', '信頼性工学・未然防止'),
      item('バスタブ曲線', '/guides/qc/bathtub-curve', '信頼性工学・未然防止'),
      item('直列系・並列系・冗長系', '/guides/qc/series-parallel-system', '信頼性工学・未然防止'),
      item('FMEA', '/guides/qc/fmea', '信頼性工学・未然防止'),
      item('FTA', '/guides/qc/fta', '信頼性工学・未然防止'),
      item('DR・デザインレビュー', '/guides/qc/dr-design-review', '信頼性工学・未然防止'),
    ],
  },
  {
    title: '品質工学・タグチメソッド',
    description: 'ロバスト設計、SN比、MTシステムへ進むカテゴリです。',
    items: [
      item('品質工学の基本', '/guides/qc/quality-engineering-basic', '品質工学・タグチメソッド'),
      item('SN比の基本', '/guides/qc/sn-ratio-basic', '品質工学・タグチメソッド'),
      item('ロバストパラメータ設計', '/guides/qc/robust-parameter-design', '品質工学・タグチメソッド'),
      item('静特性・動特性', '/guides/qc/static-dynamic-characteristics', '品質工学・タグチメソッド'),
      item('MTシステム入門', '/guides/qc/mt-system-basic', '品質工学・タグチメソッド'),
    ],
  },
  {
    title: '技術士・実務接続',
    description: '品質管理をQMS改善、技術士答案、現場改善へ接続します。',
    items: [
      item('技術士答案で使う品質管理', '/guides/qc/qc-for-pe-exam', '技術士・実務接続', 'planned', '技術士接続'),
      item('QMS改善への活用', '/guides/qc/qms-improvement', '技術士・実務接続', 'planned', '実務'),
      item('製造業の品質改善事例', '/guides/qc/manufacturing-quality-case', '技術士・実務接続', 'planned', '実務'),
      item('品質コスト', '/guides/qc/quality-cost', '技術士・実務接続', 'planned', '実務'),
      item('ヒューマンエラーとポカヨケ', '/guides/qc/human-error-pokayoke', '技術士・実務接続', 'planned', '実務'),
    ],
  },
];

function item(
  title: string,
  href: string,
  category: string,
  status: QcGuideStatus = 'planned',
  examLevel: QcGuideItem['examLevel'] = 'QC検定1級',
): QcGuideItem {
  return {
    title,
    href,
    category,
    priority: 50,
    status,
    interactive: false,
    examLevel,
  };
}
