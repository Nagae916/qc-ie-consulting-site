'use client';

import { useState } from 'react';

type Point = {
  id: string;
  group: 'A' | 'B';
  baseline: number;
  outcome: number;
};

type Scenario = {
  id: string;
  label: string;
  unadjustedDiff: string;
  adjustedDiff: string;
  baselineBias: string;
  relation: string;
  message: string;
  points: Point[];
};

const scenarios: Scenario[] = [
  {
    id: 'balanced',
    label: 'ベースライン差なし',
    unadjustedDiff: '約 4 点',
    adjustedDiff: '約 4 点',
    baselineBias: 'A群とB群の開始時点はほぼ同じです。',
    relation: '共変量の偏りが小さいため、未調整と調整後の差は近くなります。',
    message: '共変量がそろっている場合、単純平均比較でも大きな誤解は起きにくい例です。',
    points: [
      { id: 'a1', group: 'A', baseline: 42, outcome: 58 },
      { id: 'a2', group: 'A', baseline: 48, outcome: 61 },
      { id: 'a3', group: 'A', baseline: 54, outcome: 66 },
      { id: 'b1', group: 'B', baseline: 43, outcome: 62 },
      { id: 'b2', group: 'B', baseline: 49, outcome: 66 },
      { id: 'b3', group: 'B', baseline: 55, outcome: 70 },
    ],
  },
  {
    id: 'baseline-gap',
    label: 'ベースライン差あり',
    unadjustedDiff: '約 10 点',
    adjustedDiff: '約 3 点',
    baselineBias: 'B群は開始時点から高めです。',
    relation: '未調整では差が大きく見えますが、開始時点をそろえると差は小さくなります。',
    message: '未調整平均差が、そのまま処置効果とは限らないことを示す例です。',
    points: [
      { id: 'a1', group: 'A', baseline: 35, outcome: 50 },
      { id: 'a2', group: 'A', baseline: 41, outcome: 55 },
      { id: 'a3', group: 'A', baseline: 46, outcome: 60 },
      { id: 'b1', group: 'B', baseline: 52, outcome: 64 },
      { id: 'b2', group: 'B', baseline: 58, outcome: 70 },
      { id: 'b3', group: 'B', baseline: 63, outcome: 75 },
    ],
  },
  {
    id: 'strong-covariate',
    label: '共変量との関連が強い',
    unadjustedDiff: '約 9 点',
    adjustedDiff: '約 2 点',
    baselineBias: 'B群はベースラインが高く、アウトカムも高く見えます。',
    relation: 'ベースラインとアウトカムの関係が強いため、調整の影響が大きくなります。',
    message: '共変量が結果に強く関係するほど、単純平均比較は誤解を生みやすくなります。',
    points: [
      { id: 'a1', group: 'A', baseline: 34, outcome: 48 },
      { id: 'a2', group: 'A', baseline: 42, outcome: 58 },
      { id: 'a3', group: 'A', baseline: 50, outcome: 67 },
      { id: 'b1', group: 'B', baseline: 48, outcome: 62 },
      { id: 'b2', group: 'B', baseline: 58, outcome: 73 },
      { id: 'b3', group: 'B', baseline: 66, outcome: 82 },
    ],
  },
  {
    id: 'weak-covariate',
    label: '共変量との関連が弱い',
    unadjustedDiff: '約 5 点',
    adjustedDiff: '約 5 点',
    baselineBias: 'ベースラインに少し偏りがあります。',
    relation: '共変量とアウトカムの関係が弱いため、調整しても差はあまり変わりません。',
    message: '共変量を入れる意味は、共変量が結果にどれだけ関係するかにも依存します。',
    points: [
      { id: 'a1', group: 'A', baseline: 36, outcome: 60 },
      { id: 'a2', group: 'A', baseline: 45, outcome: 58 },
      { id: 'a3', group: 'A', baseline: 57, outcome: 62 },
      { id: 'b1', group: 'B', baseline: 48, outcome: 66 },
      { id: 'b2', group: 'B', baseline: 61, outcome: 64 },
      { id: 'b3', group: 'B', baseline: 68, outcome: 67 },
    ],
  },
];

const groupColor = {
  A: '#2563eb',
  B: '#dc2626',
};

export default function ANCOVAAdjustmentExplorer() {
  const [selectedId, setSelectedId] = useState(scenarios[1]?.id ?? scenarios[0]?.id ?? '');
  const firstScenario = scenarios[0];

  if (!firstScenario) {
    return null;
  }

  const scenario = scenarios.find((item) => item.id === selectedId) ?? firstScenario;

  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
              item.id === scenario.id
                ? 'border-violet-600 bg-violet-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <SummaryCard title="未調整比較" value={scenario.unadjustedDiff} body="群ごとの単純平均差を見ます。" />
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-bold text-slate-900">共変量とアウトカム</h3>
          <svg viewBox="0 0 320 220" role="img" aria-label="共変量とアウトカムの散布図" className="mt-3 h-56 w-full rounded-lg bg-white">
            <line x1="36" y1="188" x2="300" y2="188" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="36" y1="20" x2="36" y2="188" stroke="#cbd5e1" strokeWidth="2" />
            <text x="160" y="212" textAnchor="middle" className="fill-slate-500 text-[11px]">baseline</text>
            <text x="8" y="104" transform="rotate(-90 8 104)" textAnchor="middle" className="fill-slate-500 text-[11px]">outcome</text>
            {scenario.points.map((point) => (
              <circle
                key={point.id}
                cx={36 + ((point.baseline - 30) / 45) * 250}
                cy={188 - ((point.outcome - 45) / 42) * 150}
                r="6"
                fill={groupColor[point.group]}
                opacity="0.85"
              />
            ))}
          </svg>
          <div className="mt-3 flex gap-4 text-xs font-semibold text-slate-600">
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />A群</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-600" />B群</span>
          </div>
        </div>
        <SummaryCard title="調整後比較" value={scenario.adjustedDiff} body="共変量をそろえた条件で群間差を見ます。" />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <InfoCard title="ベースライン値の偏り" body={scenario.baselineBias} />
        <InfoCard title="共変量とアウトカムの関係" body={scenario.relation} />
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
        <p className="font-bold">この教材で理解すること</p>
        <p className="mt-1">{scenario.message}</p>
      </div>
    </section>
  );
}

function SummaryCard({ title, value, body }: { title: string; value: string; body: string }) {
  return (
    <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
      <h3 className="text-base font-bold text-violet-950">{title}</h3>
      <p className="mt-4 text-3xl font-black text-violet-700">{value}</p>
      <p className="mt-3 text-sm leading-6 text-violet-950">{body}</p>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
      <p className="font-bold text-slate-900">{title}</p>
      <p className="mt-1">{body}</p>
    </div>
  );
}
