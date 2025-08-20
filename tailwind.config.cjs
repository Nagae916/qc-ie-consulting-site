/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f1faf5",
          100: "#e6f6ee",
          200: "#dff1e6",  // 基調（淡いグリーン）
          300: "#c8e8d6",
          400: "#9fd6b8",
          500: "#73c49a",
          600: "#4aa87b",
          700: "#2f8d62",
          800: "#1f6f4f",
          900: "#0f3d2e",  // 見出し濃色
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(16, 94, 73, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
