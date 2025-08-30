// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

// 正規化後に使う “正解” キー
const CANON_EXAMS = ["qc", "stat", "engineer"] as const;
type Exam = (typeof CANON_EXAMS)[number];

// 表記ゆれ→正規キー のエイリアス表
const EXAM_ALIAS: Record<string, Exam> = {
  // 品質管理
  qc: "qc",
  quality: "qc",

  // 統計
  stat: "stat",
  stats: "stat",
  statistics: "stat",

  // 技術士
  engineer: "engineer",
  pe: "engineer",
  eng: "engineer",
};

function safeString(v: unknown, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : String(v ?? "").trim();
  return s || fallback;
}

// content/guides/<exam>/<slug>.mdx などのパスから候補を取る
function fromPath(parts: string[]) {
  const p = parts[0] === "guides" ? parts.slice(1) : parts;
  return { exam: safeString(p[0]), slug: safeString(p[p.length - 1]) };
}

// exam の最終決定ロジック：frontmatter → パス → 既知不明時は qc
function normalizeExam(front: unknown, pathExam: string): Exam {
  const f = EXAM_ALIAS[safeString(front)] as Exam | undefined;
  if (f) return f;

  const p = EXAM_ALIAS[safeString(pathExam)] as Exam | undefined;
  if (p) return p;

  // ここまで来たら未知。安全側で qc（※ここを変えたいなら "throw" でも可）
  return "qc";
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
