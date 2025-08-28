'use client';
import React, { useMemo, useState } from 'react';
import {
  rowSums,
  colSums,
  grandTotal,
  expectedMatrix,
  chiTotal,
  chiDf,
  type Matrix
} from '@/lib/safe-matrix';

export default function ChiSquareGuide() {
  // 例: 2x2 クロス表
  const [obs] = useState<Matrix>([
    [30, 20],
    [20, 30],
  ]);

  const rowTotals = useMemo(() => rowSums(obs), [obs]);
  const colTotals = useMemo(() => colSums(obs), [obs]);
  const total     = useMemo(() => grandTotal(obs), [obs]);

  const expected  = useMemo(() => expectedMatrix(obs), [obs]);
  const chi2      = useMemo(() => chiTotal(obs, expected), [obs, expected]);
  const df        = useMemo(() => chiDf(obs), [obs]);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-teal-700">クロス集計とカイ二乗検定</h1>

      <div>
        <h2 className="font-semibold mb-2">観測度数 (obs)</h2>
        <pre className="bg-gray-50 p-3 rounded border">
          {JSON.stringify(obs, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="font-semibold mb-2">期待度数 (expected)</h2>
        <pre className="bg-gray-50 p-3 rounded border">
          {JSON.stringify(expected, null, 2)}
        </pre>
      </div>

      <div className="space-y-1">
        <p>行合計: {JSON.stringify(rowTotals)}</p>
        <p>列合計: {JSON.stringify(colTotals)}</p>
        <p>総計: {total}</p>
        <p>自由度: {df}</p>
        <p>χ² 合計: {chi2.toFixed(3)}</p>
      </div>
    </div>
  );
}
