// pages/tools/control-chart.tsx
import Head from "next/head";
import dynamic from "next/dynamic";

const ControlChart = dynamic(
  () => import("@/components/guide/ControlChart"),
  { ssr: false, loading: () => <div className="text-gray-500">Loading chart…</div> }
);

export default function ControlChartTool() {
  return (
    <>
      <Head>
        <title>管理図ツール | QC × IE LABO</title>
        <meta name="description" content="X̄–R / np / p / u 管理図の可視化" />
      </Head>
      <main className="mx-auto max-w-5xl px-4 py-8">
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
