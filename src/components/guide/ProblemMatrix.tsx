'use client';

import React, { useMemo, useState } from 'react';

type Issue = {
  id: string;
  area: string;
  title: string;
  description: string;
};

const theme = '製造業DX';

const issues: Issue[] = [
  {
    id: 'talent-silo',
    area: '人材・組織',
    title: '現場とIT部門の分断',
    description: '現場課題をIT施策へ翻訳できる人材が不足し、DXが部分最適になりやすい。',
  },
  {
    id: 'talent-literacy',
    area: '人材・組織',
    title: 'デジタルリテラシーのばらつき',
    description: '部門や職位によってデータ活用力に差があり、定着が進みにくい。',
  },
  {
    id: 'process-standard',
    area: '業務プロセス',
    title: '業務標準が未整備',
    description: '作業手順や判断基準が属人化し、システム化しても効果が出にくい。',
  },
  {
    id: 'process-local',
    area: '業務プロセス',
    title: '部門ごとの個別最適',
    description: '調達、生産、品質、物流が別々に改善され、全体最適につながりにくい。',
  },
  {
    id: 'data-master',
    area: '情報・データ',
    title: 'マスタデータの不整合',
    description: '品目、設備、工程、不良分類の定義が揃わず、分析結果の信頼性が低下する。',
  },
  {
    id: 'data-realtime',
    area: '情報・データ',
    title: 'リアルタイム性の不足',
    description: '現場データの収集が遅れ、異常検知や迅速な意思決定に活用しづらい。',
  },
  {
    id: 'equipment-legacy',
    area: '設備・現場',
    title: '既存設備との接続困難',
    description: '古い設備や独自仕様の装置が多く、データ取得や連携に制約がある。',
  },
  {
    id: 'equipment-maintenance',
    area: '設備・現場',
    title: '保全データの未活用',
    description: '故障履歴や点検記録が蓄積されても、予兆保全や改善に結びついていない。',
  },
  {
    id: 'quality-traceability',
    area: '品質',
    title: '品質トレーサビリティ不足',
    description: 'ロット、工程条件、検査結果のひも付けが弱く、不良原因の追跡に時間がかかる。',
  },
  {
    id: 'quality-kpi',
    area: '品質',
    title: '品質KPIの分断',
    description: '工程内不良、顧客クレーム、監査指摘が別管理で、改善優先度が見えにくい。',
  },
  {
    id: 'scm-visibility',
    area: 'サプライチェーン',
    title: '供給リスクの見える化不足',
    description: '調達先、在庫、納期遅延の情報がつながらず、変動への対応が後手になる。',
  },
  {
    id: 'scm-demand',
    area: 'サプライチェーン',
    title: '需要変動への追従不足',
    description: '販売計画と生産計画の連携が弱く、欠品や過剰在庫が発生しやすい。',
  },
  {
    id: 'management-roi',
    area: '経営',
    title: 'DX投資効果が不明確',
    description: '投資目的、評価指標、回収シナリオが曖昧で、継続投資の判断が難しい。',
  },
  {
    id: 'management-governance',
    area: '経営',
    title: '推進ガバナンス不足',
    description: '経営方針と現場施策がつながらず、DX推進が個別プロジェクトで止まりやすい。',
  },
  {
    id: 'society-security',
    area: '社会・制度',
    title: 'セキュリティ・規制対応',
    description: '外部接続やクラウド活用に伴い、情報セキュリティと法規制対応が重要になる。',
  },
  {
    id: 'society-sustainability',
    area: '社会・制度',
    title: 'サステナビリティ対応',
    description: 'CO2排出量、資源循環、人権など、社会的要請をデータで説明する必要が高まる。',
  },
];

const areas = ['人材・組織', '業務プロセス', '情報・データ', '設備・現場', '品質', 'サプライチェーン', '経営', '社会・制度'];

