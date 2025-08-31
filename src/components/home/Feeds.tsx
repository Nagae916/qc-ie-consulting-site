// src/components/home/Feeds.tsx
import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import InstagramFeed from "@/components/feeds/InstagramFeed";
import XTimeline from "@/components/feeds/XTimeline";

export default function HomeFeeds() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">SNS / フィード</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* ニュース：最新5件（カード表示） */}
        <div className="rounded-xl bg-white p-5 shadow-sm flex flex-col min-h-[360px]">
          <h3 className="font-semibold mb-3">ニュース（経営工学／品質管理）</h3>
          <div className="flex-1">
            <NewsFeed limit={5} variant="card" />
          </div>
        </div>

        {/* note：最新3件 */}
        <div className="rounded-xl bg-white p-5 shadow-sm flex flex-col min-h-[360px]">
          <h3 className="font-semibold mb-3">note 最新</h3>
          <div className="flex-1">
            <NoteFeed limit={3} />
          </div>
        </div>

        {/* X（Twitter）：最新3件 */}
        <div className="rounded-xl bg-white p-5 shadow-sm flex flex-col min-h-[640px]">
          <h3 className="font-semibold mb-3">X（Twitter）@n_ieqclab</h3>
          {/* 埋め込みの読み込み中でも高さを確保してガタつきを防止 */}
          <div className="flex-1 min-h-[600px]">
            <XTimeline
              username="n_ieqclab"
              limit={3}
              height={600}
              theme="light"
              chrome={["noheader", "nofooter"]}
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="rounded-xl bg-white p-5 shadow-sm flex flex-col min-h-[360px]">
          <h3 className="font-semibold mb-3">Instagram 最新投稿</h3>
          <div className="flex-1">
            <InstagramFeed />
          </div>
        </div>
      </div>
    </section>
  );
}
