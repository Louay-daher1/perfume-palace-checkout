export type ProductSort = "latest" | "bestseller" | "price_asc" | "price_desc";

export const PRODUCT_SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "latest", label: "New Arrivals" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function parseProductSort(value: string | null): ProductSort {
  if (value && PRODUCT_SORT_OPTIONS.some((o) => o.value === value)) {
    return value as ProductSort;
  }

  return "latest";
}
