'use client';

import { useMemo, useState } from 'react';
import { DS_CERTIFICATION_QUESTIONS, type DSQuestionArea } from '@/data/ds-certification-questions';

const areaOptions: Array<'すべて' | DSQuestionArea> = ['すべて', '基盤', 'データサイエンス', 'データエンジニアリング', '価値創造'];

function percent(correct: number, answered: number) {
  if (answered <= 0) return 0;
  return Math.round((correct / answered) * 100);
}

export default function DSQuizTrainer() {
  const [areaFilter, setAreaFilter] = useState<'すべて' | DSQuestionArea>('すべて');
  const [categoryFilter, setCategoryFilter] = useState('すべて');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);

  const categories = useMemo(() => {
    const targetQuestions =
      areaFilter === 'すべて'
        ? DS_CERTIFICATION_QUESTIONS
        : DS_CERTIFICATION_QUESTIONS.filter((question) => question.area === areaFilter);
    return ['すべて', ...Array.from(new Set(targetQuestions.map((question) => question.category))).sort((a, b) => a.localeCompare(b, 'ja'))];
  }, [areaFilter]);

  const filteredQuestions = useMemo(() => {
    return DS_CERTIFICATION_QUESTIONS.filter((question) => {
      const areaMatched = areaFilter === 'すべて' || question.area === areaFilter;
      const categoryMatched = categoryFilter === 'すべて' || question.category === categoryFilter;
      return areaMatched && categoryMatched;
    });
  }, [areaFilter, categoryFilter]);

  const currentQuestion = filteredQuestions[currentIndex] ?? filteredQuestions[0];
  const selectedCorrect = currentQuestion ? selectedIndex === currentQuestion.answerIndex : false;
  const answerRate = percent(correct, answered);

  function resetPosition() {
    setCurrentIndex(0);
    setSelectedIndex(null);
  }

  function handleAreaChange(value: 'すべて' | DSQuestionArea) {
    setAreaFilter(value);
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

  function resetScore() {
    setAnswered(0);
    setCorrect(0);
    setSelectedIndex(null);
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-700">DS Certification Practice</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">DS検定 4択演習</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            公式・過去問系の出題観点を参考にしたオリジナル類題です。領域やカテゴリで絞り込み、間違えたテーマは関連ガイドで復習できます。
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

      <div className="mt-6 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-end">
        <label className="block">
          <span className="text-sm font-bold text-slate-800">領域フィルタ</span>
          <select
            value={areaFilter}
            onChange={(event) => handleAreaChange(event.target.value as 'すべて' | DSQuestionArea)}
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
          <span className="text-sm font-bold text-slate-800">カテゴリフィルタ</span>
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

        <button type="button" onClick={resetScore} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
          スコアをリセット
        </button>
      </div>

      {filteredQuestions.length === 0 || !currentQuestion ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-600">
          該当する問題がありません。
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
              {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">{currentQuestion.area}</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">{currentQuestion.category}</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{currentQuestion.skill}</span>
          </div>

          <h3 className="mt-5 text-xl font-bold leading-8 text-slate-950">{currentQuestion.question}</h3>

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
                  key={`${currentQuestion.id}-${choice}`}
                  type="button"
                  disabled={selectedIndex !== null}
                  onClick={() => answer(choiceIndex)}
                  className={`rounded-xl border p-4 text-left text-sm font-semibold leading-7 transition ${className}`}
                >
                  <span className="mr-2 font-black">{String.fromCharCode(65 + choiceIndex)}.</span>
                  {choice}
                </button>
              );
            })}
          </div>

          {selectedIndex !== null ? (
            <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
              <p className={`text-base font-bold ${selectedCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                {selectedCorrect ? '正解です' : '不正解です'}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{currentQuestion.explanation}</p>
              {currentQuestion.relatedGuide ? (
                <a href={currentQuestion.relatedGuide} className="mt-4 inline-flex rounded-lg border border-sky-700 bg-white px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-50">
                  関連ガイドで復習
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">回答後に解説と復習リンクが表示されます。</p>
            <button type="button" onClick={nextQuestion} className="rounded-lg bg-sky-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-sky-800">
              次の問題へ
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
