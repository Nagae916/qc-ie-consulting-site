# Repository Audit

- 調査日: 2026-08-01
- 対象: N-IE Labリニューアル前の `qc-ie-consulting-site`
- 方針: 機密値を出力せず、Phase 2・3の変更根拠を記録する

## 1. エグゼクティブサマリー

現行サイトはNext.js 14のPages Router、TypeScript、Contentlayer2、MDX、Tailwind CSSで構成され、231件のガイドと複数の計算・演習ツールを静的生成している。既存の学習資産は豊富で、URLを移動せず新しいテーマハブから再利用できる。

一方、公開ブランドとナビゲーションは資格学習中心で、N-IE Labの4テーマ、ケース、ポートフォリオ価値が入口から見えない。グローバルフッター、ケース、About、サービス、サイトマップ、robots、構造化データも未整備である。カテゴリ一覧は生成済みMDX全体をブラウザ側へ含めており、初期JavaScriptが大きい。

App Routerへの全面移行はURL・MDX・ISR・APIの回帰範囲が大きいため、今回実施しない。現行Pages Routerの上で情報設計と共通部品を整え、移行は別Decisionとする。

## 2. 技術スタック

| 項目 | 現状 |
|---|---|
| Next.js | 14.2.5 |
| React | 18.3.1 |
| Router | Pages Router |
| TypeScript | 5.5.4、strict、noUncheckedIndexedAccess、exactOptionalPropertyTypes |
| パッケージ管理 | npm、`package-lock.json` |
| CSS | Tailwind CSS 3.4.10、PostCSS、グローバルCSS |
| コンテンツ | Contentlayer2 0.5.0、MDX |
| 数式 | remark-math、rehype-katex、KaTeX |
| Lint | Next.js ESLint、unused-imports |
| 整形 | Prettierスクリプト・設定なし |
| テスト | 自動テストスクリプトなし |
| 配信 | Vercel連携済み、SSG・ISR中心 |
| ビルド | `npm.cmd run build` |

## 3. 主要ディレクトリ

| パス | 役割 |
|---|---|
| `pages/` | Pages Routerのページ、API Routes |
| `content/guides/` | QC、統計、技術士のMDXガイド |
| `src/components/guide/` | ガイド内の演習・可視化コンポーネント |
| `src/components/layout/` | 共通ヘッダー等 |
| `src/data/` | ツール、外部発信、参照情報 |
| `public/data/engineer/` | 技術士教材の構造化データ |
| `scripts/` | frontmatter、MDX、URL、重複等の検証 |
| `docs/project/` | Goal、設計原則、変更管理の正本 |

## 4. ページ・URL対応表

| 現在のURL | ページ名・役割 | 実装場所 | コンテンツ保存場所 | 方針 | 新しい配置先 | Redirect | 備考 |
|---|---|---|---|---|---|---|---|
| `/` | 現行トップ | `pages/index.tsx` | ページ内定義、外部フィード | 維持・再設計 | `/` | 不要 | N-IE Labの入口へ変更 |
| `/guides` | 資格・分野別ガイド入口 | `pages/guides/index.tsx` | Contentlayer | 維持 | 学びを深める補助入口 | 不要 | URLと既存役割を保全 |
| `/guides/qc` | QC・品質管理一覧 | `pages/guides/[exam]/index.tsx` | `content/guides/qc/` | 維持 | `/themes/quality`から接続 | 不要 | QC検定導線も維持 |
| `/guides/stat` | 統計一覧 | 同上 | `content/guides/stat/` | 維持 | `/themes/data`から接続 | 不要 | 統計検定導線も維持 |
| `/guides/engineer` | 技術士入口 | 同上 | `content/guides/engineer/` | 維持 | `/learn`から接続 | 不要 | 資格の副導線 |
| `/guides/production` | 生産管理入口 | `pages/guides/production.tsx` | 既存ガイドへのリンク | 維持 | `/themes/production`から接続 | 不要 | テーマハブと役割を分離 |
| `/guides/{exam}/{slug}` | 個別ガイド・演習 | `pages/guides/[exam]/[slug].tsx` | MDX | 維持 | 各テーマ・学習ハブから接続 | 不要 | 231件、公開URLを保全 |
| `/tools` | ツール一覧 | `pages/tools/index.tsx` | `src/data/site.ts` | 維持・文言調整 | `/tools` | 不要 | 既存ツールを再利用 |
| `/tools/{tool}` | 計算・可視化ツール | `pages/tools/*.tsx` | Reactコンポーネント | 維持 | `/tools/{tool}` | 不要 | 数式・演習回帰対象 |
| `/learn` | 学習方針 | `pages/learn/index.tsx` | ページ内定義 | 維持・再整理 | `/learn` | 不要 | 資格・体系学習の副導線 |
| `/references` | 白書・参照情報 | `pages/references/index.tsx` | `src/data/` | 維持・表現調整 | `/references` | 不要 | 開発者向け表現を除く |
| `/themes` | 4テーマ入口 | 未実装 | 新規設定データ | 新設 | `/themes` | 不要 | 既存記事を再公開しない |
| `/themes/{theme}` | テーマハブ | 未実装 | 新規設定データ＋既存URL | 新設 | 同左 | 不要 | quality/production/data/improvement |
| `/cases` | ケース一覧 | 未実装 | 新規ケースデータ | 新設 | `/cases` | 不要 | 匿名化方針を明記 |
| `/cases/{slug}` | ケース詳細 | 未実装 | 新規ケースデータ | 新設 | 指定2URL | 不要 | 意思決定と成果物を示す |
| `/about` | N-IE Labについて | 未実装 | ページ＋設定データ | 新設 | `/about` | 不要 | 誇張しない専門性表示 |
| `/services` | 相談可能領域 | 未実装 | ページ＋設定データ | 新設 | `/services` | 不要 | 成果物単位で説明 |
| `/contact` | 問い合わせ案内 | 未実装 | ページ＋外部導線 | 新設 | `/contact` | 不要 | フォームは導入しない |

