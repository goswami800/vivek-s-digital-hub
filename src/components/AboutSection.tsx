import { motion } from "framer-motion";
import { Dumbbell, Users, Calendar, Trophy } from "lucide-react";

const stats = [
  { icon: Dumbbell, value: "5+", label: "Years Experience" },
  { icon: Users, value: "200+", label: "Clients Trained" },
  { icon: Calendar, value: "50+", label: "Events Planned" },
  { icon: Trophy, value: "20+", label: "Brand Collabs" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-6">
            ABOUT ME
          </h2>
          <p className="text-muted-foreground font-body max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            I'm Vivek Tarale — a passionate fitness enthusiast, certified gym trainer,
            fitness model, and event planner based in India. My journey started with a
            simple goal: transform lives through fitness. Today, I help hundreds of people
            achieve their dream physique while planning unforgettable fitness events and
            collaborating with top brands in the industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors group"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl md:text-4xl font-display text-foreground">{stat.value}</p>
              <p className="text-sm font-body text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
