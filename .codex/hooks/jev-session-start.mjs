import { readFile } from "node:fs/promises";
import { packetPathFor } from "../../scripts/jev/retention.mjs";
import { readStdinJson, safeHookOutput } from "../../scripts/jev/hook-io.mjs";

async function main() {
  const input = await readStdinJson();
  if (input.source !== "compact" || process.env.JEV_COMPACTION_MODE !== "retain") {
    return safeHookOutput();
  }

  const raw = await readFile(packetPathFor(input.cwd, input.session_id), "utf8");
  const packet = JSON.parse(raw);
  if (!packet.additionalContext) return safeHookOutput();

  return safeHookOutput({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: packet.additionalContext,
    },
  });
}

main()
  .then((output) => process.stdout.write(`${JSON.stringify(output)}\n`))
  .catch(() => process.stdout.write(`${JSON.stringify(safeHookOutput())}\n`));
