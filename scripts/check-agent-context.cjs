'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
const budget = 3500; // Project policy for instructions loaded on every repository task.
const skillRoot = path.join(root, '.agents', 'skills');
const names = new Set();
const errors = [];

console.log(`AGENTS.md: ${[...agents].length} characters / ${agents.trimEnd().split(/\r?\n/).length} lines (budget: ${budget} characters)`);
if ([...agents].length > budget) errors.push('AGENTS.md exceeds the project character budget.');

let metadataCharacters = 0;
const directories = fs.existsSync(skillRoot)
  ? fs.readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];
for (const entry of directories) {
  const file = path.join(skillRoot, entry.name, 'SKILL.md');
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) {
    errors.push(`${entry.name}: missing YAML frontmatter`);
    continue;
  }
  const lines = frontmatter[1].split(/\r?\n/);
  const name = lines.find((line) => /^name:/.test(line))?.slice(5).trim();
  const at = lines.findIndex((line) => /^description:/.test(line));
  const initial = at >= 0 ? lines[at].slice('description:'.length).trim() : '';
  let description = initial;
  if (initial === '>' || initial === '|' || initial === '>-' || initial === '|-') {
    description = '';
    for (let i = at + 1; i < lines.length && /^\s/.test(lines[i]); i++) {
      description += `${lines[i].trim()} `;
    }
    description = description.trim();
  }
  if (!name || !description) errors.push(`${entry.name}: name and description are required`);
  if (name && names.has(name)) errors.push(`${entry.name}: duplicate skill name ${name}`);
  if (name) names.add(name);
  const bodyLines = source.slice(frontmatter[0].length).trimEnd().split(/\r?\n/).length;
  if (bodyLines > 500) errors.push(`${entry.name}: SKILL.md body exceeds 500 lines`);
  metadataCharacters += (name || '').length + description.length;
  console.log(`skill ${name || entry.name}: description ${description.length} characters / body ${bodyLines} lines`);
}
console.log(`Catalog metadata: ${metadataCharacters} characters across ${names.size} skills`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
}
