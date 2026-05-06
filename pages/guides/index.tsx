import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import * as CL from "contentlayer/generated";

type ExamKey = "qc" | "stat" | "engineer";
type GuideStatus = "published" | "draft" | "planned" | "needs-review" | "wip";

type GuideDoc = {
  title?: string;
  description?: string;
  href: string;
  exam: ExamKey;
  slug: string;
  tags: string[];
  status: GuideStatus;
};

type SitemapItem = {
  title: string;
  href: string;
  description: string;
};

type SitemapSection = {
  title: string;
  lead: string;
  key: string;
  items: SitemapItem[];
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

const sitemapSections: SitemapSection[] = [
  {
    key: "engineer",
    title: "経営工学・技術士",
    lead: "第一次試験から第二次試験、課題抽出、答案骨子、過去問傾向までを整理します。",
    items: [
      { title: "経営工学 学習マップ", href: "/guides/engineer/learning-map", description: "品質管理・統計・生産管理・技術士演習をつなげる入口" },
      { title: "技術士第一次試験ロードマップ", href: "/guides/engineer/first-exam-roadmap", description: "基礎科目・適性科目・専門科目を二次試験へ接続" },
      { title: "技術士第二次試験 過去問トレンドマップ", href: "/guides/engineer/past-exam-trend-map", description: "過去問を年度・科目・テーマ・設問パターンで整理" },
      { title: "課題分解マトリクス", href: "/guides/engineer/issue-decomposition-matrix", description: "多面的な課題抽出と最重要課題の選定を練習" },
      { title: "答案骨子ビルダー", href: "/guides/engineer/answer-structure-builder", description: "課題、解決策、リスク、倫理を答案構造へ整理" },
      { title: "必須Ⅰ型 例題生成MVP", href: "/guides/engineer/past-exam-trend-map", description: "過去問メタデータからオリジナル例題へ接続" },
      { title: "白書・法令アップデートボード", href: "/guides/engineer/whitepaper-update-board", description: "白書・法令・政策情報を答案背景へ接続" },
    ],
  },
  {
    key: "qc",
    title: "品質管理・QMS",
    lead: "QC検定、工程管理、抜取検査、QMS改善、品質保証の学習入口です。",
    items: [
      { title: "OC曲線", href: "/guides/qc/oc-curve", description: "抜取検査の判定特性を理解する" },
      { title: "管理図", href: "/guides/qc/control-chart-basic", description: "工程の安定性を監視する" },
      { title: "工程能力", href: "/guides/qc/process-capability", description: "Cp・Cpkで規格に対する余裕を見る" },
      { title: "QC七つ道具", href: "/guides/qc/qc-seven-tools", description: "現場データを整理する基本手法" },
      { title: "QMS改善", href: "/guides/qc/qms-improvement", description: "品質マネジメントを改善活動へつなげる" },
      { title: "内部監査", href: "/guides/qc/internal-audit", description: "監査を形骸化させず改善につなげる" },
      { title: "是正処置", href: "/guides/qc/corrective-action", description: "再発防止とQMS改善へつなげる" },
    ],
  },
  {
    key: "stat",
    title: "統計・データ分析",
    lead: "データの読み方から、推定・検定・回帰・品質データ分析へ進みます。",
    items: [
      { title: "統計ロードマップ", href: "/guides/stat/data-science-stat-roadmap", description: "統計学習・DS検定・品質管理をつなぐ全体像" },
      { title: "推定・検定", href: "/guides/stat/hypothesis-testing", description: "差や効果を判断するための基本" },
      { title: "χ二乗検定", href: "/guides/stat/chi-square", description: "カテゴリデータの関係を見る" },
      { title: "回帰分析", href: "/guides/stat/simple-linear-regression", description: "関係性と予測を扱う" },
      { title: "分散分析", href: "/guides/stat/anova", description: "複数群の差を比較する" },
      { title: "信頼区間", href: "/guides/stat/confidence-interval", description: "推定値の不確かさを扱う" },
      { title: "データサイエンティスト検定", href: "/guides/stat/data-science-stat-roadmap", description: "統計・AI・データ活用の入口" },
    ],
  },
  {
    key: "operations",
    title: "生産管理・オペレーション",
    lead: "経営工学の実務テーマを、生産性・在庫・物流・全体最適へ接続します。",
    items: [
      { title: "生産管理", href: "/guides/engineer/production-planning", description: "計画、統制、改善の基本" },
      { title: "在庫管理", href: "/guides/engineer/inventory-management", description: "安全在庫、EOQ、欠品・過剰在庫を扱う" },
      { title: "ラインバランシング", href: "/guides/engineer/line-balancing", description: "工程負荷の平準化と生産性改善" },
      { title: "TOC", href: "/guides/engineer/toc", description: "制約条件に着目した全体最適" },
      { title: "物流管理", href: "/guides/engineer/logistics", description: "物流効率化とサプライチェーン改善" },
      { title: "需要予測", href: "/guides/engineer/demand-forecasting", description: "計画の前提となる需要を見積もる" },
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
      return raw?._raw?.flattenedPath?.startsWith?.("guides/");
    })
    .filter((doc) => {
      const raw = doc as { _raw?: { flattenedPath?: string } };
      return !String(raw?._raw?.flattenedPath ?? "").endsWith("/xxx");
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
      const pathParts = String(raw?._raw?.flattenedPath ?? "").split("/");
      const pathExam = pathParts[1] ?? "qc";
      const slug = String(raw.slug ?? pathParts[pathParts.length - 1] ?? "");
      const exam = normalizeExam(String(raw.exam ?? pathExam));
      const status = normalizeStatus(raw.status);
      return {
        title: String(raw.title ?? slug),
        description: String(raw.description ?? ""),
        href: String(raw.url ?? `/guides/${exam}/${slug}`),
        exam,
        slug,
        status,
        tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag)) : [],
      };
    });

  return { props: { guides }, revalidate: 1800 };
};

