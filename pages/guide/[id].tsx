// pages/guide/[id].tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { GUIDES } from "@/components/learn/Guides";

export default function GuidePage() {
  const router = useRouter();
  const { id } = router.query;

  const guide = GUIDES.find((g) => g.id === id);

  if (!guide) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-4">
        <p className="text-gray-600">指定されたガイドは見つかりませんでした。</p>
        <Link href="/learn" className="text-brand-700 hover:underline">← 学習コンテンツ一覧へ</Link>
      </main>
    );
  }

  const Cmp = guide.component;
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-900">{guide.title}</h1>
        <Link href="/learn" className="text-brand-700 hover:underline">一覧へ戻る</Link>
      </div>
      <Cmp />
    </main>
  );
}
