import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Instagram, Upload } from "lucide-react";

interface InstaPost {
  id: string;
  url: string;
  type: string;
  thumbnail: string | null;
  caption: string | null;
  created_at: string;
}

const InstagramManager = () => {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"post" | "reel">("post");
  const [caption, setCaption] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("instagram_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setSaving(true);

    let thumbnailUrl: string | null = null;

    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split(".").pop();
      const fileName = `insta-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, thumbnailFile);
      if (uploadError) {
        toast({ title: "Thumbnail upload failed", description: uploadError.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
      thumbnailUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("instagram_posts")
      .insert({ url, type, caption: caption || null, thumbnail: thumbnailUrl });

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Instagram ${type} added!` });
      setUrl("");
      setCaption("");
      setThumbnailFile(null);
      fetchPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (post: InstaPost) => {
    if (post.thumbnail) {
      const parts = post.thumbnail.split("/");
      const fileName = parts[parts.length - 1];
      await supabase.storage.from("gallery").remove([fileName]);
    }

    const { error } = await supabase.from("instagram_posts").delete().eq("id", post.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      fetchPosts();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4">Add Instagram Post / Reel</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="font-body">Instagram URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/... or /reel/..."
                className="bg-secondary border-border"
              />
            </div>
            <div className="w-full md:w-40 space-y-2">
              <Label className="font-body">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "post" | "reel")}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="font-body">Thumbnail Image (optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label className="font-body">Caption (optional)</Label>
              <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Short caption" className="bg-secondary border-border" />
            </div>
            <Button type="submit" disabled={!url || saving} className="bg-gradient-fire hover:opacity-90 font-body">
              <Plus className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Add"}
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-display text-foreground mb-4">All Instagram Content ({posts.length})</h2>
        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Instagram className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-body">No Instagram content yet. Add your first post or reel above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.caption || "Instagram"} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-secondary flex items-center justify-center">
                    <Instagram className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body uppercase text-primary font-semibold">{post.type}</span>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                  {post.caption && <p className="text-sm font-body text-muted-foreground">{post.caption}</p>}
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-xs font-body text-primary hover:underline break-all">
                    {post.url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramManager;
