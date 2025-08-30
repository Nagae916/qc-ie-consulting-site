// src/components/guide/GuideLayout.tsx
'use client';
import React, { useState } from 'react';

/**
 * 恒久対策のポイント
 * - title を任意化（optional）。未指定でもビルド/描画が破綻しない。
 * - ヘッダー/導入の見た目は可能な限り従来踏襲。title 未指定時は安全に非表示またはプレースホルダ。
 * - MDX 側では {title} に依存せず、ページ側（/pages/guides/[exam]/[slug].tsx）で <h1>{guide.title}</h1> を描画する方針。
 */

/** ページ全体のレイアウト */
export function GuideLayout({
  title,        // ← 任意（なくてもOK）
  intro,        // 任意
  children,
}: {
  title?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const wrap: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, system-ui, sans-serif',
    color: '#334155',
  };
  const header: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
  };
  const headerInner: React.CSSProperties = {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '12px 16px',
    minHeight: 28, // タイトル非表示でも高さを確保してチラつきを防止
    display: 'flex',
    alignItems: 'center',
  };
  const main: React.CSSProperties = {
    maxWidth: 1100,
    margin: '0 auto',
    padding: 16,
  };
  const footer: React.CSSProperties = {
    borderTop: '1px solid #e5e7eb',
    marginTop: 32,
    padding: '16px 0',
    textAlign: 'center',
    color: '#6b7280',
  };

  return (
    <div style={wrap}>
      <header style={header}>
        <div style={headerInner}>
          {/* title があれば表示。なければ非表示（スペースで高さは維持） */}
          {title ? (
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1e40af', margin: 0 }}>
              {title}
            </h1>
          ) : (
            <span style={{ visibility: 'hidden' }}>.</span>
          )}
        </div>
      </header>

      <main style={main}>
        {/* 導入ブロック：title 未指定でも intro があれば表示。
            見出し(h2)は title がある時のみ。intro 単独なら本文だけを表示 */}
        {intro && (
          <section style={{ textAlign: 'center', marginBottom: 24 }}>
            {title ? (
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>{title}</h2>
            ) : null}
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
  const grid: React.CSSProperties = {
    display: 'grid',
    gap: 12,
    maxWidth: 780,
    margin: '0 auto',
  };
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 20,
          fontWeight: 800,
          textAlign: 'center',
          margin: '0 0 12px',
        }}
      >
        用語説明
      </h3>
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
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 16,
  };
  const btn: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: 8,
    border: '1px solid #2563eb',
    color: '#fff',
    background: '#2563eb',
  };
  const [open, setOpen] = useState(false);
  return (
    <div style={card}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{q}</div>
      <button style={btn} onClick={() => setOpen((v) => !v)}>
        {open ? '答えを隠す' : '答えを見る'}
      </button>
      {open && (
        <div
          style={{
            marginTop: 12,
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 12,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

/** 既存の default import にも対応 */
export default GuideLayout;
