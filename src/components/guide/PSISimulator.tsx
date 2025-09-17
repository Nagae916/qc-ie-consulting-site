// src/components/guide/PSISimulator.tsx
'use client';
import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as C,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

C.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  defaultSales?: number;       // S
  defaultInitialStock?: number;// I (期首)
  defaultTargetStock?: number; // I (目標期末)
  maxSales?: number;
  maxStock?: number;
};

export default function PSISimulator({
  defaultSales = 800,
  defaultInitialStock = 150,
  defaultTargetStock = 200,
  maxSales = 2000,
  maxStock = 1000,
}: Props) {
  const [sales, setSales] = useState(defaultSales);
  const [iStart, setIStart] = useState(defaultInitialStock);
  const [iTarget, setITarget] = useState(defaultTargetStock);

  const production = useMemo(() => Math.max(0, sales + iTarget - iStart), [sales, iStart, iTarget]);

  const chart = useMemo<{
    data: ChartData<'bar'>;
    options: ChartOptions<'bar'>;
  }>(() => {
    return {
      data: {
        labels: ['供給', '需要'],
        datasets: [
          {
            label: '期首在庫',
            data: [iStart, 0],
            backgroundColor: 'rgba(16,185,129,.75)', // emerald-500
          },
          {
            label: '生産量',
            data: [production, 0],
            backgroundColor: 'rgba(59,130,246,.75)', // sky-500
          },
          {
            label: '販売量',
            data: [0, sales],
            backgroundColor: 'rgba(245,158,11,.75)', // amber-500
          },
          {
            label: '期末在庫',
            data: [0, iTarget],
            backgroundColor: 'rgba(139,92,246,.75)', // violet-500
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'PSIバランス' },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
            },
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    };
  }, [iStart, iTarget, sales, production]);

  const card = 'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm';
  const label = 'font-semibold mb-1';
  const sub = 'text-sm text-gray-500';

  return (
    <div className={card}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="mb-4">
            <label className={label}>販売計画 (S)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={maxSales} value={sales} onChange={(e) => setSales(+e.target.value)} className="w-full" />
              <input type="number" min={0} max={maxSales} value={sales} onChange={(e) => setSales(+e.target.value)} className="w-20 border rounded px-2 py-1 text-right" />
            </div>
          </div>

          <div className="mb-4">
            <label className={label}>期首在庫 (I)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={maxStock} value={iStart} onChange={(e) => setIStart(+e.target.value)} className="w-full" />
              <input type="number" min={0} max={maxStock} value={iStart} onChange={(e) => setIStart(+e.target.value)} className="w-20 border rounded px-2 py-1 text-right" />
            </div>
          </div>

          <div className="mb-4">
            <label className={label}>目標期末在庫 (I)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={maxStock} value={iTarget} onChange={(e) => setITarget(+e.target.value)} className="w-full" />
              <input type="number" min={0} max={maxStock} value={iTarget} onChange={(e) => setITarget(+e.target.value)} className="w-20 border rounded px-2 py-1 text-right" />
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-sky-50 p-4 text-center">
            <p className={sub}>算出された来月の生産計画 (P)</p>
            <p className="text-4xl font-extrabold text-sky-600">{production}</p>
            <p className="mt-1 font-mono text-xs text-gray-500">
              生産量 = {sales} + {iTarget} - {iStart}
            </p>
          </div>
        </div>

        <div>
          <div className="h-64 md:h-80">
            <Bar data={chart.data} options={chart.options} />
          </div>
        </div>
      </div>
    </div>
  );
}
