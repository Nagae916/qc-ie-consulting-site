// next.config.js
/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,

  // MD/MDX はページ化せず Contentlayer 経由で読むため、拡張子は TS/TSX のみに限定
  pageExtensions: ['ts', 'tsx'],

  async rewrites() {
    return [
      // 将来、ツール用の固定パスを足す場合だけここに追記
      // 例）{ source: '/guides/tools/:name', destination: '/tools/:name' },
    ];
  },
};

// ★ 固定：contentlayer2 系を使用（next-contentlayer → next-contentlayer2）
let withContentlayer = (cfg) => cfg;
try {
  ({ withContentlayer } = require('next-contentlayer2'));
} catch (_) {
  // 依存が無い環境でもビルドを壊さない（そのまま baseConfig を返す）
}

module.exports = withContentlayer(baseConfig);
