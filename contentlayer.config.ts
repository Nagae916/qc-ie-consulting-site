// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  // QC/統計/技術士の3箱すべてを拾う
  filePathPattern: `guides/**/*.{md,mdx}`,
  contentType: "mdx",
  fields: {
    title:   { type: "string", required: true },
    slug:    { type: "string", required: true },  // URLの末尾
    exam:    { type: "string", required: true },  // "qc" | "stats" | "pe"
    section: { type: "string" },
    tags:    { type: "list", of: { type: "string" } },
    version: { type: "string", default: "1.0.0" },
    status:  { type: "string", default: "published" },
    updatedAt: { type: "string" }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/guides/${doc.exam}/${doc.slug}` }
  }
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide]
});
