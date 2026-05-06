'use client';

import { useMemo, useState } from 'react';

type Stats = {
  sorted: number[];
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
};

type HistogramBin = {
  label: string;
  count: number;
};

const INITIAL_VALUES = [49, 50, 50, 51, 50, 40, 45, 55, 60, 52];

function parseValues(input: string): number[] {
  return input
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function calculateStats(values: number[]): Stats | null {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((acc, value) => acc + value, 0);
  const mean = sum / n;
  const middle = Math.floor(n / 2);

  const median = n % 2 === 0 ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2 : sorted[middle] ?? 0;
  const min = sorted[0] ?? 0;
  const max = sorted[n - 1] ?? 0;
  const range = max - min;
  const squaredDiffs = sorted.map((value) => (value - mean) ** 2);
  const variance = squaredDiffs.reduce((acc, value) => acc + value, 0) / n;
  const standardDeviation = Math.sqrt(variance);

  return {
    sorted,
    mean,
    median,
    min,
    max,
    range,
    variance,
    standardDeviation,
  };
}

function buildHistogram(values: number[], binCount = 5): HistogramBin[] {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [
      {
        label: `${min}`,
        count: values.length,
      },
    ];
  }

  const width = (max - min) / binCount;

  return Array.from({ length: binCount }, (_, index) => {
    const lower = min + width * index;
    const upper = index === binCount - 1 ? max : min + width * (index + 1);
    const count = values.filter((value) => {
      if (index === binCount - 1) {
        return value >= lower && value <= upper;
      }
      return value >= lower && value < upper;
    }).length;

    return {
      label: `${round(lower, 1)}〜${round(upper, 1)}`,
      count,
    };
  });
}

export default function DescriptiveStatsExplorer() {
  const [input, setInput] = useState(INITIAL_VALUES.join(', '));

  const values = useMemo(() => parseValues(input), [input]);
  const stats = useMemo(() => calculateStats(values), [values]);
  const histogram = useMemo(() => buildHistogram(values), [values]);
  const maxCount = Math.max(...histogram.map((bin) => bin.count), 1);

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-500">インタラクティブ教材</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">平均・中央値・ばらつきを触って確認する</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          カンマ区切りで数値を入力すると、平均値、中央値、範囲、分散、標準偏差、簡易ヒストグラムが更新されます。
          外れ値を追加すると、平均値と中央値の違いが分かりやすくなります。
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">データ</span>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-sm leading-6 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="例：49, 50, 50, 51, 50, 40, 45, 55, 60"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setInput('49, 50, 50, 51, 50')}
          className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          安定した工程
        </button>
        <button
          type="button"
          onClick={() => setInput('40, 45, 50, 55, 60')}
          className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ばらつき大
        </button>
        <button
          type="button"
          onClick={() => setInput('49, 50, 50, 51, 100')}
          className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          外れ値あり
        </button>
      </div>

      {stats ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">平均値</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{round(stats.mean)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">中央値</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{round(stats.median)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">範囲</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{round(stats.range)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">標準偏差</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{round(stats.standardDeviation)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900">要約統計量</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">データ数</dt>
                  <dd className="font-semibold text-slate-900">{values.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">最小値</dt>
                  <dd className="font-semibold text-slate-900">{round(stats.min)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">最大値</dt>
                  <dd className="font-semibold text-slate-900">{round(stats.max)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">分散</dt>
                  <dd className="font-semibold text-slate-900">{round(stats.variance)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                ここでは、手元のデータ全体を対象とする母分散として計算しています。
                標本から母集団を推定する場合は、不偏分散を用いる場面があります。
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900">簡易ヒストグラム</h3>
              <div className="mt-4 space-y-3">
                {histogram.map((bin) => (
                  <div key={bin.label} className="grid grid-cols-[96px_1fr_32px] items-center gap-3 text-sm">
                    <span className="text-xs text-slate-500">{bin.label}</span>
                    <div className="h-5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${(bin.count / maxCount) * 100}%` }} />
                    </div>
                    <span className="text-right font-semibold text-slate-800">{bin.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
            <p className="font-bold">読み取りポイント</p>
            <p className="mt-1">
              平均値と中央値が大きく離れている場合、外れ値や偏った分布が存在する可能性があります。
              品質管理では、平均だけで判断せず、標準偏差やヒストグラムも確認することが重要です。
            </p>
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">有効な数値をカンマ区切りで入力してください。</p>
      )}
    </section>
  );
}
