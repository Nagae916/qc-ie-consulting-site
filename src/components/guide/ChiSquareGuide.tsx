'use client';
import React, { useMemo, useState } from 'react';

// 2D配列の安全アクセサ（ESLint の二重添字ルールも回避）
const get2D = (m: number[][], i: number, j: number): number => {
  const row = m[i] ?? [];
  const v = row[j];
  return Number.isFinite(v) ? (v as number) : 0;
};

// 行合計
const rowSums = (m: number[][]): number[] =>
  m.map(row => row.reduce((s, v) => s + (Number(v) || 0), 0));

// 列合計
const colSums = (m: number[][]): number[] => {
  const cols = Math.max(0, ...m.map(r => r.length));
  const sums = Array.from({ length: cols }, () => 0);
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < cols; j++) {
      sums[j] += get2D(m, i, j);
    }
  }
  return sums;
};

export default function ChiSquareGuide() {
  // 観測度数（編集可能にしたいなら State の setter を足せばOK）
  const [obs] = useState<number[][]>([
    [30, 20],
    [20, 30],
  ]);

  // 合計・総数
  const rows = useMemo(() => rowSums(obs), [obs]);
  const cols = useMemo(() => colSums(obs), [obs]);
  const grand = useMemo(() => rows.reduce((s, v) => s + v, 0), [rows]);

  // 期待度数
  const expected = useMemo(() => {
    const g = grand > 0 ? grand : 1;
    return obs.map((row, i) => row.map((_, j) => (rows[i] ?? 0) * (cols[j] ?? 0) / g));
  }, [obs, rows, cols, grand]);

  // χ² 各セル・合計
  const chi = useMemo(() => {
    return obs.map((row, i) =>
      row.map((_, j) => {
        const o = get2D(obs, i, j);
        const e = expected[i]?.[j] ?? 0;
        return e > 0 ? ((o - e) ** 2) / e : 0;
      })
    );
  }, [obs, expected]);

  const chiTotal = useMemo(
    () => chi.reduce((s, r) => s + r.reduce((ss, v) => ss + v, 0), 0),
    [chi]
  );

  // スタイル（当初UIを維持）
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' };
  const sub: React.CSSProperties = { color: '#64748b' };

  return (
    <section style={card}>
      <h1 className="text-xl font-bold mb-1">クロス集計表とカイ二乗（χ²）検定</h1>
      <p style={sub} className="mb-3">
        2×2 のクロス集計表で、期待度数と χ² を段階的に確認できます（自由度は (2-1)×(2-1)=1）。
      </p>

      {/* 表 */}
      <div className="overflow-x-auto mb-4">
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
            {[0, 1].map(i => (
              <tr key={i}>
                <td className="border p-2 font-bold">行{i + 1}</td>
                {[0, 1].map(j => (
                  <td key={j} className="border p-2">
                    <div>{get2D(obs, i, j)}</div>
                    <div className="text-xs text-rose-600 mt-1">(期待 {(expected[i]?.[j] ?? 0).toFixed(2)})</div>
                    <div className="text-xs text-blue-600">(χ² {(get2D(obs, i, j) - (expected[i]?.[j] ?? 0)) ** 2 / ((expected[i]?.[j] ?? 1)) > 0
                      ? (((get2D(obs, i, j) - (expected[i]?.[j] ?? 0)) ** 2) / Math.max(1e-12, (expected[i]?.[j] ?? 0))).toFixed(3)
                      : '0.000'})</div>
                  </td>
                ))}
                <td className="border p-2 font-bold text-center">{rows[i] ?? 0}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="border p-2 font-bold">列合計</td>
              <td className="border p-2 font-bold text-center">{cols[0] ?? 0}</td>
              <td className="border p-2 font-bold text-center">{cols[1] ?? 0}</td>
              <td className="border p-2 font-bold text-center">{grand}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 結果 */}
      <div className="grid gap-2">
        <div className="mt-1 font-bold">χ² 合計 = {chiTotal.toFixed(3)}</div>
        <div style={sub} className="text-sm mt-1">
          5%水準・自由度1の臨界値は 3.841。χ² がこれを上回れば「統計的に有意な関連あり」。
        </div>
      </div>
    </section>
  );
}
