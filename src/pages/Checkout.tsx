import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Order placed successfully! We will contact you shortly.");
    clearCart();
    navigate("/");
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

        {/* Order Summary */}
        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <h2 className="font-display text-lg text-foreground mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="font-body text-foreground/80">
                {item.product.name} ({item.size}) × {item.quantity}
              </span>
              <span className="font-sans text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 mt-2">
            <span className="font-sans font-semibold text-foreground">Total</span>
            <span className="font-display text-xl text-gold-gradient">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">Phone Number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">Delivery Address *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Street address"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">City *</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full bg-secondary border border-border rounded px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="City"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase block mb-1">Notes (optional)</label>
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
            className="w-full py-4 bg-gold-gradient text-primary-foreground font-sans font-semibold text-sm tracking-[0.2em] uppercase rounded hover:opacity-90 transition-opacity mt-4"
          >
            Place Order — Pay on Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
