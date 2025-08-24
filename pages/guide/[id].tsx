// pages/guide/[id].tsx
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";

import { GUIDES } from "@/components/learn/Guides";
import {
  StudyGuide_RegressionAnova,
  StudyGuide_StatTests,
  StudyGuide_QC7Tools,
  StudyGuide_NewQC7Tools,
} from "@/components/learn/StudyGuide";

const GUIDE_COMPONENTS: Record<string, () => JSX.Element> = {
  "regression-anova": StudyGuide_RegressionAnova,
  "stat-tests": StudyGuide_StatTests,
  "qc7-tools": StudyGuide_QC7Tools,
  "new-qc7-tools": StudyGuide_NewQC7Tools,
};

type Props = { id: string | null };

const GuidePage: NextPage<Props> = ({ id }) => {
  const Comp = id ? GUIDE_COMPONENTS[id] : undefined;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/learn" className="text-sm text-emerald-700 hover:underline">
          ← 学習コンテンツ一覧へ
        </Link>
      </div>

      {Comp ? (
        <Comp />
      ) : (
        <div className="rounded-2xl bg-white/70 shadow p-8">
          <h1 className="text-xl font-semibold mb-2">ガイドが見つかりませんでした</h1>
          <p className="text-gray-600">URL が間違っているか、まだページが用意されていません。</p>
        </div>
      )}
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = GUIDES.map((g) => g.id);
  return { paths: ids.map((id) => ({ params: { id } })), fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const id = (ctx.params?.id as string) ?? null;
  return { props: { id }, revalidate: 60 };
};

export default GuidePage;
