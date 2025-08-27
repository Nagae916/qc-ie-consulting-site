// 統計ユーティリティ（まずは1ファイル集約で運用）
// 将来増やすときは、このファイルに関数を追加して export するだけ。
// さらに大きくなったら /stats/*.ts に分割 → ここから再 export で移行可能にする。

/** X̄-R 管理図の A2 係数（サブグループサイズ n ごと） */
export const A2: Record<number, number> = {
  2: 1.88, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483,
  7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308,
};

/** 平均 */
export const mean = (arr: number[]) =>
  arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

/** R̄ の計算（for ループで安定・可読） */
export function calcRBar(data: number[], subgroupSize: number): number {
  const n = Math.max(1, subgroupSize);
  const groups = Math.floor(data.length / n);
  let rSum = 0;
  for (let i = 0; i < groups; i++) {
    const g = data.slice(i * n, i * n + n);
    if (g.length > 0) rSum += Math.max(...g) - Math.min(...g);
  }
  return groups > 0 ? rSum / groups : 0;
}

/** X̄ 管理図の中心線/管理限界（スカラーを返す） */
export function xbarLimitsScalar(data: number[], n: number) {
  const xbarbar = mean(data);
  const rBar = calcRBar(data, n);
  const a2 = A2[n] ?? 0.577; // 未定義サイズは暫定値（必要に応じて係数表を拡張）
  return { cl: xbarbar, ucl: xbarbar + a2 * rBar, lcl: xbarbar - a2 * rBar };
}

/** データ長に合わせた配列化（Chart.js の dataset 用） */
export function expandToSeries(len: number, cl: number, ucl: number, lcl: number) {
  return {
    cl: Array(len).fill(cl),
    ucl: Array(len).fill(ucl),
    lcl: Array(len).fill(lcl),
  };
}

/** np 管理図（固定 n） */
export function npLimits(npData: number[], sampleSize: number) {
  const pbar = mean(npData.map(v => v / Math.max(1, sampleSize)));
  const npbar = sampleSize * pbar;
  const sigma = Math.sqrt(npbar * (1 - pbar));
  return {
    cl: Array(npData.length).fill(npbar),
    ucl: Array(npData.length).fill(npbar + 3 * sigma),
    lcl: Array(npData.length).fill(Math.max(0, npbar - 3 * sigma)),
  };
}

/** p 管理図（可変 n） */
export function pLimits(pData: number[], nArr: number[]) {
  const totalN = nArr.reduce((s, n) => s + n, 0);
  const totalDef = pData.reduce((s, p, i) => s + p * (nArr[i] ?? 0), 0);
  const pbar = totalN > 0 ? totalDef / totalN : 0;

  const ucl = nArr.map(n => pbar + 3 * Math.sqrt((pbar * (1 - pbar)) / Math.max(1, n)));
  const lcl = nArr.map(n => Math.max(0, pbar - 3 * Math.sqrt((pbar * (1 - pbar)) / Math.max(1, n))));

  return {
    cl: Array(pData.length).fill(pbar),
    ucl,
    lcl,
  };
}

/** u 管理図 */
export function uLimits(uData: number[]) {
  const ubar = mean(uData);
  const sigma = Math.sqrt(ubar);
  return {
    cl: Array(uData.length).fill(ubar),
    ucl: Array(uData.length).fill(ubar + 3 * sigma),
    lcl: Array(uData.length).fill(Math.max(0, ubar - 3 * sigma)),
  };
}

/* --- 将来用：ここに増やしていく -----------------------------------------
export function ocCurvePa(n: number, c: number, defectRate: number): number { ... }
export function availability(mtbf: number, mttr: number): number { ... }
------------------------------------------------------------------------- */
