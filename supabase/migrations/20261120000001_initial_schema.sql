-- =============================================================================
-- THAKIGO — Turismo Andacollo y Región de Coquimbo
-- Migración Inicial Completa: Esquema de 17 Tablas, Triggers y Políticas RLS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (Perfiles de usuario vinculados a auth.users y tabla de posiciones)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT 'Viajero',
  apellido text NOT NULL DEFAULT '',
  avatar_url text,
  rol text NOT NULL DEFAULT 'viajero' CHECK (rol IN ('viajero', 'admin')),
  nivel integer NOT NULL DEFAULT 1,
  xp integer NOT NULL DEFAULT 0,
  lugares_visitados integer NOT NULL DEFAULT 0,
  rutas_completadas integer NOT NULL DEFAULT 0,
  resenas_count integer NOT NULL DEFAULT 0,
  titulo_nivel text NOT NULL DEFAULT 'Viajero Explorador',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger para crear perfil automáticamente cuando un usuario se registra en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, rol, nivel, xp)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Viajero'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'viajero'),
    1,
    100
  )
  ON CONFLICT (id) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. CATEGORIAS (Pilares patrimoniales y categorías de exploración)
CREATE TABLE IF NOT EXISTS public.categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug IN ('religion', 'astronomia', 'mineria', 'naturaleza', 'cultura', 'gastronomia', 'trekking')),
  nombre text NOT NULL,
  icono text DEFAULT '📍',
  color text DEFAULT '#071B3A',
  color_fondo text DEFAULT '#F5F7FA',
  orden integer NOT NULL DEFAULT 1,
  mostrar_inicio boolean NOT NULL DEFAULT false,
  mostrar_planificador boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. LUGARES (Sitios turísticos y patrimoniales)
CREATE TABLE IF NOT EXISTS public.lugares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid REFERENCES public.categorias(id) ON DELETE SET NULL,
  nombre text NOT NULL,
  descripcion text,
  imagen_url text,
  direccion text,
  horario text,
  rating_promedio numeric(3,1) DEFAULT 4.5,
  distancia_km numeric(5,1) DEFAULT 1.5,
  latitud numeric(10,6),
  longitud numeric(10,6),
  mapa_x numeric(5,2) DEFAULT 50,
  mapa_y numeric(5,2) DEFAULT 50,
  color_pin text DEFAULT 'var(--color-gold)',
  badge_texto text,
  mejor_epoca text DEFAULT 'Octubre a Abril',
  es_astronomico boolean NOT NULL DEFAULT false,
  comuna text NOT NULL DEFAULT 'Andacollo',
  region text NOT NULL DEFAULT 'Coquimbo',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. RESTAURANTES (Gastronomía local y picadas)
CREATE TABLE IF NOT EXISTS public.restaurantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  imagen_url text,
  direccion text,
  horario text,
  precio_rango text DEFAULT '$$' CHECK (precio_rango IN ('$', '$$', '$$$')),
  rating_promedio numeric(3,1) DEFAULT 4.5,
  distancia_km numeric(5,1) DEFAULT 1.2,
  latitud numeric(10,6),
  longitud numeric(10,6),
  mapa_x numeric(5,2) DEFAULT 45,
  mapa_y numeric(5,2) DEFAULT 60,
  color_pin text DEFAULT '#e67e22',
  consejo_viajero text DEFAULT 'Reserva con anticipación durante la Fiesta de Andacollo en diciembre.',
  comuna text NOT NULL DEFAULT 'Andacollo',
  region text NOT NULL DEFAULT 'Coquimbo',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. ALOJAMIENTOS (Hostales, hosterías y cabañas)
CREATE TABLE IF NOT EXISTS public.alojamientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  imagen_url text,
  direccion text,
  precio_por_noche numeric(12,0),
  rating_promedio numeric(3,1) DEFAULT 4.6,
  distancia_km numeric(5,1) DEFAULT 1.0,
  latitud numeric(10,6),
  longitud numeric(10,6),
  mapa_x numeric(5,2) DEFAULT 62,
  mapa_y numeric(5,2) DEFAULT 55,
  color_pin text DEFAULT '#27ae60',
  mejor_temporada text DEFAULT 'La época de mayor afluencia es durante la Fiesta de Andacollo en diciembre. Reserva con anticipación.',
  comuna text NOT NULL DEFAULT 'Andacollo',
  region text NOT NULL DEFAULT 'Coquimbo',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. EVENTOS (Festividades religiosas, culturales y astronómicas)
