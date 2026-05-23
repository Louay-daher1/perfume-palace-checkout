import type { ProductPrice } from "@/types/product";

/** Price the customer pays (sale price when discounted). */
export function getEffectivePrice(variant: Pick<ProductPrice, "price" | "sale_price">): number {
  return variant.sale_price ?? variant.price;
}

export function isOnSale(variant: Pick<ProductPrice, "price" | "sale_price">): boolean {
  return variant.sale_price !== undefined && variant.sale_price < variant.price;
}

/** Lowest effective price across variants (for “From $X”). */
export function getLowestEffectivePrice(prices: ProductPrice[]): number {
  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices.map((p) => getEffectivePrice(p)));
}

/** Original list price for the variant with the lowest effective price. */
export function getLowestCompareAtPrice(prices: ProductPrice[]): number | null {
  if (!prices.length) {
    return null;
  }

  const lowestEffective = getLowestEffectivePrice(prices);
  const match = prices.find((p) => getEffectivePrice(p) === lowestEffective);

  if (!match || !isOnSale(match)) {
    return null;
  }

  return match.price;
}
