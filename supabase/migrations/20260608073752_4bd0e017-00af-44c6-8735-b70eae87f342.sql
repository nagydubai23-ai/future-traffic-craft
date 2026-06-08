CREATE TABLE public.image_alt_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  alt_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.image_alt_texts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.image_alt_texts TO authenticated;
GRANT ALL ON public.image_alt_texts TO service_role;

ALTER TABLE public.image_alt_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read alt text" ON public.image_alt_texts FOR SELECT USING (true);
CREATE POLICY "Admins manage alt text" ON public.image_alt_texts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_image_alt_texts_updated_at BEFORE UPDATE ON public.image_alt_texts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();