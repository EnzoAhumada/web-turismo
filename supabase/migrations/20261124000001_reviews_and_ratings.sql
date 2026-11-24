-- =============================================================================
-- THAKIGO — Turismo Andacollo y Región de Coquimbo
-- Migración: Sistema de Comentarios y Valoraciones (Lugares, Restaurantes y Alojamientos)
-- =============================================================================

-- 1. Tabla unificada de reseñas
CREATE TABLE IF NOT EXISTS public.resenas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('lugar', 'restaurante', 'alojamiento')),
  item_id uuid NOT NULL,
  calificacion smallint NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario text NOT NULL CHECK (char_length(btrim(comentario)) BETWEEN 5 AND 600),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tipo, item_id)
);

-- 2. Índices para consultas rápidas por entidad y por autor
CREATE INDEX IF NOT EXISTS idx_resenas_item_created
  ON public.resenas (tipo, item_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resenas_user_id
  ON public.resenas (user_id);

-- 3. Trigger para mantener updated_at actualizado al editar
CREATE OR REPLACE FUNCTION public.set_resenas_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_resenas_updated_at ON public.resenas;
CREATE TRIGGER trg_resenas_updated_at
  BEFORE UPDATE ON public.resenas
  FOR EACH ROW EXECUTE FUNCTION public.set_resenas_updated_at();

-- 4. Funciones auxiliares y trigger para sincronizar rating_promedio y resenas_count
CREATE OR REPLACE FUNCTION public.recalculate_entity_reviews(p_tipo text, p_item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_avg numeric(3,1);
BEGIN
  SELECT
    COUNT(*)::integer,
    COALESCE(ROUND(AVG(calificacion)::numeric, 1), 0.0)
  INTO v_count, v_avg
  FROM public.resenas
  WHERE tipo = p_tipo AND item_id = p_item_id;

  IF p_tipo = 'lugar' THEN
    UPDATE public.lugares
      SET rating_promedio = v_avg,
          resenas_count = v_count
      WHERE id = p_item_id;
  ELSIF p_tipo = 'restaurante' THEN
    UPDATE public.restaurantes
      SET rating_promedio = v_avg,
          resenas_count = v_count
      WHERE id = p_item_id;
  ELSIF p_tipo = 'alojamiento' THEN
    UPDATE public.alojamientos
      SET rating_promedio = v_avg,
          resenas_count = v_count
      WHERE id = p_item_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_profile_reviews(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)::integer
  INTO v_count
  FROM public.resenas
  WHERE user_id = p_user_id;

  UPDATE public.profiles
    SET resenas_count = v_count
    WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_resenas_metrics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.recalculate_entity_reviews(NEW.tipo, NEW.item_id);
    PERFORM public.recalculate_profile_reviews(NEW.user_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.recalculate_entity_reviews(NEW.tipo, NEW.item_id);
    IF OLD.tipo IS DISTINCT FROM NEW.tipo OR OLD.item_id IS DISTINCT FROM NEW.item_id THEN
      PERFORM public.recalculate_entity_reviews(OLD.tipo, OLD.item_id);
    END IF;
    PERFORM public.recalculate_profile_reviews(NEW.user_id);
    IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
      PERFORM public.recalculate_profile_reviews(OLD.user_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_entity_reviews(OLD.tipo, OLD.item_id);
    PERFORM public.recalculate_profile_reviews(OLD.user_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_resenas_metrics ON public.resenas;
CREATE TRIGGER trg_sync_resenas_metrics
  AFTER INSERT OR UPDATE OR DELETE ON public.resenas
  FOR EACH ROW EXECUTE FUNCTION public.sync_resenas_metrics();

-- 5. Seguridad RLS en public.resenas
ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de reseñas" ON public.resenas;
CREATE POLICY "Lectura pública de reseñas"
  ON public.resenas
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Usuarios crean su propia reseña" ON public.resenas;
CREATE POLICY "Usuarios crean su propia reseña"
  ON public.resenas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios editan su propia reseña" ON public.resenas;
CREATE POLICY "Usuarios editan su propia reseña"
  ON public.resenas
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios eliminan su propia reseña" ON public.resenas;
CREATE POLICY "Usuarios eliminan su propia reseña"
  ON public.resenas
  FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- 6. Política defensiva en profiles para asegurar que usuarios autenticados puedan crear su perfil si faltara
DROP POLICY IF EXISTS "Usuarios crean su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios crean su propio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
