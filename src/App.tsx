// src/App.tsx
import StudyGuide from "./components/StudyGuide";
import NewsFeed from "./components/NewsFeed";
import NoteFeed from "./components/NoteFeed";
import XTimeline from "./components/XTimeline";
import InstagramFeed from "./components/InstagramFeed";

export default function App() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* ヒーロー */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-900">
          QC × IE LABO
        </h1>
        <p className="mt-3 text-gray-700">
          見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。
        </p>
      </header>

      {/* 学習サポート */}
      <section id="learning" className="mt-10">
        <h2 className="text-2xl font-bold text-brand-900 mb-4">学習サポート</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "QC検定",
              body: "統計の基礎～管理図・検定・推定。現場データで演習。",
            },
            {
              title: "統計検定",
              body: "記述・推測統計／多変量。理解と活用を両立。",
            },
            {
              title: "技術士（経営工学）",
              body: "論文構成・キーワード整理・演習添削まで対応。",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-6"
            >
              <h3 className="font-semibold text-brand-900">{c.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 研修 */}
      <section id="training" className="mt-12">
        <h2 className="text-2xl font-bold text-brand-900 mb-4">研修（カスタム前提）</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-6">
            <h3 className="font-semibold text-brand-900">SPC速習（演習付き）</h3>
            <p className="text-sm text-gray-700 mt-2">
              管理図・工程能力・異常検知を短期集中で。社内データ演習可。
            </p>
          </div>
          <div className="rounded-xl2 bg-white border border-brand-200 shadow-soft p-6">
            <h3 className="font-semibold text-brand-900">IE基礎</h3>
            <p className="text-sm text-gray-700 mt-2">
              動作/時間研究・ラインバランス。改善テーマに応じて設計。
            </p>
          </div>
        </div>
      </section>

      {/* 情報：ニュース＋note（横並び2カラム） */}
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
