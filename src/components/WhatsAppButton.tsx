import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WhatsAppButton = () => {
  const [number, setNumber] = useState("");

  useEffect(() => {
    const fetchNumber = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "whatsapp_number")
        .maybeSingle();
      if (data) setNumber(data.value);
    };
    fetchNumber();
  }, []);

  if (!number) return null;

  const clean = number.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${clean}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 animate-fade-in"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
