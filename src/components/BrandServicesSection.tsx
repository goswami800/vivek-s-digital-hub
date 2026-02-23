import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Film, ImageIcon, LayoutGrid, Package, CheckCircle2 } from "lucide-react";

interface BrandService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  active: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  reel: <Film className="w-6 h-6" />,
  story: <ImageIcon className="w-6 h-6" />,
  post: <LayoutGrid className="w-6 h-6" />,
  bundle: <Package className="w-6 h-6" />,
};

const categoryLabels: Record<string, string> = {
  reel: "Reel Promotion",
  story: "Story Promotion",
  post: "Post Promotion",
  bundle: "Bundle Package",
};

const BrandServicesSection = () => {
  const [services, setServices] = useState<BrandService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("brand_services")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      setServices((data as BrandService[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading || services.length === 0) return null;

  const whatsappNumber = "919876543210"; // fallback

  const handleEnquiry = (svc: BrandService) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in your *${svc.name}* (${categoryLabels[svc.category] || svc.category}) service at ₹${svc.price}/${svc.duration}. Please share more details.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
  };

  return (
    <section id="brand-services" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3">
            Brand <span className="text-gradient-fire">Collaborations</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Partner with me for impactful social media promotions — Reels, Stories & Posts that deliver results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-card rounded-2xl border p-6 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 ${
                svc.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              }`}
            >
              {svc.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-body px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {categoryIcons[svc.category] || <Package className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-display text-foreground text-lg">{svc.name}</h3>
                  <span className="text-xs text-muted-foreground font-body capitalize">{categoryLabels[svc.category] || svc.category}</span>
                </div>
              </div>

              {svc.description && (
                <p className="text-sm text-muted-foreground font-body mb-4">{svc.description}</p>
              )}

              <div className="mb-4">
                <span className="text-2xl font-display text-foreground">₹{svc.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground font-body ml-1">/ {svc.duration}</span>
              </div>

              {svc.features.length > 0 && (
                <ul className="space-y-2 mb-6 flex-1">
                  {svc.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleEnquiry(svc)}
                className="w-full py-3 rounded-xl font-body text-sm font-semibold transition-all bg-gradient-fire text-primary-foreground hover:opacity-90"
              >
                Enquire on WhatsApp
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandServicesSection;
