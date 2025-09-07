---
title: "（タイトル）"
description: "（概要）"
tags: ["タグ1", "タグ2"]
exam: "qc"          # ← ディレクトリと一致させる（例：content/guides/qc/）
slug: "（スラッグ）" # ← ファイル名と一致（拡張子除く）
status: "draft"     # published / draft
---

<!--
  ▼ このテンプレートは「純Markdown＋KaTeX＋最小限の生HTML」用です。
  - import や JSX（<Component />）は使いません（表示崩れ防止）。
  - 数式は $...$ / $$...$$（KaTeX）で書けます。
  - 理解度チェックは <details> を使ったノーJS共通UIを使用します。
  - 動的教材（チャート等）が必要なら、/guides/tools/... へのリンク or iframe を使います。
-->

# （タイトル）

（導入文）  
工程の安定性は通常、中心線から $ \pm 3\sigma $ の範囲で評価します。

---

## インタラクティブ教材（必要な場合のみ）

[インタラクティブ管理図（React版）を開く](/guides/tools/control-charts)

<!-- 直接埋め込みたい場合は以下を使用（不要なら削除） -->
<!--
<iframe
  src="/guides/tools/control-charts"
  title="インタラクティブ管理図"
  loading="lazy"
  style="width:100%;height:340px;border:1px solid #e5e7eb;border-radius:12px;margin:12px 0;"
></iframe>
-->

---

## 用語集（例）

- **管理限界（UCL/LCL）**：中心線から $ \pm 3\sigma $ に設定される統計的な限界。
- **管理外れ**：点が限界外、または限界内でも異常パターン（連続上昇など）を示す状態。

---

## 理解度チェック

<div class="qa-card">
  <p class="qa-q">Q1: 管理限界線の外に出た点は正常？異常？理由も一言で。</p>
  <details class="qa-a">
    <summary>答えを見る</summary>
    <div>異常。統計的に稀な変動（特殊原因）の疑いがあるため、原因究明が必要。</div>
  </details>
</div>

<div class="qa-card">
  <p class="qa-q">Q2: 検査数が日で変動する場合、np管理図とp管理図のどちらが適切？</p>
  <details class="qa-a">
    <summary>答えを見る</summary>
    <div>p管理図（不適合率）。母数（検査数）の変動を取り込める。</div>
  </details>
</div>

---

## 参考式（KaTeX）

インライン例：$ \bar{x} \pm 3 \frac{R\_\\text{bar}}{d\_2} $

ブロック例：
$$
\sigma = \sqrt{\frac{\sum (x - \bar{x})^2}{n - 1}}
$$
