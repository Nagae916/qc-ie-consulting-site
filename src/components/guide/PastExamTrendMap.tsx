'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import competenciesData from '../../../public/data/engineer/competencies.json';

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
  requiredActions: string[];
  themeTags: string[];
  methodTags: string[];
  skeletonTemplateId: string;
  assessedCompetencies?: string[];
};

type PastExamData = {
  questions: PastExamQuestion[];
};

type Competency = {
  id: string;
  label: string;
};

type KnowledgeLink = {
  href: string;
  label: string;
};

type AnswerFrame = {
  shortLabel: string;
  label: string;
  href: string;
  description: string;
};

const DATA_PATH = '/data/engineer/past-exam-questions.json';
const PAGE_SIZE = 8;

const frameQueryValues: Record<string, string> = {
  'required-i-standard': 'required-i',
  'elective-ii-1-short': 'ii-1',
  'elective-ii-2-procedure': 'ii-2',
  'elective-iii-analysis': 'iii',
};

const frameIdByQueryValue = new Map(
  Object.entries(frameQueryValues).map(([frameId, queryValue]) => [queryValue, frameId]),
);

const competencies = competenciesData as Competency[];
const competencyLabelById = new Map(competencies.map((item) => [item.id, item.label]));

const answerFrames: Record<string, AnswerFrame> = {
  'required-i-standard': {
    shortLabel: '必須Ⅰ',
    label: '必須Ⅰ型',
    href: '/guides/engineer/answer-structure-guide#5-必須科目ⅰで使う骨子',
    description: '複数の課題、最重要課題、解決策、リスク、倫理・持続可能性を組み立てます。',
  },
  'elective-ii-1-short': {
    shortLabel: 'Ⅱ-1',
    label: 'Ⅱ-1型',
    href: '/guides/engineer/answer-structure-guide#6-選択科目ⅱ-1で使う骨子',
    description: '用語や手法を、定義、特徴、適用場面、留意点で簡潔に説明します。',
  },
  'elective-ii-2-procedure': {
    shortLabel: 'Ⅱ-2',
    label: 'Ⅱ-2型',
    href: '/guides/engineer/answer-structure-guide#7-選択科目ⅱ-2で使う骨子',
    description: '担当者としての調査、手順、関係者調整、留意点、効果確認を整理します。',
  },
  'elective-iii-analysis': {
    shortLabel: 'Ⅲ',
    label: 'Ⅲ型',
    href: '/guides/engineer/answer-structure-guide#8-選択科目ⅲで使う骨子',
    description: '複数課題、最重要課題、選定理由、解決策、リスク対策を組み立てます。',
  },
};

