import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

type Category = "all" | "fitness" | "modeling" | "events";

interface Photo {
  id: string;
  src: string;
  category: string;
  alt: string;
}

const GallerySection = () => {
  const [filter, setFilter] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from("gallery_photos")
        .select("id, src, category, alt")
        .order("created_at", { ascending: false });
      setPhotos(data || []);
    };
    fetchPhotos();
  }, []);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const displayedPhotos = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="gallery" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">
            GALLERY
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-8">
            A glimpse into my world — training, shoots, and events.
          </p>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as Category)} className="inline-flex">
            <TabsList className="bg-secondary border border-border">
              <TabsTrigger value="all" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
              <TabsTrigger value="fitness" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Fitness</TabsTrigger>
              <TabsTrigger value="modeling" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Modeling</TabsTrigger>
              <TabsTrigger value="events" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Events</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground font-body">No photos yet. Admin can upload from the dashboard.</p>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {displayedPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative bg-secondary"
                    onClick={() => setLightbox(photo)}
                  >
                    <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-sm font-body text-foreground">{photo.alt}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {!showAll && filtered.length > 6 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 rounded-full border border-primary text-primary font-body hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  View More ({filtered.length - 6} more)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
