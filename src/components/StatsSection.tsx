import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Dumbbell, Users, CalendarCheck, Clock } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  key: string;
  label: string;
  suffix: string;
  defaultValue: number;
}

const statConfig: Stat[] = [
  { icon: <Clock className="w-8 h-8" />, key: "stat_years", label: "Years Experience", suffix: "+", defaultValue: 5 },
  { icon: <Users className="w-8 h-8" />, key: "stat_clients", label: "Clients Trained", suffix: "+", defaultValue: 200 },
  { icon: <CalendarCheck className="w-8 h-8" />, key: "stat_events", label: "Events Planned", suffix: "+", defaultValue: 100 },
  { icon: <Dumbbell className="w-8 h-8" />, key: "stat_programs", label: "Programs Designed", suffix: "+", defaultValue: 50 },
];

const AnimatedCounter = ({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span>{count}{suffix}</span>;
};

const StatsSection = () => {
  const [values, setValues] = useState<Record<string, number>>({});
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchStats = async () => {
      const keys = statConfig.map((s) => s.key);
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", keys);
      const map: Record<string, number> = {};
      data?.forEach((d) => { map[d.key] = parseInt(d.value) || 0; });
      setValues(map);
    };
    fetchStats();
  }, []);

  return (
    <section className="py-16 md:py-24 border-y border-border bg-card/50">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statConfig.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-display text-gradient-fire mb-2">
                <AnimatedCounter
                  target={values[stat.key] ?? stat.defaultValue}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="text-sm font-body text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
