import { readFileSync } from "node:fs";
import path from "node:path";

export const TYPESAFE_SKILL_PATH = path.join(".agents", "skills", "typesafe-ai", "SKILL.md");

export function inspectTypeSafeSkill(root = process.cwd()) {
  const skillPath = path.join(root, TYPESAFE_SKILL_PATH);
  const lockPath = path.join(root, "skills-lock.json");
  try {
    const skill = readFileSync(skillPath, "utf8");
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    const entry = lock?.skills?.["typesafe-ai"];
    const nameMatches = /^name:\s*typesafe-ai\s*$/m.test(skill);
    const sourceMatches = entry?.source === "typesafe-ai/skills" && entry?.skillPath === "skills/typesafe-ai/SKILL.md";
    return {
      configured: Boolean(nameMatches && sourceMatches),
      name: nameMatches ? "typesafe-ai" : null,
      source: entry?.source || null,
      path: TYPESAFE_SKILL_PATH.split(path.sep).join("/"),
    };
  } catch {
    return { configured: false, name: null, source: null, path: TYPESAFE_SKILL_PATH.split(path.sep).join("/") };
  }
}
