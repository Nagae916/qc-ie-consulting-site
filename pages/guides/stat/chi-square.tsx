// pages/guides/stat/chi-square.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import { GuideLayout, Glossary, QA } from '@/components/guide/GuideLayout';

type Cell = number;
type Row = Cell[];
type Matrix = Row[];

function isMatrix(a: unknown): a is Matrix {
  return Array.isArray(a) && a.every(r => Array.isArray(r) && r.every(v => typeof v === 'number'));
}

export default function ChiSquareGuidePage() {
  // 観測度数（2×2以外に拡張してもOK）
  const [obs] = useState<Matrix>([
    [30, 20],
    [20, 30],
  ]);

  // 行合計
  const rowTotals = useMemo<number[]>(
    () => (isMatrix(obs) ? obs.map(r => r.reduce((s, v) => s + v, 0)) : []),
    [obs]
  );

  // 列合計（未定義ガード & 可変サイズ対応）
  const colTotals = useMemo<number[]>(() => {
    if (!isMatrix(obs) || obs.length === 0) return [];
    const cols = Math.max(...obs.map(r => (Array.isArray(r) ? r.length : 0)));
    const sums: number[] = Array.from({ length: cols }, () => 0);
    for (let i = 0; i < obs.length; i++) {
      const row: number[] = Array.isArray(obs[i]) ? obs[i] : [];
      for (let j = 0; j < cols; j++) {
        const prev = (sums[j] ?? 0);
        const add = Number(row[j] ?? 0);
        sums[j] = prev + add; // ★ 未定義ガードで noUncheckedIndexedAccess を回避
      }
    }
    return sums;
  }, [obs]);

  // 総計
  const grandTotal = useMemo<number>(() => rowTotals.reduce((s, v) => s + v, 0), [rowTotals]);

  // 期待度数
  const expected = useMemo<Matrix>(() => {
    if (!isMatrix(obs) || obs.length === 0 || grandTotal <= 0) return [];
    return obs.map((row, i) => row.map((_, j) => (rowTotals[i] * (colTotals[j] ?? 0)) / grandTotal));
  }, [obs, rowTotals, colTotals, grandTotal]);

  // 各セルのカイ二乗成分
  const chiEach = useMemo<Matrix>(() => {
    if (!isMatrix(obs) || expected.length === 0) return [];
    return obs.map((row, i) =>
      row.map((o, j) => {
        const e = expected[i]?.[j] ?? 0;
        return e > 0 ? Math.pow(o - e, 2) / e : 0;
      })
    );
  }, [obs, expected]);

  // 合計 χ²
  const chiTotal = useMemo<number>(() => {
    if (!isMatrix(chiEach) || chiEach.length === 0) return 0;
    return chiEach.reduce((s, row) => s + row.reduce((ss, v) => ss + v, 0), 0);
  }, [chiEach]);

  // 自由度 (行-1)*(列-1)
  const df = useMemo<number>(() => {
    const r = obs.length;
    const c = Math.max(...obs.map(row => row.length));
    return (r - 1) * (c - 1);
  }, [obs]);

  // 表示制御
  const [showExpected, setShowExpected] = useState<boolean>(false);
  const [showChi, setShowChi] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>クロス集計表とカイ二乗検定｜統計ガイド</title>
        <meta
          name="description"
          content="クロス集計表の期待度数とカイ二乗値をその場で計算して学べます。自由度、検定の流れも確認。"
        />
      </Head>

      <GuideLayout
        title="クロス集計表とカイ二乗検定"
        intro="カテゴリ×カテゴリの関連を検証する代表的な手法です。まずは2×2の例で、期待度数とχ²を手順どおりに確かめましょう。"
      >
        {/* データ表 */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px', textAlign: 'center' }}>
            例：性別 × 購入商品（観測度数）
          </h3>
          <div style={{ overflowX: 'auto', marginBottom: 12 }}>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-3" />
                  {colTotals.map((_, j) => (
                    <th key={`col-${j}`} className="border p-3">
                      列{j + 1}
                    </th>
                  ))}
                  <th className="border p-3 font-bold">行合計</th>
                </tr>
              </thead>
              <tbody>
                {obs.map((row, i) => (
                  <tr key={`row-${i}`}>
                    <td className="border p-3 font-bold">行{i + 1}</td>
                    {row.map((o, j) => (
                      <td key={`cell-${i}-${j}`} className="border p-3 align-top">
                        <div className="text-center text-lg font-medium">{o}</div>
                        {showExpected && (
                          <div className="text-xs text-rose-600 mt-1">
                            期待: {expected[i]?.[j]?.toFixed(2) ?? '-'}
                          </div>
                        )}
                        {showChi && (
                          <div className="text-xs text-sky-700 mt-1">
                            χ²: {chiEach[i]?.[j]?.toFixed(3) ?? '-'}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="border p-3 text-center font-bold">{rowTotals[i]}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="border p-3 font-bold">列合計</td>
                  {colTotals.map((c, j) => (
                    <td key={`ct-${j}`} className="border p-3 text-center font-bold">
                      {c}
                    </td>
                  ))}
                  <td className="border p-3 text-center font-bold">{grandTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 操作ボタン */}
          <div className="text-center flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowExpected(v => !v)}
              className="rounded-md bg-slate-800 px-4 py-2 text-white text-sm hover:bg-slate-700"
            >
              {showExpected ? '期待度数を隠す' : '1. 期待度数を表示'}
            </button>
            <button
              type="button"
              onClick={() => setShowChi(v => !v)}
              className="rounded-md bg-slate-800 px-4 py-2 text-white text-sm hover:bg-slate-700"
              disabled={!showExpected}
              title={!showExpected ? '先に期待度数を表示してください' : undefined}
            >
              {showChi ? 'χ²を隠す' : '2. 各セルのχ²を表示'}
            </button>
          </div>

          {/* 合計χ²と自由度 */}
          {(showExpected || showChi) && (
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">自由度: {df}</div>
              {showChi && (
                <div className="mt-1 font-bold">
                  合計 χ² = {chiTotal.toFixed(3)}（df={df}）
                </div>
              )}
            </div>
          )}
        </section>

        {/* 用語集 */}
        <Glossary
          items={[
            { term: '帰無仮説', desc: '2つの変数は独立（関連なし）という前提。' },
            { term: '期待度数', desc: '独立を仮定したとき各セルに期待される度数。E=(行合計×列合計)/総計。' },
            { term: 'カイ二乗値 χ²', desc: 'Σ (O-E)²/E。大きいほど独立からのズレが大。' },
            { term: '自由度', desc: '(行数-1)×(列数-1)。χ²分布の形を決める。' },
          ]}
        />

        {/* Q&A */}
        <section style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 12 }}>
          <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>
            理解度チェック
          </h2>
          <QA
            q="カイ二乗検定が扱うデータは？"
            a={<div>カテゴリ（質的）データ。例：性別×購入商品、ライン×不良モード。</div>}
          />
          <QA
            q="期待度数の計算式は？"
            a={<div>E = (行合計 × 列合計) / 総計。独立（関連なし）を仮定した場合の基準です。</div>}
          />
          <QA
            q="χ²が大きいほどどう解釈する？"
            a={
              <div>
                独立からのズレが大きい（＝関連ありの可能性）。ただし<strong>因果</strong>は示しません。
              </div>
            }
          />
        </section>
      </GuideLayout>
    </>
  );
}
