// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: `guides/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" } },
    version: { type: "string", default: "1.0.0" },
    status: { type: "string", default: "draft" },
    updatedAt: { type: "string" },
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/guides/${doc.slug}` },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
});
