'use client';
import React, { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as C, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';

C.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  title: string;
  type: 'x' | 'np' | 'p' | 'u';
  data: number[];
  sampleSizes?: number[];   // p図用に可変n
  subgroupSizeForX?: number; // X̄-Rのサブグループサイズ（既定5）
  yLabel?: string;
};

export default memo(function ControlChart({
  title, type, data, sampleSizes, subgroupSizeForX = 5, yLabel,
}: Props) {
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' };

  const { ds, options } = useMemo(() => {
    let cl: number[] = [], ucl: number[] = [], lcl: number[] = [];
    let yMin = 0, yMax = 0;

    if (type === 'p') {
      const nArr = sampleSizes ?? Array(data.length).fill(100);
      const totalN = nArr.reduce((s, n) => s + n, 0);
      const totalDef = data.reduce((s, p, i) => s + p * nArr[i], 0);
      const pbar = totalDef / totalN;
      cl = Array(data.length).fill(pbar);
      ucl = nArr.map(n => pbar + 3 * Math.sqrt((pbar * (1 - pbar)) / n));
      lcl = nArr.map(n => Math.max(0, pbar - 3 * Math.sqrt((pbar * (1 - pbar)) / n)));
      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(0, ...data, ...lcl) * 1.1;

    } else if (type === 'u') {
      const ubar = data.reduce((s, c) => s + c, 0) / data.length;
      cl = Array(data.length).fill(ubar);
      ucl = Array(data.length).fill(ubar + 3 * Math.sqrt(ubar));
      lcl = Array(data.length).fill(Math.max(0, ubar - 3 * Math.sqrt(ubar)));
      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(0, ...data, ...lcl) * 1.1;

    } else if (type === 'np') {
      const n = 100; // 固定サンプルサイズ
      const pbar = data.reduce((s, v) => s + v, 0) / (data.length * n);
      const npbar = n * pbar;
      const sigma = Math.sqrt(npbar * (1 - pbar));
      cl = Array(data.length).fill(npbar);
      ucl = Array(data.length).fill(npbar + 3 * sigma);
      lcl = Array(data.length).fill(Math.max(0, npbar - 3 * sigma));
      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(0, ...data, ...lcl) * 1.1;

    } else { // 'x'（X̄ 管理図相当）
      const n = subgroupSizeForX;
      const groups = Math.floor(data.length / n) || 1;
      const rBar = Array.from({ length: groups }).reduce((sum, _, i) => {
        const g = data.slice(i * n, i * n + n);
        if (g.length < 1) return sum;
        return sum + (Math.max(...g) - Math.min(...g));
      }, 0) / groups;
      const a2 = n === 5 ? 0.577 : 0.577; // 必要なら係数表に拡張
      const xbarbar = data.reduce((s, v) => s + v, 0) / data.length;

      cl = Array(data.length).fill(xbarbar);
      ucl = Array(data.length).fill(xbarbar + a2 * rBar);
      lcl = Array(data.length).fill(xbarbar - a2 * rBar);
      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(...data, ...lcl) * 0.9;
    }

    const labels = Array.from({ length: data.length }, (_, i) => `${i + 1}`);
    return {
      ds: {
        labels,
        datasets: [
          { label: title, data, borderWidth: 2, pointRadius: 3 },
          { label: 'CL', data: cl, borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
          { label: 'UCL', data: ucl, borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
          { label: 'LCL', data: lcl, borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' as const } },
        scales: {
          x: { title: { display: true, text: 'サンプル群番号' } },
          y: { title: { display: true, text: yLabel ?? title }, min: yMin, max: yMax },
        },
      },
    };
  }, [type, data, sampleSizes, subgroupSizeForX, title, yLabel]);

  return (
    <div style={card}>
      <div style={{ height: 260 }}>
        <Line data={ds as any} options={options as any} />
      </div>
    </div>
  );
});
