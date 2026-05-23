import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { resolveAssetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

function getGalleryUrls(product: Product): string[] {
  if (product.images?.length) {
    return [...product.images]
      .sort((a, b) => {
        if (a.is_primary !== b.is_primary) {
          return a.is_primary ? -1 : 1;
        }
        return a.sort_order - b.sort_order;
      })
      .map((img) => img.url)
      .filter((url): url is string => Boolean(url));
  }

  return product.image ? [product.image] : [];
}

interface ProductImageGalleryProps {
  product: Product;
}

const mainImageFrameClass =
  "aspect-[3/4] rounded-lg overflow-hidden bg-secondary/30 lg:aspect-auto lg:h-[min(75vh,45rem)] lg:max-h-[45rem]";

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  const gallery = useMemo(() => getGalleryUrls(product), [product]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product.product_id]);

  const activeUrl = gallery[activeIndex] ?? product.image;

  if (!activeUrl) {
    return <div className={mainImageFrameClass} />;
  }

  return (
    <div className="space-y-3">
      <div className={mainImageFrameClass}>
        <img
          src={resolveAssetUrl(activeUrl)}
          alt={product.name}
          decoding="async"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-full object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
          role="tablist"
          aria-label={`${product.name} images`}
        >
          {gallery.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View image ${index + 1} of ${gallery.length}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "shrink-0 w-[4.5rem] h-[5.5rem] sm:w-20 sm:h-24 rounded-md overflow-hidden border-2 transition-colors",
                index === activeIndex
                  ? "border-primary ring-1 ring-primary/30 opacity-100"
                  : "border-border/60 opacity-65 hover:opacity-100 hover:border-primary/40",
              )}
            >
              <img
                src={resolveAssetUrl(url)}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
