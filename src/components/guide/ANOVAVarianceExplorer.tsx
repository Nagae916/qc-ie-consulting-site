'use client';

import { useState } from 'react';

type GroupData = {
  label: string;
  values: number[];
  color: string;
};

type Scenario = {
  id: string;
  label: string;
  summary: string;
  groups: GroupData[];
  between: string;
  within: string;
  fMessage: string;
  point: string;
};

const scenarios: Scenario[] = [
  {
    id: 'small-between-small-within',
    label: '群間差小・群内ばらつき小',
    summary: '平均値は少し違うが、群どうしはかなり近い例です。',
    groups: [
      { label: 'A', values: [48, 50, 51, 49, 52], color: '#2563eb' },
      { label: 'B', values: [51, 52, 53, 50, 54], color: '#059669' },
      { label: 'C', values: [50, 52, 54, 53, 51], color: '#d97706' },
    ],
    between: '群平均は近く、群間の違いは小さく見えます。',
    within: '各群の点もまとまっており、群内ばらつきは小さいです。',
    fMessage: '群間の違いも群内ばらつきも小さいため、F値は大きくなりにくい状況です。',
    point: '平均値が少し違っても、それだけで条件差があるとは判断しません。',
  },
  {
    id: 'large-between-small-within',
    label: '群間差大・群内ばらつき小',
    summary: '群平均が離れ、各群の点がまとまっている例です。',
    groups: [
      { label: 'A', values: [44, 45, 46, 45, 47], color: '#2563eb' },
      { label: 'B', values: [54, 55, 56, 55, 57], color: '#059669' },
      { label: 'C', values: [64, 65, 66, 65, 67], color: '#d97706' },
    ],
    between: '群平均がはっきり離れており、群間の違いが大きく見えます。',
    within: '各群の点はまとまっており、群内ばらつきは小さいです。',
    fMessage: '群間の違いが群内ばらつきに比べて大きいため、F値は大きくなりやすい状況です。',
    point: 'ANOVAが差を捉えやすい典型例です。',
  },
  {
    id: 'large-between-large-within',
    label: '群間差大・群内ばらつき大',
    summary: '平均値は離れているが、各群の点も大きく散らばる例です。',
    groups: [
      { label: 'A', values: [35, 42, 46, 52, 59], color: '#2563eb' },
      { label: 'B', values: [45, 52, 56, 62, 69], color: '#059669' },
      { label: 'C', values: [55, 62, 66, 72, 79], color: '#d97706' },
    ],
    between: '群平均は離れているため、群間差は大きく見えます。',
    within: 'ただし各群の点も広く散らばり、群内ばらつきが大きいです。',
    fMessage: '群間差があっても群内ばらつきが大きいと、F値は見かけほど大きくなりません。',
    point: '平均差だけでなく、群内ばらつきとの比で見ることが重要です。',
  },
];

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export default function ANOVAVarianceExplorer() {
  const [selectedId, setSelectedId] = useState(scenarios[1]?.id ?? scenarios[0]?.id ?? '');
  const firstScenario = scenarios[0];

  if (!firstScenario) {
    return null;
  }

  const scenario = scenarios.find((item) => item.id === selectedId) ?? firstScenario;

  const allValues = scenario.groups.flatMap((group) => group.values);
  const min = Math.min(...allValues) - 4;
  const max = Math.max(...allValues) + 4;
  const span = Math.max(max - min, 1);

  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
              item.id === scenario.id
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-bold text-slate-900">データ点と各群の平均</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{scenario.summary}</p>

          <div className="mt-4 space-y-4">
            {scenario.groups.map((group) => {
              const groupMean = mean(group.values);
              const meanPosition = ((groupMean - min) / span) * 100;

              return (
                <div key={group.label} className="rounded-lg bg-white p-3">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                    <span>群 {group.label}</span>
                    <span>平均 {round(groupMean)}</span>
                  </div>
                  <div className="relative mt-3 h-10 rounded-full bg-slate-100">
                    {group.values.map((value, index) => (
                      <span
                        key={`${group.label}-${value}-${index}`}
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ring-2 ring-white"
                        style={{ left: `${((value - min) / span) * 100}%`, backgroundColor: group.color }}
                        title={`${value}`}
                      />
                    ))}
                    <span
                      className="absolute top-0 h-10 w-0.5 bg-slate-900"
                      style={{ left: `${meanPosition}%` }}
                      title={`平均 ${round(groupMean)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
          <h3 className="text-base font-bold text-sky-950">このデータでANOVAが見ていること</h3>
          <dl className="mt-4 space-y-3 text-sm leading-6 text-sky-950">
            <div>
              <dt className="font-bold">群間差の見え方</dt>
              <dd>{scenario.between}</dd>
            </div>
            <div>
              <dt className="font-bold">群内ばらつきの見え方</dt>
              <dd>{scenario.within}</dd>
            </div>
            <div>
              <dt className="font-bold">F値の直感</dt>
              <dd>{scenario.fMessage}</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-lg bg-white p-3 text-center text-sm font-bold text-slate-900">
            群間の違い ÷ 群内のばらつき
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
        <p className="font-bold">学習ポイント</p>
        <p className="mt-1">{scenario.point}</p>
      </div>
    </section>
  );
}
