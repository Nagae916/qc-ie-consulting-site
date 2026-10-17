import { evaluateWithJev, getJevProvider } from "./client.mjs";

const provider = getJevProvider();
if (!provider) {
  process.stderr.write("[Jev smoke] Set TYPESAFE_API_KEY (preferred) or an AI Gateway credential in .env.local.\n");
  process.exitCode = 1;
} else {
  const evaluation = await evaluateWithJev({
    state: { message: "A production machine stopped and no workaround is available." },
    questions: {
      urgent: {
        type: "noul",
        instructions: "Does `message` describe a situation that needs prompt human attention?",
        criteria: {
          true: "Work is blocked and no workaround is available",
          false: "Work can continue or the message is routine",
        },
      },
    },
  });

  if (!evaluation.ok) {
    process.stderr.write(`[Jev smoke] ${evaluation.reason}: ${evaluation.error || "unknown error"}\n`);
    process.exitCode = 1;
  } else {
    const answer = evaluation.result.answers.urgent;
    const valid = answer?.type === "noul" && Number.isFinite(answer.probability);
    process.stdout.write(`${JSON.stringify({
      ok: valid,
      provider: evaluation.provider,
      model: evaluation.result.model || null,
      answerType: answer?.type || null,
      usage: evaluation.result.usage || null,
    }, null, 2)}\n`);
    if (!valid) process.exitCode = 1;
  }
}
