'use client'

import { useMemo, useState } from 'react'

type Pattern = {
  id: string
  label: string
  description: string
  values: number[]
  insight: string
}

type Stats = {
  mean: number
  median: number
  min: number
  max: number
  standardDeviation: number
  outOfSpecCount: number
}

const PATTERNS: Pattern[] = [
  {
    id: 'stable',
    label: '安定工程',
    description: '平均付近にデータが集まっている工程です。',
    values: [49, 50, 50, 51, 52, 50, 49, 51, 50, 52, 48, 50, 51, 49, 50],
    insight: 'ばらつきが小さく、工程は比較的安定しています。規格線との余裕を確認すると、工程能力の検討につながります。',
  },
  {
    id: 'wide',
    label: 'ばらつき大',
    description: '平均は近くても、データの広がりが大きい工程です。',
    values: [40, 43, 45, 47, 50, 52, 55, 58, 60, 42, 46, 51, 54, 57, 59],
    insight: '平均だけを見ると問題が見えにくいですが、ばらつきが大きいため規格外リスクが高まります。',
  },
  {
    id: 'outlier',
    label: '外れ値あり',
    description: '一部に極端な値が含まれるデータです。',
    values: [49, 50, 50, 51, 52, 50, 49, 51, 50, 52, 48, 50, 51, 49, 75],
    insight: '外れ値により平均値や標準偏差が影響を受けます。測定ミス、特殊原因、異常条件の有無を確認します。',
  },
  {
    id: 'bimodal',
    label: '二山分布',
    description: '複数の条件が混ざっている可能性があるデータです。',
    values: [44, 45, 45, 46, 47, 44, 46, 45, 55, 56, 57, 56, 55, 58, 57],
    insight: '二山分布は、ライン、材料ロット、作業者、設備条件などが混在している可能性があります。層別が必要です。',
  },
  {
    id: 'skewed',
    label: '右に歪んだ分布',
    description: '作業時間やリードタイムでよく見られる形です。',
    values: [20, 21, 22, 22, 23, 24, 24, 25, 26, 30, 35, 40, 45, 55, 70],
    insight: '右に長い尾がある場合、平均値が実態より大きく見えることがあります。中央値や分位数も確認します。',
  },
]

function round(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
  }

  return sorted[middle] ?? 0
}

function calculateStats(values: number[], lsl: number, usl: number): Stats {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const sum = sorted.reduce((acc, value) => acc + value, 0)
  const mean = sum / n
  const variance = sorted.reduce((acc, value) => acc + (value - mean) ** 2, 0) / n
  const outOfSpecCount = sorted.filter((value) => value < lsl || value > usl).length

  return {
    mean,
    median: median(sorted),
    min: sorted[0] ?? 0,
    max: sorted[n - 1] ?? 0,
    standardDeviation: Math.sqrt(variance),
    outOfSpecCount,
  }
}

function buildHistogram(values: number[], binCount: number) {
  const min = Math.min(...values)
  const max = Math.max(...values)

  if (min === max) {
    return [{ label: `${min}`, lower: min, upper: max, count: values.length }]
  }

  const width = (max - min) / binCount

  return Array.from({ length: binCount }, (_, index) => {
    const lower = min + width * index
    const upper = index === binCount - 1 ? max : min + width * (index + 1)

    const count = values.filter((value) => {
      if (index === binCount - 1) return value >= lower && value <= upper
      return value >= lower && value < upper
    }).length

    return {
      label: `${round(lower, 1)}〜${round(upper, 1)}`,
      lower,
      upper,
      count,
    }
  })
}

export default function HistogramExplorer() {
  const [patternId, setPatternId] = useState(PATTERNS[0]?.id ?? 'stable')
  const [binCount, setBinCount] = useState(6)
  const [lsl, setLsl] = useState(45)
  const [usl, setUsl] = useState(55)

  const pattern = useMemo(() => {
    return PATTERNS.find((item) => item.id === patternId) ?? PATTERNS[0]
  }, [patternId])

  const values = useMemo(() => pattern?.values ?? [], [pattern])
  const stats = useMemo(() => calculateStats(values, lsl, usl), [values, lsl, usl])
  const histogram = useMemo(() => buildHistogram(values, binCount), [values, binCount])
  const maxCount = Math.max(...histogram.map((bin) => bin.count), 1)

  if (!pattern) return null

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-500">インタラクティブ教材</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">分布の形を切り替えてヒストグラムを読む</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          分布パターン、階級数、規格下限・規格上限を変更しながら、平均だけでは見えない工程の状態を確認します。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PATTERNS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPatternId(item.id)}
            className={[
              'rounded-xl border p-3 text-left text-sm transition',
              item.id === pattern.id
                ? 'border-blue-500 bg-blue-50 text-blue-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            <span className="font-bold">{item.label}</span>
            <span className="mt-1 block text-xs opacity-80">{item.description}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <label className="rounded-xl bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-700">階級数：{binCount}</span>
          <input
            type="range"
            min="4"
            max="10"
            value={binCount}
            onChange={(event) => setBinCount(Number(event.target.value))}
            className="mt-3 w-full"
          />
        </label>

        <label className="rounded-xl bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-700">規格下限 LSL</span>
          <input
            type="number"
            value={lsl}
            onChange={(event) => setLsl(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm"
          />
        </label>

        <label className="rounded-xl bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-700">規格上限 USL</span>
          <input
            type="number"
            value={usl}
            onChange={(event) => setUsl(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="平均値" value={round(stats.mean)} />
        <StatCard label="中央値" value={round(stats.median)} />
        <StatCard label="標準偏差" value={round(stats.standardDeviation)} />
        <StatCard label="最小〜最大" value={`${round(stats.min)}〜${round(stats.max)}`} />
        <StatCard label="規格外数" value={stats.outOfSpecCount} />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 p-4">
        <h3 className="font-bold text-slate-900">ヒストグラム</h3>
        <div className="mt-4 space-y-3">
          {histogram.map((bin) => {
            const isSpecRange = bin.upper >= lsl && bin.lower <= usl

            return (
              <div key={bin.label} className="grid grid-cols-[96px_1fr_32px] items-center gap-3 text-sm">
                <span className="text-xs text-slate-500">{bin.label}</span>
                <div className="h-6 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={['h-full rounded-full', isSpecRange ? 'bg-blue-500' : 'bg-amber-500'].join(' ')}
                    style={{ width: `${(bin.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-right font-semibold text-slate-800">{bin.count}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          青は規格範囲と重なる階級、黄は規格範囲から外れる可能性がある階級です。
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <p className="font-bold">読み取りポイント</p>
        <p className="mt-1">{pattern.insight}</p>
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
