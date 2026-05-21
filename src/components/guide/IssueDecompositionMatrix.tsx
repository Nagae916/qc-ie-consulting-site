'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type FieldKey =
  | 'background'
  | 'currentProblem'
  | 'cause'
  | 'impact'
  | 'issue'
  | 'priorityIssue'
  | 'solution'
  | 'effect'
  | 'risk'
  | 'riskCountermeasure'
  | 'ethics'
  | 'sustainability';

type MatrixField = {
  key: FieldKey;
  label: string;
  placeholder: string;
  answerUse: string;
};

const fields: MatrixField[] = [
  {
    key: 'background',
    label: '問題背景',
    placeholder: '例）人手不足により、熟練者依存の生産管理が限界に近づいている',
    answerUse: '答案の冒頭で、なぜこのテーマが重要かを示します。',
  },
  {
    key: 'currentProblem',
    label: '現状の問題',
    placeholder: '例）作業実績や設備停止のデータが部門ごとに分断されている',
    answerUse: '課題抽出の前提として、現場で起きている困りごとを示します。',
  },
  {
    key: 'cause',
    label: '原因',
    placeholder: '例）標準作業、データ定義、教育計画が整備されていない',
    answerUse: '課題が表面的な指摘で終わらないよう、根本要因を補強します。',
  },
  {
    key: 'impact',
    label: '影響',
    placeholder: '例）品質ばらつき、納期遅延、現場負荷増大につながる',
    answerUse: '課題の重要性と、放置した場合の影響を説明します。',
  },
  {
    key: 'issue',
    label: '課題',
    placeholder: '例）作業標準と実績データを整備し、属人化を低減すること',
    answerUse: '多面的な課題として答案の中心に置きます。',
  },
  {
    key: 'priorityIssue',
    label: '最重要課題',
    placeholder: '例）データに基づく現場改善の仕組みを構築すること',
    answerUse: '設問で最重要課題を求められたときの中心になります。',
  },
  {
    key: 'solution',
    label: '解決策',
    placeholder: '例）標準作業、OEE、教育計画を連動させて改善する',
    answerUse: '経営工学の手法を、実行可能な施策として説明します。',
  },
  {
    key: 'effect',
    label: '効果',
    placeholder: '例）設備停止時間、不良率、教育完了率をKPIで確認する',
    answerUse: '施策の有効性を、KPIやQCDへの効果で示します。',
  },
  {
    key: 'risk',
    label: 'リスク',
    placeholder: '例）データ入力負荷が増え、現場に定着しないおそれがある',
    answerUse: '解決策の副作用や失敗要因を答案後半で示します。',
  },
  {
    key: 'riskCountermeasure',
    label: 'リスク対策',
    placeholder: '例）入力項目を絞り、日次レビューと教育で運用を定着させる',
    answerUse: 'リスクを放置せず、具体的な対策まで説明します。',
  },
  {
    key: 'ethics',
    label: '技術者倫理',
    placeholder: '例）データ改ざんを防ぎ、顧客と社会への説明責任を果たす',
    answerUse: '必須科目Ⅰや選択科目Ⅲで、技術者としての判断を示します。',
  },
  {
    key: 'sustainability',
    label: '社会の持続可能性',
    placeholder: '例）安定供給、労働負荷低減、環境負荷低減を両立する',
    answerUse: '答案の締めで、社会への影響と持続可能性に接続します。',
  },
];

const initialValues = fields.reduce<Record<FieldKey, string>>((acc, field) => {
  acc[field.key] = '';
  return acc;
}, {} as Record<FieldKey, string>);

const sampleThemes = [
  {
    title: '供給制約・人手不足',
    hint: '人材、標準化、OEE、技能継承を組み合わせやすいテーマです。',
  },
  {
    title: '物流2024年問題',
    hint: '荷待ち、輸送能力、SCM、モーダルシフトへ展開しやすいテーマです。',
  },
  {
    title: 'QMS再構築',
    hint: '品質不正、記録、内部監査、CAPA、技術者倫理へ接続しやすいテーマです。',
  },
];

function filledOrPlaceholder(value: string, placeholder: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : `（${placeholder.replace(/^例）/, '')}）`;
}

