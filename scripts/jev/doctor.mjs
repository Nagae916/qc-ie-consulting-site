import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getJevProvider, hasDirectTypeSafeCredentials } from "./client.mjs";
import { inspectTypeSafeSkill } from "./skill.mjs";

const root = process.cwd();
const codexExecutable = path.join(root, "node_modules", "@openai", "codex", "bin", "codex.js");
const hooksPath = path.join(root, ".codex", "hooks.json");
const hooks = inspectHooks(hooksPath);
const skill = inspectTypeSafeSkill(root);
const codexVersion = runCodex(["--version"]);
const codexAuth = runCodex(["login", "status"]);
const jevProvider = getJevProvider();
const evaluationReady = Boolean(jevProvider);
const routerReady = hasDirectTypeSafeCredentials();

const report = {
  schemaVersion: 2,
  ready: Boolean(codexVersion.ok && codexAuth.ok && hooks.ok && skill.configured),
  codex: {
    installed: codexVersion.ok,
    version: codexVersion.output || null,
    authenticated: codexAuth.ok,
    authStatus: codexAuth.output || (codexAuth.ok ? "authenticated" : "not configured"),
  },
  hooks: {
    configured: hooks.ok,
    events: hooks.events,
    trust: "confirm_in_codex_with_/hooks",
  },
  skill,
  jev: {
    provider: jevProvider,
    review: evaluationReady ? `ready_via_${jevProvider}` : "needs_typesafe_or_ai_gateway_credential",
    retention: evaluationReady ? `ready_via_${jevProvider}` : "shadow_without_evaluation",
    router: routerReady ? "ready" : "codex_fallback_without_routing",
  },
  safeFallback: true,
};

if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  const rows = [
    [report.codex.installed, `Codex CLI: ${report.codex.version || "not installed"}`],
    [report.codex.authenticated, `Codex authentication: ${report.codex.authStatus || "not configured"}`],
    [report.skill.configured, `TypeSafe skill: ${report.skill.name || "not installed"}`],
    [report.hooks.configured, `Project hooks: ${report.hooks.events.join(", ") || "invalid"}`],
  ];
  process.stdout.write("Jev / Codex readiness\n\n");
  for (const [ok, message] of rows) process.stdout.write(`[${ok ? "ready" : "action"}] ${message}\n`);
  process.stdout.write(`[action] Hook trust: start Codex and confirm this repository with /hooks\n`);
  process.stdout.write(`[${evaluationReady ? "ready" : "action"}] Review / Retention: ${report.jev.review}\n`);
  process.stdout.write(`[${routerReady ? "ready" : "action"}] Router: ${report.jev.router}\n`);
  process.stdout.write("\nMissing credentials never block normal Codex or native compaction.\n");
}

if (!report.ready) process.exitCode = 1;

function runCodex(args) {
  if (!existsSync(codexExecutable)) return { ok: false, output: "" };
  try {
    const output = execFileSync(process.execPath, [codexExecutable, ...args], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    return { ok: true, output };
  } catch (error) {
    const output = `${error.stdout || ""}\n${error.stderr || ""}`.trim();
    return { ok: false, output };
  }
}

function inspectHooks(filePath) {
  try {
    const value = JSON.parse(readFileSync(filePath, "utf8"));
    const events = Object.keys(value?.hooks || {});
    const required = ["PreCompact", "SessionStart"];
    return { ok: required.every((event) => events.includes(event)), events };
  } catch {
    return { ok: false, events: [] };
  }
}
