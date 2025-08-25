// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: `guides/**/*.{md,mdx}`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug:  { type: "string", required: true },         // URL末尾
    exam:  { type: "string", required: true },          // "qc" | "stats" | "pe"
    section: { type: "string", required: false },       // 分野/章
    tags:  { type: "list", of: { type: "string" } },
    version: { type: "string", default: "1.0.0" },
    status:  { type: "string", default: "published" },  // draft/published
    updatedAt: { type: "string" },
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/guides/${doc.exam}/${doc.slug}` },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
});
