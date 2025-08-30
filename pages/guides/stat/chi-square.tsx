// pages/guides/stat/chi-square.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as CJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import {
  safeNum, get2D, makeZero, dimsOf,
  rowSums as rowTotalsOf,
  colSums as colTotalsOf,
  grandTotal as grandTotalOf,
  expectedMatrix as expectedOf,
  chiEach, chiTotal as chiTotalOf,
} from '@/lib/safe-matrix';

CJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ToggleMap = Record<number, boolean>;

export default function ChiSquareGuide() {
  // 観測度数（2×2 初期・number[][] のまま運用）
  const [obs, setObs] = useState<number[][]>([[30, 20], [20, 30]]);

  // 合計類
  const { R, C } = useMemo(() => dimsOf(obs), [obs]); // 期待は 2×2 だが将来拡張に耐える
  const rowTotals = useMemo(() => rowTotalsOf(obs), [obs]);
  const colTotals = useMemo(() => colTotalsOf(obs), [obs]);
  const grandTotal = useMemo(() => grandTotalOf(obs), [obs]);

  // 期待度数・χ²（表示トグルに合わせて計算/初期化）
  const [expected, setExpected] = useState<number[][]>(makeZero(R, C));
  const [chiValues, setChiValues] = useState<number[][]>(makeZero(R, C));
  const [chiTotal, setChiTotal] = useState<number | null>(null);

  useEffect(() => {
    // サイズ変化時に派生状態をリセット（事故防止）
    setExpected(makeZero(R, C));
    setChiValues(makeZero(R, C));
    setChiTotal(null);
  }, [R, C]);

  const handleCalcExpected = () => {
    const e = expectedOf(obs); // 内部で行/列/総和から安全計算（0割回避）
    setExpected(e);
    setChiValues(makeZero(R, C));
    setChiTotal(null);
  };

  const handleCalcChi = () => {
    const hasExpected = expected.some(r => r.some(v => v > 0));
    if (!hasExpected) return;
    const ce = chiEach(obs, expected);
    setChiValues(ce);
    setChiTotal(chiTotalOf(obs, expected));
  };

  // UI トグル（当初の UI を維持）
  const [showConcept, setShowConcept] = useState<ToggleMap>({});
  const [openQA, setOpenQA] = useState<ToggleMap>({});

  // セル入力（0 以上の整数へ整形）
  const onChangeCell = (i: number, j: number, v: string) => {
    const nRaw = Number(v);
    const n = Number.isFinite(nRaw) ? Math.max(0, Math.floor(nRaw)) : 0;
    setObs(prev => {
      const next = prev.map(r => r.slice());
      if (!next[i]) next[i] = [];
      next[i][j] = n;
      return next;
    });
    // 計算類はクリア
    setExpected(makeZero(R, C));
    setChiValues(makeZero(R, C));
    setChiTotal(null);
  };

  // グラフ（当初 UI と同等の構成）
  const chartData = useMemo(() => {
    // 当初 UI のラベル順：男性/商品A, 女性/商品A, 男性/商品B, 女性/商品B
    const labels = ['男性/商品A', '女性/商品A', '男性/商品B', '女性/商品B'];
    const obsVals = [
      get2D(obs, 0, 0), get2D(obs, 0, 1),
      get2D(obs, 1, 0), get2D(obs, 1, 1),
    ];
    const expVals = [
      get2D(expected, 0, 0), get2D(expected, 0, 1),
      get2D(expected, 1, 0), get2D(expected, 1, 1),
    ];
    return {
      labels,
      datasets: [
        { label: '観測度数', data: obsVals, borderWidth: 1 },
        { label: '期待度数', data: expVals, borderWidth: 1 },
      ],
    };
  }, [obs, expected]);

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
    scales: { y: { beginAtZero: true, title: { display: true, text: '度数' } } },
  }), []);

  // 見た目（当初の UI に合わせる）
  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  };
  const btn: React.CSSProperties  = { background: '#0f766e', color: '#fff', fontWeight: 700, padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer' };
  const btn2: React.CSSProperties = { background: '#115e59', color: '#fff', fontWeight: 700, padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer' };
  const sub: React.CSSProperties  = { color: '#64748b' };

  const expectedFilled = useMemo(() => expected.some(r => r.some(v => v > 0)), [expected]);

  return (
    <div className="space-y-16">
      {/* 概要 */}
      <section>
        <h2 className="text-3xl font-bold text-teal-700 mb-4">クロス集計表へようこそ</h2>
        <p className="text-lg text-stone-700 leading-relaxed">
          このガイドでは、クロス集計表とカイ二乗検定の基礎をインタラクティブに学びます。
          2つの変数の関連性を、期待度数と観測度数の「ズレ」に着目して理解します。
        </p>
      </section>

      {/* 重要コンセプト */}
      <section>
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">重要コンセプトを学ぶ</h2>
        <p className="text-center text-stone-600 mb-8 max-w-2xl mx-auto">各カードをクリックして概念を確認しましょう。</p>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: '質的変数 vs 量的変数', body: 'クロス集計表は性別・購入商品のような「質的変数」の関連を分析します。身長や売上は「量的変数」なので散布図や相関を使います。' },
            { title: '帰無仮説', body: 'まず「2変数は独立（関連なし）」を仮説に置きます。データがどれだけそこからズレているかを測るのがカイ二乗検定です。' },
            { title: 'カイ二乗値とP値', body: 'カイ二乗値は観測度数と期待度数のズレの大きさ。P値は、そのズレが偶然でも起こりうるかの確率。有意水準未満なら独立を棄却します。' },
            { title: '自由度', body: '自由度 = (行数-1)×(列数-1)。セルの度数ではなく「行・列の数」から決まります。' },
          ].map((card, i) => (
            <div key={i} style={cardStyle} className="cursor-pointer"
                 onClick={() => setShowConcept(v => ({ ...v, [i]: !v[i] }))}>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              {showConcept[i] && <p className="text-stone-700">{card.body}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* 手順 */}
      <section style={cardStyle}>
        <h2 className="text-3xl font-bold text-teal-700 mb-4 text-center">カイ二乗 (χ²) 検定の手順</h2>
        <ol className="list-decimal ml-6 space-y-2 text-stone-700">
          <li>帰無仮説 H<sub>0</sub>：2変数は独立（関連なし）</li>
          <li>期待度数 E の計算： (行合計 × 列合計) ÷ 全体</li>
          <li>χ² = Σ (O−E)² / E を計算</li>
          <li>自由度と有意水準から判定（P値 or 臨界値）</li>
        </ol>
      </section>

      {/* 実践 */}
      <section style={cardStyle}>
        <h2 className="text-3xl font-bold text-teal-700 mb-4 text-center">実践：カイ二乗検定を体験</h2>
        <p className="text-center text-stone-600 mb-6">
          「性別」と「購入商品」に関連はある？ ボタンで期待度数→χ²を計算してみましょう。
        </p>

        {/* 表 */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-stone-100">
                <th className="border p-3"></th>
                <th className="border p-3">性別: 男性</th>
                <th className="border p-3">性別: 女性</th>
                <th className="border p-3 font-bold">合計</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1].map(i => (
                <tr key={i}>
                  <td className="border p-3 font-bold">{i === 0 ? '商品A' : '商品B'}</td>
                  {[0, 1].map(j => {
                    const o = get2D(obs, i, j);
                    const e = get2D(expected, i, j);
                    const c = get2D(chiValues, i, j);
                    return (
                      <td key={j} className="border p-3 text-center text-lg">
                        <div>{o}</div>
                        {e > 0 && (
                          <div className="text-sm text-red-600">(期待: {e.toFixed(2)})</div>
                        )}
                        {c > 0 && (
                          <div className="text-xs text-blue-600">(χ²={c.toFixed(2)})</div>
                        )}
                      </td>
                    );
                  })}
                  <td className="border p-3 text-center text-lg font-bold">{safeNum(rowTotals[i], 0)}</td>
                </tr>
              ))}
              <tr className="bg-stone-100">
                <td className="border p-3 font-bold">合計</td>
                <td className="border p-3 text-center text-lg font-bold">{safeNum(colTotals[0], 0)}</td>
                <td className="border p-3 text-center text-lg font-bold">{safeNum(colTotals[1], 0)}</td>
                <td className="border p-3 text-center text-lg font-bold">{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ボタン */}
        <div className="text-center mb-6 flex gap-3 justify-center">
          <button style={btn}  onClick={handleCalcExpected} disabled={expectedFilled}>1. 期待度数を計算</button>
          <button style={btn2} onClick={handleCalcChi}      disabled={!expectedFilled || chiTotal !== null}>2. カイ二乗値を計算</button>
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
                自由度 {(2 - 1) * (2 - 1)}、有意水準5%の臨界値は 3.841。<br />
                計算値 {chiTotal.toFixed(3)} {chiTotal > 3.841 ? '>' : '≤'} 3.841 なので、
                {chiTotal > 3.841 ? '「関連あり（独立を棄却）」' : '「関連は有意でない（独立を棄却しない）」'} と判定。
              </div>
            </>
          )}
        </div>

        {/* グラフ */}
        <div style={{ height: 340 }} className="mt-6">
          <Bar data={chartData as any} options={chartOptions as any} />
        </div>
      </section>

      {/* 理解度チェック（QA） */}
      <section>
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">理解度チェック</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {QA_LIST.map((qa, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border">
              <button
                className="w-full text-left p-4 font-bold text-lg flex justify-between items-center"
                onClick={() => setOpenQA(v => ({ ...v, [i]: !v[i] }))}
              >
                <span>{qa.q}</span>
                <span>{openQA[i] ? '−' : '+'}</span>
              </button>
              {openQA[i] && <div className="p-4 border-t text-stone-700">{qa.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const QA_LIST = [
  { q: 'カイ二乗検定が適用できるデータの種類は？', a: '性別、合否などのカテゴリ（質的）データ。' },
  { q: '期待度数を計算する目的は？', a: '「独立ならどうなるか」という基準を作り、観測データとのズレを測るため。' },
  { q: 'カイ二乗値が大きい＝関連の強さ ではありますか？', a: 'いいえ。関連の有無の検定。強さはファイ係数やクラメールのVなどで評価。' },
  { q: '期待度数に関する不適切な記述はどれ？', a: '「差の絶対値が大きいほど独立の可能性が高い」は誤り。差が大きいほど独立でない可能性が高い。' },
];
