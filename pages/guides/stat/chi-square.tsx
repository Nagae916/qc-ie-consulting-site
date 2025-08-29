// pages/guides/stat/chi-square.tsx
'use client';
import React, { useMemo, useState } from 'react';

/** 2×2 専用の厳密タプル型（undefined を許さない） */
type Row = [number, number];
type Matrix2 = [Row, Row];

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,.04)',
};

const label: React.CSSProperties = { fontWeight: 700, marginBottom: 6 };
const sub: React.CSSProperties = { color: '#64748b' };

/** 行合計 [r1, r2] */
function rowTotalsOf(m: Matrix2): Row {
  return [m[0][0] + m[0][1], m[1][0] + m[1][1]];
}
/** 列合計 [c1, c2] */
function colTotalsOf(m: Matrix2): Row {
  return [m[0][0] + m[1][0], m[0][1] + m[1][1]];
}
/** 総和 */
function grandTotalOf(m: Matrix2): number {
  const rows = rowTotalsOf(m);
  return rows[0] + rows[1];
}
/** 期待度数（2×2 専用） */
function expectedFrom(rows: Row, cols: Row, grand: number): Matrix2 {
  const g = grand > 0 ? grand : 1; // 0割保護
  return [
    [(rows[0] * cols[0]) / g, (rows[0] * cols[1]) / g],
    [(rows[1] * cols[0]) / g, (rows[1] * cols[1]) / g],
  ];
}
/** χ² 各セル寄与分（2×2 専用） */
function chi2Breakdown(obs: Matrix2, exp: Matrix2): Matrix2 {
  const f = (o: number, e: number) => (e > 0 ? ((o - e) ** 2) / e : 0);
  return [
    [f(obs[0][0], exp[0][0]), f(obs[0][1], exp[0][1])],
    [f(obs[1][0], exp[1][0]), f(obs[1][1], exp[1][1])],
  ];
}

export default function ChiSquareGuide() {
  // 初期観測度数
  const [obs, setObs] = useState<Matrix2>([
    [30, 20],
    [20, 30],
  ]);
  const [showExpected, setShowExpected] = useState(false);
  const [showChi, setShowChi] = useState(false);

  // 合計類
  const rows = useMemo(() => rowTotalsOf(obs), [obs]);
  const cols = useMemo(() => colTotalsOf(obs), [obs]);
  const grand = useMemo(() => grandTotalOf(obs), [obs]);

  // 期待度数・χ²
  const exp = useMemo(() => expectedFrom(rows, cols, grand), [rows, cols, grand]);
  const chi = useMemo(() => chi2Breakdown(obs, exp), [obs, exp]);
  const chiTotal = useMemo(() => chi[0][0] + chi[0][1] + chi[1][0] + chi[1][1], [chi]);

  // 入力ハンドラ（整数・非負にクリーニング）
  const onChangeCell = (r: 0 | 1, c: 0 | 1, v: string) => {
    const n = Math.max(0, Math.floor(Number(v)));
    setObs(prev => {
      const next: Matrix2 = [
        [prev[0][0], prev[0][1]],
        [prev[1][0], prev[1][1]],
      ];
      next[r][c] = Number.isFinite(n) ? n : 0;
      return next;
    });
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
                    value={obs[0][0]}
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
                    value={obs[0][1]}
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
                    value={obs[1][0]}
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
                    value={obs[1][1]}
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

        {/* 操作ボタン */}
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

        {/* 結果表示 */}
        <div className="grid gap-2">
          {showExpected && (
            <div>
              <div style={label}>期待度数</div>
              <div style={sub} className="text-sm">
                E<sub>11</sub>={(rows[0])}×{cols[0]}/{grand}={exp[0][0].toFixed(2)}、&nbsp;
                E<sub>12</sub>={(rows[0])}×{cols[1]}/{grand}={exp[0][1].toFixed(2)}、&nbsp;
                E<sub>21</sub>={(rows[1])}×{cols[0]}/{grand}={exp[1][0].toFixed(2)}、&nbsp;
                E<sub>22</sub>={(rows[1])}×{cols[1]}/{grand}={exp[1][1].toFixed(2)}
              </div>
            </div>
          )}

          {showChi && (
            <div>
              <div style={label}>χ² の各セル寄与と合計（自由度 1）</div>
              <div style={sub} className="text-sm">
                {( (obs[0][0]-exp[0][0])**2/exp[0][0] ).toFixed(3)}、&nbsp;
                {( (obs[0][1]-exp[0][1])**2/exp[0][1] ).toFixed(3)}、&nbsp;
                {( (obs[1][0]-exp[1][0])**2/exp[1][0] ).toFixed(3)}、&nbsp;
                {( (obs[1][1]-exp[1][1])**2/exp[1][1] ).toFixed(3)}
              </div>
              <div className="mt-1 font-bold">χ² 合計 = {chiTotal.toFixed(3)}</div>
              <div style={sub} className="text-sm mt-1">
                5%水準での臨界値（自由度1）は 3.841。χ² がこれを上回れば「統計的に有意な関連あり」と判断。
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
