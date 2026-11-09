# 運営ダッシュボード（ローカル専用）

## 閲覧と更新

Node.js 24で依存関係をインストールしたリポジトリから実行する。

```powershell
npm.cmd run dashboard:site
```

生成された `.site-ops/dashboard.html` をブラウザで開く。外部通信、APIキー、認証を必要とせず、本番サイトとsitemapには含まれない。

## データ源

| 区画 | データ源 | 扱い |
| --- | --- | --- |
| 公開資産 | `content/guides/`、`src/data/n-ie-lab.ts`、`src/data/cases.ts`、`pages/tools/` | リポジトリから再集計 |
| 発信準備 | `docs/operations/EDITORIAL_LEDGER.json` | 公開予定と公開URLは承認後に記録 |
| 事業計測 | `.site-ops/business-metrics.local.json`。なければ `docs/operations/BUSINESS_METRICS_LEDGER.json` | `null` は「未取得」。0に変換しない |
| GSC・GA4 | 現在は自動接続なし | GSCはデータ蓄積待ち、GA4は未確認 |

実際の売上、問い合わせ、個人情報は公開ファイルやコミットへ含めない。ローカルの実績ファイルを使う場合は、`BUSINESS_METRICS_LEDGER.json` と同じ構造で `.site-ops/business-metrics.local.json` を作る。`.site-ops/` はGit管理外である。

## 指標の注意

- 媒体の表示数を合算してユニーク人数と呼ばない。
- 商品リンククリックを購入成功と扱わない。
- 試算費用と実課金を分ける。
- 集計期間、更新日時、出典を画面に表示する。
- 未取得値は「未取得」のまま表示する。
