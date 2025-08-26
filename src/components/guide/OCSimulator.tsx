'use client';
import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as C,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

C.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

type Props = {
  /** 初期値などの設定（%は 0–100 で指定） */
  defaultN?: number; minN?: number; maxN?: number;
  defaultC?: number; minC?: number; maxC?: number;
  aql?: number; rql?: number;     // %
  pMaxPercent?: number;           // 横軸の最大（%）
  stepPercent?: number;           // pの刻み（%）
  showRisk?: boolean;
};

/** 二項分布の P(X <= c) を安定に計算（漸化式） */
function binomCDF(n: number, c: number, p: number): number {
  if (p <= 0) return 1;
  if (p >= 1) return c >= n ? 1 : 0;
  const q = 1 - p;
  let prob = Math.pow(q, n); // x=0 の確率
  let sum = prob;
  for (let x = 1; x <= c; x++) {
    prob = prob * ( (n - (x - 1)) / x ) * (p / q);
    sum += prob;
  }
  return sum;
}

/** p(0..1) を刻んで Pa を配列で返す */
function calcOCSeries(n: number, c: number, pMax: number, step: number) {
  const pts: { x: number; y: number }[] = [];
  for (let pp = 0; pp <= pMax + 1e-12; pp += step) {
    const p = pp; // 0..1
    const pa = binomCDF(n, c, p);
    pts.push({ x: p * 100, y: pa });
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

  // 入力ガード
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(v)));
  const onNChange = (v: number) => setN(clamp(v, minN, maxN));
  const onCChange = (v: number) => setC(clamp(v, minC, Math.min(maxC, n))); // c<=n にも抑制

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

    return {
      data: {
        datasets: [
          {
            label: '合格確率 (Pa)',
            data: line,
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 0,
          },
          {
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
                return `不良率: ${Number(x
