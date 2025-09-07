// next.config.js
/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,

  // MD/MDX は「ページ」化せず Contentlayer 経由で読むため、拡張子は TS/TSX のみに限定
  pageExtensions: ['ts', 'tsx'],

  async rewrites() {
    return [
      // 将来、ツール用の固定パスを足す場合だけここに追記
      // 例）{ source: '/guides/tools/:name', destination: '/tools/:name' },
    ];
  },
};

// next-contentlayer が入っていれば使う（無ければそのまま）— @next/mdx 依存は廃止
let withContentlayer = (cfg) => cfg;
try {
  ({ withContentlayer } = require('next-contentlayer'));
} catch (_) {}

module.exports = withContentlayer(baseConfig);
