// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

/** --------------------------------------------------------------------------------
 *  方針
 *  - パス例: content/guides/qc/pareto.mdx, content/guides/stats/t-test.mdx
 *  - front-matter に exam/slug/tags が無くても「生成時」に補完・正規化
 *  - exam は許可リスト外なら "qc" にフォールバック（事故らない）
 *  - tags は string | string[] | undefined を string[] に正規化（.map例外を撲滅）
 * -------------------------------------------------------------------------------- */

const ALLOWED_EXAMS = ["qc", "stats", "pe"] as const;
type Exam = (typeof ALLOWED_EXAMS)[number];

function safeString(v: unknown, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : String(v ?? "").trim();
  return s || fallback;
}

function fromPath(parts: string[]): { exam: string; slug: string } {
  // flattenedPath は "guides/qc/pareto" のような形
  const p = parts[0] === "guides" ? parts.slice(1) : parts;
  const exam = safeString(p[0]);
  const slug = safeString(p[p.length - 1]);
  return { exam, slug };
}

function normalizeExam(v: unknown, fromPathExam: string): Exam {
  const e = safeString(v, fromPathExam) as Exam;
  return (ALLOWED_EXAMS as readonly string[]).includes(e) ? (e as Exam) : "qc";
}

function normalizeSlug(v: unknown, fromPathSlug: string): string {
  return safeString(v, fromPathSlug);
}

function normalizeTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter(Boolean).map((x) => safeString(x)).filter(Boolean);
  if (typeof v === "string") {
    return v
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  // 「content/」直下の guides 配下をすべて拾う
  filePathPattern: "guides/**/*.{md,mdx}",
  fields: {
    title: { type: "string", required: true },

    // 明示があれば採用。無ければパスから補完（computedFieldsで最終確定）
    exam: { type: "string", required: false }, // "qc" | "stats" | "pe"
    slug: { type: "string", required: false },

    section: { type: "string" },
    description: { type: "string" },

    // 運用を楽にするため list ではなく json として受け、生成時に正規化
    tags: { type: "json" },

    version: { type: "string", default: "1.0.0" },
    status: { type: "string", default: "published" },
    updatedAt: { type: "string" },
    date: { type: "date", required: false },
  },
  computedFields: {
    exam: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { exam: pathExam } = fromPath(parts);
        return normalizeExam((doc as any).exam, pathExam);
      },
    },
    slug: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { slug: pathSlug } = fromPath(parts);
        return normalizeSlug((doc as any).slug, pathSlug);
      },
    },
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { exam: pathExam, slug: pathSlug } = fromPath(parts);
        const exam = normalizeExam((doc as any).exam, pathExam);
        const slug = normalizeSlug((doc as any).slug, pathSlug);
        return `/guides/${exam}/${slug}`;
      },
    },
    tags: {
      type: "json",
      resolve: (doc) => normalizeTags((doc as any).tags),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
