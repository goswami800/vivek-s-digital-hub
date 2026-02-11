import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, MessageCircle } from "lucide-react";

type Category = "all" | "weight-loss" | "muscle-gain" | "maintenance" | "sports";

interface DietPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
}

const categoryLabels: Record<string, string> = {
  "all": "All",
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Gain",
  "maintenance": "Maintenance",
  "sports": "Sports",
};

const DietPlansSection = () => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [filter, setFilter] = useState<Category>("all");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: plansData }, { data: settings }] = await Promise.all([
        supabase.from("diet_plans").select("*").order("price", { ascending: true }),
        supabase.from("site_settings").select("value").eq("key", "whatsapp_number").maybeSingle(),
      ]);
      setPlans(plansData || []);
      if (settings) setWhatsapp(settings.value);
    };
    fetchData();
  }, []);

  if (plans.length === 0) return null;

  const filtered = filter === "all" ? plans : plans.filter((p) => p.category === filter);

  const handleEnquire = (plan: DietPlan) => {
    const number = whatsapp.replace(/[^0-9]/g, "");
    if (!number) return;
    const text = encodeURIComponent(`Hi Vivek! I'm interested in the "${plan.name}" diet plan (₹${plan.price}/${plan.duration}). Can you share more details?`);
    window.open(`https://wa.me/${number}?text=${text}`, "_blank");
  };

  return (
    <section id="diet-plans" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">DIET PLANS</h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-8">
            Customized nutrition plans designed to fuel your goals.
          </p>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as Category)} className="inline-flex">
            <TabsList className="bg-secondary border border-border flex-wrap h-auto">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger key={key} value={key} className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filtered.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-primary bg-card shadow-fire"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-fire text-primary-foreground text-xs font-body px-4 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Popular
                </div>
              )}
              <span className="text-xs font-body uppercase text-primary tracking-wider mb-2">
                {categoryLabels[plan.category] || plan.category}
              </span>
              <h3 className="text-2xl font-display text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground font-body mb-4 flex-grow">{plan.description}</p>

              <div className="mb-4">
                <span className="text-4xl font-display text-gradient-fire">₹{plan.price}</span>
                <span className="text-muted-foreground font-body text-sm"> / {plan.duration}</span>
              </div>

              {plan.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm font-body text-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleEnquire(plan)}
                className={`w-full py-3 rounded-lg font-body transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-gradient-fire text-primary-foreground hover:opacity-90"
                    : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <MessageCircle className="w-4 h-4" /> Enquire Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DietPlansSection;
