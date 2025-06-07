import ImageFeed from "@/components/image-feed";
import { HeroSection } from "@/components/hero-section";
import { Suspense } from "react";
import HeroLoader from "@/components/hero-loading";
import ImageLoader from "@/components/image-loading";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HeroLoader />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<ImageLoader number_of_cards={10} />}>
        <ImageFeed />
      </Suspense>
    </main>
  );
}
