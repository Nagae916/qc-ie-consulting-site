// pages/guides/stat/chi-square.tsx
'use client';

import React, { useMemo, useState } from 'react';

/* ================================
   安全ユーティリティ（このページ内に内蔵）
   ================================ */

type Cell = number;
type Row = Cell[];
type Matrix = Row[];

/** 行合計 */
function rowSums(m: Matrix): number[] {
  return m.map((row: Row) =>
    row.reduce((s: number, v: number) => s + (Number.isFinite(v) ? v : 0), 0)
  );
}

/** 列合計（strict 安全版） */
function colSums(m: Matrix): number[] {
  const cols = Math.max(0, ...m.map((r: Row) => r.length));
  const sums: number[] = Array.from({ length: cols }, () => 0);
  for (let i = 0; i < m.length; i++) {
    const row: Row = (m[i] ?? []) as Row; // ← undefined を空配列にフォールバックしつつ Row に確定
    for (let j = 0; j < cols; j++) {
      const add = Number.isFinite(row[j]) ? (row[j] as number) : 0;
      sums[j] = (sums[j] ?? 0) + add;
    }
  }
  return sums;
}

/** 総計 */
function grandTotal(m: Matrix): number {
  return rowSums(m).reduce((s: number, v: number) => s + v, 0);
}

/** 期待度数 */
function expectedMatrix(m: Matrix): Matrix {
  const rs = rowSums(m);
  const cs = colSums(m);
  const gt = Math.max(1, rs.reduce((s: number, v: number) => s + v, 0)); // 0割防止
  return m.map((row: Row, i: number) =>
    row.map((_, j: number) => ((rs[i] ?? 0) * (cs[j] ?? 0)) / gt)
  );
}

/** 各セル χ² 値 */
function chiEach(m: Matrix, exp: Matrix): Matrix {
  return m.map((row: Row, i: number) =>
    row.map((o: number, j: number) => {
      const e = exp[i]?.[j] ?? 0;
      const oo = Number.isFinite(o) ? o : 0;
      return e > 0 ? Math.pow(oo - e, 2) / e : 0;
    })
  );
}

/** χ² 合計 */
function chiTotal(m: Matrix, exp: Matrix): number {
  const part = chiEach(m, exp);
  return part.reduce(
    (s: number, r: Row) => s + r.reduce((ss: number, v: number) => ss + v, 0),
    0
  );
}

/** 自由度 (行-1)*(列-1) */
function chiDf(m: Matrix): number {
  const r = m.length;
  const c = Math.max(0, ...m.map((row: Row) => row.length));
  return Math.max(0, (r - 1) * (c - 1));
}

/** 5%有意の臨界値（df 1..10 を簡易対応） */
const CHI2_5P: Record<number, number> = {
  1: 3.841, 2: 5.991, 3: 7.815, 4: 9.488, 5: 11.070,
  6: 12.592, 7: 14.067, 8: 15.507, 9: 16.919, 10: 18.307,
};
function crit5pct(df: number): number | undefined {
  return CHI2_5P[df];
}

/* ================================
   画面本体
   ================================ */

