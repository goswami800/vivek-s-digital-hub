import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Pencil, GripVertical } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  created_at: string;
}

const categories = [
  { value: "training", label: "Training" },
  { value: "diet", label: "Diet" },
  { value: "pricing", label: "Pricing" },
  { value: "availability", label: "Availability" },
  { value: "general", label: "General" },
];

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");
  const [sortOrder, setSortOrder] = useState("0");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    setFaqs(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setQuestion(""); setAnswer(""); setCategory("general"); setSortOrder("0"); setEditing(null); setShowForm(false);
  };

  const handleEdit = (faq: FAQ) => {
    setEditing(faq); setQuestion(faq.question); setAnswer(faq.answer);
    setCategory(faq.category); setSortOrder(String(faq.sort_order)); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast({ title: "Question and answer are required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload: any = {
      question: question.trim(),
      answer: answer.trim(),
      category,
      sort_order: parseInt(sortOrder) || 0,
    };

    const { error } = editing
      ? await supabase.from("faqs").update(payload).eq("id", editing.id)
      : await supabase.from("faqs").insert([payload]);

    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "FAQ updated!" : "FAQ added!" }); resetForm(); fetchFaqs(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "FAQ deleted" }); fetchFaqs(); }
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-gradient-fire hover:opacity-90 font-body">
          <Plus className="w-4 h-4 mr-1" /> New FAQ
        </Button>
      )}

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-display text-foreground mb-4">{editing ? "Edit FAQ" : "New FAQ"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Question *</Label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. How long are training sessions?" className="bg-secondary border-border" maxLength={300} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Answer *</Label>
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} className="bg-secondary border-border" maxLength={1000} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body">Sort Order</Label>
                <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="0" className="bg-secondary border-border" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="bg-gradient-fire hover:opacity-90 font-body">
                {saving ? "Saving..." : editing ? "Update" : "Add FAQ"}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm} className="font-body">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-xl font-display text-foreground mb-4">All FAQs ({faqs.length})</h2>
        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : faqs.length === 0 ? (
          <p className="text-muted-foreground font-body">No FAQs yet.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-body text-foreground text-sm">{faq.question}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1 line-clamp-1">{faq.answer}</p>
                    <span className="text-xs font-body text-primary uppercase">{faq.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(faq)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(faq.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
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

export default FAQManager;
