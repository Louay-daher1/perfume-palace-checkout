import { cn } from "@/lib/utils";

interface ProductPriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  priceClassName?: string;
  compareClassName?: string;
  prefix?: string;
}

const ProductPriceDisplay = ({
  price,
  compareAtPrice,
  className,
  priceClassName,
  compareClassName,
  prefix,
}: ProductPriceDisplayProps) => {
  const onSale = compareAtPrice != null && compareAtPrice > price;

  return (
    <p className={cn("font-sans font-semibold", className)}>
      {prefix}
      <span className={cn(onSale ? "text-primary" : "text-primary", priceClassName)}>
        ${price.toFixed(2)}
      </span>
      {onSale && (
        <span
          className={cn(
            "ml-2 text-muted-foreground font-normal line-through",
            compareClassName,
          )}
        >
          ${compareAtPrice.toFixed(2)}
        </span>
      )}
    </p>
  );
};

export default ProductPriceDisplay;
