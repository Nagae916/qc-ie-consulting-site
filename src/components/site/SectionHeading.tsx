type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? <p className="text-xs font-bold uppercase text-teal-700">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-950 md:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{description}</p> : null}
    </div>
  );
}
