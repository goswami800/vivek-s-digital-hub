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
          <div key={item.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
            <div>
              <h4 className="font-display text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground font-body">{item.year} · {item.category}</p>
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

export default AchievementsManager;
