import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Pencil, Star, X } from "lucide-react";

interface DietPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  created_at: string;
}

const categories = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "maintenance", label: "Maintenance" },
  { value: "sports", label: "Sports" },
];

const DietPlansManager = () => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DietPlan | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("weight-loss");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("1 Month");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [popular, setPopular] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    const { data } = await supabase.from("diet_plans").select("*").order("created_at", { ascending: false });
    setPlans(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setName(""); setDescription(""); setCategory("weight-loss"); setPrice(""); setDuration("1 Month");
    setFeatures([]); setFeatureInput(""); setPopular(false); setEditing(null); setShowForm(false);
  };

  const handleEdit = (plan: DietPlan) => {
    setEditing(plan); setName(plan.name); setDescription(plan.description); setCategory(plan.category);
    setPrice(String(plan.price)); setDuration(plan.duration); setFeatures(plan.features || []);
    setPopular(plan.popular); setShowForm(true);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);

    const payload: any = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price) || 0,
      duration: duration.trim(),
      features,
      popular,
    };

    const { error } = editing
      ? await supabase.from("diet_plans").update(payload).eq("id", editing.id)
      : await supabase.from("diet_plans").insert([payload]);

    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Plan updated!" : "Plan created!" }); resetForm(); fetchPlans(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("diet_plans").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Plan deleted" }); fetchPlans(); }
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-gradient-fire hover:opacity-90 font-body">
          <Plus className="w-4 h-4 mr-1" /> New Diet Plan
        </Button>
      )}

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-display text-foreground mb-4">{editing ? "Edit Plan" : "New Diet Plan"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Plan Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lean Cut Plan" className="bg-secondary border-border" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="bg-secondary border-border" maxLength={500} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Price (₹)</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="999" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Duration</Label>
                <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="1 Month" className="bg-secondary border-border" maxLength={50} />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label className="font-body">Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. Personalized macro split"
                  className="bg-secondary border-border"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                  maxLength={100}
                />
                <Button type="button" variant="outline" onClick={addFeature}>Add</Button>
              </div>
              {features.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center justify-between bg-secondary rounded px-3 py-1.5 text-sm font-body">
                      {f}
                      <button type="button" onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={popular} onCheckedChange={setPopular} />
              <Label className="font-body">Mark as Popular</Label>
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
        <h2 className="text-xl font-display text-foreground mb-4">All Diet Plans ({plans.length})</h2>
        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : plans.length === 0 ? (
          <p className="text-muted-foreground font-body">No diet plans yet.</p>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-body text-foreground truncate">{plan.name}</p>
                    {plan.popular && <Star className="w-4 h-4 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs font-body text-muted-foreground">
                    {plan.category} · ₹{plan.price} / {plan.duration} · {plan.features.length} features
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(plan)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(plan.id)}>
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

export default DietPlansManager;
