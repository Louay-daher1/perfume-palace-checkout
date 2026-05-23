import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ProductSort } from "@/lib/product-sort";

export const productKeys = {
  all: ["products"] as const,
  list: (category?: string) => [...productKeys.all, "list", category ?? "all"] as const,
  listPaginated: (category?: string, page?: number, perPage?: number, sort?: ProductSort) =>
    [...productKeys.all, "list", "paginated", category ?? "all", page ?? 1, perPage ?? 12, sort ?? "latest"] as const,
  detail: (productId: number) => [...productKeys.all, "detail", productId] as const,
  variantPrice: (productId: number, size: string) =>
    [...productKeys.all, "variant-price", productId, size] as const,
  categories: ["categories"] as const,
  slides: ["slides"] as const,
};

export const CAROUSEL_PRODUCT_LIMIT = 10;
const PRODUCTS_PER_PAGE = 12;

export function useProductsPaginated(
  category?: string,
  page = 1,
  perPage = PRODUCTS_PER_PAGE,
  sort: ProductSort = "latest",
) {
  return useQuery({
    queryKey: productKeys.listPaginated(category, page, perPage, sort),
    queryFn: () =>
      api.getProductsPaginated({
        category,
        page,
        per_page: perPage,
        sort,
      }),
  });
}

export function useNewArrivals(limit = 10) {
  return useQuery({
    queryKey: [...productKeys.all, "new-arrivals", limit] as const,
    queryFn: () => api.getProducts({ sort: "latest", limit }),
  });
}

export function useBestSellers(limit = CAROUSEL_PRODUCT_LIMIT) {
  return useQuery({
    queryKey: [...productKeys.all, "best-sellers", limit] as const,
    queryFn: () => api.getProducts({ sort: "bestseller", limit }),
  });
}

export function useProductsByCategory(
  category: string | undefined,
  excludeProductId?: number,
  limit = CAROUSEL_PRODUCT_LIMIT,
) {
  return useQuery({
    queryKey: [...productKeys.all, "by-category", category, excludeProductId, limit] as const,
    queryFn: async () => {
      const products = await api.getProducts({ category, limit: limit + 1 });
      return products.filter((p) => p.product_id !== excludeProductId).slice(0, limit);
    },
    enabled: Boolean(category),
  });
}

export function useProduct(productId: number | undefined) {
  return useQuery({
    queryKey: productKeys.detail(productId ?? 0),
    queryFn: () => api.getProduct(productId!),
    enabled: Boolean(productId),
  });
}

export function useProductVariantPrice(productId: number | undefined, size: string | undefined) {
  return useQuery({
    queryKey: productKeys.variantPrice(productId ?? 0, size ?? ""),
    queryFn: () => api.getProductVariantPrice(productId!, size!),
    enabled: Boolean(productId && size),
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: () => api.getCategories(),
  });
}

export function useSlides() {
  return useQuery({
    queryKey: productKeys.slides,
    queryFn: () => api.getSlides(),
  });
}
