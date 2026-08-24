# Decision Log

この文書は、N-IE LabのProtected Defaultsや広い影響を持つ設計判断を記録する。現在のユーザーによる明示的な指示が最優先であり、決定を変更した場合は旧項目を削除せず `Superseded` とする。

## 記録形式

```md
## YYYY-MM-DD：決定タイトル

- Status: Proposed / Accepted / Superseded
- Context:
- Decision:
- Reason:
- Affected areas:
- Migration:
- Verification:
- Supersedes:
```

## 2026-08-01：表示ブランドをN-IE Labへ拡張

- Status: Accepted
- Context: 品質管理や資格対策に限定せず、ものづくり全体を経営工学でつなぐ位置付けを明確にする必要がある。
- Decision: 表示ブランドを `N-IE Lab` とし、旧名称 `N-IE QC Lab` は必要に応じて沿革・旧名称として扱う。
- Reason: 品質、生産、データ、組織、改善を横断する媒体であることを示すため。
- Affected areas: ブランド表記、将来のAbout、タイトル、OG、構造化データ。
- Migration: 本第0指示では画面を変更しない。表示変更は別タスクで現状調査と回帰確認を行う。
- Verification: 文書間でブランド名と扱いが一致していることを確認する。
- Supersedes: なし。

## 2026-08-01：既存ドメインを維持

- Status: Accepted
- Context: 公開URL、検索評価、外部リンクを保全する必要がある。
- Decision: `n-ie-qclab.com` を維持する。
- Reason: ブランド拡張とドメイン変更を分離し、移行リスクを避けるため。
- Affected areas: DNS、Vercel、canonical、OG、外部リンク。
- Migration: なし。
- Verification: 本番ドメインと主要URLの継続利用を確認する。
- Supersedes: なし。

## 2026-08-01：ものづくり実務者をメインターゲットとする

- Status: Accepted
- Context: 資格コンテンツが充実しても、サイト全体の読者価値を資格対策へ限定しない必要がある。
- Decision: 製造業で3〜10年程度働く若手・中堅実務者をメインターゲットとする。
- Reason: 実務課題と学習をつなぎ、専門メディアとポートフォリオの両方の価値を高めるため。
- Affected areas: コンテンツ企画、ナビゲーション、文章、ケース、ツール。
- Migration: 既存資格コンテンツは維持し、位置付けを副導線として整理する。
- Verification: 入口が資格だけを中心に見せていないことを確認する。
- Supersedes: なし。

## 2026-08-01：資格コンテンツを副導線にする

- Status: Accepted
- Context: 技術士、QC検定、統計検定等は重要だが、ものづくり全体の理解を支える位置付けが必要である。
- Decision: 資格関連を「学びを深める」の副導線に置く。
- Reason: 資格学習と実務を接続しつつ、サイト全体を資格対策中心にしないため。
- Affected areas: トップ、グローバルナビ、カテゴリ入口、関連リンク。
- Migration: 明示的な別タスクなしにトップ構造を変更しない。
- Verification: 4テーマが中心で、資格導線が補助的位置にあることを確認する。
- Supersedes: なし。

## 2026-08-01：4テーマ構成

- Status: Accepted
- Context: 分野間のつながりを読者が理解できる安定した分類が必要である。
- Decision: 「品質をつくる」「生産を整える」「データで確かめる」「改善を仕組みにする」を中心構造とする。
- Reason: 製造業の課題を経営工学で横断的に捉えられるため。
- Affected areas: 情報設計、コンテンツ分類、トップ、関連導線。
- Migration: 本第0指示では画面を変更しない。
- Verification: Information ArchitectureとContent Modelで定義が一致していることを確認する。
- Supersedes: なし。

## 2026-08-01：既存URLを原則維持

- Status: Accepted
- Context: 公開コンテンツ、検索流入、外部リンク、利用者のブックマークを保護する必要がある。
- Decision: 既存URLを原則維持し、変更時は301、canonical、対応表、回帰確認を必須とする。
- Reason: 情報設計改善による不必要な破壊を防ぐため。
- Affected areas: すべての公開ルートとコンテンツ。
- Migration: URL Migration Policyに従う。
- Verification: 変更前後のURL、リダイレクト、内部リンクを確認する。
- Supersedes: なし。

## 2026-08-01：初期ケーススタディ2件

- Status: Accepted
- Context: 運営者の問題構造化能力と成果物を示す具体的な入口が必要である。
- Decision: 「実績ゼロから、品質規格をどう決めるか」「外部試験の結果を、そのまま信じてよいのか」を初期ケースとして維持する。
- Reason: 品質規格設計と外部評価の妥当性確認は、判断過程と成果物を示しやすいため。
- Affected areas: 将来のケース一覧、ケース詳細、ポートフォリオ導線。
- Migration: 本第0指示ではケースページを新設しない。
- Verification: ケース実装時に匿名化、実績表現、推奨URLを確認する。
- Supersedes: なし。

