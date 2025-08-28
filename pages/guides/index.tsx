// pages/guides/index.tsx
import Link from "next/link";
import type { GetStaticProps } from "next";
import { allGuides } from "contentlayer/generated";

export const getStaticProps: GetStaticProps = async () => ({ props: {}, revalidate: 60 });

export default function GuidesHome() {
  const count = (exam: string) =>
    allGuides.filter(g => g.status !== "draft" && g.exam === exam).length;

  const cards = [
    { exam: "qc",       title: "品質管理", href: "/guides/qc",       desc: "QC七つ道具 / 新QC七つ道具 / 管理図 / OC曲線 など" },
    { exam: "stat",     title: "統計",     href: "/guides/stat",     desc: "t / Z / F / χ² / ANOVA / 回帰 など" },
    { exam: "engineer", title: "技術士",   href: "/guides/engineer", desc: "学習ロードマップや要点整理、事例解説" },
  ];

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">ガイド</h1>
      <p className="text-gray-600">カテゴリを選んで学習を始めましょう。</p>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(c => (
          <Link key={c.exam} href={c.href} className="block rounded-lg border p-5 hover:shadow">
            <h2 className="font-semibold">{c.title}</h2>
            <div className="text-sm text-gray-500 mt-1">{count(c.exam)} 本</div>
            <p className="text-sm mt-2 text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
