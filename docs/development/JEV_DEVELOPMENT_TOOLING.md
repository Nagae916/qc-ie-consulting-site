# Jev Development Tooling

## 1. 目的と適用範囲

Jevは、N-IE Labの本番機能ではなく開発支援にだけ使用する。対象は次の3経路である。

1. 変更差分のレビュー信号を生成する `Jev Review`。
2. Codexのnative compaction前に、再読込リスクのあるtool resultを選別する `Jev Retention`。
3. Codex CLIを任意に振り分ける `Jev Router`。

サイトの公開URL、コンテンツ、生成処理、ブラウザへ配信するJavaScriptにはJevを組み込まない。

repo-localの公式 `typesafe-ai` skillは、3経路を設計・保守するCodexへTypeSafeの判断分解とAPI利用手順を与える。skill自体は第4の実行経路ではなく、インストールしただけでReview、Retention、Routerが自動実行されるものでもない。

## 2. 安全な既定値

| 経路 | 既定 | 失敗時 | 強制力 |
|---|---|---|---|
| Review | Shadow Mode | レビューをskipし、成功終了 | advisoryのみ |
| Retention | Shadow Mode | native compactionを継続 | 再注入なし |
| Router | 無効 | 通常の`codex`コマンドを使用 | 明示起動時のみ |

Reviewの確率は欠陥の証明ではない。RetentionはJevが破棄候補と判定しても、`JEV_COMPACTION_MODE=retain`へ明示変更するまでは判断を実行に反映しない。直近4件、エラー・制約・schema・security等を含む結果、編集系tool resultは強制保持する。破棄候補の閾値は既定で`0.95`である。

## 3. セットアップ

Node.js 24で依存関係をインストールする。

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run jev:doctor
```

公式 `typesafe-ai` skillは `.agents/skills/typesafe-ai/` に配置し、`skills-lock.json`で `typesafe-ai/skills` を参照する。Codex CLIまたはIDEでは `/skills` で確認し、TypeSafe/Jevの設計タスクでは `$typesafe-ai` と明示して利用できる。更新時だけ次を実行し、差分とテストをレビューする。

```powershell
npx.cmd skills update typesafe-ai --project --yes
```

ReviewとRetentionは、`TYPESAFE_API_KEY`（または互換用の`JEV_API_KEY`）があれば公式JavaScript SDKでTypeSafeへ直接接続する。直接credentialがなく、`AI_GATEWAY_API_KEY`または`VERCEL_OIDC_TOKEN`がある場合はVercel AI Gatewayへフォールバックする。両方がある場合は直接接続を優先する。

直接接続の既定モデルは評価再現性のため`jev-1.13.0`へ固定し、`TYPESAFE_DEFAULT_MODEL`で変更できる。Gatewayの既定モデルは`typesafe-ai/jev`で、`JEV_MODEL`で変更できる。モデル更新時は同じ評価データで変更前後を比較する。

RouterはTypeSafeへ直接接続し、`TYPESAFE_API_KEY`または`JEV_API_KEY`を使う。AI Gatewayのcredentialとは共有しない。これにより、`TYPESAFE_API_KEY`を1つ設定すればReview、Retention、Routerの3経路を利用できる。値は`.env.local`またはCI secretで管理し、commitしない。

Codexはproject-local hookを自動では信用しない。リポジトリを開いた後、`/hooks`で`.codex/hooks.json`の内容を確認して有効化する。

Codex CLIは開発依存関係へversion固定している。初回だけ次を実行し、ChatGPTアカウントで認証する。

```powershell
npm.cmd run codex:login
npm.cmd run codex:status
```

## 4. Codexでの利用開始

次の順に実行する。

```powershell
# 1. Codex・認証・hook・Jev credentialの状態を確認
npm.cmd run jev:doctor

# 2. Jev Router経由でCodexを起動
npm.cmd run codex:jev
```

起動後に`/skills`で`typesafe-ai`を確認し、`/hooks`でこのリポジトリの`PreCompact`と`SessionStart`を確認して承認する。直接credentialがない場合、`codex:jev`は通常のCodexへ安全にフォールバックする。ReviewとRetentionは直接credentialまたはGateway credentialがない場合、評価をskipする。

TypeSafe/Jevの設計変更を依頼するときは、次のようにskillを明示できる。

```text
$typesafe-ai
このリポジトリのJev開発支援を変更してください。
最初にnpm.cmd run jev:doctorを実行し、
docs/development/JEV_DEVELOPMENT_TOOLING.mdと必要なTypeSafe公式資料だけを確認してください。
既存のShadow Mode、fail-open、データ境界を維持し、未実行のAPI試験を成功と報告しないでください。
```

## 5. 実行コマンド

```powershell
# networkを使わない構成・parserテスト
npm.cmd run jev:test

