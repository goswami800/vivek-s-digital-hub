import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, ChevronDown, ChevronUp, GripVertical } from "lucide-react";

interface BrandService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  active: boolean;
  sort_order: number;
}

const categoryOptions = [
  { value: "reel", label: "Reel Promotion" },
  { value: "story", label: "Story Promotion" },
  { value: "post", label: "Post Promotion" },
  { value: "bundle", label: "Bundle Package" },
];

const BrandServicesManager = () => {
  const [services, setServices] = useState<BrandService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from("brand_services")
      .select("*")
      .order("sort_order", { ascending: true });
    setServices((data as BrandService[]) || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from("brand_services")
      .insert({ name: "New Service", category: "reel", sort_order: services.length, features: [] as any })
      .select()
      .single();
    if (error) toast({ title: "Add failed", description: error.message, variant: "destructive" });
    else {
      setServices([...services, data as BrandService]);
      setExpandedId(data.id);
      toast({ title: "Service added!" });
    }
  };

  const handleSave = async (svc: BrandService) => {
    setSaving(true);
    const { error } = await supabase
      .from("brand_services")
      .update({
        name: svc.name,
        category: svc.category,
        description: svc.description,
        price: svc.price,
        duration: svc.duration,
        features: svc.features as any,
        popular: svc.popular,
        active: svc.active,
        sort_order: svc.sort_order,
      })
      .eq("id", svc.id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: `"${svc.name}" saved!` });
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("brand_services").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      setServices(services.filter((s) => s.id !== id));
      toast({ title: "Service deleted!" });
    }
  };

  const update = (id: string, updates: Partial<BrandService>) => {
    setServices(services.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addFeature = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    update(id, { features: [...svc.features, ""] });
  };

  const updateFeature = (id: string, fi: number, value: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    update(id, { features: svc.features.map((f, i) => (i === fi ? value : f)) });
  };

  const removeFeature = (id: string, fi: number) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    update(id, { features: svc.features.filter((_, i) => i !== fi) });
  };

  if (loading) return <p className="text-muted-foreground font-body">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display text-foreground">Brand Collaboration Services</h2>
          <p className="text-sm text-muted-foreground font-body">Manage reel, story & post promotion packages for brands.</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-fire hover:opacity-90 font-body">
          <Plus className="w-4 h-4 mr-1" /> Add Service
        </Button>
      </div>

      {services.length === 0 && <p className="text-muted-foreground font-body text-sm">No brand services yet. Add your first one!</p>}

      {services.map((svc) => (
        <div key={svc.id} className="bg-card rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setExpandedId(expandedId === svc.id ? null : svc.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="font-display text-foreground">{svc.name}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body capitalize">{svc.category}</span>
              <span className="text-sm text-muted-foreground font-body">₹{svc.price}</span>
              {!svc.active && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-body">Inactive</span>}
              {svc.popular && <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-body">Popular</span>}
            </div>
            {expandedId === svc.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedId === svc.id && (
            <div className="p-4 pt-0 space-y-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-body text-xs">Service Name</Label>
                  <Input value={svc.name} onChange={(e) => update(svc.id, { name: e.target.value })} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs">Category</Label>
                  <select
                    value={svc.category}
                    onChange={(e) => update(svc.id, { category: e.target.value })}
                    className="w-full h-9 rounded-md bg-secondary border border-border px-3 text-sm font-body text-foreground"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs">Price (₹)</Label>
                  <Input type="number" min={0} value={svc.price} onChange={(e) => update(svc.id, { price: parseFloat(e.target.value) || 0 })} className="bg-secondary border-border" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-body text-xs">Duration / Delivery</Label>
                  <Input value={svc.duration} onChange={(e) => update(svc.id, { duration: e.target.value })} className="bg-secondary border-border" placeholder="per reel / per story / per post" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={svc.popular} onCheckedChange={(v) => update(svc.id, { popular: v })} />
                  <Label className="font-body text-xs">Mark as Popular</Label>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={svc.active} onCheckedChange={(v) => update(svc.id, { active: v })} />
                  <Label className="font-body text-xs">Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-body text-xs">Description</Label>
                <Textarea value={svc.description} onChange={(e) => update(svc.id, { description: e.target.value })} className="bg-secondary border-border" placeholder="What's included in this promotion service..." rows={3} />
              </div>

              {/* Features / Deliverables */}
              <div>
                <Label className="font-body text-xs mb-2 block">Deliverables / Features</Label>
                <div className="space-y-2">
                  {svc.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <Input
                        value={f}
                        onChange={(e) => updateFeature(svc.id, fi, e.target.value)}
                        className="bg-secondary border-border flex-1"
                        placeholder="e.g. Professional editing included"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFeature(svc.id, fi)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => addFeature(svc.id)} className="mt-2 font-body">
                  <Plus className="w-3 h-3 mr-1" /> Add Deliverable
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button onClick={() => handleSave(svc)} disabled={saving} className="bg-gradient-fire hover:opacity-90 font-body">
                  <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(svc.id)} className="font-body">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BrandServicesManager;
