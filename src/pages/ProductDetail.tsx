import { useParams, Link } from "react-router-dom";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useProduct, useProductVariantPrice } from "@/hooks/use-products";
import { useCart } from "@/context/CartContext";
import PageLoader from "@/components/PageLoader";
import ProductImageGallery from "@/components/ProductImageGallery";
import BundleSaveSelector from "@/components/BundleSaveSelector";
import ProductDiscountBadge from "@/components/ProductDiscountBadge";
import { parseProductIdParam } from "@/lib/product-id";
import { formatSize } from "@/lib/size";
import { buildBundleTierOptions, filterBundleOptionsByStock } from "@/lib/quantity-tiers";
import ProductPriceDisplay from "@/components/ProductPriceDisplay";
import { getEffectivePrice } from "@/lib/pricing";
import { getMaxCartQuantity, isInStock, stockStatusLabel } from "@/lib/stock";
import { buildProductOrderMessage, openWhatsAppChat } from "@/lib/whatsapp";
const RelatedCategoryCarousel = lazy(() => import("@/components/RelatedCategoryCarousel"));

const ProductDetail = () => {
  const { productId: productIdParam } = useParams();
  const productId = parseProductIdParam(productIdParam);
  const { data: product, isLoading, isError } = useProduct(productId);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (!product?.prices.length) {
      return;
    }

    setSelectedSize((current) => {
      if (current && product.prices.some((p) => p.size === current && isInStock(product, p.size))) {
        return current;
      }
      const firstAvailable = product.prices.find((p) => isInStock(product, p.size));
      return firstAvailable?.size ?? product.prices[0].size;
    });
  }, [product]);

  const {
    data: variantPrice,
    isLoading: isPriceLoading,
    isError: isPriceError,
  } = useProductVariantPrice(product?.product_id, selectedSize);

  const listPrice = variantPrice?.price ?? 0;
  const unitPrice = variantPrice ? getEffectivePrice(variantPrice) : 0;

  const bundleOptions = useMemo(() => {
    if (!product || !unitPrice) {
      return [];
    }
    const options = buildBundleTierOptions(unitPrice, product.quantity_offers);
    const maxQty = selectedSize ? getMaxCartQuantity(product, selectedSize) : null;
    return filterBundleOptionsByStock(options, maxQty);
  }, [product, unitPrice, selectedSize]);

  useEffect(() => {
    if (!bundleOptions.length) {
      setSelectedQuantity(1);
      return;
    }
    if (!bundleOptions.some((o) => o.quantity === selectedQuantity)) {
      setSelectedQuantity(bundleOptions[0].quantity);
    }
  }, [bundleOptions, selectedQuantity]);

  const selectedBundle = bundleOptions.find((o) => o.quantity === selectedQuantity);
  const displayTotal = selectedBundle?.total ?? unitPrice;

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground font-body text-xl">Product not found</p>
      </div>
    );
  }

  const hasNotes =
    product.notes &&
    (product.notes.top.length > 0 || product.notes.middle.length > 0 || product.notes.base.length > 0);

  const selectedInStock = selectedSize ? isInStock(product, selectedSize) : false;
  const canAddToCart = Boolean(variantPrice) && !isPriceLoading && selectedInStock;

  const handleAddToCart = () => {
    if (!canAddToCart) {
      return;
    }
    addItem(product, selectedSize, selectedQuantity, { replace: true });
  };

  const handleBuyOnWhatsApp = () => {
    if (!canAddToCart) {
      return;
    }

    const message = buildProductOrderMessage({
      productName: product.name,
      productId: product.product_id,
      size: selectedSize,
      quantity: selectedQuantity,
      unitPrice,
      totalPrice: displayTotal,
      productUrl: `${window.location.origin}/product/${product.product_id}`,
    });

    if (!openWhatsAppChat(message)) {
      toast.error("WhatsApp number is not set. Add VITE_WHATSAPP_NUMBER to your .env file.");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start">
          <ProductImageGallery product={product} />

          <div className="flex flex-col justify-center lg:justify-start">
            <p className="font-sans text-xs tracking-[0.4em] text-primary uppercase mb-2">{product.category}</p>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-4xl md:text-5xl text-foreground">{product.name}</h1>
              {product.discount && <ProductDiscountBadge discount={product.discount} />}
            </div>
            <p className="font-body text-lg text-muted-foreground italic mb-6">{product.tagline}</p>

            {isPriceError ? (
              <p className="font-body text-sm text-destructive mb-6">Could not load price for this size.</p>
            ) : variantPrice ? (
              <ProductPriceDisplay
                price={unitPrice}
                compareAtPrice={variantPrice.sale_price != null ? listPrice : null}
                className="font-display text-3xl mb-6"
                priceClassName="text-gold-gradient"
                compareClassName="text-lg"
              />
            ) : (
              <span className="inline-block h-8 w-24 bg-secondary/60 rounded animate-pulse mb-6" />
            )}

            <p className="font-body text-base text-foreground/80 leading-relaxed mb-8">{product.description}</p>

            {hasNotes && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {(["top", "middle", "base"] as const).map((type) => (
                  <div key={type} className="bg-secondary/50 rounded-lg p-4 text-center">
                    <p className="font-sans text-[10px] tracking-[0.2em] text-primary uppercase mb-2">
                      {type} Notes
                    </p>
                    {product.notes![type].map((note) => (
                      <p key={note} className="font-body text-sm text-foreground/80">
                        {note}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase mb-3">
                Style — {selectedSize ? formatSize(selectedSize) : "Select size"}
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.prices.map((p) => {
                  const sizeOutOfStock = p.stock !== null && p.stock < 1;
                  const sizeStockHint = stockStatusLabel(product, p.size);

                  return (
                    <button
                      key={p.size}
                      type="button"
                      disabled={sizeOutOfStock}
                      onClick={() => setSelectedSize(p.size)}
                      className={`px-6 py-3 rounded border font-sans text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        selectedSize === p.size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50 bg-background"
                      }`}
                    >
                      {formatSize(p.size)}
                      {sizeStockHint && (
                        <span
                          className={`block text-[10px] tracking-wide mt-0.5 leading-tight ${
                            sizeOutOfStock
                              ? "uppercase text-destructive"
                              : selectedSize === p.size
                                ? "text-primary-foreground/80"
                                : "text-amber-600 dark:text-amber-500"
                          }`}
                        >
                          {sizeStockHint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <BundleSaveSelector
              options={bundleOptions}
              selectedQuantity={selectedQuantity}
              onSelect={setSelectedQuantity}
              disabled={!canAddToCart}
            />

            <div className="space-y-3">
              <button
                type="button"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-sans font-semibold text-sm tracking-wider uppercase rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Add to Bag</span>
                <ArrowRight className="h-4 w-4" />
                {canAddToCart && (
                  <span className="opacity-90">• ${displayTotal.toFixed(2)}</span>
                )}
              </button>

              <button
                type="button"
                disabled={!canAddToCart}
                onClick={handleBuyOnWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-[#25D366] text-[#25D366] font-sans font-semibold text-sm tracking-wider uppercase rounded hover:bg-[#25D366]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="h-4 w-4" />
                Buy on WhatsApp
                {canAddToCart && (
                  <span className="opacity-90 normal-case tracking-normal">• ${displayTotal.toFixed(2)}</span>
                )}
              </button>
            </div>

            <p className="mt-4 font-sans text-xs text-muted-foreground text-center">
              Cash on Delivery Available
            </p>
          </div>
        </div>

        {product.category && (
          <Suspense fallback={null}>
            <RelatedCategoryCarousel category={product.category} excludeProductId={product.product_id} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
