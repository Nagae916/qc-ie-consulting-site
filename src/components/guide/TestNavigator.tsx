'use client';
import React, { useMemo, useState } from 'react';

type Goal = '' | 'mean' | 'variance' | 'category';
type Groups = '' | '1' | '2' | '3+';
type VarKnown = '' | 'known' | 'unknown';

type Sheet = {
  purpose: string;
  data: string;
  cond: string;
  examples: string[];
};

const SHEETS: Record<string, Sheet> = {
  't-test': {
    purpose: '1群または2群の平均の差を検定（母分散が未知のとき）',
    data: '連続量（正規性が望ましい）。対応あり/なしで手続きが異なる',
    cond: '独立性、正規性（または中心極限定理で標本十分大）、2群では分散の等質性を要検討',
    examples: ['改修前後の歩留まり差（対応あり）', 'ラインA/Bの平均寸法差（対応なし）'],
  },
  'z-test': {
    purpose: '1群または2群の平均の差を検定（母分散が既知のとき）',
    data: '連続量。標本サイズが大きいほど近似精度↑',
    cond: '母分散既知、または既知に近い十分な事前知識',
    examples: ['規格化済み工程の平均値差を理論分散で検定'],
  },
  'f-test': {
    purpose: '2群以上の分散（ばらつき）の差を検定',
    data: '連続量',
    cond: '各群の正規性、独立性',
    examples: ['サプライヤー別の寸法ばらつき差', '設備A/Bの変動比較'],
  },
  'chi2-ind': {
    purpose: 'カテゴリ×カテゴリの独立性（関連）を検定',
    data: 'カテゴリ（例：ライン×不良種別）',
    cond: '期待度数が十分大（一般に5以上が目安）',
    examples: ['生産ラインと不良モードの関連', '性別と満足/不満足の関連'],
  },
  'chi2-var': {
    purpose: '1標本の分散が既知の母分散と異なるかを検定',
    data: '連続量',
    cond: '正規性、独立性',
    examples: ['新製品の寸法ばらつきが仕様分散と一致するか'],
  },
  'anova': {
    purpose: '3群以上の平均の差を検定（F検定の枠組み）',
    data: '連続量',
    cond: '各群の正規性、等分散性（等分散でない場合はWelch-ANOVA等）',
    examples: ['3種類以上の治具で平均加工時間に差があるか'],
  },
};

