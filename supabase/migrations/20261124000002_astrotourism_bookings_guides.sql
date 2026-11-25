-- =============================================================================
-- THAKIGO — Migración 006: Astroturismo Comunitario, Reservas Adaptativas,
-- Guías Turísticos Certificados y Mejoras de Perfil
-- =============================================================================

-- 1. EXTENSIÓN DE PROFILES (Perfiles públicos de astrofotógrafos y Gear Bag)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS handle text UNIQUE,
  ADD COLUMN IF NOT EXISTS rol_fotografico text,
  ADD COLUMN IF NOT EXISTS certificacion text,
  ADD COLUMN IF NOT EXISTS gear_bag jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS astro_badges jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. ACTUALIZAR CATEGORÍA "OTROS" → "GUÍAS TURÍSTICOS" ('guias')
ALTER TABLE public.categorias DROP CONSTRAINT IF EXISTS categorias_slug_check;
ALTER TABLE public.categorias
  ADD CONSTRAINT categorias_slug_check
  CHECK (slug IN (
    'cultura', 'gastronomia', 'astronomia', 'naturaleza',
    'religion', 'mineria', 'trekking', 'fotografia', 'eventos', 'guias', 'otros'
  ));

UPDATE public.categorias
SET slug = 'guias',
    nombre = 'Guías Turísticos',
    icono = 'compass'
WHERE slug = 'otros';

-- 3. GALERÍA DE ASTROFOTOGRAFÍAS
CREATE TABLE IF NOT EXISTS public.astro_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  spot text NOT NULL,
  descripcion text NOT NULL,
  imagen_url text NOT NULL,
  exif_camera text NOT NULL DEFAULT 'Cámara / Smartphone',
  exif_iso text NOT NULL DEFAULT 'ISO 1600',
  exif_shutter text NOT NULL DEFAULT '30 seg',
  exif_aperture text NOT NULL DEFAULT 'f/2.8',
  base_likes integer NOT NULL DEFAULT 0 CHECK (base_likes >= 0),
  likes_count integer NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_astro_photos_spot ON public.astro_photos (spot);
CREATE INDEX IF NOT EXISTS idx_astro_photos_author ON public.astro_photos (author_id);

CREATE TABLE IF NOT EXISTS public.astro_photo_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid NOT NULL REFERENCES public.astro_photos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (photo_id, user_id)
);

CREATE OR REPLACE FUNCTION public.sync_astro_photo_likes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_photo_id uuid;
  v_real_likes integer;
BEGIN
  v_photo_id := COALESCE(NEW.photo_id, OLD.photo_id);
  SELECT COUNT(*)::integer INTO v_real_likes
  FROM public.astro_photo_likes
  WHERE photo_id = v_photo_id;

  UPDATE public.astro_photos
  SET likes_count = base_likes + COALESCE(v_real_likes, 0)
  WHERE id = v_photo_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_astro_photo_likes ON public.astro_photo_likes;
CREATE TRIGGER trg_sync_astro_photo_likes
  AFTER INSERT OR DELETE ON public.astro_photo_likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_astro_photo_likes();

CREATE TABLE IF NOT EXISTS public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_profile_id)
);

