import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import { allGuides } from "contentlayer/generated";
import InstagramFeed from "@/components/feeds/InstagramFeed";
import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import { insightItems, type InsightItem } from "@/data/insights";
import { siteSections } from "@/data/site-sections";
import { labTools, socialChannels } from "@/data/site";
import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";
import { isGuideContent } from "@/lib/content-classification";

type ExamKey = "qc" | "stat" | "engineer";
type NewsItem = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem = { title: string; link: string; pubDate: string | null };

type GuideLike = {
  title?: string;
  description?: string;
  exam?: string;
  slug?: string;
  updatedAt?: string;
  date?: string;
  publishedAt?: string;
  status?: string;
};

type HomeGuide = {
  title: string;
  description: string;
  exam: ExamKey;
  href: string;
  updatedLabel: string;
  sortValue: number;
};

const examLabels: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士・経営工学",
};

const examBadgeClasses: Record<ExamKey, string> = {
  qc: "border-orange-200 bg-orange-50 text-orange-900",
  stat: "border-blue-200 bg-blue-50 text-blue-900",
  engineer: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

const learningPaths = [
  {
    title: "品質管理・QC",
    description: "QC検定、管理図、工程能力、OC曲線、実験計画法を学ぶ",
    href: "/guides/qc",
    className: "border-orange-200 bg-orange-50",
  },
  {
    title: "統計・データ分析",
    description: "推定、検定、回帰、分散分析を実務と試験に接続する",
    href: "/guides/stat",
    className: "border-blue-200 bg-blue-50",
  },
  {
    title: "技術士・経営工学",
    description: "生産管理、物流、QMS、白書・法改正を答案力へつなげる",
    href: "/guides/engineer",
    className: "border-emerald-200 bg-emerald-50",
  },
  {
    title: "インタラクティブ教材",
    description: "触って理解するシミュレーター型教材",
    href: "/tools",
    className: "border-slate-200 bg-white",
  },
];

const featuredContents = [
  { title: "実験計画法", summary: "要因、水準、主効果、交互作用を品質改善に接続する", href: "/guides/qc" },
  { title: "管理図", summary: "工程の安定性を、ばらつきと異常点から判断する", href: "/guides/qc" },
  { title: "工程能力 Cp/Cpk", summary: "規格に対する工程の余裕を評価し、改善優先度を見極める", href: "/guides/qc" },
  { title: "OC曲線", summary: "抜取検査の判定特性を、消費者・生産者リスクと一緒に理解する", href: "/guides/qc" },
  { title: "技術士答案テンプレート", summary: "課題抽出から解決策、リスク、倫理までを答案構造に落とす", href: "/guides/engineer" },
  { title: "白書・制度動向整理", summary: "ものづくり、物流、DX、価格転嫁などの一次情報を答案背景に使う", href: "/guides/engineer" },
];

const interactiveCards = [
  { title: "χ²検定シミュレーター", href: "/tools/chi-square", status: "利用可" },
  { title: "OC曲線シミュレーター", href: "/tools/oc-simulator", status: "利用可" },
  { title: "管理図シミュレーター", href: "/tools/control-chart", status: "利用可" },
  { title: "答案骨子ビルダー", href: "/guides/engineer/answer-structure-builder", status: "利用可" },
  { title: "過去問トレンドマップ", href: "/guides/engineer/past-exam-trend-map", status: "利用可" },
];

const purposeEntrances = [
  {
    title: "技術士試験の勉強を始めたい",
    description: "まず学習方針で全体像と進め方を確認します。",
    href: "/learn",
    label: "学習方針へ",
  },
  {
    title: "用語や手法を調べたい",
    description: "QC、統計、技術士の個別テーマガイドから探します。",
    href: "/guides",
    label: "ガイドへ",
  },
  {
    title: "答案の骨子を作りたい",
    description: "課題分解、過去問傾向、答案骨子ビルダーを順に使います。",
    href: "/tools",
    label: "演習・ツールへ",
  },
  {
    title: "白書・法令・過去問を確認したい",
    description: "一次情報や過去問データを参考資料から確認します。",
    href: "/references",
    label: "参考資料へ",
  },
  {
    title: "QCや統計を基礎から学びたい",
    description: "品質管理と統計のガイド入口から、基礎テーマへ進みます。",
    href: "/guides/qc",
    label: "QC入口へ",
  },
];

const uniqBy = <T, K extends string | number>(arr: T[], key: (v: T) => K) => {
  const seen = new Set<K>();
  return arr.filter((it) => {
    const k = key(it);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

const toNews = (a: NormalizedFeedItem[]): NewsItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, source: it.source, pubDate: it.pubDate ?? null }));

const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null, excerpt: it.excerpt ?? "" }));

