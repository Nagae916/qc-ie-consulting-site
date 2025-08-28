// pages/guides/stat/chi-square.tsx
import Head from "next/head";
import React, { useMemo, useState, ChangeEvent } from "react";

/** ===== 型定義 ===== */
type Row = number[];
type Matrix = Row[];

/** ===== 安全ユーティリティ ===== */
function normalizeMatrix(m: unknown): Matrix {
  if (!Array.isArray(m)) return [];
  return m.map((r) =>
    Array.isArray(r)
      ? r.map((v) => (Number.isFinite(v) ? (v as number) : 0))
      : []
  );
}

function rowTotalsOf(m: Matrix): number[] {
  return m.map((row) =>
    (row ?? []).reduce((s, v) => s + (Number.isFinite(v) ? (v as number) : 0), 0)
  );
}

function colTotalsOf(m: Matrix): number[] {
  if (!m.length) return [];
  const cols = Math.max(...m.map((r) => (r ?? []).length), 0);
  const sums: number[] = Array.from({ length: cols }, () => 0);
  for (let i = 0; i < m.length; i++) {
    const row = m[i] ?? [];
    for (let j = 0; j < cols; j++) {
      const val = Number.isFinite(row[j]) ? (row[j] as number) : 0;
      sums[j] = (sums[j] ?? 0) + val;
    }
  }
  return sums;
}

function grandTotalOf(rows: number[]): number {
  return rows.reduce((s, v) => s + v, 0);
}

function expectedFrom(obs: Matrix): Matrix {
  const rows = rowTotalsOf(obs);
  const cols = colTotalsOf(obs);
  const grand = grandTotalOf(rows);
  const r = obs.length;
  const c = cols.length;

  const exp: Matrix = Array.from({ length: r }, () =>
    Array.from({ length: c }, () => 0)
  );

  if (grand <= 0) return exp;

  for (let i = 0; i < r; i++) {
    // number に確定させたローカルを使う
    const ri: number = Number.isFinite(rows[i]) ? (rows[i] as number) : 0;

    // 行バッファを安全に確保
    let row = exp[i];
    if (!row) {
      row = Array.from({ length: c }, () => 0);
      exp[i] = row;
    }
    for (let j = 0; j < c; j++) {
      const cj: number = Number.isFinite(cols[j]) ? (cols[j] as number) : 0;
      row[j] = (ri * cj) / grand; // row は常に定義済み
    }
  }
  return exp;
}

function chiTerm(o: number, e: number): number {
  const E = e > 0 ? e : 0;
  const O = Number.isFinite(o) ? (o as number) : 0;
  if (E === 0) return 0;
  const diff = O - E;
  return (diff * diff) / E;
}

function chiMatrixOf(obs: Matrix, exp: Matrix): Matrix {
  const r = Math.max(obs.length, exp.length);
  const c = Math.max(
    ...[obs, exp].map((m) => Math.max(...m.map((row) => row.length), 0)),
    0
  );
  const chi: Matrix = Array.from({ length: r }, () =>
    Array.from({ length: c }, () => 0)
  );
  for (let i = 0; i < r; i++) {
    const ro = obs[i] ?? [];
    const re = exp[i] ?? [];
    for (let j = 0; j < c; j++) {
      const o: number = Number.isFinite(ro[j]) ? (ro[j] as number) : 0;
      const e: number = Number.isFinite(re[j]) ? (re[j] as number) : 0;
      chi[i][j] = chiTerm(o, e);
    }
  }
  return chi;
}

function sumMatrix(m: Matrix): number {
  return m.reduce(
    (acc, row) =>
      acc +
      row.reduce((s, v) => s + (Number.isFinite(v) ? (v as number) : 0), 0),
    0
  );
}

