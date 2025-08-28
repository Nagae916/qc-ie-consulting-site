// src/lib/safe-matrix.ts
export type Cell = number;
export type Row = Cell[];
export type Matrix = Row[];

/** 行毎の合計 */
export function rowSums(m: Matrix): number[] {
  return m.map(row => row.reduce((s, v) => s + (Number(v) || 0), 0));
}

/** 列毎の合計 */
export function colSums(m: Matrix): number[] {
  const cols = Math.max(0, ...m.map(r => r.length));
  const sums: number[] = Array.from({ length: cols }, () => 0);
  for (let i = 0; i < m.length; i++) {
    const row = m[i] ?? [];
    for (let j = 0; j < cols; j++) {
      sums[j] = (sums[j] ?? 0) + (Number(row[j] ?? 0) || 0);
    }
  }
  return sums;
}

/** 総計 */
export function grandTotal(m: Matrix): number {
  return rowSums(m).reduce((s, v) => s + v, 0);
}

/** 期待度数 */
export function expectedMatrix(m: Matrix): Matrix {
  const rs = rowSums(m);
  const cs = colSums(m);
  const gt = Math.max(1, rs.reduce((s, v) => s + v, 0));
  return m.map((row, i) => row.map((_, j) => (rs[i] ?? 0) * (cs[j] ?? 0) / gt));
}

/** 各セル χ² 値 */
export function chiEach(m: Matrix, exp: Matrix): Matrix {
  return m.map((row, i) =>
    row.map((o, j) => {
      const e = exp[i]?.[j] ?? 0;
      return e > 0 ? Math.pow((o ?? 0) - e, 2) / e : 0;
    })
  );
}

/** χ² 合計 */
export function chiTotal(m: Matrix, exp: Matrix): number {
  return chiEach(m, exp).reduce((s, r) => s + r.reduce((ss, v) => ss + v, 0), 0);
}

/** 自由度 (行-1)*(列-1) */
export function chiDf(m: Matrix): number {
  const r = m.length;
  const c = Math.max(0, ...m.map(row => row.length));
  return Math.max(0, (r - 1) * (c - 1));
}
