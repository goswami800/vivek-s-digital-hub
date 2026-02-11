import { motion } from "framer-motion";
import { Mail, Instagram, Youtube, MapPin, Coffee } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">
            LET'S CONNECT
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-12">
            Ready to transform your fitness journey or collaborate on something amazing? Reach out!
          </p>

          <a
            href="mailto:vivektarale22@gmail.com"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-fire text-primary-foreground font-body text-sm sm:text-lg md:text-xl px-5 sm:px-8 py-4 sm:py-5 rounded-full shadow-fire hover:scale-105 transition-transform mb-12 break-all sm:break-normal"
          >
            <Mail className="w-6 h-6" />
            vivektarale22@gmail.com
          </a>

          <div className="block mt-4 mb-12">
            <a
              href="https://buymeacoffee.com/vivektarale"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-card border border-border text-foreground font-body text-base px-6 py-3 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              <Coffee className="w-5 h-5" />
              Buy Me a Coffee
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            <a
              href="https://www.instagram.com/tarale_vivek?igsh=dHJvN2puNHI3Ymgx&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <p className="text-sm font-body">India</p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-border pt-8 text-center">
        <p className="text-sm font-body text-muted-foreground">
          © {new Date().getFullYear()} Vivek Tarale. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
