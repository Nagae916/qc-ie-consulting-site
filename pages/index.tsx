import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Training from "@/components/home/Training";
import HomeFeeds from "@/components/home/Feeds";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <Hero />
      <Services />
      <Training />
      <HomeFeeds />
    </main>
  );
}
