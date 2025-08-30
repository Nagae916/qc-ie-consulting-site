// src/components/guide/AvailabilitySimulator.tsx
'use client';
import React, { useMemo, useState } from 'react';

type Props = {
  /** 時間（hour想定） */
  defaultMTBF?: number; minMTBF?: number; maxMTBF?: number;
  defaultMTTR?: number; minMTTR?: number; maxMTTR?: number;
};

export default function AvailabilitySimulator({
  defaultMTBF = 500, minMTBF = 10,  maxMTBF = 1000,
  defaultMTTR = 10,  minMTTR = 1,   maxMTTR = 100,
}: Props) {
  // min/max の取り違えがあっても壊れないようにソート
  const [mtbfMin, mtbfMax] = useMemo(
    () => [Math.min(minMTBF, maxMTBF), Math.max(minMTBF, maxMTBF)],
    [minMTBF, maxMTBF]
  );
  const [mttrMin, mttrMax] = useMemo(
    () => [Math.min(minMTTR, maxMTTR), Math.max(minMTTR, maxMTTR)],
    [minMTTR, maxMTTR]
  );

  // 入力の安全化
  const toFinite = (v: unknown, fb = 0) => Number.isFinite(Number(v)) ? Number(v) : fb;
  const clampRound = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, Math.round(v)));

  const [mtbf, setMTBF] = useState<number>(
    clampRound(toFinite(defaultMTBF, mtbfMin), mtbfMin, mtbfMax)
  );
  const [mttr, setMTTR] = useState<number>(
    clampRound(toFinite(defaultMTTR, mttrMin), mttrMin, mttrMax)
  );

  const onChangeMTBF = (raw: string) => {
    const n = clampRound(toFinite(raw, mtbf), mtbfMin, mtbfMax);
    setMTBF(n);
  };
  const onChangeMTTR = (raw: string) => {
    const n = clampRound(toFinite(raw, mttr), mttrMin, mttrMax);
    setMTTR(n);
  };

  // 稼働率[%]（0割ガード、NaNガード、0–100にクランプ）
  const availability = useMemo(() => {
    const denom = mtbf + mttr;
    const a = denom <= 0 ? 0 : (mtbf / denom) * 100;
    const safe = Number.isFinite(a) ? a : 0;
    return Math.max(0, Math.min(100, safe));
  }, [mtbf, mttr]);

  // styles（シンプルなインライン）
  const card: React.CSSProperties  = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' };
  const label: React.CSSProperties = { fontWeight: 600, marginBottom: 6 };
  const input: React.CSSProperties = { width: 88, padding: 6, textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: 8 };
  const barBg: React.CSSProperties = { width: '100%', background: '#e5e7eb', borderRadius: 9999, height: 24 };
  const bar: React.CSSProperties   = { height: 24, width: `${availability.toFixed(2)}%`, borderRadius: 9999, backgroundImage: 'linear-gradient(90deg,#2dd4bf,#3b82f6)' };

  return (
    <div style={card}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <div style={label}>MTBF（平均故障間隔 / 時間）</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              aria-label="MTBF range"
              type="range"
              min={mtbfMin} max={mtbfMax} value={mtbf}
              onChange={e => onChangeMTBF(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              aria-label="MTBF number"
              type="number"
              min={mtbfMin} max={mtbfMax} value={mtbf}
              onChange={e => onChangeMTBF(e.target.value)}
              style={input}
            />
            <span>時間</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
            範囲: {mtbfMin}–{mtbfMax} 時間
          </div>
        </div>

        <div>
          <div style={label}>MTTR（平均修復時間 / 時間）</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              aria-label="MTTR range"
              type="range"
              min={mttrMin} max={mttrMax} value={mttr}
              onChange={e => onChangeMTTR(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              aria-label="MTTR number"
              type="number"
              min={mttrMin} max={mttrMax} value={mttr}
              onChange={e => onChangeMTTR(e.target.value)}
              style={input}
            />
            <span>時間</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
            範囲: {mttrMin}–{mttrMax} 時間
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ textAlign: 'center', fontWeight: 700, margin: '0 0 8px' }}>
          計算結果：アベイラビリティ（稼働率）
        </h4>
        <p style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#A98D74', margin: '8px 0' }}>
          {availability.toFixed(2)} %
        </p>
        <div style={barBg}>
          <div style={bar} />
        </div>
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
          計算式: MTBF / (MTBF + MTTR)
        </p>
      </div>
    </div>
  );
}
