import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      {/* VT Monogram */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112">
            <circle
              cx="56" cy="56" r="52"
              fill="none"
              stroke="hsl(var(--primary) / 0.15)"
              strokeWidth="2"
            />
            <motion.circle
              cx="56" cy="56" r="52"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
              style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(25, 95%, 55%)" />
              </linearGradient>
            </defs>
          </svg>
          {/* VT Text */}
          <span className="text-5xl font-display text-gradient-fire select-none tracking-wider">
            VT
          </span>
        </div>
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl md:text-3xl font-display text-gradient-fire tracking-[0.3em] mb-2"
      >
        VIVEK TARALE
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-xs md:text-sm font-body text-muted-foreground tracking-[0.25em] uppercase mb-10"
      >
        Fitness · Modeling · Events
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 160, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="h-[2px] bg-border rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
