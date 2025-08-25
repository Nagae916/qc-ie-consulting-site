// next.config.js
const path = require("path");
const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  async redirects() {
    const map = {
      "regression-anova": "/guides/qc/regression-anova",
      "stat-tests": "/guides/qc/stat-tests",
      "qc-seven-tools": "/guides/qc/qc-seven-tools",
      "new-qc-seven-tools": "/guides/qc/new-qc-seven-tools",
    };
    const items = Object.entries(map).map(([id, dest]) => ({
      source: `/guide/${id}`,
      destination: dest,
      permanent: true,
    }));
    // 未登録IDは QCトップへ退避
    items.push({ source: "/guide/:id", destination: "/guides/qc", permanent: false });
    return items;
  },
};

module.exports = withContentlayer(nextConfig);
