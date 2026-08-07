/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/guides/qc/how-to-set-quality-standards.mdx",
    "./content/guides/qc/third-party-testing-validity.mdx",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9f2", // 例: 背景の淡いグリーン
        },
      },
    },
  },
  plugins: [],
};