-- 4. SISTEMA POLIMÓRFICO Y ADAPTATIVO DE RESERVAS
CREATE TABLE IF NOT EXISTS public.booking_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('lugar', 'restaurante', 'alojamiento', 'evento', 'experiencia')),
  entity_id uuid NOT NULL,
  activo boolean NOT NULL DEFAULT false,
  booking_profile text NOT NULL DEFAULT 'tour_horario'
    CHECK (booking_profile IN ('tour_horario', 'mesa_comida', 'estadia_noches', 'servicio_general')),
  pricing_mode text NOT NULL DEFAULT 'calculado'
    CHECK (pricing_mode IN ('calculado', 'sin_costo')),
  confirmation_mode text NOT NULL DEFAULT 'inmediata'
    CHECK (confirmation_mode IN ('inmediata', 'pendiente')),
  titulo_modulo text NOT NULL DEFAULT 'Reserva tu experiencia',
  subtitulo_modulo text NOT NULL DEFAULT '',
  codigo_prefijo text NOT NULL DEFAULT 'THK',
  badge_ubicacion text NOT NULL DEFAULT '',
  badge_extra text NOT NULL DEFAULT '',
  nota_logistica_titulo text NOT NULL DEFAULT '',
  nota_logistica_detalle text NOT NULL DEFAULT '',
  estado_operacion text NOT NULL DEFAULT 'Disponible Hoy',
  descuento_residente_activo boolean NOT NULL DEFAULT false,
  descuento_residente_pct integer NOT NULL DEFAULT 20 CHECK (descuento_residente_pct BETWEEN 0 AND 100),
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  galeria jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS public.booking_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid NOT NULL REFERENCES public.booking_configs(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text NOT NULL DEFAULT '',
  pricing_unit text NOT NULL DEFAULT 'por_persona'
    CHECK (pricing_unit IN ('por_persona', 'tarifa_fija', 'por_noche')),
  precio_adulto integer NOT NULL DEFAULT 0 CHECK (precio_adulto >= 0),
  precio_nino integer NOT NULL DEFAULT 0 CHECK (precio_nino >= 0),
  capacidad_maxima integer NOT NULL DEFAULT 10 CHECK (capacidad_maxima >= 1),
  orden integer NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_booking_packages_config ON public.booking_packages (config_id);

CREATE TABLE IF NOT EXISTS public.booking_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid NOT NULL REFERENCES public.booking_configs(id) ON DELETE CASCADE,
  hora_inicio text NOT NULL,
  capacidad_base integer NOT NULL DEFAULT 12 CHECK (capacidad_base >= 1),
  orden integer NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true,
  UNIQUE (config_id, hora_inicio)
);

