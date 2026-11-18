import type { ReactNode } from "react";

export function LearningQuestion({ question, answer }: { question: string; answer: string }) {
  return (
    <section className="my-8 border-y border-slate-300 py-6" aria-labelledby="learning-question-title">
      <p className="text-sm font-bold text-teal-700">最初の疑問</p>
      <h2 id="learning-question-title" className="mt-2 text-xl font-extrabold leading-8 text-slate-950 sm:text-2xl">
        {question}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-700"><strong className="text-slate-950">答え：</strong>{answer}</p>
    </section>
  );
}

export function LearningFigure({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-7 border-y border-slate-200 py-5">
      <h3 className="text-lg font-bold leading-7 text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
      <figcaption className="mt-3 text-sm leading-6 text-slate-600">{caption}</figcaption>
    </figure>
  );
}

export function LearningExample({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-7 border-l-4 border-teal-700 bg-slate-50 px-4 py-4 sm:px-5" aria-label={title}>
      <p className="font-bold text-slate-950">{title}</p>
      <div className="mt-2 text-sm leading-7 text-slate-700">{children}</div>
    </aside>
  );
}
