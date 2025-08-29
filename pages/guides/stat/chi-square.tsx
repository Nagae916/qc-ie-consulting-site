// pages/guides/stat/chi-square.tsx
'use client';
import React, { useMemo, useState } from 'react';

/** 2×2 をタプルで厳密に表現（noUncheckedIndexedAccess 対策） */
type Matrix2 = [[number, number], [number, number]];

// UI用の軽いスタイル
const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,.04)',
};
const sub: React.CSSProperties = { color: '#64748b' };

/** 安全にセルを取得（念のため Number 化） */
function get(m: Matrix2, i: 0 | 1, j: 0 | 1): number {
  const v = m[i][j];
  return Number.isFinite(v) ? v : 0;
}

/** 行合計 */
function rowTotalsOf(m: Matrix2): [number, number] {
  const r0 = (m[0][0] ?? 0) + (m[0][1] ?? 0);
  const r1 = (m[1][0] ?? 0) + (m[1][1] ?? 0);
  return [r0, r1];
}

/** 列合計 */
function colTotalsOf(m: Matrix2): [number, number] {
  const c0 = (m[0][0] ?? 0) + (m[1][0] ?? 0);
  const c1 = (m[0][1] ?? 0) + (m[1][1] ?? 0);
  return [c0, c1];
}

/** 総和 */
function grandTotalOf(m: Matrix2): number {
  const [r0, r1] = rowTotalsOf(m);
  return r0 + r1;
}

/** 期待度数（2×2 専用） */
function expectedFrom(
  rows: [number, number],
  cols: [number, number],
  grand: number
): Matrix2 {
  const g = grand > 0 ? grand : 1; // 0割保護
  return [
    [(rows[0] * cols[0]) / g, (rows[0] * cols[1]) / g],
    [(rows[1] * cols[0]) / g, (rows[1] * cols[1]) / g],
  ];
}

/** χ² 各セル寄与（2×2 専用） */
function chi2Breakdown(obs: Matrix2, exp: Matrix2): Matrix2 {
  const f = (o: number, e: number) => (e > 0 ? ((o - e) ** 2) / e : 0);
  return [
    [f(obs[0][0], exp[0][0]), f(obs[0][1], exp[0][1])],
    [f(obs[1][0], exp[1][0]), f(obs[1][1], exp[1][1])],
  ];
}

/** 不変・安全に 1 セルだけ更新する */
function setCell(m: Matrix2, i: 0 | 1, j: 0 | 1, v: number): Matrix2 {
  const next: Matrix2 = [
    [m[0][0], m[0][1]],
    [m[1][0], m[1][1]],
  ];
  next[i][j] = v;
  return next;
}

