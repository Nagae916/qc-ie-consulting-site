// src/lib/safe-matrix.ts

// ===== 型定義 =====
export type Cell = number;
export type Row = Cell[];
export type Matrix = Row[];

// ===== 共通ユーティリティ（再発防止の要） =====

/** 数値の安全化（NaN/非数は fallback に置換） */
export const safeNum = (x: unknown, fallback = 0): number =>
  Number.isFinite(x as number) ? (x as number) : fallback;

/**
 * 2次元配列の安全読取（範囲外/未定義/NaN → 0）
 * strict=true で欠損を検知したい場合は throw。
 */
export const get2D = (
  m: Matrix,
  i: number,
  j: number,
  opts?: { strict?: boolean; label?: string }
): number => {
  const ri = m?.[i];
  const v = ri?.[j];
  if (opts?.strict && (ri === undefined || v === undefined || !Number.isFinite(v))) {
    const name = opts?.label ?? 'matrix';
    throw new Error(`[get2D(strict)] ${name}[${i}][${j}] is missing or not finite`);
  }
  return safeNum(v, 0);
};

/**
 * 2次元配列の安全な不変更新（必要なら自動で行/列を拡張）
 * - ダブル添字の直接代入を排し、UI側の書き込み事故を防止
 * - 例: set2DImmutable(m, 3, 5, 42) // 行4・列6まで足りなければ 0 埋め拡張してから代入
 */
export const set2DImmutable = (m: Matrix, i: number, j: number, value: number): Matrix => {
  const next: Matrix = m.map(row => [...row]);
  // 行を必要数まで拡張
  while (next.length <= i) next.push([]);
  // 列を必要数まで拡張（0で埋める）
  const C = Math.max(j + 1, next[i].length);
  if (next[i].length < C) next[i] = [...next[i], ...Array(C - next[i].length).fill(0)];
  next[i][j] = safeNum(value, 0);
  return next;
};

/** R×C の 0 行列を生成（状態の初期化/再初期化に） */
export const makeZero = (R: number, C: number): Matrix =>
  Array.from({ length: R }, () => Array(C).fill(0));

/** 行列の次元（行数R, 列数C=最長行） */
export const dimsOf = (m: Matrix): { R: number; C: number } => ({
  R: m.length,
  C: Math.max(0, ...m.map(r => r.length)),
});

// ===== 合計類（安全に集計：noUncheckedIndexedAccess 耐性） =====

/** 行毎の合計 */
export function rowSums(m: Matrix): number[] {
  const { R, C } = dimsOf(m);
  const out = new Array(R).fill(0);
  for (let i = 0; i < R; i++) {
    let s = 0;
    for (let j = 0; j < C; j++) s += get2D(m, i, j);
    out[i] = s;
  }
  return out;
}

/** 列毎の合計 */
export function colSums(m: Matrix): number[] {
  const { R, C } = dimsOf(m);
  const out = new Array(C).fill(0);
  for (let j = 0; j < C; j++) {
    let s = 0;
    for (let i = 0; i < R; i++) s += get2D(m, i, j);
    out[j] = s;
  }
  return out;
}

/** 総計 */
export function grandTotal(m: Matrix): number {
  const rows = rowSums(m);
  return rows.reduce((s, v) => s + safeNum(v, 0), 0);
}

// ===== 検定に必要な行列計算（安全・動的サイズ対応） =====

/**
 * 期待度数 E を返す（E_ij = (行i合計 × 列j合計) / 総和）
 * - 0割回避（総和=0 の場合は 1 で割る）
 * - R×C 動的対応
 */
export function expectedMatrix(m: Matrix): Matrix {
  const rs = rowSums(m);
  const cs = colSums(m);
  const gt = Math.max(1, rs.reduce((s, v) => s + safeNum(v, 0), 0)); // 0割回避
  const R = rs.length;
  const C = cs.length;

  const e: Matrix = [];
  for (let i = 0; i < R; i++) {
    const ri = safeNum(rs[i], 0);
    const row: Row = new Array(C).fill(0);
    for (let j = 0; j < C; j++) {
      const cj = safeNum(cs[j], 0);
      row[j] = (ri * cj) / gt;
    }
    e.push(row); // “行生成→push”で未定義を作らない
  }
  return e;
}

/** 各セル χ² 値（E=0 は寄与 0） */
export function chiEach(m: Matrix, exp: Matrix): Matrix {
  const { R, C } = dimsOf(m);
  const out: Matrix = [];
  for (let i = 0; i < R; i++) {
    const row: Row = new Array(C).fill(0);
    for (let j = 0; j < C; j++) {
      const o = get2D(m, i, j);
      const e = get2D(exp, i, j);
      row[j] = e > 0 ? ((o - e) ** 2) / e : 0;
    }
    out.push(row);
  }
  return out;
}

/** χ² 合計 */
export function chiTotal(m: Matrix, exp: Matrix): number {
  const ce = chiEach(m, exp);
  return ce.reduce((s, r) => s + r.reduce((ss, v) => ss + safeNum(v, 0), 0), 0);
}

/** 自由度 (行-1)*(列-1) */
export function chiDf(m: Matrix): number {
  const { R, C } = dimsOf(m);
  return Math.max(0, (R - 1) * (C - 1));
}

// ===== 追加の別名（呼び出し側の命名統一を助けるオプション） =====
// ※ 既存APIはそのまま、必要ならこちらの名前で import してもOK。

/** 別名: grandTotalOf(rows) の行列版 */
export const grandTotalOf = (rows: number[]): number =>
  rows.reduce((s, v) => s + safeNum(v, 0), 0);

/** 別名: expectedOf(rows, cols, grand) */
export const expectedOf = (rows: number[], cols: number[], grand: number): Matrix => {
  const R = rows.length;
  const C = cols.length;
  const denom = grand > 0 ? grand : 1;
  const e: Matrix = [];
  for (let i = 0; i < R; i++) {
    const ri = safeNum(rows[i], 0);
    const row: Row = new Array(C).fill(0);
    for (let j = 0; j < C; j++) {
      const cj = safeNum(cols[j], 0);
      row[j] = (ri * cj) / denom;
    }
    e.push(row);
  }
  return e;
};

/** 別名: chi2Of(obs, exp) → { chi, total } */
export const chi2Of = (obs: Matrix, exp: Matrix): { chi: Matrix; total: number } => {
  const chi = chiEach(obs, exp);
  const total = chi.reduce((s, r) => s + r.reduce((ss, v) => ss + safeNum(v, 0), 0), 0);
  return { chi, total };
};