CREATE INDEX IF NOT EXISTS idx_booking_slots_config ON public.booking_slots (config_id);

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid NOT NULL REFERENCES public.booking_configs(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('lugar', 'restaurante', 'alojamiento', 'evento', 'experiencia')),
  entity_id uuid NOT NULL,
  entity_name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES public.booking_packages(id) ON DELETE SET NULL,
  package_name text NOT NULL DEFAULT 'Reserva General',
  slot_id uuid REFERENCES public.booking_slots(id) ON DELETE SET NULL,
  booking_profile text NOT NULL,
  codigo text NOT NULL UNIQUE,
  fecha_inicio date NOT NULL,
  fecha_fin date,
  hora_inicio text,
  adultos integer NOT NULL DEFAULT 1 CHECK (adultos >= 1),
  ninos integer NOT NULL DEFAULT 0 CHECK (ninos >= 0),
  cupos_reservados integer NOT NULL DEFAULT 1 CHECK (cupos_reservados >= 1),
  es_residente boolean NOT NULL DEFAULT false,
  titular_nombre text NOT NULL,
  titular_telefono text NOT NULL,
  notas text NOT NULL DEFAULT '',
  total_clp integer NOT NULL DEFAULT 0 CHECK (total_clp >= 0),
  estado text NOT NULL DEFAULT 'confirmada' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_config_date ON public.bookings (config_id, fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings (user_id, created_at DESC);

-- Función pública para consultar cupos ocupados por bloque horario sin exponer datos personales
CREATE OR REPLACE FUNCTION public.get_slot_occupancy(p_config_id uuid, p_fecha date)
RETURNS TABLE (slot_id uuid, ocupados integer)
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT b.slot_id, COALESCE(SUM(b.cupos_reservados), 0)::integer AS ocupados
  FROM public.bookings b
  WHERE b.config_id = p_config_id
    AND b.fecha_inicio = p_fecha
    AND b.estado IN ('pendiente', 'confirmada')
    AND b.slot_id IS NOT NULL
  GROUP BY b.slot_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_slot_occupancy(uuid, date) TO anon, authenticated;

-- 5. GUÍAS TURÍSTICOS CERTIFICADOS Y SOLICITUDES DE RESERVA
CREATE TABLE IF NOT EXISTS public.tour_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre text NOT NULL,
  especialidad text NOT NULL,
  certificacion text NOT NULL,
  experiencia text NOT NULL DEFAULT 'Nuevo en ThakiGo',
  idiomas text[] NOT NULL DEFAULT ARRAY['Español'],
  sectores text[] NOT NULL DEFAULT ARRAY['Andacollo'],
  tarifa_referencial text NOT NULL DEFAULT '$18.000 CLP / persona',
  rating numeric(3,1) NOT NULL DEFAULT 5.0,
  resenas_count integer NOT NULL DEFAULT 1,
  equipamiento text NOT NULL DEFAULT 'Equipamiento local verificado por ThakiGo.',
  biografia text NOT NULL,
  itinerario jsonb NOT NULL DEFAULT '[]'::jsonb,
  telefono text NOT NULL DEFAULT '',
  verificado boolean NOT NULL DEFAULT true,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.guide_booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.tour_guides(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha date NOT NULL,
  personas integer NOT NULL DEFAULT 2 CHECK (personas BETWEEN 1 AND 20),
  telefono text NOT NULL,
  notas text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guide_requests_user ON public.guide_booking_requests (user_id, created_at DESC);

-- 6. POLÍTICAS RLS
ALTER TABLE public.astro_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astro_photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_booking_requests ENABLE ROW LEVEL SECURITY;

-- Astro photos
DROP POLICY IF EXISTS "Lectura pública de astrofotos" ON public.astro_photos;
CREATE POLICY "Lectura pública de astrofotos" ON public.astro_photos
  FOR SELECT USING (activo = true OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios publican astrofotos" ON public.astro_photos;
CREATE POLICY "Usuarios publican astrofotos" ON public.astro_photos
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Autor o admin editan astrofotos" ON public.astro_photos;
CREATE POLICY "Autor o admin editan astrofotos" ON public.astro_photos
  FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());

DROP POLICY IF EXISTS "Autor o admin eliminan astrofotos" ON public.astro_photos;
CREATE POLICY "Autor o admin eliminan astrofotos" ON public.astro_photos
  FOR DELETE USING (auth.uid() = author_id OR public.is_admin());

-- Astro photo likes
DROP POLICY IF EXISTS "Lectura pública de likes astrofotos" ON public.astro_photo_likes;
CREATE POLICY "Lectura pública de likes astrofotos" ON public.astro_photo_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios dan like astrofotos" ON public.astro_photo_likes;
CREATE POLICY "Usuarios dan like astrofotos" ON public.astro_photo_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios quitan like astrofotos" ON public.astro_photo_likes;
CREATE POLICY "Usuarios quitan like astrofotos" ON public.astro_photo_likes
  FOR DELETE USING (auth.uid() = user_id);

-- User follows
DROP POLICY IF EXISTS "Lectura pública de seguimientos" ON public.user_follows;
CREATE POLICY "Lectura pública de seguimientos" ON public.user_follows
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios siguen perfiles" ON public.user_follows;
CREATE POLICY "Usuarios siguen perfiles" ON public.user_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Usuarios dejan de seguir perfiles" ON public.user_follows;
CREATE POLICY "Usuarios dejan de seguir perfiles" ON public.user_follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Booking configs / packages / slots
DROP POLICY IF EXISTS "Lectura pública de booking_configs" ON public.booking_configs;
CREATE POLICY "Lectura pública de booking_configs" ON public.booking_configs
  FOR SELECT USING (activo = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin gestiona booking_configs" ON public.booking_configs;
CREATE POLICY "Admin gestiona booking_configs" ON public.booking_configs
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Lectura pública de booking_packages" ON public.booking_packages;
CREATE POLICY "Lectura pública de booking_packages" ON public.booking_packages
  FOR SELECT USING (activo = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin gestiona booking_packages" ON public.booking_packages;
CREATE POLICY "Admin gestiona booking_packages" ON public.booking_packages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Lectura pública de booking_slots" ON public.booking_slots;
CREATE POLICY "Lectura pública de booking_slots" ON public.booking_slots
  FOR SELECT USING (activo = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin gestiona booking_slots" ON public.booking_slots;
CREATE POLICY "Admin gestiona booking_slots" ON public.booking_slots
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Bookings
DROP POLICY IF EXISTS "Usuarios ven sus reservas y admin ve todas" ON public.bookings;
CREATE POLICY "Usuarios ven sus reservas y admin ve todas" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios crean sus reservas" ON public.bookings;
CREATE POLICY "Usuarios crean sus reservas" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Titular cancela o admin gestiona reservas" ON public.bookings;
CREATE POLICY "Titular cancela o admin gestiona reservas" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admin elimina reservas" ON public.bookings;
CREATE POLICY "Admin elimina reservas" ON public.bookings
  FOR DELETE USING (public.is_admin());

-- Tour guides
DROP POLICY IF EXISTS "Lectura pública de guías" ON public.tour_guides;
CREATE POLICY "Lectura pública de guías" ON public.tour_guides
  FOR SELECT USING (activo = true OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios postulan como guías" ON public.tour_guides;
CREATE POLICY "Usuarios postulan como guías" ON public.tour_guides
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND (user_id IS NULL OR auth.uid() = user_id));

DROP POLICY IF EXISTS "Admin gestiona guías" ON public.tour_guides;
CREATE POLICY "Admin gestiona guías" ON public.tour_guides
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin elimina guías" ON public.tour_guides;
CREATE POLICY "Admin elimina guías" ON public.tour_guides
  FOR DELETE USING (public.is_admin());

-- Guide booking requests
DROP POLICY IF EXISTS "Usuarios ven sus solicitudes de guía" ON public.guide_booking_requests;
CREATE POLICY "Usuarios ven sus solicitudes de guía" ON public.guide_booking_requests
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Usuarios crean solicitudes de guía" ON public.guide_booking_requests;
CREATE POLICY "Usuarios crean solicitudes de guía" ON public.guide_booking_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios o admin actualizan solicitudes de guía" ON public.guide_booking_requests;
CREATE POLICY "Usuarios o admin actualizan solicitudes de guía" ON public.guide_booking_requests
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- 7. SEMILLAS IDEMPOTENTES DEL MOCKUP FUNCIONAL

-- 7.1 Astrofotógrafos comunitarios en public.profiles
INSERT INTO public.profiles (
  id, nombre, apellido, rol, nivel, xp, lugares_visitados, rutas_completadas,
  titulo_nivel, biografia, ciudad_origen, handle, rol_fotografico, certificacion, gear_bag, astro_badges
) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Ferrari', '(Leokaant)', 'viajero', 9, 4450, 28, 9,
    'Embajador Astronómico',
    'Capturando los cielos limpios de Andacollo y la Región de Coquimbo. Apasionado por la Vía Láctea, la divulgación local y la tecnología aplicada al turismo.',
    'Andacollo',
    'leokaant_astrophoto',
    'Astrofotógrafo Local · Andacollo',
    'Embajador Cielos Andacollo',
    '[
      {"id":"g1","name":"Sony DSC-H300","detail":"Superzoom 35x · Capturas de horizonte y luna"},
      {"id":"g2","name":"Honor Magic 8 Lite (Modo Pro RAW)","detail":"Apilado nocturno & astrofotografía móvil"},
      {"id":"g3","name":"Trípode Aluminio Reforzado","detail":"Estabilidad para larga exposición en altura"},
      {"id":"g4","name":"PhotoPills & Sequator","detail":"Planificación lunar y reducción de ruido térmico"}
    ]'::jsonb,
    '[
      {"icon":"sparkles","title":"Cazador Galáctico","desc":"Capturó el núcleo de la Vía Láctea en Cerro Yahuín"},
      {"icon":"mountain","title":"Embajador Andacollo","desc":"3+ sectores locales documentados"},
      {"icon":"telescope","title":"Aliado Collowara","desc":"Colaborador de talleres astroturísticos"}
    ]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Matías', 'Valdivia', 'viajero', 10, 4980, 32, 11,
    'Maestro Nebular',
    'Especialista en nebulosas del hemisferio sur y seguimiento ecuatorial desde las cumbres de Andacollo.',
    'Coquimbo',
    'matias_astro',
    'Astrofotógrafo de Cielo Profundo · Coquimbo',
    'Certificación Starlight',
    '[
      {"id":"m1","name":"Canon EOS R50 Astro-Mod","detail":"Sensor APS-C sin filtro IR"},
      {"id":"m2","name":"Montura Sky-Watcher Star Adventurer","detail":"Seguimiento sideral de precisión"},
      {"id":"m3","name":"Teleobjetivo 135mm f/2","detail":"Nebulosas de emisión y cúmulos"}
    ]'::jsonb,
    '[
      {"icon":"sparkles","title":"Maestro Nebular","desc":"15+ objetos Messier y NGC capturados"},
      {"icon":"award","title":"Guía Starlight","desc":"Divulgador científico acreditado"}
    ]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Valentina', 'Araya', 'viajero', 8, 3920, 24, 8,
    'Cronista Nocturna',
    'Combinando patrimonio minero, relieve cordillerano y trazas circumpolares bajo el cielo estrellado del norte chico.',
    'La Serena / Andacollo',
    'valentina_sky',
    'Fotógrafa de Paisaje Nocturno · La Serena / Andacollo',
    'SERNATUR Sello R',
    '[
      {"id":"v1","name":"Sony a7 III Full Frame","detail":"Alto rendimiento en ISO 3200+"},
      {"id":"v2","name":"Gran Angular 14mm f/1.8","detail":"Arcos completos de la Vía Láctea"}
    ]'::jsonb,
    '[
      {"icon":"camera","title":"Reina del Timelapse","desc":"Secuencias circumpolares en Mirador La Caldera"}
    ]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  handle = EXCLUDED.handle,
  rol_fotografico = EXCLUDED.rol_fotografico,
  certificacion = EXCLUDED.certificacion,
  gear_bag = EXCLUDED.gear_bag,
  astro_badges = EXCLUDED.astro_badges;

