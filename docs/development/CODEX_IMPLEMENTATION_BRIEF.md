# Codex / Jev 開発支援の整理と実装指示

調査日: 2026-10-04（日本時間）。実装基準: `32538a935a3b3e12b4103d3f4b94d75b1340abdf`。この文書を含むコミットは文書追加のみで、下表のruntimeの状態を変えない。

## 観測した現在地

| 対象 | 既存の作成物 | 未完了・判断 |
| --- | --- | --- |
| GitHubへ引き渡す開発ブランチ | ローカル `feat/jev-development-tooling` に5件の追加コミット | `git ls-remote` が成功し、remoteの同名ブランチは返らなかった。remote mainは `98f9d024052a104c6cec98ad722d8581857faaba`。pushには別途書込認証が必要 |
| Jev Review | 変更差分のNoul・Choice・Score評価、Shadow report、20ファイル上限 | credentialなし。実APIの動作と精度は未検証。今回は37変更ファイル中20件がdry-runの対象、17件は上限により除外 |
| Jev Retention | PreCompactのpacket選別、SessionStartで任意の再注入 | Shadow既定。10〜20 sessionの評価なし。native compactionに渡す履歴の削除・圧縮を実現したとは扱わない |
| Jev Router | `jev-router@0.2.0` の任意起動、tier集計 | credentialなしで通常Codexへフォールバック。既定mappingはGPT-5.6 Luna/Terra/SolとGPT-6 Astraであり、先日のGPT-6 Luna/Sol案とは一致しない |
| TypeSafe skill / Codex | repo-local公式skill、固定CLI、hook定義 | CLI 0.155.0の認証は確認。hookの定義の存在と、Codexでの信頼設定・実発火は別。skill自体はruntimeではない |
| 指示量削減 | AGENTS.md 2,511文字、37行、文字数チェック | 入力トークン・再読込・完了率の削減は未計測。文字数をトークン削減率へ換算しない |
| AGENTS.md保存 | 2026-09-26版、SHA-256、Git履歴、比較・復元方針 | 次回更新前の保存を実行手順として定着させる。変更前の性能値は未取得 |
| 運営ダッシュボード | ローカル単独HTML、白い4列×2段カード、タスク・問いの表 | 公開ソースの数のみ。GA4・Search Console・相談・売上・最新CIは未接続。開発試行の計測表示は未実装 |
| Jevによる二段階評価 | 論文の整理と小規模試行の合意 | Jev→上位モデルの評価runtime、閾値選定、比較runnerは未実装 |

今回実行した検証: `npm run jev:check`（11 tests成功、dry-run成功、doctor実行）、`npm run check:agent-context`、`npm run dashboard:site`。実API、実hook、Windows、ブラウザ目視、全体CIは今回の調査では検証していない。

公開ソースの集計: published 238、下書き等1、themes明示3/238、updatedAt 113/238、ケース2、個別ツール6。公開サイトへこのソースが反映済みかは別に検証する。

## 実装の優先順位

### P0: 既存実装を対象環境で使える状態にする

- 対象repoは `Nagae916/qc-ie-consulting-site`。この作業環境のパスは `/workspace/scratch/e21edbe2f9e2/qc-ie-consulting-site`。別のCodex環境ではパスを読み替える。
- 空の同名ブランチを作らない。実装基準コミットが存在しない場合は、必要なブランチまたはGit bundleの転送を具体的に報告する。
- GitHub連携・シェルGit・Codex・TypeSafeの認証を別々に判定する。既存の指示により開発ブランチの通常pushは承認済み。GitHubログインが必要なら公式フローを案内し、ユーザー本人に承認してもらう。
- Node.js 24、lockfileを使う依存関係導入、既存のdoctor・test・dry-runを確認する。credentialの値は表示しない。
- 利用可能なmodel ID・effort・hook仕様をその環境のCLIと公式ドキュメントで確認する。既存Routerのproxy・認証方式・Windows起動・モデル対応を監査し、根拠なく既定モデルを変更しない。node_modulesを直接改変しない。
- 最初は手動のモデル選択で比較を開始できる構成を確保する。API試験とhookの承認・発火は、未実行ならその理由を明示する。

### P1: 比較計測とAGENTS.md保存を先に整える

