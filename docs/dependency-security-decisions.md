# 依存関係セキュリティ Decision Log

## 2026-08-02: Next.js 15 / Node.js 24 検証基盤

- Status: Proposed
- Context: Next.js 15.5.21、React 18.3.1、Pages Router、Contentlayer2 0.5.8 の構成を、Node.js 24で長期運用できるか検証した。
- Decision: Node.js 24を実行基盤とし、PostCSSは8.5.25、sharpは0.35.3へ個別に更新する。App Router、React 19、Contentlayer置換は同時に行わない。
- Reason: ローカルとVercel Previewでビルド、MDX生成、主要ルート、Chart.js、画像処理が成立し、更新前に残っていたPostCSSとsharpのHighを解消できたため。
- Affected areas: `package.json`、`package-lock.json`、CIのNode.js指定、Vercel Preview。
- Verification: ローカルNode.js v24.18.1、Vercel Node.js v24.18.0。通常のnpm install、typecheck、lint、build、231ガイド生成、主要ルート、API Routes、ISR、Chart.js、画像最適化、404、headers、redirectsを確認した。

### npm auditの変化

| 状態 | Critical | High | Moderate | Low | 合計 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 更新前・全依存 | 0 | 13 | 29 | 1 | 43 |
| PostCSS更新後・全依存 | 0 | 12 | 29 | 1 | 42 |
| sharp更新後・全依存 | 0 | 10 | 29 | 1 | 40 |
| sharp更新後・本番依存のみ | 0 | 6 | 25 | 1 | 32 |

### 残存Highの判断

| パッケージ | Advisory | 主な依存経路 | 到達可能性と方針 |
| --- | --- | --- | --- |
| `@grpc/grpc-js` | GHSA-5375-pq7m-f5r2、GHSA-99f4-grh7-6pcq | Contentlayer2のビルド時OpenTelemetry | 公開リクエストのサーバーバンドルに含まれない。Contentlayer2の互換更新で再評価する。 |
| `@opentelemetry/propagator-jaeger` | GHSA-45rx-2jwx-cxfr | Contentlayer2のビルド時トレース | 公開ランタイムでJaegerヘッダーを処理しない。Contentlayer2の互換更新で再評価する。 |
| `protobufjs` | GHSA-wcpc-wj8m-hjx6 | Contentlayer2からgRPC関連依存 | リポジトリ内コンテンツのビルド時だけに使用され、外部入力を処理しない。 |
| `js-yaml` | GHSA-52cp-r559-cp3m | Contentlayer2からgray-matter | 管理されたMDX frontmatterのビルド時解析だけに使用する。外部投稿を受け付けない。 |
| `picomatch` | GHSA-c2c7-rcm5-vvqj | Contentlayer2のファイル探索 | ビルド・監視時のみ。公開リクエストからパターン入力を受け付けない。 |
| `brace-expansion`、`glob`、`minimatch` | GHSA-3jxr-9vmj-r5cpほか | ESLint、knip等の開発ツール | 開発・検証時のみ。公開ランタイムには含めない。 |
| `flatted` | GHSA-25h7-pfq9-p65f、GHSA-rf6f-7fwh-wjgh | ESLint等の開発ツール | 開発時のみ。公開入力を処理しない。 |

`.next/server`とトレースを確認し、上記Highのパッケージが公開ページの実行経路に含まれないことを確認した。この検証ではContentlayer2の推移依存を強制上書きしない。互換性のないoverrideは、MDX生成やビルドを不安定にする可能性があるためである。

リスクが上昇する条件は、外部または利用者が作成したMDX・YAMLを実行時に受け付ける場合、Contentlayerの監視処理を公開サービスとして動かす場合、公開ランタイムでgRPC・Jaegerを有効化する場合、CLIのファイルパターンを外部入力から受け取る場合とする。

次回のNext.js 15パッチまたはContentlayer2更新時に再評価し、遅くとも2026-09-30までにaudit結果と到達可能性を見直す。

### 生成ページ数の差

ローカルWindowsは248ページ、Vercel Linuxは247ページを生成した。差分はローカルだけに現れる `/guides/engineer/production-modes` の1件である。

対象MDXは `status: draft` だが、WindowsのContentlayer生成値がCRLFを含む `draft\r` となり、完全一致の公開除外条件を通過していた。Vercelでは `draft` として正しく除外される。231件のガイド生成数は両環境で一致しており、本番では下書きが公開されない。

この差はNext.js 15またはNode.js 24の回帰ではない。Windows側のfrontmatter値を正規化する修正は、依存関係更新と分離した別タスクで扱う。

### PostCSSとsharp

- PostCSS 8.5.25: Next.js配下を含めて同一版へ解決し、CSSビルドとPreview表示を確認した。
- sharp 0.35.3: Next.jsの任意依存を同版へ解決し、ローカル画像生成、Previewの画像配信、SVG拒否条件を確認した。
- `npm audit fix --force`は使用していない。

