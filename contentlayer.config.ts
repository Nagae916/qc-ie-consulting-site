// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: `guides/qc/**/*.{md,mdx}`, // QC配下だけを見る
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug:  { type: "string", required: true }, // URL末尾（例: "qc-seven-tools"）
    section: { type: "string", required: false }, // 分野/チャプター名
    tags:  { type: "list", of: { type: "string" } },
    version: { type: "string", default: "1.0.0" },
    status:  { type: "string", default: "published" }, // draft/published
    updatedAt: { type: "string" },
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/guides/qc/${doc.slug}` },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
});
