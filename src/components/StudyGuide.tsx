// src/components/StudyGuide.tsx
import { useMemo, useState } from "react";

export default function StudyGuide() {
  // ナビゲーターの状態
  const [goal, setGoal] = useState<"" | "predict" | "compare">("");
  const [groups, setGroups] = useState<"" | "2" | "3+">("");

  // 結果の決定
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

  // FAQトグル
  const [open, setOpen] = useState<{ [k: string]: boolean }>({});

  return (
    <section className="mt-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-brand-900">回帰分析・分散分析スタディガイド</h3>
        <p className="mt-2 text-gray-700">
          目的に応じて適切な手法（回帰／t検定／分散分析）を選べるナビゲーターと、用語・確認質問のセットです。
        </p>
      </div>

      {/* ナビゲーター */}
      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">統計手法ナビゲーター</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
              1. 分析の目的は何ですか？
            </label>
            <div className="relative">
              <select
                id="goal"
                value={goal}
                onChange={(e) => {
                  const v = e.target.value as typeof goal;
                  setGoal(v);
                  if (v !== "compare") setGroups("");
                }}
                className="w-full p-3 pr-10 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">選択してください</option>
                <option value="predict">変数の関係性を調べて予測したい</option>
                <option value="compare">グループ間の平均値に差があるか調べたい</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="groups" className="block text-sm font-medium text-gray-700 mb-2">
              2. 比較するグループの数は？
            </label>
            <div className="relative">
              <select
                id="groups"
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
        </div>

        {/* 結果パネル */}
        <div className="mt-2">
          {active === "default" && (
            <p className="text-center text-gray-500">上の質問に答えると、ここに最適な手法が表示されます。</p>
          )}

          {active === "regression" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-emerald-700 mb-1">推奨手法: 回帰分析</h5>
              <p className="text-gray-700">
                説明変数が目的変数に与える影響をモデル化し、予測や要因分析に用いる手法です（主に数値×数値）。
              </p>
            </div>
          )}

          {active === "anova" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-sky-700 mb-1">推奨手法: 分散分析（ANOVA）</h5>
              <p className="text-gray-700">
                3つ以上のグループの平均値に統計的な差があるかを検定します。要因による変動と誤差を分解して評価します。
              </p>
            </div>
          )}

          {active === "ttest" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-purple-700 mb-1">推奨手法: t検定</h5>
              <p className="text-gray-700">
                2群の平均の差を検定する基本手法です。ANOVAはその多群拡張と考えられます。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 用語 */}
      <div className="mt-10">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">重要用語リスト</h4>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              t: "説明変数（Independent Variable）",
              b: "結果に影響を与えると考えられている原因側の変数。",
            },
            {
              t: "目的変数（Dependent Variable）",
              b: "説明変数によって変動する結果側の変数。",
            },
            {
              t: "平方和（Sum of Squares）",
              b: "データのばらつきの大きさ。ANOVAでは全変動・要因間・要因内に分けて評価します。",
            },
            {
              t: "自由度（Degrees of Freedom）",
              b: "独立に取りうる情報の数のこと。",
            },
          ].map((x) => (
            <div key={x.t} className="bg-white rounded-lg border border-brand-200 p-5">
              <h6 className="font-semibold">{x.t}</h6>
              <p className="text-gray-700 mt-1">{x.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 確認質問（FAQ風トグル） */}
      <div className="mt-10">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">キー質問で理解度チェック</h4>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              id: "q1",
              q: "Q1: 気温とアイスの売上の関係をモデル化し、将来の売上を予測したい場合の手法は？",
              a: "回帰分析。気温を説明変数、売上を目的変数として関係式を構築します。",
            },
            {
              id: "q2",
              q: "Q2: 4つの製造方法で生産した部品の平均耐久性に差があるかを調べたい場合の手法は？",
              a: "分散分析（ANOVA）。3群以上の平均差の検定に用います。",
            },
            {
              id: "q3",
              q: "Q3: 回帰分析や分散分析が因果関係の証明にならないのはなぜ？",
              a: "相関・関連を示す手法であり、因果の証明には統制実験や介入・設計（DOEなど）が必要だからです。",
            },
          ].map((x) => (
            <div key={x.id} className="bg-white rounded-lg border border-brand-200 p-5">
              <p className="font-medium mb-3">{x.q}</p>
              <button
                className="inline-flex items-center rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-sm px-4 py-2"
                onClick={() => setOpen((s) => ({ ...s, [x.id]: !s[x.id] }))}
                aria-expanded={!!open[x.id]}
              >
                {open[x.id] ? "答えを隠す" : "答えを見る"}
              </button>
              {open[x.id] && (
                <div className="mt-3 p-4 bg-brand-50 rounded border border-brand-200 text-gray-800">
                  {x.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 注意書き */}
      <p className="text-xs text-gray-500 mt-6">
        ※本ガイドは学習用途です。実データの前提（独立性・分布・等分散性など）を満たすかを確認し、目的に応じて適切な検証・設計（DOE等）を行ってください。
      </p>
    </section>
  );
}
