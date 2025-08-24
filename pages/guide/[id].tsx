// pages/guide/[id].tsx
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";

import { GUIDES } from "@/components/learn/Guides";
import {
  StudyGuide_RegressionAnova,
  StudyGuide_StatTests,
} from "@/components/learn/StudyGuide";

// id -> 表示コンポーネントの対応表
const GUIDE_COMPONENTS: Record<string, () => JSX.Element> = {
  "regression-anova": StudyGuide_RegressionAnova,
  "stat-tests": StudyGuide_StatTests,
};

type Props = {
  id: string | null;
};

const GuidePage: NextPage<Props> = ({ id }) => {
  const Comp = id ? GUIDE_COMPONENTS[id] : undefined;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/learn"
          className="text-sm text-emerald-700 hover:underline"
        >
          ← 学習コンテンツ一覧へ
        </Link>
      </div>

      {Comp ? (
        <Comp />
      ) : (
        <div className="rounded-2xl bg-white/70 shadow p-8">
          <h1 className="text-xl font-semibold mb-2">ガイドが見つかりませんでした</h1>
          <p className="text-gray-600">
            URL が間違っているか、まだページが用意されていません。
          </p>
        </div>
      )}
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // GUIDES は components/learn/Guides.tsx 側で export されている配列を想定
  // 例: [{ id: 'regression-anova', title: '…' }, { id: 'stat-tests', title: '…' }]
  const ids = (GUIDES as any[])
    .map((g: any) => g?.id)
    .filter(Boolean) as string[];

  const paths = ids.map((id) => ({ params: { id } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const id = (ctx.params?.id as string) ?? null;
  return {
    props: { id },
    // ガイド更新の反映を早めるなら適宜短く。ここでは 60秒
    revalidate: 60,
  };
};

export default GuidePage;
