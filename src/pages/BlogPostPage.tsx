import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string | null;
  category: string;
  created_at: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, content, image, category, created_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Posts
        </Link>

        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : !post ? (
          <div>
            <h1 className="text-4xl font-display text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground font-body">This post may have been removed or unpublished.</p>
          </div>
        ) : (
          <article>
            {post.image && (
              <div className="aspect-video rounded-xl overflow-hidden mb-8">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-body uppercase text-primary tracking-wider">{post.category}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-8">{post.title}</h1>
            <div className="prose prose-invert max-w-none font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