- `AGENTS.md`を変更する前に現在版を保存し、日付、元コミット、SHA-256、変更目的を記録する。読み込む指示には保存版を自動で追加しない。
- 保存コマンドは既存版を上書きせず、現行ファイルとのバイト一致を確認できるようにする。復元は一時worktree等で検証し、本体の未保存変更を失わない。
- 次の10〜20件の実タスクのための記録形式を用意する。task/run ID、コードのコミット、AGENTSのhash、model/effort、Jev/provider、所要時間、完了・テスト結果、手戻り・再読込、入力/出力token、評価費用、推定/実課金の別を記録する。
- model切替、AGENTS変更、Retention、二段階評価を同時に変えず、比較条件を分離する。実課金不明のPlus利用にAPI単価を当てて実費と呼ばない。
- 欠測、0件、0円、試験skipを区別する。生prompt・transcript・secretは集計データへ含めない。

### P2: Jevによる二段階評価をShadowとして実装する

- 既存 `scripts/jev/client.mjs` と Reviewを再利用し、評価runnerと任意の上位モデルadapterを追加する。開発作業の生成モデルの切替と、生成済み回答の評価モデルの切替は別の実験として扱う。
- verdict、confidence、response validity、fallback理由を保存する。既存Reviewの「欠陥の確率」と「その判定への確信度」を混同しない。閾値0.9は候補であり、local選定データと独立した評価データで確かめる。
- 無効・欠損応答、timeout、credentialなし、上位モデル不可を扱う。未評価を合格にせず、既存の通常開発とnative compactionを止めない。無限retryや自動の追加課金を生むループを作らない。
- 通常の文章評価と、数学・コード・安全性の難しい判定を分ける。独立した正解またはテストを使い、上位モデルの判断自体を唯一の正解としない。
- 比較は「上位モデル単独」「Jev単独」「Jev＋上位モデル」。誤採用、fallback率、判定精度、成功判定当たり費用を比較する。pairwise評価では候補順序の反転も扱う。
- offline testを先に整え、実API試験はcredentialと既存の費用範囲が確認できたときだけ行う。API未実行でもmockで実装検証を完了し、残った実運用確認を具体的に示す。
- Retentionの再注入をチーム既定へ変更せず、10〜20 sessionの保持・再読込検証を別に行う。

### P3: ダッシュボードへ計測結果を接続する

- 既存の参考デザインを保ち、ローカル集計から試行件数、完了率、手戻り、判定費用、fallback率、要対応件数を表示する。期間・更新日時・出典を明示する。
- タスクと未回答の問いを更新できるデータ形式へ移し、現行の固定文言が実測と混ざらないようにする。未知データは未取得とする。
- 評価・token・model切替を別指標にする。cache hitや文脈の読み落としは測定根拠がなければ表示しない。
- owner専用のローカルHTMLとして、PCとスマートフォン幅で表示を確認する。GA4、Search Console、問い合わせ、売上の新規連携や一般公開は今回の範囲に含めず、確認済みの接続情報があれば次の案へまとめる。

## 完了条件

- 既存機能の再実装や本番サイトへのJev混入を避け、上記の不足部分を小さな変更で埋める。
- 関連offline tests、doctor、agent-context、dashboard生成、変更に応じた検証を通す。PR作成前には `npm run check:ci` を実行する。
- commit/pushは開発ブランチへ通常実行し、remote SHAを照合する。merge、mainへの直接push、force push、Production公開は行わない。
- 完了報告では実装、検証、実APIの未実行、認証の残課題、閲覧方法、commit/branch/PRを区別する。認証だけが止まった場合も、依存しないoffline作業は完了する。

## 研究・過去の参照元

- モデルの段階利用案: https://x.com/sairahul1/status/2102694818485096803
- 評価の二段階化: https://arxiv.org/abs/2609.26550 （評価費用を扱う研究。Codexの開発全体の費用削減を実証したとは扱わない）
- 指示量削減の調査元: https://x.com/tetumemo/status/2098656305309421766
- skill化の調査元: https://x.com/MakeAI_CEO/article/2101924475814212065
- API・hook等の仕様確認先は `JEV_DEVELOPMENT_TOOLING.md`。元投稿の宣伝表現ではなく、実装、公式仕様、local試行の結果を採用条件とする。

10月9日朝（日本時間）の「モデル切り替え試行」リマインドには、二段階評価の試行とAGENTS.md保存確認を含めてある。予定を実測済みの成果として数えない。
