import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const lowestPrice = product.prices[0].price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-secondary/30">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={800}
              height={1024}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="mt-4 space-y-1">
          <p className="font-sans text-[10px] tracking-[0.3em] text-primary uppercase">{product.category}</p>
          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="font-body text-sm text-muted-foreground italic">{product.tagline}</p>
          <p className="font-sans text-sm text-primary font-semibold">From ${lowestPrice}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
