import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, ArrowRightLeft } from "lucide-react";

interface Transformation {
  id: string;
  client_name: string;
  description: string;
  before_image: string;
  after_image: string;
  created_at: string;
}

const TransformationsManager = () => {
  const [items, setItems] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("transformations").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const uploadFile = async (file: File) => {
    const ext = file.name.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("transformations").upload(name, file);
    if (error) throw error;
    return supabase.storage.from("transformations").getPublicUrl(name).data.publicUrl;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      toast({ title: "Both before and after images are required", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const beforeUrl = await uploadFile(beforeFile);
      const afterUrl = await uploadFile(afterFile);
      const { error } = await supabase.from("transformations").insert({
        client_name: clientName.trim(),
        description: description.trim(),
        before_image: beforeUrl,
        after_image: afterUrl,
      });
      if (error) throw error;
      toast({ title: "Transformation added!" });
      setClientName(""); setDescription(""); setBeforeFile(null); setAfterFile(null);
      fetchItems();
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleDelete = async (item: Transformation) => {
    // Delete storage files
    const getFileName = (url: string) => url.split("/").pop() || "";
    await supabase.storage.from("transformations").remove([getFileName(item.before_image), getFileName(item.after_image)]);
    const { error } = await supabase.from("transformations").delete().eq("id", item.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4">Add Transformation</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body">Before Image *</Label>
              <Input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">After Image *</Label>
              <Input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body">Client Name</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Optional" className="bg-secondary border-border" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. 12-week transformation" className="bg-secondary border-border" maxLength={200} />
            </div>
          </div>
          <Button type="submit" disabled={!beforeFile || !afterFile || uploading} className="bg-gradient-fire hover:opacity-90 font-body">
            <Upload className="w-4 h-4 mr-1" /> {uploading ? "Uploading..." : "Add Transformation"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-display text-foreground mb-4">All Transformations ({items.length})</h2>
        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ArrowRightLeft className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-body">No transformations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-2 aspect-[2/1]">
                  <img src={item.before_image} alt="Before" className="w-full h-full object-cover" />
                  <img src={item.after_image} alt="After" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-body text-foreground text-sm">{item.client_name || "Unnamed"}</p>
                    <p className="font-body text-muted-foreground text-xs">{item.description}</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item)}>
                    <Trash2 className="w-4 h-4" />
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

export default TransformationsManager;
