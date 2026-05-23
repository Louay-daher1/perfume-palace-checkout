import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { productCardImageSizes, resolveAssetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";
import ProductDiscountBadge from "@/components/ProductDiscountBadge";
import ProductPriceDisplay from "@/components/ProductPriceDisplay";
import { getLowestCompareAtPrice, getLowestEffectivePrice } from "@/lib/pricing";
import { isInStock, isProductOutOfStock } from "@/lib/stock";

interface ProductCardProps {
  product: Product;
  index: number;
  /** Small images for carousels */
  compact?: boolean;
  /** Taller images in 2-column product grids (products page) */
  grid?: boolean;
}

const ProductCard = ({ product, compact = false, grid = false }: ProductCardProps) => {
  const imageClass = cn(
    "overflow-hidden w-full",
    compact && "h-28 sm:h-36 lg:h-auto lg:aspect-[3/4]",
    grid && "aspect-[3/5] sm:aspect-[2/3] lg:aspect-[5/6] xl:aspect-[4/5]",
    !compact && !grid && "aspect-[3/4]",
  );
  const lowestPrice = getLowestEffectivePrice(product.prices);
  const compareAtPrice = getLowestCompareAtPrice(product.prices);
  const { addItem } = useCart();
  const quickAddSize =
    product.prices.find((p) => isInStock(product, p.size))?.size ?? product.prices[0]?.size;
  const canQuickAdd = quickAddSize ? isInStock(product, quickAddSize) : false;
  const outOfStock = isProductOutOfStock(product);
  const hasDiscount = Boolean(product.discount);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quickAddSize) {
      addItem(product, quickAddSize);
    }
  };

  return (
    <div>
      <Link to={`/product/${product.product_id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-secondary/30">
          {outOfStock && (
            <span
              className={cn(
                "absolute top-2 left-2 z-10 rounded font-sans font-semibold tracking-wider uppercase bg-foreground/85 text-background shadow-md",
                compact ? "px-1.5 py-0.5 text-[8px] sm:text-[9px]" : "px-2 py-1 text-[9px] sm:text-[10px]",
              )}
            >
              Out of Stock
            </span>
          )}
          {hasDiscount && product.discount && (
            <ProductDiscountBadge
              discount={product.discount}
              compact={compact}
              className="absolute top-2 right-2 z-10"
            />
          )}
          <div className={imageClass}>
            <img
              src={resolveAssetUrl(product.image)}
              alt={product.name}
              loading="lazy"
              decoding="async"
              width={400}
              height={512}
              sizes={productCardImageSizes(grid, compact)}
              className={cn(
                "w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-300 [@media(hover:hover)]:group-hover:scale-105",
                outOfStock && "opacity-60 saturate-50",
              )}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 [@media(hover:hover)]:group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-300 pointer-events-none" />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canQuickAdd}
            className={cn(
              "absolute bg-primary text-primary-foreground rounded-full opacity-100 md:opacity-0 [@media(hover:hover)]:md:group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-200 hover:scale-105 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
              compact ? "bottom-2 right-2 p-2" : grid ? "bottom-3 right-3 p-2.5 lg:bottom-2 lg:right-2 lg:p-2" : "bottom-3 right-3 p-2.5",
            )}
            title={canQuickAdd ? "Add to cart" : "Out of stock"}
          >
            <ShoppingBag
              className={cn(
                compact ? "h-3.5 w-3.5" : "h-4 w-4",
                grid && "lg:h-3.5 lg:w-3.5",
              )}
            />
          </button>
        </div>
        <div
          className={cn(
            "space-y-0.5",
            compact ? "mt-2 sm:mt-4" : grid ? "mt-2 sm:mt-3 lg:mt-2" : "mt-4 space-y-1",
          )}
        >
          <p
            className={cn(
              "font-sans tracking-[0.3em] text-primary uppercase",
              compact ? "text-[9px] sm:text-[10px]" : "text-[10px]",
            )}
          >
            {product.category}
          </p>
          <h3
            className={cn(
              "font-display text-foreground [@media(hover:hover)]:group-hover:text-primary motion-safe:transition-colors line-clamp-2",
              compact ? "text-sm sm:text-lg line-clamp-1" : grid ? "text-base sm:text-lg lg:text-base" : "text-lg",
            )}
          >
            {product.name}
          </h3>
          <p
            className={cn(
              "font-body text-muted-foreground italic line-clamp-2",
              compact ? "hidden sm:block text-sm" : grid ? "text-xs sm:text-sm lg:text-xs line-clamp-1" : "text-sm",
            )}
          >
            {product.tagline}
          </p>
          <ProductPriceDisplay
            prefix="From "
            price={lowestPrice}
            compareAtPrice={compareAtPrice}
            className={compact ? "text-xs sm:text-sm" : grid ? "text-sm lg:text-xs" : "text-sm"}
          />
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