export default function IssueDecompositionMatrix() {
  const [values, setValues] = useState<Record<FieldKey, string>>(initialValues);
  const [copyMessage, setCopyMessage] = useState('');

  const filledCount = fields.filter((field) => values[field.key].trim().length > 0).length;

  const previewText = useMemo(() => {
    return `1. 背景
${filledOrPlaceholder(values.background, fields.find((field) => field.key === 'background')?.placeholder ?? '')}

2. 抽出した課題
現状の問題：${filledOrPlaceholder(values.currentProblem, fields.find((field) => field.key === 'currentProblem')?.placeholder ?? '')}
原因：${filledOrPlaceholder(values.cause, fields.find((field) => field.key === 'cause')?.placeholder ?? '')}
影響：${filledOrPlaceholder(values.impact, fields.find((field) => field.key === 'impact')?.placeholder ?? '')}
課題：${filledOrPlaceholder(values.issue, fields.find((field) => field.key === 'issue')?.placeholder ?? '')}

3. 最重要課題
${filledOrPlaceholder(values.priorityIssue, fields.find((field) => field.key === 'priorityIssue')?.placeholder ?? '')}

4. 解決策
${filledOrPlaceholder(values.solution, fields.find((field) => field.key === 'solution')?.placeholder ?? '')}

5. 期待効果
${filledOrPlaceholder(values.effect, fields.find((field) => field.key === 'effect')?.placeholder ?? '')}

6. リスクと対策
リスク：${filledOrPlaceholder(values.risk, fields.find((field) => field.key === 'risk')?.placeholder ?? '')}
対策：${filledOrPlaceholder(values.riskCountermeasure, fields.find((field) => field.key === 'riskCountermeasure')?.placeholder ?? '')}

7. 技術者倫理・社会の持続可能性
倫理：${filledOrPlaceholder(values.ethics, fields.find((field) => field.key === 'ethics')?.placeholder ?? '')}
持続可能性：${filledOrPlaceholder(values.sustainability, fields.find((field) => field.key === 'sustainability')?.placeholder ?? '')}`;
  }, [values]);

  function updateValue(key: FieldKey, nextValue: string) {
    setCopyMessage('');
    setValues((current) => ({ ...current, [key]: nextValue }));
  }

  function applySampleTheme(title: string) {
    setCopyMessage('');
    if (title === '供給制約・人手不足') {
      setValues({
        background: '生産年齢人口の減少により、製造現場では熟練者依存と人員不足が進んでいる。',
        currentProblem: '作業方法や判断基準が属人化し、品質ばらつきと納期遅延が発生している。',
        cause: '標準作業、教育計画、設備稼働データの整備が不十分である。',
        impact: '供給能力が低下し、顧客への安定供給と現場の安全性に影響する。',
        issue: '標準化とデータ活用により、属人化を低減すること。',
        priorityIssue: '作業標準と実績データを連動させた改善基盤を構築すること。',
        solution: '標準作業、OEE、教育計画を整備し、KPIで改善状況を確認する。',
        effect: '不良率、停止時間、教育完了率を改善し、供給能力を安定させる。',
        risk: '記録負荷が増え、現場に定着しないおそれがある。',
        riskCountermeasure: '入力項目を絞り、日次確認と教育により運用を定着させる。',
        ethics: 'データを適正に扱い、品質と安全に関する説明責任を果たす。',
        sustainability: '安定供給と労働負荷低減を両立し、持続的な生産体制を作る。',
      });
      return;
    }

    if (title === '物流2024年問題') {
      setValues({
        background: '時間外労働規制により、物流能力の制約と輸送コスト上昇が顕在化している。',
        currentProblem: '荷待ち、低積載率、出荷頻度の多さにより、輸送効率が低下している。',
        cause: '販売、生産、物流の計画が分断され、出荷平準化と共同配送の検討が不足している。',
        impact: '納期遅延、物流費増加、CO2排出増加が生じる。',
        issue: '荷主側の計画と物流運用を連動させ、輸送効率を高めること。',
        priorityIssue: 'SCM全体で出荷計画と輸送能力を整合させること。',
        solution: 'TMS、WMS、共同配送、モーダルシフトを組み合わせて改善する。',
        effect: '積載率、納期遵守率、物流費、CO2排出量を確認する。',
        risk: '効率化を急ぐと欠品や顧客サービス低下を招くおそれがある。',
        riskCountermeasure: '重点顧客、重要品目を区分し、段階的に運用を切り替える。',
        ethics: '取引先やドライバーに過度な負荷をかけない運用を設計する。',
        sustainability: '安定供給と環境負荷低減を両立する物流体制へつなげる。',
      });
      return;
    }

    setValues({
      background: '品質不正や顧客要求の高度化により、QMSの実効性が問われている。',
      currentProblem: '文書や記録はあるが、現場改善や再発防止に十分つながっていない。',
      cause: 'プロセス管理、内部監査、CAPA、品質KPIの連動が弱い。',
      impact: '不良再発、顧客信頼低下、説明責任不足につながる。',
      issue: 'QMSを形式運用から、改善と再発防止に使える仕組みに変えること。',
      priorityIssue: '品質KPIとCAPAを連動させ、再発防止を定着させること。',
      solution: 'プロセスアプローチ、FMEA、内部監査、CAPAを組み合わせて改善する。',
      effect: '不良率、CAPA完了率、再発率、監査指摘の改善状況を確認する。',
      risk: '手続きが増え、現場が形式対応に流れるおそれがある。',
      riskCountermeasure: '重要リスクに絞って運用し、監査を改善提案型にする。',
      ethics: '記録改ざんを防ぎ、顧客安全と公益を優先する。',
      sustainability: '信頼される品質保証体制により、長期的な事業継続へつなげる。',
    });
  }

  async function copyPreview() {
    setCopyMessage('');
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyMessage('コピー機能が使えない環境です。プレビュー欄から手動でコピーしてください。');
      return;
    }

    try {
      await navigator.clipboard.writeText(previewText);
      setCopyMessage('答案骨子プレビューをコピーしました。');
    } catch {
      setCopyMessage('コピーに失敗しました。プレビュー欄から手動でコピーしてください。');
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">課題抽出から答案骨子へ</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">課題を答案骨子に変えるページ</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          問題文から読み取った背景をもとに、課題、原因、解決策、リスク、倫理・持続可能性を整理します。
          入力した内容は、必須科目Ⅰや選択科目Ⅲの答案骨子に使えます。
        </p>
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <h2 className="text-base font-bold text-slate-950">このページでできること</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            問題背景を入力し、課題を分解し、解決策とリスクまで整理して、答案骨子としてコピーできます。
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">Step 1</p>
          <h2 className="mt-2 text-lg font-bold">問題の背景を入れる</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">社会背景、業界課題、自社・現場の状況を短く書きます。</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">Step 2</p>
          <h2 className="mt-2 text-lg font-bold">課題を分解する</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">何が問題か、なぜ起きているか、誰に影響するかを整理します。</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-700">Step 3</p>
          <h2 className="mt-2 text-lg font-bold">答案骨子に変える</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">最重要課題、解決策、効果、リスク、倫理・持続可能性へ展開します。</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <h2 className="text-xl font-bold">入力の流れ</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
          {['問題背景', '現状の問題', '原因', '課題', '解決策', 'リスク', '倫理・持続可能性', '答案骨子'].map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              <span className={index === 7 ? 'rounded-full bg-emerald-700 px-3 py-1 text-white' : 'rounded-full border border-slate-200 bg-white px-3 py-1'}>
                {item}
              </span>
              {index < 7 && <span className="text-slate-400">→</span>}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">テーマ例から始める</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">空欄から始めにくい場合は、テーマ例を入れてから自分の問題に合わせて直してください。</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {sampleThemes.map((theme) => (
                <button
                  key={theme.title}
                  type="button"
                  onClick={() => applySampleTheme(theme.title)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <span className="font-bold text-slate-950">{theme.title}</span>
                  <span className="mt-2 block text-xs leading-6 text-slate-600">{theme.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-sm font-bold text-slate-950">{field.label}</span>
                <span className="mt-1 block text-xs leading-6 text-slate-500">答案での使い道：{field.answerUse}</span>
                <textarea
                  value={values[field.key]}
                  onChange={(event) => updateValue(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className="mt-3 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-7 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            ))}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <h2 className="text-xl font-bold">答案骨子プレビュー</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              入力済み項目：{filledCount} / {fields.length}。このプレビューで、入力内容が最終答案のどこに使われるかを確認します。
            </p>
            <textarea
              readOnly
              value={previewText}
              className="mt-4 min-h-[34rem] w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-sm leading-6 text-slate-900"
            />
            <button type="button" onClick={copyPreview} className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800">
              答案骨子をコピーする
            </button>
            {copyMessage && <p className="mt-3 text-sm font-semibold text-emerald-800">{copyMessage}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">次に進む</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              <Link className="block rounded-lg border border-slate-200 px-4 py-3 text-emerald-700 hover:bg-emerald-50" href="/guides/engineer/answer-structure-builder">
                答案骨子ビルダーで型に当てはめる
              </Link>
              <Link className="block rounded-lg border border-slate-200 px-4 py-3 text-emerald-700 hover:bg-emerald-50" href="/guides/engineer/model-answer-examples">
                模範答案例で書き方を確認する
              </Link>
              <Link className="block rounded-lg border border-slate-200 px-4 py-3 text-emerald-700 hover:bg-emerald-50" href="/guides/engineer/practice">
                問題演習へ進む
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
