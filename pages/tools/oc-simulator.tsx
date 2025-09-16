// pages/tools/oc-simulator.tsx
import Head from "next/head";
import dynamic from "next/dynamic";

// Chart.js を使うクライアント専用コンポーネントは SSR を無効化
const OCSimulator = dynamic(() => import("@/components/guide/OCSimulator"), {
  ssr: false,
  loading: () => <div className="text-gray-500">Loading simulator…</div>,
});

export default function OCSimulatorPage() {
  return (
    <>
      <Head>
        <title>OC曲線シミュレーター | QC × IE LABO</title>
        <meta
          name="description"
          content="n と c を動かして OC 曲線と α・β を体感するシミュレーター"
        />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
          OC曲線シミュレーター
        </h1>
        <p className="text-gray-600 mb-6">
          パラメータ（サンプルサイズ n、合格判定個数 c）を変更して、OC曲線の変化と α・β を確認できます。
        </p>

        <OCSimulator
          defaultN={30}
          minN={10}
          maxN={200}
          defaultC={3}
          minC={0}
          maxC={10}
          aql={1.0}
          rql={6.5}
          pMaxPercent={40}
          stepPercent={1}
          showRisk
        />
      </main>
    </>
  );
}