## 2026-08-01：静的生成・MDX中心の技術方針

- Status: Accepted
- Context: 保守性、表示速度、セキュリティ、運用負荷を優先する必要がある。現行実装はNext.js 14 Pages RouterとContentlayer2を使用している。
- Decision: 静的生成とMDXを中心にし、操作が必要な箇所だけClient Componentにする。App RouterとReact Server Componentsを長期的な技術方向とするが、現行Pages Routerからの移行は明示的な別決定なしに行わない。
- Reason: 将来方向を示しながら、既存ルートと機能を安全に保全するため。
- Affected areas: ルーティング、レンダリング、コンテンツ基盤、デプロイ。
- Migration: CMS、データベース、認証はMVPで導入しない。ルーター移行時はURL、Contentlayer、MDX、ISR、APIの移行計画を作る。
- Verification: 現行ビルドと公開URLを維持し、移行タスクでは回帰確認を行う。
- Supersedes: なし。

## 2026-08-01：Pages Routerを維持した段階的リニューアル

- Status: Accepted
- Context: N-IE Labの4テーマ、ケース、ポートフォリオ価値を公開入口へ反映する一方、231件の既存ガイド、ツール、検索評価、公開URLを保全する必要がある。
- Decision: 現行のNext.js Pages RouterとContentlayer2を維持し、共通メタ情報、ヘッダー・フッター、4テーマ、初期ケース、About・サービス、トップページを段階的に追加する。既存ガイドは移動せず、新しいハブから参照する。
- Reason: App Routerへの全面移行を同時に行うと、URL、MDX、API、ISRの回帰範囲が過大になるため。情報設計と技術移行を分離する。
- Affected areas: トップページ、グローバル導線、SEO、テーマ、ケース、学習導線、共通レイアウト、セキュリティヘッダー。
- Migration: 既存URLの変更と301リダイレクトは発生しない。Contentlayerの追加項目は任意とし、既存frontmatterを一括変更しない。
- Verification: typecheck、lint、build、主要URL、360px・768px・1280pxの表示、内部リンク、canonical、構造化データ、公開情報を確認する。
- Supersedes: なし。

## 2026-08-02：依存関係のセキュリティ更新を独立タスクで検証する

- Status: Proposed
- Context: 依存関係監査でNext.js 14.2.5およびContentlayer2の推移的依存関係に既知脆弱性が報告された。一方、今回のリニューアルは231件のMDX、既存URL、数式・演習機能を保全する情報設計変更である。
- Decision: フレームワークと関連依存関係の更新は今回の変更へ混在させず、専用ブランチと回帰計画を持つ独立タスクとして検証する。
- Reason: セキュリティ対応を優先しつつ、互換性の大きい更新と公開構造の変更を分離し、問題発生時の原因と戻し方を明確にするため。
- Affected areas: `next`、Contentlayer2、MDX生成、静的生成、既存ガイド、API Routes、Vercelビルド。
- Migration: 対応済みNext.jsへの更新可否、Contentlayer互換性、上流修正版の有無を確認し、typecheck、lint、build、主要URL、数式、演習、モバイル表示を更新前後で比較する。
- Verification: `npm audit` の再実行、依存ツリーの確認、全静的生成、ブラウザ回帰、既存URLの200応答を確認する。
- Supersedes: なし。

## 2026-08-09：note・N-IE Lab・SNSの編集上の役割を分ける

- Status: Accepted
- Context: 個人の気づき、専門メディアの知識、短い発信を同じ形で公開すると、重複コンテンツと読者目的の混同が生じる。継続運用できる編集工程と、Codex Agentの責任範囲も必要である。
- Decision: noteは考え、経験、問い、背景を文章として残す場、N-IE Labは他者が再利用できるKnowledgeを構造化する場、SNSは発見と入口を作る場とする。同じ本文を複数媒体へ掲載しない。Knowledgeは既存4テーマ内のコンテンツ品質・形式として扱い、新しいトップレベルカテゴリにしない。EditorとKnowledge Curatorは提案とレビューを担当し、公開判断はOrchestratorとユーザーが行う。
- Reason: 媒体ごとの読者価値を明確にし、個人の経験を無理に一般化せず、既存URLと情報設計を保全しながら再利用可能な知識を蓄積するため。
- Affected areas: `docs/editorial/`、`AGENTS.md`、`.codex/agents/`、今後のnoteドラフト、N-IE Lab Knowledge、内部リンク。
- Migration: 既存の公開記事、URL、4テーマ、グローバルナビは変更しない。今後の編集タスクから段階的に適用する。
- Verification: 公開候補ごとに事実と見解、重複、配置、出典、draft除外、Protected Defaultsを確認する。Agentの出力はPR前に人がレビューする。
- Supersedes: なし。

## 2026-08-10：技術士答案4型の説明を一つの正本で管理する

