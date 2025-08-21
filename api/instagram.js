// /api/instagram.js
// ESM で export default。Node 18+ なら fetch はグローバルでOK

export default async function handler(req, res) {
  console.log("[instagram] invoked");

  try {
    const IG_TOKEN = process.env.IG_ACCESS_TOKEN;
    const IG_USER  = process.env.IG_USER_ID;

    const limit = Math.min(Number(req.query.limit || 6), 12);

    if (!IG_TOKEN || !IG_USER) {
      console.error("[instagram] missing env", {
        hasToken: !!IG_TOKEN,
        hasUser: !!IG_USER,
      });
      res.status(500).json({ error: "Missing IG_ACCESS_TOKEN or IG_USER_ID" });
      return;
    }

    const FIELDS =
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

    const listUrl =
      `https://graph.instagram.com/${IG_USER}/media` +
      `?fields=${FIELDS}` +
      `&limit=${limit}` +
      `&access_token=${IG_TOKEN}`;

    const listRes = await fetch(listUrl, { cache: "no-store" });
    const listRaw = await listRes.text();

    let listJson;
    try {
      listJson = JSON.parse(listRaw);
    } catch {
      console.error("[instagram] upstream non-JSON", listRaw.slice(0, 200));
      res.status(502).json({
        error: "Upstream is not JSON",
        upstream: listRaw.slice(0, 200),
      });
      return;
    }

    if (!listRes.ok || listJson.error) {
      console.error("[instagram] upstream error", listRes.status, listJson);
      res
        .status(listRes.status === 200 ? 502 : listRes.status)
        .json({ error: listJson?.error || `HTTP ${listRes.status}`, upstream: listJson });
      return;
    }

    let items = Array.isArray(listJson.data) ? listJson.data : [];

    // フォールバック（CAROUSEL → children から1枚拾う）
    async function enrichOne(p) {
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
            console.warn("[instagram] children non-JSON", cRaw.slice(0, 120));
            return p;
          }
          if (cRes.ok && cJson.data && cJson.data.length > 0) {
            const first =
              cJson.data.find((x) => x.media_url || x.thumbnail_url) || cJson.data[0];
            p.media_url = first.media_url || null;
            p.thumbnail_url = first.thumbnail_url || p.thumbnail_url || null;
          }
        } catch (e) {
          console.warn("[instagram] children fetch error", e?.message);
        }
      }
      return p;
    }

    items = await Promise.all(items.map(enrichOne));

    const normalized = items.map((p) => ({
      id: p.id,
      caption: p.caption || "",
      media_type: p.media_type,
      image_url: p.media_url || p.thumbnail_url || null,
      thumbnail_url: p.thumbnail_url || null,
      permalink: p.permalink,
      timestamp: p.timestamp,
    }));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    res.status(200).json({ data: normalized });
  } catch (e) {
    console.error("[instagram] fatal", e);
    res.status(500).json({ error: e?.message || "Internal Error", stack: e?.stack });
  }
}
