import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { evaluateWithJev, getJevProvider, hasJevCredentials, normalizeEvaluationResult, toGatewayQuestions, toTypeSafeQuestions } from "../client.mjs";
import { parseUnifiedDiff } from "../git-diff.mjs";
import { safeHookOutput } from "../hook-io.mjs";
import { createRetentionPacket, renderRetentionContext } from "../retention.mjs";
import { inspectTypeSafeSkill } from "../skill.mjs";
import { parseTranscriptJsonl } from "../transcript.mjs";

test("detects the project-local official TypeSafe skill", () => {
  const skill = inspectTypeSafeSkill(process.cwd());
  assert.equal(skill.configured, true);
  assert.equal(skill.source, "typesafe-ai/skills");
});

test("prefers direct TypeSafe credentials and retains Gateway fallback", () => {
  assert.equal(getJevProvider({ TYPESAFE_API_KEY: "test", AI_GATEWAY_API_KEY: "test" }), "typesafe");
  assert.equal(getJevProvider({ AI_GATEWAY_API_KEY: "test" }), "gateway");
  assert.equal(getJevProvider({}), null);
  assert.equal(hasJevCredentials({ JEV_API_KEY: "test" }), true);
});

test("adapts Noul questions across direct TypeSafe and AI Gateway providers", () => {
  const questions = { relevant: { type: "noul", instructions: "Is this relevant?" } };
  assert.equal(toTypeSafeQuestions(questions).relevant.type, "noul");
  assert.equal(toGatewayQuestions(questions).relevant.type, "boolean");
  const result = normalizeEvaluationResult({ answers: { relevant: { type: "noul", noul: 0.82 } } }, questions);
  assert.equal(result.answers.relevant.probability, 0.82);
});

test("uses the TypeSafe SDK for direct Noul evaluation", async (context) => {
  let received;
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    received = { authorization: request.headers.authorization, body: JSON.parse(body) };
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({
      model: "jev-test",
      answers: { relevant: { type: "noul", noul: 0.82 } },
      usage: { input_tokens: 12, output_tokens: 1 },
    }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  context.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

  const address = server.address();
  const result = await evaluateWithJev({
    state: "test state",
    questions: { relevant: { type: "noul", instructions: "Is this relevant?" } },
    timeoutMs: 1000,
    env: {
      TYPESAFE_API_KEY: "test-key",
      TYPESAFE_BASE_URL: `http://127.0.0.1:${address.port}`,
      TYPESAFE_DEFAULT_MODEL: "jev-test",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.provider, "typesafe");
  assert.equal(result.result.answers.relevant.probability, 0.82);
  assert.equal(received.authorization, "Bearer test-key");
  assert.equal(received.body.model, "jev-test");
  assert.equal(received.body.questions.relevant.type, "noul");
});

test("parses changed files and classifies tests", () => {
  const files = parseUnifiedDiff([
    "diff --git a/src/a.ts b/src/a.ts",
    "--- a/src/a.ts",
    "+++ b/src/a.ts",
    "@@ -1 +1 @@",
    "-old",
    "+new",
    "diff --git a/tests/a.test.ts b/tests/a.test.ts",
    "--- a/tests/a.test.ts",
    "+++ b/tests/a.test.ts",
    "@@ -1 +1 @@",
    "-old",
    "+new",
  ].join("\n"));
  assert.equal(files.length, 2);
  assert.equal(files[0].path, "src/a.ts");
  assert.equal(files[1].isTest, true);
});

test("collectable diff parsing keeps patch text bounded", () => {
  const files = parseUnifiedDiff([
    "diff --git a/src/a.ts b/src/a.ts",
    "--- a/src/a.ts",
    "+++ b/src/a.ts",
    "@@ -0,0 +1 @@",
    `+${"x".repeat(100)}`,
  ].join("\n"), 80);
  assert.equal(files[0].truncated, true);
  assert.ok(files[0].patch.length < 110);
});

test("pairs nested Codex function calls with results", () => {
  const transcript = [
    JSON.stringify({ type: "response_item", payload: { type: "function_call", call_id: "call_1", name: "exec_command", arguments: "{\\\"cmd\\\":\\\"npm test\\\"}" } }),
    JSON.stringify({ type: "response_item", payload: { type: "function_call_output", call_id: "call_1", output: "all tests passed" } }),
  ].join("\n");
  const result = parseTranscriptJsonl(transcript);
  assert.equal(result.candidates.length, 1);
  assert.equal(result.candidates[0].tool, "exec_command");
  assert.equal(result.candidates[0].result, "all tests passed");
});

test("transcript parser fails open on malformed lines", () => {
  const result = parseTranscriptJsonl("not-json\n{}\n");
  assert.deepEqual(result.candidates, []);
  assert.deepEqual(result.warnings, ["line_1_invalid_json"]);
});

test("retention context respects the character ceiling", () => {
  const context = renderRetentionContext([
    { id: "a", tool: "read", input: "x", result: "A".repeat(200), forcedKeep: true, order: 1 },
    { id: "b", tool: "read", input: "y", result: "B".repeat(200), forcedKeep: false, order: 2 },
  ], 350);
  assert.ok(context.length <= 350);
  assert.match(context, /read \(a\)/);
});

test("hook output always continues by default", () => {
  assert.deepEqual(safeHookOutput({ systemMessage: "ok" }), { continue: true, systemMessage: "ok" });
});

test("retention only marks a result discardable above the conservative threshold", async () => {
  const candidates = Array.from({ length: 6 }, (_, index) => ({
    id: `call_${index}`,
    tool: "lookup",
    input: `query ${index}`,
    result: `routine result ${index}`,
    order: index,
  }));
  const packet = await createRetentionPacket({
    sessionId: "test",
    trigger: "manual",
    candidates,
    evaluate: async ({ questions }) => ({
      ok: true,
      result: {
        answers: Object.fromEntries(Object.keys(questions).map((key, index) => [key, { probability: index === 0 ? 0.95 : 0.94 }])),
      },
    }),
  });

  assert.equal(packet.metrics.dropCandidateCount, 1);
  assert.equal(packet.metrics.forcedKeepCount, 4);
  assert.equal(packet.decisions.find((item) => item.id === "call_0").decision, "drop_candidate");
  assert.equal(packet.decisions.find((item) => item.id === "call_1").decision, "keep");
});
