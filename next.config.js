// next.config.js
const path = require('path');
const { withContentlayer } = require('next-contentlayer2');

const isDev = process.env.NODE_ENV !== 'production';

// --- CSP: Twitter埋め込みに必要な最小限を許可 ---
const makeCSP = () => {
  const TW_WIDGET = 'https://platform.twitter.com';
  const TW_SYND   = 'https://syndication.twitter.com';
  const TW_IMGS   = ['https://pbs.twimg.com', 'https://abs.twimg.com'];

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    // widgets.js とインラインstyleを許可（devは Next の都合で 'unsafe-eval' も）
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}${TW_WIDGET}`,
    `style-src 'self' 'unsafe-inline' ${TW_WIDGET}`,
    // 画像（Twitterの画像CDNを許可）
    `img-src 'self' data: blob: ${TW_IMGS.join(' ')}`,
    // API/XHR
    "connect-src 'self'",
    // 埋め込み<iframe>
    `frame-src 'self' ${TW_WIDGET} ${TW_SYND}`,
    // クリックジャッキング対策
    "frame-ancestors 'self'",
    // フォーム送信先制限
    "form-action 'self'",
  ].join('; ');
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'md', 'mdx'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },

  // ▼ ここが追加：CSPほかセキュリティヘッダ
  async headers() {
    const csp = makeCSP();
    return [
      {
        source: '/(.*)',
        headers: [
          // まずはレポートオンリーで試す場合は下行を有効化＆本番CSPはコメントアウト
          // { key: 'Content-Security-Policy-Report-Only', value: csp },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  async redirects() {
    const map = {
      'regression-anova': '/guides/qc/regression-anova',
      'stat-tests': '/guides/qc/stat-tests',
      'qc-seven-tools': '/guides/qc/qc-seven-tools',
      'new-qc-seven-tools': '/guides/qc/new-qc-seven-tools',
    };
    const items = Object.entries(map).map(([id, dest]) => ({
      source: `/guide/${id}`,
      destination: dest,
      permanent: true,
    }));
    items.push({ source: '/guide/:id', destination: '/guides/qc', permanent: false });
    return items;
  },
};

module.exports = withContentlayer(nextConfig);
