'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ProblemRequirements = {
  theme: string;
  target: string;
  role: string;
  constraints: string;
  questionOne: string;
  questionTwo: string;
  questionThree: string;
  questionFour: string;
};

type IssueInput = {
  viewpoint: string;
  problem: string;
  technicalIssue: string;
  detail: string;
};

type SolutionInput = {
  solutionOne: string;
  solutionTwo: string;
  solutionThree: string;
  methods: string;
};

type RiskInput = {
  effect: string;
  risk: string;
  trouble: string;
  countermeasure: string;
};

type EthicsInput = {
  ethicsViewpoint: string;
  ethicsDetail: string;
  sustainabilityViewpoint: string;
  sustainabilityDetail: string;
};

type OutputFormat = 'sheet' | 'outline' | 'shortMemo';

const viewpointChips = ['人材・組織', '業務プロセス', '情報・データ', '設備・現場', '品質', '生産性', 'コスト', 'サプライチェーン', '経営判断', '安全・環境', '社会・制度'];
const reasonChips = ['影響範囲が広い', '根本原因に近い', '他課題への波及効果が大きい', '緊急性が高い', '実現可能性がある', '経営効果・品質効果が大きい'];
const methodChips = ['QC七つ道具', '管理図', 'FMEA', 'ECRS', '標準化', 'KPI設計', '業務フロー分析', 'スキルマップ', 'S&OP', '在庫管理', 'TOC', '内部監査', '是正処置'];
const riskChips = ['技術面', '運用面', '組織面', '人材面', '投資面', '情報セキュリティ', 'データ信頼性', 'ベンダーロックイン', '環境負荷'];
const ethicsChips = ['安全性確保', '公益確保', '説明責任', '法令順守', '情報管理', 'プライバシー', 'データ改ざん防止', '環境負荷低減', '人材育成', 'レジリエンス'];
const issueMatrixHref = '/guides/engineer/issue-decomposition-matrix';

const outputFormats: { id: OutputFormat; label: string; description: string }[] = [
  {
    id: 'sheet',
    label: '構造整理シート形式',
    description: '添削課題や答案作成前の整理に使う',
  },
  {
    id: 'outline',
    label: '答案骨子形式',
    description: '1800字答案の章立てに使う',
  },
  {
    id: 'shortMemo',
    label: '600字答案メモ形式',
    description: '短い答案練習や要約に使う',
  },
];

const qualityChecks = [
  '設問(1)で課題3つが明確である',
  '課題が抽象語だけで終わっていない',
  '課題3つの観点が分かれている',
  '最重要課題が課題3つの中から選ばれている',
  '最重要課題の選定理由が、影響範囲・根本性・波及性などで説明されている',
  '解決策が最重要課題に直接対応している',
  '解決策が「誰が・何を・どのように・どの指標で」実施するかを意識している',
  'リスクが施策実施後に新たに生じる副作用になっている',
  '対策がリスクに一対一で対応している',
  '技術者倫理・社会の持続可能性がテーマ固有の具体語で書かれている',
];

const expressionExamples = [
  {
    shallow: 'DXを推進する',
    improved: '品質・生産・保全データを横断的に活用し、工程異常の早期把握と改善判断につなげる',
  },
  {
    shallow: '人材育成を行う',
    improved: '現場リーダーがデータを用いて改善判断できるよう、スキルマップと教育訓練体系を整備する',
  },
  {
    shallow: 'リスクに注意する',
    improved: 'データ入力が形骸化するリスクに対し、入力ルールの標準化、責任者設定、定期監査を行う',
  },
];

const initialRequirements: ProblemRequirements = {
  theme: '',
  target: '',
  role: '',
  constraints: '',
  questionOne: '',
  questionTwo: '',
  questionThree: '',
  questionFour: '',
};

const initialIssues: IssueInput[] = [
  { viewpoint: '', problem: '', technicalIssue: '', detail: '' },
  { viewpoint: '', problem: '', technicalIssue: '', detail: '' },
  { viewpoint: '', problem: '', technicalIssue: '', detail: '' },
];

const initialSolution: SolutionInput = {
  solutionOne: '',
  solutionTwo: '',
  solutionThree: '',
  methods: '',
};

const initialRisk: RiskInput = {
  effect: '',
  risk: '',
  trouble: '',
  countermeasure: '',
};

