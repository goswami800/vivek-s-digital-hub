import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface InstaPost {
  id: string;
  url: string;
  type: string;
  thumbnail: string | null;
  caption: string | null;
}

const InstagramSection = () => {
  const [posts, setPosts] = useState<InstaPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("instagram_posts")
        .select("id, url, type, thumbnail, caption")
        .order("created_at", { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

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

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground font-body mb-10">
            Content coming soon — follow me on Instagram in the meantime!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {posts.map((post, index) => (
              <motion.a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="aspect-square rounded-xl bg-card border border-border overflow-hidden group relative cursor-pointer hover:border-primary/50 transition-colors"
              >
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.caption || "Instagram"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Instagram className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-primary" />
                </div>
                {post.type === "reel" && (
                  <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground rounded-full p-1.5">
                    <Play className="w-3 h-3" />
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            asChild
            className="bg-gradient-fire text-primary-foreground font-body rounded-full px-8 py-6 hover:scale-105 transition-transform shadow-fire"
          >
            <a href="https://www.instagram.com/tarale_vivek?igsh=dHJvN2puNHI3Ymgx&utm_source=qr" target="_blank" rel="noopener noreferrer">
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
