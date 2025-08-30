// pages/guides/stat/chi-square.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as CJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import {
  safeNum, get2D, makeZero, dimsOf,
  rowTotalsOf, colTotalsOf, grandTotalOf,
  expectedOf, chi2Of,
} from '@/lib/safe-matrix';

CJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChiSquareGuide() {
  // 観測度数（サイズは可変運用）
  const [obs, setObs] = useState<number[][]>([
    [30, 20],
    [20, 30],
  ]);

  const { R, C } = useMemo(() => dimsOf(obs), [obs]);

  // 合計類（安全集計）
  const rowTotals = useMemo(() => rowTotalsOf(obs), [obs]);
  const colTotals = useMemo(() => colTotalsOf(obs), [obs]);
  const grandTotal = useMemo(() => grandTotalOf(rowTotals), [rowTotals]);

  // 派生状態（R×C へ追随）
  const [expected, setExpected] = useState<number[][]>(makeZero(R, C));
  const [chiValues, setChiValues] = useState<number[][]>(makeZero(R, C));
  const [chiTotal, setChiTotal] = useState<number | null>(null);

  useEffect(() => {
    setExpected(makeZero(R, C));
    setChiValues(makeZero(R, C));
    setChiTotal(null);
  }, [R, C]);

  // 期待度数
  const handleCalcExpected = () => {
    const e = expectedOf(rowTotals, colTotals, grandTotal);
    setExpected(e);
    setChiValues(makeZero(R, C));
    setChiTotal(null);
  };

  // χ²
  const handleCalcChi = () => {
    const hasExpected = expected.some(r => r.some(v => v > 0));
    if (!hasExpected) return;
    const { chi, total } = chi2Of(obs, expected);
    setChiValues(chi);
    setChiTotal(total);
  };

  // セル入力（0 以上の整数へ整形）
  const onChangeCell = (i: number, j: number, v: string) => {
    const nRaw = Number(v);
    const n = Number.isFinite(nRaw) ? Math.max(0, Math.floor(nRaw)) : 0;
    setObs(prev => {
      const next = prev.map(r => r.slice());
      if (!next[i]) next[i] = [];
      next[i][j] = n;
      return next;
    });
    setExpected(makeZero(R, C));
    setChiValues(makeZero(R, C));
    setChiTotal(null);
  };

  // グラフ（R×C をフラット化）
  const chartData = useMemo(() => {
    const labels: string[] = [];
    const obsVals: number[] = [];
    const expVals: number[] = [];
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        labels.push(`R${i + 1}C${j + 1}`);
        obsVals.push(get2D(obs, i, j));
        expVals.push(get2D(expected, i, j));
      }
    }
    return {
      labels,
      datasets: [
        { label: '観測度数', data: obsVals, borderWidth: 1 },
        { label: '期待度数', data: expVals, borderWidth: 1 },
      ],
    };
  }, [obs, expected, R, C]);

  const chartOptions = useMemo(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: '観測度数と期待度数の比較' },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const v = ctx.parsed.y;
            return `${ctx.dataset.label}: ${typeof v === 'number' ? v.toFixed(2) : v}`;
          },
        },
      },
    },
    scales: { y: { beginAtZero: true, title: { display: true, text: '度数' } } },
  }), []);

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
    padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  };
  const sub: React.CSSProperties = { color: '#64748b' };

  const expectedFilled = useMemo(() => expected.some(r => r.some(v => v > 0)), [expected]);

  return (
    <section style={card}>
      <h1 className="text-xl font-bold mb-1">クロス集計表とカイ二乗（χ²）検定（動的・堅牢版）</h1>
      <p style={sub} className="mb-3">
        配列サイズ可変（{R}×{C}）。未定義アクセス・0割・NaN を共通ヘルパで全面ガードします。
      </p>

      {/* 表 */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-[560px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2"></th>
              {Array.from({ length: C }, (_, j) => (
                <th key={j} className="border p-2">列{j + 1}</th>
              ))}
              <th className="border p-2 font-bold">行合計</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: R }, (_, i) => (
              <tr key={i}>
                <td className="border p-2 font-bold">行{i + 1}</td>
                {Array.from({ length: C }, (_, j) => {
                  const oij = get2D(obs, i, j);
                  const eij = get2D(expected, i, j);
                  const cij = get2D(chiValues, i, j);
                  return (
                    <td key={j} className="border p-2">
                      <input
                        type="number"
                        min={0}
                        value={oij}
                        onChange={e => onChangeCell(i, j, e.target.value)}
                        className="w-24 border rounded px-2 py-1"
                      />
                      {expectedFilled && (
                        <div className="text-xs text-rose-600 mt-1">(期待 {eij.toFixed(2)})</div>
                      )}
                      {chiTotal !== null && (
                        <div className="text-xs text-blue-600">(χ² {cij.toFixed(3)})</div>
                      )}
                    </td>
                  );
                })}
                <td className="border p-2 font-bold text-center">{safeNum(rowTotals[i], 0)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="border p-2 font-bold">列合計</td>
              {Array.from({ length: C }, (_, j) => (
                <td key={j} className="border p-2 font-bold text-center">
                  {safeNum(colTotals[j], 0)}
                </td>
              ))}
              <td className="border p-2 font-bold text-center">{grandTotal}</td>
            </tr>
          </thead>
        </table>
      </div>

      {/* 操作 */}
      <div className="flex gap-3 flex-wrap mb-4">
        <button
          type="button"
          onClick={handleCalcExpected}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          disabled={expectedFilled}
        >
          1. 期待度数を計算
        </button>
        <button
          type="button"
          onClick={handleCalcChi}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          disabled={!expectedFilled || chiTotal !== null}
        >
          2. χ² を計算
        </button>
        <button
          type="button"
          onClick={() => {
            setExpected(makeZero(R, C));
            setChiValues(makeZero(R, C));
            setChiTotal(null);
          }}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          クリア
        </button>
      </div>

      {/* 結果 */}
      <div className="grid gap-2">
        {expectedFilled && (
          <div style={sub} className="text-sm">
            各セル E<sub>ij</sub> = (行i合計 × 列j合計) / 全体（0割・NaN は自動回避）
          </div>
        )}
        {chiTotal !== null && (
          <div style={sub} className="text-sm">
            χ² 合計 = {chiTotal.toFixed(3)}、自由度 {(R - 1) * (C - 1)}
          </div>
        )}
      </div>

      {/* グラフ */}
      <div style={{ height: 320 }} className="mt-6">
        <Bar data={chartData as any} options={chartOptions as any} />
      </div>
    </section>
  );
}
