import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";
import { useCategories } from "@/hooks/use-products";
import {
  CONTACT_INSTAGRAM_HANDLE,
  CONTACT_INSTAGRAM_URL,
  CONTACT_PHONE,
  CONTACT_PHONE_E164,
  DAHER_TECH_INSTAGRAM_URL,
  getContactEmail,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

const menuLinks = [
  { label: "Home", to: "/" },
  { label: "Collection", to: "/products" },
  { label: "Checkout", to: "/checkout" },
];

const sectionTitleClass =
  "font-sans text-xs tracking-[0.25em] text-primary uppercase mb-4 lg:mb-5";

const linkClass =
  "font-body text-sm text-muted-foreground hover:text-primary transition-colors";

const Footer = () => {
  const { data: categories } = useCategories();
  const email = getContactEmail();
  const categoryCount = categories?.length ?? 0;

  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container mx-auto px-4 py-12 md:py-14 lg:py-16">
        <div
          className={cn(
            "grid grid-cols-1 gap-10",
            "sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10",
            "lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 lg:items-start",
            "xl:gap-x-14",
          )}
        >
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-5 lg:pr-4">
            <h3 className="font-display text-xl lg:text-2xl text-gold-gradient mb-3">SCENTS BY AS</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
              Crafting exquisite fragrances that tell your story. Each scent is a masterpiece, designed
              to leave an unforgettable impression.
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-2 mt-5 font-sans text-[10px] tracking-wider text-muted-foreground uppercase">
              <span>Free Shipping</span>
              <span className="text-primary" aria-hidden>
                •
              </span>
              <span>Cash on Delivery</span>
              <span className="text-primary" aria-hidden>
                •
              </span>
              <span>Premium Quality</span>
            </div>
          </div>

          {/* Menu */}
          <div className="lg:col-span-2">
            <h4 className={sectionTitleClass}>Menu</h4>
            <ul className="space-y-2.5">
              {menuLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className={sectionTitleClass}>Categories</h4>
            {categories && categories.length > 0 ? (
              <ul
                className={cn(
                  "space-y-2.5",
                  categoryCount > 5 && "sm:columns-2 sm:gap-x-6 lg:columns-1 xl:columns-2 xl:gap-x-8",
                )}
              >
                {categories.map((cat) => (
                  <li key={cat.id} className="break-inside-avoid">
                    <Link
                      to={`/products?category=${encodeURIComponent(cat.name)}&page=1&sort=latest`}
                      className={linkClass}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-sm text-muted-foreground">Loading categories…</p>
            )}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 xl:col-span-2">
            <h4 className={sectionTitleClass}>Contact Us</h4>
            <ul className="space-y-3.5">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className={`${linkClass} inline-flex items-start gap-2.5 max-w-full`}>
                    <Mail className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden />
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              )}
              <li>
                <a href={`tel:${CONTACT_PHONE_E164}`} className={`${linkClass} inline-flex items-center gap-2.5`}>
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{CONTACT_PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-start gap-2.5`}
                >
                  <Instagram className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden />
                  <span className="break-words">
                    {CONTACT_INSTAGRAM_HANDLE}
                    <span className="sr-only"> (opens in new tab)</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 lg:flex lg:items-center lg:justify-between lg:gap-6">
          <p className="font-sans text-xs text-muted-foreground/60 text-center lg:text-left">
            © {new Date().getFullYear()}{" "}
            <a
              href={DAHER_TECH_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Daher Tech
            </a>
            . All rights reserved.
            <span className="sr-only"> (opens Daher Tech Instagram in a new tab)</span>
          </p>
          <p className="hidden lg:block font-sans text-[10px] tracking-[0.2em] text-muted-foreground/50 uppercase">
            Scents by AS — Luxury Fragrances
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
