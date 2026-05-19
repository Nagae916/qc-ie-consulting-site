'use client';

import { useMemo, useState } from 'react';

type Level2Category = 'すべて' | '記述統計' | '確率' | '推定・検定' | 'モデリング' | '時系列';
type TopicCategory = Exclude<Level2Category, 'すべて'>;
type Priority = 'S' | 'A' | 'B';

type Level2Topic = {
  id: string;
  title: string;
  category: TopicCategory;
  priority: Priority;
  keywords: string[];
  questionPatterns: string[];
  commonMistakes: string[];
  relatedGuides: { label: string; href?: string }[];
};

const CATEGORIES: Level2Category[] = ['すべて', '記述統計', '確率', '推定・検定', 'モデリング', '時系列'];

const TOPICS: Level2Topic[] = [
  {
    id: 'descriptive-visualization',
    title: '記述統計・可視化',
    category: '記述統計',
    priority: 'S',
    keywords: ['平均', '中央値', '分散', '標準偏差', '可視化'],
    questionPatterns: ['グラフ読取', '統計量選択', '分布の特徴判断'],
    commonMistakes: ['平均だけで分布を判断する', '外れ値の影響を見落とす', '標準偏差と分散を混同する'],
    relatedGuides: [
      { label: '記述統計', href: '/guides/stat/descriptive-statistics' },
      { label: '標準偏差とばらつき', href: '/guides/stat/variance-standard-deviation' },
    ],
  },
  {
    id: 'boxplot-histogram',
    title: '箱ひげ図・ヒストグラム',
    category: '記述統計',
    priority: 'A',
    keywords: ['箱ひげ図', 'ヒストグラム', '四分位範囲', '歪み', '外れ値'],
    questionPatterns: ['グラフ読取', '分布比較', '外れ値判断'],
    commonMistakes: ['階級幅の影響を無視する', '箱ひげ図から平均を直接読もうとする', '分布の左右非対称性を見落とす'],
    relatedGuides: [
      { label: 'ヒストグラムと分布', href: '/guides/stat/histogram-and-distribution' },
      { label: '箱ひげ図', href: '/guides/stat/boxplot' },
    ],
  },
  {
    id: 'scatter-correlation',
    title: '散布図・相関係数',
    category: '記述統計',
    priority: 'S',
    keywords: ['散布図', '相関係数', '共分散', '擬似相関', '因果'],
    questionPatterns: ['散布図読取', '相関の向き判断', '相関と因果の区別'],
    commonMistakes: ['相関を因果と解釈する', '外れ値による相関の変化を見落とす', '非線形関係を相関係数だけで判断する'],
    relatedGuides: [
      { label: '相関と因果', href: '/guides/stat/correlation-causation' },
      { label: '散布図', href: '/guides/stat/scatterplot' },
    ],
  },
  {
    id: 'conditional-probability',
    title: '確率・条件付き確率',
    category: '確率',
    priority: 'S',
    keywords: ['条件付き確率', '独立', 'ベイズ', '余事象', '同時確率'],
    questionPatterns: ['文章題のモデル化', '条件付き確率計算', '独立性判断'],
    commonMistakes: ['条件の向きを逆にする', '独立と排反を混同する', '母集団を取り違える'],
    relatedGuides: [
      { label: 'ベイズの定理', href: '/guides/stat/bayes-theorem' },
      { label: '確率の基礎' },
    ],
  },
  {
    id: 'expected-value-variance',
    title: '期待値・分散',
    category: '確率',
    priority: 'A',
    keywords: ['期待値', '分散', '標準偏差', '線形変換', '独立性'],
    questionPatterns: ['公式選択', '確率変数の計算', '分散の意味判断'],
    commonMistakes: ['期待値と最頻値を混同する', '分散の単位を意識しない', '独立でない変数を独立として扱う'],
    relatedGuides: [
      { label: '標準偏差とばらつき', href: '/guides/stat/variance-standard-deviation' },
      { label: '確率分布' },
    ],
  },
  {
    id: 'binomial-normal-distribution',
    title: '二項分布・正規分布',
    category: '確率',
    priority: 'A',
    keywords: ['二項分布', '正規分布', '標準化', '近似', '確率計算'],
    questionPatterns: ['分布の使い分け', '標準化', '確率計算'],
    commonMistakes: ['二項分布と正規分布の前提を混同する', '標準化の向きを間違える', '連続補正を忘れる'],
    relatedGuides: [
      { label: '二項分布', href: '/guides/stat/binomial-distribution' },
      { label: '正規分布', href: '/guides/stat/normal-distribution' },
    ],
  },
  {
    id: 'sampling-distribution',
    title: '標本分布・中心極限定理',
    category: '推定・検定',
    priority: 'A',
    keywords: ['標本平均', '標本比率', '標準誤差', '中心極限定理', '標本分布'],
    questionPatterns: ['標準誤差の判断', '標本統計量のばらつき', '近似条件の確認'],
    commonMistakes: ['母集団分布と標本分布を混同する', '標準偏差と標準誤差を混同する', '標本サイズの影響を見落とす'],
    relatedGuides: [
      { label: '中心極限定理', href: '/guides/stat/central-limit-theorem' },
      { label: '母集団と標本', href: '/guides/stat/population-sample' },
    ],
  },
  {
    id: 'confidence-interval',
    title: '信頼区間',
    category: '推定・検定',
    priority: 'S',
    keywords: ['信頼区間', '信頼係数', '標準誤差', '母平均', '母比率'],
    questionPatterns: ['区間推定', '式の選択', '区間の解釈'],
    commonMistakes: ['母数が確率的に動くと解釈する', '信頼係数と有意水準の関係を忘れる', '標本サイズと区間幅の関係を見落とす'],
    relatedGuides: [
      { label: '信頼区間', href: '/guides/stat/confidence-interval' },
      { label: '標本抽出', href: '/guides/stat/sampling' },
    ],
  },
  {
    id: 'hypothesis-testing',
    title: '仮説検定',
    category: '推定・検定',
    priority: 'S',
    keywords: ['帰無仮説', '対立仮説', 'p値', '有意水準', '片側検定'],
    questionPatterns: ['p値判断', '仮説設定', '検定手法選択'],
    commonMistakes: ['p値を効果の大きさと解釈する', '片側検定と両側検定を取り違える', '有意でないことを同等と解釈する'],
    relatedGuides: [
      { label: '仮説検定', href: '/guides/stat/hypothesis-testing' },
      { label: '第1種・第2種の誤り', href: '/guides/stat/type-one-two-error' },
    ],
  },
  {
    id: 'anova',
    title: '分散分析',
    category: '推定・検定',
    priority: 'A',
    keywords: ['ANOVA', 'F値', '群間変動', '群内変動', '多重比較'],
    questionPatterns: ['手法選択', 'F値判断', '多群比較'],
    commonMistakes: ['複数回のt検定で代用する', 'F値の意味を平均差だけで説明する', '多重比較の必要性を見落とす'],
    relatedGuides: [
      { label: 'ANOVA', href: '/guides/stat/anova' },
      { label: 'F検定', href: '/guides/stat/f-test' },
    ],
  },
  {
    id: 'chi-square-test',
    title: 'カイ二乗検定',
    category: '推定・検定',
    priority: 'A',
    keywords: ['カイ二乗検定', '適合度検定', '独立性の検定', '期待度数', 'クロス表'],
    questionPatterns: ['度数表読取', '独立性判断', '期待度数計算'],
    commonMistakes: ['割合データと度数データを混同する', '期待度数の条件を見落とす', '独立性と相関を同じ意味で扱う'],
    relatedGuides: [
      { label: 'カイ二乗検定', href: '/guides/stat/chi-square-test' },
      { label: 'カイ二乗分布', href: '/guides/stat/chi-square' },
    ],
  },
  {
    id: 'regression',
    title: '単回帰・重回帰',
    category: 'モデリング',
    priority: 'S',
    keywords: ['単回帰', '重回帰', '回帰係数', '決定係数', 'p値'],
    questionPatterns: ['回帰出力読解', '係数解釈', '決定係数判断'],
    commonMistakes: ['係数の単位を無視する', '決定係数を因果の強さと解釈する', '多重共線性を見落とす'],
    relatedGuides: [
      { label: '回帰分析', href: '/guides/stat/regression-analysis' },
      { label: '単回帰分析', href: '/guides/stat/simple-linear-regression' },
      { label: '重回帰分析', href: '/guides/stat/multiple-regression' },
    ],
  },
  {
    id: 'time-series',
    title: '時系列・自己相関',
    category: '時系列',
    priority: 'B',
    keywords: ['時系列', '移動平均', '自己相関', '季節性', 'トレンド'],
    questionPatterns: ['時系列グラフ読取', '自己相関判断', '季節性の確認'],
    commonMistakes: ['時系列順序を無視して平均だけを見る', 'トレンドと季節性を混同する', '自己相関を通常の相関と同じように扱う'],
    relatedGuides: [
      { label: '時系列データ' },
      { label: 'データサイエンス統計ロードマップ', href: '/guides/stat/data-science-stat-roadmap' },
    ],
  },
];

