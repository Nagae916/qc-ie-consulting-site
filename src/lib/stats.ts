// 統計ユーティリティ（運用簡単化のため 1 ファイル集約）

/** X̄-R 管理図の A2 係数（サブグループサイズ n ごと） */
export const A2: Record<number, number> = {
  2: 1.88, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483,
  7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308,
};

export const a2For = (n: number): number => A2[n] ?? 0.577;

/** 0..k-1 の配列 */
export const indices = (k: number): number[] =>
  Array.from({ length: Math.max(0, k) }, (_, i) => i);

/** 平均（空配列は 0 を返す） */
export const safeMean = (arr: number[]): number =>
  arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

/** X̄ 管理図の R̄ を計算（サブグループサイズ n） */
export function calcRangeBar(data: number[], n: number): number {
  const groups = Math.floor(data.length / Math.max(1, n));
  if (groups <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < groups; i++) {
    const g: number[] = data.slice(i * n, i * n + n);
    if (!g.length) continue;
    sum += Math.max(...g) - Math.min(...g);
  }
  return sum / Math.max(1, groups);
}

/** X̄ 管理図の CL/UCL/LCL（スカラー値） */
export function xbarLimits(data: number[], subgroupSize: number) {
  const xbar = safeMean(data);
  const rbar = calcRangeBar(data, subgroupSize);
  const a2 = a2For(subgroupSize);
  return { cl: xbar, ucl: xbar + a2 * rbar, lcl: xbar - a2 * rbar };
}

/** データ長に合わせてライン系列化（Chart.js 用） */
export function expandToSeries(len: number, cl: number, ucl: number, lcl: number) {
  return {
    cl: Array(len).fill(cl),
    ucl: Array(len).fill(ucl),
    lcl: Array(len).fill(lcl),
  };
}

/** np 管理図（サンプルサイズ一定）→ 配列系列で返す */
export function npLimits(npData: number[], sampleSize: number) {
  const pBar = safeMean(npData.map(v => v / Math.max(1, sampleSize)));
  const npBar = sampleSize * pBar;
  const sigma = Math.sqrt(npBar * (1 - pBar));
  const len = npData.length;
  return {
    cl: Array(len).fill(npBar),
    ucl: Array(len).fill(npBar + 3 * sigma),
    lcl: Array(len).fill(Math.max(0, npBar - 3 * sigma)),
  };
}

/** p 管理図（サンプルサイズ可変）→ 配列系列で返す */
export function pLimits(pData: number[], nData: number[]) {
  const totalN = nData.reduce((s, v) => s + v, 0);
  const totalDef = pData.reduce((s, p, i) => s + p * (nData[i] ?? 0), 0);
  const pBar = totalN > 0 ? totalDef / totalN : 0;

  const ucl = nData.map(n => pBar + 3 * Math.sqrt((pBar * (1 - pBar)) / Math.max(1, n)));
  const lcl = nData.map(n => Math.max(0, pBar - 3 * Math.sqrt((pBar * (1 - pBar)) / Math.max(1, n))));
  return {
    cl: Array(pData.length).fill(pBar),
    ucl,
    lcl,
  };
}

/** u 管理図 → 配列系列で返す */
export function uLimits(uData: number[]) {
  const uBar = safeMean(uData);
  const sigma = Math.sqrt(uBar);
  const len = uData.length;
  return {
    cl: Array(len).fill(uBar),
    ucl: Array(len).fill(uBar + 3 * sigma),
    lcl: Array(len).fill(Math.max(0, uBar - 3 * sigma)),
  };
}

/** 互換エクスポート（旧名が残っていてもビルドを落とさない） */
export const xbarLimitsScalar = xbarLimits;
