import { X, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resolveAssetUrl } from "@/lib/assets";
import { formatSize } from "@/lib/size";
import { isInStock, stockStatusLabel } from "@/lib/stock";

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    preview,
    isPreviewLoading,
    previewError,
    getLinePreview,
    updateQuantity,
    removeItem,
    canIncreaseQuantity,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 flex flex-col border-l border-border"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl text-foreground">Your Cart</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-muted-foreground text-center font-body text-lg mt-12">Your cart is empty</p>
              ) : (
                items.map((item) => {
                  const line = getLinePreview(item.product.product_id, item.size);
                  const outOfStock = !isInStock(item.product, item.size);
                  const stockHint = stockStatusLabel(item.product, item.size);
                  const canIncrease = canIncreaseQuantity(
                    item.product,
                    item.size,
                    item.quantity,
                  );

                  return (
                    <div
                      key={`${item.product.product_id}-${item.size}`}
                      className="flex gap-4 bg-secondary/50 rounded-lg p-3"
                    >
                      <img
                        src={resolveAssetUrl(item.product.image)}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm text-foreground">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground font-sans">{formatSize(item.size)}</p>
                        {(outOfStock || stockHint) && (
                          <p
                            className={`text-xs font-sans mt-0.5 ${
                              outOfStock ? "text-destructive" : "text-amber-600 dark:text-amber-500"
                            }`}
                          >
                            {outOfStock ? "Out of stock — remove to continue" : stockHint}
                          </p>
                        )}
                        {line ? (
                          <p className="text-sm text-primary font-sans font-semibold">
                            ${line.line_total.toFixed(2)}
                            {item.quantity > 1 && (
                              <span className="text-muted-foreground font-normal text-xs ml-1">
                                (${line.unit_price.toFixed(2)} each)
                              </span>
                            )}
                          </p>
                        ) : isPreviewLoading ? (
                          <p className="text-xs text-muted-foreground font-sans animate-pulse">Updating…</p>
                        ) : null}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.product_id, item.size, item.quantity - 1)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-sans min-w-[1.25rem] text-center">{item.quantity}</span>
                          <button
                            type="button"
                            disabled={!canIncrease || outOfStock}
                            onClick={() => updateQuantity(item.product.product_id, item.size, item.quantity + 1)}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                            title={!canIncrease ? "Maximum stock reached" : undefined}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.product_id, item.size)}
                            className="ml-auto text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                {previewError && (
                  <p className="text-sm text-destructive font-sans text-center">{previewError}</p>
                )}
                {preview && preview.quantity_savings > 0 && (
                  <div className="flex justify-between font-sans text-sm text-muted-foreground">
                    <span>Quantity savings</span>
                    <span>-${preview.quantity_savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-sans items-center">
                  <span className="text-muted-foreground">Total</span>
                  {preview ? (
                    <span className="text-lg font-semibold text-primary">${preview.total.toFixed(2)}</span>
                  ) : isPreviewLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <span className="text-lg font-semibold text-muted-foreground">—</span>
                  )}
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className={`block w-full text-center py-3 bg-gold-gradient text-primary-foreground font-sans font-semibold text-sm tracking-wider uppercase rounded hover:opacity-90 transition-opacity ${
                    !preview || isPreviewLoading || previewError
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  Checkout — Cash on Delivery
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
