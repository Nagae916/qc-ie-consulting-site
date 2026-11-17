# 情報構造・SNS導線 実装記録（2026-11-17）

## 基準点

- 開始ブランチ: `codex/information-architecture-social-entry`
- 開始元: `origin/main` `5e67ee99c6ddcfc24ab4d16f8b6d3c6136c8d6ad`
- 開始時の作業ツリー: clean
- AGENTS.md旧版: Git commit `98785602eef2dac4c0396ffd602f1ffd231329b7`
- AGENTS.md旧版SHA-256: `7A507D486FD61C2DE648C20CE5D23EB6840FA3E5CBCEB6875F825797AAA74975`
- AGENTS.md変更目的: 承認された4専門領域の表示名、2横断入口、現行Next.js 15 Pages Routerを正本へ反映する。

## 変更範囲

- トップの情報量を、サイト紹介、テーマ、理解を助けるガイド、新着・更新、関連情報へ整理する。
- 4専門領域のURLと内部IDを維持し、表示名と補足を更新する。
- 既存プロフィールをトップ、About、フッターから直接参照する。
- 検証済みnote記事を最大2件、手動データで掲載する。
- 工程能力周辺の3ガイドだけで、任意のKnowledge関連メタデータを実証する。
- Agentの再利用可能な実行指示を文書化する。

## 変更しない範囲

- 既存URL、slug、記事本文、演習、答案、ケース、ツールを削除・移動しない。
- SNS埋め込み、外部API、自動取得、認証、課金、定期実行を追加しない。
- 全ガイドへ関連メタデータを自動付与しない。
- セキュリティ更新、問い合わせ運用、事業運営ツールを混在させない。

## 画面比較

2026-11-17に、実装前のProductionと実装後のローカルproduction buildを同じ `1440 x 1000` のviewportで計測した。

| 計測項目 | 実装前 | 実装後 |
| --- | ---: | ---: |
| ページ全高 | 4,843px | 2,890px |
| ヒーロー下端 | 745px | 585px |
| 専門領域の見出し位置 | 1,217px | 657px |

実装前は質問セクションを読んだ後に「4つの視点」が現れた。実装後は、サイト紹介の直後に「テーマから学ぶ」が入り、最初のviewport内で4専門領域の見出しとカードを確認できる。ケース、ツール、ガイドは削除せず、「理解を助けるガイド」へ代表3件を集約した。

390 x 844のdevice metricsでトップ、About、工程能力ガイドを確認した。3ページとも `documentElement.scrollWidth = 390px` で、viewportを超える要素は0件だった。Desktopレイアウトの縮小ではなく、1列の読解順序へ変換されることも確認した。

## 外部情報の確認

- noteプロフィールとRSS: 2026-11-17確認
- X・Instagram: リポジトリ内の既存公開プロフィールURLを正本として使用
- note掲載件数: 2件。タイトル、URL、公開日はRSSと照合

## 検証結果

- `npm run typecheck`: 成功
- Next.js build内lint・型検査: 成功
- 変更したTypeScript / TSXへの直接ESLint: 成功
- `npm run build`: 成功
  - Contentlayer: 239件
  - 静的ページ: 266ページ
  - トップ First Load JS: 101 kB
  - 全ページ共通 First Load JS: 105 kB
  - ガイド First Load JS: 148 kB
- route audit、duplicate URL、generated content、Knowledge map、過去問130問、build output audit: 成功
- ローカルproduction buildの主要13ルート: すべてHTTP 200
- 3つの実証ガイド: 関係種別と公開済み関連先を表示
- draftガイド: HTTP 404、sitemap非掲載
- SNSリンク: トップ、About、フッターで既存3プロフィールを使用
- note掲載情報: 2026-11-17に公式RSSでタイトル、URL、公開日を照合
- PC / 390px: 横あふれなし。リンクはネイティブのアンカーまたはNext.js Linkで、キーボード操作を阻害する独自制御なし

既知警告は、`/guides/qc/oc-curve` のpage-data、Browserslist outdated、ContentlayerのWindows通知、複数lockfileによるworkspace root推定である。今回の変更に由来する新しいpage-data警告はない。

生成キャッシュを残した再ビルドで、既存ガイドのContentlayerコード文字列が不正なUnicode escapeへ変形する事象を一度確認した。元MDXと追跡ファイルに異常はなく、`.next` と `.contentlayer` を削除したクリーンビルドは成功した。生成物はコミット対象外とする。
