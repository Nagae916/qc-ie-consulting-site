// /api/ping.js  — まずこれで 200 を返せるか確認
module.exports = (req, res) => {
  res.status(200).json({ ok: true, now: new Date().toISOString() });
};
