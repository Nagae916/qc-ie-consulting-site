// next.config.js
const path = require("path");
const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 既存の @ エイリアスを維持
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  async redirects() {
    // 旧: /guide/[id] → 新: /guides/{exam}/{slug}
    const map = {
      "regression-anova": "/guides/stats/regression-anova",
      "stat-tests": "/guides/stats/stat-tests",
      "qc-seven-tools": "/guides/qc/qc-seven-tools",
      "new-qc-seven-tools": "/guides/qc/new-qc-seven-tools",
    };
    const items = Object.entries(map).map(([id, dest]) => ({
      source: `/guide/${id}`,
      destination: dest,
      permanent: true,
    }));
    // ワイルドカード（未登録IDはトップへ）
    items.push({
      source: "/guide/:id",
      destination: "/guides",
      permanent: false,
    });
    return items;
  },
};

module.exports = withContentlayer(nextConfig);
