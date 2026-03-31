import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground font-body text-xl">Product not found</p>
      </div>
    );
  }

  const currentPrice = product.prices[selectedSize];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary/30"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="font-sans text-xs tracking-[0.4em] text-primary uppercase mb-2">{product.category}</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-2">{product.name}</h1>
            <p className="font-body text-lg text-muted-foreground italic mb-6">{product.tagline}</p>
            <p className="font-body text-base text-foreground/80 leading-relaxed mb-8">{product.description}</p>

            {/* Notes */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {(["top", "middle", "base"] as const).map((type) => (
                <div key={type} className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="font-sans text-[10px] tracking-[0.2em] text-primary uppercase mb-2">{type} Notes</p>
                  {product.notes[type].map((note) => (
                    <p key={note} className="font-body text-sm text-foreground/80">{note}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase mb-3">Select Size</p>
              <div className="flex gap-3">
                {product.prices.map((p, i) => (
                  <button
                    key={p.size}
                    onClick={() => setSelectedSize(i)}
                    className={`px-6 py-3 rounded border font-sans text-sm transition-colors ${
                      selectedSize === i
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {p.size} — ${p.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl text-gold-gradient">${currentPrice.price}</span>
              <button
                onClick={() => addItem(product, currentPrice.size, currentPrice.price)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gold-gradient text-primary-foreground font-sans font-semibold text-sm tracking-wider uppercase rounded hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>

            <p className="mt-4 font-sans text-xs text-muted-foreground text-center">
              💰 Cash on Delivery Available
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
