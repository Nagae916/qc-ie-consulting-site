import dynamic from 'next/dynamic';
import { GuideLayout, Glossary, QA } from '../../src/components/guide/GuideLayout';

export const title = '（タイトル）';
export const description = '（概要）';
export const tags = ['タグ1', 'タグ2'];

<GuideLayout title={title} intro="（ここに導入文）">

<section style={{ marginBottom: 24 }}>
  {/* ここにコンテンツ or 動的コンポーネント */}
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
