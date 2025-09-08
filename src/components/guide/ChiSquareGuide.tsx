// src/components/guide/ChiSquareGuide.tsx
'use client';
import React, { useMemo, useState } from 'react';
import {
  rowSums as libRowSums,
  colSums as libColSums,
  grandTotal as libGrandTotal,
  expectedMatrix as libExpected,
  chiEach as libChiEach,
  chiTotal as libChiTotal,
  get2D,
  set2DImmutable,
} from '../../lib/safe-matrix';

/**
 * 運用ルール対応版：
 * - 依存は「外から来る値＝obs」だけに集約（派生値は1つの useMemo 内で計算）
 * - UIは現状の見た目/挙動を維持
 */
export default function ChiSquareGuide() {
  // 観測度数（初期 2×2）
  const [obs, setObs] = useState<number[][]>([
    [30, 20],
    [20, 30],
  ]);
  const [showExpected, setShowExpected] = useState(false);
  const [showChi, setShowChi] = useState(false);

  // ★ すべての派生値を obs だけに依存して一括計算（警告恒久解消）
  const { rows, cols, grand, exp, chi, chiVal } = useMemo(() => {
    const rows = libRowSums(obs);
    const cols = libColSums(obs);
    const grand = libGrandTotal(obs);
    const exp = libExpected(obs);
    const chi = libChiEach(obs, exp);
    const chiVal = libChiTotal(obs, exp);
    return { rows, cols, grand, exp, chi, chiVal };
  }, [obs]);

  // セル更新（不変更新・自動拡張）
  const updateCell = (i: number, j: number, v: string) => {
    const n = Number(v);
    const safe = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
    setObs(prev => set2DImmutable(prev, i, j, safe));
    setShowExpected(false);
    setShowChi(false);
  };

  // ── UI（既存スタイルを維持） ──
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  };
  const sub: React.CSSProperties = { color: '#64748b' };

  // 表示は 2×2（UI表現は固定）
  const rowIdxs = [0, 1];
  const colIdxs = [0, 1];

  return (
    <section style={card}>
      <h1 className="text-xl font-bold mb-1">クロス集計表とカイ二乗（χ²）検定</h1>
      <p style={sub} className="mb-3">
        2×2 のクロス集計表で、期待度数と χ² を段階的に確認できます（自由度 = (行−1)×(列−1)）。
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
            {rowIdxs.map(i => (
              <tr key={i}>
                <td className="border p-2 font-bold">行{i + 1}</td>
                {colIdxs.map(j => (
                  <td key={j} className="border p-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={get2D(obs, i, j, 0)}
                      onChange={e => updateCell(i, j, e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                    {showExpected && (
                      <div className="text-xs text-rose-600 mt-1">
                        (期待 {get2D(exp, i, j, 0).toFixed(2)})
                      </div>
                    )}
                    {showChi && (
                      <div className="text-xs text-blue-600">
                        (χ² {get2D(chi, i, j, 0).toFixed(3)})
                      </div>
                    )}
                  </td>
                ))}
                <td className="border p-2 font-bold text-center">{rows[i] ?? 0}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="border p-2 font-bold">列合計</td>
              {colIdxs.map(j => (
                <td key={j} className="border p-2 font-bold text-center">{cols[j] ?? 0}</td>
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
      {showChi && (
        <div className="grid gap-2">
          <div className="mt-1 font-bold">χ² 合計 = {chiVal.toFixed(3)}</div>
          <div style={sub} className="text-sm mt-1">
            5%水準・自由度1の臨界値は 3.841。χ² がこれを上回れば「統計的に有意な関連あり」。
          </div>
        </div>
      )}
    </section>
  );
}
