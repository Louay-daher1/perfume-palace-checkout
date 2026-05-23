import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { formatSize } from "@/lib/size";

const Checkout = () => {
  const { items, preview, isPreviewLoading, previewError, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });

  const cartItems = items.map((item) => ({
    product_id: item.product.product_id,
    size: item.size,
    quantity: item.quantity,
  }));

  const placeOrder = useMutation({
    mutationFn: () =>
      api.createOrder({
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          notes: form.notes || undefined,
        },
        payment_method: "cod",
        items: cartItems,
      }),
    onSuccess: () => {
      toast.success("Thank you for your order. We will contact you shortly to confirm delivery.");
      clearCart();
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof ApiError && error.validationErrors) {
        const firstError = Object.values(error.validationErrors)[0]?.[0];
        toast.error(firstError ?? "Please check your order details.");
        return;
      }
      toast.error("Could not place order. Make sure the backend is running.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (previewError) {
      toast.error(previewError);
      return;
    }
    if (!preview) {
      toast.error("Waiting for order totals from the server.");
      return;
    }
    placeOrder.mutate();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-body text-xl">Your cart is empty</p>
        <button onClick={() => navigate("/products")} className="text-primary font-sans text-sm underline">
          Browse collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <p className="font-sans text-xs tracking-[0.4em] text-primary uppercase mb-2">Checkout</p>
          <h1 className="font-display text-3xl text-foreground">Cash on Delivery</h1>
        </div>

        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <h2 className="font-display text-lg text-foreground mb-4">Order Summary</h2>
          {previewError && (
            <p className="text-sm text-destructive font-sans mb-4">{previewError}</p>
          )}
          {preview?.items.map((line) => (
            <div
              key={`${line.product_id}-${line.size}`}
              className="flex justify-between py-2 border-b border-border last:border-0 gap-4"
            >
              <span className="font-body text-foreground/80">
                {line.product_name} ({formatSize(line.size)}) × {line.quantity}
              </span>
              <span className="font-sans text-sm text-primary shrink-0">${line.line_total.toFixed(2)}</span>
            </div>
          ))}
          {!preview && isPreviewLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground font-sans text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating totals…
            </div>
          )}
          {preview && preview.quantity_savings > 0 && (
            <div className="flex justify-between py-2 text-sm text-muted-foreground">
              <span>Quantity savings</span>
              <span>-${preview.quantity_savings.toFixed(2)}</span>
            </div>
          )}
          {preview && preview.discount_savings > 0 && (
            <div className="flex justify-between py-2 text-sm text-muted-foreground">
              <span>Discount</span>
              <span>-${preview.discount_savings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-4 mt-2 items-center">
            <span className="font-sans font-semibold text-foreground">Total</span>
            {preview ? (
              <span className="font-display text-xl text-gold-gradient">${preview.total.toFixed(2)}</span>
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">
              Delivery Address *
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Street address"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">
              City *
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="City"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder="Any special instructions"
            />
          </div>

          <button
            type="submit"
            disabled={placeOrder.isPending || !preview || isPreviewLoading || Boolean(previewError)}
            className="w-full py-4 bg-gold-gradient text-primary-foreground font-sans font-semibold text-sm tracking-[0.2em] uppercase rounded hover:opacity-90 transition-opacity mt-4 disabled:opacity-60"
          >
            {placeOrder.isPending ? "Placing Order..." : "Place Order — Pay on Delivery"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
