import Link from "next/link";

type ContentCardProps = {
  href: string;
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
  tags?: string[];
  action?: string;
  className?: string;
};

export function ContentCard({
  href,
  eyebrow,
  title,
  description,
  meta,
  tags = [],
  action = "詳しく見る",
  className = "",
}: ContentCardProps) {
  return (
    <article className={`rounded-lg border border-slate-200 bg-white p-5 ${className}`}>
      {eyebrow ? <p className="text-xs font-bold text-teal-700">{eyebrow}</p> : null}
      <h3 className="mt-2 text-lg font-bold leading-7 text-slate-950">
        <Link href={href} className="hover:text-teal-700">{title}</Link>
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      {tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="関連タグ">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">{meta ?? ""}</span>
        <Link href={href} className="text-sm font-bold text-teal-700 underline decoration-teal-200 underline-offset-4 hover:text-teal-900">
          {action}
        </Link>
      </div>
    </article>
  );
}