export default function TestNavigator() {
  const [goal, setGoal] = useState<Goal>('');
  const [groups, setGroups] = useState<Groups>('');
  const [varKnown, setVarKnown] = useState<VarKnown>('');

  const resultKey = useMemo(() => {
    if (!goal) return 'default';
    if (goal === 'category') return 'chi2-ind';
    if (goal === 'variance') {
      if (groups === '1') return 'chi2-var';
      if (groups === '2' || groups === '3+') return 'f-test';
      return 'default';
    }
    // goal === 'mean'
    if (groups === '3+') return 'anova';
    if (groups === '1' || groups === '2') {
      if (varKnown === 'known') return 'z-test';
      if (varKnown === 'unknown') return 't-test';
      return 'default';
    }
    return 'default';
  }, [goal, groups, varKnown]);

  const card: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,.04)' };
  const select: React.CSSProperties = { width:'100%', padding:'12px', border:'1px solid #cbd5e1', borderRadius:12, background:'#fff' };
  const btn: React.CSSProperties = { padding:'8px 12px', borderRadius:8, border:'1px solid #334155', background:'#334155', color:'#fff', fontSize:12 };

  const SheetView = ({ kind, title, color }:{ kind: keyof typeof SHEETS; title: string; color: string }) => {
    const s = SHEETS[kind];
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    return (
      <div style={{ ...card, borderColor:'#e5e7eb' }}>
        <h4 style={{ margin:0, fontWeight:800, color }}>{title}</h4>
        <p style={{ color:'#475569', margin:'8px 0 12px' }}>{s.purpose}</p>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button style={btn} onClick={() => setOpen1(v => !v)}>💡 検定手法解説</button>
          <button style={btn} onClick={() => setOpen2(v => !v)}>📝 応用ケース</button>
        </div>

        {open1 && (
          <div style={{ marginTop:12, background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:12, padding:12 }}>
            <ul style={{ margin:0, paddingLeft:18 }}>
              <li><b>目的</b>：{s.purpose}</li>
              <li><b>データタイプ</b>：{s.data}</li>
              <li><b>条件</b>：{s.cond}</li>
            </ul>
          </div>
        )}

        {open2 && (
          <div style={{ marginTop:12, background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>製造・QCでの例</div>
            <ul style={{ margin:0, paddingLeft:18 }}>
              {s.examples.map((e,i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ ...card, maxWidth: 920, margin:'0 auto' }}>
      <h3 style={{ textAlign:'center', fontSize:20, fontWeight:800, margin:'0 0 16px' }}>統計手法ナビゲーター</h3>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:16 }}>
        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#334155', marginBottom:6 }}>1. 何を比較したいですか？</label>
          <select value={goal} onChange={e => { setGoal(e.target.value as Goal); setGroups(''); setVarKnown(''); }} style={select}>
            <option value="">選択してください</option>
            <option value="mean">平均値の差</option>
            <option value="variance">ばらつき（分散）の差</option>
            <option value="category">カテゴリ（割合）の関連性</option>
          </select>
        </div>

        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#334155', marginBottom:6 }}>2. グループの数は？</label>
          <select
            value={groups}
            onChange={e => setGroups(e.target.value as Groups)}
            disabled={goal === '' || goal === 'category'}
            style={{ ...select, color: goal === 'category' || goal === '' ? '#94a3b8' : undefined, background: goal === 'category' || goal === '' ? '#f8fafc' : '#fff' }}
          >
            <option value="">選択してください</option>
            <option value="1">1つ</option>
            <option value="2">2つ</option>
            <option value="3+">3つ以上</option>
          </select>
        </div>

        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#334155', marginBottom:6 }}>3. 母分散は既知ですか？（平均の差のみ）</label>
          <select
            value={varKnown}
            onChange={e => setVarKnown(e.target.value as VarKnown)}
            disabled={goal !== 'mean' || (groups !== '1' && groups !== '2')}
            style={{ ...select, color: goal === 'mean' && (groups === '1' || groups === '2') ? undefined : '#94a3b8',
                     background: goal === 'mean' && (groups === '1' || groups === '2') ? '#fff' : '#f8fafc' }}
          >
            <option value="">選択してください</option>
            <option value="known">既知</option>
            <option value="unknown">未知</option>
          </select>
        </div>
      </div>

      {/* 結果表示 */}
      {resultKey === 'default' && (
        <div style={{ textAlign:'center', color:'#64748b' }}>
          上の質問に答えると、ここに最適な手法が表示されます。
        </div>
      )}
      {resultKey === 't-test'   && <SheetView kind="t-test"   title="推奨手法：t検定" color="#166534" />}
      {resultKey === 'z-test'   && <SheetView kind="z-test"   title="推奨手法：Z検定" color="#0f766e" />}
      {resultKey === 'f-test'   && <SheetView kind="f-test"   title="推奨手法：F検定" color="#1d4ed8" />}
      {resultKey === 'chi2-ind' && <SheetView kind="chi2-ind" title="推奨手法：χ²（カイ二乗）検定（独立性）" color="#6d28d9" />}
      {resultKey === 'chi2-var' && <SheetView kind="chi2-var" title="推奨手法：χ²（カイ二乗）検定（1標本の分散）" color="#a21caf" />}
      {resultKey === 'anova'    && <SheetView kind="anova"    title="推奨手法：分散分析（ANOVA）" color="#c2410c" />}
    </div>
  );
}
