import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Youtube } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Services", href: "#services" },
  { label: "Videos", href: "#videos" },
  { label: "Gallery", href: "#gallery" },
  { label: "Pricing", href: "/pricing", external: true },
  { label: "Blog", href: "#blog" },
  { label: "Book Now", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (link: { href: string; external?: boolean }) => {
    if (link.external) {
      if (open) setOpen(false);
      navigate(link.href);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/" + link.href);
      return;
    }
    if (open) {
      setOpen(false);
      setTimeout(() => {
        const el = document.querySelector(link.href);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.querySelector(link.href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleClick({ href: "#hero" }); }}
          className="text-2xl font-display text-gradient-fire tracking-wider"
        >
          VIVEK TARALE
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleClick(link); }}
              className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 ml-2">
            <a href="https://www.instagram.com/tarale_vivek?igsh=dHJvN2puNHI3Ymgx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@VivekTarale0" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border">
            <SheetTitle className="text-gradient-fire font-display text-xl">VIVEK TARALE</SheetTitle>
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleClick(link); }}
                  className="text-lg font-body text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <a href="https://www.instagram.com/tarale_vivek?igsh=dHJvN2puNHI3Ymgx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@VivekTarale0" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Youtube className="w-5 h-5" />
                </a>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
