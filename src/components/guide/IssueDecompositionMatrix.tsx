'use client';

import { useMemo, useState } from 'react';

const viewpoints = [
  '人材・組織',
  '業務プロセス',
  '情報・データ',
  '設備・現場',
  '品質',
  'サプライチェーン',
  '経営',
  '社会・制度',
] as const;

type Viewpoint = (typeof viewpoints)[number];
type AnswerUsefulness = '高' | '中';
type Filter = Viewpoint | 'すべて';

type IssueCard = {
  id: string;
  viewpoint: Viewpoint;
  title: string;
  background: string;
  impact: string;
  methods: string;
  answerUsefulness: AnswerUsefulness;
};

type IssueTheme = {
  id: string;
  title: string;
  description: string;
  questionText: string;
  examTags: string[];
  sourceTags: string[];
  lawOrPolicyTags: string[];
  issueCards: IssueCard[];
};

const themes: IssueTheme[] = [
  {
    id: 'manufacturing-dx',
    title: '製造業の持続的発展に向けたDX',
    description:
      '製造業におけるDXを、単なるIT導入ではなく、品質・生産・人材・データ・サプライチェーンをつなぐ経営工学上の課題として整理する。',
    questionText:
      '近年、製造業では人手不足、熟練技能の継承、品質保証体制の高度化、サプライチェーンの不確実性への対応が求められている。このような状況の中、製造業の持続的発展に向けてDXを推進するにあたり、技術者として多面的な観点から課題を3つ抽出し、最重要課題を1つ選定せよ。',
    examTags: ['必須科目Ⅰ', '選択科目Ⅲ', '経営工学', '生産マネジメント', 'サービスマネジメント'],
    sourceTags: ['ものづくり白書', 'DX白書', '労働経済白書'],
    lawOrPolicyTags: ['デジタルガバナンス', '経済安全保障', '人材育成', 'サプライチェーン強靭化'],
    issueCards: [
      {
        id: 'dx-talent',
        viewpoint: '人材・組織',
        title: 'DX推進人材の不足',
        background: '品質・生産・情報を横断して扱える人材が不足している',
        impact: 'DXが一部門のツール導入で終わり、現場改善に定着しない',
        methods: 'スキルマップ、教育訓練体系、標準化',
        answerUsefulness: '高',
      },
      {
        id: 'process-standardization',
        viewpoint: '業務プロセス',
        title: '業務標準化の不足',
        background: '紙・Excel・個人依存の業務が残り、データ取得の前提が整っていない',
        impact: '分析可能なデータが蓄積されず、改善活動が属人化する',
        methods: '業務フロー分析、ECRS、標準作業',
        answerUsefulness: '高',
      },
      {
        id: 'data-silo',
        viewpoint: '情報・データ',
        title: 'データの部門分断',
        background: '品質・生産・在庫・購買のデータが別々に管理されている',
        impact: '全体最適の判断ができず、部分最適の改善に留まる',
        methods: 'KPI設計、データ標準化、マスタ統一',
        answerUsefulness: '高',
      },
      {
        id: 'equipment-data',
        viewpoint: '設備・現場',
        title: '設備データ取得基盤の不足',
        background: '旧設備が多く、稼働・停止・異常の情報を自動取得できない',
        impact: '設備停止や品質異常の予兆を把握できない',
        methods: 'IoT、TPM、予防保全',
        answerUsefulness: '中',
      },
      {
        id: 'quality-data',
        viewpoint: '品質',
        title: '品質データの活用不足',
        background: '不良記録はあるが、原因分析や未然防止に十分活用されていない',
        impact: '慢性不良や再発不良が残り、QMSが形骸化する',
        methods: 'QC七つ道具、管理図、FMEA、是正処置',
        answerUsefulness: '高',
      },
      {
        id: 'supply-chain-data',
        viewpoint: 'サプライチェーン',
        title: '社外連携データの不足',
        background: '需要、在庫、納期、調達リスクの情報共有が不十分である',
        impact: '欠品、過剰在庫、納期遅延が発生する',
        methods: 'S&OP、在庫管理、サプライヤ管理',
        answerUsefulness: '中',
      },
      {
        id: 'investment-priority',
        viewpoint: '経営',
        title: 'DX投資の優先順位が不明確',
        background: '投資判断に必要なKPIや費用対効果が整理されていない',
        impact: 'PoC止まりとなり、継続的な改善に結びつかない',
        methods: 'KPI設計、投資評価、ロードマップ管理',
        answerUsefulness: '高',
      },
      {
        id: 'security-compliance',
        viewpoint: '社会・制度',
        title: '情報セキュリティ・法規対応の不足',
        background: 'データ連携が進む一方で、情報管理や権限設計が追いついていない',
        impact: '情報漏えいや顧客信頼の低下につながる',
        methods: 'リスク管理、内部統制、情報管理',
        answerUsefulness: '中',
      },
    ],
  },
];

