import { motion } from "framer-motion";
import { Dumbbell, Camera, CalendarDays, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Dumbbell,
    title: "Personal Training",
    description: "Customized workout plans, nutrition guidance, and one-on-one coaching to help you smash your fitness goals.",
  },
  {
    icon: Camera,
    title: "Fitness Modeling",
    description: "Professional fitness modeling for brands, magazines, and campaigns. Bringing energy and authenticity to every shoot.",
  },
  {
    icon: CalendarDays,
    title: "Event Planning",
    description: "From fitness expos to wellness retreats, I plan and execute high-energy events that leave a lasting impact.",
  },
  {
    icon: Handshake,
    title: "Brand Collaborations",
    description: "Partnering with fitness and lifestyle brands to create authentic content and drive engagement across platforms.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">
            WHAT I DO
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Elevating fitness through training, modeling, events, and powerful brand partnerships.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group h-full hover:shadow-fire">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-fire flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <service.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-3">{service.title}</h3>
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
