// pages/index.tsx
import Link from "next/link";
import Head from "next/head";

// 既存のコンポーネントをそのまま利用します（src/components/learn/ 配下）
import NewsFeed from "@/components/learn/NewsFeed";
import NoteFeed from "@/components/learn/NoteFeed";
import InstagramFeed from "@/components/learn/InstagramFeed";
import XTimeline from "@/components/learn/XTimeline";

export default function Home() {
  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta
          name="description"
          content="見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。"
        />
      </Head>

      <main className="min-h-screen bg-brand-50 text-gray-800">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
          {/* Header */}
          <header className="mb-6 md:mb-10">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              QC × IE LABO
            </h1>
            <p className="mt-2 text-sm md:text-base">
              見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。
            </p>
          </header>

          {/* 学習サポート */}
          <section className="mb-6 md:mb-10">
            <h2 className="mb-4 text-lg font-bold md:mb-6 md:text-xl">
              学習サポート
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="font-semibold">QC検定</h3>
                <p className="mt-1 text-sm leading-6">
                  統計の基礎〜管理図・検定・推定。現場データで演習。
                </p>
              </article>

              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="font-semibold">統計検定</h3>
                <p className="mt-1 text-sm leading-6">
                  記述・推測統計／多変量。理解と活用を両立。
                </p>
              </article>

              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="font-semibold">技術士（経営工学）</h3>
                <p className="mt-1 text-sm leading-6">
                  論文構成・キーワード整理・演習添削まで対応。
                </p>
              </article>
            </div>

            <div className="mt-4">
              <Link
                href="/learn"
                className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                学習コンテンツを開く
              </Link>
            </div>
          </section>

          {/* 研修（カスタム前提） */}
          <section className="mb-6 md:mb-10">
            <h2 className="mb-4 text-lg font-bold md:mb-6 md:text-xl">
              研修（カスタム前提）
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="font-semibold">SPC演習（演習付き）</h3>
                <p className="mt-1 text-sm leading-6">
                  管理図・工程能力・異常検知を短期集中で。社内データ演習可。
                </p>
              </article>

              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="font-semibold">IE基礎</h3>
                <p className="mt-1 text-sm leading-6">
                  動作/時間研究・ラインバランス。改善テーマに応じて設計。
                </p>
              </article>
            </div>
          </section>

          {/* ニュース & note */}
          <section className="mb-6 md:mb-10">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="text-base font-semibold">
                  ニュース（経営工学／品質管理）
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  GoogleニュースRSSから自動取得（30分キャッシュ）
                </p>
                <div className="mt-3">
                  {/* 既存の NewsFeed コンポーネント */}
                  <NewsFeed limit={8} />
                </div>
              </article>

              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="text-base font-semibold">note 最新記事</h3>
                <div className="mt-3">
                  {/* 既存の NoteFeed コンポーネント */}
                  <NoteFeed limit={6} />
                </div>
              </article>
            </div>
          </section>

          {/* SNS */}
          <section className="mb-14">
            <h2 className="mb-4 text-lg font-bold md:mb-6 md:text-xl">SNS</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="text-base font-semibold">X（Twitter） @n_ieqlab</h3>
                <div className="mt-3">
                  <XTimeline />
                </div>
              </article>

              <article className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
                <h3 className="text-base font-semibold">Instagram 最新投稿</h3>
                <div className="mt-3">
                  {/* 既存の InstagramFeed（トークン無効時はエラーメッセージ表示） */}
                  <InstagramFeed limit={3} />
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
