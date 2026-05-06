'use client';

import { useEffect, useMemo, useState } from 'react';

type PastExamQuestion = {
  id: string;
  year: number;
  eraYear: string;
  subjectType: string;
  field: string;
  questionNumber: string;
  officialPdfUrl: string;
  officialSourceLabel: string;
  summary: string;
  questionPattern: string;
  requiredActions: string[];
  themeTags: string[];
  methodTags: string[];
  policyTags: string[];
  lawTags: string[];
  answerFrameType: string;
  skeletonTemplateId: string;
};

type PastExamData = {
  source: {
    label: string;
    url: string;
    note: string;
  };
  questions: PastExamQuestion[];
};

type CountItem = {
  label: string;
  count: number;
};

const dataPath = '/data/engineer/past-exam-questions.json';
const answerBuilderHref = '/guides/engineer/answer-structure-builder';
const issueMatrixHref = '/guides/engineer/issue-decomposition-matrix';
const learningMapHref = '/guides/engineer/learning-map';
const requiredGeneratorId = 'required-exam-generator';
const contextOptions = ['製造業', 'サービス業', 'サプライチェーン', '品質マネジメント', '生産・物流マネジメント'];
const skeletonGuide = [
  '問題文の背景、対象業務、自分の立場を先に整理する',
  '課題は、品質・生産性・人材・データ・サプライチェーンなど観点を分けて3つ抽出する',
  '問題点、技術課題、解決策を混同せず、課題を抽象語だけで終わらせない',
  '最重要課題は、抽出した3課題の中から、影響範囲・根本性・波及性で選ぶ',
  '解決策は、最重要課題に直接対応させ、誰が・何を・どの指標で管理するかを書く',
  'リスクは、施策実施後に新たに生じる副作用として書き、対策と一対一で対応させる',
  '倫理・持続可能性は、安全、品質保証、情報管理、人材育成などテーマ固有の具体語で書く',
];

const patternGuides: Record<string, { feature: string; action: string; href: string }> = {
  課題抽出型: {
    feature: '多面的な課題抽出、最重要課題、解決策、リスク対応が必要。',
    action: '課題分解マトリクスと AnswerStructureBuilder で練習する。',
    href: issueMatrixHref,
  },
  手順説明型: {
    feature: '実施手順、管理項目、留意点を整理する必要がある。',
    action: '選択科目Ⅱ-2型の構成で、手順と留意点をセットで練習する。',
    href: answerBuilderHref,
  },
  留意点型: {
    feature: '適用条件、実施上の注意点、工夫点を具体化する必要がある。',
    action: '手法のメリットだけでなく、現場導入時の制約も整理する。',
    href: answerBuilderHref,
  },
  用語説明型: {
    feature: '定義だけでなく、特徴、適用場面、留意点を短く整理する必要がある。',
    action: '選択科目Ⅱ-1型の600字答案で練習する。',
    href: answerBuilderHref,
  },
  比較評価型: {
    feature: '複数案の評価軸、選定理由、トレードオフ整理が必要。',
    action: '評価軸、採用理由、代替案の弱点をセットで整理する。',
    href: answerBuilderHref,
  },
  リスク対応型: {
    feature: '施策実施後の副作用と対策を一対一で整理する必要がある。',
    action: 'リスクと対策の対応関係を崩さずに骨子化する。',
    href: answerBuilderHref,
  },
  将来展望型: {
    feature: '社会変化、技術動向、経営工学的対応をつなげる必要がある。',
    action: '白書・政策タグを見ながら、今後の方向性と実務対応を結びつける。',
    href: answerBuilderHref,
  },
};

const answerFrameNotes: Record<string, string> = {
  必須科目Ⅰ型: '課題抽出、最重要課題、解決策、リスク、倫理までを整理する',
  '選択科目Ⅱ-1型': '用語・手法を600字程度で簡潔に説明する',
  '選択科目Ⅱ-2型': '実施手順、留意点、工夫点を整理する',
  選択科目Ⅲ型: '多面的課題、解決策、将来展望を整理する',
};

function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'ja'));
}

