import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Video {
  id: string;
  title: string;
  url: string;
  platform: string;
  thumbnail: string | null;
  sort_order: number;
}

const VideosManager = () => {
  const [items, setItems] = useState<Video[]>([]);
  const [form, setForm] = useState({ title: "", url: "", platform: "youtube", thumbnail: "", sort_order: 0 });

  const fetchData = async () => {
    const { data } = await supabase.from("videos").select("*").order("sort_order");
    setItems(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.url) return toast.error("Title and URL are required");
    const payload = { ...form, thumbnail: form.thumbnail || null };
    const { error } = await supabase.from("videos").insert([payload]);
    if (error) return toast.error(error.message);
    toast.success("Video added");
    setForm({ title: "", url: "", platform: "youtube", thumbnail: "", sort_order: 0 });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("videos").delete().eq("id", id);
    toast.success("Deleted");
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-display text-xl text-foreground">Add Video</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Video URL (YouTube/Instagram)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
            <SelectTrigger><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <Input placeholder="Custom Thumbnail URL (optional)" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="md:col-span-2" />
        </div>
        <Button onClick={handleAdd} className="bg-gradient-fire text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
            <div>
              <h4 className="font-display text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground font-body">{item.platform} · {item.url.substring(0, 50)}...</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosManager;
