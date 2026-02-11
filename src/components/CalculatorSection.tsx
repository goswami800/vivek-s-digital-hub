import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Activity } from "lucide-react";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;
    const bmi = w / (h * h);
    let category = "";
    let color = "";
    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-400"; }
    else if (bmi < 25) { category = "Normal Weight"; color = "text-green-400"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-yellow-400"; }
    else { category = "Obese"; color = "text-red-400"; }
    setBmiResult({ bmi: Math.round(bmi * 10) / 10, category, color });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body">Height (cm)</Label>
          <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label className="font-body">Weight (kg)</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="bg-secondary border-border" />
        </div>
      </div>
      <Button onClick={calculateBMI} className="w-full bg-gradient-fire hover:opacity-90 font-body">
        <Calculator className="w-4 h-4 mr-2" /> Calculate BMI
      </Button>
      {bmiResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary rounded-xl p-5 text-center">
          <p className="text-5xl font-display text-gradient-fire mb-2">{bmiResult.bmi}</p>
          <p className={`text-lg font-body font-semibold ${bmiResult.color}`}>{bmiResult.category}</p>
          <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-fire rounded-full transition-all duration-500"
              style={{ width: `${Math.min((bmiResult.bmi / 40) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-body text-muted-foreground mt-1">
            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const CalorieCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState<{ maintenance: number; loss: number; gain: number } | null>(null);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extreme: 1.9,
  };

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w) return;

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const maintenance = Math.round(bmr * activityMultipliers[activity]);
    setResult({
      maintenance,
      loss: maintenance - 500,
      gain: maintenance + 500,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body">Age</Label>
          <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label className="font-body">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body">Height (cm)</Label>
          <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label className="font-body">Weight (kg)</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="bg-secondary border-border" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-body">Activity Level</Label>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
            <SelectItem value="light">Light (1-3 days/week)</SelectItem>
            <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
            <SelectItem value="active">Active (6-7 days/week)</SelectItem>
            <SelectItem value="extreme">Extreme (athlete)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calculate} className="w-full bg-gradient-fire hover:opacity-90 font-body">
        <Activity className="w-4 h-4 mr-2" /> Calculate Calories
      </Button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          <div className="bg-secondary rounded-xl p-4 text-center">
            <p className="text-xs font-body text-muted-foreground uppercase mb-1">Weight Loss</p>
            <p className="text-2xl font-display text-gradient-fire">{result.loss}</p>
            <p className="text-xs font-body text-muted-foreground">cal/day</p>
          </div>
          <div className="bg-secondary rounded-xl p-4 text-center border-2 border-primary">
            <p className="text-xs font-body text-primary uppercase mb-1">Maintain</p>
            <p className="text-2xl font-display text-gradient-fire">{result.maintenance}</p>
            <p className="text-xs font-body text-muted-foreground">cal/day</p>
          </div>
          <div className="bg-secondary rounded-xl p-4 text-center">
            <p className="text-xs font-body text-muted-foreground uppercase mb-1">Muscle Gain</p>
            <p className="text-2xl font-display text-gradient-fire">{result.gain}</p>
            <p className="text-xs font-body text-muted-foreground">cal/day</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const CalculatorSection = () => {
  return (
    <section id="calculator" className="py-20 md:py-32 bg-card/50">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-5xl md:text-6xl font-display text-gradient-fire mb-4">FITNESS TOOLS</h2>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Check your BMI or calculate daily calorie needs to kickstart your fitness journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="bmi" className="w-full">
            <TabsList className="w-full bg-secondary border border-border mb-6">
              <TabsTrigger value="bmi" className="flex-1 font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Calculator className="w-4 h-4" /> BMI
              </TabsTrigger>
              <TabsTrigger value="calories" className="flex-1 font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Activity className="w-4 h-4" /> Calories
              </TabsTrigger>
            </TabsList>
            <div className="bg-card rounded-xl border border-border p-6">
              <TabsContent value="bmi" className="mt-0"><BMICalculator /></TabsContent>
              <TabsContent value="calories" className="mt-0"><CalorieCalculator /></TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorSection;
