// src/components/guide/ChiSquareGuide.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';

/**
 * 運用トラブル防止・再発防止ポリシー（number[][] を維持）
 * - 配列サイズは可変（R×C）。欠損・NaN・0割を全面ガード
 * - 2次元読み取りは get2D() で一本化（範囲外/NaN→0）
 * - 状態配列（expected/chi）は R×C に自動リサイズ
 * - TS の strict / noUncheckedIndexedAccess でも未定義アクセスが出ない実装
 */
const safeNum = (x: unknown, fallback = 0): number =>
  Number.isFinite(x as number) ? (x as number) : fallback;

const get2D = (m: number[][], i: number, j: number): number =>
  safeNum(m?.[i]?.[j], 0);

export default function ChiSquareGuide() {
  // 観測度数（初期は 2×2 だが、number[][] のまま可変運用）
  const [obs, setObs] = useState<number[][]>([
    [30, 20],
    [20, 30],
  ]);

  // 行数・列数（列数は「最長行」の長さ）
  const R = useMemo(() => obs.length, [obs]);
  const C = useMemo(() => Math.max(0, ...obs.map(r => r.length)), [obs]);

  // 合計類（すべて get2D 経由で安全に集計）
  const rowTotals = useMemo<number[]>(() => {
    const out = Array.from({ length: R }, () => 0);
    for (let i = 0; i < R; i++) {
      let s = 0;
      for (let j = 0; j < C; j++) s += get2D(obs, i, j);
      out[i] = s;
    }
    return out;
  }, [obs, R, C]);

  const colTotals = useMemo<number[]>(() => {
    const out = Array.from({ length: C }, () => 0);
    for (let j = 0; j < C; j++) {
      let s = 0;
      for (let i = 0; i < R; i++) s += get2D(obs, i, j);
      out[j] = s;
    }
    return out;
  }, [obs, R, C]);

  const grand = useMemo(
    () => rowTotals.reduce((s, v) => s + safeNum(v, 0), 0),
    [rowTotals]
  );

  // 期待度数・χ²（R×C に常に揃える）
  const [expected, setExpected] = useState<number[][]>(
    Array.from({ length: R }, () => Array(C).fill(0))
  );
  const [chi, setChi] = useState<number[][]>(
    Array.from({ length: R }, () => Array(C).fill(0))
  );
  const chiTotal = useMemo(
    () => chi.flat().reduce((s, v) => s + safeNum(v, 0), 0),
    [chi]
  );

  // R/C が変わったら関連配列を再初期化（サイズずれ事故防止）
  useEffect(() => {
    setExpected(Array.from({ length: R }, () => Array(C).fill(0)));
    setChi(Array.from({ length: R }, () => Array(C).fill(0)));
  }, [R, C]);

  // UI トグル
  const [showExpected, setShowExpected] = useState(false);
  const [showChi, setShowChi] = useState(false);

  // 期待度数の計算（0割回避）
  const handleShowExpected = () => {
    const denom = grand > 0 ? grand : 1;
    const e = Array.from({ length: R }, () => Array(C).fill(0));
    for (let i = 0; i < R; i++) {
      const ri = safeNum(rowTotals[i], 0);
      for (let j = 0; j < C; j++) {
        const cj = safeNum(colTotals[j], 0);
        e[i][j] = (ri * cj) / denom;
      }
    }
    setExpected(e);
    setChi(Array.from({ length: R }, () => Array(C).fill(0)));
    setShowExpected(true);
    setShowChi(false);
  };

  // χ² の計算（E=0 は寄与 0）
  const handleShowChi = () => {
    // 期待度数が未計算なら先に計算
    const hasExpected = expected.some(row => row.some(v => v > 0));
    if (!hasExpected) {
      handleShowExpected();
    }
    // 計算
    const c = Array.from({ length: R }, () => Array(C).fill(0));
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        const o = get2D(obs, i, j);
        const e = safeNum(expected?.[i]?.[j], 0);
        if (e > 0) {
          const diff = o - e;
          c[i][j] = (diff * diff) / e;
        } else {
          c[i][j] = 0;
        }
      }
    }
    setChi(c);
    setShowExpected(true);
    setShowChi(true);
  };

  // セル入力（安全に 0 以上の整数へ整形）
  const onChangeCell = (i: number, j: number, v: string) => {
    const nRaw = Number(v);
    const n = Number.isFinite(nRaw) ? Math.max(0, Math.floor(nRaw)) : 0;
    setObs(prev => {
      const next = prev.map(row => row.slice());
      if (!next[i]) next[i] = [];
      next[i][j] = n;
      return next;
    });
    setShowExpected(false);
    setShowChi(false);
  };

  // 見た目
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  };
  const sub: React.CSSProperties = { color: '#64748b' };

  return (
    <section style={card}>
      <h1 className="text-xl font-bold mb-1">クロス集計表とカイ二乗（χ²）検定</h1>
      <p style={sub} className="mb-3">
        サイズ可変（{R}×{C}）に対応。未定義アクセス・0割・NaN を全面ガードしています。
      </p>

      {/* 観測度数テーブル */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-[520px] border-collapse">
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
                {Array.from({ length: C }, (_, j) => (
                  <td key={j} className="border p-2">
                    <input
                      type="number"
                      min={0}
                      value={get2D(obs, i, j)}
                      onChange={e => onChangeCell(i, j, e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                    {showExpected && (
                      <div className="text-xs text-rose-600 mt-1">
                        (期待 {safeNum(expected?.[i]?.[j], 0).toFixed(2)})
                      </div>
                    )}
                    {showChi && (
                      <div className="text-xs text-blue-600">
                        (χ² {safeNum(chi?.[i]?.[j], 0).toFixed(3)})
                      </div>
                    )}
                  </td>
                ))}
                <td className="border p-2 font-bold text-center">{safeNum(rowTotals?.[i], 0)}</td>
              </tr>
            ))}

            <tr className="bg-gray-50">
              <td className="border p-2 font-bold">列合計</td>
              {Array.from({ length: C }, (_, j) => (
                <td key={j} className="border p-2 font-bold text-center">
                  {safeNum(colTotals?.[j], 0)}
                </td>
              ))}
              <td className="border p-2 font-bold text-center">{grand}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 操作 */}
      <div className="flex gap-3 flex-wrap mb-4">
        <button
          type="button"
          onClick={handleShowExpected}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          1. 期待度数を表示
        </button>
        <button
          type="button"
          onClick={handleShowChi}
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
            <div className="font-bold mb-1">期待度数（動的サイズ対応）</div>
            <div style={sub} className="text-sm">
              各セル E<sub>ij</sub> = (行i合計 × 列j合計) / 全体。E=0 は自動的に回避/扱い済み。
            </div>
          </div>
        )}

        {showChi && (
          <div>
            <div className="font-bold mb-1">χ² の各セル寄与と合計</div>
            <div style={sub} className="text-sm">
              χ² = Σ (O−E)² / E（E=0 のセルは寄与 0）。合計 = {chiTotal.toFixed(3)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
