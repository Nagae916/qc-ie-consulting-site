// pages/index.tsx
// レイアウトは極力そのまま。データ取得だけ SSG（30分ISR）に変更し、各フィードへ items を渡します。
import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

// 既存フィードUI（レイアウトは維持してそのまま利用）
import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed"; // ← 既存のRSS対応版を使用

// RSS正規化ヘルパ（/lib/feeds の最小スキーマに合わせる）
import { fetchFeed, type NormalizedFeedItem } from "@/lib/feeds";

// -- 各UIが使いやすい形に変換 --
type NewsItem = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem    = { title: string; link: string; pubDate: string | null };
type InstaRaw = { link: string; image: string; caption: string; isoDate: string | null };

// 重複除去（link 基準）
const uniqByLink = <T extends { link: string }>(arr: T[]): T[] => {
  const seen = new Set<string>();
  return arr.filter((x) => (x.link && !seen.has(x.link) ? (seen.add(x.link), true) : false));
};

// 正規化 → News 用
const toNews = (a: NormalizedFeedItem[]): NewsItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    source: it.source,
    // lib/feeds は pubDate を保証（ISO）。isoDate 参照は不要。
    pubDate: it.pubDate ?? null,
  }));

// 正規化 → Note 用（description は型に無い可能性があるので any 経由で安全に取得）
const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    pubDate: it.pubDate ?? null,
    excerpt: ((it as any)?.description as string | undefined) ?? "",
  }));

// 正規化 → X の軽量表示用
const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    pubDate: it.pubDate ?? null,
  }));

// 正規化 → Instagram（後で InstagramFeed の Item に変換）
const toInsta = (a: NormalizedFeedItem[]): InstaRaw[] =>
  a
    .map((it) => ({
      link: it.link,
      image: (it as any)?.image ?? "", // 画像が無いエントリは後段で除外
      caption: ((it as any)?.description as string | undefined) ?? "",
      isoDate: it.pubDate ?? null,     // 正規化は pubDate を使用
    }))
    .filter((x) => !!x.image);

export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
  instaItems: InstaRaw[];
}> = async () => {
  // .env のURL（空は無視）
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "";
  const X_RSS_URL = process.env.X_RSS_URL || "";
  const INSTAGRAM_RSS_URL = process.env.INSTAGRAM_RSS_URL || "";

  // 並列取得（空URLは空配列を返す）
  const [newsRaw, noteRaw, xRaw, instaRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeed(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeed(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeed(X_RSS_URL, 5) : Promise.resolve<NormalizedFeedItem[]>([]),
    INSTAGRAM_RSS_URL ? fetchFeed(INSTAGRAM_RSS_URL, 8) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  // 形を合わせつつ、重複除去
  const newsItems  = uniqByLink(toNews(newsRaw)).slice(0, 6);
  const noteItems  = uniqByLink(toNote(noteRaw)).slice(0, 6);
  const xItems     = uniqByLink(toX(xRaw)).slice(0, 5);
  const instaItems = uniqByLink(toInsta(instaRaw)).slice(0, 3); // 直近3件

  return {
    props: { newsItems, noteItems, xItems, instaItems },
    // 30分ごとに再生成（トップの最新性を担保）
    revalidate: 1800,
  };
};

export default function HomePage({
  newsItems,
  noteItems,
  xItems,
  instaItems,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // InstagramFeed が期待する Item 形に SSR 側で変換して渡す
  const instaItemsForComp = instaItems.map((it, i) => ({
    id: it.link || `ig-${i}`,
    caption: it.caption || "（キャプションなし）",
    media_url: it.image || null,
    permalink: it.link || "#",
    timestamp: it.isoDate ?? null,
  }));

  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="品質管理・経営工学の学習と実務に役立つガイドと最新情報" />
      </Head>

      {/* ▼ ここから下は“現行のトップレイアウト”を維持したまま、items を渡すだけに留めています */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* --- ヒーロー／イントロ（既存のまま） --- */}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">QC × IE LABO</h1>
          <p className="mt-2 text-gray-600">
            現場で使える品質管理・経営工学のガイドと最新情報を一箇所に。
          </p>
        </section>

        {/* --- グリッド：左にガイド／右に外部フィード等（既存の配置を踏襲） --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左（2カラム相当）— 既存の学習ガイドカードなど */}
          <div className="lg:col-span-2 space-y-6">
            {/* 既存のガイド一覧やカード群をそのまま残してください */}
            {/* 例）<GuidesGrid /> 等 */}
          </div>

          {/* 右（1カラム）— 外部フィード */}
          <aside className="space-y-6">
            {/* News（SSR渡し） */}
            {(NewsFeed as any)({ limit: 6, variant: "card", items: newsItems })}

            {/* note（SSR渡し） */}
            {(NoteFeed as any)({ limit: 6, user: "nieqc_0713", items: noteItems })}

            {/* X（軽量フォールバック用リストを SSR で渡す／埋め込みはコンポーネント側の mode に従う） */}
            {(XTimeline as any)({
              username: "@n_ieqclab",
              limit: 5,
              mode: process.env.NEXT_PUBLIC_X_EMBED_MODE || "auto",
              items: xItems,
              minHeight: 600,
            })}

            {/* Instagram（直近3件）— 既存コンポーネントへ SSR 変換済み items を渡す */}
            <InstagramFeed limit={3} items={instaItemsForComp} />
          </aside>
        </div>
      </main>
    </>
  );
}
