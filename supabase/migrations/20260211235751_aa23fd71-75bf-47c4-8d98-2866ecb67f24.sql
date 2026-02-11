-- Create client reviews table
CREATE TABLE public.client_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  designation TEXT DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_reviews ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Reviews are publicly readable"
ON public.client_reviews
FOR SELECT
USING (true);

-- Admin manage
CREATE POLICY "Admins can manage reviews"
ON public.client_reviews
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));