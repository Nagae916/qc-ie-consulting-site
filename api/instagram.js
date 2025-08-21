import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = process.env.IG_ACCESS_TOKEN; // 前回と同じ環境変数名
    const userId = process.env.IG_USER_ID;     // 前回と同じ環境変数名
    const limit = req.query.limit || 3;

    if (!token || !userId) {
      return res.status(500).json({ error: "環境変数が設定されていません。" });
    }

    const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Instagram APIの取得に失敗しました。" });
  }
}
