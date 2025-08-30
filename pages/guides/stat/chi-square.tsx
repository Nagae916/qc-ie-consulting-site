// pages/guides/stat/chi-square.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as CJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

CJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * 運用トラブル防止・再発防止ポリシー（number[][] を維持）
 * - 行/列サイズは動的（R×C）。欠損・NaN・0割を全面ガード
 * - 2次元アクセスは get2D()、書き込みは ensureRow() + 直接代入で安全化
 * - TS の noUncheckedIndexedAccess 前提で「未定義」をすべて吸収
 */
const safeNum = (x: unknown, fallback = 0): number =>
  Number.isFinite(x as number) ? (x as number) : fallback;

const get2D = (m: number[][], i: number, j: number): number =>
  safeNum(m?.[i]?.[j], 0);

const ensureRow = (m: number[][], i: number, cols: number): number[] => {
  if (!m[i]) m[i] = Array(cols).fill(0);
  // 行はあるが長さ不足の場合は埋める
  if (m[i].length < cols) m[i] = [...m[i], ...Array(cols - m[i].length).fill(0)];
  return m[i];
};

export default function ChiSquareGuide() {
  // 観測度数（例：2×2。将来的にサイズ可変で運用）
  const [obs] = useState<number[][]>([
    [30, 20],
    [20, 30],
  ]);

  // 現在の行数・列数（列数は「最長行」の長さ）
  const R = useMemo(() => obs.length, [obs]);
  const C = useMemo(() => Math.max(0, ...obs.map(r => r.length)), [obs]);

  // 合計類（行・列・全体）
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

  const grandTotal = useMemo(
    () => rowTotals.reduce((s, v) => s + safeNum(v, 0), 0),
    [rowTotals]
  );

  // 期待度数・χ²（number[][] のまま。R×C に合わせて維持）
  const [expected, setExpected] = useState<number[][]>(
    Array.from({ length: R }, () => Array(C).fill(0))
  );
  const [chiValues, setChiValues] = useState<number[][]>(
    Array.from({ length: R }, () => Array(C).fill(0))
  );
  const [chiTotal, setChiTotal] = useState<number | null>(null);

  // R/C 変化時に配列を再初期化（運用事故防止）
  useEffect(() => {
    setExpected(Array.from({ length: R }, () => Array(C).fill(0)));
    setChiValues(Array.from({ length: R }, () => Array(C).fill(0)));
    setChiTotal(null);
  }, [R, C]);

  // 期待度数の計算（0割回避・未定義吸収）
  const handleCalcExpected = () => {
    const denom = grandTotal > 0 ? grandTotal : 1;
    const e: number[][] = Array.from({ length: R }, () => Array(C).fill(0));
    for (let i = 0; i < R; i++) {
      const ri = safeNum(rowTotals[i], 0);
      const rowRef = ensureRow(e, i, C);
      for (let j = 0; j < C; j++) {
        const cj = safeNum(colTotals[j], 0);
        rowRef[j] = (ri * cj) / denom;
      }
    }
    setExpected(e);
    setChiValues(Array.from({ length: R }, () => Array(C).fill(0)));
    setChiTotal(null);
  };

  // χ² の計算（E=0 は寄与 0）
  const handleCalcChi = () => {
    const hasExpected = expected.some(row => row.some(v => v > 0));
    if (!hasExpected) return;

    const chi: number[][] = Array.from({ length: R }, () => Array(C).fill(0));
    let total = 0;
    for (let i = 0; i < R; i++) {
      const rowRef = ensureRow(chi, i, C);
      for (let j = 0; j < C; j++) {
        const o = get2D(obs, i, j);
        const e = safeNum(expected?.[i]?.[j], 0);
        if (e > 0) {
          const diff = o - e;
          const v = (diff * diff) / e;
          rowRef[j] = v;
          total += v;
        } else {
          rowRef[j] = 0;
        }
      }
    }
    setChiValues(chi);
    setChiTotal(total);
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
        expVals.push(safeNum(expected?.[i]?.[j], 0));
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
    scales: {
      y: { beginAtZero: true, title: { display: true, text: '度数' } },
    },
  }), []);

  // 簡易スタイル
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  };
  const btn: React.CSSProperties = {
    background: '#0f766e', color: '#fff', fontWeight: 700,
    padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer',
  };
  const btn2: React.CSSProperties = {
    background: '#115e59', color: '#fff', fontWeight: 700,
    padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer',
  };

  const expectedFilled = useMemo(
    () => expected.some(row => row.some(v => v > 0)),
    [expected]
  );

  return (
    <div className="space-y-12">
      {/* 概要 */}
      <section>
        <h2 className="text-3xl font-bold text-teal-700 mb-3">クロス集計表（動的サイズ対応）</h2>
        <p className="text-stone-700">
          配列サイズ可変（{R}×{C}）で、未定義アクセス・0割・NaN を全面ガードしています。
          入力が不揃いでも安全に計算・表示できます。
        </p>
      </section>

      {/* 手順 */}
      <section style={card}>
        <h3 className="text-2xl font-bold text-teal-700 mb-3 text-center">カイ二乗 (χ²) 検定の手順</h3>
        <ol className="list-decimal ml-6 space-y-1 text-stone-700">
          <li>期待度数 E を計算： (行合計 × 列合計) ÷ 全体</li>
          <li>χ² = Σ (O−E)² / E を計算（E=0 は寄与 0 として扱う）</li>
          <li>自由度 (R−1)×(C−1)、有意水準から判定（P値/臨界値）</li>
        </ol>
      </section>

      {/* 表 */}
      <section style={card}>
        <h3 className="text-xl font-bold mb-3">表（観測・期待・χ² 寄与）</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[560px] border-collapse">
            <thead>
              <tr className="bg-stone-100">
                <th className="border p-3"></th>
                {Array.from({ length: C }, (_, j) => (
                  <th key={j} className="border p-3">列{j + 1}</th>
                ))}
                <th className="border p-3 font-bold">行合計</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: R }, (_, i) => (
                <tr key={i}>
                  <td className="border p-3 font-bold">行{i + 1}</td>
                  {Array.from({ length: C }, (_, j) => {
                    const oij = get2D(obs, i, j);
                    const eij = safeNum(expected?.[i]?.[j], 0);
                    const cij = safeNum(chiValues?.[i]?.[j], 0);
                    return (
                      <td key={j} className="border p-3 text-center text-lg">
                        <div>{oij}</div>
                        {eij > 0 && (
                          <div className="text-sm text-red-600">(期待: {eij.toFixed(2)})</div>
                        )}
                        {cij > 0 && (
                          <div className="text-xs text-blue-600">(χ²={cij.toFixed(2)})</div>
                        )}
                      </td>
                    );
                  })}
                  <td className="border p-3 text-center text-lg font-bold">
                    {safeNum(rowTotals?.[i], 0)}
                  </td>
                </tr>
              ))}
              <tr className="bg-stone-100">
                <td className="border p-3 font-bold">列合計</td>
                {Array.from({ length: C }, (_, j) => (
                  <td key={j} className="border p-3 text-center text-lg font-bold">
                    {safeNum(colTotals?.[j], 0)}
                  </td>
                ))}
                <td className="border p-3 text-center text-lg font-bold">{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 操作 */}
        <div className="mt-4 flex gap-3 justify-center">
          <button style={btn} onClick={handleCalcExpected} disabled={expectedFilled}>
            1. 期待度数を計算
          </button>
          <button style={btn2} onClick={handleCalcChi} disabled={!expectedFilled || chiTotal !== null}>
            2. カイ二乗値を計算
          </button>
        </div>

        {/* 結果 */}
        <div className="text-center mt-4 space-y-2">
          {expectedFilled && (
            <div className="text-stone-700">
              <strong>期待度数を計算しました。</strong> 各セル下に (期待: …) を表示しています。
            </div>
          )}
          {chiTotal !== null && (
            <>
              <div className="text-xl font-bold">合計カイ二乗値: χ² = {chiTotal.toFixed(3)}</div>
              <div className="text-stone-700">
                自由度 {(R - 1) * (C - 1)}。有意水準5%の臨界値は R×C に依存します。<br />
                計算値が臨界値を上回れば「関連あり（独立を棄却）」、下回れば「有意差なし（独立を棄却しない）」。
              </div>
            </>
          )}
        </div>

        {/* グラフ */}
        <div style={{ height: 340 }} className="mt-6">
          <Bar data={chartData as any} options={chartOptions as any} />
        </div>
      </section>
    </div>
  );
}
