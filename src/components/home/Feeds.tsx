// ここではフィード系を src/components/feeds/ 配下から読み込みます。
// もし現状が src/components/learn/ に置いてある場合は、↓の import を読み替えてください。
import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import InstagramFeed from "@/components/feeds/InstagramFeed";
import XTimeline from "@/components/feeds/XTimeline";

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
          <h3 className="font-semibold mb-3">X（Twitter）@n_ieqlab</h3>
          <XTimeline />
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Instagram 最新投稿</h3>
          <InstagramFeed />
        </div>
      </div>
    </section>
  );
}
