import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/use-products";
import { resolveAssetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

const CategoryGrid = () => {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 pt-8 sm:pt-10 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-xl bg-secondary/40 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !categories?.length) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 pt-8 sm:pt-10 pb-2">
      <div className="text-center mb-8 sm:mb-10">
        <p className="font-sans text-xs tracking-[0.4em] text-primary uppercase mb-2">
          Shop by
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
          Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <article
                className={cn(
                  "relative overflow-hidden rounded-xl border border-border/40 bg-secondary/30",
                  "shadow-sm transition-all duration-300",
                  "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
                )}
              >
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
                  {category.image_url ? (
                    <img
                      src={resolveAssetUrl(category.image_url)}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-secondary/60">
                      <span className="font-display text-3xl sm:text-4xl text-primary/30">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />
                </div>
                <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 lg:p-4">
                  <h3 className="font-display text-base sm:text-lg lg:text-lg text-foreground leading-tight">
                    {category.name}
                  </h3>
                  <p className="mt-1 font-sans text-[10px] sm:text-xs tracking-[0.2em] text-primary uppercase opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Explore
                  </p>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
