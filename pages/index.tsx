// pages/index.tsx
import Head from "next/head";
import Link from "next/link";

// トップページ専用セクション（src/components/home）
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Training from "@/components/home/Training";
import HomeFeeds from "@/components/home/Feeds";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta
          name="description"
          content="見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。QC検定・統計検定・技術士、そして研修の情報をまとめています。"
        />
      </Head>

      <main className="container mx-auto px-4 py-10 space-y-12">
        {/* ヒーロー（タイトル/リード） */}
        <Hero />

        {/* カテゴリーボタン（品質管理 / 統計 / 技術士） */}
        <section className="text-center">
          <h2 className="text-xl font-semibold mb-4">学習カテゴリ</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/guides/qc"
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
            >
              品質管理
            </Link>
            <Link
              href="/guides/stat"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              統計
            </Link>
            <Link
              href="/guides/engineer"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              技術士
            </Link>
          </div>
        </section>

        {/* 学習サポート（QC検定/統計検定/技術士などのカード群） */}
        <Services />

        {/* 研修（SPC演習/IE基礎 など） */}
        <Training />

        {/* ニュース・note・X・Instagram まとめ（ホーム用） */}
        <HomeFeeds />
      </main>
    </>
  );
}
