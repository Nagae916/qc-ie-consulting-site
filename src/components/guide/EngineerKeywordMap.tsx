'use client';

import { useState } from 'react';

type KeywordTheme = {
  id: string;
  title: string;
  summary: string;
  keywords: string[];
  issues: string[];
  solutions: string[];
  risks: string[];
  competencies: string[];
  answerMemo: string;
};

const keywordThemes: KeywordTheme[] = [
  {
    id: 'qms',
    title: 'QMS再構築・品質保証',
    summary: '品質不正防止、工程変動、顧客要求の高度化に対して、QMSを実効性のある仕組みに戻すテーマです。',
    keywords: ['QMS', 'プロセスアプローチ', 'CAPA', '内部監査', '品質不正防止', '変更管理'],
    issues: ['規程と現場運用が乖離する', '不適合の再発防止が弱い', '監査が形式化する'],
    solutions: ['プロセスKPIを見直す', 'CAPAを標準化する', '内部監査をリスクベースに変える'],
    risks: ['文書管理の負荷が増える', '現場が監査対応に偏る', '短期的に改善効果が見えにくい'],
    competencies: ['専門的学識', '問題解決', '評価', '技術者倫理'],
    answerMemo: 'QMSは単なる認証維持ではなく、工程データ、監査結果、不適合情報を改善サイクルへ接続する仕組みとして書くと、専門性と倫理を示しやすい。',
  },
  {
    id: 'productivity',
    title: '生産性向上',
    summary: '人手不足と需要変動の中で、IEや標準作業を使い、品質を落とさずに生産性を高めるテーマです。',
    keywords: ['IE', 'ECRS', '標準作業', 'ラインバランシング', 'ボトルネック', 'OEE'],
    issues: ['作業時間のばらつきが大きい', 'ボトルネック工程が見えない', '属人作業が残る'],
    solutions: ['作業測定で現状を定量化する', 'ECRSでムダを削減する', '標準作業と教育を整備する'],
    risks: ['改善が作業者負担増になる', '標準化で例外対応力が下がる', '短期効率だけを追いやすい'],
    competencies: ['専門的学識', 'マネジメント', 'リーダーシップ', 'コミュニケーション'],
    answerMemo: '生産性向上は、効率化だけでなく品質、安全、人材定着とのバランスを示すと、経営工学らしい多面的答案になる。',
  },
  {
    id: 'dx-data',
    title: 'DX・データ活用',
    summary: 'IoTやMES、BI、AIを使い、経験依存の管理からデータに基づく意思決定へ移行するテーマです。',
    keywords: ['IoT', 'MES', 'BI', 'データ基盤', 'AI', '予知保全', 'データドリブン経営'],
    issues: ['データが部門ごとに分断される', 'データ品質が低い', '現場が活用目的を理解しにくい'],
    solutions: ['データ定義を標準化する', 'KPIとダッシュボードを整備する', '小さなPoCから業務実装へ進める'],
    risks: ['システム依存が強くなる', '入力負荷が増える', 'AIの判断根拠が説明しにくい'],
    competencies: ['問題解決', '評価', 'コミュニケーション', '継続研さん'],
    answerMemo: 'DXはツール導入で終わらせず、業務課題、データ品質、人材育成、効果検証まで書くと説得力が出る。',
  },
  {
    id: 'logistics-2024',
    title: '生産物流・物流2024年問題',
    summary: '輸送制約や人手不足に対して、配送、倉庫、荷役、生産計画を一体で改善するテーマです。',
    keywords: ['共同配送', 'モーダルシフト', 'VRP', '積載率', '倉庫統合', '標準化'],
    issues: ['輸送能力が不足する', '積載率が低い', '倉庫作業が属人化する'],
    solutions: ['共同配送を検討する', '配送ルートを最適化する', '荷姿と作業を標準化する'],
    risks: ['取引先調整に時間がかかる', '在庫増加を招く', 'サービス水準が低下する'],
    competencies: ['マネジメント', '問題解決', '評価', 'リーダーシップ'],
    answerMemo: '物流は現場改善だけでなく、SCM全体の制約条件として捉え、QCDとCO2削減を同時に評価する書き方が有効です。',
  },
  {
    id: 'supply-chain',
    title: 'サプライチェーン強靭化',
    summary: '災害、地政学リスク、供給途絶に備え、調達・在庫・生産・物流の復旧力を高めるテーマです。',
    keywords: ['BCP', '複数購買', '在庫戦略', 'リードタイム短縮', 'リスク分散', '代替品認定'],
    issues: ['特定サプライヤに依存する', '重要部品の在庫方針が曖昧', '復旧手順が整っていない'],
    solutions: ['リスクマップを作る', '重要部品を層別管理する', '代替調達先を事前評価する'],
    risks: ['在庫コストが増える', '品質確認の負荷が増える', '過剰な冗長化になる'],
    competencies: ['マネジメント', '評価', 'リーダーシップ', '技術者倫理'],
    answerMemo: '強靭化はコスト増を伴うため、重要度、影響度、復旧時間を基準に優先順位を決めると答案が締まる。',
  },
  {
    id: 'skill-transfer',
    title: '人材育成・技能伝承',
    summary: '熟練者依存を減らし、現場改善と品質維持を継続できる組織能力を育てるテーマです。',
    keywords: ['OJT', 'Off-JT', '多能工化', '技能マップ', 'ナレッジマネジメント', '標準作業'],
    issues: ['暗黙知が共有されない', '教育が個人任せになる', '多能工化が進まない'],
    solutions: ['技能マップで不足を可視化する', '標準作業書と動画教材を整備する', 'OJTと評価を連動させる'],
    risks: ['教育時間が確保できない', '形式的な教育になる', '熟練者の負担が増える'],
    competencies: ['コミュニケーション', 'リーダーシップ', '継続研さん', 'マネジメント'],
    answerMemo: '人材育成は人的資本、品質安定、技術継承を結び、教育の効果確認まで書くと実務性が出る。',
  },
  {
    id: 'carbon-neutral',
    title: 'カーボンニュートラル・省エネ',
    summary: '環境制約とコスト上昇に対応し、エネルギー使用量とCO2排出量を管理するテーマです。',
    keywords: ['LCA', 'CO2排出量', 'エネルギー原単位', '省エネ設備', 'グリーン調達', 'Scope3'],
    issues: ['排出量の算定範囲が曖昧', '省エネ効果が見えにくい', '調達先の協力が必要になる'],
    solutions: ['エネルギー原単位をKPI化する', 'LCAで影響を評価する', '設備更新と運用改善を組み合わせる'],
    risks: ['投資回収に時間がかかる', '品質や生産能力に影響する', 'データ収集負荷が高い'],
    competencies: ['評価', 'マネジメント', '技術者倫理', '継続研さん'],
    answerMemo: '省エネは環境だけでなく、コスト、設備保全、顧客要求、サプライチェーン評価へ接続して書くと広がりが出る。',
  },
  {
    id: 'risk-management',
    title: 'リスクマネジメント',
    summary: '品質、安全、納期、変更管理のリスクを事前に洗い出し、優先順位をつけて対策するテーマです。',
    keywords: ['FMEA', 'FTA', 'リスクアセスメント', 'BCP', '変更管理', '未然防止'],
    issues: ['重大リスクの見落としがある', '変更時の影響確認が弱い', '再発防止が属人的になる'],
    solutions: ['FMEAで優先順位を決める', '変更管理プロセスを標準化する', 'レビューと監視指標を設ける'],
    risks: ['リスク評価が形式化する', '対策が過剰になる', '現場が記録作業に追われる'],
    competencies: ['問題解決', '評価', 'マネジメント', '技術者倫理'],
    answerMemo: 'リスクは施策後に生じる副作用として書くと、必須Ⅰの設問に対応しやすい。検出、予防、是正の流れを示すのが有効です。',
  },
  {
    id: 'standardization',
    title: '標準化・業務プロセス改善',
    summary: 'ばらつきや手戻りを減らし、組織として再現性のある業務を作るテーマです。',
    keywords: ['SOP', '標準化', '見える化', '業務フロー', 'BPR', 'プロセスマイニング'],
    issues: ['手順が人によって違う', '業務のムダが見えない', '改善後の定着が弱い'],
    solutions: ['業務フローを可視化する', 'SOPを更新する', 'KPIで定着状況を確認する'],
    risks: ['標準が現場実態に合わない', '例外処理が増える', '改善活動が一過性になる'],
    competencies: ['専門的学識', '問題解決', 'コミュニケーション', '継続研さん'],
    answerMemo: '標準化は管理を硬直化させるものではなく、改善の土台として位置づけると、現場感のある答案になる。',
  },
  {
    id: 'compliance',
    title: 'コンプライアンス・倫理',
    summary: '品質不正、データ改ざん、説明責任など、公益確保と信頼維持に直結するテーマです。',
    keywords: ['品質不正', 'データ改ざん', '説明責任', '公益確保', '持続可能性', '内部通報'],
    issues: ['短納期やコスト圧力で不正が起きる', 'データの真正性が担保されない', '牽制機能が弱い'],
    solutions: ['監査証跡を残す', '権限分離とレビューを行う', '倫理教育と相談窓口を整備する'],
    risks: ['現場が萎縮する', 'ルールが形骸化する', '報告遅れが起きる'],
    competencies: ['技術者倫理', 'コミュニケーション', 'リーダーシップ', '評価'],
    answerMemo: '倫理は最後に付け足すのではなく、品質、安全、公益、説明責任をテーマ固有のリスクと結びつけて書く。',
  },
];