/** ===== メインページ ===== */
export default function ChiSquareGuidePage() {
  const [obs, setObs] = useState<Matrix>([
    [30, 20],
    [20, 30],
  ]);

  const rows = useMemo(() => rowTotalsOf(obs), [obs]);
  const cols = useMemo(() => colTotalsOf(obs), [obs]);
  const grand = useMemo(() => grandTotalOf(rows), [rows]);

  const exp = useMemo(() => expectedFrom(obs), [obs]);
  const chiM = useMemo(() => chiMatrixOf(obs, exp), [obs, exp]);
  const chiTotal = useMemo(() => sumMatrix(chiM), [chiM]);

  const df = useMemo(
    () => Math.max(0, (obs.length - 1) * (cols.length - 1)),
    [obs.length, cols.length]
  );

  const onChangeCell =
    (i: number, j: number) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      const next = normalizeMatrix(obs).map((row) => [...row]);
      const v = Number(e.target.value);
      next[i] = next[i] ?? [];
      next[i][j] = Number.isFinite(v) && v >= 0 ? Math.round(v) : 0;
      setObs(next);
    };

  return (
    <>
      <Head>
        <title>クロス集計とカイ二乗検定（インタラクティブ）</title>
        <meta
          name="description"
          content="観測度数を入力すると期待度数とカイ二乗値（χ²）を自動計算。自由度や検定の要点も確認できます。"
        />
      </Head>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">
            クロス集計とカイ二乗（χ²）検定：インタラクティブ
          </h1>
          <p className="text-gray-600">
            観測度数を編集すると、期待度数と χ² が即時計算されます。自由度は
            (行数−1)×(列数−1)。
          </p>
        </header>

        {/* 観測度数テーブル */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">① 観測度数（編集可）</h2>
          <div className="overflow-x-auto">
            <table className="min-w-[520px] border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-right"> </th>
                  {cols.map((_, j) => (
                    <th key={`h-${j}`} className="border p-2 text-center">
                      列{j + 1}
                    </th>
                  ))}
                  <th className="border p-2 text-center font-bold">行合計</th>
                </tr>
              </thead>
              <tbody>
                {obs.map((row, i) => (
                  <tr key={`r-${i}`}>
                    <td className="border p-2 font-semibold text-right">
                      行{i + 1}
                    </td>
                    {cols.map((_, j) => (
                      <td key={`c-${i}-${j}`} className="border p-1">
                        <input
                          type="number"
                          min={0}
                          className="w-24 rounded border px-2 py-1 text-right"
                          value={
                            Number.isFinite(row?.[j]) ? (row?.[j] as number) : 0
                          }
                          onChange={onChangeCell(i, j)}
                        />
                      </td>
                    ))}
                    <td className="border p-2 text-right font-semibold">
                      {rows[i] ?? 0}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="border p-2 font-bold text-right">列合計</td>
                  {cols.map((_, j) => (
                    <td key={`sumc-${j}`} className="border p-2 text-right">
                      {cols[j] ?? 0}
                    </td>
                  ))}
                  <td className="border p-2 text-right font-bold">{grand}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 期待度数 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            ② 期待度数（独立を仮定： (行合計×列合計) / 総計 ）
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-[520px] border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-right"> </th>
                  {cols.map((_, j) => (
                    <th key={`eh-${j}`} className="border p-2 text-center">
                      列{j + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exp.map((row, i) => (
                  <tr key={`er-${i}`}>
                    <td className="border p-2 font-semibold text-right">
                      行{i + 1}
                    </td>
                    {row.map((v, j) => (
                      <td key={`ec-${i}-${j}`} className="border p-2 text-right">
                        {v.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* カイ二乗値 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">③ 各セルの寄与と χ² 合計</h2>
          <div className="overflow-x-auto">
            <table className="min-w-[520px] border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-right"> </th>
                  {cols.map((_, j) => (
                    <th key={`ch-${j}`} className="border p-2 text-center">
                      列{j + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chiM.map((row, i) => (
                  <tr key={`cr-${i}`}>
                    <td className="border p-2 font-semibold text-right">
                      行{i + 1}
                    </td>
                    {row.map((v, j) => (
                      <td key={`cc-${i}-${j}`} className="border p-2 text-right">
                        {v.toFixed(3)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded border p-4 bg-gray-50">
            <div className="text-sm text-gray-700">
              自由度 <b>{df}</b>、χ² 合計 <b>{chiTotal.toFixed(3)}</b>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              判定には、自由度に応じたカイ二乗分布表（臨界値）や P 値を参照してください。
              例：自由度 1・有意水準 5% の臨界値はおよそ 3.841。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
