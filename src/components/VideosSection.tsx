import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  url: string;
  platform: string;
  thumbnail: string | null;
  sort_order: number;
}

const getEmbedUrl = (url: string, platform: string) => {
  if (platform === "youtube") {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }
  return url;
};

const getYoutubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

const VideosSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("videos")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setVideos(data || []));
  }, []);

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">
            VIDEOS & REELS
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Watch my latest workout videos, tips, and transformation reels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {videos.map((video, i) => {
            const thumb = video.thumbnail || getYoutubeThumbnail(video.url);
            const isActive = activeVideo === video.id;

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl overflow-hidden border border-border bg-card"
              >
                <div className="aspect-video relative">
                  {isActive ? (
                    <iframe
                      src={`${getEmbedUrl(video.url, video.platform)}?autoplay=1`}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={video.title}
                    />
                  ) : (
                    <button
                      onClick={() => setActiveVideo(video.id)}
                      className="w-full h-full relative group"
                    >
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Play className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-foreground">{video.title}</h3>
                  <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                    {video.platform}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
