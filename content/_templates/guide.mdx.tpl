---
title: "（タイトル）"
description: "（概要）"
tags: ["タグ1", "タグ2"]
exam: "qc"
status: "draft"
---

/** ▼ 使用時の注意
 * - このファイルはテンプレートです（直接ビルド対象にしない想定）。
 * - コピー先の場所に応じて import パスを調整してください。
 *   - QC配下: content/guides/qc/slug.mdx → '../../../src/components/...'
 *   - 浅い階層: content/guides/slug.mdx → '../../src/components/...'
 */
import { GuideLayout, Glossary, QA } from '../../src/components/guide/GuideLayout';
/** 必要なコンポーネントだけ有効化
import OCSimulator from '../../src/components/guide/OCSimulator';
import AvailabilitySimulator from '../../src/components/guide/AvailabilitySimulator';
import ControlChart from '../../src/components/guide/ControlChart';
import TestNavigator from '../../src/components/guide/TestNavigator';
import MethodNavigator from '../../src/components/guide/MethodNavigator';
import ChiSquareGuide from '../../src/components/guide/ChiSquareGuide';
*/

{/* ★ GuideLayout に title を渡さない（optional） */}
<GuideLayout intro="（ここに導入文）">

<section style={{ marginBottom: 24 }}>
  {/* 本文やインタラクティブ */}
  {/* 例:
  <AvailabilitySimulator
    defaultMTBF={500} minMTBF={10} maxMTBF={1000}
    defaultMTTR={10}  minMTTR={1}  maxMTTR={100}
  />
  */}
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
