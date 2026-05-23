'use client';

import { useMemo, useState } from 'react';
import worksheetTemplates from '../../../public/data/engineer/answer-worksheet-templates.json';
import worksheetExamples from '../../../public/data/engineer/answer-worksheet-examples.json';
import whitepaperFacts from '../../../public/data/engineer/whitepaper-facts.json';

type WorksheetBlock = {
  id: string;
  label: string;
  purpose: string;
  fields?: string[];
  answerUse: string;
};

type WorksheetTemplate = {
  id: string;
  answerType: string;
  examPart: string;
  title: string;
  targetChars: number;
  manuscriptPages: number;
  practicalCharRange: string;
  purpose: string;
  guidance: string[];
  blocks: WorksheetBlock[];
  sample?: {
    theme: string;
    points: string[];
  };
};

type WorksheetExampleBlock = {
  blockId: string;
  label: string;
  sample?: string;
  samples?: string[];
  viewpoint?: string;
  target?: string;
  issue?: string;
  content?: string;
  reason?: string;
};

type WorksheetExample = {
  id: string;
  answerType: string;
  title: string;
  theme: string;
  targetChars: number;
  manuscriptPages: number;
  practicalCharRange: string;
  blocks: WorksheetExampleBlock[];
};

type WhitepaperFact = {
  id: string;
  theme: string;
  sourceFamily: string;
  latestSourceName: string;
  latestYear: number;
  priority: 'high' | 'medium' | 'low';
  factSummary: string;
  numericValue: number | null;
  valueStatus: string;
  usableExamTypes: string[];
  answerUse: string;
  worksheetUse: string;
};

const templates = worksheetTemplates as WorksheetTemplate[];
const examples = worksheetExamples as WorksheetExample[];
const facts = whitepaperFacts as WhitepaperFact[];

const labelByAnswerType: Record<string, string> = {
  'required-i-standard': '必須Ⅰ',
  'elective-ii-1-short': 'Ⅱ-1',
  'elective-ii-2-procedure': 'Ⅱ-2',
  'elective-iii-analysis': 'Ⅲ',
};

export default function AnswerWorksheetGuide() {
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? '');

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedId) ?? templates[0],
    [selectedId]
  );

  const selectedExamples = useMemo(
    () => examples.filter((example) => example.answerType === selectedTemplate?.answerType),
    [selectedTemplate?.answerType]
  );

  const selectedFacts = useMemo(() => {
    return facts
      .filter((fact) => fact.usableExamTypes.includes(selectedTemplate?.answerType ?? ''))
      .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
      .slice(0, 3);
  }, [selectedTemplate?.answerType]);

  if (!selectedTemplate) {
    return null;
  }

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <header className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">答案型別ワークシート</p>
          <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">答案型に合わせて骨子を作る</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            必須Ⅰ、Ⅱ-1、Ⅱ-2、Ⅲでは、問われ方と答案構造が異なります。
            解く問題の形式を選び、対応するワークシートで書く内容を整理します。
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {templates.map((template) => {
            const selected = template.id === selectedTemplate.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedId(template.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50'
                }`}
                aria-pressed={selected}
              >
                <p className={`text-xs font-semibold ${selected ? 'text-blue-700' : 'text-slate-500'}`}>
                  {labelByAnswerType[template.answerType] ?? template.examPart}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-950">{template.examPart}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {template.manuscriptPages}枚 / {template.targetChars}字以内
                </p>
              </button>
            );
          })}
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <MetaCard label="試験区分" value={selectedTemplate.examPart} />
        <MetaCard label="上限と原稿用紙" value={`${selectedTemplate.targetChars}字以内 / ${selectedTemplate.manuscriptPages}枚`} />
        <MetaCard label="実用目安" value={selectedTemplate.practicalCharRange} />
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <h3 className="text-base font-bold text-slate-950">{selectedTemplate.title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-700">{selectedTemplate.purpose}</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-bold text-slate-950">使うときの注意</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {selectedTemplate.guidance.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {selectedTemplate.sample ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-bold text-slate-950">サンプルテーマ</h3>
              <p className="mt-2 text-sm font-semibold text-blue-700">{selectedTemplate.sample.theme}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {selectedTemplate.sample.points.map((point) => (
                  <li key={point} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {selectedExamples.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-bold text-slate-950">記入例を見る</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                同じ答案型のテーマを、ワークシートの各欄に入れるとどう整理できるかを確認します。
              </p>
              <div className="mt-4 space-y-3">
                {selectedExamples.map((example) => (
                  <details key={example.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <summary className="cursor-pointer text-sm font-bold text-slate-950">{example.title}</summary>
                    <p className="mt-2 text-xs font-semibold text-blue-700">{example.theme}</p>
                    <div className="mt-3 space-y-3">
                      {example.blocks.map((block) => (
                        <div key={`${example.id}-${block.blockId}-${block.label}`} className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs font-semibold text-slate-500">{block.label}</p>
                          {block.viewpoint ? <p className="mt-1 text-sm text-slate-700">観点：{block.viewpoint}</p> : null}
                          {block.target ? <p className="mt-1 text-sm text-slate-700">対象：{block.target}</p> : null}
                          {block.issue ? <p className="mt-1 text-sm font-semibold text-slate-900">{block.issue}</p> : null}
                          {block.reason ? <p className="mt-1 text-sm leading-6 text-slate-700">理由：{block.reason}</p> : null}
                          {block.content ? <p className="mt-1 text-sm leading-6 text-slate-700">{block.content}</p> : null}
                          {block.sample ? <p className="mt-1 text-sm leading-6 text-slate-700">{block.sample}</p> : null}
                          {block.samples ? (
                            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                              {block.samples.map((sample) => (
                                <li key={sample} className="flex gap-2">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                                  <span>{sample}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ) : null}

          {selectedFacts.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-base font-bold text-slate-950">背景・根拠に使える白書ファクト</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                背景や選定理由に使える情報です。数値が未確認の項目は、答案に書く前に最新版を確認してください。
              </p>
              <div className="mt-4 space-y-3">
                {selectedFacts.map((fact) => (
                  <article key={fact.id} className="rounded-xl border border-amber-100 bg-white p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-amber-700">{fact.sourceFamily}</p>
                        <h4 className="mt-1 text-sm font-bold text-slate-950">{fact.theme}</h4>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {fact.numericValue === null ? '数値は最新版確認が必要' : `${fact.numericValue}`}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{fact.factSummary}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">答案での使い方：{fact.answerUse}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">ワークシートでの使い方：{fact.worksheetUse}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-950">書く順番</h3>
          <div className="mt-4 grid gap-3">
            {selectedTemplate.blocks.map((block, index) => (
              <article key={block.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Block {index + 1}</p>
                    <h4 className="mt-1 text-base font-bold text-slate-950">{block.label}</h4>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {block.answerUse}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{block.purpose}</p>
                {block.fields ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {block.fields.map((field) => (
                      <span key={field} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {field}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

function priorityRank(priority: WhitepaperFact['priority']) {
  if (priority === 'high') {
    return 0;
  }
  if (priority === 'medium') {
    return 1;
  }
  return 2;
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-slate-950">{value}</p>
    </div>
  );
}
