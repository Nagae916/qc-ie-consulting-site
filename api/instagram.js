// app/api/instagram/route.ts
import { NextResponse } from "next/server";

const TOKEN = process.env.INSTAGRAM_TOKEN; // .env.local に設定したトークン
const USER_ID = process.env.INSTAGRAM_USER_ID; // .env.local に設定したユーザーID
const LIMIT = 3;

export async function GET() {
  try {
    const url = `https://graph.instagram.com/${USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${TOKEN}&limit=${LIMIT}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || "APIエラー" }, { status: 500 });
    }

    // 必要な情報だけ返す
    const posts = data.data.map((post: any) => ({
      id: post.id,
      caption: post.caption,
      media_type: post.media_type,
      media_url: post.media_url || post.thumbnail_url, // 画像 or サムネ
      permalink: post.permalink,
      timestamp: post.timestamp,
    }));

    return NextResponse.json({ data: posts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
