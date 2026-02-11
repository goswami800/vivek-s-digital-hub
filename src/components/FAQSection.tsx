import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Category = "all" | "training" | "diet" | "pricing" | "availability" | "general";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const categoryLabels: Record<string, string> = {
  all: "All",
  training: "Training",
  diet: "Diet",
  pricing: "Pricing",
  availability: "Availability",
  general: "General",
};

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filter, setFilter] = useState<Category>("all");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("faqs")
        .select("id, question, answer, category")
        .order("sort_order", { ascending: true });
      setFaqs(data || []);
    };
    fetch();
  }, []);

  if (faqs.length === 0) return null;

  const filtered = filter === "all" ? faqs : faqs.filter((f) => f.category === filter);

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">FAQ</h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-8">
            Got questions? Here are the answers to the most common ones.
          </p>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as Category)} className="inline-flex">
            <TabsList className="bg-secondary border border-border flex-wrap h-auto">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger key={key} value={key} className="font-body text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {filtered.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="font-body text-foreground text-left hover:text-primary py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
