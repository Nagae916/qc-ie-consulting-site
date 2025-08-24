import Link from "next/link";
import { useRouter } from "next/router";
import { GUIDES } from "@/components/learn/Guides";

export default function GuidePage() {
  const router = useRouter();
  const { id } = router.query;

  const guide = GUIDES.find((g) => g.id === id);

  if (!guide) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">ガイドが見つかりませんでした。</p>
        <Link href="/learn" className="text-brand-700 hover:underline">
          ← 学習コンテンツに戻る
        </Link>
      </div>
    );
  }

  const Component = guide.component;
  return (
    <div className="space-y-6">
      <Link href="/learn" className="text-brand-700 hover:underline">
        ← 学習コンテンツに戻る
      </Link>
      <h1 className="text-2xl font-bold text-brand-900">{guide.title}</h1>
      <Component />
    </div>
  );
}
