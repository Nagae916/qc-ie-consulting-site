'use client';
import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as C,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend
} from 'chart.js';

C.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  defaultN?: number; minN?: number; maxN?: number;
  defaultC?: number; minC?: number; maxC?: number;
  aql?: number; rql?: number;     // %（x 軸）
  pMaxPercent?: number;           // x 軸の最大（%）
  stepPercent?: number;           // p の刻み（%）
  showRisk?: boolean;
};

/** 二項分布の P(X <= c) を安定に計算（漸化式） */
function binomCDF(n: number, c: number, p: number): number {
  if (p <= 0) return 1;
  if (p >= 1) return c >= n ? 1 : 0;
  const q = 1 - p;
  let prob = Math.pow(q, n); // x=0
  let sum = prob;
  for (let x = 1; x <= c; x++) {
    prob = prob * ((n - (x - 1)) / x) * (p / q);
    sum += prob;
  }
  return sum;
}

function calcOCSeries(n: number, c: number, pMax: number, step: number) {
  const pts: { x: number; y: number }[] = [];
  for (let pp = 0; pp <= pMax + 1e-12; pp += step) {
    const pa = binomCDF(n, c, pp);
    pts.push({ x: pp * 100, y: pa }); // x は %
  }
  return pts;
}

export default function OCSimulator({
  defaultN = 30, minN = 10, maxN = 200,
  defaultC = 3,  minC = 0,  maxC = 10,
  aql = 1.0, rql = 6.5,
  pMaxPercent = 40,
  stepPercent = 1,
  showRisk = true,
}: Props) {
  const [n, setN] = useState<number>(defaultN);
  const [c, setC] = useState<number>(defaultC);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(v)));
  const onNChange = (v: number) => setN(clamp(v, minN, maxN));
  const onCChange = (v: number) => setC(clamp(v, minC, Math.min(maxC, n))); // c<=n

  const { data, options } = useMemo(() => {
    const pMax = pMaxPercent / 100;
    const step = stepPercent / 100;

    const line = calcOCSeries(n, c, pMax, step);

    const alphaPa = binomCDF(n, c, aql / 100);
    const betaPa  = binomCDF(n, c, rql / 100);

    const riskPts = showRisk
      ? [
          { x: aql, y: alphaPa, label: '生産者危険 (α)', color: 'rgba(59,130,246,1)', pointStyle: 'circle', r: 8 },
          { x: rql, y: betaPa,  label: '消費者危険 (β)', color: 'rgba(239,68,68,1)', pointStyle: 'triangle', r: 8 },
        ]
      : [];

    // 注釈プラグイン不使用: 縦線は2点のラインとして描画
    const aqlLine = showRisk ? [{ x: aql, y: 0 }, { x: aql, y: 1 }] : [];
    const rqlLine = showRisk ? [{ x: rql, y: 0 }, { x: rql, y: 1 }] : [];

    return {
      data: {
        datasets: [
          {
            label: '合格確率 (Pₐ)',
            data: line,
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 0,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59,130,246,.2)',
          },
          { // AQL 縦線
            label: 'AQL',
            data: aqlLine as any,
            showLine: true,
            pointRadius: 0,
            borderWidth: 1,
            borderColor: 'rgba(59,130,246,0.5)',
            borderDash: [6, 6],
          },
          { // RQL 縦線
            label: 'RQL',
            data: rqlLine as any,
            showLine: true,
            pointRadius: 0,
            borderWidth: 1,
            borderColor: 'rgba(239,68,68,0.5)',
            borderDash: [6, 6],
          },
          { // リスク点
            label: 'リスクポイント',
            data: riskPts as any,
            showLine: false,
            pointBackgroundColor: (ctx: any) => ctx.raw.color,
            pointBorderColor:    (ctx: any) => ctx.raw.color,
            pointRadius:         (ctx: any) => ctx.raw.r,
            pointStyle:          (ctx: any) => ctx.raw.pointStyle,
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const it = items[0];
                const x = it?.raw?.x ?? it?.parsed?.x ?? 0;
                return `不良率: ${Number(x).toFixed(1)}%`;
              },
              label: (ctx: any) => {
                if (ctx.datasetIndex === 3 && ctx.raw?.label) {
                  return `${ctx.raw.label}: ${(ctx.raw.y * 100).toFixed(1)}%`;
                }
                if (ctx.datasetIndex === 1) return 'AQL 線';
                if (ctx.datasetIndex === 2) return 'RQL 線';
                return `合格確率: ${(ctx.parsed.y * 100).toFixed(1)}%`;
              },
            },
          },
        },
        scales: {
          x: {
            type: 'linear' as const,
            title: { display: true, text: 'ロットの不良率 (p)' },
            min: 0,
            max: pMaxPercent,
            ticks: { callback: (v: any) => `${v}%` },
          },
          y: {
            title: { display: true, text: 'ロットの合格確率 (Pₐ)' },
            min: 0,
            max: 1,
            ticks: { stepSize: 0.1, callback: (v: any) => Number(v).toFixed(1) },
          },
        },
      } as const,
    };
  }, [n, c, aql, rql, pMaxPercent, stepPercent, showRisk]);

  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' };
  const label: React.CSSProperties = { fontWeight: 600, marginBottom: 6 };
  const input: React.CSSProperties = { width: 72, padding: 6, textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: 8 };

  return (
    <div style={card}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 12 }}>
        <div>
          <div style={label}>n（サンプルサイズ）</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="range" min={minN} max={maxN} value={n} onChange={e => onNChange(Number(e.target.value))} style={{ flex: 1 }} />
            <input type="number" min={minN} max={maxN} value={n} onChange={e => onNChange(Number(e.target.value))} style={input} />
          </div>
        </div>
        <div>
          <div style={label}>c（合格判定個数）</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="range" min={minC} max={Math.min(maxC, n)} value={c} onChange={e => onCChange(Number(e.target.value))} style={{ flex: 1 }} />
            <input type="number" min={minC} max={Math.min(maxC, n)} value={c} onChange={e => onCChange(Number(e.target.value))} style={input} />
          </div>
        </div>
      </div>

      <div style={{ height: 380 }}>
        <Line data={data as any} options={options as any} />
      </div>
    </div>
  );
}
