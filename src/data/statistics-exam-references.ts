export type StatisticsExamReference = {
  id: string;
  title: string;
  fileName: string;
  examName: "統計検定2級";
  examLevel: "2級";
  examDate?: string;
  sourceType: "official-workbook" | "past-exam" | "answer-explanation";
  format: "pdf-image" | "pdf-text" | "mixed";
  topics: string[];
  usageNote: string;
  relatedGuides: string[];
};

const COMMON_PAST_EXAM_TOPICS = [
  "記述統計",
  "可視化",
  "相関",
  "回帰",
  "確率",
  "確率分布",
  "標本分布",
  "推定",
  "仮説検定",
  "分散分析",
  "カイ二乗検定",
  "時系列",
  "線形モデル",
];

const COMMON_RELATED_GUIDES = [
  "/guides/stat/learning-map",
  "/guides/stat/statistics-exam-level2-map",
  "/guides/stat/descriptive-statistics",
  "/guides/stat/histogram-and-distribution",
  "/guides/stat/correlation-causation",
  "/guides/stat/regression-analysis",
  "/guides/stat/hypothesis-testing",
  "/guides/stat/anova",
  "/guides/stat/chi-square-test",
];

export const STATISTICS_EXAM_REFERENCES: StatisticsExamReference[] = [
  {
    id: "statistics-exam-level2-cbt-workbook",
    title: "統計検定2級 公式問題集 CBT対応版",
    fileName: "CBT問題集.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    sourceType: "official-workbook",
    format: "pdf-image",
    topics: [
      "1変数記述統計",
      "2変数記述統計",
      "データ収集",
      "確率",
      "確率分布",
      "標本分布",
      "推定",
      "検定",
      "カイ二乗検定",
      "線形モデル",
    ],
    usageNote:
      "統計検定2級の分野別出題範囲、基本問題、解説粒度の把握に使う。問題文・選択肢・解説は転載せず、オリジナル類題作成の参考にする。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2014-11-set",
    title: "統計検定2級 2014年11月 セット",
    fileName: "2014.11セット.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2014-11",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2014年11月回の出題傾向、問われ方、難易度感の把握に使う。問題文・選択肢・解説は転載せず、トピック分類とオリジナル類題設計の参考にする。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2015-06-set",
    title: "統計検定2級 2015年6月 セット",
    fileName: "2015.6セット.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2015-06",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2015年6月回の出題傾向、問われ方、難易度感の把握に使う。問題文・選択肢・解説は転載せず、統計検定2級ロードマップの出題領域整理に使う。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2015-11-set",
    title: "統計検定2級 2015年11月 セット",
    fileName: "2015.11セット.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2015-11",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2015年11月回の出題傾向、問われ方、難易度感の把握に使う。公式問題の内容は再利用せず、テーマ頻度と学習順序の検討材料にする。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2016-09-set",
    title: "統計検定2級 2016年9月 セット",
    fileName: "2016.9セット.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2016-09",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2016年9月回の出題傾向、問われ方、難易度感の把握に使う。画像ベースPDFとして扱い、本文抽出ではなくメタデータ整理と類題設計の参考にする。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2016-11",
    title: "統計検定2級 2016年11月",
    fileName: "2016.11.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2016-11",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2016年11月回の出題傾向、問われ方、難易度感の把握に使う。問題文や選択肢は転載せず、統計検定2級の分野横断的な問われ方を整理する。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2017-06-set",
    title: "統計検定2級 2017年6月 セット",
    fileName: "2017.6セット.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2017-06",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2017年6月回の出題傾向、問われ方、難易度感の把握に使う。問題内容は転載せず、学習マップ上の重点領域と苦手対策の設計に使う。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2018-06-set",
    title: "統計検定2級 2018年6月 セット",
    fileName: "2018.6セット.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2018-06",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2018年6月回の出題傾向、問われ方、難易度感の把握に使う。公式問題の文章は引用せず、オリジナル演習問題の難易度調整に使う。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2018-11-question",
    title: "統計検定2級 2018年11月 問題",
    fileName: "2018.11問題.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2018-11",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2018年11月回の問題構成、出題範囲、問われ方、難易度感の把握に使う。問題文・選択肢は転載せず、傾向分析と類題作成の参考にする。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2018-11-answer",
    title: "統計検定2級 2018年11月 解答",
    fileName: "2018.11解答.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2018-11",
    sourceType: "answer-explanation",
    format: "pdf-image",
    topics: [...COMMON_PAST_EXAM_TOPICS, "解法プロセス", "選択肢判定"],
    usageNote:
      "2018年11月回の解法の流れ、選択肢判定、計算過程、説明粒度を把握するために使う。解説文章は転載せず、オリジナル解説の粒度調整に使う。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2019-06-set",
    title: "統計検定2級 2019年6月 セット",
    fileName: "2019.6セット.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2019-06",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2019年6月回の出題傾向、問われ方、難易度感の把握に使う。問題内容は転載せず、統計検定2級の学習順序と復習観点の整理に使う。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2019-11-question",
    title: "統計検定2級 2019年11月 問題",
    fileName: "2019.11問題.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2019-11",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2019年11月回の問題構成、出題範囲、問われ方、難易度感の把握に使う。問題文・選択肢は転載せず、分野別の類題設計に使う。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2019-11-answer",
    title: "統計検定2級 2019年11月 解答",
    fileName: "2019.11解答.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2019-11",
    sourceType: "answer-explanation",
    format: "pdf-image",
    topics: [...COMMON_PAST_EXAM_TOPICS, "解法プロセス", "選択肢判定"],
    usageNote:
      "2019年11月回の解法の流れ、選択肢判定、計算過程、説明粒度を把握するために使う。解説の文章は転載せず、オリジナル解説作成時の構成参考にする。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2021-06-question",
    title: "統計検定2級 2021年6月 問題",
    fileName: "2021.6問題.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2021-06",
    sourceType: "past-exam",
    format: "pdf-image",
    topics: COMMON_PAST_EXAM_TOPICS,
    usageNote:
      "2021年6月回の問題構成、出題範囲、問われ方、難易度感の把握に使う。問題文・選択肢は転載せず、統計学習コンテンツの出題傾向整理に使う。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
  {
    id: "statistics-exam-level2-2021-06-answer",
    title: "統計検定2級 2021年6月 解答",
    fileName: "2021.6解.pdf",
    examName: "統計検定2級",
    examLevel: "2級",
    examDate: "2021-06",
    sourceType: "answer-explanation",
    format: "pdf-image",
    topics: [...COMMON_PAST_EXAM_TOPICS, "解法プロセス", "選択肢判定"],
    usageNote:
      "2021年6月回の解法の流れ、選択肢判定、計算過程、説明粒度を把握するために使う。解説の文章は転載せず、復習導線やオリジナル類題解説の参考にする。",
    relatedGuides: COMMON_RELATED_GUIDES,
  },
];
