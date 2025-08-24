// src/components/learn/Guides.tsx
import React from "react";
import Link from "next/link";

// 学習ガイド一覧の定義
export const GUIDES = [
  {
    id: "regression-anova",
    title: "回帰分析と分散分析",
    description: "統計的手法の基礎から応用までを学びます。",
  },
  {
    id: "stat-tests",
    title: "統計的検定の基礎",
    description: "t検定・χ二乗検定など、よく使う検定方法を整理します。",
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
            className="text-emerald-700 hover:underline"
          >
            詳しく見る →
          </Link>
        </div>
      ))}
    </div>
  );
};
