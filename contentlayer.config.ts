// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

/**
 * 期待するパス例:
 *   content/guides/qc/pareto.mdx
 *   content/guides/stats/t-test.mdx
 *   content/guides/pe/section/foo.mdx  などネストも許容
 *
 * front-matter に exam / slug が無い場合でも、パスから自動抽出します。
 * （再発・出戻り防止）
 */
export const Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  // QC/統計/技術士など「guides」配下をすべて拾う
  filePathPattern: "guides/**/*.{md,mdx}",

  fields: {
    // 明示されていれば尊重。無ければパスから算出（computedFieldsで上書き）
    title: { type: "string", required: true },
    slug: { type: "string", required: false },
    exam: { type: "string", required: false }, // "qc" | "stats" | "pe" など
    section: { type: "string" },
    description: { type: "string" },
    tags: { type: "list", of: { type: "string" } },
    version: { type: "string", default: "1.0.0" },
    status: { type: "string", default: "published" },
    updatedAt: { type: "string" },
    date: { type: "date", required: false }
  },

  computedFields: {
    // パスから exam / slug を安全に抽出（front-matter があればそちらを優先）
    exam: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/"); // e.g. ["guides","qc","pareto"]
        // "guides" を除去
        const idx = parts[0] === "guides" ? 1 : 0;
        const fromPath = parts[idx] ?? "";
        return (doc as any).exam && String((doc as any).exam).trim() !== ""
          ? String((doc as any).exam)
          : fromPath;
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/"); // e.g. ["guides","qc","pareto"]
        // "guides" 以降の最後の要素を slug に
        const fromPath = (() => {
          const p = parts[0] === "guides" ? parts.slice(1) : parts;
          return p[p.length - 1] ?? "";
        })();
        return (doc as any).slug && String((doc as any).slug).trim() !== ""
          ? String((doc as any).slug)
          : fromPath;
      }
    },
    url: {
      type: "string",
      resolve: (doc) => {
        // 上で算出した exam/slug を使って URL を確定
        const exam =
          (doc as any).exam && String((doc as any).exam).trim() !== ""
            ? String((doc as any).exam)
            : (() => {
                const parts = doc._raw.flattenedPath.split("/");
                const idx = parts[0] === "guides" ? 1 : 0;
                return parts[idx] ?? "";
              })();

        const slug =
          (doc as any).slug && String((doc as any).slug).trim() !== ""
            ? String((doc as any).slug)
            : (() => {
                const parts = doc._raw.flattenedPath.split("/");
                const p = parts[0] === "guides" ? parts.slice(1) : parts;
                return p[p.length - 1] ?? "";
              })();

        return `/guides/${exam}/${slug}`;
      }
    }
  }
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: {
    remarkPlugins: [
      // 必要なら追加: remarkGfm など
    ],
    rehypePlugins: [
      // 必要なら追加
    ]
  }
});
