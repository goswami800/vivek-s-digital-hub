import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, Image, Pencil, Check, X, Pin, PinOff } from "lucide-react";

interface GalleryPhoto {
  id: string;
  src: string;
  category: string;
  alt: string;
  created_at: string;
  pinned: boolean;
}

const GalleryManager = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("fitness");
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const { toast } = useToast();

  const handleEditSave = async (id: string) => {
    const { error } = await supabase
      .from("gallery_photos")
      .update({ alt: editAlt })
      .eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Description updated!" });
      setEditingId(null);
      fetchPhotos();
    }
  };

  const handleTogglePin = async (photo: GalleryPhoto) => {
    const { error } = await supabase
      .from("gallery_photos")
      .update({ pinned: !photo.pinned })
      .eq("id", photo.id);
    if (error) {
      toast({ title: "Pin update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: photo.pinned ? "Photo unpinned" : "Photo pinned!" });
      fetchPhotos();
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false });
    setPhotos(data || []);
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from("gallery_photos")
      .insert({ src: urlData.publicUrl, category, alt: alt || file.name });

    if (insertError) {
      toast({ title: "Save failed", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Photo added!" });
      setFile(null);
      setAlt("");
      fetchPhotos();
    }
    setUploading(false);
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    const parts = photo.src.split("/");
    const fileName = parts[parts.length - 1];

    await supabase.storage.from("gallery").remove([fileName]);
    const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);

    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Photo deleted" });
      fetchPhotos();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4">Upload Photo</h2>
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label className="font-body">Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
          </div>
          <div className="w-full md:w-40 space-y-2">
            <Label className="font-body">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="modeling">Modeling</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label className="font-body">Alt Text</Label>
            <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the photo" className="bg-secondary border-border" />
          </div>
          <Button type="submit" disabled={!file || uploading} className="bg-gradient-fire hover:opacity-90 font-body">
            <Upload className="w-4 h-4 mr-1" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-display text-foreground mb-4">All Photos ({photos.length})</h2>
        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : photos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-body">No photos yet. Upload your first one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-secondary aspect-square">
                {photo.pinned && (
                  <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                    <Pin className="w-3 h-3" />
                  </div>
                )}
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <span className="text-xs font-body text-muted-foreground uppercase">{photo.category}</span>
                  {editingId === photo.id ? (
                    <div className="flex flex-col items-center gap-2 px-2 w-full">
                      <Input
                        value={editAlt}
                        onChange={(e) => setEditAlt(e.target.value)}
                        className="bg-secondary border-border text-sm"
                        placeholder="Photo description"
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleEditSave(photo.id)} className="bg-gradient-fire">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-body text-foreground px-2 text-center">{photo.alt}</p>
                      <div className="flex gap-1 flex-wrap justify-center">
                        <Button size="sm" variant={photo.pinned ? "default" : "outline"} onClick={() => handleTogglePin(photo)}>
                          {photo.pinned ? <PinOff className="w-4 h-4 mr-1" /> : <Pin className="w-4 h-4 mr-1" />}
                          {photo.pinned ? "Unpin" : "Pin"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(photo.id); setEditAlt(photo.alt); }}>
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(photo)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
