/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 型エラーでCIを止めたい場合は false のまま推奨
  typescript: { ignoreBuildErrors: false },
  // Lintが未整備でも本番ビルドは通す（必要に応じて true→false に）
  eslint: { ignoreDuringBuilds: true }
};
module.exports = nextConfig;
