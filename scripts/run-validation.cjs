'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const mode = process.argv[2] || 'ci';
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error('run-validation must be started through npm.');
  process.exit(1);
}
if (!['ci', 'cross-platform'].includes(mode)) {
  console.error(`Unknown validation mode: ${mode}`);
  process.exit(1);
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function snapshot() {
  const files = git(['ls-files', '-z']).split('\0').filter(Boolean);
  const hashes = new Map();
  for (const file of files) {
    const absolute = path.join(process.cwd(), file);
    if (!fs.existsSync(absolute)) {
      hashes.set(file, '<missing>');
      continue;
    }
    hashes.set(file, crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex'));
  }
  return {
    hashes,
    status: git(['status', '--porcelain=v1', '--untracked-files=all']),
  };
}

function compareSnapshots(before, after) {
  const changed = [];
  for (const [file, hash] of before.hashes) {
    if (after.hashes.get(file) !== hash) changed.push(file);
  }
  if (changed.length || before.status !== after.status) {
    console.error('Validation changed the working tree.');
    if (changed.length) console.error(`Tracked byte changes: ${changed.join(', ')}`);
    if (before.status !== after.status) {
      console.error(`Before status:\n${before.status || '<clean>'}`);
      console.error(`After status:\n${after.status || '<clean>'}`);
    }
    process.exit(1);
  }
  console.log(`Tracked source snapshot unchanged (${before.hashes.size} files).`);
}

function runScript(script, capture = false) {
  console.log(`\n> npm run ${script}`);
  const result = spawnSync(process.execPath, [npmCli, 'run', script], {
    cwd: process.cwd(),
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  });
  if (capture) {
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
  }
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  return `${result.stdout || ''}\n${result.stderr || ''}`;
}

const before = snapshot();

for (const script of [
  'test:frontmatter',
  'check:source-format',
  'check:frontmatter',
  'check:mdx-safety',
  'check:engineer-exams',
]) {
  runScript(script);
}

if (mode === 'cross-platform') {
  for (const script of [
    'gen',
    'check:generated',
    'check:dup',
    'check:audit',
    'check:knowledge-map',
  ]) {
    runScript(script);
  }
}

if (mode === 'ci') {
  for (const script of [
    'lint',
    'check:routes',
  ]) {
    runScript(script);
  }

  const buildOutput = runScript('build:next', true);
  const pageMatches = [...buildOutput.matchAll(/Generating static pages \((?:\d+\/)?(\d+)\)/g)];
  const pageCount = pageMatches.length ? Number(pageMatches.at(-1)[1]) : NaN;
  if (pageCount !== 266) {
    console.error(`Expected 266 generated static pages, received ${String(pageCount)}.`);
    process.exit(1);
  }

  const guideRouteLine = buildOutput
    .split(/\r?\n/)
    .find((line) => line.includes('/guides/[exam]/[slug]'));
  const guideRouteSizes = guideRouteLine ? [...guideRouteLine.matchAll(/([\d.]+)\s*kB/g)] : [];
  const guideFirstLoadKb = guideRouteSizes.length >= 2 ? Number(guideRouteSizes[1][1]) : NaN;
  if (!Number.isFinite(guideFirstLoadKb) || guideFirstLoadKb > 146) {
    console.error(`Guide First Load JS baseline exceeded or unreadable: ${String(guideFirstLoadKb)} kB.`);
    process.exit(1);
  }

  const reviewWarning = /Warning: data for page[^\n]*(?:2026-required-i-2|2026-ii-1-4|2026-ii-2-2|2026-iii-1)/i;
  if (reviewWarning.test(buildOutput)) {
    console.error('A 2026 review page emitted a new page-data warning.');
    process.exit(1);
  }

  for (const script of [
    'check:generated',
    'typecheck',
    'check:dup',
    'check:audit',
    'check:knowledge-map',
    'check:build-output',
  ]) {
    runScript(script);
  }
  console.log(`Build baseline OK: staticPages=${pageCount}, guideFirstLoadJs=${guideFirstLoadKb}kB.`);
}

compareSnapshots(before, snapshot());
