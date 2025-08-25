// pages/guides/qc/index.tsx
import Link from "next/link";
import type { GetStaticProps } from "next";
import { allGuides } from "contentlayer/generated";

export const getStaticProps: GetStaticProps = async () => ({ props: {}, revalidate: 60 });

export default function QCIndex() {
  const guides = allGuides
    .filter(g => g.status !== "draft")
    .sort(
      (a, b) =>
        (a.section ?? "").localeCompare(b.section ?? "") ||
        (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
    );

  const bySection = new Map<string, typeof guides>();
  for (const g of guides) {
    const sec = g.section ?? "はじめに";
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec)!.push(g);
  }

  return (
    <section className="space-y-6">
      <div className="text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link> / QC検定
      </div>

      <h1 className="text-2xl font-semibold">QC検定ガイド</h1>
      <p className="text-gray-700">
        中学生にもわかるように、むずかしい言葉はできるだけ使わずに、<br />
        絵や具体例で少しずつ進めます。最初は「道具の名前」を覚えるところから。
      </p>

      {[...bySection.entries()].map(([sec, items]) => (
        <div key={sec} className="space-y-2">
          <h2 className="text-lg font-semibold">{sec}</h2>
          <ul className="divide-y rounded-lg border">
            {items.map(g => (
              <li key={g.slug} className="p-3">
              <Link href={g.url} className="font-medium hover:underline">{g.title}</Link>
              <div className="text-sm text-gray-500">v{g.version} ・ 更新日 {g.updatedAt}</div>
              {g.tags?.length ? <div className="mt-1 text-xs text-gray-500">#{g.tags.join(" #")}</div> : null}
            </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
