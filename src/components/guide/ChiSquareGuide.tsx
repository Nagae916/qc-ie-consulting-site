// src/components/guide/ChiSquareGuide.tsx
'use client';
import React, { useMemo, useState } from 'react';
import {
  safeNum, get2D,
  rowSums as rowTotalsOf,
  colSums as colTotalsOf,
  grandTotal as grandTotalOf,
  expectedMatrix as expectedOf,
  chiEach, chiTotal as chiTotalOf,
} from '@/lib/safe-matrix';

export default function ChiSquareGuide() {
  const [obs, setObs] = useState<number[][]>([[30, 20], [20, 30]]);

  const rowTotals  = useMemo(() => rowTotalsOf(obs), [obs]);
  const colTotals  = useMemo(() => colTotalsOf(obs), [obs]); // ← obs[0][j]+obs[1][j] を廃止
  const grandTotal = useMemo(() => grandTotalOf(obs), [obs]);

  const expected   = useMemo(() => expectedOf(obs), [obs]);
  const chi        = useMemo(() => chiEach(obs, expected), [obs, expected]);
  const chiTotal   = useMemo(() => chiTotalOf(obs, expected), [obs, expected]);

  const onChangeCell = (i: number, j: number, v: string) => {
    const nRaw = Number(v);
    const n = Number.isFinite(nRaw) ? Math.max(0, Math.floor(nRaw)) : 0;
    setObs(prev => {
      const next = prev.map(r => r.slice());
      if (!next[i]) next[i] = [];
      next[i][j] = n;
      return next;
    });
  };

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
    padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)'
  };

  return (
    <section style={card}>
      <h1 className="text-xl font-bold mb-2">カイ二乗（χ²）サンプル</h1>
      <div className="overflow-x-auto">
        <table className="min-w-[520px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2"></th>
              <th className="border p-2">列1</th>
              <th className="border p-2">列2</th>
              <th className="border p-2 font-bold">行合計</th>
            </tr>
          </thead>
          <tbody>
            {[0,1].map(i => (
              <tr key={i}>
                <td className="border p-2 font-bold">行{i+1}</td>
                {[0,1].map(j => (
                  <td key={j} className="border p-2">
                    <input
                      type="number" min={0}
                      value={get2D(obs, i, j)}
                      onChange={e => onChangeCell(i, j, e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                    <div className="text-xs text-rose-600 mt-1">
                      期待 {get2D(expected, i, j).toFixed(2)}
                    </div>
                    <div className="text-xs text-blue-600">
                      χ² {get2D(chi, i, j).toFixed(3)}
                    </div>
                  </td>
                ))}
                <td className="border p-2 font-bold text-center">{safeNum(rowTotals[i], 0)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="border p-2 font-bold">列合計</td>
              <td className="border p-2 font-bold text-center">{safeNum(colTotals[0], 0)}</td>
              <td className="border p-2 font-bold text-center">{safeNum(colTotals[1], 0)}</td>
              <td className="border p-2 font-bold text-center">{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 font-bold">χ² 合計 = {chiTotal.toFixed(3)}</div>
    </section>
  );
}
