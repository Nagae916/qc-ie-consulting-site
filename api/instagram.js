// /api/instagram.js
// 以前の動きに合わせた、Node/Vercel の Serverless Function 形式（JS）

module.exports = async (req, res) => {
  try {
    const token = process.env.IG_ACCESS_TOKEN;
    const userId = process.env.IG_USER_ID;

    if (!token || !userId) {
      res.status(500).json({ error: "Missing IG_ACCESS_TOKEN or IG_USER_ID" });
      return;
    }

    const limit = Math.max(1, Math.min(parseInt(req.query.limit || "3", 10), 12));
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

    const api = `https://graph.instagram.com/${userId}/media?fields=${encodeURIComponent(
      fields
    )}&access_token=${encodeURIComponent(token)}`;

    const igRes = await fetch(api);
    if (!igRes.ok) {
      const txt = await igRes.text();
      res.status(igRes.status).json({ error: "Instagram upstream error", upstream: txt });
      return;
    }

    const json = await igRes.json();

    // 画像/サムネが無いものは除外し、上限数で切り出し
    const data = (json.data || [])
      .filter(x => x.media_url || x.thumbnail_url)
      .slice(0, limit);

    // 以前と同じ形に揃える
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=60");
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: "Handler failed", detail: String(err) });
  }
};
