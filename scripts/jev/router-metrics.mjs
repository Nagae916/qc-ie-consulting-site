import { readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const directory = path.join(os.tmpdir(), "jev-claude");
const counts = {};
let decisions = 0;
let sessions = 0;

try {
  const files = (await readdir(directory)).filter((name) => name.startsWith("codex-") && name.endsWith(".json"));
  for (const file of files) {
    const value = JSON.parse(await readFile(path.join(directory, file), "utf8"));
    const history = Array.isArray(value.history) ? value.history : [];
    sessions += 1;
    for (const entry of history) {
      const tier = entry.tier || "unknown";
      counts[tier] = (counts[tier] || 0) + 1;
      decisions += 1;
    }
  }
} catch {
  // Absence of router data is a valid initial state.
}

process.stdout.write(`${JSON.stringify({ sessions, decisions, tiers: counts }, null, 2)}\n`);
