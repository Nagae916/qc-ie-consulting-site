// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

// ここを正規化：qc / stat / engineer に統一
const ALLOWED_EXAMS = ["qc", "stat", "engineer"] as const;
type Exam = (typeof ALLOWED_EXAMS)[number];

const toStr = (v: unknown) => String(v ?? "").trim().toLowerCase();

function fromPath(parts: string[]) {
  const p = parts[0] === "guides" ? parts.slice(1) : parts;
  const exam = toStr(p[0]);
  const slug = toStr(p[p.length - 1]);
  return { exam, slug };
}

function normalizeExam(v: unknown, pathExam: string): Exam {
  const s = toStr(v) || toStr(pathExam);
  // 表記ゆれ吸収
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return "qc"; // フォールバック
}

function normalizeSlug(v: unknown, pathSlug: string) {
  return toStr(v) || toStr(pathSlug);
}

function normalizeTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(toStr).filter(Boolean);
  if (typeof v === "string") return v.split(/[,\s]+/).map(toStr).filter(Boolean);
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
