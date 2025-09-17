// src/components/guide/AccordionList.tsx
import React from 'react';

type Item = { term: React.ReactNode; desc: React.ReactNode };

export default function AccordionList({ items }: { items: Item[] }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <details key={i} className="rounded-lg border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-semibold select-none"> {it.term} </summary>
          <div className="mt-2 text-slate-600">{it.desc}</div>
        </details>
      ))}
    </div>
  );
}
