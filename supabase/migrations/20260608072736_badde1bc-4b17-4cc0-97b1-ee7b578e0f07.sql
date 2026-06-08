-- Add SEO columns to content tables
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS og_title text,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nofollow boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS schema_type text,
  ADD COLUMN IF NOT EXISTS schema_json jsonb,
  ADD COLUMN IF NOT EXISTS priority numeric(2,1) DEFAULT 0.7,
  ADD COLUMN IF NOT EXISTS changefreq text DEFAULT 'weekly';

ALTER TABLE public.cities
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS og_title text,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nofollow boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS schema_type text,
  ADD COLUMN IF NOT EXISTS schema_json jsonb,
  ADD COLUMN IF NOT EXISTS priority numeric(2,1) DEFAULT 0.6,
  ADD COLUMN IF NOT EXISTS changefreq text DEFAULT 'monthly';

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS og_title text,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nofollow boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS schema_type text DEFAULT 'Article',
  ADD COLUMN IF NOT EXISTS schema_json jsonb,
  ADD COLUMN IF NOT EXISTS priority numeric(2,1) DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS changefreq text DEFAULT 'monthly';

-- Redirects table
CREATE TABLE IF NOT EXISTS public.redirects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL UNIQUE,
  destination text NOT NULL,
  status_code integer NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302)),
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;

ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon view active redirects" ON public.redirects
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Authenticated view redirects" ON public.redirects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert redirects" ON public.redirects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update redirects" ON public.redirects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete redirects" ON public.redirects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_redirects_updated_at
  BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();