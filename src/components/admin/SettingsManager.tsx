import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Smile, Lock, MessageCircle, BarChart3, Save } from "lucide-react";

const statKeys = [
  { key: "stat_years", label: "Years Experience", default: "5" },
  { key: "stat_clients", label: "Clients Trained", default: "200" },
  { key: "stat_events", label: "Events Planned", default: "100" },
  { key: "stat_programs", label: "Programs Designed", default: "50" },
];

const SettingsManager = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [stats, setStats] = useState<Record<string, string>>({});
  const [savingStats, setSavingStats] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Record<string, string> = {};
    data?.forEach((d) => { map[d.key] = d.value; });
    setCurrentImage(map["greeting_image"] || null);
    setWhatsapp(map["whatsapp_number"] || "");
    const s: Record<string, string> = {};
    statKeys.forEach((sk) => { s[sk.key] = map[sk.key] || sk.default; });
    setStats(s);
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `greeting-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "greeting_image", value: urlData.publicUrl, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Greeting character updated!" });
      setCurrentImage(urlData.publicUrl);
      setFile(null);
    }
    setUploading(false);
  };

  const handleSaveWhatsapp = async () => {
    setSavingWhatsapp(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "whatsapp_number", value: whatsapp.trim(), updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "WhatsApp number saved!" });
    setSavingWhatsapp(false);
  };

  const handleSaveStats = async () => {
    setSavingStats(true);
    const upserts = Object.entries(stats).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("site_settings").upsert(upserts, { onConflict: "key" });
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Stats updated!" });
    setSavingStats(false);
  };

  return (
    <div className="space-y-8">
      {/* Greeting Character */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4">Greeting Character</h2>
        <p className="text-sm text-muted-foreground font-body mb-6">This cartoon character appears in the welcome popup.</p>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <Label className="font-body text-muted-foreground mb-2 block">Current</Label>
            <div className="w-32 h-32 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden">
              {loading ? <p className="text-xs text-muted-foreground font-body">Loading...</p>
                : currentImage ? <img src={currentImage} alt="Greeting character" className="w-full h-full object-cover" />
                : <Smile className="w-10 h-10 text-muted-foreground" />}
            </div>
          </div>
          <form onSubmit={handleUpload} className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Upload New Character</Label>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
            </div>
            <Button type="submit" disabled={!file || uploading} className="bg-gradient-fire hover:opacity-90 font-body">
              <Upload className="w-4 h-4 mr-1" /> {uploading ? "Uploading..." : "Update Character"}
            </Button>
          </form>
        </div>
      </div>

      {/* WhatsApp Number */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5" /> WhatsApp Number</h2>
        <p className="text-sm text-muted-foreground font-body mb-4">Used for the floating chat button and booking form.</p>
        <div className="flex gap-3 max-w-md">
          <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+919876543210" className="bg-secondary border-border" maxLength={20} />
          <Button onClick={handleSaveWhatsapp} disabled={savingWhatsapp} className="bg-gradient-fire hover:opacity-90 font-body">
            <Save className="w-4 h-4 mr-1" /> {savingWhatsapp ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Stats Counter</h2>
        <p className="text-sm text-muted-foreground font-body mb-4">Numbers shown in the animated stats section on the homepage.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {statKeys.map((sk) => (
            <div key={sk.key} className="space-y-2">
              <Label className="font-body text-xs">{sk.label}</Label>
              <Input
                type="number"
                value={stats[sk.key] || ""}
                onChange={(e) => setStats((prev) => ({ ...prev, [sk.key]: e.target.value }))}
                className="bg-secondary border-border"
              />
            </div>
          ))}
        </div>
        <Button onClick={handleSaveStats} disabled={savingStats} className="bg-gradient-fire hover:opacity-90 font-body">
          <Save className="w-4 h-4 mr-1" /> {savingStats ? "Saving..." : "Save Stats"}
        </Button>
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display text-foreground mb-4">Change Password</h2>
        <p className="text-sm text-muted-foreground font-body mb-6">Update your admin account password.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (newPassword.length < 6) { toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" }); return; }
            if (newPassword !== confirmPassword) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
            setChangingPassword(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) toast({ title: "Failed to update password", description: error.message, variant: "destructive" });
            else { toast({ title: "Password updated successfully!" }); setNewPassword(""); setConfirmPassword(""); }
            setChangingPassword(false);
          }}
          className="max-w-md space-y-4"
        >
          <div className="space-y-2">
            <Label className="font-body">New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="bg-secondary border-border" minLength={6} required />
          </div>
          <div className="space-y-2">
            <Label className="font-body">Confirm Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="bg-secondary border-border" minLength={6} required />
          </div>
          <Button type="submit" disabled={changingPassword} className="bg-gradient-fire hover:opacity-90 font-body">
            <Lock className="w-4 h-4 mr-1" /> {changingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SettingsManager;