export default function GuidesIndexPage({ guides }: InferGetStaticPropsType<typeof getStaticProps>) {
  const guideMap = new Map(guides.map((guide) => [guide.href, guide]));

  return (
    <>
      <Head>
        <title>サイトマップ・ガイド一覧 | n-ie-qclab</title>
        <meta name="description" content="経営工学、品質管理、統計、生産管理の主要ガイドと準備中ページを整理したサイトマップです。" />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">GUIDES</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">サイトマップ・ガイド一覧</h1>
            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              経営工学・技術士、品質管理・QMS、統計・データ分析、生産管理・オペレーションの主要ページを整理しています。
              公開済みページはリンク、未整備のページは準備中として表示します。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-4">
            {sitemapSections.map((section) => (
              <a key={section.key} href={`#${section.key}`} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold uppercase text-teal-700">{section.key}</div>
                <h2 className="mt-2 text-xl font-bold">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{section.lead}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-8 px-4 pb-14">
          {sitemapSections.map((section) => (
            <section key={section.key} id={section.key} className="scroll-mt-28">
              <div className="mb-4 border-b border-slate-200 pb-3">
                <p className="text-sm font-semibold text-teal-700">{section.key.toUpperCase()}</p>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{section.lead}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => {
                  const guide = guideMap.get(item.href);
                  const status = guide?.status ?? "planned";
                  const isLinked = status === "published" && !!guide;

                  return <SitemapCard key={item.href} item={item} status={status} isLinked={isLinked} />;
                })}
              </div>
            </section>
          ))}
        </section>
      </main>
    </>
  );
}

function SitemapCard({ item, status, isLinked }: { item: SitemapItem; status: GuideStatus; isLinked: boolean }) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={status} />
      </div>
      <h3 className="mt-3 font-bold leading-6">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
    </>
  );

  if (!isLinked) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 opacity-90">{content}</div>;
  }

  return (
    <Link href={item.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
      {content}
    </Link>
  );
}

function StatusBadge({ status }: { status: GuideStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
