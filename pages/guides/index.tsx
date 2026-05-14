import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import * as CL from "contentlayer/generated";
import { classifyContent, classificationLabels, type ContentClassification } from "@/lib/content-classification";

type ExamKey = "qc" | "stat" | "engineer";
type GuideStatus = "published" | "draft" | "planned" | "needs-review" | "wip";

type GuideDoc = {
  title: string;
  description: string;
  href: string;
  exam: ExamKey;
  slug: string;
  tags: string[];
  status: GuideStatus;
  classification: ContentClassification;
};

type SitemapItem = {
  title: string;
  href?: string;
  description?: string;
};

type SitemapSection = {
  title: string;
  description: string;
  items: SitemapItem[];
};

const examLabels: Record<ExamKey, string> = {
  qc: "QC・品質管理",
  stat: "統計",
  engineer: "技術士・経営工学",
};

const examDescriptions: Record<ExamKey, string> = {
  qc: "品質保証、品質改善、QMS、QC検定、管理図、工程能力、実験計画法などを、経営工学における品質改善・品質保証の実践領域として学ぶ入口です。",
  stat: "記述統計、確率分布、推定、検定、回帰分析、分散分析などを、経営工学の意思決定・品質管理・生産管理を支える数理基盤として学ぶ入口です。",
  engineer: "過去問分析、設問形式、経営工学キーワード、答案骨子、白書背景を通じて、経営工学の知識を技術士答案に展開する入口です。",
};

const productionPillar = {
  title: "生産管理",
  href: "/guides/engineer/keyword-themes",
  description:
    "生産計画、工程管理、在庫管理、IE、リードタイム短縮、設備効率、SCMなどを、経営工学における中核的な実務領域として学ぶ入口です。現在コンテンツを拡充予定です。",
};

const statusLabels: Record<GuideStatus, string> = {
  published: "公開済み",
  draft: "下書き",
  planned: "準備中",
  "needs-review": "要レビュー",
  wip: "作成中",
};

const statusClasses: Record<GuideStatus, string> = {
  published: "bg-emerald-50 text-emerald-800 border-emerald-200",
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  planned: "bg-amber-50 text-amber-800 border-amber-200",
  "needs-review": "bg-rose-50 text-rose-800 border-rose-200",
  wip: "bg-sky-50 text-sky-800 border-sky-200",
};

const referenceItems = [
  {
    title: "白書・法令・一次情報",
    description: "ものづくり、物流、DX、標準化、取引適正化などの一次情報を確認する入口です。",
    href: "/references",
  },
  {
    title: "技術士 経営工学 過去問データ",
    description: "年度、テーマ、設問パターンを整理し、演習や答案構成へ接続します。",
    href: "/guides/engineer/past-exam-trend-map",
  },
];

const sitemapSections: SitemapSection[] = [
  {
    title: "経営工学・技術士",
    description: "一次試験の入口から、二次試験の傾向分析・課題分解・答案作成までの主要ページです。",
    items: [
      { title: "経営工学 学習マップ", href: "/guides/engineer/learning-map" },
      { title: "技術士第一次試験ロードマップ", href: "/guides/engineer/first-exam-roadmap" },
      { title: "技術士第二次試験ロードマップ", href: "/guides/engineer/second-exam-roadmap" },
      {
        title: "技術士第二次試験 過去問トレンドマップ",
        href: "/guides/engineer/past-exam-trend-map",
        description: "経営工学部門の過去問を、年度・科目・テーマ・設問パターンで整理し、答案骨子作成につなげるページです。",
      },
      { title: "課題分解マトリクス", href: "/guides/engineer/issue-decomposition-matrix" },
      { title: "答案骨子ビルダー", href: "/guides/engineer/answer-structure-builder" },
      { title: "必須Ⅰ型 例題生成MVP", href: "/guides/engineer/problem-matrix" },
      { title: "白書・法令アップデートボード", href: "/guides/engineer/white-paper-board" },
    ],
  },
  {
    title: "品質管理・QMS",
    description: "QC検定、品質改善、QMS運用で使う品質管理テーマです。",
    items: [
      { title: "品質管理・QMS 学習ロードマップ", href: "/guides/qc/learning-map" },
      { title: "OC曲線", href: "/guides/qc/oc-curve" },
      { title: "管理図", href: "/guides/stat/control-chart-basics" },
      { title: "工程能力", href: "/guides/stat/process-capability" },
      { title: "QC七つ道具", href: "/guides/qc/qc-seven-tools" },
      { title: "QMS改善", href: "/guides/engineer/qms-improvement" },
      { title: "内部監査", href: "/guides/engineer/internal-audit" },
      { title: "是正処置", href: "/guides/engineer/capa" },
    ],
  },
  {
    title: "統計・データ分析",
    description: "検定、回帰、分布、品質データ分析へつながる統計テーマです。",
    items: [
      { title: "統計・データ分析 学習ロードマップ", href: "/guides/stat/learning-map" },
      { title: "統計ロードマップ", href: "/guides/stat/data-science-stat-roadmap" },
      { title: "推定・検定", href: "/guides/stat/hypothesis-testing" },
      { title: "χ二乗検定", href: "/guides/stat/chi-square-test" },
      { title: "回帰分析", href: "/guides/stat/simple-linear-regression" },
      { title: "分散分析", href: "/guides/stat/anova" },
      { title: "信頼区間", href: "/guides/stat/confidence-interval" },
      { title: "データサイエンティスト検定", href: "/guides/stat/data-science-stat-roadmap" },
    ],
  },
  {
    title: "生産管理",
    description: "生産計画、工程管理、在庫管理、IE、設備効率、SCM、物流管理を扱う経営工学の中核領域です。今後、専用導線を拡充します。",
    items: [
      { title: "生産管理", href: "/guides/engineer/production-planning" },
      { title: "在庫管理", href: "/guides/engineer/inventory-management" },
      { title: "ラインバランシング", href: "/guides/engineer/line-balancing" },
      { title: "TOC", href: "/guides/engineer/toc" },
      { title: "物流管理", href: "/guides/engineer/logistics" },
      { title: "需要予測", href: "/guides/engineer/demand-forecasting" },
    ],
  },
];

