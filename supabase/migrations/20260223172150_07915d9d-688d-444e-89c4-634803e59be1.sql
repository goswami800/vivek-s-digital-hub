
CREATE TABLE public.brand_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'reel',
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT 'per post',
  features TEXT[] NOT NULL DEFAULT '{}',
  popular BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active brand services"
ON public.brand_services FOR SELECT USING (true);

CREATE POLICY "Admins can manage brand services"
ON public.brand_services FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
