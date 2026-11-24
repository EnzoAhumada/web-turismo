-- =============================================================================
-- THAKIGO — Turismo Andacollo y Región de Coquimbo
-- Migración 004: Noticias de Andacollo, Admin Astronomía/Experiencias y Perfil Real
-- =============================================================================

-- 1. NOTICIAS (Noticias locales de Andacollo administrables y sincronizables)
CREATE TABLE IF NOT EXISTS public.noticias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  slug text UNIQUE,
  resumen text NOT NULL,
  contenido text NOT NULL,
  imagen_url text,
  fuente text NOT NULL DEFAULT 'Municipalidad de Andacollo',
  url_externa text,
  categoria text NOT NULL DEFAULT 'Comuna',
  origen text NOT NULL DEFAULT 'manual' CHECK (origen IN ('manual', 'automatica')),
  fecha_publicacion timestamptz NOT NULL DEFAULT now(),
  destacada boolean NOT NULL DEFAULT false,
  activa boolean NOT NULL DEFAULT true,
  comuna text NOT NULL DEFAULT 'Andacollo',
  region text NOT NULL DEFAULT 'Coquimbo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS noticias_url_externa_unique_idx
  ON public.noticias (url_externa)
  WHERE url_externa IS NOT NULL AND url_externa <> '';

CREATE INDEX IF NOT EXISTS noticias_fecha_publicacion_idx
  ON public.noticias (fecha_publicacion DESC);

ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de noticias activas" ON public.noticias;
CREATE POLICY "Lectura pública de noticias activas"
  ON public.noticias FOR SELECT
  USING (activa = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin gestiona noticias" ON public.noticias;
CREATE POLICY "Admin gestiona noticias"
  ON public.noticias FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. AMPLIAR PROFILES (Datos útiles y preferencias persistidas del usuario)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS biografia text DEFAULT '',
  ADD COLUMN IF NOT EXISTS ciudad_origen text DEFAULT 'Región de Coquimbo',
  ADD COLUMN IF NOT EXISTS preferencia_offline boolean NOT NULL DEFAULT false;

-- 3. POLÍTICAS RLS DE ADMINISTRACIÓN PARA TABLAS ASTRONÓMICAS
ALTER TABLE public.astronomia_condiciones
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP POLICY IF EXISTS "Admin gestiona condiciones astronómicas" ON public.astronomia_condiciones;
CREATE POLICY "Admin gestiona condiciones astronómicas"
  ON public.astronomia_condiciones FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin gestiona horarios astronómicos" ON public.astronomia_horarios;
CREATE POLICY "Admin gestiona horarios astronómicos"
  ON public.astronomia_horarios FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin gestiona recursos astronómicos" ON public.astronomia_recursos;
CREATE POLICY "Admin gestiona recursos astronómicos"
  ON public.astronomia_recursos FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. AMPLIAR CATEGORÍAS PERMITIDAS EN EXPERIENCIAS
ALTER TABLE public.experiencias
  DROP CONSTRAINT IF EXISTS experiencias_categoria_check;

ALTER TABLE public.experiencias
  ADD CONSTRAINT experiencias_categoria_check
  CHECK (categoria IN ('Tours', 'Gastronomía', 'Aventura', 'Astroturismo', 'Cultura'));

-- 5. LECTURA PÚBLICA DE INSIGNIAS DE USUARIOS PARA RANKING REAL
DROP POLICY IF EXISTS "Lectura pública de insignias de usuarios" ON public.usuario_insignias;
CREATE POLICY "Lectura pública de insignias de usuarios"
  ON public.usuario_insignias FOR SELECT
  USING (true);
