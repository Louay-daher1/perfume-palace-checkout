import type { Product } from "@/types/product";

/** `null` = unlimited stock (not tracked). */
export function getVariantStock(product: Product, size: string): number | null {
  const variant = product.prices.find((p) => p.size === size);
  if (!variant || variant.stock === undefined) {
    return null;
  }
  return variant.stock;
}

export function isInStock(product: Product, size: string): boolean {
  const stock = getVariantStock(product, size);
  return stock === null || stock > 0;
}

/** True when every size is unavailable (all tracked variants at 0). */
export function isProductOutOfStock(product: Product): boolean {
  if (!product.prices.length) {
    return false;
  }

  return !product.prices.some((p) => isInStock(product, p.size));
}

export function getMaxCartQuantity(product: Product, size: string): number | null {
  const stock = getVariantStock(product, size);
  if (stock === null) {
    return null;
  }
  return Math.max(0, stock);
}

export function stockStatusLabel(product: Product, size: string): string | null {
  const stock = getVariantStock(product, size);
  if (stock === null) {
    return null;
  }
  if (stock < 1) {
    return "Out of stock";
  }
  if (stock <= 5) {
    return `Only ${stock} left in stock`;
  }
  return null;
}
