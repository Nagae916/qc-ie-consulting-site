'use client';
import React, { useMemo, useState } from 'react';

type Props = {
  defaultMTBF?: number; minMTBF?: number; maxMTBF?: number; // 時間
  defaultMTTR?: number; minMTTR?: number; maxMTTR?: number; // 時間
};

export default function AvailabilitySimulator({
  defaultMTBF = 500, minMTBF = 10,  maxMTBF = 1000,
  defaultMTTR = 10,  minMTTR = 1,   maxMTTR = 100,
}: Props) {
  const [mtbf, setMTBF] = useState<number>(defaultMTBF);
  const [mttr, setMTTR] = useState<number>(defaultMTTR);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(v)));

  const availability = useMemo(() => {
    const a = mtbf + mttr === 0 ? 0 : (mtbf / (mtbf + mttr)) * 100;
    return Number.isFinite(a) ? a : 0;
  }, [mtbf, mttr]);

  // styles（シンプルなインライン）
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' };
  const label: React.CSSProperties = { fontWeight: 600, marginBottom: 6 };
  const input: React.CSSProperties = { width: 88, padding: 6, textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: 8 };
  const barBg: React.CSSProperties = { width: '100%', background: '#e5e7eb', borderRadius: 9999, height: 24 };
  const bar: React.CSSProperties = { height: 24, width: `${availability.toFixed(2)}%`, borderRadius: 9999, backgroundImage: 'linear-gradient(90deg,#2dd4bf,#3b82f6)' };

  return (
    <div style={card}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <div style={label}>MTBF（平均故障間隔 / 時間）</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="range" min={minMTBF} max={maxMTBF} value={mtbf}
              onChange={e => setMTBF(clamp(Number(e.target.value), minMTBF, maxMTBF))}
              style={{ flex: 1 }}
            />
            <input
              type="number" min={minMTBF} max={maxMTBF} value={mtbf}
              onChange={e => setMTBF(clamp(Number(e.target.value), minMTBF, maxMTBF))}
              style={input}
            />
            <span>時間</span>
          </div>
        </div>

        <div>
          <div style={label}>MTTR（平均修復時間 / 時間）</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="range" min={minMTTR} max={Math.max(minMTTR, maxMTTR)} value={mttr}
              onChange={e => setMTTR(clamp(Number(e.target.value), minMTTR, maxMTTR))}
              style={{ flex: 1 }}
            />
            <input
              type="number" min={minMTTR} max={maxMTTR} value={mttr}
              onChange={e => setMTTR(clamp(Number(e.target.value), minMTTR, maxMTTR))}
              style={input}
            />
            <span>時間</span>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ textAlign: 'center', fontWeight: 700, margin: '0 0 8px' }}>計算結果：アベイラビリティ（稼働率）</h4>
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
