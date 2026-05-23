import { useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Auto-advance only when tab is visible and user allows motion. */
export function useCarouselAutoplay(
  api: CarouselApi | undefined,
  slideCount: number,
  intervalMs = 6000,
) {
  useEffect(() => {
    if (!api || slideCount <= 1 || prefersReducedMotion()) {
      return;
    }

    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      stop();
      timer = setInterval(() => api.scrollNext(), intervalMs);
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [api, slideCount, intervalMs]);
}
