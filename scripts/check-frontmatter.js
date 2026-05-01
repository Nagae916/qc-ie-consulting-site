const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "guides");
const REQUIRED = ["title"];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(md|mdx)$/.test(entry.name) ? [full] : [];
  });
}

function parseFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") {
    return { ok: false, error: "frontmatter must start with ---" };
  }

  const end = lines.indexOf("---", 1);
  if (end === -1) {
    return { ok: false, error: "frontmatter closing --- is missing" };
  }

  const data = {};
  const fmLines = lines.slice(1, end);
  for (let i = 0; i < fmLines.length; i += 1) {
    const raw = fmLines[i];
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.+)$/);
    if (!match) {
      return { ok: false, error: `invalid frontmatter line ${i + 2}: ${raw}` };
    }

    const key = match[1];
    const value = match[2].trim();
    if (!value) {
      return { ok: false, error: `empty value for "${key}" at line ${i + 2}` };
    }
    if (value.includes("\u201C") || value.includes("\u201D") || value.includes("\uFF1A")) {
      return { ok: false, error: `smart quote or full-width colon at line ${i + 2}` };
    }
    data[key] = value;
  }

  for (const key of REQUIRED) {
    if (!data[key]) {
      return { ok: false, error: `required key "${key}" is missing` };
    }
  }

  return { ok: true };
}

const files = walk(CONTENT_DIR);
const errors = files
  .map((file) => ({ file, result: parseFrontmatter(file) }))
  .filter(({ result }) => !result.ok);

if (errors.length > 0) {
  console.error(`Invalid frontmatter in ${errors.length} document(s).`);
  for (const { file, result } of errors) {
    console.error(`- ${path.relative(ROOT, file)}: ${result.error}`);
  }
  process.exit(1);
}

console.log(`Frontmatter OK: ${files.length} document(s) checked.`);
