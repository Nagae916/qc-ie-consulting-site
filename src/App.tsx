import InstagramFeed from "./components/InstagramFeed";
import XTimeline from "./components/XTimeline";

export default function App() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* ヒーロー */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          QC × IE LABO
        </h1>
        <p className="mt-3 text-gray-600">
          SPC / DOE / IE を現場に実装し、再現性ある成果を。ISO / IATF に準拠したQMS運用まで支援します。
        </p>
      </header>

      {/* 業務紹介：価値提案 */}
      <section id="value" className="mt-12">
        <h2 className="text-2xl font-bold mb-4">業務紹介（価値提案）</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold mb-2">貴社への提供価値</h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              <li>工程異常の早期検知（SPC）と再発防止の仕組み化</li>
              <li>ムダの可視化と標準時間設計（IE）でリードタイム短縮</li>
              <li>DOE/回帰で要因を特定、最適条件を決定</li>
              <li>ISO/IATF対応のQMS設計・文書整備・内部監査支援</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold mb-2">想定効果の例</h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              <li>不良率：<span className="font-semibold">30〜70%低減</span></li>
              <li>リードタイム：<span className="font-semibold">20〜50%短縮</span></li>
              <li>設備稼働率：<span className="font-semibold">10〜25%改善</span></li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              ※上記は過去事例の代表値であり、結果を保証するものではありません。実データ・体制・制約条件に依存します。
            </p>
          </div>
        </div>
      </section>

      {/* 学習サポート */}
      <section id="learning" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">学習サポート</h2>
        <div className="rounded-2xl border p-6 bg-white">
          <p className="text-gray-700 mb-3">
            経営工学系の資格学習を、実務とつながる形でサポートします。
          </p>
          <ul className="grid md:grid-cols-3 gap-3">
            <li className="rounded-lg border p-4">
              <h3 className="font-semibold">QC検定</h3>
              <p className="text-sm text-gray-600 mt-1">
                統計の基礎〜管理図・検定・推定。現場データでの演習付き。
              </p>
            </li>
            <li className="rounded-lg border p-4">
              <h3 className="font-semibold">統計検定</h3>
              <p className="text-sm text-gray-600 mt-1">
                記述・推測統計／多変量解析の要点整理と演習。
              </p>
            </li>
            <li className="rounded-lg border p-4">
              <h3 className="font-semibold">技術士（経営工学）</h3>
              <p className="text-sm text-gray-600 mt-1">
                論文構成・キーワード整理・演習添削まで対応。
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* サービス */}
      <section id="services" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">サービス</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold mb-2">① QMS設計（ISO/IATF対応）</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>プロセスアプローチに基づく要求事項の棚卸し</li>
              <li>文書体系・記録様式設計、内部監査立上げ</li>
              <li>IATF16949のコアツール（APQP/PPAP/FMEA/SPC/MSA）適用</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold mb-2">② 工程改善・IE</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>現場観察・工程分析、動作/時間研究</li>
              <li>標準時間・ラインバランス・在庫/搬送最適化</li>
              <li>作業設計・標準作業書・教育の仕組み化</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold mb-2">③ データ解析 / DOE</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>要因探索・回帰/分散分析、多変量解析</li>
              <li>直交表・反応曲面法での最適条件設計</li>
              <li>サンプルサイズ設計・管理図の運用定着</li>
            </ul>
          </div>
        </div>
      </section>

      {/* アプローチ */}
      <section id="approach" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">アプローチ</h2>
        <div className="rounded-2xl border p-6 bg-white">
          <h3 className="font-semibold mb-2">成果が出るまでのプロセス</h3>
          <ol className="list-decimal ml-5 space-y-1 text-gray-700">
            <li>現状把握（データ・工程・QMSギャップの可視化）</li>
            <li>課題とKGI/KPI設定（不良・LT・稼働・損失の指標化）</li>
            <li>短期の火消し・中期の要因解析・長期の仕組み化を並走</li>
            <li>SPC/IE/QMSを組み合わせ、再現性のある改善サイクルへ</li>
            <li>教育・標準化・監査で定着支援</li>
          </ol>
        </div>
      </section>

      {/* 事例ダイジェスト */}
      <section id="cases" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">事例ダイジェスト</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold">自動車部品</h3>
            <p className="text-sm text-gray-700 mt-1">
              SPC+DOEで要因特定、工程条件最適化。不良率▲45%・段取り時間▲30%。
            </p>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold">精密加工</h3>
            <p className="text-sm text-gray-700 mt-1">
              IEでレイアウト/搬送改善、WIP▲40%。管理図で乱れの早期検知。
            </p>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold">食品・医療</h3>
            <p className="text-sm text-gray-700 mt-1">
              QMS再設計・内部監査・教育で逸脱▲60%。審査で指摘ゼロを継続。
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          ※守秘義務に配慮し、具体名や特定可能な条件は伏せています。
        </p>
      </section>

      {/* 研修 */}
      <section id="training" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">研修（カスタム前提）</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold">SPC速習（演習付き）</h3>
            <p className="text-sm text-gray-700">
              管理図・工程能力・異常検知を短期集中で。社内データで実践演習可。
            </p>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <h3 className="font-semibold">IE基礎</h3>
            <p className="text-sm text-gray-700">
              動作研究・時間研究・ラインバランス。改善テーマに合わせて調整。
            </p>
          </div>
        </div>
      </section>

      {/* 参考アクセス */}
      <section id="refs" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">参考アクセス（公式）</h2>
        <ul className="list-disc ml-5 space-y-1 text-blue-700">
          <li>
            <a href="https://www.iso.org/standard/62085.html" target="_blank" rel="noopener noreferrer">
              ISO 9001
            </a>
          </li>
          <li>
            <a href="https://www.iatfglobaloversight.org/" target="_blank" rel="noopener noreferrer">
              IATF 16949
            </a>
          </li>
          <li>
            <a href="https://www.itl.nist.gov/div898/handbook/" target="_blank" rel="noopener noreferrer">
              NIST/SEMATECH e-Handbook of Statistical Methods
            </a>
          </li>
        </ul>
      </section>

      {/* SNS：X & Instagram */}
      <section id="sns" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">SNS</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">X（Twitter）@n_ieqclab</h3>
            <XTimeline username="n_ieqclab" height={600} theme="light" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Instagram 最新投稿</h3>
            <InstagramFeed />
          </div>
        </div>
      </section>

      {/* FAQ / お問い合わせ */}
      <section id="contact" className="mt-14">
        <h2 className="text-2xl font-bold mb-4">FAQ／お問い合わせ</h2>
        <div className="rounded-2xl border p-6 bg-white">
          <details className="mb-3">
            <summary className="font-semibold cursor-pointer">初回相談は可能ですか？</summary>
            <p className="text-gray-700 mt-2">はい、オンライン30分の無料ヒアリングが可能です。</p>
          </details>
          <details className="mb-3">
            <summary className="font-semibold cursor-pointer">秘密保持はどうなりますか？</summary>
            <p className="text-gray-700 mt-2">NDA（秘密保持契約）を締結のうえで対応いたします。</p>
          </details>
          <a
            href="mailto:contact@example.com?subject=QC×IE LABO%20お問い合わせ&body=御社名・ご相談概要をご記入ください。"
            className="inline-flex items-center px-5 py-3 rounded-xl bg-black text-white hover:opacity-90"
          >
            メールで問い合わせる（デモ）
          </a>
          <p className="text-xs text-gray-500 mt-2">
            ※デモのためメールアドレスはダミーです。実運用時は貴社のアドレスへ変更してください。
          </p>
        </div>
      </section>
    </main>
  );
}