const collectDocs = (): unknown[] => {
  const arrays = Object.values(CL).filter((value: unknown) => {
    if (!Array.isArray(value) || value.length === 0) return false;
    const first = value[0] as { _raw?: unknown } | undefined;
    return typeof first === "object" && !!first?._raw;
  }) as unknown[][];
  return arrays.flat();
};

const normalizeExam = (value: string): ExamKey => {
  if (value === "stat" || value === "engineer") return value;
  return "qc";
};

const normalizeStatus = (value: unknown): GuideStatus => {
  if (value === "draft" || value === "planned" || value === "needs-review" || value === "wip") return value;
  return "published";
};

export const getStaticProps: GetStaticProps<{ guides: GuideDoc[] }> = async () => {
  const guides = collectDocs()
    .filter((doc) => {
      const raw = doc as { _raw?: { flattenedPath?: string } };
      const path = String(raw?._raw?.flattenedPath ?? "");
      return path.startsWith("guides/") && !path.endsWith("/xxx");
    })
    .map((doc): GuideDoc => {
      const raw = doc as {
        title?: unknown;
        description?: unknown;
        url?: unknown;
        exam?: unknown;
        slug?: unknown;
        status?: unknown;
        tags?: unknown;
        _raw?: { flattenedPath?: string };
      };
      const flattenedPath = String(raw._raw?.flattenedPath ?? "");
      const pathParts = flattenedPath.split("/");
      const pathExam = pathParts[1] ?? "qc";
      const slug = String(raw.slug ?? pathParts[pathParts.length - 1] ?? "");
      const exam = normalizeExam(String(raw.exam ?? pathExam));
      const href = String(raw.url ?? `/guides/${exam}/${slug}`);

      return {
        title: String(raw.title ?? slug),
        description: String(raw.description ?? ""),
        href,
        exam,
        slug,
        status: normalizeStatus(raw.status),
        classification: classifyContent({ slug, path: flattenedPath, href }),
        tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag)) : [],
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ja"));

  return { props: { guides }, revalidate: 1800 };
};

export default function GuidesIndexPage({ guides }: InferGetStaticPropsType<typeof getStaticProps>) {
  const themeGuides = guides.filter((guide) => guide.classification === "guide");
  const themeGuidesByExam: Record<ExamKey, GuideDoc[]> = {
    qc: themeGuides.filter((guide) => guide.exam === "qc"),
    stat: themeGuides.filter((guide) => guide.exam === "stat"),
    engineer: themeGuides.filter((guide) => guide.exam === "engineer"),
  };
  const learningRoutes = guides.filter((guide) => guide.classification === "learning-route");
  const tools = guides.filter((guide) => guide.classification === "tool");
  const duplicateCandidates = guides.filter((guide) => guide.classification === "duplicate-candidate");
  const guideByHref = new Map(guides.map((guide) => [guide.href, guide]));

  return (
    <>
      <Head>
        <title>ガイド | n-ie-qclab</title>
        <meta name="description" content="QC、統計、技術士の個別テーマを学ぶガイド一覧です。ロードマップや演習ツールは別枠で整理しています。" />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">GUIDES</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">ガイド</h1>
            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              n-ie-qclab は、経営工学を中心に、QC・品質管理、統計・データ分析、技術士 経営工学部門、生産管理を学ぶサイトです。
              まず4本柱から入口を選び、下位ページで関連分野を横断します。
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-bold text-slate-900">経営工学を中心に学ぶ</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">品質、統計、生産管理、技術士答案を別々にせず、経営工学の実務知として接続します。</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-bold text-slate-900">4本柱で入口を分ける</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">QC・統計・技術士・生産管理を最初の階層で分け、必要な場面で横断します。</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-bold text-slate-900">学習順を迷わない</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">ロードマップ、個別テーマ、演習ツール、参考資料を役割別に整理します。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionHeader
            title="経営工学を4本柱で学ぶ"
            description="最初の入口では、QC・品質管理、統計・データ分析、技術士 経営工学部門、生産管理を混ぜずに分けています。横断リンクは下位ページで必要に応じて扱います。"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(["qc", "stat", "engineer"] as ExamKey[]).map((exam) => (
              <Link key={exam} href={`/guides/${exam}`} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold uppercase text-teal-700">{exam}</div>
                <h2 className="mt-2 text-xl font-bold">{examLabels[exam]}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{examDescriptions[exam]}</p>
              </Link>
            ))}
            <Link href={productionPillar.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
              <div className="text-xs font-semibold uppercase text-teal-700">production</div>
              <h2 className="mt-2 text-xl font-bold">{productionPillar.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{productionPillar.description}</p>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-10">
          <SectionHeader
            title="サイトマップ"
            description="主要ページを4本柱ごとに並べています。未作成のページはリンク化せず、準備中として表示します。"
          />
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {sitemapSections.map((section) => (
              <SitemapSectionCard key={section.title} section={section} guideByHref={guideByHref} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-10">
          <SectionHeader title="個別テーマガイド" description="QC・統計・技術士の各カテゴリで、用語、手法、考え方を1テーマずつ学ぶページです。生産管理は技術士・経営工学内の関連ページから順次拡充します。" count={themeGuides.length} />
          <div className="mt-5 grid gap-6">
            {(["qc", "stat", "engineer"] as ExamKey[]).map((exam) => (
              <div key={exam} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{examLabels[exam]}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{examDescriptions[exam]}</p>
                  </div>
                  <Link href={`/guides/${exam}`} className="text-sm font-semibold text-teal-700 underline">
                    一覧を見る
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {themeGuidesByExam[exam].slice(0, 9).map((guide) => (
                    <GuideCard key={guide.href} guide={guide} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
            <GroupedLinks title="学習方針" description="何をどの順で学ぶかを確認する入口です。" items={learningRoutes} />
            <GroupedLinks title="演習・ツール" description="入力、選択、可視化で理解する教材です。" items={tools} />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
          <div>
            <SectionHeader title="参考資料" description="白書、法令、過去問データ、参考リンクの入口です。" />
            <div className="mt-5 grid gap-3">
              {referenceItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <GroupedLinks title="重複/統合候補" description="今回は削除せず、名称や統合方針を後で整理する候補です。" items={duplicateCandidates} />
        </section>
      </main>
    </>
  );
}

function SectionHeader({ title, description, count }: { title: string; description: string; count?: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        {typeof count === "number" ? <span className="text-sm text-slate-500">{count}件</span> : null}
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function GroupedLinks({ title, description, items }: { title: string; description: string; items: GuideDoc[] }) {
  return (
    <section>
      <SectionHeader title={title} description={description} count={items.length} />
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <GuideCard key={item.href} guide={item} compact />
        ))}
      </div>
    </section>
  );
}

function GuideCard({ guide, compact = false }: { guide: GuideDoc; compact?: boolean }) {
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{classificationLabels[guide.classification]}</span>
        <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClasses[guide.status]}`}>{statusLabels[guide.status]}</span>
        <span className="text-xs text-slate-500">{examLabels[guide.exam]}</span>
      </div>
      <h3 className="mt-3 font-bold leading-6">{guide.title}</h3>
      {!compact && guide.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p> : null}
    </>
  );

  if (guide.status === "draft") {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-slate-600">
        {content}
      </div>
    );
  }

  return (
    <Link href={guide.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
      {content}
    </Link>
  );
}

function SitemapSectionCard({ section, guideByHref }: { section: SitemapSection; guideByHref: Map<string, GuideDoc> }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
      <div className="mt-5 grid gap-3">
        {section.items.map((item) => (
          <SitemapLink key={`${section.title}-${item.title}`} item={item} guide={item.href ? guideByHref.get(item.href) : undefined} />
        ))}
      </div>
    </section>
  );
}

function SitemapLink({ item, guide }: { item: SitemapItem; guide?: GuideDoc | undefined }) {
  const canOpen = !!guide && guide.status !== "draft";
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-slate-900">{item.title}</span>
        {guide ? (
          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClasses[guide.status]}`}>
            {statusLabels[guide.status]}
          </span>
        ) : (
          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClasses.planned}`}>準備中</span>
        )}
      </div>
      {item.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p> : null}
    </>
  );

  if (!item.href || !canOpen) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">{content}</div>;
  }

  return (
    <Link href={item.href ?? "/guides"} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-500 hover:shadow-sm">
      {content}
    </Link>
  );
}
