import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Failed to update password", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully!" });
      navigate("/admin-login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-display text-gradient-fire">RESET PASSWORD</h1>
          <p className="text-muted-foreground font-body mt-2">Enter your new password</p>
        </div>
        {!ready ? (
          <p className="text-center text-muted-foreground font-body">Verifying reset link...</p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-secondary border-border" minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="font-body">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-secondary border-border" minLength={6} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-fire hover:opacity-90 font-body">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
        <div className="text-center">
          <a href="/admin-login" className="text-sm text-muted-foreground hover:text-primary font-body transition-colors">← Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
