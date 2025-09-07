---
title: "（タイトル）"
description: "（概要）"
tags: ["タグ1", "タグ2"]
exam: "qc"          # ← ディレクトリと一致（例：content/guides/qc/）
slug: "（スラッグ）" # ← ファイル名と一致（拡張子除く）
status: "draft"     # published / draft
---

<!--
  ▼ MDXテンプレ（運用ルールを一本化）
  - 使ってよいのは「許可済みReactコンポーネント」とMarkdown＋KaTeXのみ。
  - importは不要：<Quiz/> / <ControlChart/> はレンダラ側で注入済み。
  - 生の<script>や外部CDN読み込み、未許可コンポーネントは使わない。
  - KaTeXは $...$ / $$...$$ で記述（インライン/ブロック）。
-->

# （タイトル）

（導入文）  
工程の安定性は通常、中心線から $ \pm 3\sigma $ の範囲で評価します。

---

## インタラクティブ（必要な場合のみ）

{/* 例1：データを直指定（X̄） */}
<ControlChart
  title="X̄ 管理図"
  type="x"
  data={[10.1,10.2,9.9,10.3,9.8,10.0,10.4,10.1,9.9,10.2]}
  subgroupSizeForX={5}
  yLabel="X値"
/>

{/* 例2：外部JSONから読み込み（p図） */}
<ControlChart
  title="p 管理図"
  type="p"
  src="/data/control-charts.json"   # /public/data/control-charts.json を想定
  yLabel="不適合率 (p)"
/>

<!--
  /public/data/control-charts.json の例
  {
    "p": { "p":[0.08,0.10,0.07,0.11,0.09], "n":[100,110,95,120,105] }
  }
-->

---

## 用語集（例）

- **管理限界（UCL/LCL）**：中心線から $ \pm 3\sigma $ に設定される統計的限界。
- **管理外れ**：点が限界外、または限界内でも異常パターン（連続上昇など）を示す状態。

---

## 理解度チェック

<Quiz
  items={[
    {
      q: "管理限界線の外に出た点は正常？異常？理由も一言で。",
      a: <>異常。統計的に稀な変動（特殊原因）の疑いがあるため、原因究明が必要。</>,
    },
    {
      q: "検査数が日で変動する場合、np管理図とp管理図のどちらが適切？",
      a: <>p管理図（不適合率）。母数（検査数）の変動を取り込める。</>,
    },
    {
      q: "X̄–R管理図の中心線と管理限界は？（概念）",
      a: <>中心線は工程平均 $\bar{x}$。管理限界は概ね $\bar{x} \pm A_2 \cdot \bar{R}$（サブグループサイズ依存）。</>,
    },
  ]}
/>

---

## 参考式（KaTeX）

インライン例：$ \bar{x} \pm 3 \dfrac{R_{\text{bar}}}{d_2} $

ブロック例：
$$
\sigma = \sqrt{\frac{\sum (x - \bar{x})^2}{\,n - 1\,}}
$$
