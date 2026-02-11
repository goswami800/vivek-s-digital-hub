import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  icon: string;
  sort_order: number;
}

const icons = ["trophy", "award", "medal", "star", "shield", "target"];
const categories = ["certification", "competition", "milestone", "award"];

const AchievementsManager = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState({ title: "", description: "", year: "", category: "certification", icon: "trophy", sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Achievement>>({});

  const fetchData = async () => {
    const { data } = await supabase.from("achievements").select("*").order("sort_order");
    setItems(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.title) return toast.error("Title is required");
    const { error } = await supabase.from("achievements").insert([form]);
    if (error) return toast.error(error.message);
    toast.success("Achievement added");
    setForm({ title: "", description: "", year: "", category: "certification", icon: "trophy", sort_order: 0 });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("achievements").delete().eq("id", id);
    toast.success("Deleted");
    fetchData();
  };

  const startEdit = (item: Achievement) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleUpdate = async () => {
    if (!editingId || !editForm.title) return toast.error("Title is required");
    const { error } = await supabase.from("achievements").update({
      title: editForm.title, description: editForm.description, year: editForm.year,
      category: editForm.category, icon: editForm.icon, sort_order: editForm.sort_order,
    }).eq("id", editingId);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setEditingId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-display text-xl text-foreground">Add Achievement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Year (e.g. 2024)" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
            <SelectTrigger><SelectValue placeholder="Icon" /></SelectTrigger>
            <SelectContent>{icons.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </div>
        <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button onClick={handleAdd} className="bg-gradient-fire text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Achievement
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
            {editingId === item.id ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                  <Input value={editForm.year || ""} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} placeholder="Year" />
                  <Select value={editForm.icon || "trophy"} onValueChange={(v) => setEditForm({ ...editForm, icon: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{icons.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={editForm.category || "certification"} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="number" value={editForm.sort_order || 0} onChange={(e) => setEditForm({ ...editForm, sort_order: Number(e.target.value) })} placeholder="Sort Order" />
                </div>
                <Textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdate} className="bg-gradient-fire text-primary-foreground gap-1"><Save className="w-4 h-4" /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground font-body">{item.year} · {item.category}</p>
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

export default AchievementsManager;
