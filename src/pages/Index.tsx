import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Luxury perfume collection" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <p className="font-sans text-xs tracking-[0.5em] text-primary uppercase mb-4">Luxury Fragrances</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gold-gradient leading-tight mb-6">
            Scents by AS
          </h1>
          <p className="font-body text-xl md:text-2xl text-foreground/80 mb-8 italic">
            Where every drop tells a story of elegance
          </p>
          <Link
            to="/products"
            className="inline-block px-10 py-4 bg-gold-gradient text-primary-foreground font-sans font-semibold text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity rounded"
          >
            Explore Collection
          </Link>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.4em] text-primary uppercase mb-2">Our Collection</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Signature Fragrances</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative rounded-lg overflow-hidden bg-secondary p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gold-gradient opacity-5" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">Cash on Delivery Available</h2>
            <p className="font-body text-lg text-muted-foreground mb-6">
              Order your favourite fragrance and pay when it arrives at your doorstep.
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 border border-primary text-primary font-sans text-sm tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-colors rounded"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
