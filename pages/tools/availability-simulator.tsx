// pages/tools/availability-simulator.tsx
import Head from "next/head";
import dynamic from "next/dynamic";

const AvailabilitySimulator = dynamic(
  () => import("@/components/guide/AvailabilitySimulator"),
  { ssr: false, loading: () => <div className="text-gray-500">Loading simulator…</div> }
);

export default function AvailabilitySimulatorPage() {
  return (
    <>
      <Head>
        <title>可用性シミュレーター | QC × IE LABO</title>
        <meta
          name="description"
          content="MTBF と MTTR を変えて可用性（Availability）を体感"
        />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
          可用性シミュレーター
        </h1>
        <p className="text-gray-600 mb-6">
          スライダーまたは数値入力で MTBF/MTTR を変更すると、稼働率が即時更新されます。式：{" "}
          <code>Availability = MTBF / (MTBF + MTTR)</code>
        </p>

        <AvailabilitySimulator
          defaultMTBF={500}
          minMTBF={10}
          maxMTBF={1000}
          defaultMTTR={10}
          minMTTR={1}
          maxMTTR={100}
        />
      </main>
    </>
  );
}
