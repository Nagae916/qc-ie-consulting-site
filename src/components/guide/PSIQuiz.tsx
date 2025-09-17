// src/components/guide/PSIQuiz.tsx
'use client';

import React, { useState } from 'react';

export type MCQ = {
  question: React.ReactNode;
  choices: React.ReactNode[];
  answer: number;
  rationale?: React.ReactNode;
};

export default function PSIQuiz({ items }: { items: MCQ[] }) {
  const total = items.length;
  const [answered, setAnswered] = useState<boolean[]>(() => items.map(() => false));
  const [correct, setCorrect] = useState<boolean[]>(() => items.map(() => false));
  const [picked, setPicked] = useState<(number | null)[]>(() => items.map(() => null));

  const score = correct.filter(Boolean).length;

  const reset = () => {
    setAnswered(items.map(() => false));
    setCorrect(items.map(() => false));
    setPicked(items.map(() => null));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h3 className="text-xl font-bold text-sky-700">理解度チェック</h3>
          <p className="text-gray-600 text-sm">学習内容の定着度を確認しましょう。</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">スコア</p>
          <p className="text-2xl font-extrabold text-sky-600">
            {score} <span className="text-gray-400">/ {total}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((q, qi) => {
          const done = answered[qi];
          const ok = correct[qi];
          const sel = picked[qi];

          return (
            <div key={qi} className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-1">
                {q.choices.map((c, ci) => (
                  <label key={ci} className="block cursor-pointer rounded p-2 hover:bg-slate-50">
                    <input
                      className="mr-2"
                      type="radio"
                      name={`q${qi}`}
                      disabled={done}
                      checked={sel === ci}
                      onChange={() =>
                        setPicked((prev) => {
                          const n = [...prev];
                          n[qi] = ci;
                          return n;
                        })
                      }
                    />
                    {c}
                  </label>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="rounded bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                  disabled={done || sel === null}
                  onClick={() => {
                    setAnswered((prev) => prev.map((v, i) => (i === qi ? true : v)));
                    setCorrect((prev) => prev.map((v, i) => (i === qi ? sel === q.answer : v)));
                  }}
                >
                  答えを確認
                </button>
                {done && (
                  <span
                    className={`rounded px-2 py-1 text-sm font-bold ${
                      ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {ok ? '正解！' : '不正解'}
                  </span>
                )}
              </div>

              {done && (
                <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                  {ok ? q.rationale ?? 'Good!' : (
                    <>
                      正解は「{q.choices[q.answer]}」です。
                      {q.rationale ? <div className="mt-1">{q.rationale}</div> : null}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="mt-6 w-full md:w-auto rounded bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-600"
        onClick={reset}
      >
        もう一度挑戦する
      </button>
    </div>
  );
}
