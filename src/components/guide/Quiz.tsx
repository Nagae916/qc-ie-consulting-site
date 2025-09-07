'use client';
import React from 'react';

type QA = { q: string; a: React.ReactNode };
export function Quiz({ items }: { items: QA[] }) {
  return (
    <section>
      {items.map((it, i) => (
        <div className="qa-card" key={i}>
          <p className="qa-q">{it.q}</p>
          <details className="qa-a">
            <summary>答えを見る</summary>
            <div>{it.a}</div>
          </details>
        </div>
      ))}
    </section>
  );
}
