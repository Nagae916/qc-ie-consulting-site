'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import answerFrameRulesData from '../../../public/data/engineer/answer-frame-rules.json';
import competenciesData from '../../../public/data/engineer/competencies.json';

type AnswerFrameRule = {
  id: string;
  label: string;
  examPart: string;
  questionPatterns: string[];
  answerBlocks: string[];
  keyEvaluationPoints: string[];
  usefulKeywords: string[];
  commonWeaknesses: string[];
  relatedCompetencies: string[];
  recommendedTools: string[];
};

type EngineerCompetency = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  answerSignals: string[];
  weakSignals: string[];
  relatedExamParts: string[];
  relatedTools: string[];
};

type FieldType = 'text' | 'textarea';

type FrameField = {
  id: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  rows?: number;
};

type FieldGroup = {
  title: string;
  description: string;
  fields: FrameField[];
};

type FrameConfig = {
  note: string;
  groups: FieldGroup[];
  buildPreview: (_values: Record<string, string>) => string;
};

const answerFrameRules = answerFrameRulesData as AnswerFrameRule[];
const competencies = competenciesData as EngineerCompetency[];

const frameConfigs: Record<string, FrameConfig> = {
  'required-i-standard': {
    note: '必須Ⅰでは、問題文の要求、課題3つ、最重要課題、解決策、リスク、倫理・持続可能性を一貫させます。',
    groups: [
      {
        title: 'Step 0：問題文の要求整理',
        description: '問題文を読んだら、まず何を問われているかを分解します。',
        fields: [
          { id: 'theme', label: 'テーマ・問題名' },
          { id: 'target', label: '対象企業・対象業務' },
          { id: 'role', label: '自分の立場' },
          { id: 'constraints', label: '制約条件・前提条件', type: 'textarea' },
          { id: 'questionOne', label: '設問(1)で求められていること', type: 'textarea' },
          { id: 'questionTwo', label: '設問(2)で求められていること', type: 'textarea' },
          { id: 'questionThree', label: '設問(3)で求められていること', type: 'textarea' },
          { id: 'questionFour', label: '設問(4)で求められていること', type: 'textarea' },
        ],
      },
      {
        title: 'Step 1：課題3つ',
        description: '問題点は現状の困りごと、技術課題は技術者として取り組むべき改善対象として書きます。',
        fields: [
          { id: 'issueOneViewpoint', label: '課題1 観点' },
          { id: 'issueOneProblem', label: '課題1 問題点', type: 'textarea' },
          { id: 'issueOneTechnicalIssue', label: '課題1 技術課題' },
          { id: 'issueOneDetail', label: '課題1 課題の内容', type: 'textarea' },
          { id: 'issueTwoViewpoint', label: '課題2 観点' },
          { id: 'issueTwoProblem', label: '課題2 問題点', type: 'textarea' },
          { id: 'issueTwoTechnicalIssue', label: '課題2 技術課題' },
          { id: 'issueTwoDetail', label: '課題2 課題の内容', type: 'textarea' },
          { id: 'issueThreeViewpoint', label: '課題3 観点' },
          { id: 'issueThreeProblem', label: '課題3 問題点', type: 'textarea' },
          { id: 'issueThreeTechnicalIssue', label: '課題3 技術課題' },
          { id: 'issueThreeDetail', label: '課題3 課題の内容', type: 'textarea' },
        ],
      },
      {
        title: 'Step 2：最重要課題',
        description: '最重要課題は、抽出した課題の中から選び、影響範囲、根本性、波及性などで理由を示します。',
        fields: [
          { id: 'priorityIssue', label: '最重要課題' },
          { id: 'priorityReason', label: '選定理由', type: 'textarea' },
        ],
      },
      {
        title: 'Step 3：解決策',
        description: '解決策は、最重要課題に直接対応させます。',
        fields: [
          { id: 'solutionOne', label: '解決策1', type: 'textarea' },
          { id: 'solutionTwo', label: '解決策2', type: 'textarea' },
          { id: 'solutionThree', label: '解決策3', type: 'textarea' },
          { id: 'methods', label: '使用する経営工学・品質管理手法', type: 'textarea' },
        ],
      },
      {
        title: 'Step 4：リスクと対策',
        description: 'リスクは、解決策を実施した後に新たに生じる副作用として書きます。',
        fields: [
          { id: 'effect', label: '期待される波及効果', type: 'textarea' },
          { id: 'risk', label: '新たに生じうるリスク', type: 'textarea' },
          { id: 'trouble', label: '発生しうるトラブル', type: 'textarea' },
          { id: 'countermeasure', label: 'リスクへの対策', type: 'textarea' },
        ],
      },
      {
        title: 'Step 5：技術者倫理・社会の持続可能性',
        description: '倫理・持続可能性は、テーマ固有の具体語で書きます。',
        fields: [
          { id: 'ethicsViewpoint', label: '技術者倫理の観点' },
          { id: 'ethicsDetail', label: '技術者倫理上の具体的な留意点', type: 'textarea' },
          { id: 'sustainabilityViewpoint', label: '社会の持続可能性の観点' },
          { id: 'sustainabilityDetail', label: '社会の持続可能性上の具体的な留意点', type: 'textarea' },
        ],
      },
    ],
    buildPreview: (values) => `【問題文の要求整理】
テーマ：${valueOrBlank(values.theme)}
対象：${valueOrBlank(values.target)}
立場：${valueOrBlank(values.role)}
制約条件：${valueOrBlank(values.constraints)}

【設問(1)：課題抽出】
1. 観点：${valueOrBlank(values.issueOneViewpoint)}
   問題点：${valueOrBlank(values.issueOneProblem)}
   技術課題：${valueOrBlank(values.issueOneTechnicalIssue)}
   内容：${valueOrBlank(values.issueOneDetail)}

2. 観点：${valueOrBlank(values.issueTwoViewpoint)}
   問題点：${valueOrBlank(values.issueTwoProblem)}
   技術課題：${valueOrBlank(values.issueTwoTechnicalIssue)}
   内容：${valueOrBlank(values.issueTwoDetail)}

3. 観点：${valueOrBlank(values.issueThreeViewpoint)}
   問題点：${valueOrBlank(values.issueThreeProblem)}
   技術課題：${valueOrBlank(values.issueThreeTechnicalIssue)}
   内容：${valueOrBlank(values.issueThreeDetail)}

【設問(2)：最重要課題と解決策】
最重要課題：${valueOrBlank(values.priorityIssue)}
選定理由：${valueOrBlank(values.priorityReason)}

解決策：
1. ${valueOrBlank(values.solutionOne)}
2. ${valueOrBlank(values.solutionTwo)}
3. ${valueOrBlank(values.solutionThree)}

使用する経営工学・品質管理手法：${valueOrBlank(values.methods)}

【設問(3)：波及効果・リスク・対策】
期待される波及効果：${valueOrBlank(values.effect)}
新たに生じうるリスク：${valueOrBlank(values.risk)}
発生しうるトラブル：${valueOrBlank(values.trouble)}
対策：${valueOrBlank(values.countermeasure)}

【設問(4)：技術者倫理・社会の持続可能性】
技術者倫理：${valueOrBlank(values.ethicsViewpoint)} / ${valueOrBlank(values.ethicsDetail)}
社会の持続可能性：${valueOrBlank(values.sustainabilityViewpoint)} / ${valueOrBlank(values.sustainabilityDetail)}`,
  },
  'elective-ii-1-short': {
    note: 'Ⅱ-1では、定義だけでなく、特徴、適用場面、留意点を簡潔に整理します。600字程度の答案に展開できる骨子を作ります。',
    groups: [
      {
        title: '選択科目Ⅱ-1：短答・用語説明型',
        description: '専門用語や手法を、定義、目的、具体例、留意点まで短く整理します。',
        fields: [
          { id: 'term', label: 'テーマ・用語' },
          { id: 'definition', label: '定義', type: 'textarea' },
          { id: 'purpose', label: '目的', type: 'textarea' },
          { id: 'example', label: '具体例', type: 'textarea' },
          { id: 'procedureOrElements', label: '手順または構成要素', type: 'textarea' },
          { id: 'caution', label: '留意点', type: 'textarea' },
          { id: 'application', label: '経営工学上の活用場面', type: 'textarea' },
          { id: 'keywords', label: '関連する手法・キーワード', type: 'textarea' },
        ],
      },
    ],
    buildPreview: (values) => `【テーマ・用語】
${valueOrBlank(values.term)}

【定義】
${valueOrBlank(values.definition)}

【目的】
${valueOrBlank(values.purpose)}

【具体例】
${valueOrBlank(values.example)}

【手順または構成要素】
${valueOrBlank(values.procedureOrElements)}

【留意点】
${valueOrBlank(values.caution)}

【経営工学上の活用場面】
${valueOrBlank(values.application)}

【関連キーワード】
${valueOrBlank(values.keywords)}`,
  },
  'elective-ii-2-procedure': {
    note: 'Ⅱ-2では、業務遂行の手順、管理項目、留意点、関係者調整を具体的に整理します。単なる手法説明ではなく、実務でどう進めるかを示します。',
    groups: [
      {
        title: '選択科目Ⅱ-2：手順説明・留意点型',
        description: '現状把握から実施、管理、調整、効果確認までの流れを作ります。',
        fields: [
          { id: 'workTheme', label: 'テーマ・業務' },
          { id: 'backgroundPurpose', label: '背景・目的', type: 'textarea' },
          { id: 'currentState', label: '現状把握', type: 'textarea' },
          { id: 'procedureOne', label: '実施手順1', type: 'textarea' },
          { id: 'procedureTwo', label: '実施手順2', type: 'textarea' },
          { id: 'procedureThree', label: '実施手順3', type: 'textarea' },
          { id: 'controlItems', label: '管理項目', type: 'textarea' },
          { id: 'cautions', label: '留意点・工夫点', type: 'textarea' },
          { id: 'stakeholderCoordination', label: '関係者との調整', type: 'textarea' },
          { id: 'effectCheck', label: '効果確認', type: 'textarea' },
        ],
      },
    ],
    buildPreview: (values) => `【テーマ・業務】
${valueOrBlank(values.workTheme)}

【背景・目的】
${valueOrBlank(values.backgroundPurpose)}

【現状把握】
${valueOrBlank(values.currentState)}

【実施手順】
1. ${valueOrBlank(values.procedureOne)}
2. ${valueOrBlank(values.procedureTwo)}
3. ${valueOrBlank(values.procedureThree)}

【管理項目】
${valueOrBlank(values.controlItems)}

【留意点・工夫点】
${valueOrBlank(values.cautions)}

【関係者との調整】
${valueOrBlank(values.stakeholderCoordination)}

【効果確認】
${valueOrBlank(values.effectCheck)}`,
  },
  'elective-iii-analysis': {
    note: 'Ⅲでは、専門領域における多面的な課題、解決策、リスク、将来展望を整理します。必須Ⅰよりも選択科目の専門性を意識します。',
    groups: [
      {
        title: '選択科目Ⅲ：課題解決・将来展望型',
        description: '専門領域の大きな課題を、多面的課題、解決策、将来展望へ展開します。',
        fields: [
          { id: 'theme', label: 'テーマ' },
          { id: 'background', label: '背景', type: 'textarea' },
          { id: 'issueOne', label: '多面的課題1', type: 'textarea' },
          { id: 'issueTwo', label: '多面的課題2', type: 'textarea' },
          { id: 'issueThree', label: '多面的課題3', type: 'textarea' },
          { id: 'priorityIssue', label: '最重要課題', type: 'textarea' },
          { id: 'solutionOne', label: '解決策1', type: 'textarea' },
          { id: 'solutionTwo', label: '解決策2', type: 'textarea' },
          { id: 'solutionThree', label: '解決策3', type: 'textarea' },
          { id: 'riskResponse', label: 'リスクと対応', type: 'textarea' },
          { id: 'futureView', label: '将来展望', type: 'textarea' },
          { id: 'sustainability', label: '社会の持続可能性', type: 'textarea' },
        ],
      },
    ],
    buildPreview: (values) => `【背景】
${valueOrBlank(values.background)}

【多面的課題】
1. ${valueOrBlank(values.issueOne)}
2. ${valueOrBlank(values.issueTwo)}
3. ${valueOrBlank(values.issueThree)}

【最重要課題】
${valueOrBlank(values.priorityIssue)}

【解決策】
1. ${valueOrBlank(values.solutionOne)}
2. ${valueOrBlank(values.solutionTwo)}
3. ${valueOrBlank(values.solutionThree)}

【リスクと対応】
${valueOrBlank(values.riskResponse)}

【将来展望】
${valueOrBlank(values.futureView)}

【社会の持続可能性】
${valueOrBlank(values.sustainability)}`,
  },
};

