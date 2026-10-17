export async function readStdinJson() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  if (!raw.trim()) return {};
  const value = JSON.parse(raw);
  return value && typeof value === "object" ? value : {};
}

export function safeHookOutput(extra = {}) {
  return { continue: true, ...extra };
}
