// pages/index.tsx
import Head from "next/head";

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
