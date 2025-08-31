// next.config.js
const path = require('path');
const { withContentlayer } = require('next-contentlayer2');

const isDev = process.env.NODE_ENV !== 'production';

const makeCSP = () => {
  const TW_WIDGET = 'https://platform.twitter.com';
  const TW_SYND = 'https://syndication.twitter.com';
  const TW_SYND_CDN = 'https://cdn.syndication.twimg.com';
  const TW_IMG = ['https://pbs.twimg.com', 'https://abs.twimg.com', 'https://ton.twimg.com'];
  const IG_FRAME = 'https://www.instagram.com'; // Instagram埋め込みを使う場合

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    // widgets.js + 必要に応じて dev の eval
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}${TW_WIDGET} ${TW_SYND_CDN}`,
    // ウィジェット内インラインstyle と twitter の ton.twimg.com を許可
    `style-src 'self' 'unsafe-inline' ${TW_WIDGET} https://ton.twimg.com`,
    // 画像（twitter系CDNと data/blob）
    `img-src 'self' data: blob: ${TW_IMG.join(' ')}`,
    // fetch/XHR（ウィジェットが syndication / platform / cdn に接続）
    `connect-src 'self' ${TW_WIDGET} ${TW_SYND} ${TW_SYND_CDN}`,
    // iframe 埋め込み先
    `frame-src 'self' ${TW_WIDGET} ${TW_SYND} https://twitter.com ${IG_FRAME}`,
    // フォント（ton にフォント有）
    `font-src 'self' https://ton.twimg.com data:`,
    "frame-ancestors 'self'",
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
  async headers() {
    const csp = makeCSP();
    return [
      {
        source: '/(.*)',
        headers: [
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
