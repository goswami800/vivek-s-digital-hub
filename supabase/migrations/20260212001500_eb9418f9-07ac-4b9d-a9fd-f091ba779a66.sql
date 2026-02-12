
CREATE TABLE public.service_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'dumbbell',
  price TEXT NOT NULL DEFAULT 'Custom',
  duration TEXT NOT NULL DEFAULT 'month',
  popular BOOLEAN NOT NULL DEFAULT false,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service packages" ON public.service_packages FOR SELECT USING (true);
CREATE POLICY "Admins can manage service packages" ON public.service_packages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed with existing hardcoded data
INSERT INTO public.service_packages (name, tagline, icon, price, duration, popular, features, sort_order) VALUES
('Personal Training', '1-on-1 gym sessions', 'dumbbell', '₹3,000', 'month', false, '[{"text":"Customized workout plan","included":true},{"text":"In-person gym sessions","included":true},{"text":"Form correction & spotting","included":true},{"text":"Progress tracking","included":true},{"text":"Diet guidance","included":true},{"text":"24/7 WhatsApp support","included":false},{"text":"Video analysis","included":false}]', 0),
('Online Coaching', 'Train from anywhere', 'monitor', '₹2,000', 'month', true, '[{"text":"Customized workout plan","included":true},{"text":"Video demonstrations","included":true},{"text":"Weekly check-ins","included":true},{"text":"Progress tracking","included":true},{"text":"Diet guidance","included":true},{"text":"24/7 WhatsApp support","included":true},{"text":"Video analysis","included":true}]', 1),
('Event Planning', 'Fitness events & expos', 'calendar', 'Custom', 'event', false, '[{"text":"Event concept & design","included":true},{"text":"Venue coordination","included":true},{"text":"Athlete management","included":true},{"text":"Sponsorship handling","included":true},{"text":"Marketing & promotion","included":true},{"text":"On-day management","included":true},{"text":"Post-event reporting","included":true}]', 2),
('Modeling / Brand', 'Collaborations & shoots', 'camera', 'Custom', 'project', false, '[{"text":"Brand collaboration","included":true},{"text":"Product shoots","included":true},{"text":"Social media promotion","included":true},{"text":"Fitness campaigns","included":true},{"text":"Content creation","included":true},{"text":"Reel & video shoots","included":true},{"text":"Long-term partnerships","included":true}]', 3);