- Status: Accepted
- Context: 必須Ⅰ、Ⅱ-1、Ⅱ-2、Ⅲの説明がガイド、モバイル要約、ワークシート、過去問ナビへ重複しており、Ⅱ-1の長所・短所やⅡ-2の手順数などを問題条件より固定的に見せる箇所があった。
- Decision: 4答案型の問題文の見方、考える順序、答案構造、書きすぎない内容、短い例、関連Knowledgeを答案型ルールへ集約し、答案構成ガイド、過去問ナビ、ワークシート要約が同じ正本を参照する。ワークシート、記入例、答案例はそれぞれ下書き補助、適用例、完成答案教材として役割を分ける。
- Reason: 画面幅やページごとの二重管理を減らし、問題文の設問要求に合わせて受験者自身が論理を組み立てる学習を支えるため。
- Affected areas: 技術士答案構成ガイド、答案型別ワークシート、過去問ナビ、答案型ルール、技術士教材運用文書。
- Migration: 既存URLと見出しアンカー、過去問126件、記入例・答案例本文を維持する。Ⅱ-1は設問で問われた場合だけ長所・短所等を書き、Ⅱ-2は問題に合う必要数の手順を書く案内へ段階的に統一する。
- Verification: 4型の必須項目、短い例の文字数、関連リンク、デスクトップ・モバイル表示、過去問ナビからの遷移、typecheck、lint、buildを確認する。
- Supersedes: なし。

## 2026-08-16：Editorial Learning Designを教育・Knowledge長文の設計言語とする

- Status: Accepted
- Context: 技術士の実答案レビューを比較検証した結果、カードや操作部品を重ねる構成より、タイポグラフィ、余白、罫線、図、captionで読解順序を作る編集紙面型の構成が、長文教材の理解とN-IE Labの専門性を伝えやすかった。
- Decision: Prototype C（Editorial Lab A+）から抽出した紙面編集原則を、教育・Knowledge系長文へ適用できる `Editorial Learning Design` として採用する。学習内容を主役にし、日本語を主ラベルとし、図を理解の圧縮に使い、モバイルでは自然な縦の読解順序へ変換する。共通コンポーネントは読解構造を支える最小限に留め、文量、レビュー表現、図解を機械的に揃えない。
- Reason: 同じサイトとしての一貫性を保ちながら、問題やKnowledgeごとの思考構造を紙面へ反映し、UIテンプレートを埋めたような均質さを避けるため。
- Affected areas: 技術士実答案レビュー、今後選定する教育・Knowledge長文、将来のケース紙面の一部。トップページ、グローバルナビ、通常の一覧・ツールには教材テンプレートを適用しない。
- Migration: まず2026年度Ⅱ-1-4答案レビューへ適用し、UX確認後に残り3答案レビューへ段階展開する。既存URL、SEOメタデータ、本文資料、Knowledge、答案型の正本を維持する。
- Verification: Desktopと390px Mobileの読解順序、復元答案と参考解答の識別、図の意味、CTA数、horizontal overflow、typecheck、lint、build、route、canonical、sitemapを確認する。
- Supersedes: なし。既存のDesign PrinciplesとProtected Defaultsを補完する。

## 2026-08-23：ガイドソースと検証入口をOS間で統一する

- Status: Accepted
- Context: Git indexはLFでも、`core.autocrlf=true`のWindows checkoutで一部MDXがCRLFとなり、ContentlayerのYAML解析前段で文書がskipされてもbuildが成功する状態があった。検査用のMDX guardも暗黙にファイルを書き換えていた。
- Decision: `content/guides/**`をGit checkout時にLFへ固定し、UTF-8 BOMなし・LF・末尾改行を読み取り専用で検査する。frontmatterはContentlayerと同じ`gray-matter`と`yaml.parse`の境界で検証し、Contentlayerの不完全文書をfailさせる。`npm run check:ci`を本番検証の正本とし、WindowsではContentlayer件数と公開件数を同じ基準で確認する。自動修正は明示コマンドだけに分離する。
- Reason: 一時LF化、バックアップ、復元に依存せず、WindowsとLinuxで同じ239文書・266ページを再現し、検査やbuildが追跡ファイルを変更しない状態を保つため。
- Affected areas: `.gitattributes`、`.editorconfig`、frontmatter・MDX検査、npm scripts、Contentlayerの失敗方針、GitHub Actions、ビルド監査文書。
- Migration: ガイド本文、frontmatter値、URL、sitemap、依存関係は変更しない。Git indexに既存のLF本文を維持し、checkout規則だけを明示する。既存のunused code・依存・循環参照検査はadvisory運用を維持する。
- Verification: Windowsの`check:ci`と連続2回build、UbuntuとWindowsのGitHub Actions、239文書、238公開ガイド、266ページ、130問、draft除外、4レビューpage-data、build前後SHA-256とGit差分を確認する。
- Supersedes: 一時的なLF変換と元バイト復元を必要とする手順。frontmatter値のfail-safe正規化方針は維持する。