export default function ChiSquareGuide(): JSX.Element {
  // 例: 2x2 クロス表（性別×購入商品）
  const [obs, setObs] = useState<Matrix>([
    [30, 20],
    [20, 30],
  ]);

  // 計算はすべて useMemo で安定化
  const rowTotals = useMemo(() => rowSums(obs), [obs]);                 // [50, 50]
  const colTotals = useMemo(() => colSums(obs), [obs]);                 // [50, 50]
  const total     = useMemo(() => grandTotal(obs), [obs]);              // 100
  const expected  = useMemo(() => expectedMatrix(obs), [obs]);
  const chi2      = useMemo(() => chiTotal(obs, expected), [obs, expected]);
  const df        = useMemo(() => chiDf(obs), [obs]);
  const crit      = useMemo(() => crit5pct(df), [df]);
  const significant = crit !== undefined ? chi2 > crit : undefined;

  // 入力編集（将来編集用に安全ガード）
  const onChangeCell = (i: number, j: number, v: string) => {
    const n = Number(v);
    const val = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
    setObs(prev => {
      const next = prev.map(row => row.slice());
      if (!next[i]) next[i] = [];
      next[i][j] = val;
      return next;
    });
  };

  // 簡易スタイル
  const card: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,.04)' };
  const tbl: React.CSSProperties  = { borderCollapse:'collapse', width:'100%' };
  const thtd: React.CSSProperties = { border:'1px solid #e5e7eb', padding:8, textAlign:'center' };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-teal-700">クロス集計とカイ二乗検定（安全実装版）</h1>

      {/* 観測度数テーブル（編集可能） */}
      <div style={card}>
        <h2 className="font-semibold mb-3">観測度数（obs）</h2>
        <div className="overflow-x-auto">
          <table style={tbl}>
            <thead>
              <tr>
                <th style={thtd}></th>
                {colTotals.map((_, j: number) => (
                  <th key={`colh-${j}`} style={thtd}>列{j + 1}</th>
                ))}
                <th style={{ ...thtd, fontWeight:700 }}>行合計</th>
              </tr>
            </thead>
            <tbody>
              {obs.map((row: Row, i: number) => (
                <tr key={`row-${i}`}>
                  <th style={{ ...thtd, fontWeight:700 }}>行{i + 1}</th>
                  {colTotals.map((_, j: number) => (
                    <td key={`cell-${i}-${j}`} style={thtd}>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={Number.isFinite(row?.[j]) ? row[j] : 0}
                        onChange={(e) => onChangeCell(i, j, e.target.value)}
                        className="w-20 rounded border px-2 py-1 text-center"
                      />
                    </td>
                  ))}
                  <td style={{ ...thtd, fontWeight:700 }}>{rowTotals[i] ?? 0}</td>
                </tr>
              ))}
              <tr style={{ background:'#f8fafc' }}>
                <th style={{ ...thtd, fontWeight:700 }}>列合計</th>
                {colTotals.map((c: number, j: number) => (
                  <td key={`csum-${j}`} style={{ ...thtd, fontWeight:700 }}>{c}</td>
                ))}
                <td style={{ ...thtd, fontWeight:700 }}>{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 期待度数 */}
      <div style={card}>
        <h2 className="font-semibold mb-3">期待度数（expected）</h2>
        <div className="overflow-x-auto">
          <table style={tbl}>
            <thead>
              <tr>
                <th style={thtd}></th>
                {colTotals.map((_, j: number) => (
                  <th key={`eh-${j}`} style={thtd}>列{j + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expected.map((row: Row, i: number) => (
                <tr key={`erow-${i}`}>
                  <th style={{ ...thtd, fontWeight:700 }}>行{i + 1}</th>
                  {row.map((v: number, j: number) => (
                    <td key={`e-${i}-${j}`} style={thtd}>{v.toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 結果まとめ */}
      <div style={card}>
        <h2 className="font-semibold mb-3">検定結果（要約）</h2>
        <ul className="list-disc list-inside space-y-1 text-slate-700">
          <li>自由度 df = <b>{df}</b></li>
          <li>χ² 合計 = <b>{chi2.toFixed(3)}</b></li>
          <li>
            5%臨界値{crit !== undefined ? <>（df={df}）= <b>{crit}</b></> : '：この df はテーブル範囲外です'}
          </li>
          <li>
            判定：
            {significant === undefined ? (
              <> df に対するテーブルが無いため省略</>
            ) : significant ? (
              <span className="text-rose-600 font-bold"> 有意（帰無仮説を棄却）</span>
            ) : (
              <span className="text-slate-700 font-bold"> 有意ではない（帰無仮説を採択）</span>
            )}
          </li>
        </ul>
        <p className="text-xs text-slate-500 mt-2">
          ※ 臨界値は df=1..10 の代表値のみ同梱しています。より広い df や厳密な p 値が必要な場合は分布関数の追加をご検討ください。
        </p>
      </div>
    </div>
  );
}
