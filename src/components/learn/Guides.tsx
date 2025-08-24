// src/components/learn/Guides.tsx
import React from "react";
import Link from "next/link";

export const GUIDES = [
  {
    id: "regression-anova",
    title: "回帰分析と分散分析",
    description: "QC検定2級・統計検定で頻出。改善テーマの解析に役立ちます。",
  },
  {
    id: "stat-tests",
    title: "統計的検定の基礎",
    description: "t検定・χ二乗検定など、品質管理の基本手法を体系的に学びます。",
  },
];

export const GuidesList: React.FC = () => {
  return (
    <div className="space-y-4">
      {GUIDES.map((guide) => (
        <div
          key={guide.id}
          className="p-4 border rounded-xl bg-white/80 shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">{guide.title}</h2>
          <p className="text-gray-600 mb-2">{guide.description}</p>
          <Link
            href={`/guide/${guide.id}`}
            className="text-emerald-700 hover:underline font-medium"
          >
            学習する →
          </Link>
        </div>
      ))}
    </div>
  );
};
