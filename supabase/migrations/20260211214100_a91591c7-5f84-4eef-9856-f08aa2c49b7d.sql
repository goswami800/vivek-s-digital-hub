
-- Create instagram_posts table
CREATE TABLE public.instagram_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'post' CHECK (type IN ('post', 'reel')),
  thumbnail TEXT,
  caption TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view
CREATE POLICY "Anyone can view instagram posts"
ON public.instagram_posts
FOR SELECT
USING (true);

-- Admins can insert
CREATE POLICY "Admins can insert instagram posts"
ON public.instagram_posts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete instagram posts"
ON public.instagram_posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update
CREATE POLICY "Admins can update instagram posts"
ON public.instagram_posts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
