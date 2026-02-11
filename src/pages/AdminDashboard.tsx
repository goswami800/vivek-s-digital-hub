import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Image, Instagram, Settings, FileText, ArrowRightLeft, UtensilsCrossed, HelpCircle, Trophy, Video } from "lucide-react";
import GalleryManager from "@/components/admin/GalleryManager";
import InstagramManager from "@/components/admin/InstagramManager";
import SettingsManager from "@/components/admin/SettingsManager";
import BlogManager from "@/components/admin/BlogManager";
import TransformationsManager from "@/components/admin/TransformationsManager";
import DietPlansManager from "@/components/admin/DietPlansManager";
import FAQManager from "@/components/admin/FAQManager";
import AchievementsManager from "@/components/admin/AchievementsManager";
import VideosManager from "@/components/admin/VideosManager";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin-login");
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      navigate("/admin-login");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-display text-gradient-fire">ADMIN PANEL</h1>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary font-body transition-colors">View Site</a>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="bg-secondary border border-border mb-6 flex-wrap h-auto">
            <TabsTrigger value="gallery" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Image className="w-4 h-4" /> Gallery
            </TabsTrigger>
            <TabsTrigger value="blog" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <FileText className="w-4 h-4" /> Blog
            </TabsTrigger>
            <TabsTrigger value="transformations" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <ArrowRightLeft className="w-4 h-4" /> Transformations
            </TabsTrigger>
            <TabsTrigger value="diet" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <UtensilsCrossed className="w-4 h-4" /> Diet Plans
            </TabsTrigger>
            <TabsTrigger value="instagram" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Instagram className="w-4 h-4" /> Instagram
            </TabsTrigger>
            <TabsTrigger value="faq" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <HelpCircle className="w-4 h-4" /> FAQ
            </TabsTrigger>
            <TabsTrigger value="achievements" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Trophy className="w-4 h-4" /> Achievements
            </TabsTrigger>
            <TabsTrigger value="videos" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Video className="w-4 h-4" /> Videos
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gallery"><GalleryManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="transformations"><TransformationsManager /></TabsContent>
          <TabsContent value="diet"><DietPlansManager /></TabsContent>
          <TabsContent value="instagram"><InstagramManager /></TabsContent>
          <TabsContent value="faq"><FAQManager /></TabsContent>
          <TabsContent value="achievements"><AchievementsManager /></TabsContent>
          <TabsContent value="videos"><VideosManager /></TabsContent>
          <TabsContent value="settings"><SettingsManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
