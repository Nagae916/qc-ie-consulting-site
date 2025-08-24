// pages/guide/_registry.tsx
import { useEffect, useMemo, useState } from "react";

/** =========================
 * 小物コンポーネント
 * ========================= */
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
    blue: "text-blue-700",
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
          className={`text-white text-sm px-3 py-2 rounded bg-brand-700 hover:bg-brand-800`}
          onClick={() => setShowCheat((v) => !v)}
        >
          💡検定手法解説
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

/** =========================
 * ガイドA：回帰・分散分析
 * ========================= */
function StudyGuide_RegressionAnova() {
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-900">回帰分析・分散分析スタディガイド</h2>
        <p className="mt-2 text-gray-700">目的に応じて手法（回帰／t検定／分散分析）を選べるナビ＋用語・確認質問。</p>
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
              <option value="predict">関係をモデル化して予測したい</option>
              <option value="compare">グループ平均の差を検定したい</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. グループ数は？</label>
            <select
              value={groups}
              onChange={(e) => setGroups(e.target.value as typeof groups)}
              disabled={goal !== "compare"}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="2">2つ</option>
              <option value="3+">3つ以上</option>
            </select>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          {active === "default" && <p className="text-center text-gray-500">上の質問に答えると結果が表示されます。</p>}
          {active === "regression" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-emerald-700 mb-1">推奨: 回帰分析</h5>
              <p className="text-gray-700">説明変数→目的変数の影響をモデル化（数値×数値）。予測・要因分析に有効。</p>
            </div>
          )}
          {active === "anova" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-sky-700 mb-1">推奨: 分散分析（ANOVA）</h5>
              <p className="text-gray-700">3群以上の平均差を検定。要因の効果と誤差を分解して評価。</p>
            </div>
          )}
          {active === "ttest" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-purple-700 mb-1">推奨: t検定</h5>
              <p className="text-gray-700">2群の平均差の検定。ANOVAは多群拡張。</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">重要用語</h4>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { t: "説明変数", b: "結果に影響を与えると考えられる原因側の変数。" },
            { t: "目的変数", b: "説明変数によって変動する結果側の変数。" },
            { t: "平方和", b: "ばらつきの大きさ。ANOVAでは全変動・要因間・要因内に区分。" },
            { t: "自由度", b: "独立に取りうる情報の数。" },
          ].map((x) => (
            <div key={x.t} className="bg-white rounded-lg border border-brand-200 p-5">
              <h6 className="font-semibold">{x.t}</h6>
              <p className="text-gray-700 mt-1">{x.b}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">キー質問で理解度チェック</h4>
        <div className="max-w-3xl mx-auto space-y-6">
          <ToggleQA q="Q1: 気温とアイス売上の関係を予測したい手法は？" a="回帰分析。" />
          <ToggleQA q="Q2: 4製法の平均差は？" a="分散分析（ANOVA）。" />
          <ToggleQA q="Q3: 回帰・分散分析が因果の証明にならない理由？" a="相関・関連の手法。因果には統制実験/DOEなどが必要。" />
        </div>
      </div>
    </section>
  );
}

/** =========================
 * ガイドB：統計手法ナビ（t/Z/F/χ²/ANOVA）
 * ========================= */
function StudyGuide_StatTests() {
  const [goal, setGoal] = useState<"" | "mean" | "variance" | "category">("");
  const [groups, setGroups] = useState<"" | "1" | "2" | "3+">("");
  const [variance, setVariance] = useState<"" | "known" | "unknown">("");

  const active = useMemo(() => {
    if (!goal) return "default";
    if (goal === "mean") {
      if (groups === "1" || groups === "2") {
        if (variance === "known") return "z";
        if (variance === "unknown") return "t";
        return "default";
      }
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
    <section className="mt-2">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-900">統計手法スタディガイド</h2>
        <p className="mt-2 text-gray-700">品質管理やR&Dで頻用する検定を、目的とデータ条件からナビゲート。</p>
      </div>

      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <h3 className="text-xl font-semibold text-brand-900 text-center mb-6">統計手法ナビ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. 何を比較？</label>
            <select
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value as any);
                setGroups("");
                setVariance("");
              }}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="mean">平均値の差</option>
              <option value="variance">分散の差</option>
              <option value="category">カテゴリの関連</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. グループ数</label>
            <select
              value={groups}
              onChange={(e) => setGroups(e.target.value as any)}
              disabled={goal === "category" || !goal}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="1">1つ</option>
              <option value="2">2つ</option>
              <option value="3+">3つ以上</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3. 母分散</label>
            <select
              value={variance}
              onChange={(e) => setVariance(e.target.value as any)}
              disabled={!(goal === "mean" || goal === "variance")}
              className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">選択してください</option>
              <option value="known">既知</option>
              <option value="unknown">未知</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {active === "default" && <p className="text-center text-gray-500">上の質問に答えると、ここに表示されます。</p>}
          {active === "t" && (
            <ResultCard
              color="emerald"
              title="推奨: t検定"
              body="1または2群の平均差の検定（母分散未知時）。対応の有無に注意。"
              cheat={["目的: 平均差", "データ: 連続量", "条件: 正規/等分散", "応用: 工程前後の平均比較"]}
            />
          )}
          {active === "z" && (
            <ResultCard
              color="teal"
              title="推奨: Z検定"
              body="平均差の検定で母分散既知・大標本のとき。実務では稀。"
              cheat={["目的: 平均差（母分散既知）", "データ: 連続量", "条件: 母分散既知/大標本", "応用: 教材向け"]}
            />
          )}
          {active === "f" && (
            <ResultCard
              color="blue"
              title="推奨: F検定"
              body="複数群の分散（ばらつき）の差を検定。分散分析の基礎。"
              cheat={["目的: 分散比較", "データ: 連続量", "条件: 正規性・独立性", "応用: サプライヤ間のばらつき比較"]}
            />
          )}
          {active === "chi" && (
            <ResultCard
              color="purple"
              title="推奨: χ²（独立性の検定）"
              body="カテゴリ×カテゴリの関連性を検定。"
              cheat={["目的: 関連性", "データ: 度数（クロス集計）", "条件: 期待度数に注意", "応用: ライン×不良種の関連性"]}
            />
          )}
          {active === "chi_var" && (
            <ResultCard
              color="fuchsia"
              title="推奨: χ²（1標本の分散）"
              body="1標本の分散が既知の母分散と異なるかを検定。"
              cheat={["目的: 分散が規格と一致か", "データ: 連続量", "条件: 正規性", "応用: 寸法ばらつきの評価"]}
            />
          )}
          {active === "anova" && (
            <ResultCard
              color="orange"
              title="推奨: 分散分析（ANOVA）"
              body="3群以上の平均差を検定。F統計量を用いる。"
              cheat={["目的: 3群以上の平均差", "データ: 連続量", "条件: 正規/等分散/独立", "応用: 製法A/B/Cの平均差"]}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/** =========================
 * レジストリ
 * ========================= */
export type GuideMeta = {
  id: string;
  title: string;
  description: string;
  component: () => JSX.Element;
  tags?: string[];
};

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
