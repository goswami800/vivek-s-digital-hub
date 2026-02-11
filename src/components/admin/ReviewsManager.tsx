import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Star } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Review {
  id: string;
  client_name: string;
  review: string;
  rating: number;
  avatar_url: string | null;
  designation: string | null;
  featured: boolean;
  sort_order: number;
}

const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)}>
        <Star className={`w-5 h-5 transition-colors ${star <= value ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
      </button>
    ))}
  </div>
);

const ReviewsManager = () => {
  const [items, setItems] = useState<Review[]>([]);
  const [form, setForm] = useState({ client_name: "", review: "", rating: 5, avatar_url: "", designation: "", featured: false, sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Review>>({});

  const fetchData = async () => {
    const { data } = await supabase.from("client_reviews").select("*").order("sort_order");
    setItems(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.client_name || !form.review) return toast.error("Name and review are required");
    const { error } = await supabase.from("client_reviews").insert([{
      ...form, avatar_url: form.avatar_url || null, designation: form.designation || null,
    }]);
    if (error) return toast.error(error.message);
    toast.success("Review added");
    setForm({ client_name: "", review: "", rating: 5, avatar_url: "", designation: "", featured: false, sort_order: 0 });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("client_reviews").delete().eq("id", id);
    toast.success("Deleted");
    fetchData();
  };

  const startEdit = (item: Review) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleUpdate = async () => {
    if (!editingId || !editForm.client_name) return toast.error("Name is required");
    const { error } = await supabase.from("client_reviews").update({
      client_name: editForm.client_name, review: editForm.review, rating: editForm.rating,
      avatar_url: editForm.avatar_url || null, designation: editForm.designation || null,
      featured: editForm.featured, sort_order: editForm.sort_order,
    }).eq("id", editingId);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setEditingId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-display text-xl text-foreground">Add Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Client Name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
          <Input placeholder="Designation (e.g. Fitness Client)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          <Input placeholder="Avatar URL (optional)" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
          <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </div>
        <Textarea placeholder="Review text..." value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} />
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Label className="font-body text-sm">Rating:</Label>
            <StarInput value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
            <Label className="font-body text-sm">Featured</Label>
          </div>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-fire text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Review
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
            {editingId === item.id ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input value={editForm.client_name || ""} onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })} placeholder="Client Name" />
                  <Input value={editForm.designation || ""} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} placeholder="Designation" />
                  <Input value={editForm.avatar_url || ""} onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })} placeholder="Avatar URL" />
                  <Input type="number" value={editForm.sort_order || 0} onChange={(e) => setEditForm({ ...editForm, sort_order: Number(e.target.value) })} placeholder="Sort Order" />
                </div>
                <Textarea value={editForm.review || ""} onChange={(e) => setEditForm({ ...editForm, review: e.target.value })} placeholder="Review" />
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Label className="font-body text-sm">Rating:</Label>
                    <StarInput value={editForm.rating || 5} onChange={(v) => setEditForm({ ...editForm, rating: v })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={editForm.featured || false} onCheckedChange={(v) => setEditForm({ ...editForm, featured: v })} />
                    <Label className="font-body text-sm">Featured</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdate} className="bg-gradient-fire text-primary-foreground gap-1"><Save className="w-4 h-4" /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display text-foreground">{item.client_name}</h4>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= item.rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    {item.featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">Featured</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-body line-clamp-1">{item.review}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(item)}><Save className="w-4 h-4 text-primary" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsManager;
