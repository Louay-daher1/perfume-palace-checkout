import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useSlides } from "@/hooks/use-products";
import { resolveAssetUrl } from "@/lib/assets";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import type { Slide } from "@/types/product";

const BUTTON_CLASS =
  "inline-block px-7 py-2.5 sm:py-3 bg-gold-gradient text-primary-foreground font-sans font-semibold text-xs sm:text-sm tracking-[0.15em] uppercase rounded hover:opacity-90 transition-opacity";

/** product_id → product page; else route; else shop all */
function getSlideButtonHref(slide: Slide): string {
  if (slide.product_id) {
    return `/product/${slide.product_id}`;
  }

  if (slide.route) {
    if (slide.route.startsWith("http://") || slide.route.startsWith("https://")) {
      return slide.route;
    }
    return slide.route.startsWith("/") ? slide.route : `/${slide.route}`;
  }

  return "/products";
}

function slideShowsButton(slide: Slide): boolean {
  return Boolean(slide.product_id || slide.route || slide.button_text);
}

const SlideCtaButton = ({ slide }: { slide: Slide }) => {
  const href = getSlideButtonHref(slide);
  const label = slide.button_text ?? "Shop Now";

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={BUTTON_CLASS}>
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={BUTTON_CLASS}>
      {label}
    </Link>
  );
};

const SECTION = "w-full pt-16 lg:pt-20 ";

/** Mobile / tablet: full-bleed banner with overlay text */
const MOBILE_FRAME = cn(
  "relative w-full overflow-hidden bg-secondary/40 border-y border-border/50 lg:hidden",
  "aspect-[4/5] max-h-[400px]",
  "sm:aspect-[16/10] sm:max-h-[440px]",
);

const MOBILE_IMAGE = "absolute inset-0 h-full w-full object-cover object-center";

const MOBILE_OVERLAY = cn(
  "absolute inset-0 pointer-events-none",
  "bg-gradient-to-t from-background via-background/55 to-background/15",
);

const MOBILE_TEXT = cn(
  "absolute z-20 inset-x-0 bottom-0 px-5 pb-8 pt-16 text-center",
  "sm:px-8 sm:pb-10",
);

/** Desktop: split card — copy left, product image right */
const DESKTOP_FRAME = cn(
  "hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]",
  "lg:h-[min(78vh,600px)] lg:min-h-[480px] lg:max-h-[640px]",
  "lg:rounded-2xl lg:overflow-hidden",
  "lg:border lg:border-border/60",
  "lg:bg-card lg:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]",
);

const DESKTOP_COPY = cn(
  "relative flex flex-col justify-center",
  "px-10 xl:px-14 py-10 xl:py-12",
  "bg-gradient-to-br from-background via-background to-secondary/30",
  "border-r border-border/40",
);

const DESKTOP_IMAGE_PANEL = "relative min-h-0 overflow-hidden bg-secondary/20";

const DESKTOP_IMAGE = "absolute inset-0 h-full w-full object-cover object-center";

const ARROW_BASE = cn(
  "hidden lg:flex absolute z-30 top-1/2 -translate-y-1/2",
  "h-11 w-11 rounded-full border border-primary/35",
  "bg-background/90 text-foreground shadow-lg backdrop-blur-sm",
  "opacity-0 pointer-events-none transition-all duration-300",
  "group-hover:opacity-100 group-hover:pointer-events-auto",
  "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105",
);

type HeroFrameProps = {
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
  children: ReactNode;
};

const HeroCopy = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const HeroFrame = ({ imageSrc, imageAlt, priority, children }: HeroFrameProps) => (
  <>
    {/* Mobile & tablet */}
    <div className={MOBILE_FRAME}>
      <img
        src={imageSrc}
        alt={imageAlt}
        className={MOBILE_IMAGE}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes="100vw"
      />
      <div className={MOBILE_OVERLAY} aria-hidden />
      <HeroCopy className={MOBILE_TEXT}>{children}</HeroCopy>
    </div>

    {/* Large screens — editorial split layout */}
    <div className={DESKTOP_FRAME}>
      <div className={DESKTOP_COPY}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 28px, hsl(var(--primary)) 28px, hsl(var(--primary)) 29px)",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>

      <div className={DESKTOP_IMAGE_PANEL}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={DESKTOP_IMAGE}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sizes="(min-width: 1024px) 52vw, 100vw"
        />
      </div>
    </div>
  </>
);

const SlideEyebrow = ({ children }: { children: ReactNode }) => (
  <p className="font-sans text-[10px] sm:text-xs tracking-[0.35em] text-primary uppercase mb-3 lg:mb-4">
    {children}
  </p>
);

const SlideTitle = ({ children }: { children: ReactNode }) => (
  <h1
    className={cn(
      "font-display font-bold text-gold-gradient leading-[1.1] mb-3",
      "text-2xl sm:text-3xl md:text-4xl",
      "lg:text-[2.35rem] xl:text-5xl lg:mb-4",
    )}
  >
    {children}
  </h1>
);

const SlideDescription = ({ children }: { children: ReactNode }) => (
  <p
    className={cn(
      "font-body text-foreground/85 mb-5",
      "text-sm sm:text-base line-clamp-2 sm:line-clamp-3 max-w-md mx-auto",
      "lg:mx-0 lg:text-lg lg:leading-relaxed lg:line-clamp-4 lg:max-w-md lg:mb-6",
    )}
  >
    {children}
  </p>
);