const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null }));

const formatDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const cleanPostTitle = (title: string) =>
  title
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^RT by @[^:]+:\s*/i, "")
    .trim();

const isExamKey = (value: string | undefined): value is ExamKey =>
  value === "qc" || value === "stat" || value === "engineer";

const parseGuideDate = (guide: GuideLike) => {
  const rawDate = guide.updatedAt ?? guide.date ?? guide.publishedAt;
  if (!rawDate) return 0;
  const time = new Date(rawDate).getTime();
  return Number.isFinite(time) ? time : 0;
};

const formatGuideDate = (value: number) => {
  if (value === 0) return "更新日未設定";
  return formatDate(new Date(value).toISOString()) || "更新日未設定";
};

const toHomeGuide = (guide: GuideLike): HomeGuide | null => {
  if (!guide.title || !guide.slug || !isExamKey(guide.exam)) return null;
  const sortValue = parseGuideDate(guide);
  return {
    title: guide.title,
    description: guide.description ?? "",
    exam: guide.exam,
    href: `/guides/${guide.exam}/${guide.slug}`,
    updatedLabel: formatGuideDate(sortValue),
    sortValue,
  };
};

const buildGuideLists = () => {
  const guides = (allGuides as unknown as GuideLike[])
    .filter((guide) => guide.status !== "draft")
    .filter((guide) => isGuideContent({ slug: guide.slug }))
    .map(toHomeGuide)
    .filter((guide): guide is HomeGuide => guide !== null)
    .sort((a, b) => b.sortValue - a.sortValue || a.title.localeCompare(b.title, "ja"));

  return {
    latestGuides: guides.slice(0, 5),
    guidesByExam: {
      qc: guides.filter((guide) => guide.exam === "qc").slice(0, 2),
      stat: guides.filter((guide) => guide.exam === "stat").slice(0, 2),
      engineer: guides.filter((guide) => guide.exam === "engineer").slice(0, 2),
    },
  };
};

export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
  latestGuides: HomeGuide[];
  guidesByExam: Record<ExamKey, HomeGuide[]>;
  insights: InsightItem[];
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "https://note.com/nieqc_0713/rss";
  const X_RSS_URL = process.env.X_RSS_URL || "";

  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeedByUrl(X_RSS_URL, 5) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  return {
    props: {
      newsItems: uniqBy(toNews(newsRaw), (it) => it.link).slice(0, 3),
      noteItems: uniqBy(toNote(noteRaw), (it) => it.link).slice(0, 3),
      xItems: uniqBy(toX(xRaw), (it) => it.link).slice(0, 3),
      ...buildGuideLists(),
      insights: insightItems,
    },
    revalidate: 1800,
  };
};

