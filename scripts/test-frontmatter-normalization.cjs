const assert = require("node:assert/strict");
const test = require("node:test");

const {
  normalizeFrontmatterEnumValue,
  normalizeGuideStatus,
} = require("../src/lib/frontmatter-normalization.ts");

test("normalizes guide status across line endings and boundary whitespace", () => {
  assert.equal(normalizeGuideStatus("draft"), "draft");
  assert.equal(normalizeGuideStatus("draft\r"), "draft");
  assert.equal(normalizeGuideStatus("  draft\t"), "draft");
  assert.equal(normalizeGuideStatus("\uFEFFdraft"), "draft");
});

test("preserves valid and unknown enum values without coercion", () => {
  assert.equal(normalizeGuideStatus("published"), "published");
  assert.equal(normalizeGuideStatus("unexpected-status"), "unexpected-status");
});

test("uses the fallback only for an empty enum value", () => {
  assert.equal(normalizeGuideStatus(" \r\n"), "published");
  assert.equal(normalizeFrontmatterEnumValue("", "fallback"), "fallback");
});
