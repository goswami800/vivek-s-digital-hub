import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Smile } from "lucide-react";

const SettingsManager = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGreetingImage();
  }, []);

  const fetchGreetingImage = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "greeting_image")
      .maybeSingle();
    setCurrentImage(data?.value || null);
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `greeting-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // Upsert the setting
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "greeting_image", value: imageUrl, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Greeting character updated!" });
      setCurrentImage(imageUrl);
      setFile(null);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4">Greeting Character</h2>
        <p className="text-sm text-muted-foreground font-body mb-6">
          This cartoon character appears in the welcome popup when someone visits your portfolio.
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Current preview */}
          <div className="flex-shrink-0">
            <Label className="font-body text-muted-foreground mb-2 block">Current</Label>
            <div className="w-32 h-32 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden">
              {loading ? (
                <p className="text-xs text-muted-foreground font-body">Loading...</p>
              ) : currentImage ? (
                <img src={currentImage} alt="Greeting character" className="w-full h-full object-cover" />
              ) : (
                <Smile className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Upload form */}
          <form onSubmit={handleUpload} className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Upload New Character</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" disabled={!file || uploading} className="bg-gradient-fire hover:opacity-90 font-body">
              <Upload className="w-4 h-4 mr-1" />
              {uploading ? "Uploading..." : "Update Character"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
