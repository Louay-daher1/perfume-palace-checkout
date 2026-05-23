/** Responsive `sizes` for product card images (helps browser pick smaller downloads). */
export function productCardImageSizes(grid: boolean, compact: boolean): string {
  if (compact) {
    return "(max-width: 640px) 45vw, 200px";
  }
  if (grid) {
    return "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 280px, 220px";
  }
  return "(max-width: 640px) 50vw, 320px";
}

/** Turn API image URLs into URLs that work on phone (via Vite /storage proxy). */
export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url) {
    return "";
  }

  if (url.startsWith("/")) {
    return `${window.location.origin}${url}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/storage")) {
      return `${window.location.origin}${parsed.pathname}`;
    }
  } catch {
    return url;
  }

  return url;
}
