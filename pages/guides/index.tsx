import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import * as CL from "contentlayer/generated";

type GuideItem = {
  title: string;
  description: string;
  href: string;
  exam: "qc" | "stat" | "engineer";
  tags: string[];
};

const EXAMS = [
  {
    key: "qc",
    title: "品質管理",
    lead: "現場のばらつきを見つけ、標準化と改善につなげるための入口。",
    order: ["daily-management", "qc-seven-tools", "new-qc-seven-tools", "oc-curve", "reliability", "stat-tests", "stat-methods", "regression-anova"],
  },
  {
    key: "stat",
    title: "統計",
    lead: "データから判断するための考え方を、検定・回帰・可視化で学ぶ入口。",
    order: ["simple-linear-regression", "chi-square", "xxx"],
  },
  {
    key: "engineer",
    title: "技術士",
    lead: "IE、生産管理、保全の知識を、論文構成と実務理解につなげる入口。",
    order: ["psi-management", "production-modes", "maintenance-generations", "xxx"],
  },
] as const;

const collectDocs = (): any[] => {
  const arrays = Object.values(CL).filter(
    (v: unknown) => Array.isArray(v) && v.length > 0 && typeof (v as any)[0] === "object" && (v as any)[0]?._raw
  ) as any[][];
  return arrays.flat();
};

const normalizeExam = (value: string): GuideItem["exam"] => {
  if (value === "stat" || value === "engineer") return value;
  return "qc";
};

export const getStaticProps: GetStaticProps<{ guides: GuideItem[] }> = async () => {
  const guides = collectDocs()
    .filter((doc: any) => doc?._raw?.flattenedPath?.startsWith?.("guides/"))
    .filter((doc: any) => (doc?.status ?? "published") !== "draft")
    .filter((doc: any) => !String(doc?._raw?.flattenedPath ?? "").endsWith("/xxx"))
    .map((doc: any) => {
      const pathParts = String(doc?._raw?.flattenedPath ?? "").split("/");
      const pathExam = pathParts[1] ?? "qc";
      const slug = String(doc?.slug ?? pathParts[pathParts.length - 1] ?? "");
      const exam = normalizeExam(String(doc?.exam ?? pathExam));
      return {
        title: String(doc?.title ?? slug),
        description: String(doc?.description ?? ""),
        href: String(doc?.url ?? `/guides/${exam}/${slug}`),
        exam,
        tags: Array.isArray(doc?.tags) ? doc.tags : [],
      };
    });

  return { props: { guides } };
};

export default function GuidesIndexPage({ guides }: InferGetStaticPropsType<typeof getStaticProps>) {
  const grouped = EXAMS.map((exam) => {
    const items = guides
      .filter((guide) => guide.exam === exam.key)
      .sort((a, b) => {
        const aSlug = a.href.split("/").pop() ?? "";
        const bSlug = b.href.split("/").pop() ?? "";
        const order = exam.order as readonly string[];
        const ai = order.indexOf(aSlug);
        const bi = order.indexOf(bSlug);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
    return { ...exam, items };
  });

  return (
    <>
      <Head>
        <title>ガイド | QC × IE LABO</title>
        <meta name="description" content="品質管理・統計・技術士を初学者向けに整理した学習ガイド一覧" />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">GUIDES</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">学習ガイド</h1>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">
              初学者が迷わず進めるように、品質管理・統計・技術士を「何を判断できるようになるか」で整理しました。
              キーワードガイドは、試験前に優先して押さえたいものから公開しています。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {grouped.map((group) => (
              <a key={group.key} href={`#${group.key}`} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold uppercase text-teal-700">{group.key}</div>
                <h2 className="mt-2 text-xl font-bold">{group.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{group.lead}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-8 px-4 pb-14">
          {grouped.map((group) => (
            <section key={group.key} id={group.key} className="scroll-mt-8">
              <div className="mb-4 flex flex-col gap-1 border-b border-slate-200 pb-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-teal-700">{group.key.toUpperCase()}</p>
                  <h2 className="text-2xl font-bold">{group.title}</h2>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">{group.lead}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.items.slice(0, 6).map((guide, index) => (
                  <Link key={guide.href} href={guide.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                        STEP {index + 1}
                      </span>
                      {guide.tags[0] ? <span className="text-xs text-slate-500">{guide.tags[0]}</span> : null}
                    </div>
                    <h3 className="mt-3 font-bold leading-6">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description || "学習の要点を整理したガイドです。"}</p>
                  </Link>
                ))}
              </div>

              {group.items.length > 6 ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="font-bold">公開中のキーワードガイド</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.slice(6).map((guide) => (
                      <Link key={guide.href} href={guide.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                        {guide.title.replace("スタディガイド", "")}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ))}
        </section>
      </main>
    </>
  );
}
