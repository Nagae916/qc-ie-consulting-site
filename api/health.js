// /api/health.js
module.exports = async (_req, res) => {
  try {
    const hasToken = !!process.env.IG_ACCESS_TOKEN;
    const hasUser  = !!process.env.IG_USER_ID;
    const nodeV = process.version;

    res.status(200).json({
      ok: true,
      has_IG_ACCESS_TOKEN: hasToken,
      has_IG_USER_ID: hasUser,
      node: nodeV,
      now: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
