# 次にCodexへ渡す指示（2026-10-17）

Nagae916/qc-ie-consulting-siteを、次の順に整備してください。実行結果と未確認事項を区別し、mainへの直接push、force push、merge、本番公開を行わないでください。

## 1. 対象実装を取得

正本: AGENTS.md、docs/project/PROJECT_CHARTER.md、PRODUCT_PRINCIPLES.md、OPERATIONS_PLAN_20261017.md。

GitHubから `feat/site-operations-handoff` の最新先端を取得する。元のlocal `d3f5c53c720807bb56763ea413811ad3a8ebd6b9` と同じファイルtreeを持つ共有commitは `3c0f8695d7eb694150e79c53af24fdfb684973f7`。その後の文書更新も含めて取得する。GitHub連携で再作成したため、元のlocal commitを祖先として要求しない。別の更新候補branchは `chore/security-next15528-review`。候補の元local commit `0f7d8a733e20e45389058a776dc6edd685379a9a` とremoteのSHAは異なるため、remote branchのpackage差分と共有branchとの関係で確認する。空の同名branchは作らない。元履歴を保持するbundleはmain `98f9d024052a104c6cec98ad722d8581857faaba`を前提とする。

GitHub連携とshell Git認証は別。通常pushができなければ正規のGitHubログインで本人が承認する。secretを抽出・表示しない。SHAが変わるAPI経由のcommit再作成は、説明して確認を得た場合だけ行う。

## 2. セキュリティ候補をレビュー

候補はnext/eslint-config-next15.5.28の2ファイル差分。元local環境の開発branch上でgen、check:ci、16tests成功、critical1→0を確認済み。remoteの候補branchは共有branchからpackage.jsonとpackage-lock.jsonだけを変更したレビュー用branch。採用するときはこの更新差分だけを対象の専用branchへ適用し、Jev追加一式と無条件にまとめてmainへ統合しない。

対象環境でNode24とlockfileを使って再検証し、next/image、MDX、KaTeX、既存URL、6ツール、360/768/1280pxの画面を確認する。WindowsとVercel Previewは前回未確認。auditのhigh19、Next内部postcss8.4.31、Contentlayer系の到達性・互換性を別に分類する。audit fix --forceや無検証のmajor更新はしない。残る問題があれば候補の採否条件として明示する。

## 3. 本番SHAを確定

Vercel project `prj_c1PsKPY4NJnCkdcvrduJqwYvFoe5` / team `team_jp7DA029YN12Z6GD5yImsvog`。このteamへ正規に読取できる連携またはCLI/UIで、`n-ie-qclab.com`の現在のalias先deploymentを特定し、gitSourceのSHAとproduction状態を確認する。

mainのGitHub statusにはVercel successとdeploymentリンクがあるが、そのSHAを本番SHAと推測しない。現在のalias→deployment→SHAの対応を証拠付きで残す。403の場合はscopeを変えて迂回せず、必要権限と確認できたところまで報告する。

## 4. 計測と問い合わせ方針

OPERATIONS_PLAN_20261017.mdに従い、まずGSCの直近28日/90日のpropertyとexport有無を確認する。検索click・表示・CTRと上位記事を取得できればローカルダッシュボードへsource/期間/更新日付きで反映する。欠測は未取得、0と混同しない。GSCがなければ接続待ちとし、実績を作らない。

新規tracker・フォーム・決済を勝手に追加しない。受付は既存公開プロフィール経由を維持。正式な窓口、返信頻度、有償受託可否は本人の回答が必要で、認証emailを勝手に公開しない。公開する文面はこの回答がある場合に具体化し、機密資料を初回DMで求めない。問合せ台帳は非公開、公開dashboardは匿名集計のみ。

## 5. コンテンツ分担の小規模試行

AGENT_WORKFLOW.mdと既存2agentを再利用し、対象CLIでの認識と権限継承を確認する。子agentの独立read-only権限をTOMLのsandbox_modeだけで保証しない。

最初は上記方針の3記事を対象に、内容監査／出典・数理検証／Knowledge構造整理を分担する。各担当へURL・対象ファイル・読者の問い・出力形式だけを渡し、URL、事実、問題、一次資料/検算、修正案、不足情報を返してもらう。初回は子agentに編集を任せず、メインCodexが対象差分を作って検証する。noteを作る場合だけ既存Editorのフローを使う。

AGENTS.mdを変更する前は現行版をGitと日付付きコピーで保存し、hash、目的、差分を残す。今回はAGENTS.md変更を必須としない。正確性・レビュー負荷・時間で単独作業と比較してから分担を広げる。

## 完了報告

security候補と残課題、GitHubに存在するbranch/SHA、本番domainに対応するSHA、計測の取得有無と期間、受付方針の確定/未確定、agent試行の結果、テスト、閲覧先を分けて報告する。認証・権限の不足で未完了のものを完了としない。独立して進められるlocal検証は完了する。
