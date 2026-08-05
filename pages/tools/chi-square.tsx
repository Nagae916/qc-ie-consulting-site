// pages/tools/chi-square.tsx
import dynamic from "next/dynamic";
import Link from "next/link";

import { SiteMeta } from "@/components/site/SiteMeta";

// クライアント専用コンポーネントを SSR 無効で読み込み
const ChiSquareGuide = dynamic(
  () => import("@/components/guide/ChiSquareGuide"),
  { ssr: false, loading: () => <div className="text-gray-500">Loading…</div> }
);

export default function ChiSquareToolPage() {
  return (
    <>
      <SiteMeta
        title="クロス集計とカイ二乗ツール"
        description="クロス集計の度数入力から、期待度数、カイ二乗統計量、自由度、p値までを確認できるツールです。"
        path="/tools/chi-square"
      />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/tools" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
          シミュレーター一覧へ
        </Link>
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
