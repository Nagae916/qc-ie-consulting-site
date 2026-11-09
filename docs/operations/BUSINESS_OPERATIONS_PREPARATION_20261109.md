# 事業・発信運用の準備記録

更新日: 2026-11-09

## 1. この文書の範囲

N-IE Labを主力とし、note、X、Instagramを認知・信頼形成・サイトへの入口として使うための準備を記録する。公開、販売、課金、メール送信はこの準備には含めない。商品、価格、投稿頻度、売上目標は仮説であり、所有者の承認済み実績ではない。

サイトは再利用可能なKnowledgeの正本、noteは考え・経験・問い・背景、SNSは短い発見と正本への入口とする。同じ本文を媒体間で複製しない。

## 2. 4週間の企画

| 週 | 中心の問い | 正本・親記事 | 媒体展開 | 確認すること |
| --- | --- | --- | --- | --- |
| 2026-11-09〜11-15 | Cpが高ければ良い工程と言えるか | [工程能力スタディガイド](https://n-ie-qclab.com/guides/stat/process-capability) | noteで判断の前提、XでCp/Cpk小問、Instagramで関係図 | 工程安定性、規格中心、数式と単位 |
| 2026-11-16〜11-22 | 管理限界と規格限界を混ぜると何が起きるか | [管理図の基礎](https://n-ie-qclab.com/guides/stat/control-chart-basics) / [管理図ツール](https://n-ie-qclab.com/tools/control-chart) | noteで誤判定、Xで短い例、Instagramで比較図 | 限界の目的、異常原因、誤判定表現 |
| 2026-11-23〜11-29 | 是正処置が再教育だけで終わる理由 | [WHYから考える品質問題解決](https://n-ie-qclab.com/guides/qc/why-before-how-quality-problem-solving) | noteで因果関係、Xで架空例、Instagramで対応表 | 原因・処置・有効性確認、架空例の明示 |
| 2026-11-30〜12-06 | 不良率だけでは改善効果を読み違える | [記述統計](https://n-ie-qclab.com/guides/stat/descriptive-statistics) / [データの種類と尺度](https://n-ie-qclab.com/guides/stat/data-types-and-scales) | noteで比較条件、Xで割合小問、Instagramで確認表 | 母数、期間、層別、件数と割合 |

各媒体の個別行、状態、CTA、想定工数は `EDITORIAL_LEDGER.json` で管理する。公開予定日は所有者の承認後に設定する。

## 3. 台帳

### 原稿台帳

- ファイル: `docs/operations/EDITORIAL_LEDGER.json`
- 必須項目: テーマ、親記事URL、媒体、状態、出典、レビュー、公開予定、公開URL、CTA、想定・実工数。
- 状態: `backlog -> brief -> draft -> fact-check -> owner-approved -> scheduled -> published -> measured`。
- 実在するサイトURLだけを親記事に設定する。noteやSNSの公開URLは、実際に公開された後に記録する。

### 事業計測台帳

- ファイル: `docs/operations/BUSINESS_METRICS_LEDGER.json`
- 指標: 表示、サイト流入、サンプル利用、商品リンククリック、販売件数、売上、費用、工数。
- `null` は未取得または未確認であり、0ではない。
- 0は対象期間、定義、出典を確認して0件だった場合だけ記録する。
- `estimatedCostJpy` と `actualChargedJpy` を分け、試算を実課金として表示しない。
- 実際の売上、問い合わせ、個人情報はリポジトリへ記録しない。ローカル実績は `.site-ops/business-metrics.local.json` に置く。

## 4. GA4・GSC・UTMの現在地

### Search Console

- ドメインプロパティ `n-ie-qclab.com` は2026-10-19に所有権確認済み。
- `https://n-ie-qclab.com/sitemap.xml` は送信成功済み。
- 28日・90日のデータは未取得。ゼロとは扱わない。
- 公開サイトのsitemapはHTTP 200で、robots.txtのSitemap指定と本番ドメインが一致していることを確認済み。

### GA4

コード上にGA4、Google Tag、`gtag`、`dataLayer`、Measurement IDの実装は見つからない。アカウント、プロパティ、権限、プライバシー方針も未確認である。したがって、イベント送信コードは追加していない。

導入する場合は、次を先に決める。

1. 所有者が管理するGA4プロパティと閲覧権限。
2. Cookie・プライバシー表記への影響。
3. `sample_download` が実際のサンプル取得を示す条件。
4. `product_outbound_click` が外部販売先への遷移だけを示し、購入成功ではないこと。
5. 販売先側の実売上とサイトイベントを別の出典として扱うこと。

### UTM

外部媒体からサイトへ入るリンクに限り、次を候補とする。

```text
utm_source=note|x|instagram
utm_medium=social
utm_campaign=qc_practice_202611
utm_content=<content_id>
```

内部リンクにはUTMを付けない。存在しない商品URLや販売先URLは作らない。

## 5. 役割と承認境界

| 役割 | 担当 | 完了条件 | 禁止・承認境界 |
| --- | --- | --- | --- |
| 企画 | Agent / Codex | 読者、問い、親記事、仮説、未確認点が明確 | 未取得データや需要を作らない |
| 執筆 | Editor / Codex | 媒体の役割に合う草稿と出典がある | 体験、顧客の声、売上を創作しない |
| 技術・事実検証 | Reviewer / Codex | 数式、単位、適用条件、リンクを検査 | 規格適合や効果を断定しない |
| 媒体展開 | Editor / Codex | 正本と重複しない派生原稿 | 外部投稿、予約、メール送信を実行しない |
| 集計 | Codex | 出典・期間・取得状態を明示 | 未取得を0にしない。クリックを購入にしない |
| 専門判断・公開承認 | 所有者 | 正確性、公開、価格、販売条件を承認 | Agentへ委任しない |

## 6. 所有者判断待ち

- 投稿頻度と週の作業時間。
- note、X、Instagramのアカウント権限と公開フロー。
- GA4の導入可否、プロパティ、プライバシー対応。
- 商品候補、価格、販売条件、サポート、返金、権利条件。
- 3営業日の定義と、それが初回返信を指すか。
- 副業、競業、著作権、守秘、税務、販売者表示に関する確認。

## 7. 変更しないもの

- 新規API、認証、EC、販売ボタンを追加しない。
- SNS投稿、メール送信、販売、課金を実行しない。
- 既存URL、記事、ブランド、4テーマを変更しない。
- Search Consoleの未取得データを実績として補完しない。
