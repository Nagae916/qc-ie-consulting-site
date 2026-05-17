'use client';

import { useState } from 'react';

type Measure = {
  time: number;
  value: number;
  missing?: boolean;
};

type SubjectLine = {
  id: string;
  group: 'A' | 'B';
  values: Measure[];
};

type Scenario = {
  id: string;
  label: string;
  summary: string;
  lines: SubjectLine[];
  groupTrend: string;
  subjectMessage: string;
  timeDiff: string;
  missingNote: string;
};

const scenarios: Scenario[] = [
  {
    id: 'small-difference',
    label: '推移差が小さい',
    summary: 'A群とB群の平均推移が近い例です。',
    groupTrend: '群平均の推移は近く、最終時点の差も小さいです。',
    subjectMessage: '個人ごとの線は上下しますが、全体として大きな群差は見えにくいです。',
    timeDiff: 'timeの効果はありますが、treatment × time は強くなさそうです。',
    missingNote: '欠測はなく、全時点の情報を使いやすい構造です。',
    lines: [
      { id: 'a1', group: 'A', values: [{ time: 0, value: 50 }, { time: 1, value: 54 }, { time: 2, value: 56 }, { time: 3, value: 58 }] },
      { id: 'a2', group: 'A', values: [{ time: 0, value: 52 }, { time: 1, value: 55 }, { time: 2, value: 57 }, { time: 3, value: 59 }] },
      { id: 'b1', group: 'B', values: [{ time: 0, value: 51 }, { time: 1, value: 55 }, { time: 2, value: 58 }, { time: 3, value: 60 }] },
      { id: 'b2', group: 'B', values: [{ time: 0, value: 53 }, { time: 1, value: 56 }, { time: 2, value: 59 }, { time: 3, value: 61 }] },
    ],
  },
  {
    id: 'widening',
    label: '時間とともに差が広がる',
    summary: '時間が進むほどB群の改善が大きくなる例です。',
    groupTrend: '時点が進むほど群平均の差が広がります。',
    subjectMessage: '個人ごとの線にも、B群の傾きが大きい傾向が見えます。',
    timeDiff: 'treatment × time を見ることで、群差が時間で変化するかを確認します。',
    missingNote: '欠測はなく、推移差を素直に追いやすい例です。',
    lines: [
      { id: 'a1', group: 'A', values: [{ time: 0, value: 50 }, { time: 1, value: 53 }, { time: 2, value: 55 }, { time: 3, value: 56 }] },
      { id: 'a2', group: 'A', values: [{ time: 0, value: 52 }, { time: 1, value: 54 }, { time: 2, value: 56 }, { time: 3, value: 57 }] },
      { id: 'b1', group: 'B', values: [{ time: 0, value: 51 }, { time: 1, value: 57 }, { time: 2, value: 64 }, { time: 3, value: 70 }] },
      { id: 'b2', group: 'B', values: [{ time: 0, value: 53 }, { time: 1, value: 59 }, { time: 2, value: 66 }, { time: 3, value: 72 }] },
    ],
  },
  {
    id: 'final-only-risk',
    label: '最終時点だけ見ると誤解',
    summary: '最終時点は近いが、途中の推移が異なる例です。',
    groupTrend: '最終時点の差は小さくても、途中の推移は異なります。',
    subjectMessage: 'B群は一度大きく上がり、その後A群に近づいています。',
    timeDiff: '最終時点だけでは、時間変化の違いを見落とします。',
    missingNote: '欠測はなく、全体の推移を比較できます。',
    lines: [
      { id: 'a1', group: 'A', values: [{ time: 0, value: 50 }, { time: 1, value: 55 }, { time: 2, value: 59 }, { time: 3, value: 62 }] },
      { id: 'a2', group: 'A', values: [{ time: 0, value: 52 }, { time: 1, value: 56 }, { time: 2, value: 60 }, { time: 3, value: 63 }] },
      { id: 'b1', group: 'B', values: [{ time: 0, value: 51 }, { time: 1, value: 65 }, { time: 2, value: 66 }, { time: 3, value: 63 }] },
      { id: 'b2', group: 'B', values: [{ time: 0, value: 53 }, { time: 1, value: 67 }, { time: 2, value: 67 }, { time: 3, value: 64 }] },
    ],
  },
  {
    id: 'missing',
    label: '一部欠測あり',
    summary: '途中または最終時点に欠測がある例です。',
    groupTrend: '観測されたデータではB群の推移が高めに見えます。',
    subjectMessage: '欠測がある対象も、欠測前までの推移情報を持っています。',
    timeDiff: '欠測を無視して最終時点だけを見ると、使える情報が減ります。',
    missingNote: 'MMRMでは欠測の理由と仮定を意識します。MARなどの説明は本文側で確認します。',
    lines: [
      { id: 'a1', group: 'A', values: [{ time: 0, value: 50 }, { time: 1, value: 54 }, { time: 2, value: 58 }, { time: 3, value: 60 }] },
      { id: 'a2', group: 'A', values: [{ time: 0, value: 52 }, { time: 1, value: 55 }, { time: 2, value: 57 }, { time: 3, value: 0, missing: true }] },
      { id: 'b1', group: 'B', values: [{ time: 0, value: 51 }, { time: 1, value: 58 }, { time: 2, value: 64 }, { time: 3, value: 68 }] },
      { id: 'b2', group: 'B', values: [{ time: 0, value: 53 }, { time: 1, value: 60 }, { time: 2, value: 0, missing: true }, { time: 3, value: 0, missing: true }] },
    ],
  },
];

