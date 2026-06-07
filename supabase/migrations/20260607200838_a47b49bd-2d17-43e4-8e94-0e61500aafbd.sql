
-- 1) Extend role enum (idempotent)
DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Quote status enum
DO $$ BEGIN
  CREATE TYPE public.quote_status AS ENUM ('pending','under_review','quote_sent','completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3) Services: bilingual extras
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS description_ar text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS content_ar text,
  ADD COLUMN IF NOT EXISTS content_en text,
  ADD COLUMN IF NOT EXISTS icon text;

UPDATE public.services SET icon = COALESCE(icon, icon_name);
UPDATE public.services SET description_ar = COALESCE(description_ar, short_description);
UPDATE public.services SET content_ar = COALESCE(content_ar, hero_description);

-- 4) Cities: bilingual SEO content
ALTER TABLE public.cities
  ADD COLUMN IF NOT EXISTS seo_content_ar text,
  ADD COLUMN IF NOT EXISTS seo_content_en text;

UPDATE public.cities SET seo_content_ar = COALESCE(seo_content_ar, body, hero_description);

-- 5) Projects: bilingual + relational
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS title_ar text,
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_city ON public.projects(city_id);
CREATE INDEX IF NOT EXISTS idx_projects_service ON public.projects(service_id);

-- 6) Quote requests: relational + status
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status public.quote_status NOT NULL DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_quote_requests_client ON public.quote_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);

-- 7) Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  company text,
  phone text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8) Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_ar text NOT NULL,
  title_en text,
  body_ar text,
  body_en text,
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon view published blog posts" ON public.blog_posts
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Authenticated view blog posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (is_published = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert blog posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update blog posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete blog posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 9) Quote attachments
CREATE TABLE IF NOT EXISTS public.quote_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.quote_attachments TO authenticated;
GRANT ALL ON public.quote_attachments TO service_role;

ALTER TABLE public.quote_attachments ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_quote_attachments_request ON public.quote_attachments(request_id);

CREATE POLICY "Admins view all attachments" ON public.quote_attachments
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner views own attachments" ON public.quote_attachments
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quote_requests qr WHERE qr.id = request_id AND qr.client_id = auth.uid())
  );
CREATE POLICY "Owner inserts own attachments" ON public.quote_attachments
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.quote_requests qr WHERE qr.id = request_id AND qr.client_id = auth.uid())
  );
CREATE POLICY "Admins delete attachments" ON public.quote_attachments
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
