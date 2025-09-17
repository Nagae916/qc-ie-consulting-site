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
 * 改善点
 * - 入力配列を数値化＆NaN除去（sanitizeSeries）
 * - p図のY軸/ツールチップを % 表示（0–100%）に統一
 * - 空データ時の安全なオプションと表示
 * - 既存Props・挙動は互換維持
 */

type Props = {
  title: string;
  type: 'x' | 'np' | 'p' | 'u';
  /** 直接データを渡す（p図は割合(0..1)の配列） */
  data?: number[];
  /** p図の各点サンプルサイズ（n_i）。未指定時は全点 n=100 扱い */
  sampleSizes?: number[];
  /** X̄–R: サブグループサイズ（既定 5） */
  subgroupSizeForX?: number;
  /** Y軸ラベル（未指定時は title を使用） */
  yLabel?: string;
  /** np図: サンプルサイズ（既定 100） */
  nForNp?: number;
  /** 外部JSONから読み込む（/public/data/*.json など）。data未指定のとき有効 */
  src?: string;
  /** src のキー。既定は props.type に一致 */
  srcKey?: 'x' | 'np' | 'p' | 'u';
};

/* ------------------------------ helpers ------------------------------ */

const A2_TABLE: Record<number, number> = {
  2: 1.88, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483,
  7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308,
};

const clampMinZero = (v: number) => (v < 0 ? 0 : v);

function mean(arr: number[]): number {
  if (!arr.length) return 0;
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i];
  return s / arr.length;
}

/** 数値化＋有限値のみ抽出（NaN/±∞除去） */
function sanitizeSeries(arr: unknown[] | undefined | null): number[] {
  if (!Array.isArray(arr)) return [];
  const out: number[] = [];
  for (const v of arr) {
    const n = Number(v);
    if (Number.isFinite(n)) out.push(n);
  }
  return out;
}

/** X̄ 管理図の CL/UCL/LCL（A2 係数） */
function xbarLimits(values: number[], subgroupSize = 5): { cl: number; ucl: number; lcl: number } {
  const n = Math.max(2, Math.floor(subgroupSize));
  const a2 = A2_TABLE[n] ?? A2_TABLE[5];
  // 連続グルーピング（端数は無視）
  const groups: number[][] = [];
  for (let i = 0; i + n <= values.length; i += n) groups.push(values.slice(i, i + n));
  const ranges = groups.map((g) => Math.max(...g) - Math.min(...g));
  const rBar = mean(ranges.length ? ranges : [0]);
  const xBarBar = mean(values);
  return { cl: xBarBar, ucl: xBarBar + a2 * rBar, lcl: xBarBar - a2 * rBar };
}

/** 長さlenの配列にCL等を展開 */
function expandToSeries(len: number, cl: number, ucl: number, lcl: number) {
  return { cl: Array(len).fill(cl), ucl: Array(len).fill(ucl), lcl: Array(len).fill(lcl) };
}

/** np 管理図（各点は個数） */
function npLimits(np: number[], n = 100) {
  const m = np.length || 1;
  const total = np.reduce((s, v) => s + v, 0);
  const pBar = total / (m * n);
  const npBar = n * pBar;
  const s = Math.sqrt(n * pBar * (1 - pBar));
  const u = npBar + 3 * s;
  const l = clampMinZero(npBar - 3 * s);
  return expandToSeries(np.length, npBar, u, l);
}

/** p 管理図（各点は割合 p、点ごとに n が可変） */
function pLimits(p: number[], nArr: number[]) {
  const ns = nArr.map((x) => Math.max(1, Math.floor(x || 0)));
  const totalN = ns.reduce((s, v) => s + v, 0) || 1;
  let totalDef = 0;
  for (let i = 0; i < p.length; i++) totalDef += (p[i] || 0) * (ns[i] ?? 0);
  const pBar = totalDef / totalN;

  const cl = Array(p.length).fill(pBar);
  const ucl = p.map((_, i) => pBar + 3 * Math.sqrt((pBar * (1 - pBar)) / Math.max(1, ns[i] ?? 1)));
  const lcl = p.map((_, i) => clampMinZero(pBar - 3 * Math.sqrt((pBar * (1 - pBar)) / Math.max(1, ns[i] ?? 1))));
  return { cl, ucl, lcl };
}

