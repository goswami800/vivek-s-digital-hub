
-- Add offer deadline to service_packages for countdown timer
ALTER TABLE public.service_packages
ADD COLUMN offer_ends_at timestamp with time zone DEFAULT NULL;

-- Add usage limits to coupons
ALTER TABLE public.coupons
ADD COLUMN usage_limit integer DEFAULT NULL,
ADD COLUMN usage_count integer NOT NULL DEFAULT 0;
