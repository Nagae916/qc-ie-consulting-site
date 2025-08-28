'use client';
import React, { useMemo, useState } from 'react';

/** 型：任意サイズの二次元配列（行列） */
type Row = number[];
type Matrix = Row[];

/** 行合計（存在しない行/要素は 0 扱い） */
function calcRowTotals(m: Matrix): number[] {
  return m.map(row => (row?.reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)) ?? 0);
}

/** 列合計（行長がまちまちでも安全） */
function calcColTotals(m: Matrix): number[] {
  if (!m.length) return [];
  const cols = Math.max(...m.map(r => r?.length ?? 0));
  const sums: number[] = Array.from({ length: cols }, () => 0);
  for (let i = 0; i < m.length; i++) {
    const row: Row = Array.isArray(m[i]) ? m[i] as Row : [];
    for (let j = 0; j < cols; j++) {
      const add = Number.isFinite(row[j]) ? (row[j] as number) : 0;
      sums[j] = (sums[j] ?? 0) + add;
    }
  }
  return sums;
}

/** 期待度数（独立仮定） */
function calcExpected(obs: Matrix): Matrix {
  const rowTotals = calcRowTotals(obs);
  const colTotals = calcColTotals(obs);
  const grand = rowTotals.reduce((s, v) => s + v, 0);
  const rows = obs.length;
  const cols = colTotals.length;

  const exp: Matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  if (grand <= 0) return exp;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      exp[i][j] = (rowTotals[i] * colTotals[j]) / grand;
    }
  }
  return exp;
}

/** χ² の各セル値と合計 */
function calcChiSquare(obs: Matrix, exp: Matrix) {
  const rows = obs.length;
  const cols = Math.max(...[...obs, ...exp].map(r => r?.length ?? 0));
  let total = 0;
  const cells: Matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

  for (let i = 0; i < rows; i++) {
    const orow: Row = obs[i] ?? [];
    const erow: Row = exp[i] ?? [];
    for (let j = 0; j < cols; j++) {
      const O = Number.isFinite(orow[j]) ? (orow[j] as number) : 0;
      const E = Number.isFinite(erow[j]) ? (erow[j] as number) : 0;
      const chi = E > 0 ? Math.pow(O - E, 2) / E : 0;
      cells[i][j] = chi;
      total += chi;
    }
  }
  return { cells, total };
}

/** 自由度 = (行数-1)×(列数-1)  */
function dfOf(m: Matrix): number {
  const r = m.length;
  const c = calcColTotals(m).length;
  return Math.max(0, (r - 1) * (c - 1));
}

/** 表示用セル */
function Cell({ children }: { children: React.ReactNode }) {
  return <td className="border p-3 text-center align-top">{children}</td>;
}

export default function ChiSquarePage() {
  // 初期の 2x2 観測度数
  const [obs, setObs] = useState<Matrix>([
    [30, 20],
    [20, 30],
  ]);

  const rowTotals = useMemo(() => calcRowTotals(obs), [obs]);
  const colTotals = useMemo(() => calcColTotals(obs), [obs]);
  const grandTotal = useMemo(() => rowTotals.reduce((s, v) => s + v, 0), [rowTotals]);

  const [expected, setExpected] = useState<Matrix | null>(null);
  const [chi, setChi] = useState<{ cells: Matrix; total: number } | null>(null);

  const rows = obs.length;
  const cols = colTotals.length;

  const onCalcExpected = () => {
    const e = calcExpected(obs);
    setExpected(e);
    setChi(null);
  };

  const onCalcChi = () => {
    const e = expected ?? calcExpected(obs);
    setExpected(e);
    setChi(calcChiSquare(obs, e));
  };

  const onChangeCell = (i: number, j: number, v: number) => {
    setExpected(null);
    setChi(null);
    setObs(prev => {
      const next = prev.map(r => [...r]);
      if (!Array.isArray(next[i])) next[i] = [];
      next[i][j] = Number.isFinite(v) ? v : 0;
      return next;
    });
  };

  // ビジュアル（Tailwind）
  return (
    <main className="container mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">クロス集計表とカイ二乗検定（安全ガード版）</h1>
      <p className="text-gray-600">
        行・列数が増えても安全に計算できるよう <code>undefined</code> をすべて 0 扱いにしています。
      </p>

      {/* 観測度数テーブル */}
      <div className="overflow-x-auto">
        <table className="min-w-[560px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3"></th>
              {Array.from({ length: cols }, (_, j) => (
                <th key={j} className="border p-3">列{j + 1}</th>
              ))}
              <th className="border p-3 font-bold">行合計</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i}>
                <th className="border p-3 bg-gray-50 font-semibold">行{i + 1}</th>
                {Array.from({ length: cols }, (_, j) => (
                  <Cell key={j}>
                    <input
                      type="number"
                      className="w-20 rounded border p-1 text-right"
                      value={(obs[i]?.[j] ?? 0).toString()}
                      onChange={e => onChangeCell(i, j, Number(e.target.value))}
                      min={0}
                    />
                    {expected && (
                      <div className="text-xs text-rose-600 mt-1">
                        期待: {expected[i]?.[j] ? expected[i][j].toFixed(2) : '0.00'}
                      </div>
                    )}
                    {chi && (
                      <div className="text-[11px] text-blue-600 mt-1">
                        χ²: {chi.cells[i]?.[j] ? chi.cells[i][j].toFixed(3) : '0.000'}
                      </div>
                    )}
                  </Cell>
                ))}
                <Cell><b>{rowTotals[i] ?? 0}</b></Cell>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <th className="border p-3 font-semibold">列合計</th>
              {Array.from({ length: cols }, (_, j) => (
                <Cell key={j}><b>{colTotals[j] ?? 0}</b></Cell>
              ))}
              <Cell><b>{grandTotal}</b></Cell>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 操作ボタン */}
      <div className="flex gap-3">
        <button
          onClick={onCalcExpected}
          className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
        >
          1. 期待度数を計算
        </button>
        <button
          onClick={onCalcChi}
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          disabled={!expected}
        >
          2. χ² を計算
        </button>
      </div>

      {/* 結果表示 */}
      {expected && (
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">期待度数</h2>
          <p className="text-sm text-gray-600">自由度: {(dfOf(obs))}（(行−1)×(列−1)）</p>
        </div>
      )}

      {chi && (
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">カイ二乗結果</h2>
          <div className="text-lg">
            合計 χ² = <b>{chi.total.toFixed(3)}</b>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            自由度 {dfOf(obs)}、有意水準 5% との比較は分布表/計算ツールで確認してください。
          </div>
        </div>
      )}
    </main>
  );
}
