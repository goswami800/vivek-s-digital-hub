import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Transformation {
  id: string;
  client_name: string;
  description: string;
  before_image: string;
  after_image: string;
}

const CompareSlider = ({ before, after }: { before: string; after: string }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDragging.current) handleMove(e.clientX); };
  const handleTouchMove = (e: React.TouchEvent) => { handleMove(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-col-resize select-none bg-secondary"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth }} />
      </div>
      <div className="absolute top-0 bottom-0" style={{ left: `${position}%` }}>
        <div className="absolute top-0 bottom-0 w-0.5 bg-primary -translate-x-1/2" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-fire">
          <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8l4 4-4 4M6 8l-4 4 4 4" />
          </svg>
        </div>
      </div>
      <span className="absolute top-3 left-3 bg-background/80 text-foreground text-xs font-body px-2 py-1 rounded">Before</span>
      <span className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-body px-2 py-1 rounded">After</span>
    </div>
  );
};

const TransformationsSection = () => {
  const [items, setItems] = useState<Transformation[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("transformations")
        .select("*")
        .order("created_at", { ascending: false });
      setItems(data || []);
    };
    fetch();
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="transformations" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">TRANSFORMATIONS</h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Real results from real clients. Drag the slider to see the change.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <CompareSlider before={item.before_image} after={item.after_image} />
              {(item.client_name || item.description) && (
                <div className="mt-3 text-center">
                  {item.client_name && <p className="font-display text-lg text-foreground">{item.client_name}</p>}
                  {item.description && <p className="text-sm text-muted-foreground font-body">{item.description}</p>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformationsSection;