const colors = {
  A: '#2563eb',
  B: '#dc2626',
};

function xForTime(time: number): number {
  return 44 + time * 78;
}

function yForValue(value: number): number {
  return 190 - ((value - 45) / 32) * 150;
}

function linePoints(values: Measure[]): string {
  return values
    .filter((value) => !value.missing)
    .map((value) => `${xForTime(value.time)},${yForValue(value.value)}`)
    .join(' ');
}

export default function MMRMRepeatedMeasuresExplorer() {
  const [selectedId, setSelectedId] = useState(scenarios[1]?.id ?? scenarios[0]?.id ?? '');
  const firstScenario = scenarios[0];

  if (!firstScenario) {
    return null;
  }

  const scenario = scenarios.find((item) => item.id === selectedId) ?? firstScenario;

  return (
    <section className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
              item.id === scenario.id
                ? 'border-teal-600 bg-teal-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-bold text-slate-900">複数時点データの推移</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{scenario.summary}</p>
          <svg viewBox="0 0 330 230" role="img" aria-label="反復測定データの推移グラフ" className="mt-3 h-64 w-full rounded-lg bg-white">
            <line x1="36" y1="190" x2="300" y2="190" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="36" y1="30" x2="36" y2="190" stroke="#cbd5e1" strokeWidth="2" />
            {[0, 1, 2, 3].map((time) => (
              <g key={time}>
                <line x1={xForTime(time)} y1="188" x2={xForTime(time)} y2="194" stroke="#94a3b8" />
                <text x={xForTime(time)} y="212" textAnchor="middle" className="fill-slate-500 text-[11px]">T{time}</text>
              </g>
            ))}
            {scenario.lines.map((line) => (
              <g key={line.id}>
                <polyline points={linePoints(line.values)} fill="none" stroke={colors[line.group]} strokeWidth="2" opacity="0.5" />
                {line.values.map((value) => (
                  <circle
                    key={`${line.id}-${value.time}`}
                    cx={xForTime(value.time)}
                    cy={value.missing ? 202 : yForValue(value.value)}
                    r={value.missing ? 4 : 5}
                    fill={value.missing ? '#94a3b8' : colors[line.group]}
                    opacity={value.missing ? 0.7 : 0.9}
                  />
                ))}
              </g>
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />A群</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-600" />B群</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />欠測</span>
          </div>
        </div>

        <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
          <h3 className="text-base font-bold text-teal-950">MMRMが見ていること</h3>
          <dl className="mt-4 space-y-3 text-sm leading-6 text-teal-950">
            <div>
              <dt className="font-bold">群平均の推移</dt>
              <dd>{scenario.groupTrend}</dd>
            </div>
            <div>
              <dt className="font-bold">個人ごとの線</dt>
              <dd>{scenario.subjectMessage}</dd>
            </div>
            <div>
              <dt className="font-bold">時点ごとの差</dt>
              <dd>{scenario.timeDiff}</dd>
            </div>
            <div>
              <dt className="font-bold">欠測の注意</dt>
              <dd>{scenario.missingNote}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <TermCard title="treatment" body="群や処理条件の違いを見る" />
        <TermCard title="time" body="時点による変化を見る" />
        <TermCard title="treatment × time" body="群差が時点で変わるかを見る" />
        <TermCard title="baseline" body="開始時点の差を調整する" />
      </div>
    </section>
  );
}

function TermCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
