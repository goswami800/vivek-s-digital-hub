import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Pencil, Eye, EyeOff } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string | null;
  category: string;
  slug: string;
  published: boolean;
  created_at: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("fitness");
  const [published, setPublished] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

  const resetForm = () => {
    setTitle(""); setContent(""); setExcerpt(""); setCategory("fitness"); setPublished(false); setFile(null); setEditing(null); setShowForm(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditing(post);
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setPublished(post.published);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "Title and content are required", variant: "destructive" });
      return;
    }
    setSaving(true);

    let imageUrl = editing?.image || null;
    if (file) {
      const ext = file.name.split(".").pop();
      const name = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("blog").upload(name, file);
      if (upErr) {
        toast({ title: "Image upload failed", description: upErr.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      imageUrl = supabase.storage.from("blog").getPublicUrl(name).data.publicUrl;
    }

    const payload: any = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().substring(0, 150),
      category,
      published,
      image: imageUrl,
    };
    if (!editing) payload.slug = generateSlug(title);

    const { error } = editing
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert([payload]);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Post updated!" : "Post created!" });
      resetForm();
      fetchPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Post deleted" }); fetchPosts(); }
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-gradient-fire hover:opacity-90 font-body">
          <Plus className="w-4 h-4 mr-1" /> New Post
        </Button>
      )}

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-display text-foreground mb-4">{editing ? "Edit Post" : "New Post"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Title *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border" maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="diet">Diet</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Excerpt</Label>
              <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary (auto-generated if empty)" className="bg-secondary border-border" maxLength={300} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Content *</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Cover Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={published} onCheckedChange={setPublished} />
              <Label className="font-body">Published</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="bg-gradient-fire hover:opacity-90 font-body">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm} className="font-body">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-xl font-display text-foreground mb-4">All Posts ({posts.length})</h2>
        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground font-body">No blog posts yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {post.image && <img src={post.image} alt="" className="w-16 h-12 rounded object-cover flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-body text-foreground truncate">{post.title}</p>
                    <p className="text-xs font-body text-muted-foreground">{post.category} · {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => togglePublish(post)} title={post.published ? "Unpublish" : "Publish"}>
                    {post.published ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(post)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;
