// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: `guides/qc/**/*.{md,mdx}`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    section: { type: "string" },
    tags: { type: "list", of: { type: "string" } },
    version: { type: "string", default: "1.0.0" },
    status: { type: "string", default: "published" },
    updatedAt: { type: "string" }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/guides/qc/${doc.slug}` }
  }
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide]
});
