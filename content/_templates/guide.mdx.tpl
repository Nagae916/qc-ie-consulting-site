---
title: "（タイトル）"
description: "（概要）"
tags: ["タグ1", "タグ2"]
# どの試験カテゴリか（必要に応じて変更）
#   - qc   : QC検定
#   - stat : 統計検定
#   - pe   : 技術士試験
exam: "qc"
# 公開状態（草稿なら draft / 公開なら published）
status: "draft"
---

/**
 * ▼ 使用時の注意
 * - このファイルはテンプレートです（このままではビルド対象にしない想定）。
 * - コピーした先の「ディレクトリの深さ」に応じて import パスを調整してください。
 *   例:
 *     content/guides/qc/slug.mdx     → '../../../src/components/...'
 *     content/guides/slug.mdx        → '../../src/components/...'
 * - MDX 本文で {title} を使う場合は、必ず下の `export const title` を定義してください。
 *   （frontmatter の title: だけでは本文スコープに入りません）
 */

export const title = "（タイトル）";          // ★ 本文で {title} を使うために必須
export const description = "（概要）";        // （必要なら参照用に）

// 相対パスはコピー先に応じて調整してください（下は「content/guides/slug.mdx」想定）
import { GuideLayout, Glossary, QA } from '../../src/components/guide/GuideLayout';

/** 必要なコンポーネントだけ有効化して使う
import OCSimulator from '../../src/components/guide/OCSimulator';
import AvailabilitySimulator from '../../src/components/guide/AvailabilitySimulator';
import ControlChart from '../../src/components/guide/ControlChart';
import TestNavigator from '../../src/components/guide/TestNavigator';
import MethodNavigator from '../../src/components/guide/MethodNavigator';
import ChiSquareGuide from '../../src/components/guide/ChiSquareGuide';
*/

<GuideLayout
  title={title}
  intro="（ここに導入文：本文全体の目的・学べることを1〜2文で）"
>

<section style={{ marginBottom: 24 }}>
  {/* ここに本文やインタラクティブ・コンポーネントを配置 */}
  {/* 例:
  <AvailabilitySimulator
    defaultMTBF={500} minMTBF={10} maxMTBF={1000}
    defaultMTTR={10}  minMTTR={1}  maxMTTR={100}
  />
  */}
  {/* 例: <ChiSquareGuide /> */}
</section>

<Glossary items={[
  { term: '用語A', desc: '説明A' },
  { term: '用語B', desc: '説明B' },
]} />

<section style={{ maxWidth: 760, margin:'0 auto', display:'grid', gap:12 }}>
  <QA q="質問1？" a={<div>答え1</div>} />
  <QA q="質問2？" a={<div>答え2</div>} />
</section>

</GuideLayout>
