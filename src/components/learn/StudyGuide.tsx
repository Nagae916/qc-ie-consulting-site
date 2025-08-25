// src/components/learn/StudyGuide.tsx
import { useMemo, useState } from "react";

/* ========== A) 回帰分析・分散分析 ========== */
export function StudyGuide_RegressionAnova() {
  const [goal, setGoal] = useState<"" | "predict" | "compare">("");
  const [groups, setGroups] = useState<"" | "2" | "3+">("");
  const active = useMemo(() => {
    if (!goal) return "default";
    if (goal === "predict") return "regression";
    if (goal === "compare") return groups === "2" ? "ttest" : groups === "3+" ? "anova" : "default";
    return "default";
  }, [goal, groups]);

  return (
    <section className="mt-2">
      <h2 className="text-2xl font-bold text-brand-900 mb-4">回帰分析・分散分析スタディガイド</h2>
      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium">1. 分析目的</label>
            <select
              className="w-full p-3 rounded-lg border mt-2"
              value={goal}
              onChange={(e) => {
                const v = e.target.value as typeof goal;
                setGoal(v);
                if (v !== "compare") setGroups("");
              }}
            >
              <option value="">選択してください</option>
              <option value="predict">関係性を調べ予測したい（回帰）</option>
              <option value="compare">平均の差を検定したい（t/ANOVA）</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">2. グループ数</label>
            <select
              className="w-full p-3 rounded-lg border mt-2"
              disabled={goal !== "compare"}
              value={groups}
              onChange={(e) => setGroups(e.target.value as typeof groups)}
            >
              <option value="">選択してください</option>
              <option value="2">2つ</option>
              <option value="3+">3つ以上</option>
            </select>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          {active === "default" && <p className="text-gray-600">上の質問に答えると推奨手法が表示されます。</p>}
          {active === "regression" && (
            <ResultCard
              color="emerald"
              title="推奨手法: 回帰分析"
              body="説明変数が目的変数に与える影響をモデル化。予測・要因分析に有効。"
              cheat={["連続量×連続量", "残差診断", "線形/非線形"]}
            />
          )}
          {active === "ttest" && (
            <ResultCard
              color="purple"
              title="推奨手法: t検定"
              body="2群の平均差を検定。対応の有無、等分散性に注意。"
              cheat={["対応あり/なし", "等分散確認", "正規性・独立性"]}
            />
          )}
          {active === "anova" && (
            <ResultCard
              color="blue"
              title="推奨手法: 分散分析（ANOVA）"
              body="3群以上の平均差を検定。F統計量を用いる。"
              cheat={["多重比較", "効果量", "等分散性の検討"]}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ========== B) t / Z / F / χ² / ANOVA ========== */
export function StudyGuide_StatTests() {
  const [goal, setGoal] = useState<"" | "mean" | "variance" | "category">("");
  const [groups, setGroups] = useState<"" | "1" | "2" | "3+">("");
  const [variance, setVariance] = useState<"" | "known" | "unknown">("");

  const active = useMemo(() => {
    if (!goal) return "default";
    if (goal === "mean") {
      if (groups === "3+") return "anova";
      if (groups === "1" || groups === "2") {
        if (variance === "known") return "z";
        if (variance === "unknown") return "t";
      }
      return "default";
    }
    if (goal === "variance") {
      if (groups === "1") return "chi_var";
      if (groups === "2" || groups === "3+") return "f";
      return "default";
    }
    if (goal === "category") return "chi";
    return "default";
  }, [goal, groups, variance]);

  return (
    <section className="mt-2">
      <h2 className="text-2xl font-bold text-brand-900 mb-4">統計手法スタディガイド</h2>
      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        {/* 選択UI */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium">1. 何を比較？</label>
            <select
              className="w-full p-3 rounded-lg border mt-2"
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value as any);
                setGroups("");
                setVariance("");
              }}
            >
              <option value="">選択してください</option>
              <option value="mean">平均の差</option>
              <option value="variance">分散（ばらつき）の差</option>
              <option value="category">カテゴリの関連性</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">2. グループ数</label>
            <select
              className="w-full p-3 rounded-lg border mt-2"
              value={groups}
              onChange={(e) => setGroups(e.target.value as any)}
              disabled={goal === "category" || !goal}
            >
              <option value="">選択してください</option>
              <option value="1">1つ</option>
              <option value="2">2つ</option>
              <option value="3+">3つ以上</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">3. 母分散</label>
            <select
              className="w-full p-3 rounded-lg border mt-2"
              value={variance}
              onChange={(e) => setVariance(e.target.value as any)}
              disabled={!(goal === "mean" || goal === "variance")}
            >
              <option value="">選択してください</option>
              <option value="known">既知</option>
              <option value="unknown">未知</option>
            </select>
          </div>
        </div>

        {/* 結果 */}
        <div className="space-y-3">
          {active === "default" && <p className="text-gray-600">上の質問に答えると推奨手法が表示されます。</p>}
          {active === "t" && (
            <ResultCard
              color="emerald"
              title="推奨手法: t検定"
              body="1または2群の平均差を検定（母分散未知）。"
              cheat={["対応の有無", "等分散の確認", "正規性・独立性"]}
            />
          )}
          {active === "z" && (
            <ResultCard
              color="teal"
              title="推奨手法: Z検定"
              body="平均差で母分散既知、かつ大標本のときに使用（実務では稀）。"
              cheat={["母分散既知", "大標本", "理論教材向け"]}
            />
          )}
          {active === "f" && (
            <ResultCard
              color="blue"
              title="推奨手法: F検定"
              body="複数群の分散（ばらつき）の差を検定。"
              cheat={["正規性・独立性", "分散比の解釈", "ANOVAと関連"]}
            />
          )}
          {active === "chi" && (
            <ResultCard
              color="purple"
              title="推奨手法: χ²（独立性の検定）"
              body="カテゴリ×カテゴリの関連性を検定。"
              cheat={["期待度数に注意", "自由度=(r-1)(c-1)", "残差分析"]}
            />
          )}
          {active === "chi_var" && (
            <ResultCard
              color="fuchsia"
              title="推奨手法: χ²（1標本の分散）"
              body="1標本の分散が既知の母分散と異なるかの検定。"
              cheat={["正規性", "σ^2 の仮説検定", "規格適合性"]}
            />
          )}
          {active === "anova" && (
            <ResultCard
              color="orange"
              title="推奨手法: 分散分析（ANOVA）"
              body="3群以上の平均差を検定。F統計量を用いる。"
              cheat={["多重比較", "効果量 η²", "Bartlett/Levene"]}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ========== C) QC七つ道具 ========== */
export function StudyGuide_QC7Tools() {
  const items = [
    { t: "パレート図", p: "主要因の特定（ABC分析）。改善の優先度付け。" },
    { t: "特性要因図（魚の骨）", p: "要因の洗い出しと構造化（4M/4M1E/6M）。" },
    { t: "グラフ（折れ線/棒…）", p: "傾向・水準の把握、異常の可視化。" },
    { t: "チェックシート", p: "現場で簡便にデータ収集（数え落とし防止）。" },
    { t: "ヒストグラム", p: "分布形状の把握（偏り/歪度/多峰性）。" },
    { t: "散布図", p: "2変数の関係性（相関・外れ値）。" },
    { t: "管理図", p: "統計的な異常検知（特別原因と偶然原因）。" },
  ];
  return (
    <section className="mt-2">
      <h2 className="text-2xl font-bold text-brand-900 mb-4">QC七つ道具（現場のデータ解析）</h2>
      <ul className="space-y-2">
        {items.map((x) => (
          <li key={x.t} className="bg-white border rounded p-3">
            <span className="font-semibold">{x.t}</span>
            <span className="text-gray-700 ml-2">{x.p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ========== D) 新QC七つ道具 ========== */
export function StudyGuide_NewQC7Tools() {
  const items = [
    { t: "親和図法", p: "KJ法。アイデア/事実をグルーピングして本質を抽出。" },
    { t: "連関図法", p: "要因間の因果・論理の強結合を見える化。" },
    { t: "系統図法", p: "目的→手段のブレイクダウンで具体策を展開。" },
    { t: "マトリックス図法", p: "要素間の関係性を行列で整理（強/中/弱）。" },
    { t: "マトリックスデータ解析法", p: "数値データの多変量解析の土台に。" },
    { t: "PDPC法", p: "過程決定計画図。手段とリスク/対策を網羅。" },
    { t: "アローダイアグラム法", p: "PERT/CPM。工程の順序・クリティカルパス管理。" },
  ];
  return (
    <section className="mt-2">
      <h2 className="text-2xl font-bold text-brand-900 mb-4">新QC七つ道具（企画・設計の問題解決）</h2>
      <ul className="space-y-2">
        {items.map((x) => (
          <li key={x.t} className="bg-white border rounded p-3">
            <span className="font-semibold">{x.t}</span>
            <span className="text-gray-700 ml-2">{x.p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ========== 小物カード ========== */
function ResultCard({
  color,
  title,
  body,
  cheat,
}: {
  color: "emerald" | "teal" | "blue" | "purple" | "fuchsia" | "orange";
  title: string;
  body: string;
  cheat: string[];
}) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700",
    teal: "text-teal-700",
    blue: "text-blue-700",
    purple: "text-purple-700",
    fuchsia: "text-fuchsia-700",
    orange: "text-orange-700",
  };
  return (
    <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
      <h5 className={`text-lg font-semibold mb-1 ${colorMap[color]}`}>{title}</h5>
      <p className="text-gray-700">{body}</p>
      {cheat?.length ? (
        <div className="mt-3 p-3 bg-white rounded border">
          <ul className="list-disc ml-5 space-y-1">
            {cheat.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
