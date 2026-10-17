import { readFile } from "node:fs/promises";
import { createRetentionPacket, packetPathFor, writeJsonAtomic } from "../../scripts/jev/retention.mjs";
import { parseTranscriptJsonl } from "../../scripts/jev/transcript.mjs";
import { readStdinJson, safeHookOutput } from "../../scripts/jev/hook-io.mjs";

async function main() {
  const input = await readStdinJson();
  const transcriptPath = typeof input.transcript_path === "string" ? input.transcript_path : null;
  if (!transcriptPath) return safeHookOutput();

  const transcript = await readFile(transcriptPath, "utf8");
  const parsed = parseTranscriptJsonl(transcript);
  const packet = await createRetentionPacket({
    sessionId: input.session_id ?? "unknown",
    trigger: input.trigger ?? "unknown",
    candidates: parsed.candidates,
    parseWarnings: parsed.warnings,
  });
  await writeJsonAtomic(packetPathFor(input.cwd, input.session_id), packet);
  return safeHookOutput({
    systemMessage: `[Jev ${packet.mode}] evaluated ${packet.metrics.candidateCount} tool results; ${packet.metrics.keepCount} kept in the retention packet, ${packet.metrics.dropCandidateCount} marked as drop candidates. Native compaction continues.`,
  });
}

main()
  .then((output) => process.stdout.write(`${JSON.stringify(output)}\n`))
  .catch((error) => {
    process.stdout.write(`${JSON.stringify(safeHookOutput({ systemMessage: `[Jev shadow] skipped: ${error.message}` }))}\n`);
  });
