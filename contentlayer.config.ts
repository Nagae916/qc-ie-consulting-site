// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import fs from "fs";
import path from "path";
import cp from "child_process";

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
  // 既に YYYY-MM-DD なら ISO に近い形式とみなし UTC 00:00 を採用
  const m = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`;
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : "";
}

// Git の最終コミット日時（ISO）を取得、ダメなら fs.mtime を返す
function getLastUpdatedIso(relFromContentDir: string): string {
  try {
    // コンテンツの実ファイルパス（content/ 配下）
    const abs = path.join(process.cwd(), "content", relFromContentDir);
    // Git 履歴（浅いクローンでも最新コミット分は取れる想定。無ければ catch）
    const iso = cp
      .execSync(`git log -1 --format=%cI -- "${abs}"`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    if (iso) return iso;
    // フォールバック：ファイルの mtime
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
    updatedAt: { type: "string" }, // ← frontmatter があれば優先
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
    // ★ 自動更新日：frontmatter > Git > date の順で解決（ISO）
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

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: { remarkPlugins: [], rehypePlugins: [] },
});
