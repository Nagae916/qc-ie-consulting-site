# Knowledge Agent Handoffs

## 共通ルール

Agentは提案と下書きだけを行い、公開、外部送信、課金、mainへのmergeを行わない。既存URL、本文、出典を正本として確認し、不明な値を推測で埋めない。出力は次のAgentと人が根拠を追える形式にする。

## 分類・重複確認

- 目的: 既存Knowledgeの所属候補と重複を確認する。
- 入力: 対象URL、本文、frontmatter、既存ガイド一覧、4専門領域と中項目。
- 成果物: 主領域・中項目候補、検索意図、重複候補、正本候補、統合・追加・変更不要の判断案。
- 完了条件: 候補URLと判断根拠があり、既存ページを確認している。
- 変更可能範囲: 専用ブランチ内の監査下書き。公開本文とURLは変更しない。

## 関連づけ

- 目的: Knowledge間の読解順序を、根拠付きで提案する。
- 入力: 対象Knowledge、既存メタデータ、公開URL一覧、分類・重複確認結果。
- 成果物: 最大3件の関連先、`prerequisite` / `together` / `application`、関係の根拠、リンク確認結果。
- 完了条件: 全参照先が実在し、関係種別が内容上妥当で、同じURLを重複していない。
- 変更可能範囲: 任意メタデータの下書き。本文へのリンク大量追加は行わない。

## 内容点検

- 目的: 再利用可能なKnowledgeとして不足する情報を特定する。
- 入力: 本文、frontmatter、出典、確認日、関連づけ候補。
- 成果物: 定義、適用条件、注意点、出典、確認日の不足一覧と優先度。
- 完了条件: 事実と提案を区別し、出典未確認を未確認のまま示している。
- 変更可能範囲: レビュー記録のみ。本文改稿は別承認とする。

## 受け渡し形式

```yaml
target:
  id: knowledge.example
  url: /guides/example
classification:
  primaryArea: quality
  subtopics: []
duplicateReview:
  candidates: []
  recommendation: keep | consolidate-later | no-new-page
relations:
  - relation: prerequisite | together | application
    href: /guides/example
    reason: ""
contentAudit:
  missing: []
  sourcesCheckedAt: YYYY-MM-DD | not-obtained
ownerReviewRequired: true
```
