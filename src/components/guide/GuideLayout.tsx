import React, { useState } from 'react';

/** ページ全体のレイアウト（title は任意） */
export function GuideLayout({
  title,
  intro,
  children,
}: {
  title?: string;        // ← 任意に変更（MDXから未指定でもOK）
  intro?: string;
  children: React.ReactNode;
}) {
  const wrap: React.CSSProperties = { fontFamily: 'Noto Sans JP, system-ui, sans-serif', color: '#334155' };
  const header: React.CSSProperties = { position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #e5e7eb' };
  const headerInner: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '12px 16px' };
  const main: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: 16 };
  const footer: React.CSSProperties = { borderTop: '1px solid #e5e7eb', marginTop: 32, padding: '16px 0', textAlign: 'center', color: '#6b7280' };

  return (
    <div style={wrap}>
      {/* title があればヘッダ表示。なければヘッダ自体を出さない */}
      {title ? (
        <header style={header}>
          <div style={headerInner}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1e40af', margin: 0 }}>{title}</h1>
          </div>
        </header>
      ) : null}

      <main style={main}>
        {intro && (
          <section style={{ textAlign: 'center', marginBottom: 24 }}>
            {/* intro セクションの見出しは title があれば出す。なければ非表示 */}
            {title ? <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>{title}</h2> : null}
            <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>{intro}</p>
          </section>
        )}
        {children}
      </main>
      <footer style={footer}>© 2025 品質管理学習リソース</footer>
    </div>
  );
}

/** 用語カードの一覧 */
export function Glossary({ items }: { items: { term: string; desc: string }[] }) {
  const grid: React.CSSProperties = { display: 'grid', gap: 12, maxWidth: 780, margin: '0 auto' };
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 };

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', margin: '0 0 12px' }}>用語説明</h3>
      <div style={grid}>
        {items.map((it, i) => (
          <div key={i} style={card}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{it.term}</div>
            <div style={{ color: '#64748b' }}>{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Q&A（クリックで開閉） */
export function QA({ q, a }: { q: string; a: React.ReactNode }) {
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16 };
  const btn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #2563eb', color: '#fff', background: '#2563eb' };
  const [open, setOpen] = useState(false);
  return (
    <div style={card}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{q}</div>
      <button style={btn} onClick={() => setOpen(v => !v)}>{open ? '答えを隠す' : '答えを見る'}</button>
      {open && <div style={{ marginTop: 12, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>{a}</div>}
    </div>
  );
}
