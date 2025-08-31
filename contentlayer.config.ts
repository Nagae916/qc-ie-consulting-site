// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

const CANONICAL_EXAMS = ["qc", "stat", "engineer"] as const;
type Exam = (typeof CANONICAL_EXAMS)[number];

function safeString(v: unknown, fb = ""): string {
  const s = typeof v === "string" ? v.trim() : String(v ?? "").trim();
  return s || fb;
}
function fromPath(parts: string[]) {
  const p = parts[0] === "guides" ? parts.slice(1) : parts;
  return { exam: safeString(p[0]), slug: safeString(p[p.length - 1]) };
}
function normalizeExam(v: unknown, pathExam: string): Exam {
  const raw = safeString(v, pathExam).toLowerCase();
  const e =
    raw === "qc" ? "qc" :
    raw === "stat" || raw === "stats" || raw === "statistics" ? "stat" :
    raw === "engineer" || raw === "pe" || raw === "eng" ? "engineer" :
    "qc";
  return e as Exam;
}
function normalizeSlug(v: unknown, pathSlug: string) {
  return safeString(v, pathSlug);
}
function normalizeTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter(Boolean).map((x) => safeString(x)).filter(Boolean);
  if (typeof v === "string") return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
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
    tags: { type: "json" },
    version: { type: "string", default: "1.0.0" },
    status: { type: "string", default: "published" },
    updatedAt: { type: "string" },
    date: { type: "date" },
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
  mdx: { remarkPlugins: [], rehypePlugins: [] },
});
