// pages/tools/simple-linear-regression.tsx
import Head from "next/head";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

// Chart.js をクライアント側でのみ読み込む
const Scatter = dynamic(
  () => import("react-chartjs-2").then((m) => m.Scatter),
  { ssr: false, loading: () => <div className="text-gray-500">Loading chart…</div> }
);

// Chart.js のレジストリはクライアント側で行われる（react-chartjs-2 側でOK）

type Pt = { x: number; y: number };

// テキストから (x,y) 配列を読み取る（CSV/空白/タブ/カンマ対応）
function parsePoints(s: string): Pt[] {
  return s
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [a, b] = line.split(/[,\s\t]+/);
      const x = Number(a), y = Number(b);
      return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
    })
    .filter((v): v is Pt => v !== null);
}

function stats(points: Pt[]) {
  const n = points.length;
  if (n < 2) return { n, ok: false as const };

  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const xbar = sx / n;
  const ybar = sy / n;

  let Sxx = 0, Sxy = 0, Syy = 0;
  for (const p of points) {
    const dx = p.x - xbar;
    const dy = p.y - ybar;
    Sxx += dx * dx;
    Sxy += dx * dy;
    Syy += dy * dy;
  }
  if (Sxx <= 0) return { n, ok: false as const };

  const b1 = Sxy / Sxx;
  const b0 = ybar - b1 * xbar;

  const yhat = points.map((p) => b0 + b1 * p.x);
  const SSR = yhat.reduce((s, yh) => s + Math.pow(yh - ybar, 2), 0);
  const SSE = points.reduce((s, p, i) => s + Math.pow(p.y - yhat[i], 2), 0);
  const SST = Syy;

  const R2 = SST > 0 ? SSR / SST : NaN;
  const df1 = 1;
  const df2 = Math.max(0, n - 2);
  const MSR = SSR / df1;
  const MSE = df2 > 0 ? SSE / df2 : NaN;
  const F   = df2 > 0 && MSE > 0 ? MSR / MSE : NaN;

  return {
    n, ok: true as const,
    xbar, ybar, Sxx, Sxy, Syy,
    b0, b1, R2, SSR, SSE, SST, MSR, MSE, F, df1, df2,
    yhat,
  };
}

export default function SimpleLinearRegressionTool() {
  const [raw, setRaw] = useState<string>([
    "1 2.0",
    "2 2.4",
    "3 2.8",
    "4 3.5",
    "5 3.7",
    "6 4.1",
    "7 4.6",
    "8 4.9",
    "9 5.2",
    "10 5.6"
  ].join("\n"));

  const points = useMemo(() => parsePoints(raw), [raw]);
  const st = useMemo(() => stats(points), [points]);

  // 回帰直線（最小/最大 x で 2 点生成）
  const line = useMemo(() => {
    if (!st || !st.ok || points.length === 0) return null;
    const xs = points.map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    return [
      { x: minX, y: st.b0 + st.b1 * minX },
      { x: maxX, y: st.b0 + st.b1 * maxX },
    ];
  }, [st, points]);

  const chartData = useMemo(() => {
    if (!points.length) return { datasets: [] as any[] };
    return {
      datasets: [
        {
          type: "scatter" as const,
          label: "観測点",
          data: points,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,.35)",
          pointRadius: 4,
        },
        ...(line
          ? [{
              type: "line" as const,
              label: "回帰直線",
              data: line,
              borderColor: "#10B981",
              backgroundColor: "rgba(16,185,129,.2)",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0,
            }]
          : []),
      ],
    };
  }, [points, line]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: {
      x: { title: { display: true, text: "x" } },
      y: { title: { display: true, text: "y" } },
    },
  }), []);

  return (
    <>
      <Head>
        <title>単回帰ツール | QC × IE LABO</title>
        <meta name="description" content="散布図と回帰直線・ANOVA・R²・F比を即時計算" />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">単回帰ツール</h1>
        <p className="text-gray-600 mb-6">
          左に <code>x y</code> 形式（空白/タブ/カンマ区切り）でデータを貼り付けると、散布図・回帰直線・ANOVA が更新されます。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-sm font-semibold mb-2">データ入力（1行に x y）</label>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="w-full h-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
              placeholder="例: 1 2.0\n2 2.4\n3 2.8"
            />
          </div>

          <div>
            <div className="h-64 rounded-xl border border-gray-200 p-2 bg-white">
              {/* @ts-ignore: Scatter は dynamic import 済み */}
              <Scatter data={chartData as any} options={chartOptions as any} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {st && st.ok ? (
                <>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="font-semibold">推定値</div>
                    <div>傾き b₁ = {st.b1.toFixed(4)}</div>
                    <div>切片 b₀ = {st.b0.toFixed(4)}</div>
                    <div>R² = {st.R2.toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="font-semibold">ANOVA</div>
                    <div>SSR = {st.SSR.toFixed(4)}</div>
                    <div>SSE = {st.SSE.toFixed(4)}</div>
                    <div>SST = {st.SST.toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="font-semibold">分散</div>
                    <div>MSR = {st.MSR.toFixed(4)}</div>
                    <div>MSE = {st.MSE.toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="font-semibold">F 検定</div>
                    <div>F = {Number.isFinite(st.F) ? st.F.toFixed(4) : "-"}</div>
                    <div>df = {st.df1}, {st.df2}</div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="font-semibold text-amber-800">注意</div>
                  <div className="text-amber-800">
                    有効なデータが不足しています（少なくとも 2 点、かつ x の分散 &gt; 0 が必要）。
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
