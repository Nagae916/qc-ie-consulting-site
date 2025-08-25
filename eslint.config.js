// eslint.config.js
// Flat Config (Next 14 でも利用可)
const next = require("eslint-config-next");

module.exports = [
  ...next,
  {
    rules: {
      // いつでもエイリアス利用を強制
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // pages/ から ../../src/components/... のような深い相対を禁止
            "../../../*",
            "../../src/*",
            "../src/*",
          ],
        },
      ],
      // 大文字小文字のミスを検知
      "import/no-unresolved": ["error", { caseSensitive: true }],
    },
  },
];
