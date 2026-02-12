import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, GripVertical, ChevronDown, ChevronUp, Percent, Tag, Clock } from "lucide-react";

interface Feature {
  text: string;
  included: boolean;
}

interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  price: string;
  duration: string;
  popular: boolean;
  features: Feature[];
  sort_order: number;
  discount_percentage: number;
  discount_label: string;
  offer_ends_at: string | null;
}

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  usage_limit: number | null;
  usage_count: number;
}

const iconOptions = ["dumbbell", "monitor", "calendar", "camera", "heart", "star", "zap", "target"];

const PricingManager = () => {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"packages" | "coupons">("packages");
  const { toast } = useToast();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [{ data: pkgs }, { data: cpns }] = await Promise.all([
      supabase.from("service_packages").select("*").order("sort_order", { ascending: true }),
      supabase.from("coupons").select("*").order("created_at", { ascending: false }),
    ]);
    setPackages(
      (pkgs || []).map((d: any) => ({
        ...d,
        features: Array.isArray(d.features) ? d.features : JSON.parse(d.features || "[]"),
      }))
    );
    setCoupons(cpns || []);
    setLoading(false);
  };

  // --- Package handlers ---
  const handleSave = async (pkg: ServicePackage) => {
    setSaving(true);
    const { error } = await supabase
      .from("service_packages")
      .update({
        name: pkg.name,
        tagline: pkg.tagline,
        icon: pkg.icon,
        price: pkg.price,
        duration: pkg.duration,
        popular: pkg.popular,
        features: pkg.features as any,
        sort_order: pkg.sort_order,
        discount_percentage: pkg.discount_percentage,
        discount_label: pkg.discount_label,
        offer_ends_at: pkg.offer_ends_at || null,
      })
      .eq("id", pkg.id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: `"${pkg.name}" saved!` });
    setSaving(false);
  };

  const handleAdd = async () => {
    const newOrder = packages.length;
    const { data, error } = await supabase
      .from("service_packages")
      .insert({ name: "New Package", tagline: "Description", price: "Custom", duration: "month", sort_order: newOrder, features: [] as any })
      .select()
      .single();
    if (error) toast({ title: "Add failed", description: error.message, variant: "destructive" });
    else {
      setPackages([...packages, { ...data, features: [] }]);
      setExpandedId(data.id);
      toast({ title: "Package added!" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("service_packages").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      setPackages(packages.filter((p) => p.id !== id));
      toast({ title: "Package deleted!" });
    }
  };

  const updatePkg = (id: string, updates: Partial<ServicePackage>) => {
    setPackages(packages.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addFeature = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    updatePkg(id, { features: [...pkg.features, { text: "", included: true }] });
  };

  const updateFeature = (pkgId: string, fi: number, updates: Partial<Feature>) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    const newFeatures = pkg.features.map((f, i) => (i === fi ? { ...f, ...updates } : f));
    updatePkg(pkgId, { features: newFeatures });
  };

  const removeFeature = (pkgId: string, fi: number) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    updatePkg(pkgId, { features: pkg.features.filter((_, i) => i !== fi) });
  };

  // --- Coupon handlers ---
  const handleAddCoupon = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .insert({ code: "NEW" + Date.now().toString().slice(-4), discount_percentage: 10 })
      .select()
      .single();
    if (error) toast({ title: "Add failed", description: error.message, variant: "destructive" });
    else {
      setCoupons([data, ...coupons]);
      toast({ title: "Coupon added!" });
    }
  };

  const handleSaveCoupon = async (coupon: Coupon) => {
    setSaving(true);
    const { error } = await supabase
      .from("coupons")
      .update({
        code: coupon.code.toUpperCase(),
        discount_percentage: coupon.discount_percentage,
        active: coupon.active,
        valid_until: coupon.valid_until || null,
        usage_limit: coupon.usage_limit,
      })
      .eq("id", coupon.id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: `Coupon "${coupon.code}" saved!` });
    setSaving(false);
  };

  const handleDeleteCoupon = async (id: string) => {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      setCoupons(coupons.filter((c) => c.id !== id));
      toast({ title: "Coupon deleted!" });
    }
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  if (loading) return <p className="text-muted-foreground font-body">Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "packages" ? "default" : "outline"}
          onClick={() => setActiveTab("packages")}
          className="font-body"
        >
          <Tag className="w-4 h-4 mr-1" /> Packages & Offers
        </Button>
        <Button
          variant={activeTab === "coupons" ? "default" : "outline"}
          onClick={() => setActiveTab("coupons")}
          className="font-body"
        >
          <Percent className="w-4 h-4 mr-1" /> Coupons
        </Button>
      </div>

      {activeTab === "packages" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-display text-foreground">Service Packages</h2>
              <p className="text-sm text-muted-foreground font-body">Manage pricing, offers & discounts.</p>
            </div>
            <Button onClick={handleAdd} className="bg-gradient-fire hover:opacity-90 font-body">
              <Plus className="w-4 h-4 mr-1" /> Add Package
            </Button>
          </div>

          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === pkg.id ? null : pkg.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="font-display text-foreground">{pkg.name}</span>
                  <span className="text-sm text-muted-foreground font-body">{pkg.price}</span>
                  {pkg.popular && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">Popular</span>}
                  {pkg.discount_percentage > 0 && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-body">{pkg.discount_percentage}% OFF</span>
                  )}
                </div>
                {expandedId === pkg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {expandedId === pkg.id && (
                <div className="p-4 pt-0 space-y-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-xs">Package Name</Label>
                      <Input value={pkg.name} onChange={(e) => updatePkg(pkg.id, { name: e.target.value })} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-xs">Tagline</Label>
                      <Input value={pkg.tagline} onChange={(e) => updatePkg(pkg.id, { tagline: e.target.value })} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-xs">Icon</Label>
                      <select
                        value={pkg.icon}
                        onChange={(e) => updatePkg(pkg.id, { icon: e.target.value })}
                        className="w-full h-9 rounded-md bg-secondary border border-border px-3 text-sm font-body text-foreground"
                      >
                        {iconOptions.map((ic) => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-xs">Price</Label>
                      <Input value={pkg.price} onChange={(e) => updatePkg(pkg.id, { price: e.target.value })} className="bg-secondary border-border" placeholder="₹3,000 or Custom" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-xs">Duration</Label>
                      <Input value={pkg.duration} onChange={(e) => updatePkg(pkg.id, { duration: e.target.value })} className="bg-secondary border-border" placeholder="month / event / project" />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Switch checked={pkg.popular} onCheckedChange={(v) => updatePkg(pkg.id, { popular: v })} />
                      <Label className="font-body text-xs">Mark as Popular</Label>
                    </div>
                  </div>

                  {/* Discount / Offer Section */}
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-display text-foreground mb-3 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-primary" /> Offer / Discount
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="font-body text-xs">Discount % (0 = no discount)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={pkg.discount_percentage}
                          onChange={(e) => updatePkg(pkg.id, { discount_percentage: parseInt(e.target.value) || 0 })}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-body text-xs">Offer Label (e.g. "New Year Sale")</Label>
                        <Input
                          value={pkg.discount_label}
                          onChange={(e) => updatePkg(pkg.id, { discount_label: e.target.value })}
                          className="bg-secondary border-border"
                          placeholder="Limited Time Offer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-body text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Offer Ends At</Label>
                        <Input
                          type="datetime-local"
                          value={pkg.offer_ends_at ? pkg.offer_ends_at.slice(0, 16) : ""}
                          onChange={(e) => updatePkg(pkg.id, { offer_ends_at: e.target.value ? e.target.value + ":00Z" : null })}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <Label className="font-body text-xs mb-2 block">Features</Label>
                    <div className="space-y-2">
                      {pkg.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2">
                          <Switch checked={f.included} onCheckedChange={(v) => updateFeature(pkg.id, fi, { included: v })} />
                          <Input
                            value={f.text}
                            onChange={(e) => updateFeature(pkg.id, fi, { text: e.target.value })}
                            className="bg-secondary border-border flex-1"
                            placeholder="Feature name"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeFeature(pkg.id, fi)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addFeature(pkg.id)} className="mt-2 font-body">
                      <Plus className="w-3 h-3 mr-1" /> Add Feature
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button onClick={() => handleSave(pkg)} disabled={saving} className="bg-gradient-fire hover:opacity-90 font-body">
                      <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(pkg.id)} className="font-body">
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {activeTab === "coupons" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-display text-foreground">Coupon Codes</h2>
              <p className="text-sm text-muted-foreground font-body">Create coupons customers can apply for extra discounts.</p>
            </div>
            <Button onClick={handleAddCoupon} className="bg-gradient-fire hover:opacity-90 font-body">
              <Plus className="w-4 h-4 mr-1" /> Add Coupon
            </Button>
          </div>

          <div className="space-y-3">
            {coupons.length === 0 && <p className="text-muted-foreground font-body text-sm">No coupons yet.</p>}
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <Label className="font-body text-xs">Code</Label>
                    <Input
                      value={coupon.code}
                      onChange={(e) => updateCoupon(coupon.id, { code: e.target.value.toUpperCase() })}
                      className="bg-secondary border-border font-mono uppercase"
                      placeholder="SAVE10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body text-xs">Discount %</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={coupon.discount_percentage}
                      onChange={(e) => updateCoupon(coupon.id, { discount_percentage: parseInt(e.target.value) || 0 })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body text-xs">Valid Until</Label>
                    <Input
                      type="date"
                      value={coupon.valid_until ? coupon.valid_until.split("T")[0] : ""}
                      onChange={(e) => updateCoupon(coupon.id, { valid_until: e.target.value ? e.target.value + "T23:59:59Z" : null })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body text-xs">Usage Limit (blank=unlimited)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={coupon.usage_limit ?? ""}
                      onChange={(e) => updateCoupon(coupon.id, { usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                      className="bg-secondary border-border"
                      placeholder="∞"
                    />
                    <p className="text-xs text-muted-foreground font-body">Used: {coupon.usage_count} times</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2 pb-1">
                      <Switch checked={coupon.active} onCheckedChange={(v) => updateCoupon(coupon.id, { active: v })} />
                      <Label className="font-body text-xs">Active</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveCoupon(coupon)} disabled={saving} className="bg-gradient-fire hover:opacity-90 font-body">
                    <Save className="w-3 h-3 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteCoupon(coupon.id)} className="font-body">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PricingManager;
