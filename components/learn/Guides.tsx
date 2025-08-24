// components/learn/Guides.tsx
import { useMemo, useState } from "react";

/** ---- 型定義 ---- */
export type GuideMeta = {
  id: string;
  title: string;
  description: string;
  component: () => JSX.Element;
  tags?: string[];
};

/** ---- 共通: QA(解説) の開閉 ---- */
function ToggleQA({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg border border-brand-200 p-5">
      <p className="font-medium mb-3">{q}</p>
      <button
        className="inline-flex items-center rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-sm px-4 py-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "答えを隠す" : "答えを見る"}
      </button>
      {open && <div className="mt-3 p-4 bg-brand-50 rounded border border-brand-200 text-gray-800">{a}</div>}
    </div>
  );
}

/** ---- 共通: 結果カード ---- */
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
  const [showCheat, setShowCheat] = useState(false);
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700",
    teal: "text-teal-700",
    blue: "text-sky-700",
    purple: "text-purple-700",
    fuchsia: "text-fuchsia-700",
    orange: "text-orange-700",
  };
  return (
    <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
      <h5 className={`text-lg font-semibold mb-1 ${colorMap[color]}`}>{title}</h5>
      <p className="text-gray-700">{body}</p>
      <div className="mt-4 flex gap-3">
        <button
          className="text-white text-sm px-3 py-2 rounded bg-brand-700 hover:bg-brand-800"
          onClick={() => setShowCheat((v) => !v)}
        >
          💡検定手法の要点
        </button>
      </div>
      {showCheat && (
        <div className="mt-3 p-4 bg-white rounded border border-brand-200 text-sm">
          <ul className="list-disc ml-5 space-y-1">
            {cheat.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** ================================================================
 * ガイドA：回帰分析・分散分析
 * ================================================================ */
function StudyGuide_RegressionAnova() {
  const [goal, setGoal] = useState<"" | "predict" | "compare">("");
  const [groups, setGroups] = useState<"" | "2" | "3+">("");

  const active = useMemo(() => {
    if (!goal) return "default";
    if (goal === "predict") return "regression";
    if (goal === "compare") {
      if (groups === "2") return "ttest";
      if (groups === "3+") return "anova";
      return "default";
    }
    return "default";
  }, [goal, groups]);

  return (
    <section className="mt-2 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">回帰分析・分散分析スタディガイド</h2>
        <p className="mt-2 text-gray-700">
          目的に応じて <strong>回帰分析 / t検定 / 分散分析(ANOVA)</strong> を選べるナビ。用語集と理解度チェック付き。
        </p>
      </div>

      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <h3 className="text-xl font-semibold text-brand-900 text-center mb-6">統計手法ナビゲーター</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. 分析の目的は？</label>
            <select
              value={goal}
              onChange={(e) => {
                const v = e.target.value as typeof goal;
                setGoal(v);
                if (v !== "compare") setGroups("");
              }}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="predict">変数間の関係をモデル化して予測したい</option>
              <option value="compare">グループ間の平均差を検定したい</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. 比較するグループ数は？</label>
            <select
              value={groups}
              onChange={(e) => setGroups(e.target.value as typeof groups)}
              disabled={goal !== "compare"}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="2">2群</option>
              <option value="3+">3群以上</option>
            </select>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          {active === "default" && <p className="text-center text-gray-500">上の質問に答えると、ここに推奨手法が表示されます。</p>}

          {active === "regression" && (
            <ResultCard
              color="emerald"
              title="推奨手法: 回帰分析"
              body="説明変数が目的変数に与える影響をモデル化。予測・要因分析に有効（数値×数値）。"
              cheat={[
                "単回帰/重回帰、線形性・独立性・等分散性・正規性の前提",
                "決定係数・有意性・残差診断で妥当性を評価",
                "カテゴリ×数値はダミー変数で回帰に統合可",
              ]}
            />
          )}

          {active === "ttest" && (
            <ResultCard
              color="purple"
              title="推奨手法: t検定"
              body="2群の平均差を検定（対応の有無・分散の等質性に注意）。"
              cheat={["対応あり/なし、等分散/異分散で手法切替", "正規性の確認（Shapiro-Wilk 等）"]}
            />
          )}

          {active === "anova" && (
            <ResultCard
              color="blue"
              title="推奨手法: 分散分析（ANOVA）"
              body="3群以上の平均差を検定。要因の効果と誤差の分解で差を評価。"
              cheat={["有意なら多重比較（Tukey 等）", "前提：正規性・独立性・等分散性"]}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ToggleQA q="用語ミニ解説" a="回帰：連続×連続の関係をモデル化。t：2群の平均差。ANOVA：3群以上の平均差。" />
        <ToggleQA q="理解度チェック" a="回帰は関係モデリング、ANOVAは平均差の有意性検定が主目的。" />
      </div>
    </section>
  );
}

/** ================================================================
 * ガイドB：統計手法（t / Z / F / χ² / ANOVA）
 * ================================================================ */
function StudyGuide_StatTests() {
  const [goal, setGoal] = useState<"" | "mean" | "variance" | "category">("");
  const [groups, setGroups] = useState<"" | "1" | "2" | "3+">("");
  const [variance, setVariance] = useState<"" | "known" | "unknown">("");

  const active = useMemo(() => {
    if (!goal) return "default";

    if (goal === "mean") {
      if (groups === "1") return variance === "known" ? "z_1" : variance === "unknown" ? "t_1" : "default";
      if (groups === "2") return variance === "known" ? "z_2" : variance === "unknown" ? "t_2" : "default";
      if (groups === "3+") return "anova";
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
    <section className="mt-2 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">統計手法スタディガイド</h2>
        <p className="mt-2 text-gray-700">
          目的とデータ条件から、<strong>t / Z / F / χ² / ANOVA</strong> をナビゲートします。
        </p>
      </div>

      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <h3 className="text-xl font-semibold text-brand-900 text-center mb-6">検定ナビ</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. 目的</label>
            <select
              value={goal}
              onChange={(e) => {
                const v = e.target.value as typeof goal;
                setGoal(v);
                setGroups("");
                setVariance("");
              }}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="mean">平均の差</option>
              <option value="variance">分散（ばらつき）の差</option>
              <option value="category">カテゴリの関連/適合</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. グループ数</label>
            <select
              value={groups}
              onChange={(e) => setGroups(e.target.value as typeof groups)}
              disabled={goal === "category"}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="1">1群</option>
              <option value="2">2群</option>
              <option value="3+">3群以上</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3. 母分散は既知？</label>
            <select
              value={variance}
              onChange={(e) => setVariance(e.target.value as typeof variance)}
              disabled={goal !== "mean" || groups === "" || groups === "3+"}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="known">既知（Z）</option>
              <option value="unknown">未知（t）</option>
            </select>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          {active === "default" && (
            <p className="text-center text-gray-500">上の質問に答えると、ここに推奨手法が表示されます。</p>
          )}

          {active === "z_1" && (
            <ResultCard
              color="teal"
              title="推奨手法: Z検定（1標本）"
              body="母分散既知で、標本平均が目標値（母平均）と等しいかを検定。"
              cheat={["大標本で近似適用可", "正規性の前提"]}
            />
          )}
          {active === "t_1" && (
            <ResultCard
              color="purple"
              title="推奨手法: t検定（1標本）"
              body="母分散未知のとき、標本平均が目標値と等しいかを検定。"
              cheat={["正規母集団を仮定", "自由度 n-1 の t 分布"]}
            />
          )}
          {active === "z_2" && (
            <ResultCard
              color="teal"
              title="推奨手法: Z検定（2標本）"
              body="母分散既知で2群の平均差を検定。実務では稀。"
              cheat={["独立標本・分散既知の前提", "実務では多く t を使用"]}
            />
          )}
          {active === "t_2" && (
            <ResultCard
              color="purple"
              title="推奨手法: t検定（2標本）"
              body="母分散未知の2群の平均差を検定。等分散ならスチューデント、異分散ならウェルチ。"
              cheat={["正規性の確認", "対応あり/なしに留意"]}
            />
          )}
          {active === "anova" && (
            <ResultCard
              color="blue"
              title="推奨手法: 分散分析（ANOVA）"
              body="3群以上の平均差を検定。F統計量を用いる。"
              cheat={["有意後は多重比較へ", "正規性・独立性・等分散性"]}
            />
          )}
          {active === "chi_var" && (
            <ResultCard
              color="orange"
              title="推奨手法: χ²検定（分散, 1群）"
              body="母分散が規格値と一致するかを検定。"
              cheat={["正規性の前提重要", "自由度 n-1 の χ² 分布"]}
            />
          )}
          {active === "f" && (
            <ResultCard
              color="fuchsia"
              title="推奨手法: F検定（分散比）"
              body="2群以上の分散の等質性を検定（ANOVA前提確認など）。"
              cheat={["正規性の前提", "多群ではバートレット/ルビーン検定も検討"]}
            />
          )}
          {active === "chi" && (
            <ResultCard
              color="orange"
              title="推奨手法: χ²検定（カテゴリ）"
              body="カテゴリ×カテゴリの独立性/適合度を検定。"
              cheat={["期待度数の下限(≳5)に注意", "小標本はフィッシャー検定も検討"]}
            />
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        ※前提（正規性・独立性・等分散性・期待度数など）を確認してから適用してください。
      </p>
    </section>
  );
}

/** ---- 公開レジストリ ---- */
export const GUIDES: GuideMeta[] = [
  {
    id: "regression-anova",
    title: "回帰分析・分散分析スタディガイド",
    description: "目的に応じて手法を選べるナビ＋用語・理解度チェック付き",
    tags: ["統計", "QC"],
    component: StudyGuide_RegressionAnova,
  },
  {
    id: "stat-tests",
    title: "統計手法スタディガイド（t / Z / F / χ² / ANOVA）",
    description: "平均・分散・カテゴリの観点から最適な検定をナビゲート",
    tags: ["検定", "品質管理"],
    component: StudyGuide_StatTests,
  },
];