export default function ProblemMatrix() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [priorityId, setPriorityId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedIssues = useMemo(
    () => selectedIds.map((id) => issues.find((issue) => issue.id === id)).filter((issue): issue is Issue => Boolean(issue)),
    [selectedIds]
  );

  const priorityIssue = useMemo(
    () => issues.find((issue) => issue.id === priorityId),
    [priorityId]
  );

  const outline = useMemo(() => {
    const issueLines = selectedIssues.map((issue, index) => `${index + 1}. ${issue.area}: ${issue.title} - ${issue.description}`);
    return [
      `テーマ: ${theme}`,
      '',
      '抽出した課題:',
      issueLines.length > 0 ? issueLines.join('\n') : '未選択',
      '',
      `最重要課題: ${priorityIssue ? `${priorityIssue.area}: ${priorityIssue.title}` : '未選択'}`,
      '',
      `最重要課題とした理由: ${reason.trim() || '未入力'}`,
      '',
      '答案骨子:',
      `製造業DXを推進するには、${priorityIssue ? priorityIssue.title : '最重要課題'}を中心課題として捉える必要がある。`,
      'その理由は、個別最適のDXでは現場改善やQMS改善に接続しにくく、経営工学の観点から人・プロセス・データ・設備を統合して考える必要があるためである。',
      '対応策として、課題の優先順位を明確化し、関係部門を横断した標準化、データ整備、効果指標の設定を進める。',
    ].join('\n');
  }, [priorityIssue, reason, selectedIssues]);

  const toggleIssue = (id: string) => {
    setCopied(false);
    setSelectedIds((current) => {
      if (current.includes(id)) {
        const next = current.filter((item) => item !== id);
        if (priorityId === id) setPriorityId('');
        return next;
      }
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const copyOutline = async () => {
    await navigator.clipboard.writeText(outline);
    setCopied(true);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">PROBLEM MATRIX</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-5xl">課題分解マトリクス</h1>
        <p className="mt-4 max-w-3xl leading-8 text-slate-600">
          テーマ「製造業DX」について、経営工学の8つの観点から課題を分解します。
          最大3つの課題を選び、最重要課題と理由を整理すると、技術士答案の骨子に変換できます。
        </p>
      </div>

      <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
        <h2 className="text-xl font-bold text-slate-900">使い方</h2>
        <ol className="mt-3 grid gap-3 md:grid-cols-3">
          <li className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-600">1. 8つの観点から課題を最大3つ選ぶ</li>
          <li className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-600">2. 最重要課題を1つ選び、理由を書く</li>
          <li className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-600">3. 答案骨子をコピーして論述練習に使う</li>
        </ol>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">THEME</p>
            <h2 className="text-2xl font-bold text-slate-900">{theme}</h2>
          </div>
          <p className="text-sm text-slate-600">選択中: {selectedIds.length} / 3</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {areas.map((area) => (
            <div key={area} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">{area}</h3>
              <div className="mt-3 space-y-3">
                {issues
                  .filter((issue) => issue.area === area)
                  .map((issue) => {
                    const selected = selectedIds.includes(issue.id);
                    const disabled = !selected && selectedIds.length >= 3;
                    return (
                      <button
                        key={issue.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleIssue(issue.id)}
                        className={[
                          'w-full rounded-lg border p-4 text-left transition',
                          selected ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-500',
                          disabled ? 'cursor-not-allowed opacity-50' : '',
                        ].join(' ')}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-slate-900">{issue.title}</span>
                          <span className={selected ? 'rounded-md bg-teal-600 px-2 py-1 text-xs font-semibold text-white' : 'rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500'}>
                            {selected ? '選択中' : '選択'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{issue.description}</p>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">最重要課題を選ぶ</h2>
          <div className="mt-4 space-y-3">
            {selectedIssues.length > 0 ? (
              selectedIssues.map((issue) => (
                <label key={issue.id} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                  <input
                    type="radio"
                    name="priorityIssue"
                    checked={priorityId === issue.id}
                    onChange={() => setPriorityId(issue.id)}
                  />
                  <span>
                    <span className="block font-semibold text-slate-900">{issue.title}</span>
                    <span className="text-sm text-slate-600">{issue.area}</span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-500">先に課題カードを選択してください。</p>
            )}
          </div>

          <label className="mt-5 block">
            <span className="font-semibold text-slate-900">理由</span>
            <textarea
              value={reason}
              onChange={(event) => {
                setCopied(false);
                setReason(event.target.value);
              }}
              rows={5}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm"
              placeholder="例: 部門横断でデータ定義が揃っていないため、品質改善やQMS改善に必要な原因追跡が遅れるから。"
            />
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">答案骨子</h2>
            <button
              type="button"
              onClick={copyOutline}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              コピー
            </button>
          </div>
          <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {outline}
          </pre>
          {copied ? <p className="mt-3 text-sm font-semibold text-teal-700">コピーしました。</p> : null}
        </div>
      </div>
    </section>
  );
}
