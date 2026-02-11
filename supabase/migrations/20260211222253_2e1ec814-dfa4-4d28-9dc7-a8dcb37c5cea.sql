-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  image TEXT,
  category TEXT NOT NULL DEFAULT 'fitness',
  slug TEXT NOT NULL UNIQUE,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Transformations table
CREATE TABLE public.transformations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  before_image TEXT NOT NULL,
  after_image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transformations" ON public.transformations FOR SELECT USING (true);
CREATE POLICY "Admins can insert transformations" ON public.transformations FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update transformations" ON public.transformations FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete transformations" ON public.transformations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for blog images and transformation images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('transformations', 'transformations', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog');
CREATE POLICY "Admins can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete blog images" ON storage.objects FOR DELETE USING (bucket_id = 'blog' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view transformation images" ON storage.objects FOR SELECT USING (bucket_id = 'transformations');
CREATE POLICY "Admins can upload transformation images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'transformations' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete transformation images" ON storage.objects FOR DELETE USING (bucket_id = 'transformations' AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for blog updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();