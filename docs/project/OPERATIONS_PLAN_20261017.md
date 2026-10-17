# N-IE Lab 運営準備・影響調査（2026-10-17）

## Goalの再確認

正本は `PROJECT_CHARTER.md` と `PRODUCT_PRINCIPLES.md`。製造業で3〜10年程度働く実務者へ、品質・生産・データ・組織・改善の関係を経営工学の視点から伝え、現場で使える判断・成果物へ変換する。同時に、運営者の問題構造化・根拠・判断・成果物を誠実に示すポートフォリオにする。資格は学びを深める副導線。公開URL・既存記事・検索評価を保全する。今回Goalやブランドは変更していない。

## セキュリティ更新の影響調査

| 項目 | 確認結果 |
| --- | --- |
| 実装の基準 | `3e51b8f95c811b83bba73f92741073a8b67a160d`。公開ページのコードはこの開発ブランチとmainで同一、Jev等は追加開発支援 |
| 隔離した候補 | local branch `chore/security-next15528-review`、commit `0f7d8a733e20e45389058a776dc6edd685379a9a` |
| 変更 | next / eslint-config-nextを15.5.22→15.5.28へ固定。package.jsonとlockの2ファイルのみ。Pages Router、React18、Contentlayer2は維持 |
| 依存導入 | Node24でlock生成、`npm ci --ignore-scripts --no-audit --no-fund`。lifecycle scriptを無効にした隔離調査であり、Windowsの通常インストールの確認ではない |
| 検証 | `gen`、`check:ci`、`jev:test`成功。静的266ページ、guide First Load JS146kB、draft除外、16tests。検証中のtrackedファイルの変動なし |
| 更新前audit | production依存のみ: critical1 / high19 / moderate24 / low5、計49のパッケージ警告 |
| 更新後audit | critical0 / high19 / moderate25 / low5、計49のパッケージ警告。Next自体のcritical advisoryは消えたが、全警告の解消ではない |
| 残る依存 | Next内部のpostcss8.4.31（rootは8.5.25）、Contentlayer系等。auditの推奨するmajor updateやoverrideをそのまま適用せず到達性・互換性を別に調べる |
| 画面・公開 | PC/スマホの目視、グラフ操作、Windows、Vercel Preview、本番の反映は未実施 |

Next公式のAVIF画像最適化の問題の対象範囲は15.5.24未満。ソースにはnext/imageを使うトップ画像があるが、AVIFの本番入力やホスティング条件は未確認。Windows-hosted serverの別問題と、開発PCがWindowsであることは同義ではない。候補でcriticalが消えたことから本番での悪用可能性の有無や解決済みを推測しない。

出典: https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4 。監査はローカルlockfileに対するnpm registryの当日結果。警告数は独立した攻撃経路数ではない。OC曲線ページの467kB警告は以前から残る。

## 実装共有と本番SHA

- GitHub連携はNagae916として認証済み、対象repositoryのpermissionはadmin。shell Gitとは別で、通常pushはUsername取得不能により失敗。secretの取得・流用はしていない。
- remote main: `98f9d024052a104c6cec98ad722d8581857faaba`。開発branchはremoteに存在せず、`3e51b8f...`もGitHub上にない。
- mainコミットのGitHub statusにはVercel successがある。詳細リンク: https://vercel.com/nagae916s-projects/qc-ie-consulting-site/8WtEA76P4z7uH96Ho7uD7Wbd3FbC 。これはそのcommitのデプロイ成功を示すが、現在の独自ドメインに割り当てられた本番SHAの証明にはならない。
- Vercel projectは `prj_c1PsKPY4NJnCkdcvrduJqwYvFoe5`、teamは `team_jp7DA029YN12Z6GD5yImsvog` と確認。対象teamのaliases/deployments/project詳細は403。Vercel CLIもこの環境にない。scopeを変えてアクセス制限を回避しない。
- 本番SHAを確定するには、対象teamのデプロイ・ドメイン読取権限があるVercel連携か、同じteamへ正規認証済みの環境が必要。独自ドメイン→現在のdeployment→gitSource SHAの順に照合する。
- GitHubのGit Data API連携でファイル・commitを送る案は用意できるが、現在のwrapperはauthor/committerの指定ができず、元のSHAと履歴を維持する通常pushの代わりにはならない。SHAを変えて再作成する前に確認する、というユーザーの既存指示に従い未実行。

### 承認後の共有更新

2026-10-17にユーザーがSHA変更を伴う別branchへの共有を承認。GitHub連携から `feat/site-operations-handoff` を作成し、共有commit `3c0f8695d7eb694150e79c53af24fdfb684973f7` を送信した。ファイルtreeは元local `d3f5c53c720807bb56763ea413811ad3a8ebd6b9` と一致し、tree SHAは `04fb86b9a383a52a04c3a7ead9b12b43d63acde6`。その後の文書更新はbranch先端へ追加する。元履歴はbundleに保持する。通常Gitの書込認証とVercel権限の不足は解消していない。

