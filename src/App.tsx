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

function useHashRouter(): [RouteState, (to: string) => void] {
  const parse = (): RouteState => {
    const h = window.location.hash || "#/";
    if (h === "#/" || h === "") return { page: "home" };
    if (h === "#/learn") return { page: "learn" };
    const m = h.match(/^#\/guide\/([a-z0-9-]+)$/i);
    if (m) return { page: "guide", params: { id: m[1] } };
    return { page: "home" }; // フォールバック
  };

  const [state, setState] = useState<RouteState>(() => parse());
  useEffect(() => {
    const onChange = () => setState(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const navigate = (to: string) => {
    if (!to.startsWith("#")) window.location.hash = "#/";
    window.location.hash = to;
  };
  return [state, navigate];
}

/** =========================
 * 学習ガイドのレジストリ
 * ここに追加していけば“ストック”できます
 * ========================= */
type GuideMeta = {
  id: string;
  title: string;
  description: string;
  component: () => JSX.Element;
  tags?: string[];
};

// ガイド1：回帰分析／分散分析（インタラクティブ）
function StudyGuide_RegressionAnova() {
  const [goal, setGoal] = useState<"" | "predict" | "compare">("");
  const [groups, setGroups] = useState<"" | "2" | "3+">("");
  const active = useMemo(() => {
    if (!goal) return "default";
    if (goal === "predict") return "regression";
    if (goal === "compare") return groups === "2" ? "ttest" : groups === "3+" ? "anova" : "default";
    return "default";
  }, [goal, groups]);
  const [open, setOpen] = useState<{ [k: string]: boolean }>({});

  return (
    <section className="mt-2">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-900">回帰分析・分散分析スタディガイド</h2>
        <p className="mt-2 text-gray-700">
          目的に応じて適切な手法（回帰／t検定／分散分析）を選べるナビゲーターと、用語・確認質問のセットです。
        </p>
      </div>

      {/* ナビゲーター */}
      <div className="bg-white rounded-xl2 border border-brand-200 shadow-soft p-6">
        <h3 className="text-xl font-semibold text-brand-900 text-center mb-6">統計手法ナビゲーター</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
              1. 分析の目的は何ですか？
            </label>
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
          <div>
            <label htmlFor="groups" className="block text-sm font-medium text-gray-700 mb-2">
              2. 比較するグループの数は？
            </label>
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

        {/* 結果 */}
        <div className="mt-2">
          {active === "default" && (
            <p className="text-center text-gray-500">上の質問に答えると、ここに最適な手法が表示されます。</p>
          )}
          {active === "regression" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-emerald-700 mb-1">推奨手法: 回帰分析</h5>
              <p className="text-gray-700">説明変数が目的変数に与える影響をモデル化（主に数値×数値）。予測・要因分析に有効。</p>
            </div>
          )}
          {active === "anova" && (
            <div className="rounded-lg border border-brand-200 bg-brand-100/60 p-4">
              <h5 className="text-lg font-semibold text-sky-700 mb-1">推奨手法: 分散分析（ANOVA）</h5>
              <p className="text-gray-700">3群以上の平均差を検定。要因による変動と誤差に分解して評価します。</p>
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

      {/* 用語 */}
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

      {/* 確認質問 */}
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
                <div className="mt-3 p-4 bg-brand-50 rounded border border-brand-200 text-gray-800">{x.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        ※学習用途です。独立性・分布・等分散性など前提を確認のうえ、目的に応じた検証・設計（DOE等）を行ってください。
      </p>
    </section>
  );
}

const GUIDES: GuideMeta[] = [
  {
    id: "regression-anova",
    title: "回帰分析・分散分析スタディガイド",
    description: "目的に応じて手法を選べるナビ＋用語・理解度チェック付き",
    tags: ["統計", "QC"],
    component: StudyGuide_RegressionAnova,
  },
  // 追加例：
  // {
  //   id: "spc-intro",
  //   title: "SPC入門（管理図の読み方）",
  //   description: "管理図の目的と運用の要点、よくある落とし穴",
  //   tags: ["SPC", "品質管理"],
  //   component: StudyGuide_SPCIntro,
  // },
];

/** =========================
 *  ページ群
 * ========================= */

// トップページ
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

// 学習サポート：下層（ガイド選択）
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
        <a href="#/" className="text-brand-800 hover:underline">← トップへ戻る</a>
      </div>
    </main>
  );
}

// 個別ガイドページ
function GuidePage({ id }: { id: string }) {
  const guide = GUIDES.find((g) => g.id === id);
  if (!guide) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-700">指定されたガイドは見つかりませんでした。</p>
        <a href="#/learn" className="text-brand-800 hover:underline">← 学習コンテンツ一覧へ</a>
      </main>
    );
  }
  const Cmp = guide.component;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-900">{guide.title}</h1>
        <a href="#/learn" className="text-brand-800 hover:underline">一覧へ戻る</a>
      </div>
      <Cmp />
    </main>
  );
}

/** =========================
 * アプリ（ルーティング分岐）
 * ========================= */
export default function App() {
  const [route] = useHashRouter();

  if (route.page === "learn") return <LearningIndex />;
  if (route.page === "guide") return <GuidePage id={route.params!.id} />;

  // home
  return <Home />;
}
