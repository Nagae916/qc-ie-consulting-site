// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import fs from "fs";
import path from "path";
import cp from "child_process";

// 数式
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// ⬇ 追加：見出しスラッグ & 自動リンク & サニタイズ
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// 型相性を避けるため defaultSchema は hast-util-sanitize から
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";

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

// 文字列 → ISO（失敗時は ""）
function toIso(v: unknown): string {
  const s = safeString(v);
  if (!s) return "";
  const m = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`;
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : "";
}

// Git の最終コミット日時（ISO）を取得、ダメなら fs.mtime
function getLastUpdatedIso(relFromContentDir: string): string {
  try {
    const abs = path.join(process.cwd(), "content", relFromContentDir);
    const iso = cp.execSync(`git log -1 --format=%cI -- "${abs}"`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim();
    if (iso) return iso;
    const st = fs.statSync(abs);
    return new Date(st.mtimeMs).toISOString();
  } catch {
    try {
      const abs = path.join(process.cwd(), "content", relFromContentDir);
      const st = fs.statSync(abs);
      return new Date(st.mtimeMs).toISOString();
    } catch {
      return "";
    }
  }
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
    // frontmatter > Git > date の順
    updatedAtAuto: {
      type: "string",
      resolve: (doc) => {
        const fromFm = toIso((doc as any).updatedAt);
        if (fromFm) return fromFm;
        const fromGit = getLastUpdatedIso(doc._raw.sourceFilePath);
        if (fromGit) return fromGit;
        return toIso((doc as any).date);
      },
    },
  },
}));

// ⬇ rehype-sanitize の許可リスト拡張（KaTeX/見出し/コード）
const sanitizeSchema = (() => {
  const base: any = JSON.parse(JSON.stringify(defaultSchema));
  base.attributes ||= {};

  // 見出し id（rehype-slug）
  base.attributes["*"] = [...(base.attributes["*"] || []), "id"];

  // KaTeX の className
  const katexClass = ["className", /^katex(-\w+)?$/];
  base.attributes["span"] = [...(base.attributes["span"] || []), katexClass];
  base.attributes["div"] = [...(base.attributes["div"] || []), katexClass];

  // コードブロック（language-xxx）
  base.attributes["code"] = [...(base.attributes["code"] || []), ["className", /^language-/]];

  // 安全な外部リンク
  base.attributes["a"] = [
    ...(base.attributes["a"] || []),
    ["target", /^_blank$/],
    ["rel", /^(?:nofollow|noreferrer|noopener)(?:\s+(?:nofollow|noreferrer|noopener))*$/],
  ];

  return base;
})();

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: {
    // 数式 → KaTeX → 見出し → オートリンク → 最後にサニタイズ
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypeSanitize, sanitizeSchema],
    ],
  },
});
