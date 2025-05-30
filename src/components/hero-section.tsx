import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-title mb-6">
          Discover. Stunning. Visuals.
        </h1>
        <p className="text-xl text-subtitle mb-8 max-w-2xl mx-auto">
          The best free stock photos, royalty free images & videos shared by
          creators.
        </p>
        <SearchBar />
      </div>
    </section>
  );
}
