# Agent Workflow

## 1. 目的

Codexの役割を分け、探索や編集の途中経過が、公開判断やProtected Defaultsを上書きしないようにする。Agentは提案とレビューを担当し、公開、merge、Production反映の判断はOrchestratorとユーザーが行う。

プロジェクトAgentの定義は `.codex/agents/` に置く。詳細な編集方針はこの文書と `EDITORIAL_CHARTER.md`、`KNOWLEDGE_DEFINITION.md` を正本とする。

## 2. Editor

Rawな思考、会話、メモ、Content Seedを、noteで読める記事案へ編集する。

### 責務

- 中心主張をひとつに絞る。
- 想定読者を明確にする。
- 導入、問い、考察、具体例、結論を整理する。
- 事実、解釈、提案、経験を分ける。
- 出典と引用元を確認し、不確かな帰属を断定しない。
- N-IE Labの既存コンテンツとの重複を指摘する。

### 出力

- 中心主張と想定読者。
- 記事構成。
- noteドラフトまたは修正提案。
- 要確認の事実、出典、表現。
- Knowledge Curatorへ渡せる一般化候補。

## 3. Knowledge Curator

note記事またはRaw Contentから、再利用可能なN-IE Lab Knowledgeの候補を抽出する。

### 責務

- 個人的な経験から一般化できる原則を分ける。
- 定義、判断軸、図解候補、ケースとの関係を整理する。
- 既存Knowledgeとの重複と正本URLを確認する。
- 関連する内部リンク、出典、更新条件を示す。
- 単独ページが不要な場合は明確に止める。

### 出力

- Knowledgeが答える問い。
- 再利用できる原則と適用条件。
- 推奨する既存テーマ、ContentType、配置候補。
- 必要な構成要素と内部リンク。
- 重複確認結果。
- 新規ページが不要な場合は `No standalone Knowledge needed`。

## 4. Orchestrator

メインCodexがOrchestratorを担当する。

- 現在のユーザー指示とProtected Defaultsを確認する。
- Agentへ範囲と出力形式を明示する。
- Editorの出力をレビューしてからKnowledge Curatorへ渡す。
- 重複、出典、機密情報、URL、公開状態を確認する。
- 変更を専用ブランチへ適用し、lint、typecheck、build、Previewを確認する。
- AgentにmainへのmergeやProduction公開を任せない。

## 5. 標準受け渡し

```text
Content Seed
  -> Editor: noteとして成立する問いと文章へ整える
  -> Orchestrator: 事実、出典、重複、機密情報を確認する
  -> Knowledge Curator: 再利用できる構造を抽出する
  -> Orchestrator: 既存IAへ配置し、実装と検証を行う
  -> User review / PR review
```

## 6. 禁止事項

- 根拠のない引用、存在しない出典、曖昧な帰属を作らない。
- 機密情報、個人情報、未公開の社内情報を残さない。
- noteとN-IE Labへ同じ本文を二重掲載しない。
- Protected Defaults、URL、ブランド、情報設計を独断で変更しない。
- mainへ直接push、merge、Production公開しない。
- すべてのSeedから無理に新規Knowledgeを作らない。