# networkを使わないレビュー配線確認
npm.cmd run jev:review -- --dry-run

# CodexとJevの利用準備を診断（secret値は表示しない）
npm.cmd run jev:doctor

# 架空データ1件でcredentialとAPI応答を確認（credential設定後だけ）
npm.cmd run jev:smoke

# 現在の差分をShadow Review（credentialがなければskip）
npm.cmd run jev:review -- --base origin/main

# Codex transcriptを模したcompaction packet確認
npm.cmd run jev:compaction:sample -- scripts/jev/__tests__/fixtures/transcript.jsonl

# 任意のrouter経由でversion固定済みCodex CLIを起動
npm.cmd run codex:jev

# prompt本文を出さずにrouterの集計だけを表示
npm.cmd run jev:router:metrics
```

`jev:doctor`はcredentialの存在までを確認し、有効性やAPI到達性は判定しない。`jev:smoke`は固定した架空データだけを送信し、provider、実際に応答したmodel、answer type、token usageを表示する。実データを使う前にこの2段階を分けて確認する。

Review reportは`.jev/reports/latest.md`と`.json`へ保存し、commitしない。Retention packetは`.codex/runtime/`へ権限`0600`でatomic writeし、commitしない。

## 6. データ境界

| 経路 | 外部へ送るデータ | 送らないもの |
|---|---|---|
| Review | 最大20変更ファイルのgit patch、変更されたtest patch | `.env*`、credential・secret・private key名のfile、リポジトリ全体 |
| Retention | 最大24件のtool名・入力・結果（文字数上限あり） | transcript全体、過去の全会話 |
| Router | Codexへ入力するuser prompt | tool result、会話履歴 |

機密情報を含む可能性があるtaskではReview/Retentionのcredentialを外すか、hookを無効化する。直接接続ではTypeSafeへ、Gateway接続ではGateway経由でTypeSafeへ上表のデータを送る。Reviewは代表的なsecret file名を除外するが、通常のsourceへ書かれたsecretを完全には検出できない。Shadow Modeは「判定結果を自動適用しない」設定であり、「外部送信しない」設定ではない。transcript形式は安定APIではないため、parserは未知レコードを無視し、異常時はfail-openする。

## 7. CIと段階導入

`npm run jev:test`はUbuntuとWindowsのCIで必須とする。Pull RequestのJev Reviewは`AI_GATEWAY_API_KEY` secretがある場合だけ実評価し、結果やAPI障害でmergeをblockしない。

Retentionの再注入を有効にする前に、最低10〜20 sessionのShadow packetを確認し、次を満たすこと。

- 必要なerror、decision、path、schema、検証結果の保持率が100%である。
- drop candidateにより同じfileやcommandの再読込が増えていない。
- packetの文字数削減とtask完了率が改善または同等である。
- transcript形式変更時もhookがnative compactionを止めない。

条件を満たした後も、最初は個人のlocal環境だけで`JEV_COMPACTION_MODE=retain`を設定する。CIやチーム既定値へ昇格する場合はDecision Logを更新する。

## 8. Codex指示量の管理

常時適用する`AGENTS.md`には判断の境界と資料への案内だけを置き、各文書・skill本文は関連タスクで読む。TypeSafe/Jevの設計時だけ`typesafe-ai` skillを使い、公式資料は必要なページだけ確認する。skillの名前・説明文は選択時に読み込まれるため、追加するskillの適用条件は短く具体的に書く。追跡中の公式skillは更新コマンドとの整合性を優先し、説明文をローカルで書き換えない。

```powershell
npm.cmd run check:agent-context
```

この読み取り専用チェックは`AGENTS.md`の文字数と行数、repo-local skillの説明文の文字数と本文行数を表示し、`AGENTS.md`がプロジェクト上限の3,500文字を超える場合、skill名・説明文が欠ける場合、名前が重複する場合、本文が500行を超える場合に失敗する。CIにも含める。文字数はトークン使用量の実測値ではない。実際の削減効果は同種タスクの入力トークン、完了率、再読込回数を変更前後で比べて判断する。

Jev Reviewは追加の評価を実行し、Shadow ModeのRetentionは再注入も圧縮も行わない。Routerはモデル選択を補助する。これらを`AGENTS.md`の削減量やトークン節約量へ合算しない。

## 9. 参考仕様

- [TypeSafe Agent Skill](https://docs.typesafe.ai/agent-skill)
- [TypeSafe JavaScript SDK](https://docs.typesafe.ai/sdk/javascript)
- [TypeSafe API](https://docs.typesafe.ai/api)
- [Codex hooks](https://developers.openai.com/codex/hooks)
- [Vercel AI Gateway models](https://vercel.com/ai-gateway/models)
- [Vercel AI SDK evaluation](https://ai-sdk.dev/docs/ai-sdk-core/evaluation)
- [OpenAI: Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)
