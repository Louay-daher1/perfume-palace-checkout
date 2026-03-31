import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <img src={logo} alt="Scents by AS" className="h-16 w-16 rounded-full object-cover" />
          <h3 className="font-display text-xl text-gold-gradient">SCENTS BY AS</h3>
          <p className="font-body text-muted-foreground max-w-md">
            Crafting exquisite fragrances that tell your story. Each scent is a masterpiece, designed to leave an unforgettable impression.
          </p>
          <div className="flex gap-6 font-sans text-xs tracking-wider text-muted-foreground uppercase">
            <span>Free Shipping</span>
            <span className="text-primary">•</span>
            <span>Cash on Delivery</span>
            <span className="text-primary">•</span>
            <span>Premium Quality</span>
          </div>
          <p className="font-sans text-xs text-muted-foreground/60 mt-4">
            © 2026 Scents by AS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
