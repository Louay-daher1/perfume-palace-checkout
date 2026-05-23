import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCategories } from "@/hooks/use-products";
import { cn } from "@/lib/utils";

const linkClass =
  "font-sans text-xs tracking-[0.15em] text-foreground/75 hover:text-primary transition-colors uppercase whitespace-nowrap";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: categories } = useCategories();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Collection", to: "/products" },
    ...(categories?.map((cat) => ({
      label: cat.name,
      to: `/products?category=${encodeURIComponent(cat.name)}`,
    })) ?? []),
  ];

  const categoryLinks = categories?.map((cat) => ({
    label: cat.name,
    to: `/products?category=${encodeURIComponent(cat.name)}`,
  })) ?? [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-border lg:bg-background/80 lg:backdrop-blur-md">
      <div className="container mx-auto h-16 px-4 relative flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-8">
        {/* Mobile menu + desktop brand */}
        <div className="flex items-center gap-4 z-10">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground/80 hover:text-primary transition-colors lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link
            to="/"
            className={cn(
              "font-display font-semibold tracking-wider text-gold-gradient leading-tight",
              "absolute left-1/2 -translate-x-1/2 text-base sm:text-lg",
              "lg:static lg:translate-x-0 lg:text-lg",
            )}
          >
            SCENTS BY AS
          </Link>
        </div>

        {/* Desktop — categories centered */}
        <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 min-w-0">
          <Link to="/" className={cn(linkClass, "px-2 xl:px-3")}>
            Home
          </Link>
          <Link to="/products" className={cn(linkClass, "px-2 xl:px-3")}>
            Collection
          </Link>
          {categoryLinks.length > 0 && (
            <span className="mx-1 xl:mx-2 h-4 w-px bg-border shrink-0" aria-hidden />
          )}
          {categoryLinks.map((link) => (
            <Link key={link.to} to={link.to} className={cn(linkClass, "px-2 xl:px-3")}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Cart */}
        <div className="flex justify-end z-10 lg:justify-self-end">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans font-semibold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 space-y-3 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
