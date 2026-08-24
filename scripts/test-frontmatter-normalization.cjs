'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  isPublishedGuideStatus,
  normalizeFrontmatterBooleanValue,
  normalizeFrontmatterEnumValue,
  normalizeGuideStatus,
} = require('../src/lib/frontmatter-normalization.ts');
const { parseFrontmatterText } = require('./check-frontmatter.js');
const { inspectTextFormat } = require('./check-source-format.cjs');

function documentWith(lines, eol = '\n', body = '# Body\n') {
  return ['---', ...lines, '---', body].join(eol);
}

test('parses LF frontmatter through the same gray-matter and YAML boundary as Contentlayer', () => {
  const source = documentWith([
    'title: "Fixture"',
    'status: "published"',
    'featured: true',
    'draft: false',
    'layout: "editorial-learning"',
  ]);
  const parsed = parseFrontmatterText(source);
  assert.equal(parsed.data.status, 'published');
  assert.equal(parsed.data.featured, true);
  assert.equal(parsed.content, '# Body\n');
});

test('detects the CRLF terminal-scalar failure before Contentlayer can skip a document', () => {
  const source = documentWith(
    ['title: "Fixture"', 'status: "published"', 'layout: "editorial-learning"'],
    '\r\n',
    '# Body\r\n',
  );
  assert.equal(inspectTextFormat(Buffer.from(source)).hasCarriageReturn, true);
  assert.throws(() => parseFrontmatterText(source), /Unexpected scalar at node end/);
});

test('rejects a file-level BOM at the parser boundary', () => {
  const source = `\uFEFF${documentWith(['title: "Fixture"', 'status: published'])}`;
  assert.equal(inspectTextFormat(Buffer.from(source)).hasBom, true);
  assert.throws(() => parseFrontmatterText(source), /BOM is not allowed/);
});

test('normalizes known enum values only after YAML parsing', () => {
  const parsed = parseFrontmatterText(
    documentWith(['title: "Fixture"', 'status: "  draft\\t"']),
  );
  assert.equal(normalizeGuideStatus(parsed.data.status), 'draft');
  assert.equal(normalizeGuideStatus('draft\r'), 'draft');
  assert.equal(normalizeGuideStatus('\uFEFFdraft'), 'draft');
  assert.equal(normalizeGuideStatus('planned'), 'planned');
});

test('publishes only the explicit published status and preserves the missing-status default', () => {
  parseFrontmatterText(documentWith(['title: "Fixture"']));
  assert.equal(isPublishedGuideStatus(undefined), true);
  assert.equal(isPublishedGuideStatus('published'), true);
  assert.equal(isPublishedGuideStatus('draft'), false);
  assert.equal(isPublishedGuideStatus('unexpected-status'), false);
});

test('accepts booleans and rejects unknown boolean values', () => {
  parseFrontmatterText(documentWith(['title: "Fixture"', 'featured: true', 'draft: false']));
  assert.equal(normalizeFrontmatterBooleanValue('true\r'), true);
  assert.equal(normalizeFrontmatterBooleanValue(' false '), false);
  assert.throws(
    () => parseFrontmatterText(documentWith(['title: "Fixture"', 'featured: maybe'])),
    /Invalid frontmatter boolean/,
  );
});

test('rejects unknown status values instead of publishing them', () => {
  assert.equal(normalizeFrontmatterEnumValue('unexpected-status'), 'unexpected-status');
  assert.throws(
    () => parseFrontmatterText(documentWith(['title: "Fixture"', 'status: unexpected-status'])),
    /Invalid guide status/,
  );
});

test('rejects a missing closing YAML fence', () => {
  assert.throws(
    () => parseFrontmatterText('---\ntitle: "Fixture"\nstatus: published\n# Body\n'),
    /closing --- is missing/,
  );
});
