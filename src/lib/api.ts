import type { ProductSort } from "@/lib/product-sort";
import type {
  CartPreview,
  Category,
  OrderPayload,
  OrderResponse,
  PaginatedProducts,
  Product,
  Slide,
  VariantPrice,
} from "@/types/product";

/**
 * In dev, use same origin as the page (Vite proxies /api → Laravel on this PC).
 * Phone only needs http://YOUR_IP:8080 — not port 8000.
 */
export function resolveApiBase(): string {
  if (import.meta.env.DEV && typeof window !== "undefined") {
    return `${window.location.origin}/api/v1`;
  }

  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (fromEnv) {
    return fromEnv;
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:8000/api/v1`;
    }
  }

  return "http://localhost:8000/api/v1";
}

const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: Record<string, unknown>,
  ) {
    super(typeof body.message === "string" ? body.message : "Request failed");
    this.name = "ApiError";
  }

  get validationErrors(): Record<string, string[]> | undefined {
    const errors = this.body.errors;
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      return errors as Record<string, string[]>;
    }
    return undefined;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const apiBase = resolveApiBase();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(response.status, body as Record<string, unknown>);
    }

    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "Cannot reach the server. On your PC run: php artisan serve (port 8000) and npm run dev (port 8080).",
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export const api = {
  getProducts: (params?: { category?: string; sort?: "latest" | "bestseller"; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.category) {
      search.set("category", params.category);
    }
    if (params?.sort) {
      search.set("sort", params.sort);
    }
    if (params?.limit) {
      search.set("limit", String(params.limit));
    }
    const query = search.toString();
    return request<Product[]>(`/products${query ? `?${query}` : ""}`);
  },

  getProductsPaginated: (params?: {
    category?: string;
    page?: number;
    per_page?: number;
    sort?: ProductSort;
  }) => {
    const search = new URLSearchParams();
    search.set("page", String(params?.page ?? 1));
    search.set("per_page", String(params?.per_page ?? 12));
    if (params?.category) {
      search.set("category", params.category);
    }
    if (params?.sort) {
      search.set("sort", params.sort);
    }
    return request<PaginatedProducts>(`/products?${search}`);
  },

  getProduct: (productId: number) => request<Product>(`/products/${productId}`),

  getProductVariantPrice: (productId: number, size: string) =>
    request<VariantPrice>(
      `/products/${productId}/price?size=${encodeURIComponent(size)}`,
    ),

  getCategories: () => request<Category[]>("/categories"),

  getSlides: () => request<Slide[]>("/slides"),

  previewCart: (items: OrderPayload["items"], discountCode?: string) =>
    request<CartPreview>("/cart/preview", {
      method: "POST",
      body: JSON.stringify({ items, discount_code: discountCode }),
    }),

  createOrder: async (payload: OrderPayload) => {
    const body = await request<OrderResponse | { data: OrderResponse }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (body && typeof body === "object" && "data" in body && body.data) {
      return body.data;
    }

    return body as OrderResponse;
  },
};
