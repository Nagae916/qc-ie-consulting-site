// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

const ALLOWED_EXAMS = ["qc", "stats", "pe"] as const;
type Exam = (typeof ALLOWED_EXAMS)[number];

function safeString(v: unknown, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : String(v ?? "").trim();
  return s || fallback;
}
function fromPath(parts: string[]) {
  const p = parts[0] === "guides" ? parts.slice(1) : parts;
  return { exam: safeString(p[0]), slug: safeString(p[p.length - 1]) };
}
function normalizeExam(v: unknown, pathExam: string): Exam {
  const e = safeString(v, pathExam);
  return (ALLOWED_EXAMS as readonly string[]).includes(e) ? (e as Exam) : "qc";
}
function normalizeSlug(v: unknown, pathSlug: string) {
  return safeString(v, pathSlug);
}
function normalizeTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter(Boolean).map((x) => safeString(x)).filter(Boolean);
  if (typeof v === "string")
    return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
  return [];
}

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx",
  filePathPattern: "guides/**/*.{md,mdx}",
  fields: {
    title: { type: "string", required: true },
    exam: { type: "string" },
    slug: { type: "string" },
    section: { type: "string" },
    description: { type: "string" },
    tags: { type: "json" }, // ← 受け口は緩く
    version: { type: "string", default: "1.0.0" },
    status: { type: "string", default: "published" },
    updatedAt: { type: "string" },
    date: { type: "date" }
  },
  computedFields: {
    exam: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { exam: pathExam } = fromPath(parts);
        return normalizeExam((doc as any).exam, pathExam);
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { slug: pathSlug } = fromPath(parts);
        return normalizeSlug((doc as any).slug, pathSlug);
      }
    },
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { exam: pathExam, slug: pathSlug } = fromPath(parts);
        const exam = normalizeExam((doc as any).exam, pathExam);
        const slug = normalizeSlug((doc as any).slug, pathSlug);
        return `/guides/${exam}/${slug}`;
      }
    },
    tags: {
      type: "json",
      resolve: (doc) => normalizeTags((doc as any).tags)
    }
  }
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: { remarkPlugins: [], rehypePlugins: [] }
});
