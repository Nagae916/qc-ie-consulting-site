const assert = require("node:assert/strict");
const test = require("node:test");

const {
  isPublishedGuideStatus,
  normalizeFrontmatterEnumValue,
  normalizeGuideStatus,
} = require("../src/lib/frontmatter-normalization.ts");

test("normalizes guide status across line endings and boundary whitespace", () => {
  assert.equal(normalizeGuideStatus("draft"), "draft");
  assert.equal(normalizeGuideStatus("draft\r"), "draft");
  assert.equal(normalizeGuideStatus("  draft\t"), "draft");
  assert.equal(normalizeGuideStatus("\uFEFFdraft"), "draft");
});

test("accepts known guide status values and rejects unknown values", () => {
  assert.equal(normalizeGuideStatus("published"), "published");
  assert.equal(normalizeGuideStatus("planned"), "planned");
  assert.equal(normalizeFrontmatterEnumValue("unexpected-status"), "unexpected-status");
  assert.throws(() => normalizeGuideStatus("unexpected-status"), /Invalid guide status/);
});

test("uses the fallback only for an empty enum value", () => {
  assert.equal(normalizeGuideStatus(" \r\n"), "published");
  assert.equal(normalizeFrontmatterEnumValue("", "fallback"), "fallback");
});

test("publishes only the explicit published status", () => {
  assert.equal(isPublishedGuideStatus("published"), true);
  assert.equal(isPublishedGuideStatus(undefined), true);
  assert.equal(isPublishedGuideStatus("draft"), false);
  assert.equal(isPublishedGuideStatus("  draft  "), false);
  assert.equal(isPublishedGuideStatus("draft\r"), false);
  assert.equal(isPublishedGuideStatus("\uFEFFdraft"), false);
  assert.equal(isPublishedGuideStatus("planned"), false);
  assert.equal(isPublishedGuideStatus("unexpected-status"), false);
});
