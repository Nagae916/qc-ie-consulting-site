import Link from "next/link";
import { GUIDES, getGuideById } from "@/components/learn/Guides";

export async function getStaticPaths() {
  return {
    paths: GUIDES.map((g) => ({ params: { id: g.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const guide = getGuideById(params.id);
  return { props: { id: params.id, exists: !!guide } };
}

export default function GuidePage({ id, exists }: { id: string; exists: boolean }) {
  const guide = getGuideById(id);
  if (!exists || !guide) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-700">指定されたガイドは見つかりませんでした。</p>
        <Link href="/learn" className="text-brand-800 hover:underline">← 学習コンテンツ一覧へ</Link>
      </main>
    );
  }
  const Cmp = guide.component;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-900">{guide.title}</h1>
        <Link href="/learn" className="text-brand-800 hover:underline">一覧へ戻る</Link>
      </div>
      <Cmp />
    </main>
  );
}
