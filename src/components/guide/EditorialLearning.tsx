import Link from "next/link";
import type { ReactNode } from "react";

type ArticleFact = {
  label: string;
  value: string;
};

type ContentsItem = {
  number: string;
  label: string;
  id: string;
};

type NextLink = {
  label: string;
  text: string;
  href: string;
};

export function LearningArticleHeader({
  eyebrow,
  title,
  lead,
  facts,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  facts: ArticleFact[];
}) {
  return (
    <header>
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-5 md:pb-10 md:pt-7">
        <div className="max-w-4xl">
          <p className="text-xs font-bold tracking-[0.12em] text-teal-800">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-slate-950 md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">{lead}</p>
        </div>
        <dl className="mt-8 grid max-w-4xl gap-5 border-t border-slate-300 pt-5 md:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs font-bold text-teal-800">{fact.label}</dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-slate-800">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

export function ArticleContents({ items, children }: { items: ContentsItem[]; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-4 lg:grid-cols-[10rem_minmax(0,44rem)] lg:gap-12 lg:pb-14">
      <aside className="hidden lg:block">
        <nav aria-label="ページ内目次" className="sticky top-28 pt-3">
          <div aria-hidden="true" className="h-px bg-slate-400" />
          <p className="mt-4 text-[0.6875rem] font-bold tracking-[0.14em] text-slate-500">目次</p>
          <ol className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="grid grid-cols-[1.8rem_1fr] text-xs leading-5 text-slate-600 hover:text-teal-800">
                  <span className="font-bold text-teal-800">{item.number}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <article className="min-w-0 max-w-[44rem]">{children}</article>
    </div>
  );
}

export function LearningChapter({
  id,
  number,
  title,
  focus,
  children,
}: {
  id: string;
  number: string;
  title: string;
  focus?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-8 md:py-10">
      {number === "01" ? null : <div aria-hidden="true" className="mb-8 h-px bg-slate-300" />}
      <header className="mb-5">
        <div className="grid grid-cols-[2.75rem_1fr] items-baseline gap-3">
          <span className="text-sm font-black text-teal-800">{number}</span>
          <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{title}</h2>
        </div>
        {focus ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:pl-[3.5rem]">
            <span className="font-bold text-slate-800">この章で見ること：</span>
            {focus}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function AnswerBlock({
  variant,
  title,
  subtitle,
  heading,
  note,
  children,
}: {
  variant: "reconstructed" | "reference";
  title: string;
  subtitle?: string;
  heading?: string;
  note: string;
  children: ReactNode;
}) {
  const isReference = variant === "reference";

  return (
    <section className={`border-l-2 pl-5 md:pl-7 ${isReference ? "mt-9 border-teal-600" : "border-slate-400"}`} aria-label={title}>
      <p className={`text-xs font-black ${isReference ? "text-teal-800" : "text-slate-700"}`}>
        {title}
        {subtitle ? <span className="ml-2 text-[0.625rem] font-bold tracking-[0.12em] text-slate-400">{subtitle}</span> : null}
      </p>
      {heading ? <h3 className="mt-2 text-xl font-bold text-slate-950">{heading}</h3> : null}
      <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function LearningNextLinks({ links }: { links: NextLink[] }) {
  return (
    <nav aria-label="次に進む" className="mt-8">
      <div aria-hidden="true" className="h-px bg-slate-300" />
      <div className="grid gap-5 pt-5 sm:grid-cols-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <span className="block text-xs font-bold text-slate-500">{item.label}</span>
            <span className="mt-1 block text-sm font-bold leading-6 text-slate-900 underline decoration-slate-300 underline-offset-4 group-hover:text-teal-800">{item.text}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
