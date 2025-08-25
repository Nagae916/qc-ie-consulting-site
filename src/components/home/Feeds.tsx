import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed";

export default function HomeFeeds() {
  return (
    <section className="mt-10 space-y-8">
      <NewsFeed limit={6} />
      <NoteFeed limit={6} />
      <XTimeline username="n_ieqlab" />
      <InstagramFeed />
    </section>
  );
}