CREATE TABLE IF NOT EXISTS public.eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  imagen_url text,
  fecha_inicio date,
  fecha_fin date,
  categoria text,
  ubicacion text DEFAULT 'Andacollo, Región de Coquimbo, Chile',
  es_astronomico boolean NOT NULL DEFAULT false,
  comuna text NOT NULL DEFAULT 'Andacollo',
  region text NOT NULL DEFAULT 'Coquimbo',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. EXPERIENCIAS (Tours y actividades reservables)
CREATE TABLE IF NOT EXISTS public.experiencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  imagen_url text,
  categoria text NOT NULL DEFAULT 'Tours' CHECK (categoria IN ('Tours', 'Gastronomía', 'Aventura')),
  precio numeric(12,0),
  duracion text,
  incluye text[] DEFAULT ARRAY['Guía experto incluido', 'Equipamiento necesario', 'Seguro de actividad'],
  rating_promedio numeric(3,1) DEFAULT 4.8,
  disponible boolean NOT NULL DEFAULT true,
  comuna text NOT NULL DEFAULT 'Andacollo',
  region text NOT NULL DEFAULT 'Coquimbo',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. FAVORITOS (Elementos guardados por el viajero)
CREATE TABLE IF NOT EXISTS public.favoritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('lugar', 'restaurante', 'alojamiento', 'evento', 'experiencia')),
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tipo, item_id)
);

-- 9. ASTRONOMIA_CONDICIONES (Estado actual del cielo nocturno)
CREATE TABLE IF NOT EXISTS public.astronomia_condiciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  etiqueta text NOT NULL,
  valor text NOT NULL,
  icono text NOT NULL,
  orden integer NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true
);

-- 10. ASTRONOMIA_HORARIOS (Mejores horarios de observación)
CREATE TABLE IF NOT EXISTS public.astronomia_horarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hora text NOT NULL,
  etiqueta text NOT NULL,
  icono text NOT NULL,
  calidad text NOT NULL DEFAULT 'good' CHECK (calidad IN ('good', 'best')),
  orden integer NOT NULL DEFAULT 1
);

-- 11. ASTRONOMIA_RECURSOS (Consejos y equipamiento recomendado)
CREATE TABLE IF NOT EXISTS public.astronomia_recursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('consejo', 'equipo')),
  icono text,
  titulo text,
  contenido text NOT NULL,
  orden integer NOT NULL DEFAULT 1
);

-- 12. DESTACADOS_DIA (Banners contextuales en Inicio y Recomendaciones)
CREATE TABLE IF NOT EXISTS public.destacados_dia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL DEFAULT 'weather' CHECK (tipo IN ('weather', 'event', 'promo')),
  icono text NOT NULL DEFAULT '🌙',
  titulo text NOT NULL,
  descripcion text NOT NULL,
  cta_texto text NOT NULL,
  cta_ruta text NOT NULL,
  variante text NOT NULL DEFAULT 'dark' CHECK (variante IN ('dark', 'gold')),
  mostrar_home boolean NOT NULL DEFAULT false,
  mostrar_recomendaciones boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true
);

-- 13. INSIGNIAS (Catálogo de logros desbloqueables en Gamificación)
CREATE TABLE IF NOT EXISTS public.insignias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NOT NULL,
  icono text NOT NULL,
  xp_requerido integer NOT NULL DEFAULT 100,
  desbloqueada_por_defecto boolean NOT NULL DEFAULT false,
  orden integer NOT NULL DEFAULT 1
);

-- 14. USUARIO_INSIGNIAS (Insignias ganadas por cada usuario)
CREATE TABLE IF NOT EXISTS public.usuario_insignias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  insignia_id uuid NOT NULL REFERENCES public.insignias(id) ON DELETE CASCADE,
  obtenido_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, insignia_id)
);

