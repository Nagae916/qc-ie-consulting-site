'use client';

import { useMemo, useState } from 'react';
import modelAnswerExamplesData from '../../../public/data/engineer/model-answer-examples.json';
import { countManuscriptChars, getManuscriptCharLimit, getManuscriptVolumeStatus, getRecommendedCharRange } from '../../lib/manuscript';
import ManuscriptAnswerPreview from './ManuscriptAnswerPreview';

type ModelAnswerExample = {
  id: string;
  title?: string;
  source: string;
  examPart: string;
  field: string;
  theme: string;
  questionPattern: string;
  answerFrameId: string;
  targetManuscriptPages: number;
  targetBodyChars: {
    min: number;
    max: number;
  };
  answerType: string;
  normalText: string;
  manuscriptNotes: string[];
  keyEvaluationPoints: string[];
  usedKeywords: string[];
  improvementIntent: string[];
};

const modelAnswerExamples = modelAnswerExamplesData as ModelAnswerExample[];

const answerFrameLabels: Record<string, string> = {
  'required-i-standard': '必須Ⅰ型答案',
  'elective-ii-1-short': 'Ⅱ-1型答案',
  'elective-ii-2-procedure': 'Ⅱ-2型答案',
  'elective-iii-analysis': 'Ⅲ型答案',
};

function answerFrameLabel(example: ModelAnswerExample) {
  return answerFrameLabels[example.answerFrameId] ?? example.examPart;
}

export default function ModelAnswerExamples() {
  const [selectedId, setSelectedId] = useState(modelAnswerExamples[0]?.id ?? '');

  const selectedExample = useMemo(
    () => modelAnswerExamples.find((example) => example.id === selectedId) ?? modelAnswerExamples[0],
    [selectedId]
  );

  if (!selectedExample) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        表示できる答案例がまだ登録されていません。
      </section>
    );
  }

  const bodyCharCount = countManuscriptChars(selectedExample.normalText);
  const charLimit = getManuscriptCharLimit(selectedExample.targetManuscriptPages);
  const practicalRange = getRecommendedCharRange(selectedExample.targetManuscriptPages);
  const volumeStatus = getManuscriptVolumeStatus(bodyCharCount, selectedExample.targetManuscriptPages);

  return (
    <section className="space-y-8">
      <div className="grid gap-3 md:grid-cols-2">
        {modelAnswerExamples.map((example) => {
          const isSelected = example.id === selectedExample.id;
          return (
            <button
              key={example.id}
              type="button"
              onClick={() => setSelectedId(example.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
              }`}
            >
              <p className="text-xs font-semibold text-blue-700">{example.examPart}</p>
              <h3 className="mt-1 text-base font-bold text-slate-950">{example.title ?? example.theme}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {answerFrameLabel(example)} / {example.questionPattern}
              </p>
            </button>
          );
        })}
      </div>

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <header className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">{selectedExample.source}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">{selectedExample.title ?? selectedExample.theme}</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <MetaCard label="試験区分" value={selectedExample.examPart} />
            <MetaCard label="答案型" value={answerFrameLabel(selectedExample)} />
            <MetaCard label="目標原稿用紙" value={`${selectedExample.targetManuscriptPages}枚`} />
            <MetaCard label="上限文字数" value={`${charLimit}字以内`} />
            <MetaCard label="本文文字数" value={`${bodyCharCount}字`} />
            <MetaCard label="実用目安" value={`${practicalRange.min}〜${practicalRange.max}字`} />
            <MetaCard label="文字量判定" value={volumeStatus} />
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-bold text-slate-950">通常テキスト版</h3>
          <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm leading-8 text-slate-800">
            {selectedExample.normalText}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <ManuscriptAnswerPreview
            text={selectedExample.normalText}
            targetPages={selectedExample.targetManuscriptPages}
            title="24×25原稿用紙プレビュー版"
          />
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <InfoBlock title="評価観点" items={selectedExample.keyEvaluationPoints} />
          <InfoBlock title="改善意図" items={selectedExample.improvementIntent} />
          <InfoBlock title="原稿用紙上の注意" items={selectedExample.manuscriptNotes} />
        </div>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="text-base font-bold text-slate-950">使用キーワード</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedExample.usedKeywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-800">
                {keyword}
              </span>
            ))}
          </div>
        </section>
      </article>
    </section>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-base font-bold text-slate-950">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
