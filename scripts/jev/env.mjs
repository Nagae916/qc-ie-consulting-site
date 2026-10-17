import { existsSync } from "node:fs";
import path from "node:path";

export function loadLocalEnvironment(start = process.cwd()) {
  let current = path.resolve(start);
  while (true) {
    const candidate = path.join(current, ".env.local");
    if (existsSync(candidate)) {
      try {
        process.loadEnvFile(candidate);
      } catch {
        // Missing or malformed local configuration must not block development.
      }
      return;
    }
    if (existsSync(path.join(current, ".git"))) return;
    const parent = path.dirname(current);
    if (parent === current) return;
    current = parent;
  }
}
