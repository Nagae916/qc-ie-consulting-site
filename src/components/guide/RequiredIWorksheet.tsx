'use client';

import worksheetTemplate from '../../../public/data/engineer/required-i-worksheet-template.json';

type WorksheetBlock = {
  id: string;
  label: string;
  purpose: string;
  placeholder?: string;
  fields?: string[];
  answerUse: string;
};

type WorksheetTemplate = {
  id: string;
  title: string;
  answerType: string;
  targetChars: number;
  manuscriptPages: number;
  practicalCharRange: string;
  blocks: WorksheetBlock[];
  sample?: {
    title: string;
    issues: {
      viewpoint: string;
      issue: string;
      detail: string;
    }[];
    keyIssue: string;
    reason: string;
    solutions: string[];
    risk: string;
    riskCountermeasure: string;
    ethics: string;
    sustainability: string;
  };
};

const template = worksheetTemplate as WorksheetTemplate;

const flowItems = ['問題タイトル', '技術課題3つ', '最重要課題', '解決策', 'リスク対策', '倫理・持続可能性'];

export default function RequiredIWorksheet() {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <header className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">必須科目Ⅰ / 3枚答案</p>
          <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">{template.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            必須Ⅰ型は、技術課題を3つ抽出し、最重要課題、解決策、リスク、倫理・持続可能性まで一貫させる答案型です。
            先にワークシートで骨子を作ると、1800字答案へ展開しやすくなります。
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <MetaCard label="上限文字数" value={`${template.targetChars}字以内`} />
          <MetaCard label="原稿用紙" value={`${template.manuscriptPages}枚`} />
          <MetaCard label="実用目安" value={template.practicalCharRange} />
        </div>
      </header>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <h3 className="text-base font-bold text-slate-950">このワークシートで完成するもの</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
          {flowItems.map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-blue-800">{item}</span>
              {index < flowItems.length - 1 ? <span className="text-slate-400">→</span> : null}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-950">書く順番</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {template.blocks.map((block, index) => (
            <article key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Block {index + 1}</p>
              <h4 className="mt-1 text-base font-bold text-slate-950">{block.label}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-700">{block.purpose}</p>
              {block.fields ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {block.fields.map((field) => (
                    <span key={field} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {field}
                    </span>
                  ))}
                </div>
              ) : null}
              {block.placeholder ? <p className="mt-3 text-xs leading-5 text-slate-500">{block.placeholder}</p> : null}
              <p className="mt-3 rounded-xl border border-white bg-white p-3 text-xs leading-5 text-slate-600">
                答案での使い道：{block.answerUse}
              </p>
            </article>
          ))}
        </div>
      </section>

      {template.sample ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-bold text-slate-950">DXテーマでの入力イメージ</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {template.sample.issues.map((issue, index) => (
              <div key={`${issue.viewpoint}-${issue.issue}`} className="rounded-2xl border bg-white p-4">
                <p className="text-xs font-semibold text-blue-700">技術課題{index + 1}</p>
                <h4 className="mt-1 text-base font-bold text-slate-950">{issue.issue}</h4>
                <p className="mt-2 text-sm font-semibold text-slate-600">観点：{issue.viewpoint}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{issue.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <SampleCard label="最重要課題" value={template.sample.keyIssue} />
            <SampleCard label="選定理由" value={template.sample.reason} />
            <SampleCard label="リスク" value={template.sample.risk} />
            <SampleCard label="リスク対策" value={template.sample.riskCountermeasure} />
            <SampleCard label="技術者倫理" value={template.sample.ethics} />
            <SampleCard label="社会の持続可能性" value={template.sample.sustainability} />
          </div>
        </section>
      ) : null}
    </section>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-slate-950">{value}</p>
    </div>
  );
}

function SampleCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-800">{value}</p>
    </div>
  );
}
