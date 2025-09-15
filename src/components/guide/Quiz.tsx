// src/components/guide/Quiz.tsx
'use client';

import React, { useMemo, useState } from 'react';

/** ===== 型 =====
 * ① QA（従来の一問一答）
 * ② MCQ（選択式）: 単一正解 or 複数正解の両対応
 */
type QAItem = {
  q: React.ReactNode;           // 質問（MDX可）
  a: React.ReactNode;           // 回答（MDX可）
};

type MCQItemSingle = {
  q: React.ReactNode;           // 質問
  choices: React.ReactNode[];   // 選択肢
  answer: number;               // 正解のインデックス（0-based）
  explain?: React.ReactNode;    // 解説（任意）
};

type MCQItemMulti = {
  q: React.ReactNode;
  choices: React.ReactNode[];
  answer: number[];             // 複数正解（0-based）
  explain?: React.ReactNode;
};

type Item = QAItem | MCQItemSingle | MCQItemMulti;

function isQA(i: Item): i is QAItem {
  return (i as any).a !== undefined && (i as any).choices === undefined;
}
function isMulti(i: MCQItemSingle | MCQItemMulti): i is MCQItemMulti {
  return Array.isArray((i as any).answer);
}

export function Quiz({ items }: { items: Item[] }) {
  return (
    <section>
      {items.map((it, idx) => (
        <div className="qa-card" key={idx}>
          {isQA(it) ? <QAView item={it} /> : <MCQView item={it as MCQItemSingle | MCQItemMulti} index={idx} />}
        </div>
      ))}
    </section>
  );
}

/* ====== QA（一問一答・ノーJS開閉） ====== */
function QAView({ item }: { item: QAItem }) {
  return (
    <>
      <p className="qa-q">{item.q}</p>
      <details className="qa-a">
        <summary>答えを見る</summary>
        <div>{item.a}</div>
      </details>
    </>
  );
}

/* ====== MCQ（選択式） ====== */
function MCQView({ item, index }: { item: MCQItemSingle | MCQItemMulti; index: number }) {
  const name = useMemo(() => `mcq-${index}`, [index]);
  const [picked, setPicked] = useState<number | null>(null);
  const [pickedSet, setPickedSet] = useState<Set<number>>(new Set());
  const multi = isMulti(item);

  const handleSingle = (i: number) => setPicked(i);

  const toggleMulti = (i: number) => {
    setPicked(null);
    setPickedSet((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  // 判定
  let verdict: 'none' | 'correct' | 'wrong' = 'none';
  if (!multi && picked !== null) {
    verdict = picked === (item as MCQItemSingle).answer ? 'correct' : 'wrong';
  } else if (multi && pickedSet.size > 0) {
    const ans = new Set((item as MCQItemMulti).answer);
    const eq = pickedSet.size === ans.size && [...pickedSet].every((v) => ans.has(v));
    verdict = eq ? 'correct' : 'wrong';
  }

  // スタイル（軽量・依存なし）
  const choiceStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '8px 10px',
    cursor: 'pointer',
    background: '#fff',
  };
  const choiceActive: React.CSSProperties = { borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37,99,235,.15)' };
  const labelBase: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };

  return (
    <>
      <p className="qa-q">{item.q}</p>
      <div style={{ display: 'grid', gap: 8, margin: '8px 0 6px' }}>
        {item.choices.map((c, i) => {
          const checked = multi ? pickedSet.has(i) : picked === i;
          return (
            <label key={i} style={{ ...labelBase, ...(checked ? choiceActive : {}) }}>
              {multi ? (
                <input
                  type="checkbox"
                  name={name}
                  checked={checked}
                  onChange={() => toggleMulti(i)}
                  style={{ width: 16, height: 16 }}
                />
              ) : (
                <input
                  type="radio"
                  name={name}
                  checked={checked}
                  onChange={() => handleSingle(i)}
                  style={{ width: 16, height: 16 }}
                />
              )}
              <span style={choiceStyle}>{c}</span>
            </label>
          );
        })}
      </div>

      {/* 判定表示（選択があれば即時表示） */}
      {verdict !== 'none' && (
        <div
          className="note"
          style={{
            borderLeft: '4px solid',
            borderLeftColor: verdict === 'correct' ? '#10b981' : '#ef4444',
            background: '#f9fafb',
            marginTop: 8,
            padding: '8px 10px',
            borderRadius: 6,
          }}
        >
          {verdict === 'correct' ? '正解！' : '不正解'}
        </div>
      )}

      {/* 解説は details で開閉（常に利用可） */}
      {item.explain && (
        <details className="qa-a" style={{ marginTop: 8 }}>
          <summary>解説を見る</summary>
          <div>{item.explain}</div>
        </details>
      )}
    </>
  );
}
