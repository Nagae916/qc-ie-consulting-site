'use client';
import React, { useMemo, useState } from 'react';
import {
  Chart as C,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

C.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * 運用トラブル＆再発防止の方針（number[][] を維持）
 * - 配列サイズは可変（行数・列数ともに動的）
 * - すべての 2 次元アクセスは get2D() 経由で安全化（範囲外/NaN を 0 にフォールバック）
 * - 合計/期待度数/χ² は 0 割・NaN を徹底ガード
 * - JSX 内では直接 m[i][j] に触れず、必ず get2D() or ローカル変数で未定義を除去
 */

// ========= 安全ヘルパ =========
const safeNum = (x: unknown, fallback = 0): number =>
  Number.isFinite(x as number) ? (x as number) : fallback;

const get2D = (m: number[][], i: number, j: number): number =>
  safeNum(m?.[i]?.[j], 0);

// ========= コンポーネント =========
export default function ChiSquareGuide() {
  // 観測度数（固定サンプルだが、サイズは動的に扱う）
  const [obs] = useState<number[][]>([
    [30, 20],
    [20, 30],
  ]);

  // 行数・列数（列数は「最長行の長さ」）
  const R = useMemo(() => obs.length, [obs]);
  const C = useMemo(() => Math.max(0, ...obs.map(r => r.length)), [obs]);

  // 合計類（動的 + 型安全／noUncheckedIndexedAccess対応）
  const rowTotals = useMemo<number[]>(() => {
    const out: number[] = new Array(R).fill(0);
    for (let i = 0; i < R; i++) {
      let s = 0;
      for (let j = 0; j < C; j++) s += get2D(obs, i, j);
      out[i] = s;
    }
    return out;
  }, [obs, R, C]);

  const colTotals = useMemo<number[]>(() => {
    const out: number[] = new Array(C).fill(0);
    for (let j = 0; j < C; j++) {
      let s = 0;
      for (let i = 0; i < R; i++) s += get2D(obs, i, j);
      out[j] = s;
    }
    return out;
  }, [obs, R, C]);

  const grandTotal = useMemo<number>(
    () => rowTotals.reduce((s, v) => s + safeNum(v, 0), 0),
    [rowTotals]
  );

  // 期待度数・χ^2 関連（number[][] のまま、サイズは都度 R×C で揃える）
  const [expected, setExpected] = useState<number[][]>(
    Array.from({ length: R }, () => Array(C).fill(0))
  );
  const [chiValues, setChiValues] = useState<number[][]>(
    Array.from({ length: R }, () => Array(C).fill(0))
  );
  const [chiTotal, setChiTotal] = useState<number | null>(null);

  // 期待度数の計算（0割/不定長に配慮）
  const handleCalcExpected = () => {
    const denom = grandTotal > 0 ? grandTotal : 1; // 0割回避
    const e: number[][] = Array.from({ length: R }, () => Array(C).fill(0));
    for (let i = 0; i < R; i++) {
      const ri = safeNum(rowTotals[i], 0);
      for (let j = 0; j < C; j++) {
        const cj = safeNum(colTotals[j], 0);
        e[i][j] = (ri * cj) / denom;
      }
    }
    setExpected(e);
    setChiValues(Array.from({ length: R }, () => Array(C).fill(0)));
    setChiTotal(null);
  };

  // χ^2 の計算（E=0 をガード）
  const handleCalcChi = () => {
    // 期待度数が未計算なら何もしない
    const expectedFilled = expected.some(row => row.some(v => v > 0));
    if (!expectedFilled) return;

    const chi: number[][] = Array.from({ length: R }, () => Array(C).fill(0));
    let total = 0;
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        const o = get2D(obs, i, j);
        const e = safeNum(expected?.[i]?.[j], 0);
        if (e > 0) {
          const diff = o - e;
          const v = (diff * diff) / e;
          chi[i][j] = v;
          total += v;
        } else {
          chi[i][j] = 0; // 期待度数が 0 のセルは寄与 0（あるいはスキップ）
        }
      }
    }
    setChiValues(chi);
    setChiTotal(total);
  };

  // グラフ（Bar）：R×C をフラットに並べる
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

  const chartOptions = useMemo(
    () => ({
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
    }),
    []
  );

  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  };
  const btn: React.CSSProperties = {
    background: '#0f766e',
    color: '#fff',
    fontWeight: 700,
    padding: '10px 16px',
    borderRadius: 10,
    border: 0,
    cursor: 'pointer',
  };
  const btn2: React.CSSProperties = {
    background: '#115e59',
    color: '#fff',
    fontWeight: 700,
    padding: '10px 16px',
    borderRadius: 10,
    border: 0,
    cursor: 'pointer',
  };

  const expectedFilled = useMemo(
    () => expected.some(row => row.some(v => v > 0)),
    [expected]
  );

  return (
    <div className="space-y-16">
      {/* 概要 */}
      <section>
        <h2 className="text-3xl font-bold text-teal-700 mb-4">クロス集計表（動的サイズ対応）</h2>
        <p className="text-lg text-stone-700 leading-relaxed">
          このガイドでは、クロス集計表とカイ二乗検定の基礎をインタラクティブに学びます。<br />
          <strong>number[][]</strong> のままサイズ可変に対応し、未定義・0割・NaN をすべてガードしています。
        </p>
      </section>

      {/* 手順 */}
      <section style={card}>
        <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">カイ二乗 (χ²) 検定の手順</h2>
        <ol className="list-decimal ml-6 space-y-2 text-stone-700">
          <li>帰無仮説 H<sub>0</sub>：2変数は独立（関連なし）</li>
          <li>期待度数 E の計算： (行合計 × 列合計) ÷ 全体</li>
          <li>χ² = Σ (O−E)² / E を計算</li>
          <li>自由度と有意水準から判定（P値 or 臨界値）</li>
        </ol>
      </section>

      {/* 実践 */}
      <section style={card}>
        <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">実践：カイ二乗検定を体験</h2>
        <p className="text-center text-stone-600 mb-6">
          下表は動的サイズ（{R}×{C}）でレンダリングされます。
        </p>

        {/* 表 */}
        <div className="overflow-x-auto mb-6">
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
                <td className="border p-3 text-center text-lg font-bold">
                  {grandTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ボタン */}
        <div className="text-center mb-6 flex gap-3 justify-center">
          <button style={btn} onClick={handleCalcExpected} disabled={expectedFilled}>
            1. 期待度数を計算
          </button>
          <button style={btn2} onClick={handleCalcChi} disabled={!expectedFilled || chiTotal !== null}>
            2. カイ二乗値を計算
          </button>
        </div>

        {/* 計算結果 */}
        <div className="text-center space-y-2">
          {expectedFilled && (
            <div className="text-lg">
              <strong>期待度数を計算しました。</strong> 各セル下に (期待: …) を表示しています。
            </div>
          )}
          {chiTotal !== null && (
            <>
              <div className="text-xl font-bold">合計カイ二乗値: χ² = {chiTotal.toFixed(3)}</div>
              <div className="text-base">
                自由度 {(R - 1) * (C - 1)}、有意水準5%の臨界値は表に依存します（R×C によって異なる）。<br />
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

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,.04)',
};
