# 依存関係セキュリティ Decision Log

## 2026-08-03: Next.js 15.5.22 / Node.js 24 最終候補

- Status: Accepted
- Context: Pages Router、React 18.3.1、Contentlayer2 0.5.8を維持したまま、Next.js 15.5.22とNode.js 24へ更新する。
- Decision: Next.jsとeslint-config-nextを15.5.22、Node.jsを24.xとする。サイトのCSS構築に使うPostCSSは直接devDependencyの8.5.25を維持する。Next.js内部のPostCSS 8.4.31とoptional dependencyのsharp 0.34.5は、公式パッケージ宣言どおりに解決し、overrideまたは直接依存を追加しない。
- Reason: 宣言範囲外の強制上書きを避けながら、ローカルとVercelで回帰検証できる構成にするため。
- Re-evaluation: 次回のNext.js 15 Maintenance LTSパッチまたはContentlayer2更新時。遅くとも2026-09-30までに再確認する。
- Verification: Node.js 24.18.1のWindows環境でinstall、typecheck、lint、build、MDX、KaTeX、Chart.js、API、ISRを確認した。Vercel PreviewではNode.js 24.x、231ガイド、247ページの生成と主要ルートの実レスポンスを確認した。

### 構成

| 対象 | 採用版・方針 |
| --- | --- |
| Next.js / eslint-config-next | 15.5.22 |
| Node.js | 24.x |
| React / React DOM | 18.3.1 |
| Contentlayer2 / next-contentlayer2 | 0.5.8 |
| PostCSS | サイト用devDependency 8.5.25、Next.js内部8.4.31 |
| sharp | Next.js optional dependency 0.34.5。直接依存・overrideなし |
| Router | Pages Routerを維持 |

### npm audit

| 対象 | Critical | High | Moderate | Low | 合計 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 全依存 | 0 | 13 | 29 | 1 | 43 |
| 本番依存のみ | 0 | 9 | 25 | 1 | 35 |

`next`のHighは、配下のPostCSSとsharpを集約して表示したものであり、独立した追加アドバイザリではない。件数ではなく、次の到達可能性で判断する。

### 残存High

| パッケージ | CVE / GHSA | 依存経路・利用時点 | 外部入力からの到達可能性と受容理由 | 修正版・対応状況 |
| --- | --- | --- | --- | --- |
| PostCSS 8.4.31 | GHSA-qx2v-qp2m-jg93、GHSA-6g55-p6wh-862q、GHSA-r28c-9q8g-f849 | Next.js内部。CSSビルド時 | 信頼されたリポジトリ内CSSだけを処理する。ユーザー投稿、外部CSS、外部source mapをビルドしない。公開リクエストのFunction traceには含まれない。 | 8.5.18以上で修正。Next.jsが固定版を更新した時点で追随する。 |
| sharp 0.34.5 | CVE-2026-33327、CVE-2026-33328、CVE-2026-35590、CVE-2026-35591 / GHSA-f88m-g3jw-g9cj | Next.jsのoptional dependency | `next/image`を使用せず、画像アップロードや外部画像処理もない。本番Function traceに含まれないため、脆弱なlibvips処理へ到達しない。 | 0.35.0以上で修正。Next.jsが許容範囲を更新した時点で追随する。 |
| @grpc/grpc-js | GHSA-5375-pq7m-f5r2、GHSA-99f4-grh7-6pcq | Contentlayer2からOpenTelemetry経由。ビルド時 | 公開gRPCサーバー・クライアントとして使用せず、公開Function traceにも含まれない。 | 1.14.4以上。Contentlayer2側の更新で追随する。 |
| @opentelemetry/propagator-jaeger、sdk-trace-node | GHSA-45rx-2jwx-cxfrほか集約依存 | Contentlayer2のビルド時トレース | 公開ランタイムでJaegerヘッダーを処理しない。 | propagator-jaeger 2.9.0以上。Contentlayer2側の更新で追随する。 |
| protobufjs | GHSA-jggg-4jg4-v7c6、GHSA-wcpc-wj8m-hjx6、GHSA-f38q-mgvj-vph7、GHSA-j3f2-48v5-ccww | Contentlayer2からgRPC経由。ビルド時 | 外部proto、JSON descriptor、Anyメッセージを受け付けない。公開Function traceに含まれない。 | 7.6.4より後の修正版へContentlayer2経由で追随する。 |
| js-yaml | GHSA-mh29-5h37-fv8m、GHSA-h67p-54hq-rp68、GHSA-52cp-r559-cp3m | Contentlayer2 / gray-matter、knip等。ビルド・開発時 | 管理されたMDX frontmatterだけを解析し、外部YAML投稿を受け付けない。 | 上位依存の互換更新で追随する。 |
| picomatch | GHSA-3v7f-55p6-f55p、GHSA-c2c7-rcm5-vvqj | Contentlayer2のファイル探索、knip。ビルド・開発時 | パターンはリポジトリ設定に固定し、外部入力を渡さない。 | 2.3.2または4.0.4以上。上位依存の更新で追随する。 |
| brace-expansion、minimatch、glob | GHSA-f886-m6hf-6m8v、GHSA-3jxr-9vmj-r5cp、GHSA-mh99-v99m-4gvg、GHSA-3ppc-4f35-3m26、GHSA-7r86-cg39-jmmj、GHSA-23c5-xmqv-rm74、GHSA-5j98-mcp5-4vw2 | ESLint、knip、depcheck等。開発・CI時 | 公開リクエストからglobやCLI引数を受け付けない。 | 開発ツールの互換更新時に追随する。 |
| flatted | GHSA-25h7-pfq9-p65f、GHSA-rf6f-7fwh-wjgh | ESLint。開発時 | 公開ランタイムに含まれず、外部JSONを解析しない。 | ESLint系の互換更新時に追随する。 |

### リスクが上昇する条件

- `next/image`、画像アップロード、外部画像変換を導入する。
- ユーザー投稿または外部取得したCSS、source map、MDX、YAMLをビルド・解析する。
- Contentlayerの監視・生成処理を公開ランタイムで実行する。
- gRPC、Jaeger、OpenTelemetryヘッダーを公開リクエストで処理する。
- globやファイルパターンを外部入力から受け取る。

上記機能を導入する場合は、実装前に依存版と到達可能性を再評価する。

### WindowsとVercelのページ数差

Windowsローカルは248ページ、Vercel Linuxは247ページを生成する。差分はdraftの `/guides/engineer/production-modes` である。WindowsのContentlayer生成値に `draft\r` が残り、完全一致の除外を通過するためで、本番Vercelでは正しく非公開になる。基盤更新はブロックしないが、N-IE Labリニューアル統合前にfrontmatter値の改行・空白正規化を独立コミットで修正する。
