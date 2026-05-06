'use client'

import { useMemo, useState } from 'react'

type DataExample = {
  id: string
  label: string
  example: string
  dataType: string
  scale: string
  usefulStats: string[]
  usefulCharts: string[]
  caution: string
  qcUse: string
}

const EXAMPLES: DataExample[] = [
  {
    id: 'dimension',
    label: '製品寸法',
    example: '10.1 mm, 9.8 mm, 10.3 mm',
    dataType: '数値データ・連続データ',
    scale: '比例尺度',
    usefulStats: ['平均値', '中央値', '標準偏差', '最大値・最小値'],
    usefulCharts: ['ヒストグラム', '箱ひげ図', '管理図'],
    caution: '平均値だけでなく、ばらつきや規格線との位置関係を確認する必要があります。',
    qcUse: '工程能力、管理図、規格適合性の評価に使います。',
  },
  {
    id: 'defect-count',
    label: '不良数',
    example: '0個, 1個, 2個, 3個',
    dataType: '数値データ・離散データ',
    scale: '比例尺度',
    usefulStats: ['件数', '平均不良数', '割合'],
    usefulCharts: ['パレート図', '折れ線グラフ', '管理図'],
    caution: '連続データと同じように扱わず、件数や率として見ることが重要です。',
    qcUse: '不良件数の推移、欠点数管理、重点不良の把握に使います。',
  },
  {
    id: 'defect-type',
    label: '不良分類',
    example: '汚れ, キズ, 寸法不良, 変色',
    dataType: 'カテゴリデータ',
    scale: '名義尺度',
    usefulStats: ['件数', '割合', '最頻値'],
    usefulCharts: ['パレート図', '棒グラフ', '円グラフ'],
    caution: '分類名に大小や順序はありません。平均値を計算する対象ではありません。',
    qcUse: '重点不良の抽出、層別、特性要因図への展開に使います。',
  },
  {
    id: 'satisfaction',
    label: '満足度評価',
    example: '1:不満 〜 5:満足',
    dataType: 'カテゴリデータ・順序あり',
    scale: '順序尺度',
    usefulStats: ['中央値', '最頻値', '割合', '分布'],
    usefulCharts: ['棒グラフ', '積み上げ棒グラフ', '箱ひげ図'],
    caution: '順序には意味がありますが、1と2の差、4と5の差が同じとは限りません。',
    qcUse: '顧客満足度、官能評価、教育効果アンケートの分析に使います。',
  },
  {
    id: 'temperature',
    label: '摂氏温度',
    example: '20℃, 25℃, 30℃',
    dataType: '数値データ・連続データ',
    scale: '間隔尺度',
    usefulStats: ['平均値', '中央値', '標準偏差'],
    usefulCharts: ['折れ線グラフ', 'ヒストグラム', '管理図'],
    caution: '摂氏0℃は「温度が存在しない」ことを意味しないため、比率の解釈には注意が必要です。',
    qcUse: '工程条件、環境条件、設備条件の監視に使います。',
  },
  {
    id: 'lead-time',
    label: 'リードタイム',
    example: '3日, 5日, 8日',
    dataType: '数値データ・連続データ',
    scale: '比例尺度',
    usefulStats: ['平均値', '中央値', '四分位数', '標準偏差'],
    usefulCharts: ['ヒストグラム', '箱ひげ図', '管理図'],
    caution: '右に歪んだ分布になりやすいため、平均だけでなく中央値や分位数も確認します。',
    qcUse: '納期管理、工程改善、ボトルネック分析に使います。',
  },
]

export default function DataTypesExplorer() {
  const [selectedId, setSelectedId] = useState(EXAMPLES[0]?.id ?? 'dimension')

  const selected = useMemo(() => {
    return EXAMPLES.find((item) => item.id === selectedId) ?? EXAMPLES[0]
  }, [selectedId])

  if (!selected) return null

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-500">インタラクティブ教材</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">データ例から種類・尺度・使える分析を確認する</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          データ例を選ぶと、データの種類、尺度、使いやすい代表値、適したグラフ、品質管理での使い方が表示されます。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className={[
              'rounded-xl border p-3 text-left text-sm transition',
              item.id === selected.id
                ? 'border-blue-500 bg-blue-50 text-blue-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            <span className="font-bold">{item.label}</span>
            <span className="mt-1 block text-xs opacity-80">{item.example}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-500">選択中のデータ</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">{selected.label}</h3>
            <p className="mt-2 text-sm text-slate-600">例：{selected.example}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">データの種類</p>
              <p className="mt-1 font-bold text-slate-900">{selected.dataType}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">尺度</p>
              <p className="mt-1 font-bold text-slate-900">{selected.scale}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ListPanel title="使いやすい代表値・指標" items={selected.usefulStats} />
          <ListPanel title="適したグラフ" items={selected.usefulCharts} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h4 className="font-bold text-amber-950">注意点</h4>
            <p className="mt-2 text-sm leading-6 text-amber-950">{selected.caution}</p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-bold text-blue-950">品質管理での使い方</h4>
            <p className="mt-2 text-sm leading-6 text-blue-950">{selected.qcUse}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <h4 className="font-bold text-slate-900">{title}</h4>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
