import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatApiErrorMessage } from "@/lib/api-errors";
import { getMaxCartQuantity, isInStock } from "@/lib/stock";
import type { CartPreview, CartPreviewLine, Product } from "@/types/product";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

type CartPayloadItem = { product_id: number; size: string; quantity: number };

interface CartContextType {
  items: CartItem[];
  preview: CartPreview | undefined;
  isPreviewLoading: boolean;
  isPreviewError: boolean;
  previewError: string | null;
  getLinePreview: (productId: number, size: string) => CartPreviewLine | undefined;
  addItem: (product: Product, size: string, quantity?: number, options?: { replace?: boolean }) => boolean;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  canIncreaseQuantity: (product: Product, size: string, currentQuantity: number) => boolean;
  clearCart: () => void;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const cartPreviewKey = (payload: CartPayloadItem[]) =>
  ["cart-preview", JSON.stringify(payload)] as const;

const toPayload = (cartItems: CartItem[]): CartPayloadItem[] =>
  cartItems.map((item) => ({
    product_id: item.product.product_id,
    size: item.size,
    quantity: item.quantity,
  }));

const PREVIEW_FALLBACK = "Could not load totals. Check your connection.";
const CART_PREVIEW_DEBOUNCE_MS = 350;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const queryClient = useQueryClient();

  const cartPayload = useMemo(() => toPayload(items), [items]);
  const [debouncedPayload, setDebouncedPayload] = useState<CartPayloadItem[]>(cartPayload);

  useEffect(() => {
    if (cartPayload.length === 0) {
      setDebouncedPayload([]);
      return;
    }

    const timer = window.setTimeout(() => setDebouncedPayload(cartPayload), CART_PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [cartPayload]);

  const {
    data: preview,
    isFetching,
    isPending,
    isError: isPreviewError,
    error: previewQueryError,
  } = useQuery({
    queryKey: cartPreviewKey(debouncedPayload),
    queryFn: () => api.previewCart(debouncedPayload),
    enabled: debouncedPayload.length > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const previewError = useMemo(
    () =>
      isPreviewError
        ? formatApiErrorMessage(previewQueryError, PREVIEW_FALLBACK)
        : null,
    [isPreviewError, previewQueryError],
  );

  const isDebouncingPreview =
    items.length > 0 && JSON.stringify(cartPayload) !== JSON.stringify(debouncedPayload);

  const isPreviewLoading =
    isDebouncingPreview || (debouncedPayload.length > 0 && (isPending || (isFetching && !preview)));

  const getLinePreview = (productId: number, size: string) =>
    preview?.items.find((line) => line.product_id === productId && line.size === size);

  const applyCartChange = (updater: (prev: CartItem[]) => CartItem[]) => {
    setItems((prev) => updater(prev));
  };

  const canIncreaseQuantity = (product: Product, size: string, currentQuantity: number) => {
    const max = getMaxCartQuantity(product, size);
    if (max === null) {
      return true;
    }
    return currentQuantity < max;
  };

  const addItem = (
    product: Product,
    size: string,
    quantity = 1,
    options?: { replace?: boolean },
  ): boolean => {
    if (!isInStock(product, size)) {
      toast.error("This size is out of stock.");
      return false;
    }

    const max = getMaxCartQuantity(product, size);
    const replace = options?.replace ?? false;
    let added = false;

    applyCartChange((prev) => {
      const existing = prev.find(
        (i) => i.product.product_id === product.product_id && i.size === size,
      );

      const targetQuantity = existing
        ? replace
          ? quantity
          : existing.quantity + quantity
        : quantity;

      if (targetQuantity < 1) {
        return prev;
      }

      if (max !== null && targetQuantity > max) {
        toast.error(
          max === 1 ? "Only 1 item left in stock." : `Only ${max} available in stock.`,
        );
        return prev;
      }

      if (existing) {
        added = true;
        return prev.map((i) =>
          i.product.product_id === product.product_id && i.size === size
            ? { ...i, quantity: targetQuantity }
            : i,
        );
      }

      added = true;
      return [...prev, { product, size, quantity: targetQuantity }];
    });

    if (added) {
      setIsCartOpen(true);
    }

    return added;
  };

  const removeItem = (productId: number, size: string) => {
    applyCartChange((prev) =>
      prev.filter((i) => !(i.product.product_id === productId && i.size === size)),
    );
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    const item = items.find((i) => i.product.product_id === productId && i.size === size);
    if (!item) {
      return;
    }

    const max = getMaxCartQuantity(item.product, size);
    if (max !== null && quantity > max) {
      toast.error(max === 1 ? "Only 1 item left in stock." : `Only ${max} available in stock.`);
      quantity = max;
    }

    applyCartChange((prev) =>
      prev.map((i) =>
        i.product.product_id === productId && i.size === size ? { ...i, quantity } : i,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    queryClient.removeQueries({ queryKey: ["cart-preview"] });
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        preview,
        isPreviewLoading,
        isPreviewError,
        previewError,
        getLinePreview,
        addItem,
        removeItem,
        updateQuantity,
        canIncreaseQuantity,
        clearCart,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
