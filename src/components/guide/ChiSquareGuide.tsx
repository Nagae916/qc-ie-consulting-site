'use client';
import React, { useMemo, useState } from 'react';

/** 安全な 2D 配列アクセス */
function get2D<T>(m: T[][], i: number, j: number, fallback: T extends number ? number : T = 0 as any): T {
  return m?.[i]?.[j] ?? (fallback as T);
}

/** 行ごとの合計 */
function rowSums(m: number[][]): number[] {
  return m.map(r => r.reduce((s, v) => s + (Number(v) || 0), 0));
}

/** 列ごとの合計 */
function colSums(m: number[][]): number[] {
  const cols = Math.max(0, ...m.map(r => r.length));
  // TS が undefined を推論しないように明示的に number[]
  const sums: number[] = Array.from({ length: cols }, () => 0 as number);
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < cols; j++) {
      sums[j] = (sums[j] ?? 0) + get2D(m, i, j, 0);
    }
  }
  return sums;
}

/** 総和 */
function grandTotal(m: number[][]): number {
  return rowSums(m).reduce((s, v) => s + v, 0);
}

/** 期待度数 */
function expectedMatrix(m: number[][]): number[][] {
  const rs = rowSums(m);
  const cs = colSums(m);
  const gt = Math.max(1, rs.reduce((s, v) => s + v, 0));
  return m.map((_, i) => cs.map((_, j) => ((rs[i] ?? 0) * (cs[j] ?? 0)) / gt));
}

/** χ² 各セル寄与 */
function chiEach(m: number[][], exp: number[][]): number[][] {
  return m.map((row, i) =>
    row.map((o, j) => {
      const e = get2D(exp, i, j, 0);
      return e > 0 ? Math.pow((o ?? 0) - e, 2) / e : 0;
    })
  );
}

/** χ² 合計 */
function chiTotal(m: number[][], exp: number[][]): number {
  return chiEach(m, exp).reduce((s, r) => s + r.reduce((ss, v) => ss + v, 0), 0);
}

export default function ChiSquareGuide() {
  const [obs, setObs] = useState<number[][]>([
    [30, 20],
    [20, 30],
  ]);
  const [showExpected, setShowExpected] = useState(false);
  const [showChi, setShowChi] = useState(false);

  const rows = useMemo(() => rowSums(obs), [obs]);
  const cols = useMemo(() => colSums(obs), [obs]);
  const grand = useMemo(() => grandTotal(obs), [obs]);
  const exp = useMemo(() => expectedMatrix(obs), [obs, rows, cols, grand]);
  const chi = useMemo(() => chiEach(obs, exp), [obs, exp]);
  const chiVal = useMemo(() => chiTotal(obs, exp), [chi, exp]);

  const updateCell = (i: number, j: number, v: string) => {
    const n = Number(v);
    const safe = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
    setObs(prev => {
      const next = prev.map(r => [...r]);
      next[i][j] = safe;
      return next;
    });
    setShowExpected(false);
    setShowChi(false);
  };

  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' };
  const sub: React.CSSProperties = { color: '#64748b' };

  return (
    <section style={card}>
      <h1 className="text-xl font-bold mb-1">クロス集計表とカイ二乗（χ²）検定</h1>
      <p style={sub} className="mb-3">
        2×2 のクロス集計表で、期待度数と χ² を段階的に確認できます（自由度 = (行−1)×(列−1)）。
      </p>

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
            {obs.map((row, i) => (
              <tr key={i}>
                <td className="border p-2 font-bold">行{i + 1}</td>
                {row.map((val, j) => (
                  <td key={j} className="border p-2">
                    <input
                      type="number"
                      min={0}
                      value={val}
                      onChange={e => updateCell(i, j, e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                    {showExpected && (
                      <div className="text-xs text-rose-600 mt-1">(期待 {get2D(exp, i, j, 0).toFixed(2)})</div>
                    )}
                    {showChi && (
                      <div className="text-xs text-blue-600">(χ² {get2D(chi, i, j, 0).toFixed(3)})</div>
                    )}
                  </td>
                ))}
                <td className="border p-2 font-bold text-center">{rows[i]}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="border p-2 font-bold">列合計</td>
              {cols.map((c, j) => (
                <td key={j} className="border p-2 font-bold text-center">{c}</td>
              ))}
              <td className="border p-2 font-bold text-center">{grand}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        <button onClick={() => { setShowExpected(true); setShowChi(false); }} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">1. 期待度数を表示</button>
        <button onClick={() => { setShowExpected(true); setShowChi(true); }} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">2. χ² を計算して表示</button>
        <button onClick={() => { setShowExpected(false); setShowChi(false); }} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">クリア</button>
      </div>

      {showChi && (
        <div className="mt-2">
          <div className="font-bold mb-1">χ² 合計値</div>
          <div style={sub}>χ² = {chiVal.toFixed(3)} （自由度 1, 有意水準5%の臨界値 ≈ 3.841）</div>
        </div>
      )}
    </section>
  );
}
