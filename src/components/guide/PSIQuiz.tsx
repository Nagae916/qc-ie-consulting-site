// src/components/guide/PSIQuiz.tsx
'use client';

import React, { useState } from 'react';

type Question = {
  q: string;
  choices: string[];
  answer: number;
  explain?: string;
};

export default function PSIQuiz({ items }: { items?: Question[] }) {
  const [answered, setAnswered] = useState<Record<number, number | null>>({});

  const qs: Question[] =
    items && items.length
      ? items
      : [
          {
            q: "PSI管理の主目的で最も適切なのは？",
            choices: [
              "販売利益の最大化のみを最優先",
              "品質向上のため在庫を常に厚く持つ",
              "P・S・Iを統合管理し過剰在庫と欠品を回避する",
              "生産コスト最小化を最優先し欠品は許容",
            ],
            answer: 2,
            explain: "3要素のバランス最適化が核です。",
          },
        ];

  const pick = (i: number, c: number) => setAnswered((prev) => ({ ...prev, [i]: c }));

  return (
    <section className="space-y-3">
      {qs.map((q, i) => {
        const picked = answered[i] ?? null;
        const verdict = picked === null ? "none" : picked === q.answer ? "correct" : "wrong";
        return (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-semibold">{i + 1}. {q.q}</p>
            <div className="mt-2 grid gap-2">
              {q.choices.map((txt, ci) => (
                <label
                  key={ci}
                  className={`flex items-center gap-2 rounded-md border p-2 cursor-pointer ${
                    picked === ci ? "border-sky-500 ring-2 ring-sky-200" : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={picked === ci}
                    onChange={() => pick(i, ci)}
                  />
                  <span>{txt}</span>
                </label>
              ))}
            </div>

            {verdict !== "none" && (
              <div
                className={`mt-3 rounded-md border-l-4 p-3 text-sm ${
                  verdict === "correct"
                    ? "border-l-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-l-red-500 bg-red-50 text-red-800"
                }`}
              >
                {verdict === "correct" ? "正解！" : `不正解。正解は「${q.choices[q.answer]}」です。`}
                {q.explain && <div className="mt-1">{q.explain}</div>}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
