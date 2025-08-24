import { useEffect, useState } from "react";
import Link from "next/link";

/* ---- API型（既存の api/*.ts そのまま） ---- */
type NewsItem = { title: string; link: string; isoDate?: string; source?: string; contentSnippet?: string };
type NoteItem = { title: string; link: string; isoDate?: string; contentSnippet?: string };
type IgItem = {
  id: string; caption?: string; media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string; thumbnail_url?: string; permalink: string; timestamp: string;
};

export default function Home() {
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [note, setNote] = useState<NoteItem[] | null>(null);
  const [ig, setIg] = useState<IgItem[] | null>(null);
  const [igError, setIgError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news?limit=5").then(r=>r.json()).then(j=>setNews(j?.data ?? [])).catch(()=>setNews([]));
    fetch("/api/note?limit=3").then(r=>r.json()).then(j=>setNote(j?.data ?? [])).catch(()=>setNote([]));
    fetch("/api/instagram").then(async r=>{
      const j = await r.json();
      if(!r.ok) throw new Error(j?.error || "Instagram fetch failed");
      setIg(j?.items ?? []);
    }).catch(e=>setIgError(e?.message || "Instagram fetch failed"));
  }, []);

  return (
    <main className="min-h-screen bg-brand-50 text-gray-800">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 pt-6 pb-16">
        {/* ヘッダー */}
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">QC × IE LABO</h1>
          <p className="mt-2 text-sm text-gray-600">
            見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。
          </p>
        </header>

        {/* 学習サポート */}
        <section aria-labelledby="learn-support">
          <h2 id="learn-support" className="text-xl font-bold text-gray-900">学習サポート</h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="QC検定">
              <p className="text-sm leading-6">統計の基礎〜管理図・検定・推定。現場データで演習。</p>
            </Card>
            <Card title="統計検定">
              <p className="text-sm leading-6">記述・推測統計／多変量。理解と活用を両立。</p>
            </Card>
            <Card title="技術士（経営工学）">
              <p className="text-sm leading-6">論文構成・キーワード整理・演習添削まで対応。</p>
            </Card>
          </div>

          <div className="mt-5">
            <Link
              href="/learn"
              className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            >
              学習コンテンツを開く
            </Link>
          </div>
        </section>

        {/* 研修（カスタム前提） */}
        <section aria-labelledby="training" className="mt-10">
          <h2 id="training" className="text-xl font-bold text-gray-900">研修（カスタム前提）</h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Card title="SPC遠習（演習付き）">
              <p className="text-sm leading-6">管理図・工程能力・異常検知を短期集中で。社内データ演習可。</p>
            </Card>
            <Card title="IE基礎">
              <p className="text-sm leading-6">動作/時間研究・ラインバランス。改善テーマに応じて設計。</p>
            </Card>
          </div>
        </section>

        {/* ニュース & note */}
        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <Card title="ニュース（経営工学／品質管理）" subtle>
            <p className="mb-2 text-[11px] text-gray-500">GoogleニュースRSSから自動取得（30分キャッシュ）</p>
            {news === null ? (
              <Muted>読み込み中...</Muted>
            ) : news.length === 0 ? (
              <Muted>現在表示できるニュースはありません。</Muted>
            ) : (
              <ul className="space-y-2 text-sm">
                {news.map((n, i) => (
                  <li key={i} className="leading-6">
                    <a
                      className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                      href={n.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {n.title}
                    </a>
                    {n.source ? <span className="ml-2 text-xs text-gray-500">({n.source})</span> : null}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="表示できる記事がありません。" subtle>
            {/* 右側はスクショに合わせて空（メッセージのみ） */}
          </Card>
        </section>

        {/* SNS */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">SNS</h2>

          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <Card title="X（Twitter）　@n_ieqclab" subtle>
              <div className="rounded-xl border border-gray-200 bg-white/60 px-4 py-4 text-sm shadow-inner">
                <p className="text-gray-600">Timeline @n_ieqclab</p>
              </div>
            </Card>

            <Card title="Instagram 最新投稿" subtle>
              {igError ? (
                <p className="text-sm text-rose-600">
                  Instagramの読み込みでエラー: {igError} - Cannot parse access token
                </p>
              ) : ig === null ? (
                <Muted>読み込み中...</Muted>
              ) : ig.length === 0 ? (
                <Muted>現在表示できる投稿がありません。</Muted>
              ) : (
                <ul className="grid grid-cols-3 gap-3">
                  {ig.map((m) => (
                    <li key={m.id}>
                      <a href={m.permalink} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.thumbnail_url || m.media_url}
                          alt={m.caption || "Instagram"}
                          className="aspect-square w-full rounded-xl object-cover shadow"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---- 共通UI ---- */
function Card({
  title,
  children,
  subtle = false,
}: {
  title: string;
  children?: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-emerald-100 bg-white/70 p-5 shadow-sm ${subtle ? "backdrop-blur" : ""}`}>
      <h3 className="mb-1 text-[15px] font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}
