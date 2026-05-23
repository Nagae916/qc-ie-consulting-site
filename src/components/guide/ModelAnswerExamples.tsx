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
  'required-i-standard': '必須Ⅰ型',
  'elective-ii-1-short': 'Ⅱ-1型',
  'elective-ii-2-procedure': 'Ⅱ-2型',
  'elective-iii-analysis': 'Ⅲ型',
};

const answerFrameOrder = ['required-i-standard', 'elective-ii-1-short', 'elective-ii-2-procedure', 'elective-iii-analysis'];

function answerFrameLabel(example: ModelAnswerExample) {
  return answerFrameLabels[example.answerFrameId] ?? example.examPart;
}

export default function ModelAnswerExamples() {
  const [activeFrame, setActiveFrame] = useState(answerFrameOrder[0]);
  const [selectedId, setSelectedId] = useState('');

  const activeExamples = useMemo(
    () => modelAnswerExamples.filter((example) => example.answerFrameId === activeFrame),
    [activeFrame]
  );

  const frameCounts = useMemo(() => {
    return answerFrameOrder.reduce<Record<string, number>>((counts, frameId) => {
      counts[frameId] = modelAnswerExamples.filter((example) => example.answerFrameId === frameId).length;
      return counts;
    }, {});
  }, []);

  const selectedExample = useMemo(
    () => activeExamples.find((example) => example.id === selectedId) ?? activeExamples[0] ?? modelAnswerExamples[0],
    [activeExamples, selectedId]
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
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">答案型を選ぶ</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {answerFrameOrder.map((frameId) => {
            const isActive = frameId === activeFrame;
            return (
              <button
                key={frameId}
                type="button"
                onClick={() => {
                  setActiveFrame(frameId);
                  setSelectedId('');
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  isActive ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50'
                }`}
                aria-pressed={isActive}
              >
                <p className={`text-base font-bold ${isActive ? 'text-blue-800' : 'text-slate-950'}`}>
                  {answerFrameLabels[frameId]}
                </p>
                <p className="mt-1 text-xs text-slate-600">{frameCounts[frameId] ?? 0}件の答案例</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {activeExamples.map((example) => {
          const isSelected = example.id === selectedExample.id;
          const exampleCharCount = countManuscriptChars(example.normalText);
          const exampleRange = getRecommendedCharRange(example.targetManuscriptPages);
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
              <p className="text-xs font-semibold text-blue-700">{answerFrameLabel(example)} / {example.examPart}</p>
              <h3 className="mt-1 text-base font-bold text-slate-950">{example.title ?? example.theme}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {example.targetManuscriptPages}枚 / {exampleCharCount}字 / 実用目安{exampleRange.min}〜{exampleRange.max}字
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {example.usedKeywords.slice(0, 4).map((keyword) => (
                  <span key={keyword} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                    {keyword}
                  </span>
                ))}
              </div>
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
            <MetaCard label="答案型" value={`${answerFrameLabel(selectedExample)}答案`} />
            <MetaCard label="目標原稿用紙" value={`${selectedExample.targetManuscriptPages}枚`} />
            <MetaCard label="上限文字数" value={`${charLimit}字以内`} />
            <MetaCard label="本文文字数" value={`${bodyCharCount}字`} />
            <MetaCard label="実用目安" value={`${practicalRange.min}〜${practicalRange.max}字`} />
            <MetaCard label="文字量判定" value={volumeStatus} />
          </div>
        </header>

        <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-lg font-bold text-slate-950">通常テキスト版を見る</summary>
          <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm leading-8 text-slate-800">
            {selectedExample.normalText}
          </div>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-lg font-bold text-slate-950">原稿用紙プレビュー版を見る</summary>
          <div className="mt-4">
          <ManuscriptAnswerPreview
            text={selectedExample.normalText}
            targetPages={selectedExample.targetManuscriptPages}
            title="24×25原稿用紙プレビュー版"
          />
          </div>
        </details>

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
