import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import welcomeCharacter from "@/assets/welcome-character.png";

const WelcomeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("welcome_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("welcome_dismissed", "1");
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

            <motion.img
              src={welcomeCharacter}
              alt="Welcome character"
              className="w-32 h-32 mx-auto mb-4 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />

            <h2 className="text-2xl font-display text-gradient-fire mb-2">
              Hey there! 👋
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-6">
              Welcome to my world! I'm Vivek Tarale — fitness enthusiast, model & creator. Stay connected and follow me!
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/tarale_vivek?igsh=dHJvN2puNHI3Ymgx&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-body gap-2">
                  <Instagram className="w-5 h-5" />
                  Follow on Instagram
                </Button>
              </a>
              <a
                href="https://www.youtube.com/@VivekTarale0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-body gap-2">
                  <Youtube className="w-5 h-5" />
                  Subscribe on YouTube
                </Button>
              </a>
            </div>

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

export default WelcomeModal;
