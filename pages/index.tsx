// pages/index.tsx
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { allGuides } from "contentlayer/generated";
import { readFeed, type FeedItem } from "@/lib/rss";

// 既存のフィードUI（UIのみ担当）
import NewsFeed from "@/components/feeds/NewsFeed";
import Bloglist from "@/components/feeds/Bloglist";
import NoteFeed from "@/components/feeds/NoteFeed";
import InstagramFeed from "@/components/feeds/InstagramFeed";
import XTimeline from "@/components/feeds/XTimeline";

type ExamKey = "qc" | "stat" | "engineer";
const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

function ymd(d?: string) {
  if (!d) return "";
  const t = Date.parse(d);
  if (!Number.isFinite(t)) return "";
  const dt = new Date(t);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

export const getStaticProps: GetStaticProps<{
  latestGuides: Array<{ title: string; href: string; exam: ExamKey; updated: string; description?: string | null }>;
  feeds: {
    news: FeedItem[];
    blog: FeedItem[];
    note: FeedItem[];
    insta: FeedItem[];
    x: FeedItem[];
  };
}> = async () => {
  // --- ガイド：更新日降順で最新6件 ---
  const guides = (allGuides as any[])
    .filter((g) => (g.status ?? "published") !== "draft")
    .map((g) => {
      const raw = String(g._raw?.flattenedPath ?? ""); // guides/qc/slug
      const parts = raw.split("/");
      const examRaw = (g.exam ?? parts[1] ?? "qc").toLowerCase();
      const exam: ExamKey =
        examRaw === "stat" || examRaw === "statistics"
          ? "stat"
          : examRaw === "engineer" || examRaw === "eng" || examRaw === "pe"
          ? "engineer"
          : "qc";
      const slug = g.slug ?? parts[parts.length - 1];
      const href = `/guides/${exam}/${slug}`;
      const updated = ymd(g.updatedAtAuto ?? g.updatedAt ?? g.date);
      return { title: g.title, href, exam, updated, description: g.description ?? null };
    })
    .sort((a, b) => (b.updated > a.updated ? 1 : b.updated < a.updated ? -1 : 0))
    .slice(0, 6);

  // --- 外部RSS：環境変数でURL指定（無い/失敗は空配列で安全に） ---
  const cfg = {
    NEWS_RSS_URL: process.env.NEWS_RSS_URL ?? "",        // 例: 社内NewsやZenn/はてな等
    BLOG_RSS_URL: process.env.BLOG_RSS_URL ?? "",        // 例: 自社ブログ
    NOTE_RSS_URL: process.env.NOTE_RSS_URL ?? "",        // 例: https://note.com/<user>/rss
    INSTAGRAM_RSS_URL: process.env.INSTAGRAM_RSS_URL ?? "", // 公式RSS無し → RSSHub等のプロキシを指定
    X_RSS_URL: process.env.X_RSS_URL ?? "",              // 公式RSS無し → Nitter等のRSSを指定
  };

  const [news, blog, note, insta, x] = await Promise.all([
    cfg.NEWS_RSS_URL ? readFeed(cfg.NEWS_RSS_URL, 6) : Promise.resolve([]),
    cfg.BLOG_RSS_URL ? readFeed(cfg.BLOG_RSS_URL, 6) : Promise.resolve([]),
    cfg.NOTE_RSS_URL ? readFeed(cfg.NOTE_RSS_URL, 6) : Promise.resolve([]),
    cfg.INSTAGRAM_RSS_URL ? readFeed(cfg.INSTAGRAM_RSS_URL, 6) : Promise.resolve([]),
    cfg.X_RSS_URL ? readFeed(cfg.X_RSS_URL, 6) : Promise.resolve([]),
  ]);

  return {
    props: {
      latestGuides: guides,
      feeds: { news, blog, note, insta, x },
    },
    // 10分おきに再生成（外部RSSの最新を自動反映）
    revalidate: 600,
  };
};

export default function Home({
  latestGuides,
  feeds,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="品質管理・統計・技術士の学習ガイドと最新情報" />
        <link rel="canonical" href="/" />
      </Head>

      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">QC × IE LABO</h1>
        <p className="mt-2 text-gray-600">
          統一様式の学習ガイドと最新情報をお届けします。
        </p>
      </section>

      {/* 最新ガイド */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">最新ガイド</h2>
          <Link href="/guides" className="text-sm underline text-gray-600 hover:text-gray-800">すべてのガイド</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestGuides.map((g) => (
            <Link key={g.href} href={g.href} className="block content-card p-4 rounded-lg shadow-sm hover:shadow transition">
              <div className="text-xs text-gray-500 mb-1">
                {EXAM_LABEL[g.exam]} ・ {g.updated && `更新 ${g.updated}`}
              </div>
              <div className="font-semibold text-gray-900">{g.title}</div>
              {g.description ? <p className="text-sm text-gray-600 mt-1 line-clamp-2">{g.description}</p> : null}
            </Link>
          ))}
        </div>
      </section>

      {/* NEWS & FEEDS */}
      <section className="space-y-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">NEWS</h2>
          <NewsFeed items={feeds.news} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Blog</h2>
          <Bloglist items={feeds.blog} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">note</h2>
          <NoteFeed items={feeds.note} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Instagram</h2>
          <InstagramFeed items={feeds.insta} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">X / 旧Twitter</h2>
          <XTimeline items={feeds.x} />
        </div>
      </section>
    </main>
  );
}