-- 15. DESAFIOS (Retos activos de Gamificación)
CREATE TABLE IF NOT EXISTS public.desafios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text NOT NULL,
  xp_recompensa integer NOT NULL DEFAULT 100,
  progreso_base integer NOT NULL DEFAULT 0,
  completado_base boolean NOT NULL DEFAULT false,
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 1
);

-- 16. USUARIO_DESAFIOS (Progreso individual en desafíos)
CREATE TABLE IF NOT EXISTS public.usuario_desafios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  desafio_id uuid NOT NULL REFERENCES public.desafios(id) ON DELETE CASCADE,
  progreso_pct integer NOT NULL DEFAULT 0 CHECK (progreso_pct >= 0 AND progreso_pct <= 100),
  completado boolean NOT NULL DEFAULT false,
  UNIQUE(user_id, desafio_id)
);

-- 17. RUTAS_PARADAS (Paradas de itinerario del Planificador de Viajes)
CREATE TABLE IF NOT EXISTS public.rutas_paradas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid REFERENCES public.categorias(id) ON DELETE SET NULL,
  lugar_id uuid REFERENCES public.lugares(id) ON DELETE SET NULL,
  hora text NOT NULL,
  titulo text NOT NULL,
  tipo_etiqueta text NOT NULL,
  duracion_estimada text NOT NULL,
  icono text NOT NULL DEFAULT '📍',
  duracion_viaje text NOT NULL DEFAULT '1 día' CHECK (duracion_viaje IN ('Medio día', '1 día', '2 – 3 días', '+3 días')),
  presupuesto text NOT NULL DEFAULT 'Moderado' CHECK (presupuesto IN ('Económico', 'Moderado', 'Premium')),
  orden integer NOT NULL DEFAULT 1
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lugares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alojamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astronomia_condiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astronomia_horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astronomia_recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destacados_dia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insignias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_insignias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desafios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_desafios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutas_paradas ENABLE ROW LEVEL SECURITY;

-- Función auxiliar para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND rol = 'admin'
  );
$$;

-- Políticas de lectura pública (Catálogos, Astronomía, Gamificación, Planificador y Leaderboard)
CREATE POLICY "Lectura pública de perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Lectura pública de categorías" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de lugares" ON public.lugares FOR SELECT USING (true);
CREATE POLICY "Lectura pública de restaurantes" ON public.restaurantes FOR SELECT USING (true);
CREATE POLICY "Lectura pública de alojamientos" ON public.alojamientos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de eventos" ON public.eventos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de experiencias" ON public.experiencias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de condiciones astronómicas" ON public.astronomia_condiciones FOR SELECT USING (true);
CREATE POLICY "Lectura pública de horarios astronómicos" ON public.astronomia_horarios FOR SELECT USING (true);
CREATE POLICY "Lectura pública de recursos astronómicos" ON public.astronomia_recursos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de destacados del día" ON public.destacados_dia FOR SELECT USING (true);
CREATE POLICY "Lectura pública de insignias" ON public.insignias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de desafíos" ON public.desafios FOR SELECT USING (true);
CREATE POLICY "Lectura pública de paradas de ruta" ON public.rutas_paradas FOR SELECT USING (true);

-- Políticas para el usuario autenticado (Perfil propio, Favoritos y Progreso)
CREATE POLICY "Usuarios actualizan su propio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios leen sus favoritos" ON public.favoritos
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Usuarios crean sus favoritos" ON public.favoritos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios eliminan sus favoritos" ON public.favoritos
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios gestionan sus insignias" ON public.usuario_insignias
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios gestionan sus desafíos" ON public.usuario_desafios
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas de Administración (CRUD en catálogos para rol admin)
CREATE POLICY "Admin gestiona lugares" ON public.lugares FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin gestiona restaurantes" ON public.restaurantes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin gestiona alojamientos" ON public.alojamientos FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin gestiona eventos" ON public.eventos FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin gestiona experiencias" ON public.experiencias FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin gestiona categorías" ON public.categorias FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin gestiona destacados" ON public.destacados_dia FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
