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

const examLabels: Record<ExamKey, string> = {
  qc: "QC・品質管理",
  stat: "統計",
  engineer: "技術士・経営工学",
};

const examDescriptions: Record<ExamKey, string> = {
  qc: "QC七つ道具、OC曲線、実験計画法、信頼性、QMS改善など、品質管理の個別テーマを学べます。",
  stat: "記述統計、データ型、検定、回帰、分布、機械学習評価など、データを読むためのテーマを学べます。",
  engineer: "生産管理、IE、在庫、物流、保全、プロジェクト管理など、経営工学のテーマを学べます。",
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
  const learningRoutes = guides.filter((guide) => guide.classification === "learning-route");
  const tools = guides.filter((guide) => guide.classification === "tool");
  const duplicateCandidates = guides.filter((guide) => guide.classification === "duplicate-candidate");

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
              このサイトでの「ガイド」は、個別テーマを学ぶ学習コンテンツです。
              ロードマップ、学習マップ、演習ツール、参考資料は別枠に分けて探せるようにしています。
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-bold text-slate-900">ガイド</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">用語や手法を1テーマずつ理解するページです。</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-bold text-slate-900">学習方針</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">何から学ぶか、どの順で進むかを決めるページです。</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-bold text-slate-900">演習・ツール</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">ガイドで学んだ考え方を操作して確認する教材です。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {(["qc", "stat", "engineer"] as ExamKey[]).map((exam) => (
              <Link key={exam} href={`/guides/${exam}`} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold uppercase text-teal-700">{exam}</div>
                <h2 className="mt-2 text-xl font-bold">{examLabels[exam]}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{examDescriptions[exam]}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-10">
          <SectionHeader title="個別テーマガイド" description="用語、手法、考え方を1テーマずつ学ぶページです。" count={themeGuides.length} />
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {themeGuides.map((guide) => (
              <GuideCard key={guide.href} guide={guide} />
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
  return (
    <Link href={guide.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{classificationLabels[guide.classification]}</span>
        <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClasses[guide.status]}`}>{statusLabels[guide.status]}</span>
        <span className="text-xs text-slate-500">{examLabels[guide.exam]}</span>
      </div>
      <h3 className="mt-3 font-bold leading-6">{guide.title}</h3>
      {!compact && guide.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p> : null}
    </Link>
  );
}
