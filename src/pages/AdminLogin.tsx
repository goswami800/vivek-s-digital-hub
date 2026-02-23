import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      setResetSent(true);
      toast({ title: "Reset email sent!", description: "Check your inbox for the reset link." });
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You are not an admin.", variant: "destructive" });
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-display text-gradient-fire">ADMIN LOGIN</h1>
          <p className="text-muted-foreground font-body mt-2">Sign in to manage gallery</p>
        </div>
        {resetSent ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground font-body">A password reset link has been sent to <strong>{email}</strong>. Check your email and click the link to reset your password.</p>
            <Button variant="outline" onClick={() => { setResetSent(false); setForgotMode(false); }} className="font-body">Back to Login</Button>
          </div>
        ) : forgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-secondary border-border" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-fire hover:opacity-90 font-body">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <button type="button" onClick={() => setForgotMode(false)} className="text-sm text-muted-foreground hover:text-primary font-body transition-colors w-full text-center">← Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-secondary border-border" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-fire hover:opacity-90 font-body">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <button type="button" onClick={() => setForgotMode(true)} className="text-sm text-muted-foreground hover:text-primary font-body transition-colors w-full text-center">Forgot Password?</button>
          </form>
        )}
        <div className="text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary font-body transition-colors">← Back to site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
