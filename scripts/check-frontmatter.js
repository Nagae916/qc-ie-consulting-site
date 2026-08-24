'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yaml = require('yaml');

const {
  normalizeFrontmatterBooleanValue,
  normalizeGuideStatus,
} = require('../src/lib/frontmatter-normalization.ts');

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'guides');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(md|mdx)$/.test(entry.name) ? [full] : [];
  });
}

function hasClosingFence(text) {
  const lines = text.split('\n');
  return lines.slice(1).some((line) => line.replace(/\r$/, '') === '---');
}

function parseFrontmatterText(text, source = '<memory>') {
  if (text.charCodeAt(0) === 0xfeff) {
    throw new Error(`${source}: UTF-8 BOM is not allowed before the opening frontmatter fence`);
  }
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) {
    throw new Error(`${source}: frontmatter must start with ---`);
  }
  if (!hasClosingFence(text)) {
    throw new Error(`${source}: frontmatter closing --- is missing`);
  }

  const parsed = matter(text, {
    engines: {
      // Keep this parser identical to Contentlayer2's source-files boundary.
      yaml: (value) => yaml.parse(value),
    },
  });

  if (typeof parsed.data.title !== 'string' || !parsed.data.title.trim()) {
    throw new Error(`${source}: required key "title" is missing`);
  }

  normalizeGuideStatus(parsed.data.status);
  normalizeFrontmatterBooleanValue(parsed.data.featured);
  normalizeFrontmatterBooleanValue(parsed.data.draft);

  return parsed;
}

function checkFile(file) {
  return parseFrontmatterText(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file));
}

function main() {
  const files = walk(CONTENT_DIR);
  const errors = [];

  for (const file of files) {
    try {
      checkFile(file);
    } catch (error) {
      errors.push({ file, error });
    }
  }

  if (errors.length > 0) {
    console.error(`Invalid frontmatter in ${errors.length} document(s).`);
    for (const { file, error } of errors) {
      console.error(`- ${path.relative(ROOT, file)}: ${error.message}`);
    }
    process.exit(1);
  }

  console.log(`Frontmatter OK: ${files.length} document(s) checked with the Contentlayer parser.`);
}

if (require.main === module) main();

module.exports = { checkFile, hasClosingFence, parseFrontmatterText, walk };