## 5. コンテンツ管理

- `Guide` 1種類をContentlayerで管理し、`exam`、`slug`、`section`、`description`、`tags`、`version`、`status`、日付を持つ。
- ガイド数はengineer 158件、qc 10件、stat 63件。公開対象は230件、draftは1件。
- MDXの動的部品は `registry.client.ts` の許可リストから解決する。
- 既存記事へTheme等を一括追記せず、任意フィールドとハブ設定で段階移行する。
- ケースは一般記事の複製ではなく、匿名化した制約、判断、成果物、一般化可能な知見を持つ独立データとする。

## 6. 再利用可能な資産

- `SiteHeader`、ガイドのパンくず、カード表現、Tailwindの既存余白・配色。
- `labTools` と既存の計算・可視化ツール。
- QC、統計、技術士、生産管理の既存ガイド。
- Contentlayerの更新日とタグ。
- `ErrorBoundary`、KaTeX、MDXコンポーネントレジストリ。

## 7. SEO・URL移行

- 個別ガイドだけcanonicalがある。絶対URLではなくパス指定になっている。
- Open Graph、Xカード、WebSite/Article/Breadcrumb構造化データ、sitemap、robotsは未整備。
- 既存URLは移動せず、新しいハブからリンクする。
- 今回301リダイレクトは不要。将来URLを変える場合はURL Migration Policyへ対応表を追加する。
- titleとdescriptionの旧ブランド表記はN-IE Labへ段階的に統一する。

## 8. デザインシステム

- 白・薄いグレー、slate本文色、teal/emerald等の補助色を使用。
- 最大幅は主に `max-w-6xl`、記事は `max-w-3xl`。
- カード、見出し、ボタンの見た目はページごとに重複している。
- 現行ヘッダーは技術士ショートカットを常設し、モバイルで項目数が多い。
- 共通フッターがない。
- モーションは少なく、リニューアル方針と整合する。

## 9. 課題

### Critical

- 2026-08-02時点の `npm.cmd audit --omit=dev --audit-level=high` では、44件（low 4、moderate 28、high 11、critical 1）の既知脆弱性が報告された。
- criticalは現行のNext.js 14.2.5に関する複数のアドバイザリ、高 severityの多くはContentlayer2等の推移的依存関係に由来する。
- フレームワークとContentlayerの互換性、既存231件のMDX・URL・演習機能への影響が大きいため、今回の情報設計リニューアルへ依存関係更新を混在させなかった。
- HSTS等のセキュリティヘッダー追加は攻撃面の一部を抑えるが、依存関係更新の代替にはならない。対応済みバージョンへの更新可否を確認する専用のセキュリティ更新タスクを、次フェーズの最優先事項とする。
- `npm.cmd audit fix --omit=dev --dry-run` はnpmキャッシュへの書き込み権限不足（EPERM）で完了しなかった。依存ファイルへの変更は発生していない。

### High

- 公開ブランド、トップ、ヘッダーが資格学習中心で、永続Goalと一致していない。
- 4テーマ、ケース、About、サービスの入口がない。
- sitemap、robots、サイト全体のcanonical・OG・構造化データが不足している。
- セキュリティヘッダーが設定されていない。CSPは外部フィード・X埋め込みとの互換確認が必要。

### Medium