-- 7.2 Astrofotografías iniciales del mockup
INSERT INTO public.astro_photos (
  id, author_id, titulo, spot, descripcion, imagen_url,
  exif_camera, exif_iso, exif_shutter, exif_aperture, base_likes, likes_count, created_at
) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Núcleo de la Vía Láctea sobre Cerro Yahuín',
    'Cerro Yahuín',
    'Toma realizada a las 23:45 hrs con cielo completamente despejado y baja humedad. Se aprecia con claridad la región de Sagitario y el polvo interestelar sobre la silueta del Cerro Yahuín.',
    'preset:milkyway',
    'Sony DSC-H300', 'ISO 1600', '30 seg', 'f/5.6', 47, 47, now() - interval '2 hours'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    'Nebulosa de Carina (NGC 3372) desde Cúpula Sur',
    'Observatorio Collowara',
    'Integración de 24 tomas guiadas desde las terrazas del Observatorio Collowara. Destacan las nubes de hidrógeno ionizado y la estrella Eta Carinae en el centro.',
    'preset:carina',
    'Canon EOS R50', 'ISO 1600', '120 seg x 24', 'f/2.8', 83, 83, now() - interval '1 day'
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000003',
    'Trazas Circumpolares en Mirador La Caldera',
    'Mirador La Caldera',
    'Apilado de 90 fotografías de 25 segundos apuntando hacia el Polo Sur Celeste desde Mirador La Caldera, mostrando el movimiento aparente de la bóveda celeste.',
    'preset:startrails',
    'Sony a7 III', 'ISO 800', '38 min apilado', 'f/2.8', 64, 64, now() - interval '3 days'
  ),
  (
    'c1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000001',
    'Luna Menguante sobre los Cerros de la Ruta Minera',
    'Ruta Minera',
    'Captura en formato RAW aprovechando el resplandor dorado de la Luna antes del amanecer sobre los cordones montañosos históricos de Andacollo.',
    'preset:moon_mining',
    'Honor Magic 8 Lite RAW', 'ISO 400', '1/15 seg', 'f/1.8', 39, 39, now() - interval '5 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 7.3 Configuración inicial de Reservas para Observatorio Turístico Collowara
INSERT INTO public.booking_configs (
  id, entity_type, entity_id, activo, booking_profile, pricing_mode, confirmation_mode,
  titulo_modulo, subtitulo_modulo, codigo_prefijo, badge_ubicacion, badge_extra,
  nota_logistica_titulo, nota_logistica_detalle, estado_operacion,
  descuento_residente_activo, descuento_residente_pct, highlights, galeria
) VALUES (
  'd1000000-0000-0000-0000-000000000001',
  'lugar',
  '20000000-0000-0000-0000-000000000002',
  true,
  'tour_horario',
  'calculado',
  'inmediata',
  'Reserva de Tours Astronómicos',
  'Selecciona modalidad, fecha y bloque horario. Descuento especial de 20% para residentes de Andacollo.',
  'COL',
  'Cerro Churqui · 1.300 m s.n.m.',
  '+300 noches despejadas / año',
  'Traslado desde Plaza Andacollo',
  'Salida 30 min antes de cada turno · 12 min de viaje',
  'Abierto Hoy',
  true,
  20,
  '[
    {"title":"Cúpula 14\"","subtitle":"Schmidt-Cassegrain motorizado","accent":"gold"},
    {"title":"3 Terrazas","subtitle":"Telescopios Dobson & tracking","accent":"sky"},
    {"title":"Anfiteatro","subtitle":"Diseño Chacana al aire libre","accent":"emerald"},
    {"title":"Planetario","subtitle":"Sala audiovisual inmersiva","accent":"orange"}
  ]'::jsonb,
  '[
    {"img":"preset:collowara_dome","title":"Cúpula Principal 14\"","subtitle":"Observación planetaria y espacio profundo"},
    {"img":"preset:collowara_terrace","title":"Terrazas de Observación","subtitle":"3 estaciones ópticas al aire libre"},
    {"img":"preset:chacana","title":"Anfiteatro Cruz del Sur","subtitle":"Arquitectura ceremonial Chacana"},
    {"img":"preset:carina","title":"Cielo Profundo Sur","subtitle":"Nebulosa de Carina capturada in situ"}
  ]'::jsonb
)
ON CONFLICT (entity_type, entity_id) DO NOTHING;

