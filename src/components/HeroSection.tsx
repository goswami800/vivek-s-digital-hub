import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background layer */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary"
      />

      {/* Parallax orbs */}
      <motion.div style={{ y: orbY }} className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/30 blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/20 blur-[96px]" />
      </motion.div>

      {/* Floating particles */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "80%"]) }} className="absolute inset-0 opacity-10">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-primary animate-pulse" />
        <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 rounded-full bg-accent animate-pulse [animation-delay:0.5s]" />
        <div className="absolute bottom-[35%] left-[25%] w-1 h-1 rounded-full bg-primary animate-pulse [animation-delay:1s]" />
        <div className="absolute top-[60%] right-[30%] w-2.5 h-2.5 rounded-full bg-accent/50 animate-pulse [animation-delay:1.5s]" />
        <div className="absolute bottom-[20%] right-[10%] w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse [animation-delay:0.8s]" />
      </motion.div>

      {/* Content with parallax */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm md:text-base font-body tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Welcome to the world of
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display text-gradient-fire leading-none mb-6">
            VIVEK TARALE
          </h1>
          <p className="text-lg md:text-xl font-body text-muted-foreground max-w-2xl mx-auto mb-4">
            Fitness Influencer • Gym Trainer • Model • Event Planner
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <Button
            onClick={scrollToContact}
            className="bg-gradient-fire text-primary-foreground font-body text-base px-8 py-6 rounded-full shadow-fire hover:scale-105 transition-transform animate-pulse-glow"
          >
            Get In Touch
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
