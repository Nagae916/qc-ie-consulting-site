// pages/tools/chi-square.tsx
import Head from "next/head";
import dynamic from "next/dynamic";

// クライアント専用コンポーネントを SSR 無効で読み込み
const ChiSquareGuide = dynamic(
  () => import("@/components/guide/ChiSquareGuide"),
  { ssr: false, loading: () => <div className="text-gray-500">Loading…</div> }
);

export default function ChiSquareToolPage() {
  return (
    <>
      <Head>
        <title>クロス集計とカイ二乗ツール | QC × IE LABO</title>
        <meta
          name="description"
          content="クロス集計の度数入力から、期待度数・χ²・自由度・p値の計算までを体験"
        />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
          クロス集計とカイ二乗（χ²）ツール
        </h1>
        <p className="text-gray-600 mb-6">
          行×列の度数を入力して、期待度数とχ²統計量・自由度・p値を確認できます。
        </p>

        <ChiSquareGuide />
      </main>
    </>
  );
}
