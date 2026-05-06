import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { classifyContent, classificationLabels, type ContentClassification } from "@/lib/content-classification";

type ExamKey = "qc" | "stat" | "engineer";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const EXAM_DESCRIPTION: Record<ExamKey, string> = {
  qc: "QC検定、品質管理、QMS改善、品質工学を学ぶためのガイド一覧です。",
  stat: "データサイエンティスト検定、統計学習、品質管理、経営工学をつなげて学ぶためのガイド一覧です。",
  engineer: "技術士第二次試験、経営工学、生産管理、QMS改善を学ぶためのガイド一覧です。",
};

const THEME: Record<
  ExamKey,
  { border: string; accent: string; title: string; pillBg: string; pillBorder: string; btn: string; btnHover: string }
> = {
  qc: {
    border: "border-amber-200",
    accent: "bg-amber-300/70",
    title: "text-amber-800",
    pillBg: "bg-amber-50 text-amber-800",
    pillBorder: "border-amber-200",
    btn: "bg-amber-500",
    btnHover: "hover:bg-amber-600",
  },
  stat: {
    border: "border-sky-200",
    accent: "bg-sky-300/70",
    title: "text-sky-800",
    pillBg: "bg-sky-50 text-sky-800",
    pillBorder: "border-sky-200",
    btn: "bg-sky-600",
    btnHover: "hover:bg-sky-700",
  },
  engineer: {
    border: "border-emerald-200",
    accent: "bg-emerald-300/70",
    title: "text-emerald-800",
    pillBg: "bg-emerald-50 text-emerald-800",
    pillBorder: "border-emerald-200",
    btn: "bg-emerald-600",
    btnHover: "hover:bg-emerald-700",
  },
};

const statLearningSteps = [
  {
    title: "統計学習ロードマップ",
    description: "データサイエンス、品質管理、技術士答案をつなぐ全体像を確認する",
    href: "/guides/stat/data-science-stat-roadmap",
    status: "公開中",
  },
  {
    title: "データの種類と尺度",
    description: "観測値、変数、数値・カテゴリ、尺度水準を整理し、手法選択の土台を作る",
    href: "/guides/stat/data-types-and-scales",
    status: "公開中",
  },
  {
    title: "記述統計",
    description: "平均、中央値、標準偏差、ヒストグラムでデータの全体像を読む",
    href: "/guides/stat/descriptive-statistics",
    status: "公開中",
  },
  {
    title: "ばらつきと分布",
    description: "標準偏差、ヒストグラム、正規分布を品質管理の見方へ接続する",
    href: "/guides/stat/variance-standard-deviation",
    status: "学習候補",
  },
  {
    title: "推定・検定",
    description: "標本から母集団を推測し、改善効果や差を判断する考え方を学ぶ",
    href: "/guides/stat/hypothesis-testing",
    status: "学習候補",
  },
  {
    title: "相関・回帰",
    description: "関係性、予測、要因分析を品質改善やデータ分析へつなげる",
    href: "/guides/stat/correlation",
    status: "学習候補",
  },
];

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

const safeTags = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map((x) => String(x ?? "")).filter(Boolean);
  if (typeof v === "string") return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
  return [];
};

