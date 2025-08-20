// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import NewsFeed from "./components/NewsFeed";
import NoteFeed from "./components/NoteFeed";
import XTimeline from "./components/XTimeline";
import InstagramFeed from "./components/InstagramFeed";

/** =========================
 * 超軽量ハッシュルーター
 * ========================= */
type Page = "home" | "learn" | "guide";
type RouteState = { page: Page; params?: Record<string, string> };

function useHashRouter(): [RouteState] {
  const parse = (): RouteState => {
    const h = window.location.hash || "#/";
    if (h === "#/" || h === "") return { page: "home" };
    if (h === "#/learn") return { page: "learn" };
    const m = h.match(/^#\/guide\/([a-z0-9-]+)$/i);
    if (m) return { page: "guide", params: { id: m[1] } };
    return { page: "home" };
  };

  const [state, setState] = useState<RouteState>(() => parse());
  useEffect(() => {
    const onChange = () => setState(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return [state];
}

/** =========================
 * 学習ガイドのレジストリ
 * ここに追加して“ストック”できます
 * ========================= */
type GuideMeta = {
  id: string;
  title: string;
  description: string;
  component: () => JSX.Element;
  tags?: string[];
};

/* ===== ガイドA：回帰分析・分散分析 ===== */
function StudyGuide_RegressionAnova() {
  const [goal, setGoal] = useState<"" | "predict" | "compare">("");
  const [groups, setGroups] = useState<"" | "2" | "3+">("");
  const active = useMemo(() => {
    if (!goal) return "default";
    if (goal === "predict") return "regression";
    if (goal === "compare") return groups === "2" ? "ttest" : groups === "3+" ? "anova" : "default";
    return "default";
  }, [goal, groups]);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <section className="mt-2">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-900">回帰分析・分散分析スタディガイド</h2>
        <p className="mt-2 text-gray-700">
          目的に応じて適切な手法（回帰／t検定／分散分析）を選べるナビゲーターと、用語・確認質問のセットです。
        </p>
      </div>

      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <h3 className="text-xl font-semibold text-brand-900 text-center mb-6">統計手法ナビゲーター</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. 分析の目的は何ですか？</label>
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
              <option value="predict">変数の関係性を調べて予測したい</option>
              <option value="compare">グループ間の平均値に差があるか調べたい</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. 比較するグループの数は？</label>
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

        <div className="mt-2">
          {active === "default" && (
            <p className="text-center text-gray-500">上の質問に答えると、ここに最適な手法が表示されます。</p>
          )}
          {active === "regression" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-emerald-700 mb-1">推奨手法: 回帰分析</h5>
              <p className="text-gray-700">説明変数が目的変数に与える影響をモデル化（数値×数値）。予測・要因分析に有効。</p>
            </div>
          )}
          {active === "anova" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-sky-700 mb-1">推奨手法: 分散分析（ANOVA）</h5>
              <p className="text-gray-700">3群以上の平均差を検定。要因による変動と誤差を分解して評価します。</p>
            </div>
          )}
          {active === "ttest" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-purple-700 mb-1">推奨手法: t検定</h5>
              <p className="text-gray-700">2群の平均差を検定する基本手法。ANOVAは多群拡張です。</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">重要用語リスト</h4>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { t: "説明変数（Independent Variable）", b: "結果に影響を与えると考えられる原因側の変数。" },
            { t: "目的変数（Dependent Variable）", b: "説明変数によって変動する結果側の変数。" },
            { t: "平方和（Sum of Squares）", b: "ばらつきの大きさ。ANOVAでは全変動・要因間・要因内に分けて評価。" },
            { t: "自由度（Degrees of Freedom）", b: "独立に取りうる情報の数。" },
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
          {[
            {
              id: "q1",
              q: "Q1: 気温とアイスの売上の関係をモデル化し、将来の売上を予測したい手法は？",
              a: "回帰分析。気温を説明変数、売上を目的変数として関係式を構築します。",
            },
            {
              id: "q2",
              q: "Q2: 4つの製造方法で生産した部品の平均耐久性に差があるか？",
              a: "分散分析（ANOVA）。3群以上の平均差の検定に用います。",
            },
            {
              id: "q3",
              q: "Q3: 回帰・分散分析が因果の証明にならない理由は？",
              a: "相関・関連を示す手法。因果には統制実験や介入設計（DOE等）が必要。",
            },
          ].map((x) => (
            <ToggleQA key={x.id} q={x.q} a={x.a} />
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        ※学習用途です。前提（独立性・分布・等分散性など）を確認のうえ、目的に応じた設計（DOE等）を行ってください。
      </p>
    </section>
  );
}

/* ===== ガイドB：統計手法スタディガイド（t/Z/F/χ²/ANOVA ナビ） ===== */
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
        <p className="mt-2 text-gray-700">
          品質管理やR&Dで頻用する検定を、目的とデータ条件からナビゲート（t / Z / F / χ² / ANOVA）。
        </p>
      </div>

      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <h3 className="text-xl font-semibold text-brand-900 text-center mb-6">統計手法ナビゲーター</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. 何を比較したい？</label>
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
              <option value="variance">ばらつき（分散）の差</option>
              <option value="category">カテゴリの関連性</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. グループ数は？</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">3. 母分散は？</label>
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

        {/* 結果表示 */}
        <div className="space-y-3">
          {active === "default" && (
            <p className="text-center text-gray-500">上の質問に答えると、ここに最適な手法が表示されます。</p>
          )}

          {active === "t" && (
            <ResultCard
              color="emerald"
              title="推奨手法: t検定"
              body="1または2群の平均差を検定（母分散が未知のとき標準的）。対応の有無に注意。"
              cheat={["目的: 平均の差の検定", "データ: 連続量", "条件: 正規/中心極限定理, 等分散前提など", "応用: 工程前後の平均比較"]}
            />
          )}

          {active === "z" && (
            <ResultCard
              color="teal"
              title="推奨手法: Z検定"
              body="平均差の検定で母分散が既知、かつ標本サイズが大きいときに用いる。実務では稀。"
              cheat={["目的: 平均の差の検定（母分散既知）", "データ: 連続量", "条件: 母分散既知/大標本", "応用: 理論教材・基礎理解向け"]}
            />
          )}

          {active === "f" && (
            <ResultCard
              color="blue"
              title="推奨手法: F検定"
              body="複数群の分散（ばらつき）の差を検定。分散分析の基礎。"
              cheat={["目的: 分散（ばらつき）の比較", "データ: 連続量", "条件: 正規性、独立性", "応用: サプライヤ間のばらつき比較"]}
            />
          )}

          {active === "chi" && (
            <ResultCard
              color="purple"
              title="推奨手法: χ²（カイ二乗）検定"
              body="カテゴリ×カテゴリの関連性を検定（独立性の検定）。"
              cheat={["目的: カテゴリの関連性", "データ: クロス集計（度数）", "条件: 期待度数の下限に注意", "応用: ライン×不良種の関連性"]}
            />
          )}

          {active === "chi_var" && (
            <ResultCard
              color="fuchsia"
              title="推奨手法: χ²（1標本の分散）"
              body="1標本の分散が既知の母分散と異なるかを検定。"
              cheat={["目的: 分散が規格と一致か", "データ: 連続量", "条件: 正規性", "応用: 寸法ばらつきが仕様内か"]}
            />
          )}

          {active === "anova" && (
            <ResultCard
              color="orange"
              title="推奨手法: 分散分析（ANOVA）"
              body="3群以上の平均差を検定。F統計量を用いる。"
              cheat={["目的: 3群以上の平均差", "データ: 連続量", "条件: 正規/等分散/独立", "応用: 製法A/B/Cの平均差比較"]}
            />
          )}
        </div>
      </div>

      {/* 用語 */}
      <div className="mt-10">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">重要用語リスト</h4>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { t: "正規分布", b: "平均を中心に左右対称の釣鐘型。多くの検定の基礎モデル。" },
            { t: "カテゴリ変数", b: "合否・性別など分類で表すデータ。" },
            { t: "母分散（既知/未知）", b: "母集団の分散が判っているかどうか。既知→Z、未知→tが基本。" },
            { t: "対応のある／ない", b: "同一対象の前後比較（対応あり）か、別群比較（対応なし）か。" },
          ].map((x) => (
            <div key={x.t} className="bg-white rounded-lg border border-brand-200 p-5">
              <h6 className="font-semibold">{x.t}</h6>
              <p className="text-gray-700 mt-1">{x.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* クイズ */}
      <div className="mt-10">
        <h4 className="text-xl font-semibold text-brand-900 text-center mb-6">キー質問で理解度チェック</h4>
        <div className="max-w-3xl mx-auto space-y-6">
          <ToggleQA
            q="Q1: 寸法平均に差があるか？母分散は既知とする。"
            a="Z検定。母分散既知かつ大標本で平均差の検定に用いる（実務上は稀）。"
          />
          <ToggleQA
            q="Q2: 3ラインの寸法ばらつきに差があるか？"
            a="F検定。分散（ばらつき）の比較。平均差ならANOVA（F統計量）を用いる。"
          />
          <ToggleQA
            q="Q3: 性別と満足/不満の関連性は？"
            a="χ²（独立性の検定）。カテゴリ×カテゴリの関連性を調べる。"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        ※前提（正規性・独立性・等分散性・期待度数など）を確認のうえ適用してください。
      </p>
    </section>
  );
}

/* ===== 小物コンポーネント ===== */
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
 * ガイド登録（ここに増やせばストック化）
 * ========================= */
const GUIDES: GuideMeta[] = [
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

/** =========================
 *  ページ群
 * ========================= */
function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* ヒーロー */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-900">QC × IE LABO</h1>
        <p className="mt-3 text-gray-700">見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。</p>
      </header>

      {/* 学習サポート（概要） */}
      <section id="learning" className="mt-10">
        <h2 className="text-2xl font-bold text-brand-900 mb-4">学習サポート</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "QC検定", body: "統計の基礎～管理図・検定・推定。現場データで演習。" },
            { title: "統計検定", body: "記述・推測統計／多変量。理解と活用を両立。" },
            { title: "技術士（経営工学）", body: "論文構成・キーワード整理・演習添削まで対応。" },
          ].map((c) => (
            <div key={c.title} className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-6">
              <h3 className="font-semibold text-brand-900">{c.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <a
            href="#/learn"
            className="inline-flex items-center rounded-xl bg-brand-700 hover:bg-brand-800 text-white px-5 py-3"
          >
            学習コンテンツを開く
          </a>
        </div>
      </section>

      {/* 研修 */}
      <section id="training" className="mt-12">
        <h2 className="text-2xl font-bold text-brand-900 mb-4">研修（カスタム前提）</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-6">
            <h3 className="font-semibold text-brand-900">SPC速習（演習付き）</h3>
            <p className="text-sm text-gray-700 mt-2">管理図・工程能力・異常検知を短期集中で。社内データ演習可。</p>
          </div>
          <div className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-6">
            <h3 className="font-semibold text-brand-900">IE基礎</h3>
            <p className="text-sm text-gray-700 mt-2">動作/時間研究・ラインバランス。改善テーマに応じて設計。</p>
          </div>
        </div>
      </section>

      {/* 情報：ニュース＋note */}
      <section id="info" className="mt-12">
        <div className="grid md:grid-cols-2 gap-6">
          <NewsFeed limit={8} />
          <NoteFeed limit={6} />
        </div>
      </section>

      {/* SNS */}
      <section id="sns" className="mt-12">
        <h2 className="text-2xl font-bold text-brand-900 mb-4">SNS</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-4">
            <h3 className="font-semibold text-brand-900 mb-2">X（Twitter）@n_ieqclab</h3>
            <XTimeline username="n_ieqclab" height={600} theme="light" />
          </div>
          <div className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-4">
            <h3 className="font-semibold text-brand-900 mb-2">Instagram 最新投稿</h3>
            <InstagramFeed />
          </div>
        </div>
      </section>
    </main>
  );
}

function LearningIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-900">学習コンテンツ</h1>
        <p className="text-gray-700 mt-2">テーマ別の学習ガイドを選んでください。</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {GUIDES.map((g) => (
          <a
            key={g.id}
            href={`#/guide/${g.id}`}
            className="block rounded-xl2 bg-white border border-brand-200 shadow-soft p-5 hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-brand-900">{g.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{g.description}</p>
            {g.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {g.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-brand-100/70 border border-brand-200">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </a>
        ))}
      </div>

      <div className="mt-8">
        <a href="#/" className="text-brand-800 hover:underline">
          ← トップへ戻る
        </a>
      </div>
    </main>
  );
}

function GuidePage({ id }: { id: string }) {
  const guide = GUIDES.find((g) => g.id === id);
  if (!guide) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-700">指定されたガイドは見つかりませんでした。</p>
        <a href="#/learn" className="text-brand-800 hover:underline">
          ← 学習コンテンツ一覧へ
        </a>
      </main>
    );
  }
  const Cmp = guide.component;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-900">{guide.title}</h1>
        <a href="#/learn" className="text-brand-800 hover:underline">
          一覧へ戻る
        </a>
      </div>
      <Cmp />
    </main>
  );
}

/** =========================
 * アプリ
 * ========================= */
export default function App() {
  const [route] = useHashRouter();
  if (route.page === "learn") return <LearningIndex />;
  if (route.page === "guide") return <GuidePage id={route.params!.id} />;
  return <Home />;
}