const priorityStyles: Record<Priority, string> = {
  S: 'border-orange-200 bg-orange-50 text-orange-700',
  A: 'border-sky-200 bg-sky-50 text-sky-700',
  B: 'border-slate-200 bg-slate-50 text-slate-700',
};

const categoryStyles: Record<TopicCategory, string> = {
  記述統計: 'bg-blue-50 text-blue-700 ring-blue-100',
  確率: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  '推定・検定': 'bg-violet-50 text-violet-700 ring-violet-100',
  モデリング: 'bg-amber-50 text-amber-700 ring-amber-100',
  時系列: 'bg-slate-50 text-slate-700 ring-slate-100',
};

export default function StatisticsExamLevel2Map() {
  const [selectedCategory, setSelectedCategory] = useState<Level2Category>('すべて');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('descriptive-visualization');

  const filteredTopics = useMemo(() => {
    if (selectedCategory === 'すべて') return TOPICS;
    return TOPICS.filter((topic) => topic.category === selectedCategory);
  }, [selectedCategory]);

  const selectedTopic =
    TOPICS.find((topic) => topic.id === selectedTopicId) ?? filteredTopics[0] ?? TOPICS[0];

  const selectCategory = (category: Level2Category) => {
    setSelectedCategory(category);
    const nextTopic = category === 'すべて' ? TOPICS[0] : TOPICS.find((topic) => topic.category === category);
    if (nextTopic) setSelectedTopicId(nextTopic.id);
  };

  if (!selectedTopic) return null;

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-sky-700">統計検定2級の学習単元を選ぶ</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          公式問題の内容は転載せず、単元・問われ方・つまずきやすい点を学習用に整理しています。
          優先度Sから着手し、推定・検定と回帰を早めに往復すると全体像をつかみやすくなります。
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                isSelected
                  ? 'border-sky-500 bg-sky-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredTopics.map((topic) => {
          const isSelected = selectedTopic.id === topic.id;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedTopicId(topic.id)}
              className={`rounded-xl border p-4 text-left transition ${
                isSelected
                  ? 'border-sky-400 bg-sky-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50'
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${categoryStyles[topic.category]}`}>
                  {topic.category}
                </span>
                <span className={`rounded-full border px-2 py-1 text-xs font-bold ${priorityStyles[topic.priority]}`}>
                  優先度{topic.priority}
                </span>
              </div>
              <p className="font-semibold text-slate-900">{topic.title}</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">{topic.keywords.join(' / ')}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900">{selectedTopic.title}</h3>
          <span className={`rounded-full border px-2 py-1 text-xs font-bold ${priorityStyles[selectedTopic.priority]}`}>
            優先度{selectedTopic.priority}
          </span>
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${categoryStyles[selectedTopic.category]}`}>
            {selectedTopic.category}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">問われ方</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {selectedTopic.questionPatterns.map((pattern) => (
                <li key={pattern}>・{pattern}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">つまずきやすい点</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {selectedTopic.commonMistakes.map((mistake) => (
                <li key={mistake}>・{mistake}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">関連ガイド</p>
            <ul className="mt-3 space-y-2 text-sm">
              {selectedTopic.relatedGuides.map((guide) => (
                <li key={guide.label}>
                  {guide.href ? (
                    <a className="font-medium text-sky-700 hover:text-sky-900" href={guide.href}>
                      {guide.label}
                    </a>
                  ) : (
                    <span className="text-slate-600">{guide.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