const initialThemeId = keywordThemes[0]?.id ?? '';

export default function EngineerKeywordMap() {
  const [selectedId, setSelectedId] = useState(initialThemeId);
  const selectedTheme = keywordThemes.find((theme) => theme.id === selectedId) ?? keywordThemes[0];

  if (!selectedTheme) {
    return null;
  }

  return (
    <section className="not-prose my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">答案作成の論点整理</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">テーマを選択</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">
            頻出テーマを選ぶと、答案で使うキーワード、課題、解決策、リスク、示しやすいコンピテンシーをまとめて確認できます。
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {keywordThemes.map((theme) => {
          const isSelected = theme.id === selectedTheme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedId(theme.id)}
              className={`rounded-xl border p-3 text-left text-sm transition ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-white'
              }`}
            >
              <span className="font-bold">{theme.title}</span>
              <span className="mt-2 block text-xs leading-5 text-slate-600">{theme.summary}</span>
            </button>
          );
        })}
      </div>

      <article className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-800">選択中のテーマ</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-950">{selectedTheme.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">{selectedTheme.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {selectedTheme.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-900">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <KeywordList title="主な課題" items={selectedTheme.issues} />
          <KeywordList title="代表的な解決策" items={selectedTheme.solutions} />
          <KeywordList title="想定リスク" items={selectedTheme.risks} />
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-bold text-slate-950">答案で示しやすいコンピテンシー</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTheme.competencies.map((competency) => (
              <span key={competency} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                {competency}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <h4 className="text-sm font-bold text-sky-950">600字答案での使い方メモ</h4>
          <p className="mt-2 text-sm leading-7 text-slate-700">{selectedTheme.answerMemo}</p>
        </div>
      </article>
    </section>
  );
}

function KeywordList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-bold text-slate-950">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
