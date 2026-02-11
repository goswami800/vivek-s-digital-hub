import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  client_name: string;
  review: string;
  rating: number;
  designation: string | null;
  avatar_url: string | null;
}

const fallbackReviews: Review[] = [
  { id: "1", client_name: "Rahul Sharma", review: "Vivek completely transformed my fitness journey. His dedication and expertise are unmatched. I lost 20kg in 6 months!", rating: 5, designation: "Fitness Client", avatar_url: null },
  { id: "2", client_name: "Priya Patel", review: "Working with Vivek on our fitness campaign was incredible. His energy and professionalism brought our vision to life.", rating: 5, designation: "Brand Partner", avatar_url: null },
  { id: "3", client_name: "Amit Desai", review: "Vivek planned and executed our fitness expo flawlessly. The turnout and energy were beyond our expectations.", rating: 5, designation: "Event Organizer", avatar_url: null },
  { id: "4", client_name: "Sneha Kulkarni", review: "Even through online coaching, Vivek's guidance was personalized and effective. He truly cares about each client's progress.", rating: 5, designation: "Online Coaching Client", avatar_url: null },
  { id: "5", client_name: "Rohan Mehta", review: "I never thought I could achieve this physique. Vivek's structured approach and constant motivation made the impossible possible.", rating: 5, designation: "Personal Training Client", avatar_url: null },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 justify-center mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${star <= rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("client_reviews")
        .select("id, client_name, review, rating, designation, avatar_url")
        .order("sort_order", { ascending: true });
      setReviews(data && data.length > 0 ? data : fallbackReviews);
    };
    fetch();
  }, []);

  const items = reviews.length > 0 ? reviews : fallbackReviews;

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Reset current if items change
  useEffect(() => { if (current >= items.length) setCurrent(0); }, [items.length, current]);

  if (items.length === 0) return null;

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
            CLIENT REVIEWS
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            What my clients and partners say about working with me.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 md:p-12 text-center relative overflow-hidden">
            <Quote className="w-10 h-10 text-primary/30 mx-auto mb-4" />
            <motion.div
              key={items[current]?.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <StarRating rating={items[current]?.rating ?? 5} />
              <p className="text-lg md:text-xl font-body text-foreground leading-relaxed mb-8 italic">
                "{items[current]?.review}"
              </p>
              <div className="flex items-center justify-center gap-3">
                {items[current]?.avatar_url && (
                  <img
                    src={items[current].avatar_url!}
                    alt={items[current].client_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  />
                )}
                <div>
                  <p className="font-display text-2xl text-gradient-fire">{items[current]?.client_name}</p>
                  {items[current]?.designation && (
                    <p className="text-sm font-body text-muted-foreground">{items[current].designation}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full border-border hover:border-primary hover:text-primary">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {items.map((_, i) => (
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