const knowledgeLinks: Record<string, KnowledgeLink> = {
  ABC分析: { href: '/guides/engineer/abc-analysis', label: 'ABC分析の使い方' },
  BCP: { href: '/guides/engineer/bcp', label: 'BCPの考え方' },
  DX: { href: '/guides/engineer/dx', label: 'DXの基本' },
  ERP: { href: '/guides/engineer/erp', label: 'ERPの基本' },
  FMEA: { href: '/guides/engineer/fmea', label: 'FMEAの使い方' },
  IE: { href: '/guides/engineer/ie-overview', label: 'IEの基本' },
  JIT: { href: '/guides/engineer/jit', label: 'JITの考え方' },
  KPI: { href: '/guides/engineer/kpi-management', label: 'KPIの設計方法' },
  KPI管理: { href: '/guides/engineer/kpi-management', label: 'KPIの設計方法' },
  LCA: { href: '/guides/engineer/lca', label: 'LCAの考え方' },
  MES: { href: '/guides/engineer/mes', label: 'MESの基本' },
  MRP: { href: '/guides/engineer/mrp', label: 'MRPの考え方' },
  OEE: { href: '/guides/engineer/oee', label: 'OEEの考え方' },
  QMS: { href: '/guides/engineer/qms-reconstruction', label: 'QMSの再構築' },
  QMS再構築: { href: '/guides/engineer/qms-reconstruction', label: 'QMSの再構築' },
  'S&OP': { href: '/guides/engineer/s-and-op', label: 'S&OPの基本' },
  SCM: { href: '/guides/engineer/scm', label: 'SCMの基本' },
  TMS: { href: '/guides/engineer/tms', label: 'TMSの基本' },
  WMS: { href: '/guides/engineer/wms', label: 'WMSの基本' },
  カーボンニュートラル: {
    href: '/guides/engineer/carbon-neutrality',
    label: 'カーボンニュートラルの考え方',
  },
  サービスマネジメント: {
    href: '/guides/engineer/service-management',
    label: 'サービスマネジメントの基本',
  },
  サービス品質: { href: '/guides/engineer/service-quality', label: 'サービス品質の考え方' },
  データガバナンス: {
    href: '/guides/engineer/data-governance',
    label: 'データガバナンスの考え方',
  },
  データドリブン: { href: '/guides/engineer/data-driven', label: 'データに基づく意思決定' },
  モーダルシフト: { href: '/guides/engineer/modal-shift', label: 'モーダルシフトの基本' },
  レジリエンス: { href: '/guides/engineer/resilience', label: 'レジリエンスの考え方' },
  リスク管理: { href: '/guides/engineer/risk-management', label: 'リスク管理の基本' },
  物流2024年問題: { href: '/guides/engineer/logistics-2024', label: '物流2024年問題の論点' },
  物流効率化: { href: '/guides/engineer/logistics', label: '物流効率化の考え方' },
  生産管理: { href: '/guides/engineer/production-planning', label: '生産計画の基本' },
  需要予測: { href: '/guides/engineer/demand-forecasting', label: '需要予測の考え方' },
  需給調整: { href: '/guides/engineer/demand-supply-adjustment', label: '需給調整の考え方' },
  工程能力: { href: '/guides/stat/process-capability', label: '工程能力指数の考え方' },
  標準化: { href: '/guides/engineer/standardization', label: '標準化の進め方' },
  品質管理: { href: '/guides/qc', label: '品質管理の基礎' },
  内部監査: { href: '/guides/engineer/internal-audit', label: '内部監査の考え方' },
};

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'ja'));
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function answerFrameFor(question: PastExamQuestion) {
  return answerFrames[question.skeletonTemplateId] ?? {
    shortLabel: question.subjectType,
    label: question.subjectType,
    href: '/guides/engineer/answer-structure-guide',
    description: '設問要求を確認し、対応する答案の型で骨子を組み立てます。',
  };
}

function keywordsFor(question: PastExamQuestion) {
  const values = Array.from(new Set([...question.methodTags, ...question.themeTags]));
  return values
    .map((keyword, index) => ({ keyword, index, linked: Boolean(knowledgeLinks[keyword]) }))
    .sort((a, b) => Number(b.linked) - Number(a.linked) || a.index - b.index)
    .slice(0, 5)
    .map(({ keyword }) => keyword);
}

