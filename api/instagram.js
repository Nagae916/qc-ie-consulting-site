// /api/instagram.js
// Vercel Serverless Function (Node.js)
// 依存なし・ESM不要・CommonJSでそのまま動きます

module.exports = async (req, res) => {
  try {
    const IG_TOKEN = process.env.IG_ACCESS_TOKEN;
    const IG_USER  = process.env.IG_USER_ID;

    const limit = Math.min(Number(req.query.limit || 6), 12);

    if (!IG_TOKEN || !IG_USER) {
      res.status(500).json({ error: "Missing IG_ACCESS_TOKEN or IG_USER_ID" });
      return;
    }

    // ベースは Basic Display API（graph.instagram.com）
    const FIELDS =
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

    const listUrl =
      `https://graph.instagram.com/${IG_USER}/media` +
      `?fields=${FIELDS}` +
      `&limit=${limit}` +
      `&access_token=${IG_TOKEN}`;

    // JSONでないエラーHTMLが返ってくるケースに備え、まずtext、次にJSONにtry/catch
    const listRes = await fetch(listUrl, { cache: "no-store" });
    const listRaw = await listRes.text();

    let listJson;
    try {
      listJson = JSON.parse(listRaw);
    } catch {
      res.status(502).json({
        error: "Upstream is not JSON",
        upstream: listRaw.slice(0, 200),
      });
      return;
    }

    if (!listRes.ok || listJson.error) {
      res
        .status(listRes.status === 200 ? 502 : listRes.status)
        .json({ error: listJson?.error || `HTTP ${listRes.status}`, upstream: listJson });
      return;
    }

    let items = listJson.data || [];

    // カルーセルなどで media_url が空のときの救済:
    // CAROUSEL_ALBUM なら /{media-id}/children から最初の画像を拾う
    // VIDEO/REEL は thumbnail_url を使う
    async function enrichOne(p) {
      // すでに見られるURLがあればそれを使う
      if (p.media_url || p.thumbnail_url) return p;

      if (p.media_type === "CAROUSEL_ALBUM") {
        const childUrl =
          `https://graph.instagram.com/${p.id}/children?fields=media_type,media_url,thumbnail_url&access_token=${IG_TOKEN}`;
        try {
          const cRes = await fetch(childUrl, { cache: "no-store" });
          const cRaw = await cRes.text();
          let cJson;
          try {
            cJson = JSON.parse(cRaw);
          } catch {
            return p; // 失敗しても元のまま返す
          }
          if (cRes.ok && cJson.data && cJson.data.length > 0) {
            const first = cJson.data.find((x) => x.media_url || x.thumbnail_url) || cJson.data[0];
            p.media_url = first.media_url || null;
            p.thumbnail_url = first.thumbnail_url || p.thumbnail_url || null;
          }
        } catch (_) {}
      }
      // VIDEO/REEL は Basic Display では media_url に動画URLが来ますが、
      // サムネ表示は thumbnail_url を優先
      return p;
    }

    items = await Promise.all(items.map(enrichOne));

    // フロントが使いやすいように整形
    const normalized = items.map((p) => ({
      id: p.id,
      caption: p.caption || "",
      media_type: p.media_type,
      // 画像は media_url → thumbnail_url の順に採用
      image_url: p.media_url || p.thumbnail_url || null,
      thumbnail_url: p.thumbnail_url || null,
      permalink: p.permalink,
      timestamp: p.timestamp,
    }));

    // Vercel のエッジキャッシュ（CDN）: 5分
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    res.status(200).json({ data: normalized });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Internal Error" });
  }
};