export default function HomePage({
  newsItems,
  noteItems,
  xItems,
  latestGuides,
  guidesByExam,
  insights,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>n-ie-qclab | 経営工学・品質管理・統計の学習ラボ</title>
        <meta
          name="description"
          content="経営工学・品質管理・統計を、試験対策から実務改善までつなげる学習サイトです。"
        />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.15fr_.85fr] md:py-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">n-ie-qclab</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                経営工学・品質管理・統計を、
                <span className="block text-teal-700">試験対策から実務改善までつなげる学習ラボ</span>
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-slate-600">
                QC検定、統計学習、技術士試験、現場の品質マネジメントを横断し、“覚える”だけでなく“使える”知識へ接続するための学習サイトです。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/guides/qc" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                  品質管理・QCを学ぶ
                </Link>
                <Link href="/guides/stat" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-teal-600">
                  統計を学ぶ
                </Link>
                <Link href="/guides/engineer" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-teal-600">
                  技術士・経営工学を学ぶ
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#eef6f1] p-5">
              <h2 className="text-base font-bold">学びの全体像</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                経営工学を中心に、品質管理、統計、技術士答案、QMS改善をつなげて学びます。
              </p>
              <div className="mt-4 space-y-3">
                {learningPaths.slice(0, 3).map((path) => (
                  <Link key={path.href} href={path.href} className="block rounded-lg bg-white p-4 hover:ring-1 hover:ring-teal-500">
                    <div className="font-bold">{path.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{path.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionHeader eyebrow="Learning paths" title="目的から選ぶ" description="初訪問でも迷わないよう、学習目的ごとの入口を整理しました。" />
        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 md:grid-cols-2 lg:grid-cols-4">
          {learningPaths.map((path) => (
            <Link key={path.href} href={path.href} className={`rounded-xl border p-5 hover:shadow-sm ${path.className}`}>
              <h3 className="font-bold">{path.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{path.description}</p>
            </Link>
          ))}
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <SectionTitle eyebrow="What you can do" title="このサイトでできること" description="ロードマップ、個別テーマ、演習教材、参考資料を分けて探せます。ガイドは個別テーマを学ぶコンテンツに限定しています。" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {siteSections.map((section) => (
                <Link key={section.key} href={section.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
                  <h3 className="font-bold">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {section.examples.slice(0, 2).map((example) => (
                      <span key={example} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {example}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionTitle eyebrow="Start by purpose" title="目的別入口" description="いまやりたいことから、最短の入口へ進めます。" />
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {purposeEntrances.map((item) => (
              <Link key={item.title} href={item.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f8f5]">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <SectionTitle eyebrow="Featured contents" title="重点コンテンツ" description="試験にも実務にも効くテーマを、先に見える場所へ置いています。" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredContents.map((content) => (
                <Link key={content.title} href={content.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                  <h3 className="font-bold">{content.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{content.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionTitle eyebrow="Latest guides" title="最新ガイド" description="個別テーマを学ぶガイドだけを表示します。ロードマップや演習ツールは別の入口に分けています。" />
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-bold">最新ガイド</h3>
              <GuideList guides={latestGuides} />
            </div>
            <div className="grid gap-4">
              {(["qc", "stat", "engineer"] as ExamKey[]).map((exam) => (
                <div key={exam} className={`rounded-lg border p-5 ${examBadgeClasses[exam]}`}>
                  <h3 className="font-bold">{examLabels[exam]}の最新</h3>
                  <GuideList guides={guidesByExam[exam]} compact />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <SectionTitle eyebrow="Interactive lab" title="触って理解する教材" description="概念を数値で動かしてつかむための入口です。未実装のものは準備中として表示します。" />
            <div className="mt-5 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {interactiveCards.map((card) => (
                <Link key={card.title} href={card.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                  <div className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{card.status}</div>
                  <h3 className="mt-3 font-bold">{card.title}</h3>
                </Link>
              ))}
            </div>
            {labTools.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {labTools.slice(0, 3).map((tool) => (
                  <Link key={tool.href} href={tool.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                    <div className="text-xs font-semibold text-teal-700">{tool.category}</div>
                    <h3 className="mt-2 font-bold">{tool.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tool.summary}</p>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionTitle eyebrow="Insights" title="最新知見・制度動向" description="白書、法改正、標準化、DX、物流など、試験と実務の背景になる一次情報への入口です。" />
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <a
                key={`${insight.source}-${insight.title}`}
                href={insight.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{insight.category}</span>
                  <span className="text-xs text-slate-500">{insight.source}</span>
                </div>
                <h3 className="mt-3 font-bold">{insight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{insight.summary}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <SectionTitle eyebrow="Catch up" title="フィードで最新情報を追う" description="News、note、SNSの更新をトップ下部に整理して表示します。" />
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="min-h-64 rounded-lg border border-slate-200 p-5">
                <NewsFeed limit={3} items={newsItems} />
              </div>
              <div className="min-h-64 rounded-lg border border-slate-200 p-5">
                <NoteFeed limit={3} user="nieqc_0713" items={noteItems} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionTitle eyebrow="Social" title="note・Instagram・X" description="学習メモ、図解、更新情報は外部発信とも接続します。" />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {socialChannels.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-900 text-sm font-black text-white">
                    {social.name === "Instagram" ? "IG" : social.name === "note" ? "N" : "X"}
                  </div>
                  <div>
                    <div className="font-bold">{social.name}</div>
                    <div className="text-sm text-slate-500">@{social.handle}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{social.purpose}</p>
                <div className="mt-4 text-sm font-semibold text-teal-700 group-hover:text-teal-900">公式ページを開く</div>
              </a>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-teal-700">note</p>
                  <h3 className="font-bold">考え方・経験を読む</h3>
                </div>
                <a href="https://note.com/nieqc_0713" target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-700">
                  noteへ
                </a>
              </div>
              <div className="grid gap-3">
                {noteItems.length > 0 ? (
                  noteItems.map((item) => (
                    <a key={item.link} href={item.link} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-100 p-4 hover:border-teal-500">
                      <div className="flex gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#41c9b4] text-xs font-black text-white">note</div>
                        <div>
                          <div className="font-semibold leading-6">{item.title}</div>
                          {item.pubDate ? <div className="mt-1 text-xs text-slate-500">{formatDate(item.pubDate)}</div> : null}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">noteの最新記事を取得できませんでした。</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-teal-700">X</p>
                  <h3 className="font-bold">更新・気づきを追う</h3>
                </div>
                <a href="https://twitter.com/n_ieqclab" target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-700">
                  Xへ
                </a>
              </div>
              <div className="grid gap-3">
                {xItems.length > 0 ? (
                  xItems.map((item) => (
                    <a key={item.link} href={item.link} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-100 p-4 hover:border-teal-500">
                      <div className="flex gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-900 text-sm font-black text-white">X</div>
                        <div>
                          <div className="line-clamp-3 font-semibold leading-6">{cleanPostTitle(item.title) || "投稿を読む"}</div>
                          {item.pubDate ? <div className="mt-1 text-xs text-slate-500">{formatDate(item.pubDate)}</div> : null}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Xの最新投稿を取得できませんでした。</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-700">Instagram</p>
                <h3 className="font-bold">図解・短い学習メモを見る</h3>
              </div>
              <a href="https://www.instagram.com/n.ieqclab" target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-700">
                Instagramへ
              </a>
            </div>
            <div className="min-h-48">
              <InstagramFeed limit={3} />
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="rounded-xl bg-slate-900 p-6 text-white">
              <h2 className="text-2xl font-bold">次の学習へ進む</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
                迷ったら、いまの目的に一番近い入口から始めてください。試験対策で得た知識を、現場の改善とQMSの見直しへつなげていきます。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/guides/qc" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                  QCから学ぶ
                </Link>
                <Link href="/guides/stat" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  統計から学ぶ
                </Link>
                <Link href="/guides/engineer" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  技術士答案を鍛える
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10">
      <SectionTitle eyebrow={eyebrow} title={title} description={description} />
    </section>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-teal-700">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function GuideList({ guides, compact = false }: { guides: HomeGuide[]; compact?: boolean }) {
  if (guides.length === 0) {
    return <p className="mt-3 text-sm text-slate-500">表示できるガイドがまだありません。</p>;
  }

  return (
    <div className="mt-4 grid gap-3">
      {guides.map((guide) => (
        <Link key={`${guide.exam}-${guide.href}`} href={guide.href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${examBadgeClasses[guide.exam]}`}>
              {examLabels[guide.exam]}
            </span>
            <span className="text-xs text-slate-500">{guide.updatedLabel}</span>
          </div>
          <div className="mt-2 font-bold text-slate-900">{guide.title}</div>
          {!compact && guide.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p> : null}
        </Link>
      ))}
    </div>
  );
}
