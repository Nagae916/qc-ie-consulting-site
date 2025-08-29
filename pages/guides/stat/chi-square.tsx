'use client';
import React, { useMemo, useState } from 'react';
import {
  Chart as C,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

C.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Cell = { r: number; c: number };

export default function ChiSquareGuide() {
  // 観測度数（固定サンプル）: 2×2
  const [obs] = useState<number[][]>([[30, 20], [20, 30]]);

  // 合計類（動的 + 型安全／noUncheckedIndexedAccess対応）
  const rowTotals = useMemo<[number, number]>(() => {
    const I = [0, 1] as const; // i: 0|1
    return I.map(i =>
      (obs[i]?.reduce<number>((s, v) => s + (Number.isFinite(v) ? v : 0), 0)) ?? 0
    ) as [number, number];
  }, [obs]);

  const colTotals = useMemo<[number, number]>(() => {
    const J = [0, 1] as const; // j: 0|1
    return J.map(j =>
      (obs[0]?.[j] ?? 0) + (obs[1]?.[j] ?? 0)
    ) as [number, number];
  }, [obs]);

  const grandTotal = useMemo<number>(() => rowTotals[0] + rowTotals[1], [rowTotals]);

  // 期待度数・χ^2 関連
  const [expected, setExpected] = useState<[[number, number], [number, number]]>([[0, 0], [0, 0]]);
  const [chiValues, setChiValues] = useState<[[number, number], [number, number]]>([[0, 0], [0, 0]]);
  const [chiTotal, setChiTotal] = useState<number | null>(null);

  // UI トグル
  const [showConcept, setShowConcept] = useState<Record<number, boolean>>({});
  const [openQA, setOpenQA] = useState<Record<number, boolean>>({});

  // 期待度数の計算（添字を 0|1 に固定して型安全）
  const handleCalcExpected = () => {
    const I = [0, 1] as const;
    const e: [[number, number], [number, number]] = [[0, 0], [0, 0]];
    const denom = grandTotal > 0 ? grandTotal : 1; // 0割回避

    for (const i of I) {
      for (const j of I) {
        e[i][j] = (rowTotals[i] * colTotals[j]) / denom;
      }
    }
    setExpected(e);
    setChiValues([[0, 0], [0, 0]]);
    setChiTotal(null);
  };

  // χ^2 の計算（添字を 0|1 に固定して型安全）
  const handleCalcChi = () => {
    if (expected[0][0] === 0) return; // 先に期待度数
    const I = [0, 1] as const;
    const chi: [[number, number], [number, number]] = [[0, 0], [0, 0]];
    let total = 0;

    for (const i of I) {
      for (const j of I) {
        const diff = (obs[i]?.[j] ?? 0) - (expected[i]?.[j] ?? 0);
        const denom = (expected[i]?.[j] ?? 0) || 1; // 0割回避
        const v = (diff * diff) / denom;
        chi[i][j] = v;
        total += v;
      }
    }
    setChiValues(chi);
    setChiTotal(total);
  };

  // グラフ（Bar）
  const chartData = useMemo(() => {
    return {
      labels: ['男性/商品A', '女性/商品A', '男性/商品B', '女性/商品B'],
      datasets: [
        {
          label: '観測度数',
          data: [obs[0]?.[0] ?? 0, obs[0]?.[1] ?? 0, obs[1]?.[0] ?? 0, obs[1]?.[1] ?? 0],
          borderWidth: 1,
        },
        {
          label: '期待度数',
          data: [expected[0]?.[0] ?? 0, expected[0]?.[1] ?? 0, expected[1]?.[0] ?? 0, expected[1]?.[1] ?? 0],
          borderWidth: 1,
        },
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
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: '度数' },
      },
    },
  }), []);

  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' };
  const btn: React.CSSProperties = { background: '#0f766e', color: '#fff', fontWeight: 700, padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer' };
  const btn2: React.CSSProperties = { background: '#115e59', color: '#fff', fontWeight: 700, padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer' };

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
            {
              title: '質的変数 vs 量的変数',
              body: 'クロス集計表は性別・購入商品のような「質的変数」の関連を分析します。身長や売上は「量的変数」なので散布図や相関を使います。'
            },
            {
              title: '帰無仮説',
              body: 'まず「2変数は独立（関連なし）」を仮説に置きます。データがどれだけそこからズレているかを測るのがカイ二乗検定です。'
            },
            {
              title: 'カイ二乗値とP値',
              body: 'カイ二乗値は観測度数と期待度数のズレの大きさ。P値は、そのズレが偶然でも起こりうるかの確率。有意水準未満なら独立を棄却します。'
            },
            {
              title: '自由度',
              body: '自由度 = (行数-1)×(列数-1)。セルの度数ではなく「行・列の数」から決まります。'
            },
          ].map((card, i) => (
            <div key={i} style={cardStyle} className="cursor-pointer" onClick={() => setShowConcept(v => ({ ...v, [i]: !v[i] }))}>
              <h3 className="text-xl font-bold mb-2 flex items-center">{card.title}</h3>
              {showConcept[i] && <p className="text-stone-700">{card.body}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* 手順 */}
      <section style={card}>
        <h2 className="text-3xl font-bold text-teal-700 mb-4 text-center">カイ二乗 (χ²) 検定の手順</h2>
        <ol className="list-decimal ml-6 space-y-2 text-stone-700">
          <li>帰無仮説 H<sub>0</sub>：2変数は独立（関連なし）</li>
          <li>期待度数 E の計算： (行合計 × 列合計) ÷ 全体</li>
          <li>χ² = Σ (O−E)² / E を計算</li>
          <li>自由度と有意水準から判定（P値 or 臨界値）</li>
        </ol>
      </section>

      {/* 実践 */}
      <section style={card}>
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
                  {[0, 1].map(j => (
                    <td key={j} className="border p-3 text-center text-lg">
                      <div>{obs[i]?.[j] ?? 0}</div>
                      {expected[i]?.[j] > 0 && (
                        <div className="text-sm text-red-600">(期待: {(expected[i]?.[j] ?? 0).toFixed(2)})</div>
                      )}
                      {chiValues[i]?.[j] > 0 && (
                        <div className="text-xs text-blue-600">(χ²={(chiValues[i]?.[j] ?? 0).toFixed(2)})</div>
                      )}
                    </td>
                  ))}
                  <td className="border p-3 text-center text-lg font-bold">{rowTotals[i]}</td>
                </tr>
              ))}
              <tr className="bg-stone-100">
                <td className="border p-3 font-bold">合計</td>
                <td className="border p-3 text-center text-lg font-bold">{colTotals[0]}</td>
                <td className="border p-3 text-center text-lg font-bold">{colTotals[1]}</td>
                <td className="border p-3 text-center text-lg font-bold">{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ボタン */}
        <div className="text-center mb-6 flex gap-3 justify-center">
          <button style={btn} onClick={handleCalcExpected} disabled={(expected[0]?.[0] ?? 0) > 0}>
            1. 期待度数を計算
          </button>
          <button style={btn2} onClick={handleCalcChi} disabled={(expected[0]?.[0] ?? 0) === 0 || chiTotal !== null}>
            2. カイ二乗値を計算
          </button>
        </div>

        {/* 計算結果 */}
        <div className="text-center space-y-2">
          {(expected[0]?.[0] ?? 0) > 0 && (
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
              {openQA[i] && (
                <div className="p-4 border-t text-stone-700">
                  {qa.a}
                </div>
              )}
            </div>
          ))}
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

const QA_LIST = [
  {
    q: 'カイ二乗検定が適用できるデータの種類は？',
    a: '性別、合否などのカテゴリ（質的）データ。',
  },
  {
    q: '期待度数を計算する目的は？',
    a: '「独立ならどうなるか」という基準を作り、観測データとのズレを測るため。',
  },
  {
    q: 'カイ二乗値が大きい＝関連の強さ ではありますか？',
    a: 'いいえ。関連の有無の検定。強さはファイ係数やクラメールのVなどで評価。',
  },
  {
    q: '期待度数に関する不適切な記述はどれ？',
    a: '「差の絶対値が大きいほど独立の可能性が高い」は誤り。差が大きいほど独立でない可能性が高い。',
  },
];
