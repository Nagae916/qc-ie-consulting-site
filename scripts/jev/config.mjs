import { loadLocalEnvironment } from "./env.mjs";

loadLocalEnvironment();

export const JEV_MODEL = process.env.JEV_MODEL || "typesafe-ai/jev";
export const JEV_DIRECT_MODEL = process.env.TYPESAFE_DEFAULT_MODEL || "jev-1.13.0";
export const JEV_TIMEOUT_MS = positiveNumber(process.env.JEV_TIMEOUT_MS, 8000);
export const JEV_DROP_THRESHOLD = boundedNumber(process.env.JEV_DROP_THRESHOLD, 0.95, 0.5, 1);
export const JEV_RETENTION_MAX_CHARS = positiveNumber(process.env.JEV_RETENTION_MAX_CHARS, 12000);
export const JEV_MAX_CANDIDATES = positiveNumber(process.env.JEV_MAX_CANDIDATES, 24);
export const JEV_MAX_STATE_CHARS = positiveNumber(process.env.JEV_MAX_STATE_CHARS, 24000);

function positiveNumber(raw, fallback) {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function boundedNumber(raw, fallback, min, max) {
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : fallback;
}
