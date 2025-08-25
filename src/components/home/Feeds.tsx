// src/components/home/Feeds.tsx
// ※ フィード系の配置が `src/components/Feeds/`（先頭大文字）ならこの import のままでOK。
//   もし小文字 `feeds/` や `learn/` にある場合は、ここのパスだけ読み替えてください。
import NewsFeed from "@/components/Feeds/NewsFeed";
import NoteFeed from "@/components/Feeds/NoteFeed";
import InstagramFeed from "@/components/Feeds/InstagramFeed";
import XTimeline from "@/components/Feeds/XTimeline";

export default function HomeFeeds() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">SNS / フィード</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-3">ニュース（経営工学／品質管理）</h3>
          <NewsFeed />
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-3">note 最新</h3>
          <NoteFeed />
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-3">X（Twitter）@n_ieqclab</h3>
          {/* ← 必須の username を指定 */}
          <XTimeline username="n_ieqclab" height={600} theme="light" />
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Instagram 最新投稿</h3>
          <InstagramFeed />
        </div>
      </div>
    </section>
  );
}
