import Link from 'next/link';
import answerFrameRules from '../../../public/data/engineer/answer-frame-rules.json';
import competenciesData from '../../../public/data/engineer/competencies.json';

type WritingStep = {
  label: string;
  content: string;
};

type RelatedKnowledge = {
  label: string;
  href: string;
};

type ReviewExample = {
  label: string;
  description: string;
  href: string;
};

type AnswerFrameRule = {
  id: string;
  label: string;
  examPart: string;
  shortLabel: string;
  headline: string;
  queryValue: string;
  guideHref: string;
  questionPatterns: string[];
  questionCues: string[];
  questionVerbs: string[];
  firstThoughts: string[];
  writingSteps: WritingStep[];
  avoidOverwriting: string[];
  shortExample: {
    label: string;
    text: string;
  };
  relatedKnowledge: RelatedKnowledge[];
  reviewExamples?: ReviewExample[];
  relatedCompetencies: string[];
  usefulKeywords: string[];
  targetChars: number;
  manuscriptPages: number;
  practicalCharRange: {
    min: number;
    max: number;
  };
};

type Competency = {
  id: string;
  label: string;
};

type Props = {
  frameId?: string;
  variant?: 'overview' | 'detail';
};

const frames = answerFrameRules as AnswerFrameRule[];
const competencyLabels = new Map(
  (competenciesData as Competency[]).map((competency) => [competency.id, competency.label]),
);

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Overview() {
  return (
    <section className="not-prose my-6" aria-labelledby="answer-frame-overview-title">
      <h2 id="answer-frame-overview-title" className="sr-only">
        4つの答案型
      </h2>

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-bold">この型を使う問題</th>
              <th className="px-4 py-3 font-bold">答案の役割</th>
              <th className="px-4 py-3 font-bold">基本の流れ</th>
              <th className="px-4 py-3 font-bold">確認する</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {frames.map((frame) => (
              <tr key={frame.id}>
                <td className="px-4 py-4 align-top font-bold text-slate-950">{frame.examPart}</td>
                <td className="px-4 py-4 align-top text-slate-700">{frame.headline}</td>
                <td className="px-4 py-4 align-top text-slate-700">
                  {frame.writingSteps.map((step) => step.label).join(' → ')}
                </td>
                <td className="px-4 py-4 align-top">
                  <Link className="font-bold text-emerald-700 underline-offset-4 hover:underline" href={frame.guideHref}>
                    {frame.shortLabel}型を見る
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:hidden">
        {frames.map((frame) => (
          <section key={frame.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold text-emerald-700">{frame.examPart}</p>
            <h3 className="mt-1 text-base font-bold text-slate-950">{frame.headline}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {frame.writingSteps.map((step) => step.label).join(' → ')}
            </p>
            <Link className="mt-3 inline-block text-sm font-bold text-emerald-700 underline-offset-4 hover:underline" href={frame.guideHref}>
              {frame.shortLabel}型を見る
            </Link>
          </section>
        ))}
      </div>
    </section>
  );
}

function Detail({ frame }: { frame: AnswerFrameRule }) {
  const pastExamHref = `/guides/engineer/past-exam-trend-map?type=${encodeURIComponent(frame.queryValue)}`;
  const competencies = frame.relatedCompetencies.map((id) => competencyLabels.get(id) ?? id);

  return (
    <section className="not-prose my-6 space-y-8" aria-label={`${frame.label}の書き方`}>
      <header className="border-l-4 border-emerald-600 pl-4">
        <p className="text-xs font-bold text-emerald-700">{frame.examPart}</p>
        <h3 className="mt-1 text-xl font-bold text-slate-950">{frame.headline}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          N-IE Labの練習目安は{frame.targetChars}字以内・原稿用紙{frame.manuscriptPages}枚、実用範囲は
          {frame.practicalCharRange.min}〜{frame.practicalCharRange.max}字です。公式の採点基準ではありません。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h4 className="text-base font-bold text-slate-950">この型を使う問題</h4>
          <BulletList items={frame.questionPatterns} />
        </section>

        <section>
          <h4 className="text-base font-bold text-slate-950">問題文のここを見る</h4>
          <BulletList items={frame.questionCues} />
          <div className="mt-3 flex flex-wrap gap-2" aria-label="問題文で確認する動詞">
            {frame.questionVerbs.map((verb) => (
              <span key={verb} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                {verb}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="border-t border-slate-200 pt-6">
        <h4 className="text-base font-bold text-slate-950">まず考えること</h4>
        <ol className="mt-3 grid gap-3 md:grid-cols-3">
          {frame.firstThoughts.map((thought, index) => (
            <li key={thought} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
              <span className="mb-2 block text-xs font-bold text-emerald-700">STEP {index + 1}</span>
              {thought}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 pt-6">
        <h4 className="text-base font-bold text-slate-950">答案の流れ</h4>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {frame.writingSteps.map((step, index) => (
            <li key={step.label} className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="text-sm font-bold text-slate-900">{step.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 pt-6">
        <h4 className="text-base font-bold text-slate-950">各段階で書くこと</h4>
        <dl className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
          {frame.writingSteps.map((step) => (
            <div key={step.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-sm font-bold text-slate-950">{step.label}</dt>
              <dd className="text-sm leading-6 text-slate-700">{step.content}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border-t border-slate-200 pt-6">
          <h4 className="text-base font-bold text-slate-950">書きすぎないこと</h4>
          <BulletList items={frame.avoidOverwriting} />
        </section>

        <section className="border-t border-slate-200 pt-6">
          <h4 className="text-base font-bold text-slate-950">短い例</h4>
          <p className="mt-3 text-xs font-bold text-emerald-700">{frame.shortExample.label}</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{frame.shortExample.text}</p>
        </section>
      </div>

      <section className="border-t border-slate-200 pt-6">
        <h4 className="text-base font-bold text-slate-950">関連する過去問とKnowledge</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Link className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 no-underline hover:border-emerald-400" href={pastExamHref}>
            <span className="block text-xs font-bold text-emerald-700">関連する過去問</span>
            <span className="mt-1 block text-sm font-bold text-slate-950">{frame.shortLabel}型の過去問を探す</span>
          </Link>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold text-slate-500">関連Knowledge</p>
            <ul className="mt-2 space-y-2">
              {frame.relatedKnowledge.map((knowledge) => (
                <li key={knowledge.href}>
                  <Link className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline" href={knowledge.href}>
                    {knowledge.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="関連キーワード">
          {frame.usefulKeywords.slice(0, 6).map((keyword) => (
            <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {keyword}
            </span>
          ))}
        </div>
        {frame.reviewExamples?.length ? (
          <div className="mt-5 border-t border-slate-200 pt-5">
            <p className="text-xs font-bold text-slate-500">この型を使った実例</p>
            <ul className="mt-3 space-y-3">
              {frame.reviewExamples.map((example) => (
                <li key={example.href}>
                  <Link className="font-bold text-emerald-700 underline-offset-4 hover:underline" href={example.href}>
                    {example.label}
                  </Link>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{example.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-4 text-xs leading-5 text-slate-500">この型で示す力：{competencies.join('、')}</p>
      </section>
    </section>
  );
}

export default function AnswerFrameGuide({ frameId, variant = 'detail' }: Props) {
  if (variant === 'overview') return <Overview />;

  const frame = frames.find((item) => item.id === frameId);
  if (!frame) return null;

  return <Detail frame={frame} />;
}
