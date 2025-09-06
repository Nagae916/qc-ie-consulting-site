// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// 必要に応じてフィールドは増減してください（既存の frontmatter を壊さないように緩めに定義）
export const Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  // 例: content/guides/** 配下の .md / .mdx を対象
  filePathPattern: "guides/**/*.{md,mdx}",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    exam: { type: "string", required: false },        // "qc" | "stat" | "engineer" 想定（緩めに文字列）
    status: { type: "string", required: false },      // "draft" | "published" など
    section: { type: "string", required: false },
    version: { type: "string", required: false },
    updatedAt: { type: "string", required: false },
    date: { type: "string", required: false },
    slug: { type: "string", required: false },        // frontmatter で指定があれば利用（任意）
    url: { type: "string", required: false },         // frontmatter で明示 URL を持つ場合用（任意）
  },
  // 必要なら computedFields を追加してください（現状は触らずに安全運用）
  computedFields: {},
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: {
    // ★ 数式（$...$ / $$...$$）をサポート
    remarkPlugins: [remarkMath],
    // ★ KaTeX でビルド時に静的レンダ（CSP安全 / クライアントJS不要）
    rehypePlugins: [rehypeKatex],
  },
});
