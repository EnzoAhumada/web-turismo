-- =============================================================================
-- THAKIGO — Turismo Andacollo y Región de Coquimbo
-- Migración 002: Rediseño Visual Profesional, Campos de Detalle y Analítica Municipal
-- =============================================================================

-- 1. Ampliar categorías permitidas para cubrir las 10 categorías de Explorer
ALTER TABLE public.categorias
  DROP CONSTRAINT IF EXISTS categorias_slug_check;

ALTER TABLE public.categorias
  ADD CONSTRAINT categorias_slug_check
  CHECK (slug IN (
    'cultura', 'gastronomia', 'astronomia', 'naturaleza',
    'religion', 'mineria', 'trekking', 'fotografia', 'eventos', 'otros'
  ));

-- 2. Ampliar lugares con campos de Perfil de Lugar y Filtros Populares
ALTER TABLE public.lugares
  ADD COLUMN IF NOT EXISTS subtitulo text DEFAULT 'Patrimonio de Andacollo',
  ADD COLUMN IF NOT EXISTS resenas_count integer DEFAULT 48,
  ADD COLUMN IF NOT EXISTS tiempo_estimado text DEFAULT '1 – 2 horas',
  ADD COLUMN IF NOT EXISTS telefono text DEFAULT '+56 51 243 1200',
  ADD COLUMN IF NOT EXISTS es_gratis boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS es_familiar boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS abierto_ahora boolean NOT NULL DEFAULT true;

-- 3. Ampliar restaurantes
ALTER TABLE public.restaurantes
  ADD COLUMN IF NOT EXISTS especialidad text DEFAULT 'Cocina tradicional de Andacollo',
  ADD COLUMN IF NOT EXISTS resenas_count integer DEFAULT 36,
  ADD COLUMN IF NOT EXISTS telefono text DEFAULT '+56 51 243 1500',
  ADD COLUMN IF NOT EXISTS abierto_ahora boolean NOT NULL DEFAULT true;

-- 4. Ampliar alojamientos
ALTER TABLE public.alojamientos
  ADD COLUMN IF NOT EXISTS tipo text DEFAULT 'Hostal',
  ADD COLUMN IF NOT EXISTS servicios text[] DEFAULT ARRAY['Wi-Fi', 'Estacionamiento', 'Desayuno local'],
  ADD COLUMN IF NOT EXISTS resenas_count integer DEFAULT 42,
  ADD COLUMN IF NOT EXISTS telefono text DEFAULT '+56 51 243 1800';

-- 5. Ampliar experiencias
ALTER TABLE public.experiencias
  ADD COLUMN IF NOT EXISTS resenas_count integer DEFAULT 28,
  ADD COLUMN IF NOT EXISTS icono text DEFAULT 'compass';

-- 6. Tabla de estadísticas municipales para el Dashboard Municipal (Lámina 13)
CREATE TABLE IF NOT EXISTS public.estadisticas_municipales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitantes_hoy integer NOT NULL DEFAULT 1248,
  variacion_visitantes_pct integer NOT NULL DEFAULT 18,
  tiempo_promedio_visita text NOT NULL DEFAULT '2h 15m',
  variacion_tiempo_pct integer NOT NULL DEFAULT 12,
  calificacion_global numeric(3,1) NOT NULL DEFAULT 4.8,
  flujo_horario jsonb NOT NULL DEFAULT '[]'::jsonb,
  procedencia jsonb NOT NULL DEFAULT '[]'::jsonb,
  intereses jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.estadisticas_municipales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de estadísticas municipales" ON public.estadisticas_municipales;
CREATE POLICY "Lectura pública de estadísticas municipales"
  ON public.estadisticas_municipales FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gestiona estadísticas municipales" ON public.estadisticas_municipales;
CREATE POLICY "Admin gestiona estadísticas municipales"
  ON public.estadisticas_municipales FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
