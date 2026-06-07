
-- Revoke execute from anon/public; keep for authenticated (used in RLS)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Split SELECT policies: anon only sees published; authenticated sees published or all (if admin)
DROP POLICY "Anyone can view published projects" ON public.projects;
CREATE POLICY "Anon can view published projects"
  ON public.projects FOR SELECT TO anon
  USING (is_published = TRUE);
CREATE POLICY "Authenticated can view projects"
  ON public.projects FOR SELECT TO authenticated
  USING (is_published = TRUE OR public.has_role(auth.uid(), 'admin'));

DROP POLICY "Anyone can view published cities" ON public.cities;
CREATE POLICY "Anon can view published cities"
  ON public.cities FOR SELECT TO anon
  USING (is_published = TRUE);
CREATE POLICY "Authenticated can view cities"
  ON public.cities FOR SELECT TO authenticated
  USING (is_published = TRUE OR public.has_role(auth.uid(), 'admin'));