export default function ChiSquareGuide() {
  // 観測度数（任意に編集可能）
  const [obs, setObs] = useState<Matrix2>([
    [30, 20],
    [20, 30],
  ]);
  const [showExpected, setShowExpected] = useState(false);
  const [showChi, setShowChi] = useState(false);

  // 合計群
  const rows = useMemo(() => rowTotalsOf(obs), [obs]);   // [50,50]
  const cols = useMemo(() => colTotalsOf(obs), [obs]);   // [50,50]
  const grand = useMemo(() => grandTotalOf(obs), [obs]); // 100

  // 期待度数・χ²
  const exp = useMemo(() => expectedFrom(rows, cols, grand), [rows, cols, grand]);
  const chi = useMemo(() => chi2Breakdown(obs, exp), [obs, exp]);
  const chiTotal = useMemo(
    () => chi[0][0] + chi[0][1] + chi[1][0] + chi[1][1],
    [chi]
  );

  // 入力ハンドラ（整数・非負・NaN防止）
  const onChangeCell = (r: 0 | 1, c: 0 | 1, v: string) => {
    const nRaw = Number(v);
    const n = Number.isFinite(nRaw) ? Math.max(0, Math.floor(nRaw)) : 0;
    setObs(prev => setCell(prev, r, c, n));
    setShowExpected(false);
    setShowChi(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section style={card}>
        <h1 className="text-xl font-bold mb-1">クロス集計表とカイ二乗（χ²）検定</h1>
        <p style={sub} className="mb-3">
          2×2 のクロス集計表で、期待度数と χ² を段階的に確認できます（自由度は (2-1)×(2-1)=1）。
        </p>

        {/* 観測度数テーブル */}
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
              <tr>
                <td className="border p-2 font-bold">行1</td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={0}
                    value={get(obs, 0, 0)}
                    onChange={e => onChangeCell(0, 0, e.target.value)}
                    className="w-24 border rounded px-2 py-1"
                  />
                  {showExpected && (
                    <div className="text-xs text-rose-600 mt-1">(期待 {exp[0][0].toFixed(2)})</div>
                  )}
                  {showChi && (
                    <div className="text-xs text-blue-600">(χ² {chi[0][0].toFixed(3)})</div>
                  )}
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={0}
                    value={get(obs, 0, 1)}
                    onChange={e => onChangeCell(0, 1, e.target.value)}
                    className="w-24 border rounded px-2 py-1"
                  />
                  {showExpected && (
                    <div className="text-xs text-rose-600 mt-1">(期待 {exp[0][1].toFixed(2)})</div>
                  )}
                  {showChi && (
                    <div className="text-xs text-blue-600">(χ² {chi[0][1].toFixed(3)})</div>
                  )}
                </td>
                <td className="border p-2 font-bold text-center">{rows[0]}</td>
              </tr>

              <tr>
                <td className="border p-2 font-bold">行2</td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={0}
                    value={get(obs, 1, 0)}
                    onChange={e => onChangeCell(1, 0, e.target.value)}
                    className="w-24 border rounded px-2 py-1"
                  />
                  {showExpected && (
                    <div className="text-xs text-rose-600 mt-1">(期待 {exp[1][0].toFixed(2)})</div>
                  )}
                  {showChi && (
                    <div className="text-xs text-blue-600">(χ² {chi[1][0].toFixed(3)})</div>
                  )}
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={0}
                    value={get(obs, 1, 1)}
                    onChange={e => onChangeCell(1, 1, e.target.value)}
                    className="w-24 border rounded px-2 py-1"
                  />
                  {showExpected && (
                    <div className="text-xs text-rose-600 mt-1">(期待 {exp[1][1].toFixed(2)})</div>
                  )}
                  {showChi && (
                    <div className="text-xs text-blue-600">(χ² {chi[1][1].toFixed(3)})</div>
                  )}
                </td>
                <td className="border p-2 font-bold text-center">{rows[1]}</td>
              </tr>

              <tr className="bg-gray-50">
                <td className="border p-2 font-bold">列合計</td>
                <td className="border p-2 font-bold text-center">{cols[0]}</td>
                <td className="border p-2 font-bold text-center">{cols[1]}</td>
                <td className="border p-2 font-bold text-center">{grand}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 操作 */}
        <div className="flex gap-3 flex-wrap mb-4">
          <button
            type="button"
            onClick={() => { setShowExpected(true); setShowChi(false); }}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            1. 期待度数を表示
          </button>
          <button
            type="button"
            onClick={() => { setShowExpected(true); setShowChi(true); }}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            2. χ² を計算して表示
          </button>
          <button
            type="button"
            onClick={() => { setShowExpected(false); setShowChi(false); }}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            クリア
          </button>
        </div>

        {/* 結果 */}
        <div className="grid gap-2">
          {showExpected && (
            <div>
              <div className="font-bold mb-1">期待度数</div>
              <div style={sub} className="text-sm">
                E<sub>11</sub>={rows[0]}×{cols[0]}/{grand}={exp[0][0].toFixed(2)}、&nbsp;
                E<sub>12</sub>={rows[0]}×{cols[1]}/{grand}={exp[0][1].toFixed(2)}、&nbsp;
                E<sub>21</sub>={rows[1]}×{cols[0]}/{grand}={exp[1][0].toFixed(2)}、&nbsp;
                E<sub>22</sub>={rows[1]}×{cols[1]}/{grand}={exp[1][1].toFixed(2)}
              </div>
            </div>
          )}

          {showChi && (
            <div>
              <div className="font-bold mb-1">χ² の各セル寄与と合計（自由度 1）</div>
              <div style={sub} className="text-sm">
                {( ((get(obs,0,0)-exp[0][0])**2) / exp[0][0] ).toFixed(3)}、&nbsp;
                {( ((get(obs,0,1)-exp[0][1])**2) / exp[0][1] ).toFixed(3)}、&nbsp;
                {( ((get(obs,1,0)-exp[1][0])**2) / exp[1][0] ).toFixed(3)}、&nbsp;
                {( ((get(obs,1,1)-exp[1][1])**2) / exp[1][1] ).toFixed(3)}
              </div>
              <div className="mt-1 font-bold">χ² 合計 = {chiTotal.toFixed(3)}</div>
              <div style={sub} className="text-sm mt-1">
                5%水準・自由度1の臨界値は 3.841。χ² がこれを上回れば「統計的に有意な関連あり」。
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
