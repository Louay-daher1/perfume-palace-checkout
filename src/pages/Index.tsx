import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";

const NewArrivalsCarousel = lazy(() => import("@/components/NewArrivalsCarousel"));
const BestSellersCarousel = lazy(() => import("@/components/BestSellersCarousel"));

const CarouselSectionFallback = () => (
  <div className="container mx-auto px-4 py-8" aria-busy="true">
    <div className="h-8 w-48 bg-secondary/40 rounded animate-pulse mb-6" />
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-[46%] sm:w-[32%] aspect-[3/5] rounded-lg bg-secondary/40 animate-pulse"
        />
      ))}
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <CategoryGrid />

      <Suspense fallback={<CarouselSectionFallback />}>
        <NewArrivalsCarousel />
      </Suspense>

      <section className="container mx-auto px-4 pb-20">
        <div className="relative rounded-lg overflow-hidden bg-secondary p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gold-gradient opacity-5" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">Cash on Delivery Available</h2>
            <p className="font-body text-lg text-muted-foreground mb-6">
              Order your favourite fragrance and pay when it arrives at your doorstep.
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 border border-primary text-primary font-sans text-sm tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-colors rounded"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<CarouselSectionFallback />}>
        <BestSellersCarousel />
      </Suspense>
    </div>
  );
};

export default Index;
