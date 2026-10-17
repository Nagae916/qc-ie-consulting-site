import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_MAX_PATCH_CHARS = 14000;
const MAX_UNTRACKED_FILE_BYTES = 256 * 1024;

export function collectChangedFiles({ cwd = process.cwd(), base = "origin/main", maxPatchChars = DEFAULT_MAX_PATCH_CHARS } = {}) {
  const baseRef = resolveBase(cwd, base);
  const committed = runGit(cwd, ["diff", "--no-ext-diff", "--unified=40", `${baseRef}...HEAD`]);
  const working = runGit(cwd, ["diff", "--no-ext-diff", "--unified=40", "HEAD"]);
  const tracked = parseUnifiedDiff([committed, working].filter(Boolean).join("\n"), maxPatchChars);
  const untracked = collectUntrackedFiles(cwd, maxPatchChars);
  return [...tracked, ...untracked].filter((file) => !isSensitivePath(file.path));
}

function collectUntrackedFiles(cwd, maxPatchChars) {
  const output = runGit(cwd, ["ls-files", "--others", "--exclude-standard", "-z"], { trim: false });
  if (!output) return [];
  return output.split("\0").filter(Boolean).filter((filePath) => !isSensitivePath(filePath)).flatMap((filePath) => {
    try {
      const metadata = lstatSync(path.join(cwd, filePath));
      if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size > MAX_UNTRACKED_FILE_BYTES) return [];
      const content = readFileSync(path.join(cwd, filePath));
      if (content.includes(0)) return [];
      const patch = [
        `diff --git a/${filePath} b/${filePath}`,
        "new file mode 100644",
        "--- /dev/null",
        `+++ b/${filePath}`,
        ...content.toString("utf8").split(/\r?\n/).map((line) => `+${line}`),
      ].join("\n");
      return [{
        path: filePath,
        patch: patch.length > maxPatchChars ? `${patch.slice(0, maxPatchChars)}\n[patch truncated]` : patch,
        truncated: patch.length > maxPatchChars,
        isTest: /(?:^|\/)(?:tests?|__tests__)(?:\/|$)|\.(?:spec|test)\.[cm]?[jt]sx?$/.test(filePath),
      }];
    } catch {
      return [];
    }
  });
}

function isSensitivePath(filePath) {
  return /(?:^|\/)\.env(?:\.|$)|(?:^|\/)(?:\.aws|\.ssh)(?:\/|$)|(?:^|\/)(?:\.npmrc|\.netrc)$|(?:^|\/)(?:secrets?|credentials?)(?:\.|\/|$)|\.(?:pem|key|p12|pfx)$/i.test(filePath);
}

export function parseUnifiedDiff(diff, maxPatchChars = DEFAULT_MAX_PATCH_CHARS) {
  if (!diff.trim()) return [];
  const sections = diff.split(/(?=^diff --git )/m).filter(Boolean);
  return sections.map((patch) => {
    const match = patch.match(/^diff --git a\/(.+?) b\/(.+)$/m);
    const path = match?.[2] ?? match?.[1] ?? "unknown";
    return {
      path,
      patch: patch.length > maxPatchChars ? `${patch.slice(0, maxPatchChars)}\n[patch truncated]` : patch,
      truncated: patch.length > maxPatchChars,
      isTest: /(?:^|\/)(?:tests?|__tests__)(?:\/|$)|\.(?:spec|test)\.[cm]?[jt]sx?$/.test(path),
    };
  });
}

function resolveBase(cwd, requested) {
  try {
    runGit(cwd, ["rev-parse", "--verify", requested]);
    return requested;
  } catch {
    return "HEAD";
  }
}

function runGit(cwd, args, { trim = true } = {}) {
  const output = execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  return trim ? output.trim() : output;
}
