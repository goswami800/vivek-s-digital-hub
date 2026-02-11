import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const CoffeeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      const welcomeDismissed = sessionStorage.getItem("welcome_dismissed");
      const coffeeDismissed = sessionStorage.getItem("coffee_dismissed");
      if (welcomeDismissed && !coffeeDismissed) {
        const timer = setTimeout(() => setOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    };

    // Listen for welcome modal dismissal
    window.addEventListener("storage", handleStorage);

    // Also check immediately in case welcome was already dismissed
    const welcomeDismissed = sessionStorage.getItem("welcome_dismissed");
    const coffeeDismissed = sessionStorage.getItem("coffee_dismissed");
    if (welcomeDismissed && !coffeeDismissed) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("storage", handleStorage);
      };
    }

    // Poll for welcome dismissal since sessionStorage doesn't fire events in same tab
    const interval = setInterval(() => {
      const wd = sessionStorage.getItem("welcome_dismissed");
      const cd = sessionStorage.getItem("coffee_dismissed");
      if (wd && !cd) {
        setOpen(true);
        clearInterval(interval);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("coffee_dismissed", "1");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="text-6xl mb-4"
            >
              ☕
            </motion.div>

            <h2 className="text-2xl font-display text-gradient-fire mb-2">
              Enjoy my content?
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-6">
              If you like what I do, you can support me by buying me a coffee! Every little bit helps fuel my journey. 🙏
            </p>

            <a
              href="https://www.buymeacoffee.com/vivektarale"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-body gap-2 text-base py-5">
                <Coffee className="w-5 h-5" />
                Buy Me a Coffee ☕
              </Button>
            </a>

            <button
              onClick={handleClose}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoffeeModal;