const futureThemes = [
  '物流2024年問題・物流効率化',
  '下請法・価格転嫁・取引適正化',
  'QMS再構築',
  '人材育成・技能伝承',
  'サプライチェーン強靭化',
  'カーボンニュートラル・GX',
  '生産性向上',
];

const reasonHints = ['影響範囲が広い', '根本原因に近い', '他課題への波及効果が大きい', '緊急性が高い', '実現可能性が高い'];
const answerBuilderHref = '/guides/engineer/answer-structure-builder';

function usefulnessClassName(value: AnswerUsefulness) {
  if (value === '高') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return 'border-amber-200 bg-amber-50 text-amber-800';
}

function TagGroup({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={`${title}-${tag}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function IssueDecompositionMatrix() {
  const theme = themes[0]!;
  const [activeFilter, setActiveFilter] = useState<Filter>('すべて');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [priorityId, setPriorityId] = useState('');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const displayedCards = useMemo(() => {
    if (activeFilter === 'すべて') return theme.issueCards;
    return theme.issueCards.filter((card) => card.viewpoint === activeFilter);
  }, [activeFilter, theme.issueCards]);

  const selectedCards = useMemo(() => {
    return selectedIds
      .map((id) => theme.issueCards.find((card) => card.id === id))
      .filter((card): card is IssueCard => Boolean(card));
  }, [selectedIds, theme.issueCards]);

  const priorityCard = selectedCards.find((card) => card.id === priorityId);
  const selectedViewpoints = selectedCards.map((card) => card.viewpoint);
  const uniqueViewpoints = Array.from(new Set(selectedViewpoints));

  const balanceComment = useMemo(() => {
    if (selectedCards.length === 0) return 'まずは気になる課題を最大3つ選び、多面的に見えているか確認しましょう。';
    if (selectedCards.length === 1) return '1つ目の課題を選べました。答案では、別観点の課題を加えると厚みが出ます。';
    if (uniqueViewpoints.length >= 3) return `${uniqueViewpoints.join(' / ')} の観点が含まれており、多面的な構成になっています。`;
    if (uniqueViewpoints.length === 1) return '同じ観点に偏っています。経営・社会・サプライチェーンなど別観点も検討してください。';
    return `${uniqueViewpoints.join(' / ')} の観点が含まれています。もう1つ別観点を加えると、課題抽出の説得力が増します。`;
  }, [selectedCards.length, uniqueViewpoints]);

  const outlineText = useMemo(() => {
    const issueLines = selectedCards.length
      ? selectedCards.map((card, index) => `${index + 1}. ${card.title}（${card.viewpoint}）`).join('\n')
      : '1. 未選択\n2. 未選択\n3. 未選択';

    return `【テーマ】
${theme.title}

【設問】
${theme.questionText}

【課題】
${issueLines}

【最重要課題】
${priorityCard?.title ?? '未選択'}

【選定理由】
${reason || '未入力'}

【使える手法・観点】
${priorityCard?.methods ?? '未選択'}

【技術士答案での展開メモ】
この課題を中心に、解決策・リスク・倫理・持続可能性へ展開する。`;
  }, [priorityCard, reason, selectedCards, theme.questionText, theme.title]);

  const handoffText = useMemo(() => {
    const issueLines = selectedCards
      .map((card, index) => {
        return `${index + 1}. 観点：${card.viewpoint}
   課題：${card.title}
   背景・根本要因：${card.background}
   放置した場合の影響：${card.impact}
   使える手法：${card.methods}`;
      })
      .join('\n\n');

    return `【課題分解マトリクスからの引き継ぎ】

【テーマ】
${theme.title}

【設問(1)：課題抽出】
${issueLines || '1. 未選択\n\n2. 未選択\n\n3. 未選択'}

【設問(2)：最重要課題】
最重要課題：${priorityCard?.title ?? '未選択'}
選定理由：${reason || '未入力'}

【次に検討すること】
- 解決策1〜3
- 施策実施後に新たに生じるリスク
- リスクへの対策
- 技術者倫理・社会の持続可能性`;
  }, [priorityCard?.title, reason, selectedCards, theme.title]);

  function toggleCard(cardId: string) {
    setNotice('');
    setCopyMessage('');

    if (selectedIds.includes(cardId)) {
      const nextIds = selectedIds.filter((id) => id !== cardId);
      setSelectedIds(nextIds);
      if (priorityId === cardId) setPriorityId('');
      return;
    }

    if (selectedIds.length >= 3) {
      setNotice('課題は最大3つまで選択できます。答案では広げすぎず、比較して絞り込むことが大切です。');
      return;
    }

    setSelectedIds([...selectedIds, cardId]);
  }

  async function copyOutline() {
    setCopyMessage('');
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyMessage('コピー機能が使えない環境です。下のテキスト欄から手動でコピーしてください。');
      return;
    }

    try {
      await navigator.clipboard.writeText(outlineText);
      setCopyMessage('答案骨子をコピーしました。');
    } catch {
      setCopyMessage('コピーに失敗しました。下のテキスト欄から手動でコピーしてください。');
    }
  }

  async function copyHandoffText() {
    setCopyMessage('');
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopyMessage('コピー機能が使えない環境です。表示されたテキスト欄から手動でコピーしてください。');
      return;
    }

    try {
      await navigator.clipboard.writeText(handoffText);
      setCopyMessage('答案骨子用テキストをコピーしました。');
    } catch {
      setCopyMessage('コピーに失敗しました。表示されたテキスト欄から手動でコピーしてください。');
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">技術士二次試験向け 中核教材</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">課題分解マトリクス</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          過去問で問われやすい「多面的な課題抽出」と「最重要課題の選定」を、テーマ別に練習するためのページです。
          MVPでは製造業DXを扱い、将来は物流、取引適正化、QMS、GXなどのテーマを追加できる構造にしています。
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">対象テーマ</p>
          <h2 className="mt-2 text-2xl font-bold">{theme.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">{theme.description}</p>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-950">本番風の設問文</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{theme.questionText}</p>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <TagGroup title="出題接続" tags={theme.examTags} />
          <TagGroup title="参照しやすい一次情報" tags={theme.sourceTags} />
          <TagGroup title="政策・法令接続" tags={theme.lawOrPolicyTags} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">1. このテーマの位置づけ</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">DXをIT導入で終わらせず、品質・生産・人材・データを横断する経営工学の課題として扱います。</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">2. 試験での出題場面</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">必須科目Ⅰや選択科目Ⅲで、課題抽出、最重要課題、解決策、リスクへの展開が問われます。</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">今回は実装しないもの</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">難易度設定、タイマー、採点、AI添削、保存、ランダム生成、モード切替は次回以降の拡張対象です。</p>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">3. 観点別の課題カード</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">
            観点を切り替えながら課題を比較し、答案で使う3課題を選びます。公開答案では、観点が偏っていないことが説得力につながります。
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
          <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700">観点フィルタ</h3>
            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
              {(['すべて', ...viewpoints] as Filter[]).map((viewpoint) => (
                <button
                  key={viewpoint}
                  type="button"
                  onClick={() => setActiveFilter(viewpoint)}
                  className={`rounded-full border px-3 py-2 text-left text-sm font-semibold transition ${
                    activeFilter === viewpoint
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {viewpoint}
                </button>
              ))}
            </div>
          </aside>

          <div className="grid gap-4 md:grid-cols-2">
            {displayedCards.map((card) => {
              const isSelected = selectedIds.includes(card.id);
              return (
                <article
                  key={card.id}
                  className={`rounded-xl border bg-white p-5 shadow-sm transition ${
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{card.viewpoint}</span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${usefulnessClassName(card.answerUsefulness)}`}>
                      答案での使いやすさ：{card.answerUsefulness}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                  <dl className="mt-4 space-y-3 text-sm leading-7">
                    <div>
                      <dt className="font-semibold text-slate-900">背景・根本要因</dt>
                      <dd className="text-slate-700">{card.background}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">放置した場合の影響</dt>
                      <dd className="text-slate-700">{card.impact}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">使える経営工学・QC手法</dt>
                      <dd className="text-slate-700">{card.methods}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => toggleCard(card.id)}
                    className={`mt-5 w-full rounded-lg border px-4 py-2 text-sm font-bold transition ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-emerald-500 hover:bg-emerald-50'
                    }`}
                  >
                    {isSelected ? '選択を解除する' : 'この課題を選ぶ'}
                  </button>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">選択済み課題</h3>
              <p className="mt-2 text-sm text-slate-600">最大3つまで選択できます。</p>
              {notice && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">{notice}</p>}
              <div className="mt-4 space-y-3">
                {selectedCards.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">課題カードから選択してください。</p>
                ) : (
                  selectedCards.map((card) => (
                    <div key={card.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-500">{card.viewpoint}</p>
                      <p className="mt-1 font-bold">{card.title}</p>
                      <button type="button" onClick={() => toggleCard(card.id)} className="mt-2 text-sm font-semibold text-emerald-700 underline">
                        解除する
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">観点の偏り</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{balanceComment}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold">4. 最重要課題の選定</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            選んだ3課題を比較し、影響範囲・根本原因・波及効果の観点から最重要課題を1つに絞ります。
            ここで書いた理由が、答案の説得力の土台になります。
          </p>

          <div className="mt-5">
            <label className="text-sm font-bold text-slate-800" htmlFor="priority-issue">
              最重要課題
            </label>
            <select
              id="priority-issue"
              value={priorityId}
              onChange={(event) => setPriorityId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">選択してください</option>
              {selectedCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">選定理由のヒント</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {reasonHints.map((hint) => (
                <span key={hint} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {hint}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-bold text-slate-800" htmlFor="priority-reason">
              選定理由
            </label>
            <textarea
              id="priority-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="例：品質データの活用不足は、慢性不良の再発だけでなく、現場改善やQMSの有効性にも影響するため。"
              className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-7"
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <h2 className="text-xl font-bold">答案骨子としてコピー</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">設問、課題、最重要課題、選定理由を答案の下書きに使いやすい形で出力します。</p>
          <textarea readOnly value={outlineText} className="mt-4 min-h-80 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-sm leading-6" />
          <button type="button" onClick={copyOutline} className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800">
            答案骨子をコピーする
          </button>
          {copyMessage && <p className="mt-3 text-sm font-semibold text-emerald-800">{copyMessage}</p>}
        </div>
      </section>

      {selectedCards.length === 3 && priorityCard && (
        <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <p className="text-sm font-semibold text-emerald-700">課題抽出から答案骨子へ</p>
              <h2 className="mt-2 text-2xl font-bold">次は答案骨子に整理する</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                選択した課題、最重要課題、選定理由をもとに、AnswerStructureBuilder で解決策・リスク・倫理・持続可能性まで展開できます。
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {selectedCards.map((card) => (
                  <div key={`handoff-${card.id}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">{card.viewpoint}</p>
                    <p className="mt-1 font-bold text-slate-950">{card.title}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-bold text-slate-950">最重要課題</p>
                <p className="mt-1 text-sm leading-7 text-slate-700">{priorityCard.title}</p>
                <p className="mt-3 text-sm font-bold text-slate-950">選定理由</p>
                <p className="mt-1 text-sm leading-7 text-slate-700">{reason || '未入力'}</p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={copyHandoffText}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800"
                >
                  答案骨子用テキストをコピー
                </button>
                <a
                  href={answerBuilderHref}
                  className="rounded-lg border border-emerald-700 bg-white px-4 py-2 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                >
                  答案骨子ビルダーへ進む
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">AnswerStructureBuilder に貼り付けやすいテキスト</p>
              <textarea
                readOnly
                value={handoffText}
                className="mt-3 min-h-96 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm leading-6 text-slate-900"
              />
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">5. 技術士答案での使い方</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">課題を3つ出した後、最重要課題を中心に解決策、実施上のリスク、倫理、持続可能性へ展開します。</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">6. 実務・QMS改善に向けた活用</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">実務では、DX課題を人材、プロセス、データ、品質に分けることで、改善テーマとKPIを整理しやすくなります。</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">今後追加しやすいテーマ</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {futureThemes.map((futureTheme) => (
              <span key={futureTheme} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {futureTheme}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