更新候補はremoteの `chore/security-next15528-review` へ分け、共有branchに対するpackage.jsonとpackage-lock.jsonの2ファイル差分として渡す。remote側では元localとSHAが変わるため、元のcommitが見つからないことを理由に停止せず、取得branch、祖先、ファイル差分を照合する。mainへのmerge・本番公開は含まない。

## 今回からの計測方針

最初は新しいtrackerや外部APIを追加せず、出典と期間を確認した集計の取得を優先する。実測値がない欄は「未取得」。0と欠測を区別し、先に数値目標をでっち上げない。28日を基本期間とし、90日を補助にする。比較では取得日と期間を必ず残す。

| 目的 | 最初に見る指標 | 出典と扱い |
| --- | --- | --- |
| 発見される | 検索クリック、表示回数、CTR、上位ページ/検索語 | Search Consoleの28日export。propertyと権限は未確認。index登録や順位向上を達成済みとしない |
| 実務で使える | 記事→ツール/ケースへの遷移、ツール完了 | 現状未計測。GA4等の採用とevent定義が決まるまで数値化しない。検索clickを読了・理解とみなさない |
| 信頼を示す | 重点記事の出典・適用条件・計算結果のレビュー完了 | URL単位のレビュー台帳。updatedAtや公開件数だけを品質の代用にしない |
| 相談へつながる | 初回問合せ、具体的相談、対応可否、完了 | owner管理の非公開台帳。重複相談を区別、test・spamは除外。SNS閲覧やclickを問合せ数としない |
| 運営を続ける | 保守時間、未解決問題、公開反映の確認 | Git/CI/実測記録。Jev費用削減は実測してから判断 |

現在あるローカルダッシュボードを使い、毎回の集計時に更新日・期間・source・未取得を表示する。アクセス増・相談増を確認するまでは、記事の一括増産やAI基盤の拡大より既存重点記事の改善を優先する。GA4/GSC接続や本人専用Web化は別の実装タスクであり、この方針文書を作成しただけでは接続されない。

## 受付方針（現時点で確定できる範囲）

- 当面は既存の公開プロフィール経由の一般問い合わせを維持し、新規フォーム・自動返信・決済は追加しない。相談内容と適合性を確認後に個別に可否を判断し、自動で受注しない。
- 受付情報は困りごと、期待する成果物、対象範囲、期限、公開できない情報の範囲。初回に企業の未公開資料や実データを求めない。
- 公開リポジトリ/ダッシュボードへ氏名、連絡先、企業名、相談本文を載せない。表示するなら匿名case IDと集計だけにする。
- 正式な受付SNS/DMまたは業務用email、返信可能な頻度、現在の有償受託可否はユーザーの確認が必要。GitHubに認証されたemailを勝手に公開窓口へ転用しない。確認前にサイトへ返信期限や受注可能の約束を書かない。

公開受付の最終確定と、GSCデータ取得は必要情報がなく未完了。この2点を方針策定・実装完了と混同しない。

## コンテンツを複数エージェントへ分担する案

既存のEditor（note用）とKnowledge Curator（一般化・重複確認）の定義は存在する。起動・期待する権限制御は未検証で、設定ファイルがあることだけで実稼働とはしない。Codex公式は子agentへの分担をサポートするが、権限は親から継承される。既存ファイルのsandbox_modeという記載だけで独立したread-only権限が保証されるとは考えず、使用中CLIの対応schemaと親の権限を確認する。

最初の分担は最大3担当、対象は3記事まで。

1. 内容監査: 読者の問い、4テーマとの関係、重複、内部リンク、直すべき箇所をURLと根拠で返す。
2. 出典・数理検証: 一次資料、前提、公式、数値例を独立確認し、情報不足を明示する。
3. Knowledge Curator: 上記を受け、既存記事の改修骨子、分類、成果物、関連リンクを提案する。note化する場合のみ既存Editorを先に使う。

メインCodexが提案を統合し、対象ファイルを明示して差分を作る。各agentは初回は調査・提案のみ。後で編集を分担するならファイルの担当と作業branch/worktreeを分ける。全員が同じMDXを同時編集しない。最後に別の目でレビューし、テスト・Preview・人の確認を経る。

最初の候補は `/guides/qc/how-to-set-quality-standards`、`/guides/stat/simple-linear-regression`、`/guides/engineer/production-planning`。人気順ではなく、実務課題・数理・工程管理を試す代表サンプル。GSC未取得のため流入優先度は未確定。

返却形式: URL、読者の問い、確認した事実、問題、出典/検算、最小修正案、既存リンク、情報不足。長い全履歴を全agentへ渡さず、対象資料だけを渡す。単独作業との時間・手戻り・正確性を比較し、分担しただけで費用が下がるとしない。

出典（2026-10-17閲覧）: https://learn.chatgpt.com/docs/agent-configuration/subagents 。mainへの直接push、merge、Production公開は子agentへ委譲しない。計画作成後に読み取り専用の小規模試行を実施したが、記事改稿はしていない。結果は下記の実行記録を参照する。

## 実行記録

この計画に基づく検証結果、権限待ち、Agent小規模試行は
`docs/development/SITE_OPERATIONS_EXECUTION_20261017.md` に記録する。