INSERT INTO public.booking_packages (
  id, config_id, nombre, descripcion, pricing_unit, precio_adulto, precio_nino, capacidad_maxima, orden, activo
) VALUES
  (
    'd2000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000001',
    'Tour Astronómico Clásico',
    'Sala audiovisual + Cúpula 14" + Terrazas',
    'por_persona', 12000, 6000, 10, 1, true
  ),
  (
    'd2000000-0000-0000-0000-000000000002',
    'd1000000-0000-0000-0000-000000000001',
    'Experiencia Astrofotografía',
    'Acceso extendido terraza + soporte montura',
    'por_persona', 22000, 12000, 10, 2, true
  ),
  (
    'd2000000-0000-0000-0000-000000000003',
    'd1000000-0000-0000-0000-000000000001',
    'Tour Privado VIP (Hasta 4 p.)',
    'Guía exclusivo y selección libre de objetos',
    'tarifa_fija', 65000, 0, 4, 3, true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.booking_slots (
  id, config_id, hora_inicio, capacidad_base, orden, activo
) VALUES
  ('d3000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', '20:30', 12, 1, true),
  ('d3000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', '22:00', 10, 2, true),
  ('d3000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', '23:30', 14, 3, true)
ON CONFLICT (config_id, hora_inicio) DO NOTHING;

-- 7.4 Guías Turísticos Certificados del mockup
INSERT INTO public.tour_guides (
  id, nombre, especialidad, certificacion, experiencia, idiomas, sectores,
  tarifa_referencial, rating, resenas_count, equipamiento, biografia, itinerario, verificado, activo
) VALUES
  (
    'e1000000-0000-0000-0000-000000000001',
    'Carlos Alcayaga Munizaga',
    'Astroturismo & Cielo Profundo',
    'SERNATUR Sello R & Sello Q · Starlight',
    '11 años de experiencia',
    ARRAY['Español', 'Inglés'],
    ARRAY['Observatorio Collowara', 'Cerro Yahuín'],
    '$18.000 CLP / persona',
    4.9, 142,
    'Telescopio Dobson 10", puntero láser astronómico verde 532nm y binoculares 15x70.',
    'Divulgador astronómico andacollino especializado en cosmovisión diaguita y observación de cúmulos globulares, nebulosas y planetas.',
    '[
      "20:30 · Encuentro en Plaza de Andacollo y traslado a punto oscuro",
      "21:00 · Charla de orientación celeste a ojo desnudo y Cruz del Sur",
      "21:45 · Observación guiada por telescopio de espacio profundo",
      "23:00 · Sesión de preguntas, infusión caliente local y retorno"
    ]'::jsonb,
    true, true
  ),
  (
    'e1000000-0000-0000-0000-000000000002',
    'Valentina Araya Pizarro',
    'Astrofotografía Guiada',
    'SERNATUR Sello R · Fotógrafa Profesional',
    '7 años de experiencia',
    ARRAY['Español', 'Inglés', 'Portugués'],
    ARRAY['Mirador La Caldera', 'Cerro Yahuín'],
    '$25.000 CLP / persona',
    5.0, 98,
    'Trípodes profesionales disponibles para préstamo, intervalómetros y paneles LED cálidos.',
    'Acompañamiento práctico en terreno para configurar tu cámara DSLR, mirrorless o smartphone en modo RAW y lograr tu primera foto de la Vía Láctea.',
    '[
      "21:30 · Planificación de encuadre con PhotoPills en Mirador La Caldera",
      "22:00 · Ajuste de enfoque a infinito, regla de los 500 e ISO óptimo",
      "22:45 · Toma de exposición larga y primer plano iluminado",
      "23:45 · Revisión de histograma y flujo básico de revelado"
    ]'::jsonb,
    true, true
  ),
  (
    'e1000000-0000-0000-0000-000000000003',
    'Hernán Cortés Rivera',
    'Patrimonio & Ruta Minera',
    'SERNATUR Sello Q · Guía Cultural Local',
    '15 años de experiencia',
    ARRAY['Español'],
    ARRAY['Ruta Minera', 'Basílica & Casco Histórico'],
    '$15.000 CLP / persona',
    4.8, 116,
    'Radios comunicadores, linternas frontales de luz roja y material cartográfico histórico.',
    'Recorrido por la historia aurífera y cuprífera de Andacollo, sus miradores tradicionales y la transición hacia el turismo sustentable de intereses especiales.',
    '[
      "18:30 · Inicio en Basílica Menor e historia minera de Andacollo",
      "19:30 · Ascenso a miradores panorámicos al atardecer",
      "20:30 · Degustación de productos locales y observación inicial de estrellas"
    ]'::jsonb,
    true, true
  ),
  (
    'e1000000-0000-0000-0000-000000000004',
    'Fernanda Tapia Zepeda',
    'Trekking Nocturno',
    'SERNATUR Sello R · Primeros Auxilios WFR',
    '6 años de experiencia',
    ARRAY['Español', 'Inglés'],
    ARRAY['Cerro Yahuín', 'Sendero El Toro'],
    '$20.000 CLP / persona',
    4.9, 74,
    'Bastones de trekking, linternas frontales rojas, botiquín de montaña y comunicación satelital.',
    'Caminatas nocturnas de baja a media dificultad por senderos naturales de Andacollo para disfrutar el silencio del desierto florido y la bóveda estrellada.',
    '[
      "20:00 · Briefing de seguridad y entrega de linternas frontales rojas",
      "20:30 · Ascenso guiado por sendero interpretativo de flora xerófita",
      "22:00 · Detención en cumbre para observación astronómica y descanso"
    ]'::jsonb,
    true, true
  )
ON CONFLICT (id) DO NOTHING;
