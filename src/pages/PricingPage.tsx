import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, MessageCircle, ArrowLeft, Star, Dumbbell, Monitor, Calendar, Camera, Heart, Zap, Target, Percent, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import CountdownTimer from "@/components/CountdownTimer";

interface Feature {
  text: string;
  included: boolean;
}

interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  price: string;
  duration: string;
  popular: boolean;
  features: Feature[];
  sort_order: number;
  discount_percentage: number;
  discount_label: string;
  offer_ends_at: string | null;
}

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

const iconMap: Record<string, React.ReactNode> = {
  dumbbell: <Dumbbell className="w-7 h-7" />,
  monitor: <Monitor className="w-7 h-7" />,
  calendar: <Calendar className="w-7 h-7" />,
  camera: <Camera className="w-7 h-7" />,
  heart: <Heart className="w-7 h-7" />,
  star: <Star className="w-7 h-7" />,
  zap: <Zap className="w-7 h-7" />,
  target: <Target className="w-7 h-7" />,
};

const extractNumericPrice = (price: string): number | null => {
  const match = price.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
};

const formatPrice = (amount: number): string => {
  return "₹" + amount.toLocaleString("en-IN");
};

const PricingPage = () => {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_percentage: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: pkgs }, { data: plans }, { data: settings }] = await Promise.all([
        supabase.from("service_packages").select("*").order("sort_order", { ascending: true }),
        supabase.from("diet_plans").select("*").order("price", { ascending: true }),
        supabase.from("site_settings").select("value").eq("key", "whatsapp_number").maybeSingle(),
      ]);
      setServicePackages(
        (pkgs || []).map((p: any) => ({
          ...p,
          features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || "[]"),
        }))
      );
      setDietPlans(plans || []);
      if (settings) setWhatsapp(settings.value);
    };
    fetchData();
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("active", true)
      .maybeSingle();

    if (!data) {
      toast({ title: "Invalid coupon", description: "This coupon code is not valid or has expired.", variant: "destructive" });
      return;
    }
    if (data.valid_until && new Date(data.valid_until) < new Date()) {
      toast({ title: "Coupon expired", description: "This coupon has expired.", variant: "destructive" });
      return;
    }
    if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
      toast({ title: "Coupon exhausted", description: "This coupon has reached its usage limit.", variant: "destructive" });
      return;
    }
    // Increment usage count
    await supabase.from("coupons").update({ usage_count: (data.usage_count || 0) + 1 }).eq("id", data.id);
    setAppliedCoupon({ code: data.code, discount_percentage: data.discount_percentage });
    toast({ title: `Coupon "${data.code}" applied!`, description: `${data.discount_percentage}% extra discount activated.` });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const getFinalPrice = (pkg: ServicePackage): { original: number | null; discounted: number | null; totalDiscount: number } => {
    const original = extractNumericPrice(pkg.price);
    if (!original) return { original: null, discounted: null, totalDiscount: 0 };

    let totalDiscount = pkg.discount_percentage || 0;
    if (appliedCoupon) totalDiscount += appliedCoupon.discount_percentage;
    if (totalDiscount > 100) totalDiscount = 100;

    const discounted = Math.round(original * (1 - totalDiscount / 100));
    return { original, discounted, totalDiscount };
  };

  const getDietFinalPrice = (price: number): { discounted: number; totalDiscount: number } => {
    const totalDiscount = appliedCoupon ? appliedCoupon.discount_percentage : 0;
    return { discounted: Math.round(price * (1 - totalDiscount / 100)), totalDiscount };
  };

  const enquire = (service: string, originalPrice?: string, finalPrice?: string) => {
    const number = whatsapp.replace(/[^0-9]/g, "");
    if (!number) return;
    let msg: string;
    if (finalPrice && originalPrice && finalPrice !== originalPrice) {
      msg = `Hi Vivek! I'm interested in the "${service}" package. Original price: ${originalPrice}, my discounted price: ${finalPrice}${appliedCoupon ? ` (Coupon: ${appliedCoupon.code})` : ""}. Can you share more details?`;
    } else if (originalPrice) {
      msg = `Hi Vivek! I'm interested in the "${service}" package (${originalPrice}). Can you share more details?`;
    } else {
      msg = `Hi Vivek! I'm interested in the "${service}" service. Can you share more details?`;
    }
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const maxFeatures = servicePackages.reduce((max, pkg) => Math.max(max, pkg.features.length), 0);

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
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl md:text-7xl font-display text-gradient-fire mb-4">PRICING & PACKAGES</h1>
              <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
                Transparent pricing for all services. Choose the package that fits your goals and budget.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coupon Input */}
        <section className="pb-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-md mx-auto bg-card border border-border rounded-xl p-5"
            >
              <h3 className="text-sm font-display text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Have a coupon code?
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-primary/10 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-primary" />
                    <span className="font-body text-sm text-foreground">
                      <strong>{appliedCoupon.code}</strong> — {appliedCoupon.discount_percentage}% off applied!
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon} className="font-body text-xs">
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="bg-secondary border-border font-mono uppercase"
                  />
                  <Button onClick={applyCoupon} className="bg-gradient-fire hover:opacity-90 font-body shrink-0">
                    Apply
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Service Packages */}
        {servicePackages.length > 0 && (
          <section className="pb-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-display text-foreground text-center mb-12">SERVICE PACKAGES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {servicePackages.map((pkg, i) => {
                  const { original, discounted, totalDiscount } = getFinalPrice(pkg);
                  const hasDiscount = totalDiscount > 0 && original !== null;

                  return (
                    <motion.div
                      key={pkg.id}
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

                      {/* Discount badge */}
                      {(pkg.discount_percentage > 0 || pkg.discount_label) && (
                        <div className="absolute -top-3 right-3 bg-destructive text-destructive-foreground text-xs font-body px-3 py-1 rounded-full flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {pkg.discount_label || `${pkg.discount_percentage}% OFF`}
                        </div>
                      )}

                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        {iconMap[pkg.icon] || <Dumbbell className="w-7 h-7" />}
                      </div>
                      <h3 className="text-2xl font-display text-foreground">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground font-body mb-4">{pkg.tagline}</p>

                      <div className="mb-6">
                        {hasDiscount ? (
                          <>
                            <span className="text-lg text-muted-foreground font-body line-through mr-2">{pkg.price}</span>
                            <span className="text-3xl font-display text-gradient-fire">{formatPrice(discounted!)}</span>
                            <span className="text-muted-foreground font-body text-sm"> / {pkg.duration}</span>
                            <div className="text-xs text-destructive font-body mt-1">{totalDiscount}% total savings!</div>
                            {pkg.offer_ends_at && new Date(pkg.offer_ends_at) > new Date() && (
                              <CountdownTimer endDate={pkg.offer_ends_at} />
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-3xl font-display text-gradient-fire">{pkg.price}</span>
                            {pkg.price !== "Custom" && (
                              <span className="text-muted-foreground font-body text-sm"> / {pkg.duration}</span>
                            )}
                          </>
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
                            <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>{f.text}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() =>
                          enquire(
                            pkg.name,
                            pkg.price !== "Custom" ? pkg.price : undefined,
                            hasDiscount ? formatPrice(discounted!) : undefined
                          )
                        }
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
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Diet Plans */}
        {dietPlans.length > 0 && (
          <section className="pb-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-display text-foreground text-center mb-4">DIET & NUTRITION PLANS</h2>
              <p className="text-muted-foreground font-body text-center max-w-xl mx-auto mb-12">
                Add a nutrition plan to any service for maximum results.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {dietPlans.map((plan, i) => {
                  const { discounted, totalDiscount } = getDietFinalPrice(plan.price);
                  const hasCouponDiscount = totalDiscount > 0;

                  return (
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
                        {hasCouponDiscount ? (
                          <>
                            <span className="text-lg text-muted-foreground font-body line-through mr-2">₹{plan.price}</span>
                            <span className="text-3xl font-display text-gradient-fire">{formatPrice(discounted)}</span>
                            <span className="text-muted-foreground font-body text-sm"> / {plan.duration}</span>
                            <div className="text-xs text-destructive font-body mt-1">{totalDiscount}% off with coupon!</div>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl font-display text-gradient-fire">₹{plan.price}</span>
                            <span className="text-muted-foreground font-body text-sm"> / {plan.duration}</span>
                          </>
                        )}
                      </div>
                      {plan.features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-2 text-sm font-body text-foreground">
                              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={() =>
                          enquire(
                            plan.name,
                            `₹${plan.price}`,
                            hasCouponDiscount ? formatPrice(discounted) : undefined
                          )
                        }
                        className={`w-full py-3 rounded-lg font-body transition-all duration-300 flex items-center justify-center gap-2 ${
                          plan.popular
                            ? "bg-gradient-fire text-primary-foreground hover:opacity-90"
                            : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" /> Enquire Now
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Comparison Table */}
        {servicePackages.length > 0 && (
          <section className="pb-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-display text-foreground text-center mb-12">COMPARE SERVICES</h2>
              <div className="max-w-4xl mx-auto overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-3 text-muted-foreground font-medium">Feature</th>
                      {servicePackages.map((pkg) => (
                        <th key={pkg.id} className="text-center py-4 px-3 font-display text-lg text-foreground">
                          {pkg.name.split(" ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: maxFeatures }).map((_, fi) => (
                      <tr key={fi} className="border-b border-border/50">
                        <td className="py-3 px-3 text-foreground">
                          {servicePackages.find((p) => p.features[fi])?.features[fi]?.text || ""}
                        </td>
                        {servicePackages.map((pkg) => (
                          <td key={pkg.id} className="text-center py-3 px-3">
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
                      {servicePackages.map((pkg) => {
                        const { discounted, totalDiscount } = getFinalPrice(pkg);
                        return (
                          <td key={pkg.id} className="text-center py-4 px-3">
                            {totalDiscount > 0 && discounted !== null ? (
                              <>
                                <span className="text-muted-foreground line-through text-xs block">{pkg.price}</span>
                                <span className="font-display text-lg text-gradient-fire">{formatPrice(discounted)}</span>
                              </>
                            ) : (
                              <span className="font-display text-lg text-gradient-fire">{pkg.price}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-display text-gradient-fire mb-4">NOT SURE WHICH PLAN?</h2>
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
