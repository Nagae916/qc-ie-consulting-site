import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

type NewsItem = { title: string; link: string };

function Card(props: { title?: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-card bg-white p-6 ${props.className ?? ""}`}>
      {props.title && <h3 className="text-lg font-semibold mb-2">{props.title}</h3>}
      <div>{props.children}</div>
    </div>
  );
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsErr, setNewsErr] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/news?limit=6", { cache: "no-store" });
        const json = await r.json();
        if (json?.data?.length) {
          setNews(
            json.data.map((it: any) => ({
              title: it.title || "",
              link: it.link || "#",
            }))
          );
        } else {
          setNews([]);
        }
      } catch (e: any) {
        setNewsErr(e?.message || "NEWS_FETCH_FAILED");
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。" />
      </Head>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-10">
        {/* ヘッダー */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">QC × IE LABO</h1>
          <p className="text-gray-600">見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。</p>
        </header>

        {/* 学習サポート */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">学習サポート</h2>

          {/* 3列カード */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <div className="font-semibold mb-2">QC検定</div>
              <p className="text-sm text-gray-600">統計の基礎〜管理図・検定・推定。現場データで演習。</p>
            </Card>

            <Card>
              <div className="font-semibold mb-2">統計検定</div>
              <p className="text-sm text-gray-600">記述・推測統計／多変量。理論と活用を両立。</p>
            </Card>

            <Card>
              <div className="font-semibold mb-2">技術士（経営工学）</div>
              <p className="text-sm text-gray-600">論文構成・キーワード整理・演習添削まで対応。</p>
            </Card>
          </div>

          <div>
            <Link
              href="/learn"
              className="inline-block rounded-full px-5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              学習コンテンツを開く
            </Link>
          </div>
        </section>

        {/* 研修（カスタム前提） */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">研修（カスタム前提）</h2>

          {/* 2列カード */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="font-semibold mb-2">SPC演習（演習付き）</div>
              <p className="text-sm text-gray-600">
                管理図・工程能力・異常検知を短期集中で。社内データ演習可。
              </p>
            </Card>

            <Card>
              <div className="font-semibold mb-2">IE基礎</div>
              <p className="text-sm text-gray-600">
                動作/時間研究・ラインバランス。改善テーマに応じて設計。
              </p>
            </Card>
          </div>
        </section>

        {/* ニュース + IE基礎欄（右はプレースホルダー） */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="ニュース（経営工学／品質管理）">
              <p className="text-sm text-gray-500 mb-3">
                GoogleニュースRSSから自動取得（30分キャッシュ）
              </p>
              {newsErr && (
                <p className="text-sm text-red-600">ニュース取得でエラー: {newsErr}</p>
              )}
              {!newsErr && !news.length && (
                <p className="text-sm text-gray-600">現在表示できるニュースはありません。</p>
              )}
              {!!news.length && (
                <ul className="list-disc list-inside space-y-1">
                  {news.map((n, i) => (
                    <li key={i}>
                      <a
                        className="text-emerald-700 hover:underline"
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {n.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <p className="text-sm text-gray-600">表示できる記事がありません。</p>
            </Card>
          </div>
        </section>

        {/* SNS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">SNS</h2>

          <Card title="X（Twitter）  @n_ieqlab">
            {/* ここは従来の埋め込みウィジェットをそのまま入れる想定 */}
            <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
              Timeline @n_ieqlab
            </div>
          </Card>

          <Card title="Instagram 最新投稿">
            <p className="text-sm text-gray-600">
              Instagramの読み込みでエラーが出る場合は、環境変数
              <code className="mx-1 bg-gray-100 px-1 rounded">IG_USER_ID</code> /
              <code className="mx-1 bg-gray-100 px-1 rounded">IG_ACCESS_TOKEN</code>
              の有効期限をご確認ください。
            </p>
          </Card>
        </section>
      </main>
    </>
  );
}
