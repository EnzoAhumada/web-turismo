-- Permite que un administrador publique astrofotos a nombre de un perfil de la comunidad.
DROP POLICY IF EXISTS "Admin publica astrofotos" ON public.astro_photos;
CREATE POLICY "Admin publica astrofotos" ON public.astro_photos
  FOR INSERT
  WITH CHECK (public.is_admin());