function countValues(values: string[]) {
  const countMap = new Map<string, number>();
  values.forEach((value) => {
    countMap.set(value, (countMap.get(value) ?? 0) + 1);
  });

  return Array.from(countMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ja'));
}

function percentage(count: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
      >
        <option value="all">すべて</option>
        {options.map((option) => (
          <option key={`${label}-${option}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TagList({ tags, tone = 'slate' }: { tags: string[]; tone?: 'slate' | 'emerald' | 'amber' }) {
  const className =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-slate-200 bg-slate-50 text-slate-700';

  if (tags.length === 0) {
    return <span className="text-sm text-slate-500">該当タグなし</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className={`rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function SummaryCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
      {note && <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>}
    </div>
  );
}

function TrendBar({ item, total }: { item: CountItem; total: number }) {
  const ratio = percentage(item.count, total);
  const width = `${Math.max(8, ratio)}%`;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-700">{item.label}</span>
        <span className="text-slate-500">
          {item.count}件 / {ratio}%
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-emerald-600" style={{ width }} />
      </div>
    </div>
  );
}

function CountPanel({ title, items, total }: { title: string; items: CountItem[]; total: number }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <TrendBar key={`${title}-${item.label}`} item={item} total={total} />
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">集計対象がありません。</p>}
      </div>
    </section>
  );
}

function CrossSummary({ subject, patterns }: { subject: string; patterns: CountItem[] }) {
  const topPattern = patterns[0];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-bold text-slate-950">{subject}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {topPattern ? `${topPattern.label}が多い傾向です。` : '登録データがありません。'}
      </p>
      <div className="mt-3 space-y-2">
        {patterns.map((pattern) => (
          <div key={`${subject}-${pattern.label}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="font-semibold text-slate-700">{pattern.label}</span>
            <span className="text-slate-500">{pattern.count}件</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function PastExamTrendMap() {
  const [data, setData] = useState<PastExamData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [patternFilter, setPatternFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [selectedRequiredQuestionId, setSelectedRequiredQuestionId] = useState('');
  const [selectedContext, setSelectedContext] = useState('製造業');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const response = await fetch(dataPath);
        if (!response.ok) throw new Error('Failed to load past exam metadata.');
        const json = (await response.json()) as PastExamData;
        if (!ignore) setData(json);
      } catch {
        if (!ignore) setLoadError('過去問メタデータを読み込めませんでした。');
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const questions = data?.questions ?? [];

  const yearOptions = useMemo(() => uniqueValues(questions.map((question) => question.eraYear)), [questions]);
  const subjectOptions = useMemo(() => uniqueValues(questions.map((question) => question.subjectType)), [questions]);
  const fieldOptions = useMemo(() => uniqueValues(questions.map((question) => question.field)), [questions]);
  const patternOptions = useMemo(() => uniqueValues(questions.map((question) => question.questionPattern)), [questions]);
  const themeOptions = useMemo(() => uniqueValues(questions.flatMap((question) => question.themeTags)), [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const yearMatched = yearFilter === 'all' || question.eraYear === yearFilter;
      const subjectMatched = subjectFilter === 'all' || question.subjectType === subjectFilter;
      const fieldMatched = fieldFilter === 'all' || question.field === fieldFilter;
      const patternMatched = patternFilter === 'all' || question.questionPattern === patternFilter;
      const themeMatched = themeFilter === 'all' || question.themeTags.includes(themeFilter);
      return yearMatched && subjectMatched && fieldMatched && patternMatched && themeMatched;
    });
  }, [fieldFilter, patternFilter, questions, subjectFilter, themeFilter, yearFilter]);

  const requiredQuestions = useMemo(() => {
    return questions.filter((question) => question.subjectType === '必須科目Ⅰ');
  }, [questions]);

  const selectedRequiredQuestion = useMemo(() => {
    return requiredQuestions.find((question) => question.id === selectedRequiredQuestionId) ?? requiredQuestions[0];
  }, [requiredQuestions, selectedRequiredQuestionId]);

  const generatedQuestionText = useMemo(() => {
    if (!selectedRequiredQuestion) return '';

    const mainTheme = selectedRequiredQuestion.themeTags[0] ?? '経営工学上の課題';
    const themeText = selectedRequiredQuestion.themeTags.slice(0, 3).join('、') || '経営環境の変化';
    const policyText = selectedRequiredQuestion.policyTags.slice(0, 2).join('、') || '公的動向';
    const lawText = selectedRequiredQuestion.lawTags.slice(0, 2).join('、') || '関連制度';

    return `近年、${selectedContext} では、${themeText}、${policyText}、${lawText} などへの対応が重要となっている。
このような状況を踏まえ、経営工学の技術者として、QCD、人材・組織、業務プロセス、データ活用、サプライチェーン、リスク管理の観点を考慮し、${selectedContext} における ${mainTheme} を推進するにあたり、以下の問いに答えよ。

(1) 多面的な観点から、取り組むべき技術課題を3つ抽出せよ。
(2) 抽出した3課題のうち最も重要と考える課題を1つ挙げ、その理由と、経営工学の手法を用いた解決策を述べよ。
(3) 解決策を実施した場合に新たに生じうるリスクと、その対策を述べよ。
(4) 技術者倫理および社会の持続可能性の観点から、業務遂行上の留意点を述べよ。`;
  }, [selectedContext, selectedRequiredQuestion]);

  const yearRange = useMemo(() => {
    if (questions.length === 0) return '未読込';
    const sortedYears = [...questions].sort((a, b) => a.year - b.year);
    const first = sortedYears[0];
    const last = sortedYears[sortedYears.length - 1];
    if (!first || !last) return '未読込';
    return `${first.eraYear}〜${last.eraYear}`;
  }, [questions]);

  const themeCounts = useMemo(() => countValues(questions.flatMap((question) => question.themeTags)), [questions]);
  const methodCounts = useMemo(() => countValues(questions.flatMap((question) => question.methodTags)), [questions]);
  const patternCounts = useMemo(() => countValues(questions.map((question) => question.questionPattern)), [questions]);
  const subjectCounts = useMemo(() => countValues(questions.map((question) => question.subjectType)), [questions]);
  const fieldCounts = useMemo(() => countValues(questions.map((question) => question.field)), [questions]);
  const frameCounts = useMemo(() => countValues(questions.map((question) => question.answerFrameType)), [questions]);

  const subjectPatternCounts = useMemo(() => {
    return subjectOptions.map((subject) => {
      const subjectQuestions = questions.filter((question) => question.subjectType === subject);
      return {
        subject,
        patterns: countValues(subjectQuestions.map((question) => question.questionPattern)),
      };
    });
  }, [questions, subjectOptions]);

  function resetFilters() {
    setYearFilter('all');
    setSubjectFilter('all');
    setFieldFilter('all');
    setPatternFilter('all');
    setThemeFilter('all');
  }

  function selectRequiredExample(question: PastExamQuestion) {
    setSelectedRequiredQuestionId(question.id);
    const element = document.getElementById(requiredGeneratorId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">技術士二次試験 経営工学部門</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">技術士 経営工学 過去問トレンドマップ</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          令和元年度以降の経営工学部門の過去問を、年度・科目・テーマ・設問パターンで整理し、技術士二次試験の答案骨子作成につなげるためのページです。
        </p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">
          このページでは、公式過去問題の全文転載は行わず、公式PDFへのリンク、問題要約、設問パターン、テーマタグなどの学習用メタデータを表示します。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="登録問題数" value={`${questions.length}問`} note={`現在の絞り込み結果：${filteredQuestions.length}問`} />
        <SummaryCard label="対象年度範囲" value={yearRange} />
        <SummaryCard label="対象科目" value={subjectOptions.join(' / ') || '未読込'} />
        <SummaryCard label="主なテーマ" value={themeCounts.slice(0, 5).map((item) => item.label).join(' / ') || '未読込'} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">フィルタ</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">年度、科目区分、分野、設問パターン、テーマタグで絞り込みできます。</p>
          </div>
          <button type="button" onClick={resetFilters} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            条件をリセット
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <FilterSelect label="年度" value={yearFilter} options={yearOptions} onChange={setYearFilter} />
          <FilterSelect label="科目区分" value={subjectFilter} options={subjectOptions} onChange={setSubjectFilter} />
          <FilterSelect label="分野" value={fieldFilter} options={fieldOptions} onChange={setFieldFilter} />
          <FilterSelect label="設問パターン" value={patternFilter} options={patternOptions} onChange={setPatternFilter} />
          <FilterSelect label="テーマタグ" value={themeFilter} options={themeOptions} onChange={setThemeFilter} />
        </div>
      </section>

      <section id={requiredGeneratorId} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <p className="text-sm font-semibold text-emerald-700">必須科目Ⅰ型</p>
            <h2 className="mt-2 text-2xl font-bold">必須Ⅰ型 例題生成MVP</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              登録済みの必須科目Ⅰメタデータをもとに、過去問の設問構造に倣ったオリジナル例題を作成します。
              公式過去問の再掲ではなく、課題抽出・最重要課題・解決策・リスク・倫理を練習するための例題です。
            </p>
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">
              この例題は、公式過去問の問題文を転載したものではありません。登録済みの過去問メタデータを参考に、設問構造とテーマを組み合わせて作成した学習用のオリジナル例題です。公式問題は日本技術士会の過去問題PDFを確認してください。
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4">
              <h3 className="text-base font-bold text-slate-950">講座方針との整合性チェック</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>必須科目Ⅰの答案型として、課題抽出、最重要課題、解決策、リスク、倫理・持続可能性の順にしている</li>
                <li>課題を抽象語で終わらせず、QCD、人材、プロセス、データ、サプライチェーンなど経営工学部門の観点を入れている</li>
                <li>添削で弱くなりやすい、課題と解決策の不一致、リスクと対策の不対応、倫理の一般論化を避けるガイドにしている</li>
              </ul>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-slate-800">参考にする過去問メタデータ</span>
                <select
                  value={selectedRequiredQuestion?.id ?? ''}
                  onChange={(event) => setSelectedRequiredQuestionId(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {requiredQuestions.map((question) => (
                    <option key={`required-generator-${question.id}`} value={question.id}>
                      {question.eraYear} {question.questionNumber}：{question.themeTags.slice(0, 2).join(' / ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-800">出題対象の文脈</span>
                <select
                  value={selectedContext}
                  onChange={(event) => setSelectedContext(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {contextOptions.map((context) => (
                    <option key={`context-${context}`} value={context}>
                      {context}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">生成された例題</h3>
            <textarea
              readOnly
              value={generatedQuestionText || '必須科目Ⅰのメタデータを読み込み中です。'}
              className="mt-3 min-h-80 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm leading-7 text-slate-900"
            />
          </div>
        </div>

        {selectedRequiredQuestion && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">参考にしたメタ情報</h3>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <dt className="font-bold text-slate-950">参考メタデータ</dt>
                  <dd className="mt-1 text-slate-700">{selectedRequiredQuestion.eraYear} {selectedRequiredQuestion.questionNumber}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">設問パターン</dt>
                  <dd className="mt-1 text-slate-700">{selectedRequiredQuestion.questionPattern}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">答案フレーム</dt>
                  <dd className="mt-1 text-slate-700">{selectedRequiredQuestion.answerFrameType}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">テンプレートID</dt>
                  <dd className="mt-1 font-mono text-xs text-slate-700">{selectedRequiredQuestion.skeletonTemplateId}</dd>
                </div>
              </dl>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">requiredActions</p>
                  <div className="mt-2">
                    <TagList tags={selectedRequiredQuestion.requiredActions} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">themeTags</p>
                  <div className="mt-2">
                    <TagList tags={selectedRequiredQuestion.themeTags} tone="emerald" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">methodTags</p>
                  <div className="mt-2">
                    <TagList tags={selectedRequiredQuestion.methodTags} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">policyTags / lawTags</p>
                  <div className="mt-2">
                    <TagList tags={[...selectedRequiredQuestion.policyTags, ...selectedRequiredQuestion.lawTags]} tone="amber" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">骨子作成ガイド</h3>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {skeletonGuide.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              <a href={answerBuilderHref} className="mt-5 block rounded-lg bg-emerald-700 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-emerald-800">
                この例題で答案骨子を作る
              </a>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">傾向分析サマリー</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">全登録データをもとに、頻出テーマ、設問パターン、科目区分ごとの答案型を確認します。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="必須科目Ⅰ型" value={`${frameCounts.find((item) => item.label === '必須科目Ⅰ型')?.count ?? 0}問`} />
          <SummaryCard label="選択科目Ⅱ-1型" value={`${frameCounts.find((item) => item.label === '選択科目Ⅱ-1型')?.count ?? 0}問`} />
          <SummaryCard label="選択科目Ⅱ-2型" value={`${frameCounts.find((item) => item.label === '選択科目Ⅱ-2型')?.count ?? 0}問`} />
          <SummaryCard label="選択科目Ⅲ型" value={`${frameCounts.find((item) => item.label === '選択科目Ⅲ型')?.count ?? 0}問`} />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <CountPanel title="themeTags 上位5件" items={themeCounts.slice(0, 5)} total={questions.length} />
          <CountPanel title="questionPattern 上位5件" items={patternCounts.slice(0, 5)} total={questions.length} />
          <CountPanel title="科目区分別件数" items={subjectCounts} total={questions.length} />
          <CountPanel title="field 別件数" items={fieldCounts} total={questions.length} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">テーマタグ別の頻出傾向</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">件数が多いテーマほど、優先して自分の言葉で説明できるようにします。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {themeCounts.map((item) => (
            <article key={`theme-${item.label}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold">{item.label}</h3>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  {item.count}問 / {percentage(item.count, questions.length)}%
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">関連する問題数：{item.count}問。過去問カードを絞り込んで、設問パターンと必要アクションを確認します。</p>
              <button
                type="button"
                onClick={() => setThemeFilter(item.label)}
                className="mt-4 rounded-lg border border-emerald-700 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                このテーマの問題を見る
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">設問パターン別の頻出傾向</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">パターンごとに、答案で求められる動作が変わります。</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {patternCounts.map((item) => {
            const guide = patternGuides[item.label] ?? {
              feature: '設問要求に合わせて、定義、手順、留意点、リスクを整理する必要があります。',
              action: 'AnswerStructureBuilder で骨子を作り、設問要求との対応を確認する。',
              href: answerBuilderHref,
            };

            return (
              <article key={`pattern-${item.label}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold">{item.label}</h3>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                    {item.count}問 / {percentage(item.count, questions.length)}%
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{guide.feature}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">推奨アクション：{guide.action}</p>
                <a href={guide.href} className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800">
                  この型を練習する
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">科目区分 × 設問パターン</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">科目区分ごとに多い設問パターンを確認し、答案型の違いを押さえます。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {subjectPatternCounts.map((item) => (
            <CrossSummary key={item.subject} subject={item.subject} patterns={item.patterns} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">傾向から見た学習優先度</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <h3 className="text-lg font-bold">最優先で押さえるテーマ</h3>
            <div className="mt-3 space-y-3">
              {themeCounts.slice(0, 3).map((item) => (
                <div key={`priority-theme-${item.label}`} className="rounded-lg bg-slate-50 p-3">
                  <p className="font-bold">{item.label}（{item.count}問）</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">過去問での登場頻度が高いため、背景、課題、使える手法をセットで整理します。</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <h3 className="text-lg font-bold">答案型として優先して練習</h3>
            <div className="mt-3 space-y-3">
              {patternCounts.slice(0, 2).map((item) => (
                <div key={`priority-pattern-${item.label}`} className="rounded-lg bg-slate-50 p-3">
                  <p className="font-bold">{item.label}（{item.count}問）</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{patternGuides[item.label]?.action ?? 'AnswerStructureBuilder で設問要求に沿って骨子化します。'}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <h3 className="text-lg font-bold">優先して整理する手法</h3>
            <div className="mt-3 space-y-2">
              {methodCounts.slice(0, 5).map((item) => (
                <div key={`priority-method-${item.label}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-slate-500">{item.count}問</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <a href={issueMatrixHref} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
          <h2 className="text-lg font-bold">課題抽出型の問題を練習する</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">多面的な課題抽出、最重要課題、選定理由を整理します。</p>
        </a>
        <a href={answerBuilderHref} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
          <h2 className="text-lg font-bold">答案骨子を作成する</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">設問要求、課題、解決策、リスク、倫理を一貫して骨子化します。</p>
        </a>
        <a href={learningMapHref} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
          <h2 className="text-lg font-bold">学習マップに戻る</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">経営工学全体の学習ルートに戻ります。</p>
        </a>
      </section>

      {loadError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{loadError}</p>}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">問題カード</h2>
          <p className="mt-2 text-sm text-slate-600">表示件数：{filteredQuestions.length}件</p>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
            条件に一致する問題メタデータがありません。
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredQuestions.map((question) => (
              <article key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">{question.eraYear}</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">{question.subjectType}</span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{question.questionPattern}</span>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{question.answerFrameType}</span>
                </div>

                <h3 className="mt-4 text-xl font-bold">{question.field} {question.questionNumber}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">{question.officialSourceLabel}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{question.summary}</p>
                <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm leading-7 text-emerald-900">
                  {answerFrameNotes[question.answerFrameType] ?? '設問要求に合わせて答案骨子を整理する'}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">要求される行動</p>
                    <div className="mt-2">
                      <TagList tags={question.requiredActions} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">テーマタグ</p>
                    <div className="mt-2">
                      <TagList tags={question.themeTags} tone="emerald" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">経営工学手法タグ</p>
                    <div className="mt-2">
                      <TagList tags={question.methodTags} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">白書・政策タグ</p>
                    <div className="mt-2">
                      <TagList tags={question.policyTags} tone="amber" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">法令タグ</p>
                    <div className="mt-2">
                      <TagList tags={question.lawTags} tone="amber" />
                    </div>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="font-bold text-slate-950">答案フレーム</dt>
                    <dd className="mt-2 leading-7 text-slate-700">{question.answerFrameType}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="font-bold text-slate-950">骨子テンプレートID</dt>
                    <dd className="mt-2 font-mono text-xs leading-7 text-slate-700">{question.skeletonTemplateId}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {question.subjectType === '必須科目Ⅰ' && (
                    <button
                      type="button"
                      onClick={() => selectRequiredExample(question)}
                      className="rounded-lg border border-emerald-700 bg-white px-4 py-2 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      この型で例題を作る
                    </button>
                  )}
                  <a
                    href={question.officialPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    公式PDFを開く（外部）
                  </a>
                  <a
                    href={answerBuilderHref}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-emerald-800"
                  >
                    この型で答案骨子を作る
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
