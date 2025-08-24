/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf7f1", // 淡いグリーン
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  // 念のためレイアウトに必要なクラスを保護
  safelist: [
    "grid","grid-cols-1","sm:grid-cols-2","lg:grid-cols-3","lg:grid-cols-2",
    "gap-4","gap-6","gap-8",
    "col-span-1","lg:col-span-2",
    "bg-white","bg-brand-50",
    "rounded-xl","rounded-2xl",
    "shadow","shadow-md","shadow-card",
    "p-4","p-6","p-8",
  ],
  plugins: [],
};
