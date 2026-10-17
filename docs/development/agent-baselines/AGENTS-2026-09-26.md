# AGENTS.md

## 目的と優先順位

N-IE Labは、製造業の若手・中堅実務者へ品質、生産、データ、改善を経営工学の視点から伝える教育サイト兼ポートフォリオ。既存URL・コンテンツ・公開機能を保ちながら、正確性、可読性、アクセシビリティ、速度、保守性を改善する。

現在のユーザーの明示的な指示を最優先し、承認済みの[Decision Log](docs/project/DECISION_LOG.md)、このファイル、関連するプロジェクト文書、既存実装の順に参照する。方針変更を依頼されたら、旧方針だけを理由に止めず、影響を調べて関連文書を更新する。

## 守る既定値

- ブランドは `N-IE Lab`、ドメインは `n-ie-qclab.com`、メッセージは「ものづくりは、仕組みが見えるともっと面白い。」。対象は製造業で3〜10年程度働く実務者。
- 中心領域は「品質をつくる」「生産を整える」「データで確かめる」「改善を仕組みにする」。資格関連は「学びを深める」の副導線。形式は「読み解く」「図で見る」「試してみる」「現場で使う」「ケースから学ぶ」「学びを深める」。初期ケースは品質規格の決め方と外部試験結果の評価。
- 公開URL・記事・機能を維持する。URL変更には301、canonical、対応表と回帰確認が必要。既存記事の削除・全面リライトや関係ない大規模変更を依頼の範囲へ混ぜない。
- 現行はNext.js Pages RouterとContentlayer2/MDX。App Routerへの移行は別の決定と計画が必要。静的生成を中心とし、操作が必要な箇所だけクライアント側で実装する。
- 依存関係、CMS、DB、認証、外部APIの追加は必要性とユーザーの明示的な承認を確認する。APIキーはサーバー側で保管する。デザインは余白、明確な階層、モバイルでの読解を重視する。

詳細な変更判断は[Change Policy](docs/project/CHANGE_POLICY.md)を参照する。

## タスクに応じて読む

まず関連する実装を確認し、必要な資料だけを読む。単純な修正で全資料を読み直す必要はない。

| 対象 | 参照先 |
| --- | --- |
| 方針・対象読者・保護された既定値 | [Decision Log](docs/project/DECISION_LOG.md)、[Change Policy](docs/project/CHANGE_POLICY.md)、必要なら[Project Charter](docs/project/PROJECT_CHARTER.md)と[Product Principles](docs/project/PRODUCT_PRINCIPLES.md) |
| ページ構造・URL・モデル・デザイン | [Information Architecture](docs/project/INFORMATION_ARCHITECTURE.md)、[URL Migration Policy](docs/project/URL_MIGRATION_POLICY.md)、[Content Model](docs/project/CONTENT_MODEL.md)、[Design Principles](docs/project/DESIGN_PRINCIPLES.md)から該当するもの |
| 編集・Knowledge | [Editorial Charter](docs/editorial/EDITORIAL_CHARTER.md)、[Site and Note Content Policy](docs/editorial/SITE_NOTE_CONTENT_POLICY.md)。Knowledge作成時は[Knowledge Definition](docs/editorial/KNOWLEDGE_DEFINITION.md)、編集Agent連携時は[Agent Workflow](docs/editorial/AGENT_WORKFLOW.md) |
| TypeSafe・Jev | [Jev Development Tooling](docs/development/JEV_DEVELOPMENT_TOOLING.md)とrepo-localの`typesafe-ai` skill。API仕様は該当する公式ページだけ |

## 実装と検証

- 変更範囲を定め、既存パターンを使う。ガイドは `content/guides/{qc,stat,engineer}/`。MDX本文にimport文・JSXコメントを書かず、操作部品は既存レジストリへ登録する。数式はKaTeX。二重インデックスの行列アクセスには `src/lib/safe-matrix.ts` を使う。
- 変更した箇所から検証し、失敗の原因を直して該当検証を再実行する。共通基盤、生成、ルーティング、コンテンツ全体へ影響するとき、またはPR・統合前には `npm run check:ci` を使う。Windowsでは `npm.cmd run ...` を使う。
- ローカル検査は使い捨てのデータで実行し、本番へのアクセスは不要。安全なローカル検証・修正・再検証は逐次承認なしで進める。外部公開、Production操作、データ削除、課金を伴う設定や新規credential作成は明示的な権限を確認する。
- TypeSafe/Jevの変更では `npm run jev:doctor` と関連テストを実行する。skillは設計指針でありruntimeではない。APIキーの値は表示せず、Jevの確率だけで権限や外部操作を決めない。

実装依頼は動作と影響範囲の確認、起因する失敗の修正までを完了とする。調査依頼は出典と不確実性を示す。完了時は変更、検証、保護された既定値への影響、残課題を簡潔に報告する。