function competencyLabels(ids: string[]) {
  return ids.map((id) => competencyLabelById.get(id) ?? id).slice(0, 3);
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (_value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
      >
        <option value="all">すべて</option>
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function KeywordSupport({ question }: { question: PastExamQuestion }) {
  const keywords = keywordsFor(question);
  const primaryKnowledge = [...question.themeTags, ...question.methodTags]
    .map((keyword) => ({ keyword, link: knowledgeLinks[keyword] }))
    .find(({ link }) => Boolean(link));

  return (
    <div>
      <h4 className="text-sm font-bold text-slate-950">答案に使えるキーワード</h4>
      <div className="mt-2 flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {keyword}
          </span>
        ))}
      </div>
      {primaryKnowledge?.link ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
          <p className="text-xs font-bold text-slate-500">理解を深める</p>
          <Link
            href={primaryKnowledge.link.href}
            className="inline-flex rounded-md border border-emerald-700 bg-white px-3 py-1.5 text-sm font-bold text-emerald-800 no-underline hover:bg-emerald-50"
          >
            {primaryKnowledge.link.label}を読む
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function QuestionCard({ question }: { question: PastExamQuestion }) {
  const frame = answerFrameFor(question);
  const competenciesForQuestion = competencyLabels(question.assessedCompetencies ?? []);

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-950">
          {question.eraYear} {question.questionNumber}
        </span>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
          {frame.shortLabel}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold leading-7 text-slate-950">
        {question.themeTags.slice(0, 2).join('・') || question.field}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{question.summary}</p>

      <div className="mt-5 rounded-md border-l-4 border-slate-800 bg-slate-50 p-3.5">
        <h4 className="text-sm font-bold text-slate-950">この問題で問われていること</h4>
        <ul className="mt-2 space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
          {question.requiredActions.slice(0, 4).map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-md border border-emerald-300 bg-emerald-50 p-4">
        <p className="text-xs font-bold text-emerald-800">答案の型</p>
        <Link
          href={frame.href}
          className="mt-2 inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-bold text-white no-underline hover:bg-emerald-800"
        >
          {frame.label}の骨子を見る
        </Link>
        <p className="mt-2 text-xs leading-5 text-slate-700">{frame.description}</p>
      </div>

      <div className="mt-4">
        <KeywordSupport question={question} />
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4">
        <p className="text-xs font-bold text-slate-500">参考にする</p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          <Link
            href="/guides/engineer/model-answer-examples"
            className="text-sm font-semibold text-slate-600 underline underline-offset-4"
          >
            同じ答案型の例を確認する
          </Link>
          <a
            href={question.officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-slate-600 underline underline-offset-4"
          >
            公式問題を確認する
          </a>
        </div>
      </div>

      {competenciesForQuestion.length > 0 ? (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          この問題で示す力: {competenciesForQuestion.join('、')}
        </p>
      ) : null}
    </article>
  );
}

export default function PastExamTrendMap() {
  const router = useRouter();
  const [data, setData] = useState<PastExamData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [frameFilter, setFrameFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const response = await fetch(DATA_PATH);
        if (!response.ok) throw new Error('Failed to load past exam data.');
        const json = (await response.json()) as PastExamData;
        if (!ignore) setData(json);
      } catch {
        if (!ignore) setLoadError('過去問の整理情報を読み込めませんでした。時間をおいて再度お試しください。');
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const questions = useMemo(
    () => [...(data?.questions ?? [])].sort((a, b) => b.year - a.year || a.questionNumber.localeCompare(b.questionNumber, 'ja')),
    [data],
  );

  const yearOptions = useMemo(
    () =>
      Array.from(new Map(questions.map((question) => [question.year, question.eraYear])))
        .sort(([a], [b]) => b - a)
        .map(([year, eraYear]) => ({ value: String(year), label: eraYear })),
    [questions],
  );

  const frameOptions = useMemo(
    () =>
      Object.entries(answerFrames).map(([value, frame]) => ({
        value,
        label: frame.label,
      })),
    [],
  );

  const themeOptions = useMemo(
    () => unique(questions.flatMap((question) => question.themeTags)).map((theme) => ({ value: theme, label: theme })),
    [questions],
  );

  useEffect(() => {
    if (!data || !router.isReady) return;

    const requestedYear = firstQueryValue(router.query.year);
    const requestedFrame = frameIdByQueryValue.get(firstQueryValue(router.query.type)) ?? 'all';
    const requestedTheme = firstQueryValue(router.query.theme);

    setYearFilter(yearOptions.some((option) => option.value === requestedYear) ? requestedYear : 'all');
    setFrameFilter(frameOptions.some((option) => option.value === requestedFrame) ? requestedFrame : 'all');
    setThemeFilter(themeOptions.some((option) => option.value === requestedTheme) ? requestedTheme : 'all');
    setFiltersReady(true);
  }, [data, frameOptions, router.isReady, router.query.theme, router.query.type, router.query.year, themeOptions, yearOptions]);

  useEffect(() => {
    if (!filtersReady || !router.isReady) return;

    const queryYear = firstQueryValue(router.query.year);
    const queryType = firstQueryValue(router.query.type);
    const queryTheme = firstQueryValue(router.query.theme);
    const nextYear = yearFilter === 'all' ? '' : yearFilter;
    const nextType = frameFilter === 'all' ? '' : frameQueryValues[frameFilter] ?? '';
    const nextTheme = themeFilter === 'all' ? '' : themeFilter;

    if (queryYear === nextYear && queryType === nextType && queryTheme === nextTheme) return;

    const query: Record<string, string> = {};
    if (nextYear) query.year = nextYear;
    if (nextType) query.type = nextType;
    if (nextTheme) query.theme = nextTheme;

    const pathname = router.asPath.split(/[?#]/)[0] || '/guides/engineer/past-exam-trend-map';
    void router.replace({ pathname, query }, undefined, { shallow: true, scroll: false });
  }, [filtersReady, frameFilter, router, themeFilter, yearFilter]);

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) => {
        const yearMatched = yearFilter === 'all' || String(question.year) === yearFilter;
        const frameMatched = frameFilter === 'all' || question.skeletonTemplateId === frameFilter;
        const themeMatched = themeFilter === 'all' || question.themeTags.includes(themeFilter);
        return yearMatched && frameMatched && themeMatched;
      }),
    [frameFilter, questions, themeFilter, yearFilter],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [yearFilter, frameFilter, themeFilter]);

  function resetFilters() {
    setYearFilter('all');
    setFrameFilter('all');
    setThemeFilter('all');
  }

  if (loadError) {
    return <p className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{loadError}</p>;
  }

  if (!data || !filtersReady) {
    return <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">過去問を読み込んでいます。</p>;
  }

  const visibleQuestions = filteredQuestions.slice(0, visibleCount);
  const hasActiveFilters = yearFilter !== 'all' || frameFilter !== 'all' || themeFilter !== 'all';
  const resultSummary = hasActiveFilters
    ? visibleQuestions.length < filteredQuestions.length
      ? `該当する過去問：${filteredQuestions.length}問（うち${visibleQuestions.length}問を表示）`
      : `該当する過去問：${filteredQuestions.length}問`
    : `${questions.length}問中 ${visibleQuestions.length}問を表示`;

  return (
    <section aria-labelledby="past-exam-navigator-title" className="not-prose space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold text-emerald-700">
          令和元年度から令和7年度までの{questions.length}問
        </p>
        <h2 id="past-exam-navigator-title" className="mt-2 text-2xl font-bold text-slate-950">
          過去問を選ぶ
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
          問題を選ぶと、問われていること、使う答案の型、確認したいキーワードが分かります。答案を自動生成するのではなく、自分で論述する前の判断を短くします。
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <FilterSelect label="年度" value={yearFilter} options={yearOptions} onChange={setYearFilter} />
          <FilterSelect label="問題形式" value={frameFilter} options={frameOptions} onChange={setFrameFilter} />
          <FilterSelect label="テーマ" value={themeFilter} options={themeOptions} onChange={setThemeFilter} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <p aria-live="polite" className="text-sm font-semibold text-slate-700">
            {resultSummary}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-bold text-emerald-800 underline underline-offset-4"
          >
            条件をリセット
          </button>
        </div>
      </div>

      {visibleQuestions.length > 0 ? (
        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          {visibleQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-700">
          条件に合う問題がありません。テーマを「すべて」に戻して確認してください。
        </p>
      )}

      {visibleCount < filteredQuestions.length ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-md border border-emerald-700 bg-white px-5 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
          >
            さらに{Math.min(PAGE_SIZE, filteredQuestions.length - visibleCount)}問を見る
          </button>
        </div>
      ) : null}
    </section>
  );
}
