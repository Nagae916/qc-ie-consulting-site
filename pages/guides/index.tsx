// pages/guides/index.tsx
import Link from "next/link";
import type { GetStaticProps } from "next";
import { allGuides } from "contentlayer/generated"; // ← 修正済み

export const getStaticProps: GetStaticProps = async () => ({ props: {}, revalidate: 60 });

export default function GuidesHome() {
  const qcCount = allGuides.filter(g => g.status !== "draft" && g.exam === "qc").length;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">ガイド</h1>
      <p className="text-gray-600">まずは QC検定ガイドから始めましょう。</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/guides/qc" className="block rounded-lg border p-5 hover:shadow">
          <h2 className="font-semibold">QC検定</h2>
          <div className="text-sm text-gray-500 mt-1">{qcCount} 本</div>
          <p className="text-sm mt-2 text-gray-600">はじめての人でも少しずつ進められます。</p>
        </Link>
      </div>
    </section>
  );
}
