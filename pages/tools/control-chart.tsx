// pages/tools/control-chart.tsx
import dynamic from "next/dynamic";
import Link from "next/link";

import { SiteMeta } from "@/components/site/SiteMeta";

const ControlChart = dynamic(
  () => import("@/components/guide/ControlChart"),
  { ssr: false, loading: () => <div className="text-gray-500">Loading chart…</div> }
);

export default function ControlChartTool() {
  return (
    <>
      <SiteMeta
        title="管理図ツール"
        description="X̄-R管理図、np管理図、p管理図、u管理図の違いと管理限界を可視化して確認できます。"
        path="/tools/control-chart"
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/tools" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
          シミュレーター一覧へ
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">管理図ツール</h1>

        {/* X̄–R（計量） */}
        <div className="mb-6">
          <ControlChart
            title="X̄–R（寸法）"
            type="x"
            data={[10.1,10.2,9.9,10.3,9.8,10.0,10.4,10.1,9.9,10.2]}
            subgroupSizeForX={5}
          />
        </div>

        {/* np（個数, n 一定） */}
        <div className="mb-6">
          <ControlChart
            title="np（不適合個数）"
            type="np"
            data={[8,10,7,11,9,12,8,10,9,11]}
            nForNp={100}
          />
        </div>

        {/* p（割合, n 変動可） */}
        <div className="mb-6">
          <ControlChart
            title="p（不適合率）"
            type="p"
            data={[0.08,0.10,0.07,0.11,0.09,0.12,0.08,0.10,0.09,0.11]}
            sampleSizes={[100,105,98,110,95,120,103,100,99,108]}
          />
        </div>

        {/* u（単位当たり欠点数） */}
        <div className="mb-6">
          <ControlChart
            title="u（欠点数/単位）"
            type="u"
            data={[2,3,1,4,0,2,5,3,1,2]}
          />
        </div>
      </main>
    </>
  );
}
