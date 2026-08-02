// next.config.js
/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,

  // 231件超のMDXを8GB級の開発環境でも安定して生成できるよう、ビルドワーカーを抑える。
  experimental: {
    cpus: 1,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

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
