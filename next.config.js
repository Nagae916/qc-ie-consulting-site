// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // Markdown拡張と数式（KaTeX）をMDXに統合
    remarkPlugins: [require('remark-gfm'), require('remark-math')],
    rehypePlugins: [require('rehype-katex')],
  },
});

const { withContentlayer } = require('next-contentlayer');

module.exports = withContentlayer(
  withMDX({
    // .md/.mdx もページ拡張として扱う
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

    // MDXのRust実装を有効化（ビルド安定＆高速）
    experimental: { mdxRs: true },

    reactStrictMode: true,

    // ルーティングは /pages/guides/[exam]/[slug].tsx に委譲（固定方針）
    async rewrites() {
      return [
        // 将来、ツール用の固定パスを足す場合だけここに追記
        // 例）{ source: '/guides/tools/:name', destination: '/tools/:name' },
      ];
    },
  })
);