const SlideContent = ({ slide, priority = false }: { slide: Slide; priority?: boolean }) => (
  <HeroFrame
    imageSrc={resolveAssetUrl(slide.image_url)}
    imageAlt={slide.title}
    priority={priority}
  >
    <div className="hidden lg:block h-px w-12 bg-gradient-to-r from-primary/80 to-transparent mb-5" aria-hidden />
    <SlideTitle>{slide.title}</SlideTitle>
    {slide.description && <SlideDescription>{slide.description}</SlideDescription>}
    {slideShowsButton(slide) && <SlideCtaButton slide={slide} />}
  </HeroFrame>
);

const HeroSliderSkeleton = () => (
  <>
    <div className={MOBILE_FRAME} aria-hidden>
      <div className="absolute inset-0 bg-secondary/50 animate-pulse" />
      <div className={MOBILE_OVERLAY} />
      <div className={cn(MOBILE_TEXT, "flex flex-col items-center gap-3")}>
        <div className="h-3 w-24 rounded-md bg-muted/60 animate-pulse" />
        <div className="h-9 w-56 max-w-[85%] rounded-md bg-muted/60 animate-pulse" />
        <div className="h-4 w-64 max-w-[90%] rounded-md bg-muted/50 animate-pulse" />
        <div className="h-10 w-32 rounded-md bg-muted/60 animate-pulse mt-1" />
      </div>
    </div>

    <div className={DESKTOP_FRAME} aria-hidden>
      <div className={cn(DESKTOP_COPY, "gap-4")}>
        <div className="h-3 w-28 rounded-md bg-muted/60 animate-pulse" />
        <div className="h-10 w-4/5 max-w-sm rounded-md bg-muted/60 animate-pulse" />
        <div className="h-4 w-full max-w-md rounded-md bg-muted/50 animate-pulse" />
        <div className="h-4 w-11/12 max-w-sm rounded-md bg-muted/50 animate-pulse" />
        <div className="h-10 w-36 rounded-md bg-muted/60 animate-pulse mt-2" />
      </div>
      <div className={cn(DESKTOP_IMAGE_PANEL, "bg-secondary/50 animate-pulse")} />
    </div>
  </>
);

const DefaultHero = () => (
  <HeroFrame imageSrc={heroBg} imageAlt="Luxury perfume collection" priority>
    <SlideEyebrow>Luxury Fragrances</SlideEyebrow>
    <div className="hidden lg:block h-px w-12 bg-gradient-to-r from-primary/80 to-transparent mb-5" aria-hidden />
    <SlideTitle>Scents by AS</SlideTitle>
    <p className="font-body text-sm sm:text-lg text-foreground/90 mb-4 italic max-w-md mx-auto lg:mx-0 lg:text-lg lg:leading-relaxed lg:mb-6 lg:max-w-md">
      Where every drop tells a story of elegance
    </p>
    <Link to="/products" className={BUTTON_CLASS}>
      Explore Collection
    </Link>
  </HeroFrame>
);

const HeroSlider = () => {
  const { data: slides, isLoading, isError } = useSlides();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => setCurrent(api.selectedScrollSnap());

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useCarouselAutoplay(api, slides?.length ?? 0, 6000);

  const renderDots = (slideList: Slide[]) => (
    <div
      className={cn(
        "flex items-center justify-center gap-2 mt-5",
        "lg:absolute lg:bottom-6 lg:left-10 xl:left-14 lg:mt-0 lg:z-20 lg:justify-start",
      )}
      role="tablist"
      aria-label="Slide navigation"
    >
      {slideList.map((slide, i) => (
        <button
          key={slide.id}
          type="button"
          role="tab"
          aria-label={`Go to slide ${i + 1}: ${slide.title}`}
          aria-selected={current === i}
          onClick={() => api?.scrollTo(i)}
          className={cn(
            "rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            current === i ? "h-2 w-8 bg-primary" : "h-2 w-2 bg-foreground/30 hover:bg-foreground/50",
          )}
        />
      ))}
    </div>
  );

  const renderSlideCounter = (total: number) => (
    <p
      className="hidden lg:block absolute bottom-6 right-8 xl:right-10 z-20 font-sans text-[11px] tracking-[0.25em] text-muted-foreground tabular-nums"
      aria-live="polite"
    >
      <span className="text-primary">{String(current + 1).padStart(2, "0")}</span>
      <span className="mx-2 text-border">/</span>
      <span>{String(total).padStart(2, "0")}</span>
    </p>
  );

  const heroShell = (content: ReactNode, showDots?: Slide[], showCounter?: number) => (
    <div className="lg:container lg:mx-auto lg:px-4 xl:px-6">
      <div className="group relative w-full">
        {content}
        {showDots && renderDots(showDots)}
        {showCounter !== undefined && showCounter > 1 && renderSlideCounter(showCounter)}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className={SECTION} aria-busy="true" aria-label="Loading hero slides">
        <div className="lg:container lg:mx-auto lg:px-4 xl:px-6">
          <div className="relative w-full">
            <HeroSliderSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !slides?.length) {
    return (
      <section className={SECTION}>
        {heroShell(<DefaultHero />)}
      </section>
    );
  }

  if (slides.length === 1) {
    return (
      <section className={SECTION}>
        {heroShell(<SlideContent slide={slides[0]} priority />)}
      </section>
    );
  }

  return (
    <section className={SECTION}>
      {heroShell(
        <Carousel setApi={setApi} opts={{ loop: true }} className="relative w-full">
          <CarouselContent className="-ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="pl-0">
                <SlideContent slide={slide} priority={index === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={cn(ARROW_BASE, "left-1 xl:left-2")} />
          <CarouselNext className={cn(ARROW_BASE, "right-2 xl:right-3")} />
        </Carousel>,
        slides,
        slides.length,
      )}
    </section>
  );
};

export default HeroSlider;
