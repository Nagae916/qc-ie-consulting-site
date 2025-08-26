'use client';
import React, { useMemo, useState } from 'react';

type Props = {
  // ラベルの上書きや初期値が必要な場合だけ指定
  initialGoal?: '' | 'predict' | 'compare';
  initialGroups?: '' | '2' | '3+';
  title?: string;
};

export default function MethodNavigator({
  initialGoal = '',
  initialGroups = '',
  title = '統計手法ナビゲーター',
}: Props) {
  const [goal, setGoal] = useState<Props['initialGoal']>(initialGoal);
  const [groups, setGroups] = useState<Props['initialGroups']>(initialGroups);

  const card: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,.04)' };
  const select: React.CSSProperties = { width:'100%', padding:'12px', border:'1px solid #cbd5e1', borderRadius:12, background:'#fff' };

  const result = useMemo(() => {
    if (!goal) return 'default';
    if (goal === 'predict') return 'regression';
    if (goal === 'compare') {
      if (groups === '2') return 'ttest';
      if (groups === '3+') return 'anova';
      return 'default';
    }
    return 'default';
  }, [goal, groups]);

  const ResultCard = ({ heading, color, children }:{
    heading: string; color: string; children: React.ReactNode;
  }) => (
    <div style={{ ...card, borderColor:'#e5e7eb', transition:'opacity .2s, transform .2s' }}>
      <h4 style={{ fontWeight: 700, margin: 0, color }}>{heading}</h4>
      <div style={{ color:'#475569', marginTop:8 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ ...card, maxWidth: 880, margin:'0 auto' }}>
      <h3 style={{ textAlign:'center', fontSize: 20, fontWeight: 800, margin: '0 0 16px' }}>{title}</h3>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', gap:16, marginBottom:16 }}>
        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#334155', marginBottom:6 }}>
            1. 分析の目的は何ですか？
          </label>
          <select
            value={goal}
            onChange={(e) => { setGoal(e.target.value as any); if (e.target.value !== 'compare') setGroups(''); }}
            style={select}
          >
            <option value="">選択してください</option>
            <option value="predict">変数の関係性を調べて予測したい</option>
            <option value="compare">グループ間の平均値に差があるか調べたい</option>
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#334155', marginBottom:6 }}>
            2. 比較するグループの数は？
          </label>
          <select
            value={groups}
            onChange={(e) => setGroups(e.target.value as any)}
            disabled={goal !== 'compare'}
            style={{ ...select, color: goal === 'compare' ? undefined : '#94a3b8', backgroundColor: goal === 'compare' ? '#fff' : '#f8fafc' }}
          >
            <option value="">選択してください</option>
            <option value="2">2つ</option>
            <option value="3+">3つ以上</option>
          </select>
        </div>
      </div>

      {/* 結果表示 */}
      {result === 'regression' && (
        <ResultCard heading="推奨手法：回帰分析" color="#15803d">
          ある変数（説明変数）が別の変数（目的変数）に与える影響をモデル化し、予測や要因分析に用います。主に数値データ間の関係性を扱います。
        </ResultCard>
      )}
      {result === 'anova' && (
        <ResultCard heading="推奨手法：分散分析 (ANOVA)" color="#1d4ed8">
          3つ以上のグループの平均値に統計的に有意差があるかを検定します。全体のばらつきを要因と誤差に分解して評価します。
        </ResultCard>
      )}
      {result === 'ttest' && (
        <ResultCard heading="推奨手法：t検定" color="#6d28d9">
          2つのグループの平均に差があるかを調べる基本手法です。分散分析はその拡張として位置づけられます。
        </ResultCard>
      )}
      {result === 'default' && (
        <div style={{ textAlign:'center', color:'#64748b' }}>
          上の質問に答えると、ここに最適な手法が表示されます。
        </div>
      )}
    </div>
  );
}
