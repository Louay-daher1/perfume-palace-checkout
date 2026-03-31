import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Scents by AS" className="h-10 w-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold tracking-wider text-gold-gradient leading-tight">
              SCENTS BY AS
            </span>
            <span className="font-sans text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Perfume
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">
            Home
          </Link>
          <Link to="/products" className="font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">
            Collection
          </Link>
          <Link to="/products?category=Oriental" className="font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">
            Oriental
          </Link>
          <Link to="/products?category=Floral" className="font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">
            Floral
          </Link>
          <Link to="/products?category=Woody" className="font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">
            Woody
          </Link>
          <Link to="/products?category=Fresh" className="font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">
            Fresh
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans font-semibold">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">Collection</Link>
          <Link to="/products?category=Oriental" onClick={() => setIsMobileMenuOpen(false)} className="block font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">Oriental</Link>
          <Link to="/products?category=Floral" onClick={() => setIsMobileMenuOpen(false)} className="block font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">Floral</Link>
          <Link to="/products?category=Woody" onClick={() => setIsMobileMenuOpen(false)} className="block font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">Woody</Link>
          <Link to="/products?category=Fresh" onClick={() => setIsMobileMenuOpen(false)} className="block font-sans text-sm tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase">Fresh</Link>
        </div>
      )}
  );
};

export default Navbar;
