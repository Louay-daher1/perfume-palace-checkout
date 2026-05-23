import type { ProductDiscount } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductDiscountBadgeProps {
  discount: ProductDiscount;
  compact?: boolean;
  className?: string;
}

const ProductDiscountBadge = ({ discount, compact = false, className }: ProductDiscountBadgeProps) => (
  <span
    className={cn(
      "rounded font-sans font-semibold tracking-wider uppercase bg-primary text-primary-foreground shadow-md",
      compact ? "px-1.5 py-0.5 text-[8px] sm:text-[9px]" : "px-2 py-1 text-[9px] sm:text-[10px]",
      className,
    )}
  >
    {discount.label}
  </span>
);

export default ProductDiscountBadge;
