import { readFile } from "node:fs/promises";
import { createRetentionPacket } from "./retention.mjs";
import { parseTranscriptJsonl } from "./transcript.mjs";

const transcriptPath = process.argv[2];
if (!transcriptPath) {
  process.stderr.write("Usage: npm run jev:compaction:sample -- <transcript.jsonl>\n");
  process.exitCode = 1;
} else {
  const parsed = parseTranscriptJsonl(await readFile(transcriptPath, "utf8"));
  const packet = await createRetentionPacket({ sessionId: "sample", trigger: "manual", candidates: parsed.candidates, parseWarnings: parsed.warnings });
  process.stdout.write(`${JSON.stringify(packet, null, 2)}\n`);
}