const formatYMD = (v1?: unknown, v2?: unknown): string => {
  const s = String(v1 ?? v2 ?? "").trim();
  if (!s) return "";
  const m = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

const guideHref = (g: Guide, fallbackExam: ExamKey) => {
  const maybeUrl = (g as { url?: unknown }).url;
  if (typeof maybeUrl === "string" && maybeUrl.startsWith("/guides/")) return maybeUrl;
  const exam = toExamKey((g as { exam?: unknown }).exam) ?? fallbackExam;
  const rawSlug = (g as { slug?: unknown }).slug;
  const slug = String(rawSlug ?? g._raw?.flattenedPath?.split("/").pop() ?? "").trim();
  return `/guides/${exam}/${slug}`;
};

const timeKey = (g: Guide): number => {
  const values = g as { updatedAtAuto?: unknown; updatedAt?: unknown; date?: unknown };
  return Date.parse(String(values.updatedAtAuto ?? values.updatedAt ?? values.date ?? "")) || 0;
};

const uniqByHref = <T extends { href: string }>(arr: T[]): T[] => {
  const seen = new Set<string>();
  return arr.filter((item) => {
    if (!item.href || seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (["qc", "stat", "engineer"] as ExamKey[]).map((exam) => ({ params: { exam } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ exam: ExamKey }> = async ({ params }) => {
  const exam = toExamKey(params?.exam);
  if (!exam) return { notFound: true };
  return { props: { exam }, revalidate: 1800 };
};

type Card = {
  g: Guide;
  href: string;
  tags: string[];
  updatedYmd: string;
  title: string;
  description?: string;
  section?: string;
  classification: ContentClassification;
};

export default function ExamIndex({ exam }: InferGetStaticPropsType<typeof getStaticProps>) {
  const guidesEnriched = allGuides
    .filter((g) => toExamKey((g as { exam?: unknown }).exam) === exam && (g as { status?: unknown }).status !== "draft")
    .sort((a, b) => {
      const aSection = String((a as { section?: unknown }).section ?? "");
      const bSection = String((b as { section?: unknown }).section ?? "");
      const secCmp = aSection.localeCompare(bSection);
      if (secCmp !== 0) return secCmp;
      return timeKey(b) - timeKey(a);
    })
    .map((g): Card => {
      const values = g as {
        tags?: unknown;
        updatedAtAuto?: unknown;
        updatedAt?: unknown;
        date?: unknown;
        title?: unknown;
        description?: unknown;
        section?: unknown;
      };
      const href = guideHref(g, exam);
      const tags = safeTags(values.tags).slice(0, 4);
      const updatedYmd = formatYMD(values.updatedAtAuto ?? values.updatedAt, values.date);
      const title = String(values.title ?? "(no title)");
      const description = typeof values.description === "string" ? values.description : undefined;
      const section = typeof values.section === "string" ? values.section : undefined;
      const classification = classifyContent({ slug: href.split("/").pop(), href });

      return {
        g,
        href,
        tags,
        updatedYmd,
        title,
        classification,
        ...(description ? { description } : {}),
        ...(section ? { section } : {}),
      };
    });

  const guides = uniqByHref<Card>(guidesEnriched);
  const themeGuides = guides.filter((guide) => guide.classification === "guide");
  const learningRoutes = guides.filter((guide) => guide.classification === "learning-route");
  const tools = guides.filter((guide) => guide.classification === "tool");
  const duplicateCandidates = guides.filter((guide) => guide.classification === "duplicate-candidate");
  const t = THEME[exam];

  return (
    <>
      <Head>
        <title>{EXAM_LABEL[exam]}ガイド一覧 | n-ie-qclab</title>
        <meta name="description" content={EXAM_DESCRIPTION[exam]} />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-sm text-gray-500">
          <Link href="/" className="underline">トップ</Link> / <Link href="/guides" className="underline">ガイド</Link> / {EXAM_LABEL[exam]}
        </div>

        <section className={`mt-4 rounded-2xl border bg-white p-6 ${t.border}`}>
          <div className={`h-1 w-24 rounded-full ${t.accent}`} />
          <h1 className={`mt-4 text-2xl font-extrabold md:text-3xl ${t.title}`}>{EXAM_LABEL[exam]}ガイド一覧</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-700">
            {EXAM_DESCRIPTION[exam]} ここでは個別テーマを学ぶページを主表示にし、ロードマップや演習ツールは補助枠に分けています。
          </p>
        </section>

        {exam === "stat" ? <StatLearningPath /> : null}

        <section className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">Theme guides</p>
              <h2 className="text-2xl font-bold text-slate-900">個別テーマガイド</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">用語、手法、考え方を1テーマずつ学ぶコンテンツです。</p>
            </div>
            <span className="text-sm text-slate-500">{themeGuides.length}件</span>
          </div>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themeGuides.map(({ g, href, tags, updatedYmd, title, description, section }) => (
            <article key={g._id} className={`rounded-2xl border bg-white shadow-sm ${t.border}`}>
              <div className={`h-1 w-full rounded-t-2xl ${t.accent}`} />
              <div className="p-5">
                <h2 className="text-lg font-bold leading-snug">
                  <Link href={href} className={`${t.title} hover:underline`}>{title}</Link>
                </h2>

                {(section || tags.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {section && (
                      <span className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}>
                        {section}
                      </span>
                    )}
                    {tags.map((tag) => (
                      <span key={tag} className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {description && <p className="mt-3 line-clamp-3 text-sm text-gray-700">{description}</p>}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500" suppressHydrationWarning>
                    {updatedYmd ? `更新: ${updatedYmd}` : ""}
                  </span>
                  <Link href={href} className={`inline-block rounded-full ${t.btn} ${t.btnHover} px-3 py-1.5 text-sm font-semibold text-white`}>
                    開く
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {themeGuides.length === 0 && <p className="mt-6 text-gray-500">公開中の個別テーマガイドはまだありません。</p>}

        {(learningRoutes.length > 0 || tools.length > 0 || duplicateCandidates.length > 0) && (
          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <AuxiliaryLinks title="学習方針" description="学ぶ順番や全体像を確認するページです。" items={learningRoutes} themeLink={t.title} />
            <AuxiliaryLinks title="演習・ツール" description="入力、選択、可視化で理解する教材です。" items={tools} themeLink={t.title} />
            <AuxiliaryLinks title="重複/統合候補" description="今回は削除せず、後で名称や統合方針を整理します。" items={duplicateCandidates} themeLink={t.title} />
          </section>
        )}
      </main>
    </>
  );
}

function AuxiliaryLinks({ title, description, items, themeLink }: { title: string; description: string; items: Card[]; themeLink: string }) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <p className="mt-4 text-sm text-slate-500">該当ページはまだありません。</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border border-slate-200 p-4 hover:border-slate-400">
            <span className="text-xs font-semibold text-slate-500">{classificationLabels[item.classification]}</span>
            <span className={`mt-1 block text-sm font-bold ${themeLink}`}>{item.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function StatLearningPath() {
  return (
    <section className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-700">おすすめ学習順</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">データを読む力から、検定・回帰・品質改善へ進む</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">
            データサイエンティスト検定、統計検定、QC検定、技術士答案に共通する統計の土台を、迷わず進める順番に並べています。
          </p>
        </div>
        <Link href="/guides/stat/data-science-stat-roadmap" className="text-sm font-semibold text-sky-800 underline">
          ロードマップを見る
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {statLearningSteps.map((step, index) => (
          <Link key={step.href} href={step.href} className="rounded-xl border border-sky-100 bg-white p-4 hover:border-sky-400">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-sky-700">STEP {index + 1}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{step.status}</span>
            </div>
            <h3 className="mt-2 font-bold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