const initialEthics: EthicsInput = {
  ethicsViewpoint: '',
  ethicsDetail: '',
  sustainabilityViewpoint: '',
  sustainabilityDetail: '',
};

function valueOrBlank(value: string) {
  return value.trim() || '未入力';
}

function ChipList({ chips }: { chips: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {chip}
        </span>
      ))}
    </div>
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
  onChange: (value: string) => void;
  placeholder?: string;
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
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
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

export default function AnswerStructureBuilder() {
  const [requirements, setRequirements] = useState<ProblemRequirements>(initialRequirements);
  const [issues, setIssues] = useState<IssueInput[]>(initialIssues);
  const [priorityIssue, setPriorityIssue] = useState('');
  const [priorityReason, setPriorityReason] = useState('');
  const [solution, setSolution] = useState<SolutionInput>(initialSolution);
  const [risk, setRisk] = useState<RiskInput>(initialRisk);
  const [ethics, setEthics] = useState<EthicsInput>(initialEthics);
  const [handoffMemo, setHandoffMemo] = useState('');
  const [handoffOpen, setHandoffOpen] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('sheet');
  const [copyMessage, setCopyMessage] = useState('');

  const structureSheetText = useMemo(() => {
    const issueLines = issues
      .map((issue, index) => {
        return `観点${index + 1}：${valueOrBlank(issue.viewpoint)}
問題点${index + 1}：${valueOrBlank(issue.problem)}
技術課題${index + 1}：${valueOrBlank(issue.technicalIssue)}
課題${index + 1}の内容：${valueOrBlank(issue.detail)}`;
      })
      .join('\n\n');

    return `【問題文の要求整理】
テーマ：${valueOrBlank(requirements.theme)}
対象企業・対象業務：${valueOrBlank(requirements.target)}
自分の立場：${valueOrBlank(requirements.role)}
制約条件・前提条件：${valueOrBlank(requirements.constraints)}

【設問(1)：課題抽出】
${issueLines}

【設問(2)：最重要課題と解決策】
最重要課題：${valueOrBlank(priorityIssue)}
選定理由：${valueOrBlank(priorityReason)}
解決策1：${valueOrBlank(solution.solutionOne)}
解決策2：${valueOrBlank(solution.solutionTwo)}
解決策3：${valueOrBlank(solution.solutionThree)}
使用する経営工学・品質管理手法：${valueOrBlank(solution.methods)}

【設問(3)：波及効果・リスク・対策】
期待される波及効果：${valueOrBlank(risk.effect)}
新たに生じうるリスク：${valueOrBlank(risk.risk)}
発生しうるトラブル：${valueOrBlank(risk.trouble)}
リスクへの対策：${valueOrBlank(risk.countermeasure)}

【設問(4)：技術者倫理・社会の持続可能性】
技術者倫理の観点：${valueOrBlank(ethics.ethicsViewpoint)}
技術者倫理上の具体的な留意点：${valueOrBlank(ethics.ethicsDetail)}
社会の持続可能性の観点：${valueOrBlank(ethics.sustainabilityViewpoint)}
社会の持続可能性上の具体的な留意点：${valueOrBlank(ethics.sustainabilityDetail)}`;
  }, [ethics, issues, priorityIssue, priorityReason, requirements, risk, solution]);

  const outlineText = useMemo(() => {
    return `1. 課題
本テーマに対して、以下の3つの技術課題がある。

第一に、${valueOrBlank(issues[0]?.technicalIssue ?? '')}である。
これは、${valueOrBlank(issues[0]?.problem ?? '')}が問題点であり、${valueOrBlank(issues[0]?.detail ?? '')}につながるためである。

第二に、${valueOrBlank(issues[1]?.technicalIssue ?? '')}である。
これは、${valueOrBlank(issues[1]?.problem ?? '')}が問題点であり、${valueOrBlank(issues[1]?.detail ?? '')}につながるためである。

第三に、${valueOrBlank(issues[2]?.technicalIssue ?? '')}である。
これは、${valueOrBlank(issues[2]?.problem ?? '')}が問題点であり、${valueOrBlank(issues[2]?.detail ?? '')}につながるためである。

2. 最重要課題と解決策
最重要課題は、${valueOrBlank(priorityIssue)}である。
理由は、${valueOrBlank(priorityReason)}である。

解決策として、以下の3点を実施する。
第一に、${valueOrBlank(solution.solutionOne)}。
第二に、${valueOrBlank(solution.solutionTwo)}。
第三に、${valueOrBlank(solution.solutionThree)}。

これらの施策では、${valueOrBlank(solution.methods)}などの経営工学・品質管理手法を活用する。

3. リスクと対策
上記施策により、${valueOrBlank(risk.effect)}の効果が期待できる。
一方で、${valueOrBlank(risk.risk)}のリスクがある。
これに対して、${valueOrBlank(risk.countermeasure)}により対策する。

4. 技術者倫理・社会の持続可能性
技術者倫理上、${valueOrBlank(ethics.ethicsDetail)}に留意する。
また、社会の持続可能性の観点から、${valueOrBlank(ethics.sustainabilityDetail)}を重視する。`;
  }, [ethics.ethicsDetail, ethics.sustainabilityDetail, issues, priorityIssue, priorityReason, risk.countermeasure, risk.effect, risk.risk, solution]);

  const shortMemoText = useMemo(() => {
    return `背景：
${valueOrBlank(requirements.theme)}について、${valueOrBlank(requirements.constraints)}

課題：
課題は、①${valueOrBlank(issues[0]?.technicalIssue ?? '')}、②${valueOrBlank(issues[1]?.technicalIssue ?? '')}、③${valueOrBlank(issues[2]?.technicalIssue ?? '')}である。

最重要課題：
最重要課題は${valueOrBlank(priorityIssue)}である。理由は${valueOrBlank(priorityReason)}である。

解決策：
解決策として、①${valueOrBlank(solution.solutionOne)}、②${valueOrBlank(solution.solutionTwo)}、③${valueOrBlank(solution.solutionThree)}を行う。

リスクと対策：
ただし、${valueOrBlank(risk.risk)}のリスクがあるため、${valueOrBlank(risk.countermeasure)}により対策する。

倫理・持続可能性：
技術者として${valueOrBlank(ethics.ethicsDetail)}に留意し、${valueOrBlank(ethics.sustainabilityDetail)}に配慮する。`;
  }, [ethics.ethicsDetail, ethics.sustainabilityDetail, issues, priorityIssue, priorityReason, requirements.constraints, requirements.theme, risk.countermeasure, risk.risk, solution]);

  const selectedPreviewText = useMemo(() => {
    if (outputFormat === 'outline') return outlineText;
    if (outputFormat === 'shortMemo') return shortMemoText;
    return structureSheetText;
  }, [outlineText, outputFormat, shortMemoText, structureSheetText]);

  const selectedFormat =
    outputFormats.find((format) => format.id === outputFormat) ?? {
      id: 'sheet' as const,
      label: '構造整理シート形式',
      description: '添削課題や答案作成前の整理に使う',
    };

  function updateRequirement(key: keyof ProblemRequirements, value: string) {
    setRequirements((current) => ({ ...current, [key]: value }));
  }

  function updateIssue(index: number, key: keyof IssueInput, value: string) {
    setIssues((current) => current.map((issue, issueIndex) => (issueIndex === index ? { ...issue, [key]: value } : issue)));
  }

  function updateSolution(key: keyof SolutionInput, value: string) {
    setSolution((current) => ({ ...current, [key]: value }));
  }

  function updateRisk(key: keyof RiskInput, value: string) {
    setRisk((current) => ({ ...current, [key]: value }));
  }

  function updateEthics(key: keyof EthicsInput, value: string) {
    setEthics((current) => ({ ...current, [key]: value }));
  }

  async function copyPreview() {
    setCopyMessage('');
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyMessage('コピー機能が使えない環境です。プレビュー欄から手動でコピーしてください。');
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedPreviewText);
      setCopyMessage('コピーしました。');
    } catch {
      setCopyMessage('コピーに失敗しました。プレビュー欄から手動でコピーしてください。');
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">技術士二次試験向け</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">技術士 答案骨子ビルダー</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          問題文の要求を分解し、課題、最重要課題、解決策、リスク、倫理・持続可能性までを一貫して整理するためのツールです。
          いきなり本文を書くのではなく、答案の骨格を先に作ることを目的とします。
        </p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">
          このツールは答案本文の自動作成ではなく、答案構成を整理するための補助ツールです。
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <h2 className="text-xl font-bold text-slate-950">課題分解マトリクスから続ける場合</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              課題分解マトリクスで作成した内容をコピーしている場合は、下のメモ欄に貼り付けてから、各入力欄に整理してください。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              今回は自動入力ではなく、内容を確認しながら手動で整理する方式にしています。問題文の要求と課題の対応を確認しながら、答案骨子へ展開してください。
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
                rows={8}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm leading-7 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <SectionCard
            step="Step 0"
            title="問題文の要求整理"
            note="問題文を読んだら、まず何を問われているかを分解します。ここがずれると、答案全体が題意から外れます。"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="theme" label="テーマ・問題名" value={requirements.theme} onChange={(value) => updateRequirement('theme', value)} />
              <TextField id="target" label="対象企業・対象業務" value={requirements.target} onChange={(value) => updateRequirement('target', value)} />
              <TextField id="role" label="自分の立場" value={requirements.role} onChange={(value) => updateRequirement('role', value)} />
              <TextField id="constraints" label="制約条件・前提条件" value={requirements.constraints} onChange={(value) => updateRequirement('constraints', value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextAreaField id="q1" label="設問(1)で求められていること" value={requirements.questionOne} onChange={(value) => updateRequirement('questionOne', value)} />
              <TextAreaField id="q2" label="設問(2)で求められていること" value={requirements.questionTwo} onChange={(value) => updateRequirement('questionTwo', value)} />
              <TextAreaField id="q3" label="設問(3)で求められていること" value={requirements.questionThree} onChange={(value) => updateRequirement('questionThree', value)} />
              <TextAreaField id="q4" label="設問(4)で求められていること" value={requirements.questionFour} onChange={(value) => updateRequirement('questionFour', value)} />
            </div>
          </SectionCard>

          <SectionCard
            step="Step 1"
            title="課題3つの抽出"
            note="問題点は現状の困りごと、技術課題は技術者として取り組むべき管理・改善対象として書きます。抽象語だけで終わらせないことが重要です。"
          >
            <div>
              <p className="text-sm font-bold text-slate-800">観点候補</p>
              <ChipList chips={viewpointChips} />
            </div>
            {issues.map((issue, index) => (
              <div key={`issue-${index + 1}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-bold">課題 {index + 1}</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <TextField id={`issue-${index}-viewpoint`} label="観点" value={issue.viewpoint} onChange={(value) => updateIssue(index, 'viewpoint', value)} />
                  <TextField id={`issue-${index}-technical`} label="技術課題" value={issue.technicalIssue} onChange={(value) => updateIssue(index, 'technicalIssue', value)} />
                  <TextAreaField id={`issue-${index}-problem`} label="問題点" value={issue.problem} onChange={(value) => updateIssue(index, 'problem', value)} />
                  <TextAreaField id={`issue-${index}-detail`} label="課題の内容" value={issue.detail} onChange={(value) => updateIssue(index, 'detail', value)} />
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard
            step="Step 2"
            title="最重要課題の選定"
            note="最重要課題は、Step 1で抽出した3課題の中から選びます。選定理由は、影響範囲、根本性、波及性、緊急性、実現可能性、経営効果などで説明します。"
          >
            <ChipList chips={reasonChips} />
            <TextField id="priority" label="最重要課題" value={priorityIssue} onChange={setPriorityIssue} />
            <TextAreaField id="priority-reason" label="選定理由" value={priorityReason} onChange={setPriorityReason} rows={4} />
          </SectionCard>

          <SectionCard
            step="Step 3"
            title="解決策"
            note="解決策は最重要課題に直接対応させます。誰が、何を、どのように、どの指標で管理するかを意識します。"
          >
            <div>
              <p className="text-sm font-bold text-slate-800">手法候補</p>
              <ChipList chips={methodChips} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <TextAreaField id="solution-1" label="解決策1" value={solution.solutionOne} onChange={(value) => updateSolution('solutionOne', value)} />
              <TextAreaField id="solution-2" label="解決策2" value={solution.solutionTwo} onChange={(value) => updateSolution('solutionTwo', value)} />
              <TextAreaField id="solution-3" label="解決策3" value={solution.solutionThree} onChange={(value) => updateSolution('solutionThree', value)} />
            </div>
            <TextAreaField id="methods" label="使用する経営工学・品質管理手法" value={solution.methods} onChange={(value) => updateSolution('methods', value)} />
          </SectionCard>

          <SectionCard
            step="Step 4"
            title="リスクと対策"
            note="リスクは現状課題の繰り返しではなく、解決策を実施した後に新たに生じる副作用として書きます。対策はリスクに一対一で対応させます。"
          >
            <div>
              <p className="text-sm font-bold text-slate-800">リスク観点候補</p>
              <ChipList chips={riskChips} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextAreaField id="effect" label="期待される波及効果" value={risk.effect} onChange={(value) => updateRisk('effect', value)} />
              <TextAreaField id="risk" label="新たに生じうるリスク" value={risk.risk} onChange={(value) => updateRisk('risk', value)} />
              <TextAreaField id="trouble" label="発生しうるトラブル" value={risk.trouble} onChange={(value) => updateRisk('trouble', value)} />
              <TextAreaField id="countermeasure" label="リスクへの対策" value={risk.countermeasure} onChange={(value) => updateRisk('countermeasure', value)} />
            </div>
          </SectionCard>

          <SectionCard
            step="Step 5"
            title="技術者倫理・社会の持続可能性"
            note="倫理・持続可能性は取ってつけた表現にせず、テーマ固有の具体語で書きます。"
          >
            <div>
              <p className="text-sm font-bold text-slate-800">観点候補</p>
              <ChipList chips={ethicsChips} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="ethics-viewpoint" label="技術者倫理の観点" value={ethics.ethicsViewpoint} onChange={(value) => updateEthics('ethicsViewpoint', value)} />
              <TextAreaField id="ethics-detail" label="技術者倫理上の具体的な留意点" value={ethics.ethicsDetail} onChange={(value) => updateEthics('ethicsDetail', value)} />
              <TextField id="sustainability-viewpoint" label="社会の持続可能性の観点" value={ethics.sustainabilityViewpoint} onChange={(value) => updateEthics('sustainabilityViewpoint', value)} />
              <TextAreaField id="sustainability-detail" label="社会の持続可能性上の具体的な留意点" value={ethics.sustainabilityDetail} onChange={(value) => updateEthics('sustainabilityDetail', value)} />
            </div>
          </SectionCard>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <h2 className="text-xl font-bold">答案骨子プレビュー</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">入力内容を、目的に応じた形式で確認できます。</p>
            <div className="mt-4 grid gap-2">
              {outputFormats.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => {
                    setOutputFormat(format.id);
                    setCopyMessage('');
                  }}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${
                    outputFormat === format.id
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-emerald-200 bg-white text-slate-800 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
            <p className="mt-3 rounded-lg border border-emerald-200 bg-white p-3 text-sm leading-7 text-slate-700">
              {selectedFormat.label}：{selectedFormat.description}
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-950">この出力の使い方</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>構造整理シート形式：答案を書く前の設問対応確認に使う</li>
                <li>答案骨子形式：1800字答案の章立てに使う</li>
                <li>600字答案メモ形式：短い答案練習や論点整理に使う</li>
              </ul>
            </div>
            <textarea
              readOnly
              value={selectedPreviewText}
              className="mt-4 min-h-[560px] w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-sm leading-6 text-slate-900"
            />
            <button type="button" onClick={copyPreview} className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800">
              選択中の形式でコピー
            </button>
            {copyMessage && <p className="mt-3 text-sm font-semibold text-emerald-800">{copyMessage}</p>}
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-bold text-slate-950">なぜこの構成にするか</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                答案は、問題点 → 技術課題 → 最重要課題 → 解決策 → 施策後リスク → 倫理・持続可能性の順に一貫して展開する必要があります。
                単なる模範解答を読むのではなく、この構造を理解して別テーマに転用できることを目的とします。
              </p>
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-bold text-slate-950">答案品質の確認ポイント</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {qualityChecks.map((check) => (
                  <li key={check} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-bold text-slate-950">浅い表現と改善表現</h3>
              <div className="mt-3 space-y-3">
                {expressionExamples.map((example) => (
                  <div key={example.shallow} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6">
                    <p>
                      <span className="font-bold text-slate-950">浅い表現：</span>
                      <span className="text-slate-700">{example.shallow}</span>
                    </p>
                    <p className="mt-2">
                      <span className="font-bold text-emerald-800">改善表現：</span>
                      <span className="text-slate-700">{example.improved}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