/** u 管理図（単位当たり欠点数：u）— n_i が無い前提（一定単位） */
function uLimits(u: number[]) {
  const uBar = mean(u);
  const s = Math.sqrt(uBar);
  const up = uBar + 3 * s;
  const lp = clampMinZero(uBar - 3 * s);
  return expandToSeries(u.length, uBar, up, lp);
}

/** src（JSON）からのロード：{ x:number[], np:number[], p:{p:number[], n:number[]}, u:number[] } を想定 */
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

  // 外部JSON（data未指定のときのみ）
  useEffect(() => {
    let alive = true;
    if (src && (!Array.isArray(data) || data.length === 0)) {
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

  // 実データ確定
  const { series, nArray } = useMemo(() => {
    const key = srcKey ?? type;

    if (type === 'p') {
      const pSeries = sanitizeSeries(data);
      if (pSeries.length) {
        const ns = Array.isArray(sampleSizes) && sampleSizes.length === pSeries.length
          ? sanitizeSeries(sampleSizes as unknown[])
          : Array(pSeries.length).fill(sampleSizes?.[0] ?? 100);
        return { series: pSeries, nArray: ns };
      }
      const pLoaded = loaded && loaded[key] && Array.isArray(loaded[key].p) && Array.isArray(loaded[key].n)
        ? { p: sanitizeSeries(loaded[key].p), n: sanitizeSeries(loaded[key].n) }
        : null;
      return pLoaded ? { series: pLoaded.p, nArray: pLoaded.n } : { series: [] as number[], nArray: [] as number[] };
    }

    // x / np / u
    const s = sanitizeSeries(data);
    if (s.length) return { series: s, nArray: undefined };
    const fromLoaded = loaded && Array.isArray(loaded[key]) ? sanitizeSeries(loaded[key]) : [];
    return { series: fromLoaded, nArray: undefined };
  }, [type, data, sampleSizes, loaded, srcKey]);

  const { chartData, options } = useMemo<{
    chartData: ChartData<'line', number[], string>;
    options: ChartOptions<'line'>;
  }>(() => {
    const values = series ?? [];
    const len = values.length;

    if (!len) {
      return {
        chartData: { labels: [], datasets: [] },
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

    if (type === 'p') {
      const nArr = Array.isArray(nArray) && nArray.length === len ? nArray : Array(len).fill(100);
      const limits = pLimits(values, nArr);
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;
    } else if (type === 'u') {
      const limits = uLimits(values);
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;
    } else if (type === 'np') {
      const limits = npLimits(values, Math.max(1, Math.floor(nForNp)));
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;
    } else {
      const { cl: c0, ucl: u0, lcl: l0 } = xbarLimits(values, subgroupSizeForX);
      const expanded = expandToSeries(len, c0, u0, l0);
      cl = expanded.cl; ucl = expanded.ucl; lcl = expanded.lcl;
    }

    // 軸範囲
    let yMin: number;
    let yMax: number;
    if (type === 'p') {
      const maxVal = Math.max(...values, ...ucl);
      const minVal = Math.min(0, ...values, ...lcl);
      yMax = Math.min(1, maxVal * 1.05);
      yMin = Math.max(0, minVal * 0.95);
    } else if (type === 'np' || type === 'u') {
      yMax = Math.max(...values, ...ucl) * 1.1;
      yMin = Math.min(0, ...values, ...lcl) * 1.1;
      if (yMin < 0) yMin = 0; // 個数系は 0 未満を切り捨て
    } else {
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
          tension: 0.2,
        },
        { label: 'CL', data: cl, borderColor: 'green', borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
        { label: 'UCL', data: ucl, borderColor: 'red', borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
        { label: 'LCL', data: lcl, borderColor: 'red', borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const ds = ctx.dataset;
              const y = ctx.parsed.y as number;
              const isPct = type === 'p';
              const val = isPct ? `${(y * 100).toFixed(2)}%` : y.toString();
              return `${ds.label ?? ''}: ${val}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'サンプル群番号' },
          ticks: { callback: (_v, i) => (((i + 1) % 2 === 0) ? `${i + 1}` : ''), autoSkip: false },
        },
        y: {
          title: { display: true, text: yLabel ?? title },
          min: yMin,
          max: yMax,
          ticks: type === 'p'
            ? { callback: (v) => `${(Number(v) * 100).toFixed(0)}%` }
            : undefined,
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
