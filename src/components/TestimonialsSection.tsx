import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Fitness Client",
    quote: "Vivek completely transformed my fitness journey. His dedication and expertise are unmatched. I lost 20kg in 6 months!",
  },
  {
    name: "Priya Patel",
    role: "Brand Partner",
    quote: "Working with Vivek on our fitness campaign was incredible. His energy and professionalism brought our vision to life.",
  },
  {
    name: "Amit Desai",
    role: "Event Organizer",
    quote: "Vivek planned and executed our fitness expo flawlessly. The turnout and energy were beyond our expectations.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Online Coaching Client",
    quote: "Even through online coaching, Vivek's guidance was personalized and effective. He truly cares about each client's progress.",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % testimonials.length), []);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">
            TESTIMONIALS
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            What my clients and partners say about working with me.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6" />
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg md:text-xl font-body text-foreground leading-relaxed mb-8 italic">
                "{testimonials[current].quote}"
              </p>
              <div>
                <p className="font-display text-2xl text-gradient-fire">{testimonials[current].name}</p>
                <p className="text-sm font-body text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full border-border hover:border-primary hover:text-primary">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full border-border hover:border-primary hover:text-primary">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
