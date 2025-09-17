// src/components/guide/ControlChart.tsx
'use client';

import React, { memo, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as C,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

C.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * 置き換えポイント
 * - 外部の '@/lib/stats' に依存せず、このファイル内で管理限界を算出
 * - propsの互換を維持しつつ、動的JSON読込（src/srcKey）に対応
 * - np図のnは nForNp（既定100）で上書き可
 */

type Props = {
  title: string;
  type: 'x' | 'np' | 'p' | 'u';
  /** 直接データを渡す（p図は割合を配列で） */
  data?: number[];
  /** p図: 各点のサンプルサイズ。未指定時は n=100 扱い / srcで {p,n} を読む場合はそちら優先 */
  sampleSizes?: number[];
  /** X̄-R: サブグループサイズ（既定 5） */
  subgroupSizeForX?: number;
  /** Y軸ラベル（未指定時は title を使用） */
  yLabel?: string;

  /** np図: サンプルサイズ（既定 100） */
  nForNp?: number;

  /** 外部JSONから読み込む（/public/data/...json など）。data未指定のとき有効 */
  src?: string;
  /** srcのキー。既定は props.type に一致 */
  srcKey?: 'x' | 'np' | 'p' | 'u';
};

/* ------------------------------ helpers ------------------------------ */

const A2_TABLE: Record<number, number> = {
  2: 1.880,
  3: 1.023,
  4: 0.729,
  5: 0.577,
  6: 0.483,
  7: 0.419,
  8: 0.373,
  9: 0.337,
  10: 0.308,
};

function mean(arr: readonly number[]): number {
  if (arr.length === 0) return 0;
  // noUncheckedIndexedAccess 対応：インデックス参照を避ける
  let s = 0;
  for (const v of arr) s += v;
  return s / arr.length;
}

function clampMinZero(v: number): number {
  return v < 0 ? 0 : v;
}

/** X̄ 管理図のCL/UCL/LCL（定数）を返す */
function xbarLimits(values: number[], subgroupSize = 5): { cl: number; ucl: number; lcl: number } {
  const n = Math.max(2, Math.floor(subgroupSize));
  const a2 = A2_TABLE[n] ?? 0.577; // デフォルトは n=5 の係数
  // 連続グルーピングでRを計算（端数は切り捨て）
  const groups: number[][] = [];
  for (let i = 0; i + n <= values.length; i += n) {
    groups.push(values.slice(i, i + n));
  }
  const ranges = groups.map((g) => Math.max(...g) - Math.min(...g));
  const rBar = mean(ranges.length ? ranges : [0]); // 端数でグループ0件なら0扱い
  const xBarBar = mean(values);
  return {
    cl: xBarBar,
    ucl: xBarBar + a2 * rBar,
    lcl: xBarBar - a2 * rBar,
  };
}

/** 長さlenの配列にCL等を展開 */
function expandToSeries(len: number, cl: number, ucl: number, lcl: number) {
  return {
    cl: Array(len).fill(cl),
    ucl: Array(len).fill(ucl),
    lcl: Array(len).fill(lcl),
  };
}

/** np管理図（各点は個数） */
function npLimits(np: number[], n = 100) {
  const pBar = np.reduce((s, v) => s + v, 0) / (np.length * n || 1);
  const npBar = n * pBar;
  const s = Math.sqrt(npBar * (1 - pBar));
  const u = npBar + 3 * s;
  const l = clampMinZero(npBar - 3 * s);
  return expandToSeries(np.length, npBar, u, l);
}

/** p管理図（各点は割合p、点ごとにnが可変） */
function pLimits(p: number[], nArr: number[]) {
  const totalN = nArr.reduce((s, v) => s + (v ?? 0), 0) || 1;
  const totalDef = p.reduce((s, v, i) => s + v * (nArr[i] ?? 0), 0);
  const pBar = totalDef / totalN;
  const cl = Array(p.length).fill(pBar);
  const ucl = p.map((_, i) => pBar + 3 * Math.sqrt((pBar * (1 - pBar)) / Math.max(1, nArr[i] ?? 1)));
  const lcl = p.map((_, i) => clampMinZero(pBar - 3 * Math.sqrt((pBar * (1 - pBar)) / Math.max(1, nArr[i] ?? 1))));
  return { cl, ucl, lcl };
}

/** u管理図（単位当たり欠点数） */
function uLimits(u: number[]) {
  const cBar = mean(u);
  const s = Math.sqrt(cBar);
  const up = cBar + 3 * s;
  const lp = clampMinZero(cBar - 3 * s);
  return expandToSeries(u.length, cBar, up, lp);
}

/** src（JSON）からのロード：{ x: number[], np: number[], p: {p:number[], n:number[]}, u:number[] } を想定 */
async function loadFromSrc(src: string): Promise<any | null> {
  try {
    const r = await fetch(src);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/* ------------------------------ component ------------------------------ */

export default memo(function ControlChart({
  title,
  type,
  data,
  sampleSizes,
  subgroupSizeForX = 5,
  yLabel,
  nForNp = 100,
  src,
  srcKey,
}: Props) {
  const [loaded, setLoaded] = useState<any | null>(null);

  // 外部JSONが指定され、dataが未指定のときだけロード
  useEffect(() => {
    let alive = true;
    if (src && (data == null || (Array.isArray(data) && data.length === 0))) {
      loadFromSrc(src).then((j) => {
        if (!alive) return;
        setLoaded(j);
      });
    } else {
      setLoaded(null);
    }
    return () => {
      alive = false;
    };
  }, [src, data]);

  // 実データを確定
  const { series, nArray } = useMemo(() => {
    const key = srcKey ?? type;
    // p図だけ特殊（{p:[], n:[]}）
    if (type === 'p') {
      if (Array.isArray(data) && data.length) {
        const ns =
          sampleSizes && sampleSizes.length === data.length
            ? sampleSizes
            : Array(data.length).fill(sampleSizes?.[0] ?? 100);
        return { series: data, nArray: ns };
      }
      if (loaded && loaded[key] && Array.isArray(loaded[key].p) && Array.isArray(loaded[key].n)) {
        return { series: loaded[key].p as number[], nArray: loaded[key].n as number[] };
      }
      return { series: [] as number[], nArray: [] as number[] };
    } else {
      // x, np, u は number[] を期待
      if (Array.isArray(data) && data.length) return { series: data, nArray: undefined };
      if (loaded && Array.isArray(loaded[key])) return { series: loaded[key] as number[], nArray: undefined };
      return { series: [] as number[], nArray: undefined };
    }
  }, [type, data, sampleSizes, loaded, srcKey]);

  const { chartData, options } = useMemo<{
    chartData: ChartData<'line', number[], string>;
    options: ChartOptions<'line'>;
  }>(() => {
    const values = series ?? [];
    const len = values.length;

    if (!len) {
      return {
        chartData: {
          labels: [],
          datasets: [],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      };
    }

    // CL/UCL/LCL 計算
    let cl: number[] = [];
    let ucl: number[] = [];
    let lcl: number[] = [];
    let yMin = 0;
    let yMax = 0;

    if (type === 'p') {
      const nArr = (nArray && nArray.length === len) ? nArray : Array(len).fill(100);
      const limits = pLimits(values, nArr);
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;
      yMax = Math.max(...values, ...ucl) * 1.1;
      yMin = Math.min(0, ...values, ...lcl) * 1.1;
    } else if (type === 'u') {
      const limits = uLimits(values);
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;
      yMax = Math.max(...values, ...ucl) * 1.1;
      yMin = Math.min(0, ...values, ...lcl) * 1.1;
    } else if (type === 'np') {
      const limits = npLimits(values, nForNp);
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;
      yMax = Math.max(...values, ...ucl) * 1.1;
      yMin = Math.min(0, ...values, ...lcl) * 1.1;
    } else {
      // 'x'
      const { cl: c0, ucl: u0, lcl: l0 } = xbarLimits(values, subgroupSizeForX);
      const expanded = expandToSeries(len, c0, u0, l0);
      cl = expanded.cl; ucl = expanded.ucl; lcl = expanded.lcl;
      yMax = Math.max(...values, ...ucl) * 1.1;
      yMin = Math.min(...values, ...lcl) * 0.9;
    }

    const labels = Array.from({ length: len }, (_, i) => `${i + 1}`);

    const chartData: ChartData<'line', number[], string> = {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,.2)',
          borderWidth: 2,
          pointRadius: 3,
        },
        { label: 'CL', data: cl, borderColor: 'green', borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
        { label: 'UCL', data: ucl, borderColor: 'red', borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
        { label: 'LCL', data: lcl, borderColor: 'red', borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: {
          title: { display: true, text: 'サンプル群番号' },
          ticks: {
            callback: (_v, i) => ((i + 1) % 2 === 0 ? `${i + 1}` : ''),
            autoSkip: false,
          },
        },
        y: {
          title: { display: true, text: yLabel ?? title },
          min: yMin,
          max: yMax,
        },
      },
    };

    return { chartData, options };
  }, [series, nArray, type, subgroupSizeForX, nForNp, title, yLabel]);

  // カードUI
  const card: React.CSSProperties = useMemo(
    () => ({
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 16,
      padding: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,.04)',
    }),
    []
  );

  return (
    <div style={card}>
      <div style={{ height: 260 }}>
        {chartData.labels && chartData.labels.length ? (
          <Line data={chartData as any} options={options as any} />
        ) : (
          <div style={{ color: '#6b7280', fontSize: 14 }}>データがありません</div>
        )}
      </div>
    </div>
  );
});
