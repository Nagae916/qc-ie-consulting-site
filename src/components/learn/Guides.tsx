// src/components/learn/Guides.tsx
import React from "react";
import Link from "next/link";

export type Guide = { id: string; title: string; description: string; tags?: string[] };

export const GUIDES: Guide[] = [
  { id: "regression-anova", title: "回帰分析・分散分析", description: "関係のモデル化と平均差の検定。QC2級/統計検定頻出トピック。", tags: ["統計","QC","ANOVA","回帰"] },
  { id: "stat-tests",       title: "統計的検定の基礎（t / χ² / F）", description: "平均差・独立性・分散の比較。p値と有意水準の正しい解釈。", tags: ["検定","品質管理"] },
  { id: "qc7-tools",        title: "QC七つ道具（旧7つ道具）", description: "可視化と要因絞り込みに効く基本ツール。", tags: ["QC検定","見える化"] },
  { id: "new-qc7-tools",    title: "新QC七つ道具（新7つ道具）", description: "合意形成・計画立案に強い言語データ系技法。", tags: ["QC検定","計画立案"] },
];

export function GuidesList({ items = GUIDES }: { items?: Guide[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((g) => (
        <article key={g.id} className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-5">
          <h3 className="font-semibold text-brand-900">{g.title}</h3>
          <p className="text-sm text-gray-700 mt-2">{g.description}</p>
          {g.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {g.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded bg-brand-100/70 border border-brand-200">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-4">
            <Link href={`/guide/${g.id}`} className="text-brand-800 hover:underline">学習する →</Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Guides() { return <GuidesList />; }
