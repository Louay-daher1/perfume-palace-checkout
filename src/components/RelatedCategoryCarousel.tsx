import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CAROUSEL_PRODUCT_LIMIT, useProductsByCategory } from "@/hooks/use-products";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";

type RelatedCategoryCarouselProps = {
  category: string;
  excludeProductId: number;
};

const RelatedCategoryCarousel = ({ category, excludeProductId }: RelatedCategoryCarouselProps) => {
  const { data: products, isLoading, isError } = useProductsByCategory(
    category,
    excludeProductId,
    CAROUSEL_PRODUCT_LIMIT,
  );
  const [api, setApi] = useState<CarouselApi>();

  useCarouselAutoplay(api, products?.length ?? 0, 6000);

  if (isError) {
    return null;
  }

  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  const categoryHref = `/products?category=${encodeURIComponent(category)}&page=1&sort=latest`;

  return (
    <section className="container mx-auto px-4 pt-10 sm:pt-14 pb-4 border-t border-border/60">
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.35em] text-primary uppercase mb-1">
            Same collection
          </p>
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl text-foreground leading-tight">
            More from {category}
          </h2>
        </div>
        <Link
          to={categoryHref}
          className="shrink-0 inline-flex items-center justify-center px-3.5 py-2 sm:px-6 sm:py-2.5 border border-primary text-primary font-sans text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded transition-colors select-none touch-manipulation active:bg-primary active:text-primary-foreground [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-primary-foreground [-webkit-tap-highlight-color:transparent]"
        >
          View All
        </Link>
      </div>

      {isLoading && (
        <div className="flex gap-3 overflow-hidden -mx-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[46%] sm:w-[32%] aspect-[3/5] sm:aspect-[2/3] rounded-lg bg-secondary/40 animate-pulse"
            />
          ))}
        </div>
      )}

      {products && products.length > 0 && (
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: products.length > 1,
          }}
          className="w-full touch-pan-y"
        >
          <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-6">
            {products.map((product, index) => (
              <CarouselItem
                key={product.product_id}
                className="pl-3 sm:pl-4 md:pl-6 basis-1/2 sm:basis-[42%] md:basis-[32%] lg:basis-[24%] xl:basis-[20%]"
              >
                <ProductCard product={product} index={index} grid />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex -left-2 md:left-0 h-9 w-9 border-border/60 bg-background/95 shadow-sm" />
          <CarouselNext className="hidden sm:inline-flex -right-2 md:right-0 h-9 w-9 border-border/60 bg-background/95 shadow-sm" />
        </Carousel>
      )}
    </section>
  );
};

export default RelatedCategoryCarousel;
