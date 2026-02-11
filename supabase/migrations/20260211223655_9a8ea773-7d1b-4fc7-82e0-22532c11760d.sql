CREATE TABLE public.diet_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'weight-loss',
  price NUMERIC NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT '1 Month',
  features TEXT[] NOT NULL DEFAULT '{}',
  popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view diet plans" ON public.diet_plans FOR SELECT USING (true);
CREATE POLICY "Admins can insert diet plans" ON public.diet_plans FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update diet plans" ON public.diet_plans FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete diet plans" ON public.diet_plans FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));