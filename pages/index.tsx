// pages/index.tsx
import Head from "next/head";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Training from "@/components/home/Training";
import HomeFeeds from "@/components/home/Feeds";
import HomeLibrary from "@/components/home/HomeLibrary";

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
        {/* ヒーロー */}
        <Hero />

        {/* 学習ガイドライブラリ（カテゴリ＋最新2件の更新） */}
        <HomeLibrary />

        {/* 学習サポート（軽めのカード群） */}
        <Services />

        {/* 研修 */}
        <Training />

        {/* ニュース等フィード */}
        <HomeFeeds />
      </main>
    </>
  );
}
