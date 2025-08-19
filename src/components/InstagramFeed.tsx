import { useEffect, useState } from "react";

type InstaPost = {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);

  useEffect(() => {
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        // 最新3件だけ反映
        setPosts(data.slice(0, 3));
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={post.media_url}
            alt={post.caption || "Instagram post"}
            className="rounded-lg shadow"
          />
        </a>
      ))}
    </div>
  );
}