const issueMatrixHref = '/guides/engineer/issue-decomposition-matrix';
const defaultFrameId = answerFrameRules.find((rule) => rule.id === 'required-i-standard')?.id ?? answerFrameRules[0]?.id ?? '';

function valueOrBlank(value: string | undefined) {
  return value?.trim() || '未入力';
}

function fieldValue(values: Record<string, string>, fieldId: string) {
  return values[fieldId] ?? '';
}

function SectionCard({ step, title, note, children }: { step: string; title: string; note: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{step}</p>
      <h2 className="mt-2 text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">{note}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (_value: string) => void;
  placeholder?: string | undefined;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (_value: string) => void;
  placeholder?: string | undefined;
  rows?: number | undefined;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-7 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

function BadgeList({ items, color = 'slate' }: { items: string[]; color?: 'slate' | 'emerald' | 'amber' }) {
  const colorClass =
    color === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : color === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AnswerStructureBuilder() {
  const [selectedFrameId, setSelectedFrameId] = useState(defaultFrameId);
  const [frameValues, setFrameValues] = useState<Record<string, Record<string, string>>>({});
  const [handoffMemo, setHandoffMemo] = useState('');
  const [handoffOpen, setHandoffOpen] = useState(true);
  const [copyMessage, setCopyMessage] = useState('');

  const selectedRule = useMemo(() => {
    return answerFrameRules.find((rule) => rule.id === selectedFrameId) ?? answerFrameRules.find((rule) => rule.id === defaultFrameId) ?? answerFrameRules[0];
  }, [selectedFrameId]);

  const selectedConfig = selectedRule ? frameConfigs[selectedRule.id] : undefined;
  const selectedValues = useMemo(() => {
    if (!selectedRule) return {};
    return frameValues[selectedRule.id] ?? {};
  }, [frameValues, selectedRule]);

  const relatedCompetencies = useMemo(() => {
    if (!selectedRule) return [];
    return selectedRule.relatedCompetencies
      .map((competencyId) => competencies.find((competency) => competency.id === competencyId))
      .filter((competency): competency is EngineerCompetency => Boolean(competency));
  }, [selectedRule]);

  const previewText = useMemo(() => {
    if (!selectedConfig) return '';
    return selectedConfig.buildPreview(selectedValues);
  }, [selectedConfig, selectedValues]);

  function updateField(fieldId: string, value: string) {
    if (!selectedRule) return;
    setFrameValues((current) => ({
      ...current,
      [selectedRule.id]: {
        ...(current[selectedRule.id] ?? {}),
        [fieldId]: value,
      },
    }));
  }

  async function copyPreview() {
    setCopyMessage('');
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyMessage('コピー機能が使えない環境です。プレビュー欄から手動でコピーしてください。');
      return;
    }

    try {
      await navigator.clipboard.writeText(previewText);
      setCopyMessage('コピーしました');
    } catch {
      setCopyMessage('コピーに失敗しました。プレビュー欄から手動でコピーしてください。');
    }
  }

  if (!selectedRule || !selectedConfig) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900">
          答案フレームルールを読み込めませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">技術士二次試験向け</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">技術士 答案骨子ビルダー</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          問題種別ごとの答案フレームを選び、必要な入力項目だけを整理できます。解答例本文の転載ではなく、答案の構成、評価観点、キーワードの使い方を骨子作成に利用します。
        </p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">
          このツールは答案本文の自動作成ではなく、答案構成を整理するための補助ツールです。
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-slate-950">答案フレームを選択</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          現在の答案型：<span className="font-bold text-emerald-800">{selectedRule.label}</span>（{selectedRule.examPart}）
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {answerFrameRules.map((rule) => {
            const isSelected = rule.id === selectedRule.id;
            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => {
                  setSelectedFrameId(rule.id);
                  setCopyMessage('');
                }}
                className={`rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-600 bg-white text-emerald-950 shadow-sm'
                    : 'border-emerald-200 bg-emerald-50 text-slate-700 hover:border-emerald-400 hover:bg-white'
                }`}
              >
                <span className="block text-base font-bold">{rule.label}</span>
                <span className="mt-2 block text-sm leading-6">{rule.examPart}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4">
          <p className="text-sm leading-7 text-slate-700">{selectedConfig.note}</p>
          <BadgeList items={selectedRule.answerBlocks} color="emerald" />
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <h2 className="text-xl font-bold text-slate-950">課題分解マトリクスから続ける場合</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              課題分解マトリクスで作成した内容をコピーしている場合は、下のメモ欄に貼り付けてから、各入力欄に整理してください。
            </p>
          </div>
          <div className="flex items-start lg:justify-end">
            <a
              href={issueMatrixHref}
              className="rounded-lg border border-emerald-700 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              課題分解マトリクスに戻る
            </a>
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4">
          <button
            type="button"
            onClick={() => setHandoffOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-3 text-left"
            aria-expanded={handoffOpen}
            aria-controls="handoff-memo-panel"
          >
            <span>
              <span className="block text-sm font-bold text-slate-800">引き継ぎメモ</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">{handoffOpen ? 'クリックで折りたたむ' : 'クリックで展開する'}</span>
            </span>
            <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              {handoffOpen ? '開いている' : '閉じている'}
            </span>
          </button>
          {handoffOpen && (
            <label id="handoff-memo-panel" className="mt-4 block" htmlFor="handoff-memo">
              <span className="sr-only">引き継ぎメモ</span>
              <textarea
                id="handoff-memo"
                value={handoffMemo}
                onChange={(event) => setHandoffMemo(event.target.value)}
                placeholder="課題分解マトリクスでコピーした内容をここに貼り付けます。"
                rows={6}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm leading-7 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-6">
          {selectedConfig.groups.map((group, groupIndex) => (
            <SectionCard key={group.title} step={`Frame ${groupIndex + 1}`} title={group.title} note={group.description}>
              <div className="grid gap-4 md:grid-cols-2">
                {group.fields.map((field) =>
                  field.type === 'textarea' ? (
                    <TextAreaField
                      key={field.id}
                      id={`${selectedRule.id}-${field.id}`}
                      label={field.label}
                      value={fieldValue(selectedValues, field.id)}
                      onChange={(value) => updateField(field.id, value)}
                      placeholder={field.placeholder}
                      rows={field.rows}
                    />
                  ) : (
                    <TextField
                      key={field.id}
                      id={`${selectedRule.id}-${field.id}`}
                      label={field.label}
                      value={fieldValue(selectedValues, field.id)}
                      onChange={(value) => updateField(field.id, value)}
                      placeholder={field.placeholder}
                    />
                  )
                )}
              </div>
            </SectionCard>
          ))}
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <h2 className="text-xl font-bold">答案骨子プレビュー</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">選択中の答案フレームに合わせて、出力形式が切り替わります。</p>
            <textarea
              readOnly
              value={previewText}
              className="mt-4 min-h-[520px] w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-sm leading-6 text-slate-900"
            />
            <button type="button" onClick={copyPreview} className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800">
              この答案骨子をコピー
            </button>
            {copyMessage && <p className="mt-3 text-sm font-semibold text-emerald-800">{copyMessage}</p>}

            <InfoPanel title="この答案フレームの確認ポイント">
              <BulletList items={selectedRule.keyEvaluationPoints} />
            </InfoPanel>

            <InfoPanel title="よくある弱点">
              <BulletList items={selectedRule.commonWeaknesses} />
            </InfoPanel>

            <InfoPanel title="使いやすいキーワード">
              <BadgeList items={selectedRule.usefulKeywords} color="amber" />
            </InfoPanel>

            <InfoPanel title="想定される問題パターン">
              <BulletList items={selectedRule.questionPatterns} />
            </InfoPanel>

            <InfoPanel title="推奨ツール">
              <BadgeList items={selectedRule.recommendedTools} />
            </InfoPanel>

            <InfoPanel title="この答案フレームで意識するコンピテンシー">
              <div className="mt-4 space-y-3">
                {relatedCompetencies.map((competency) => (
                  <details key={competency.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3" open>
                    <summary className="cursor-pointer text-sm font-bold text-slate-950">{competency.label}</summary>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{competency.description}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {competency.answerSignals.map((signal) => (
                        <li key={`${competency.id}-${signal}`} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </InfoPanel>
          </section>
        </aside>
      </div>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-base font-bold text-slate-950">{title}</h3>
      {children}
    </div>
  );
}
