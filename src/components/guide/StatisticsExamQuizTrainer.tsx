'use client';

import { useMemo, useState } from 'react';
import {
  STATISTICS_EXAM_LEVEL2_QUESTIONS,
  type StatisticsExamLevel2Question,
} from '@/data/statistics-exam-level2-questions';

type AreaFilter = 'すべて' | StatisticsExamLevel2Question['area'];
type DifficultyFilter = 'すべて' | StatisticsExamLevel2Question['difficulty'];

const areaOptions: AreaFilter[] = [
  'すべて',
  '記述統計',
  '確率',
  '確率分布',
  '推定',
  '仮説検定',
  '分散分析',
  'カイ二乗検定',
  '回帰分析',
  '時系列',
];

const difficultyOptions: DifficultyFilter[] = ['すべて', 'basic', 'standard', 'advanced'];

const difficultyLabels: Record<StatisticsExamLevel2Question['difficulty'], string> = {
  basic: '基礎',
  standard: '標準',
  advanced: '応用',
};

function percent(correct: number, answered: number) {
  if (answered <= 0) return 0;
  return Math.round((correct / answered) * 100);
}

function optionLabel(index: number) {
  return String.fromCharCode(65 + index);
}

export default function StatisticsExamQuizTrainer() {
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('すべて');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('すべて');
  const [categoryFilter, setCategoryFilter] = useState('すべて');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);

  const categories = useMemo(() => {
    const targetQuestions = STATISTICS_EXAM_LEVEL2_QUESTIONS.filter((question) => {
      const areaMatched = areaFilter === 'すべて' || question.area === areaFilter;
      const difficultyMatched = difficultyFilter === 'すべて' || question.difficulty === difficultyFilter;
      return areaMatched && difficultyMatched;
    });
    return ['すべて', ...Array.from(new Set(targetQuestions.map((question) => question.category))).sort((a, b) => a.localeCompare(b, 'ja'))];
  }, [areaFilter, difficultyFilter]);

  const filteredQuestions = useMemo(() => {
    return STATISTICS_EXAM_LEVEL2_QUESTIONS.filter((question) => {
      const areaMatched = areaFilter === 'すべて' || question.area === areaFilter;
      const difficultyMatched = difficultyFilter === 'すべて' || question.difficulty === difficultyFilter;
      const categoryMatched = categoryFilter === 'すべて' || question.category === categoryFilter;
      return areaMatched && difficultyMatched && categoryMatched;
    });
  }, [areaFilter, categoryFilter, difficultyFilter]);

  const currentQuestion = filteredQuestions[currentIndex] ?? filteredQuestions[0];
  const selectedCorrect = currentQuestion ? selectedIndex === currentQuestion.answerIndex : false;
  const answerRate = percent(correct, answered);

  function resetPosition() {
    setCurrentIndex(0);
    setSelectedIndex(null);
  }

  function handleAreaChange(value: AreaFilter) {
    setAreaFilter(value);
    setCategoryFilter('すべて');
    resetPosition();
  }

  function handleDifficultyChange(value: DifficultyFilter) {
    setDifficultyFilter(value);
    setCategoryFilter('すべて');
    resetPosition();
  }

  function handleCategoryChange(value: string) {
    setCategoryFilter(value);
    resetPosition();
  }

  function answer(choiceIndex: number) {
    if (!currentQuestion || selectedIndex !== null) return;
    setSelectedIndex(choiceIndex);
    setAnswered((value) => value + 1);
    if (choiceIndex === currentQuestion.answerIndex) {
      setCorrect((value) => value + 1);
    }
  }

  function nextQuestion() {
    if (filteredQuestions.length === 0) return;
    setCurrentIndex((value) => (value + 1) % filteredQuestions.length);
    setSelectedIndex(null);
  }

  function restart() {
    setAreaFilter('すべて');
    setDifficultyFilter('すべて');
    setCategoryFilter('すべて');
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswered(0);
    setCorrect(0);
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-700">Statistics Exam Level 2 Practice</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">統計検定2級 4択演習</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            公式問題の本文は使わず、頻出単元と問われ方を参考にしたオリジナル類題です。
            解いた後は、解法の方針、選択肢判定、関連ガイドで復習できます。
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-sky-200 bg-white p-3 text-center text-sm">
          <div>
            <p className="text-xs font-bold text-slate-500">回答数</p>
            <p className="mt-1 text-lg font-black text-slate-950">{answered}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">正答数</p>
            <p className="mt-1 text-lg font-black text-emerald-700">{correct}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">正答率</p>
            <p className="mt-1 text-lg font-black text-sky-700">{answerRate}%</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[180px_180px_minmax(0,1fr)_auto] lg:items-end">
        <label className="block">
          <span className="text-sm font-bold text-slate-800">単元</span>
          <select
            value={areaFilter}
            onChange={(event) => handleAreaChange(event.target.value as AreaFilter)}
            className="mt-2 w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-800">難易度</span>
          <select
            value={difficultyFilter}
            onChange={(event) => handleDifficultyChange(event.target.value as DifficultyFilter)}
            className="mt-2 w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            {difficultyOptions.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'すべて' ? difficulty : difficultyLabels[difficulty]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-800">テーマ</span>
          <select
            value={categoryFilter}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={restart}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          最初からやり直す
        </button>
      </div>

      {filteredQuestions.length === 0 || !currentQuestion ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-600">
          条件に合う問題がありません。フィルタを変更してください。
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
              {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">
              {currentQuestion.area}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {currentQuestion.category}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              {difficultyLabels[currentQuestion.difficulty]}
            </span>
          </div>

          {currentQuestion.keywords && currentQuestion.keywords.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {currentQuestion.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm font-bold text-sky-800">問題</p>
            <h3 className="mt-2 text-lg font-bold leading-8 text-slate-950">{currentQuestion.question}</h3>
          </div>

          <div className="mt-5 grid gap-3">
            {currentQuestion.choices.map((choice, choiceIndex) => {
              const answeredThisChoice = selectedIndex === choiceIndex;
              const correctChoice = currentQuestion.answerIndex === choiceIndex;
              const className =
                selectedIndex === null
                  ? 'border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50'
                  : correctChoice
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : answeredThisChoice
                      ? 'border-rose-300 bg-rose-50 text-rose-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600';

              return (
                <button
                  key={`${currentQuestion.id}-${choiceIndex}`}
                  type="button"
                  disabled={selectedIndex !== null}
                  onClick={() => answer(choiceIndex)}
                  className={`rounded-xl border p-4 text-left text-sm font-semibold leading-7 transition ${className}`}
                >
                  <span className="mr-2 font-black">{optionLabel(choiceIndex)}.</span>
                  {choice}
                </button>
              );
            })}
          </div>

          {selectedIndex !== null ? (
            <div className="mt-5 space-y-4">
              <div className={`rounded-xl border p-4 ${selectedCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                <p className={`text-base font-bold ${selectedCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {selectedCorrect ? '正解' : '不正解'}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  正解は {optionLabel(currentQuestion.answerIndex)} です。
                </p>
              </div>

              {currentQuestion.approach ? (
                <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
                  <p className="text-sm font-bold text-sky-800">解法の方針</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{currentQuestion.approach}</p>
                </div>
              ) : null}

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-bold text-slate-800">解説</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{currentQuestion.explanation}</p>
              </div>

              {currentQuestion.choiceReviews && currentQuestion.choiceReviews.length > 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-800">選択肢判定</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {currentQuestion.choiceReviews.map((review) => (
                      <div key={`${currentQuestion.id}-${review.label}`} className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">{review.label}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              review.judgment === '適切' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {review.judgment}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{review.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {currentQuestion.relatedGuide ? (
                <a
                  href={currentQuestion.relatedGuide}
                  className="inline-flex rounded-lg border border-sky-700 bg-white px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-50"
                >
                  詳しく学ぶ
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">回答後に解法の方針、解説、選択肢判定が表示されます。</p>
            <button
              type="button"
              onClick={nextQuestion}
              className="rounded-lg bg-sky-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-sky-800"
            >
              次の問題へ
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
