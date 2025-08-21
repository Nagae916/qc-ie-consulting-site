// /api/health.js
export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    has_IG_ACCESS_TOKEN: !!process.env.IG_ACCESS_TOKEN,
    has_IG_USER_ID: !!process.env.IG_USER_ID,
    node: process.version,
    region: process.env.VERCEL_REGION || null,
    now: new Date().toISOString(),
  });
}
