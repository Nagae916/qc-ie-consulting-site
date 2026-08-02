# AGENTS.md

## Project Goal

N-IE Labは、製造業で働く若手・中堅実務者に対して、品質、生産、データ、組織のつながりを経営工学の視点から分かりやすく示し、ものづくりの仕組みと面白さを伝える。

同時に、運営者が実務課題を構造化し、品質規格、管理方法、評価設計、研修、図解、ツール等の具体的成果物へ落とし込めることを示す、信頼性の高いキャリアポートフォリオとして運用する。

既存サイト、公開済みコンテンツ、検索評価、URLを可能な限り保全しながら、保守性、表示速度、アクセシビリティ、セキュリティを重視して段階的に改善する。

すべての実装、修正、リファクタリング、コンテンツ追加は、このGoalへの寄与を説明できること。

## Source of Truth

指示と文書の優先順位は次のとおり。

1. 現在のユーザーによる明示的な指示
2. 承認済みの [Decision Log](docs/project/DECISION_LOG.md)
3. この `AGENTS.md`
4. [Project Charter](docs/project/PROJECT_CHARTER.md)
5. [Product Principles](docs/project/PRODUCT_PRINCIPLES.md)
6. [Information Architecture](docs/project/INFORMATION_ARCHITECTURE.md)
7. [Content Model](docs/project/CONTENT_MODEL.md)
8. [Design Principles](docs/project/DESIGN_PRINCIPLES.md)
9. [URL Migration Policy](docs/project/URL_MIGRATION_POLICY.md)
10. 既存コードと既存コンテンツ

現在の明示的なユーザー指示と文書が矛盾する場合は現在の指示を優先し、影響する文書とDecision Logも更新する。

## Protected Defaults

現在のタスクに明示的な変更指示がない限り、次を維持する。

- 表示ブランドは `N-IE Lab`、ドメインは `n-ie-qclab.com`。旧ブランド `N-IE QC Lab` は必要に応じて沿革・旧名称として扱う。
- メインメッセージは「ものづくりは、仕組みが見えるともっと面白い。」。
- 中心領域は経営工学、品質、生産、データ、改善。
- メインターゲットは製造業で3〜10年程度働く若手・中堅実務者。資格受験者は重要な読者だが、サイト全体の中心にはしない。
- 中心構造は「品質をつくる」「生産を整える」「データで確かめる」「改善を仕組みにする」の4領域。
- 資格関連は「学びを深める」の副導線に置く。
- コンテンツ形式は「読み解く」「図で見る」「試してみる」「現場で使う」「ケースから学ぶ」「学びを深める」。
- 初期ケースは「実績ゼロから、品質規格をどう決めるか」「外部試験の結果を、そのまま信じてよいのか」。
- 既存公開URL、記事、機能、検索評価を原則として維持する。URL変更時は301リダイレクトと移行確認を行う。
- 依存関係、CMS、データベース、認証、外部APIは、必要性が明確でユーザーが明示的に承認した場合だけ追加する。APIキーはサーバー側で管理する。
- 静的生成、MDX、Server Component中心を技術方向とし、操作が必要な箇所だけClient Componentにする。ただし現行はNext.js 14 Pages Routerのため、App Router移行は別途明示的な決定と移行計画なしに実施しない。
- デザインは大きな余白、明確な階層、一画面一メッセージ、抑制した装飾、モバイル可読性、最小限の動きを基本とする。
- 品質判断は、既存データ・URL・公開機能の保全、セキュリティ、アクセシビリティ、正確性と読者理解、保守性、表示速度、SEO、見た目、実装上の便利さの順で優先する。

詳細は [Change Policy](docs/project/CHANGE_POLICY.md) を参照する。

## Required Workflow

変更前に次を行う。

1. 関連する `docs/project/` 文書とDecision Logを読む。
2. 既存実装、公開URL、関連コンテンツを調べる。
3. 変更範囲と変更しない範囲を特定する。
4. Protected Defaultsへの影響を確認する。
5. 既存パターンを優先し、最小限の変更を行う。
6. 利用可能なlint、型チェック、テスト、ビルド、回帰確認を実行する。
7. 変更内容、変更しなかったもの、検証結果、残課題を報告する。

Protected Defaultsを変更する明示的な指示を受けた場合は、影響範囲を調査し、既存方針との差分を示し、Decision Logと関連文書を更新する。明示的な変更指示を旧方針だけを理由に拒否しない。

## Project Implementation Rules

- このプロジェクトはNext.js 14 / Contentlayer2の教育サイト。現行ルーティングはPages Router。
- 最小差分を使い、明示的に必要でない依存関係を追加しない。
- 既存コンポーネントとユーティリティを優先する。
- ガイドは `content/guides/{exam}/` で管理し、`exam` は `qc`、`stat`、`engineer` のいずれかとする。
- MDX本文にimport文やJSXコメントを書かない。
- インタラクティブコンポーネントは既存のガイドコンポーネントレジストリへ登録する。
- 数式はKaTeX記法を使う。インラインは `$...$`、ブロックは `$$...$$`。
- `matrix[i][j]` のような二重インデックスアクセスを避け、`src/lib/safe-matrix.ts` のユーティリティを使う。
- 文書や手順にBash専用コマンドを導入せず、PowerShell互換のnpmコマンドを使う。
- 変更後は `package.json` で利用可能なtypecheck、lint、テスト、ビルドを可能な範囲で実行する。

## Prohibited Actions

- 指示されていないブランド、ターゲット、URL、カテゴリー、依存関係の変更。
- 指示されていない記事削除、全面リライト、既存機能削除。
- 関係のない大規模リファクタリング。
- 同一内容の重複ページ作成。
- テストを通すためだけの仕様変更や、エラーを隠すための機能削除。
- 性能、可読性、アクセシビリティを犠牲にする過剰な動画、3D、スクロール演出。

## Completion Report

各タスクの完了時に次を報告する。

- 変更したもの。
- 意図的に変更しなかったもの。
- Protected Defaultsへの影響。
- typecheck、lint、テスト、ビルド、回帰確認の結果。
- 残課題と、必要な場合は次の安全な作業。

## Project Documents

- [PROJECT_CHARTER.md](docs/project/PROJECT_CHARTER.md)
- [PRODUCT_PRINCIPLES.md](docs/project/PRODUCT_PRINCIPLES.md)
- [INFORMATION_ARCHITECTURE.md](docs/project/INFORMATION_ARCHITECTURE.md)
- [CONTENT_MODEL.md](docs/project/CONTENT_MODEL.md)
- [DESIGN_PRINCIPLES.md](docs/project/DESIGN_PRINCIPLES.md)
- [URL_MIGRATION_POLICY.md](docs/project/URL_MIGRATION_POLICY.md)
- [CHANGE_POLICY.md](docs/project/CHANGE_POLICY.md)
- [DECISION_LOG.md](docs/project/DECISION_LOG.md)
- [REPOSITORY_AUDIT.md](docs/project/REPOSITORY_AUDIT.md)
