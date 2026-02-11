import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BookingSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchNumber = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "whatsapp_number")
        .maybeSingle();
      if (data) setWhatsappNumber(data.value);
    };
    fetchNumber();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !service) {
      toast({ title: "Please fill in your name and select a service", variant: "destructive" });
      return;
    }

    const text = `Hi Vivek! I'd like to book a consultation.\n\n*Name:* ${name.trim()}\n*Phone:* ${phone.trim()}\n*Service:* ${service}\n*Message:* ${message.trim() || "N/A"}`;
    const encoded = encodeURIComponent(text);
    const number = whatsappNumber.replace(/[^0-9]/g, "");

    if (!number) {
      toast({ title: "WhatsApp not configured yet. Please try again later.", variant: "destructive" });
      return;
    }

    window.open(`https://wa.me/${number}?text=${encoded}`, "_blank");
    toast({ title: "Redirecting to WhatsApp!" });
    setName(""); setPhone(""); setService(""); setMessage("");
  };

  return (
    <section id="booking" className="py-20 md:py-32 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">BOOK A SESSION</h2>
            <p className="text-muted-foreground font-body mb-6">
              Ready to transform your fitness journey or plan an unforgettable event? Fill out the form and I'll connect with you on WhatsApp.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-body text-foreground text-sm">Quick Response</p>
                  <p className="font-body text-muted-foreground text-xs">Usually within 1 hour</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-body text-foreground text-sm">Direct Chat</p>
                  <p className="font-body text-muted-foreground text-xs">Talk directly via WhatsApp</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-xl border border-border p-6 space-y-4"
          >
            <div className="space-y-2">
              <Label className="font-body">Your Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="bg-secondary border-border" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="bg-secondary border-border" maxLength={20} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Service *</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select a service" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Training">Personal Training</SelectItem>
                  <SelectItem value="Online Coaching">Online Coaching</SelectItem>
                  <SelectItem value="Diet Plan">Diet Plan</SelectItem>
                  <SelectItem value="Event Planning">Event Planning</SelectItem>
                  <SelectItem value="Modeling Inquiry">Modeling Inquiry</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your goals..." className="bg-secondary border-border" rows={3} maxLength={500} />
            </div>
            <Button type="submit" className="w-full bg-gradient-fire hover:opacity-90 font-body text-lg py-6">
              <MessageCircle className="w-5 h-5 mr-2" /> Book via WhatsApp
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
