'use client';
import React, { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as C, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import { xbarLimitsScalar, expandToSeries, npLimits, pLimits, uLimits } from '@/lib/stats';

C.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  title: string;
  type: 'x' | 'np' | 'p' | 'u';
  data: number[];
  sampleSizes?: number[];    // p図: 各点のサンプルサイズ
  subgroupSizeForX?: number; // X̄-R: サブグループサイズ（既定 5）
  yLabel?: string;
};

export default memo(function ControlChart({
  title, type, data, sampleSizes, subgroupSizeForX = 5, yLabel,
}: Props) {
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  };

  const { ds, options } = useMemo(() => {
    let cl: number[] = [], ucl: number[] = [], lcl: number[] = [];
    let yMin = 0, yMax = 0;

    if (type === 'p') {
      const nArr = (sampleSizes && sampleSizes.length === data.length)
        ? sampleSizes
        : Array(data.length).fill(sampleSizes?.[0] ?? 100);

      const limits = pLimits(data, nArr);
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;

      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(0, ...data, ...lcl) * 1.1;

    } else if (type === 'u') {
      const limits = uLimits(data);
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;

      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(0, ...data, ...lcl) * 1.1;

    } else if (type === 'np') {
      const limits = npLimits(data, 100); // 固定 n（必要なら props 化）
      cl = limits.cl; ucl = limits.ucl; lcl = limits.lcl;

      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(0, ...data, ...lcl) * 1.1;

    } else { // 'x'（X̄）
      const { cl: scl, ucl: sucl, lcl: slcl } = xbarLimitsScalar(data, subgroupSizeForX);
      const series = expandToSeries(data.length, scl, sucl, slcl);
      cl = series.cl; ucl = series.ucl; lcl = series.lcl;

      yMax = Math.max(...data, ...ucl) * 1.1;
      yMin = Math.min(...data, ...lcl) * 0.9;
    }

    const labels = Array.from({ length: data.length }, (_, i) => `${i + 1}`);
    return {
      ds: {
        labels,
        datasets: [
          { label: title, data, borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,.2)', borderWidth: 2, pointRadius: 3 },
          { label: 'CL',  data: cl,  borderColor: 'green', borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
          { label: 'UCL', data: ucl, borderColor: 'red',   borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
          { label: 'LCL', data: lcl, borderColor: 'red',   borderDash: [6, 6], borderWidth: 2, pointRadius: 0 },
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
