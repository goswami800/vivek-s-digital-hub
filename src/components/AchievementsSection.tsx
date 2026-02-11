import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Award, Medal, Star, Shield, Target } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  award: Award,
  medal: Medal,
  star: Star,
  shield: Shield,
  target: Target,
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  icon: string;
  sort_order: number;
}

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setAchievements(data || []));
  }, []);

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">
            ACHIEVEMENTS
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Certifications, competition wins, and milestones from my fitness journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {achievements.map((item, i) => {
            const Icon = iconMap[item.icon] || Trophy;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-xl border border-border bg-card p-6 group hover:border-primary transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-body uppercase text-primary tracking-wider">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-display text-foreground mt-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