- `/guides/[exam]` が `allGuides` をページモジュールへ含め、初期読み込みが大きい。
- ヘッダーのリンク数が多く、技術士をサイト中心に見せている。
- グローバルフッター、共通メタ、共通カードがない。
- `references` に「メタデータ予定」等の運用者向け表現が露出している。
- READMEが旧React/Vite構成を説明しており、現行実装と一致しない。

### Low

- `_app.tsx` に既存のESLint警告がある。
- Browserslistデータが古い。
- 一部の個別ガイドでページデータが128KBを超える。
- 重複候補URLは分類済みだが統合判断が未実施。

## 10. 推奨実装順序

1. ブランド設定、共通メタ、ヘッダー、フッター、セキュリティ基本ヘッダー。
2. 4テーマとケースの設定データ、テーマ・ケースページ。
3. `/learn`、About、サービス、問い合わせ案内。
4. トップページを設定データと既存コンテンツで再構成。
5. sitemap、robots、構造化データ、canonical。
6. カテゴリ一覧の送信データ削減。
7. lint、typecheck、build、主要URL、360/768/1280px検証。

## 11. Phase 2・3で変更する主なファイル

- `pages/index.tsx`、`pages/_app.tsx`、`pages/learn/index.tsx`
- `pages/themes/*`、`pages/cases/*`、`pages/about.tsx`、`pages/services.tsx`、`pages/contact.tsx`
- `pages/guides/[exam]/index.tsx`、`pages/guides/[exam]/[slug].tsx`
- `src/components/layout/*`、`src/components/site/*`
- `src/data/n-ie-lab.ts`、`src/data/cases.ts`
- `contentlayer.config.ts`、`next.config.js`、`public/robots.txt`
- `docs/project/*`

## 12. 実行した確認

- `git status --short`、`git branch --show-current`
- `npm.cmd run typecheck`、`npm.cmd run lint`、`npm.cmd run build`
- `rg --files`、`rg`、`Get-Content`、`Get-ChildItem`
- frontmatterとガイド件数の読み取り集計
- `.env.local` は変数名だけを確認し、値は出力していない
- `npm.cmd audit --omit=dev --audit-level=high` による依存関係監査
- 360px、768px、1280pxでのトップページ表示、主要22ルート、404、sitemap、robotsのブラウザ回帰
- canonical、構造化データ、favicon、セキュリティレスポンスヘッダー、横スクロール、コンソールエラーの確認

`package.json` に自動テストスクリプトは存在しない。ルート・重複確認スクリプトには既存のWindows実行・生成物解決上の課題があるため、ビルドとブラウザ回帰を優先する。

最終検証では `npm.cmd run lint`、`npm.cmd run typecheck`、`npm.cmd run build` が成功した。静的生成は231件のドキュメント、259ページで完了した。既存のContentlayer Windows警告、Browserslist更新警告、`/guides/qc/oc-curve` のページデータ容量警告は残るが、今回の変更による新規エラーは確認していない。

## 13. Phase 2・3の実施結果

- 既存のPages Router、Contentlayer2、231件のガイドURL、既存ツールURLを維持した。
- `/themes` と4つのテーマハブを追加し、既存記事・ケース・ツールへの入口を整理した。
- `/cases` と指定2件の匿名化ケース、`/about`、`/services`、`/contact` を追加した。
- トップページをN-IE Labのメッセージ、4テーマ、ケース、ツール、既存コンテンツ、学習導線で再構成した。
- 共通のcanonical、OG、Xカード、JSON-LD、サイトマップ、robots、404、日本語文書指定を追加した。
- ヘッダーを4テーマ中心の情報設計へ変更し、共通フッターを追加した。
- `/guides/[exam]` がブラウザへ送るガイド情報をカード表示に必要な最小項目へ削減した。
- HSTS、MIME sniffing防止、フレーム拒否、Referrer Policy、Permissions Policyを追加した。CSPは既存の外部フィード・埋め込みとの互換確認を伴うため、今回導入していない。
- ContentlayerへTheme、ContentType、Difficulty等の任意項目を追加し、既存frontmatterを一括変更せず段階移行できるようにした。
- 低メモリ環境での静的生成停止を避けるため、Next.jsのビルドワーカー数を1に制限した。公開時のランタイム挙動には影響しない。

## 14. 次フェーズの優先事項

1. 専用ブランチでNext.jsの対応済みバージョンへの更新とContentlayer2互換性を検証する。
2. 更新前後でtypecheck、lint、build、既存主要URL、MDX、数式、演習、モバイル表示を回帰確認する。
3. Contentlayer系の推移的依存関係で直接修正できない脆弱性は、上流の修正版・代替移行方針・公開機能の到達可能性を個別評価する。
4. 既存の補助検証スクリプトについて、Windowsと現在の `.contentlayer/generated` 構成に適合させる。
