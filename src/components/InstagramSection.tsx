import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const instagramPosts = [
  { id: 1, type: "post", placeholder: true },
  { id: 2, type: "reel", placeholder: true },
  { id: 3, type: "post", placeholder: true },
  { id: 4, type: "reel", placeholder: true },
  { id: 5, type: "post", placeholder: true },
  { id: 6, type: "reel", placeholder: true },
];

const InstagramSection = () => {
  return (
    <section id="instagram" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-primary" />
            <h2 className="text-5xl md:text-6xl font-display text-gradient-fire">
              INSTAGRAM
            </h2>
          </div>
          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-8">
            Follow my journey on Instagram for daily fitness content, behind-the-scenes, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="aspect-square rounded-xl bg-card border border-border overflow-hidden group relative cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <div className="text-center">
                  <Instagram className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs font-body text-muted-foreground capitalize">
                    {post.type === "reel" ? "Reel" : "Post"}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            className="bg-gradient-fire text-primary-foreground font-body rounded-full px-8 py-6 hover:scale-105 transition-transform shadow-fire"
          >
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5 mr-2" />
              Follow on Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
