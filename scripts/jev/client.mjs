import { TypeSafeClient } from "@typesafe-ai/sdk";
import { experimental_evaluate } from "ai";
import { JEV_DIRECT_MODEL, JEV_MODEL, JEV_TIMEOUT_MS } from "./config.mjs";

export function hasJevCredentials(env = process.env) {
  return getJevProvider(env) !== null;
}

export function hasDirectTypeSafeCredentials(env = process.env) {
  return Boolean(env.TYPESAFE_API_KEY || env.JEV_API_KEY);
}

export function hasGatewayCredentials(env = process.env) {
  return Boolean(env.AI_GATEWAY_API_KEY || env.VERCEL_OIDC_TOKEN);
}

export function getJevProvider(env = process.env) {
  if (hasDirectTypeSafeCredentials(env)) return "typesafe";
  if (hasGatewayCredentials(env)) return "gateway";
  return null;
}

export async function evaluateWithJev({ state, questions, timeoutMs = JEV_TIMEOUT_MS, env = process.env }) {
  const provider = getJevProvider(env);
  if (!provider) {
    return { ok: false, reason: "credentials_missing" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("Jev evaluation timed out")), timeoutMs);
  try {
    const result = provider === "typesafe"
      ? await evaluateWithTypeSafe({ state, questions, timeoutMs, signal: controller.signal, env })
      : await evaluateWithGateway({ state, questions, signal: controller.signal });
    return { ok: true, provider, result: normalizeEvaluationResult(result, questions) };
  } catch (error) {
    return { ok: false, provider, reason: "evaluation_failed", error: sanitizeError(error) };
  } finally {
    clearTimeout(timer);
  }
}

async function evaluateWithTypeSafe({ state, questions, timeoutMs, signal, env }) {
  const model = env.TYPESAFE_DEFAULT_MODEL || JEV_DIRECT_MODEL;
  const client = new TypeSafeClient({
    apiKey: env.TYPESAFE_API_KEY || env.JEV_API_KEY,
    baseURL: env.TYPESAFE_BASE_URL,
    defaultModel: model,
    timeout: timeoutMs,
    retry: { maxRetries: 1 },
    logLevel: "off",
  });
  return client.systemOne(
    { state, questions: toTypeSafeQuestions(questions), model },
    { signal, timeout: timeoutMs, retry: { maxRetries: 1 } },
  );
}

async function evaluateWithGateway({ state, questions, signal }) {
  return experimental_evaluate({
    model: JEV_MODEL,
    state,
    questions: toGatewayQuestions(questions),
    maxRetries: 1,
    abortSignal: signal,
  });
}

export function toTypeSafeQuestions(questions) {
  return mapQuestionType(questions, "boolean", "noul");
}

export function toGatewayQuestions(questions) {
  return mapQuestionType(questions, "noul", "boolean");
}

export function normalizeEvaluationResult(result, questions) {
  const answers = Object.fromEntries(Object.entries(result.answers || {}).map(([id, answer]) => {
    const questionType = questions[id]?.type;
    if (questionType !== "noul" && questionType !== "boolean") return [id, answer];
    const probability = answer?.noul ?? answer?.probability;
    if (!Number.isFinite(probability)) return [id, answer];
    return [id, { ...answer, type: "noul", noul: probability, probability }];
  }));
  return { ...result, answers };
}

function mapQuestionType(questions, from, to) {
  return Object.fromEntries(Object.entries(questions).map(([id, question]) => [
    id,
    question.type === from ? { ...question, type: to } : question,
  ]));
}

function sanitizeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/Bearer\s+\S+/gi, "Bearer [redacted]").slice(0, 300);
}
