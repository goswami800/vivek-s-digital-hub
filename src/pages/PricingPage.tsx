import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, MessageCircle, ArrowLeft, Star, Dumbbell, Monitor, Calendar, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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

const servicePackages = [
  {
    icon: <Dumbbell className="w-7 h-7" />,
    name: "Personal Training",
    tagline: "1-on-1 gym sessions",
    price: "₹3,000",
    duration: "month",
    popular: false,
    features: [
      { text: "Customized workout plan", included: true },
      { text: "In-person gym sessions", included: true },
      { text: "Form correction & spotting", included: true },
      { text: "Progress tracking", included: true },
      { text: "Diet guidance", included: true },
      { text: "24/7 WhatsApp support", included: false },
      { text: "Video analysis", included: false },
    ],
  },
  {
    icon: <Monitor className="w-7 h-7" />,
    name: "Online Coaching",
    tagline: "Train from anywhere",
    price: "₹2,000",
    duration: "month",
    popular: true,
    features: [
      { text: "Customized workout plan", included: true },
      { text: "Video demonstrations", included: true },
      { text: "Weekly check-ins", included: true },
      { text: "Progress tracking", included: true },
      { text: "Diet guidance", included: true },
      { text: "24/7 WhatsApp support", included: true },
      { text: "Video analysis", included: true },
    ],
  },
  {
    icon: <Calendar className="w-7 h-7" />,
    name: "Event Planning",
    tagline: "Fitness events & expos",
    price: "Custom",
    duration: "event",
    popular: false,
    features: [
      { text: "Event concept & design", included: true },
      { text: "Venue coordination", included: true },
      { text: "Athlete management", included: true },
      { text: "Sponsorship handling", included: true },
      { text: "Marketing & promotion", included: true },
      { text: "On-day management", included: true },
      { text: "Post-event reporting", included: true },
    ],
  },
  {
    icon: <Camera className="w-7 h-7" />,
    name: "Modeling / Brand",
    tagline: "Collaborations & shoots",
    price: "Custom",
    duration: "project",
    popular: false,
    features: [
      { text: "Brand collaboration", included: true },
      { text: "Product shoots", included: true },
      { text: "Social media promotion", included: true },
      { text: "Fitness campaigns", included: true },
      { text: "Content creation", included: true },
      { text: "Reel & video shoots", included: true },
      { text: "Long-term partnerships", included: true },
    ],
  },
];

const PricingPage = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: plans }, { data: settings }] = await Promise.all([
        supabase.from("diet_plans").select("*").order("price", { ascending: true }),
        supabase.from("site_settings").select("value").eq("key", "whatsapp_number").maybeSingle(),
      ]);
      setDietPlans(plans || []);
      if (settings) setWhatsapp(settings.value);
    };
    fetchData();
  }, []);

  const enquire = (service: string, price?: string) => {
    const number = whatsapp.replace(/[^0-9]/g, "");
    if (!number) return;
    const msg = price
      ? `Hi Vivek! I'm interested in the "${service}" package (${price}). Can you share more details?`
      : `Hi Vivek! I'm interested in the "${service}" service. Can you share more details?`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Pricing & Packages - Vivek Tarale</title>
        <meta name="description" content="Explore fitness training, online coaching, event planning, and modeling packages by Vivek Tarale. Find the perfect plan for your goals." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <span className="font-display text-xl text-gradient-fire">VT</span>
          </div>
        </div>

        {/* Hero */}
        <section className="py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-display text-gradient-fire mb-4">
                PRICING & PACKAGES
              </h1>
              <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
                Transparent pricing for all services. Choose the package that fits your goals and budget.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Packages */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display text-foreground text-center mb-12">
              SERVICE PACKAGES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {servicePackages.map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative rounded-xl border p-6 flex flex-col ${
                    pkg.popular ? "border-primary bg-card shadow-fire" : "border-border bg-card"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-fire text-primary-foreground text-xs font-body px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {pkg.icon}
                  </div>
                  <h3 className="text-2xl font-display text-foreground">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground font-body mb-4">{pkg.tagline}</p>

                  <div className="mb-6">
                    <span className="text-3xl font-display text-gradient-fire">{pkg.price}</span>
                    {pkg.price !== "Custom" && (
                      <span className="text-muted-foreground font-body text-sm"> / {pkg.duration}</span>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-grow">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm font-body">
                        {f.included ? (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => enquire(pkg.name, pkg.price !== "Custom" ? pkg.price : undefined)}
                    className={`w-full py-3 rounded-lg font-body transition-all duration-300 flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? "bg-gradient-fire text-primary-foreground hover:opacity-90"
                        : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {pkg.price === "Custom" ? "Get Quote" : "Enquire Now"}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Diet Plans */}
        {dietPlans.length > 0 && (
          <section className="pb-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-display text-foreground text-center mb-4">
                DIET & NUTRITION PLANS
              </h2>
              <p className="text-muted-foreground font-body text-center max-w-xl mx-auto mb-12">
                Add a nutrition plan to any service for maximum results.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {dietPlans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative rounded-xl border p-6 flex flex-col ${
                      plan.popular ? "border-primary bg-card shadow-fire" : "border-border bg-card"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-fire text-primary-foreground text-xs font-body px-4 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-display text-foreground mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground font-body mb-4 flex-grow">{plan.description}</p>

                    <div className="mb-4">
                      <span className="text-3xl font-display text-gradient-fire">₹{plan.price}</span>
                      <span className="text-muted-foreground font-body text-sm"> / {plan.duration}</span>
                    </div>

                    {plan.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm font-body text-foreground">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => enquire(plan.name, `₹${plan.price}`)}
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
        )}

        {/* Comparison Table */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display text-foreground text-center mb-12">
              COMPARE SERVICES
            </h2>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-3 text-muted-foreground font-medium">Feature</th>
                    {servicePackages.map((pkg) => (
                      <th key={pkg.name} className="text-center py-4 px-3 font-display text-lg text-foreground">
                        {pkg.name.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {servicePackages[0].features.map((feature, fi) => (
                    <tr key={fi} className="border-b border-border/50">
                      <td className="py-3 px-3 text-foreground">{feature.text}</td>
                      {servicePackages.map((pkg) => (
                        <td key={pkg.name} className="text-center py-3 px-3">
                          {pkg.features[fi]?.included ? (
                            <Check className="w-4 h-4 text-primary mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 px-3 font-medium text-foreground">Price</td>
                    {servicePackages.map((pkg) => (
                      <td key={pkg.name} className="text-center py-4 px-3 font-display text-lg text-gradient-fire">
                        {pkg.price}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-display text-gradient-fire mb-4">
                NOT SURE WHICH PLAN?
              </h2>
              <p className="text-muted-foreground font-body mb-8 max-w-lg mx-auto">
                Let's have a quick chat to understand your goals and I'll recommend the perfect package for you.
              </p>
              <button
                onClick={() => enquire("General Inquiry")}
                className="bg-gradient-fire text-primary-foreground font-body px-8 py-4 rounded-full shadow-fire hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PricingPage;
