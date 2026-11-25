# Phase 1 Data Model: Astroturismo Comunitario, Reservas Adaptativas, Guías Certificados y Perfil Mejorado

**Feature**: `006-astrotourism-bookings-guides`
**Migration target**: `supabase/migrations/20261124000002_astrotourism_bookings_guides.sql`
**Seed updates**: `supabase/seed.sql` (y datos semilla idempotentes en migración para entornos ya inicializados)

## 1. Extensiones a Tablas Existentes

### `public.profiles` (ALTER TABLE)
Campos adicionales para soportar perfiles públicos de astrofotógrafos, Gear Bag e insignias de observación manteniendo intactos todos los campos actuales:

| Column | Type | Default / Constraints | Description |
|--------|------|-----------------------|-------------|
| `handle` | `text` | `UNIQUE` (nullable) | Identificador público amigable (ej. `leokaant_astrophoto`) |
| `rol_fotografico` | `text` | `NULL` | Especialidad o rol visible (ej. `Astrofotógrafo Local · Andacollo`) |
| `certificacion` | `text` | `NULL` | Sello o insignia principal (ej. `Embajador Cielos Andacollo`) |
| `gear_bag` | `jsonb` | `'[]'::jsonb` | Arreglo de `{ id, name, detail }` con equipo óptico/fotográfico |
| `astro_badges` | `jsonb` | `'[]'::jsonb` | Arreglo de `{ icon, title, desc }` con insignias de observación |

### `public.categorias` (UPDATE)
- Mantener `fotografia` (`Fotografía` / `Galería Astrofotos`) y actualizar `otros` → `slug = 'guias'`, `nombre = 'Guías Turísticos'`, `icono = 'compass'` (actualizando el `CHECK` de `slug` para incluir `'guias'`).

## 2. Nuevas Tablas — Galería Comunitaria de Astrofotografía

### `public.astro_photos`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador único |
| `author_id` | `uuid` | FK → `public.profiles(id)` ON DELETE CASCADE, NOT NULL | Autor de la captura |
| `titulo` | `text` | NOT NULL | Título de la astrofotografía |
| `spot` | `text` | NOT NULL | Sector de observación (ej. `Cerro Yahuín`, `Observatorio Collowara`, `Mirador La Caldera`, `Ruta Minera`) |
| `descripcion` | `text` | NOT NULL | Historia y detalles de la toma |
| `imagen_url` | `text` | NOT NULL | URL de imagen, DataURL o clave de escena (`preset:milkyway`, `preset:carina`, `preset:startrails`, `preset:moon_mining`) |
| `exif_camera` | `text` | NOT NULL DEFAULT `'Cámara / Smartphone'` | Equipo utilizado |
| `exif_iso` | `text` | NOT NULL DEFAULT `'ISO 1600'` | Sensibilidad ISO |
| `exif_shutter` | `text` | NOT NULL DEFAULT `'30 seg'` | Tiempo de exposición |
| `exif_aperture` | `text` | NOT NULL DEFAULT `'f/2.8'` | Apertura |
| `likes_count` | `integer` | NOT NULL DEFAULT `0` CHECK (`>= 0`) | Contador sincronizado de "Me gusta" |
| `activo` | `boolean` | NOT NULL DEFAULT `true` | Moderación administrativa |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Fecha de publicación |

### `public.astro_photo_likes`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador único |
| `photo_id` | `uuid` | FK → `public.astro_photos(id)` ON DELETE CASCADE, NOT NULL | Foto valorada |
| `user_id` | `uuid` | FK → `auth.users(id)` ON DELETE CASCADE, NOT NULL | Usuario que dio "Me gusta" |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Fecha |
| — | `UNIQUE(photo_id, user_id)` | — | Un "Me gusta" por usuario y foto |

**Trigger**: `trg_sync_astro_photo_likes` recalcula automáticamente `astro_photos.likes_count` tras INSERT/DELETE (sumando el conteo base de semilla si aplica o recalculando desde likes reales + `base_likes` semilla). Para simplicidad y exactitud: agregar columna `base_likes integer NOT NULL DEFAULT 0` en `astro_photos` para preservar los conteos iniciales del mockup (47, 83, 64, 39) y que el trigger mantenga `likes_count = base_likes + count(astro_photo_likes)`.

### `public.user_follows`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador único |
| `follower_id` | `uuid` | FK → `auth.users(id)` ON DELETE CASCADE, NOT NULL | Quien sigue |
| `following_profile_id` | `uuid` | FK → `public.profiles(id)` ON DELETE CASCADE, NOT NULL | Perfil seguido |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Fecha |
| — | `UNIQUE(follower_id, following_profile_id)` | — | Sin seguimientos duplicados |

## 3. Nuevas Tablas — Sistema Polimórfico y Adaptativo de Reservas

### `public.booking_configs`
Configuración 1:1 por entidad del catálogo:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador de configuración |
| `entity_type` | `text` | NOT NULL CHECK (`IN ('lugar','restaurante','alojamiento','evento','experiencia')`) | Tipo de entidad del catálogo |
| `entity_id` | `uuid` | NOT NULL | ID del registro en su tabla correspondiente |
| `activo` | `boolean` | NOT NULL DEFAULT `false` | Activa/desactiva el módulo de reservas en la ficha pública |
| `booking_profile` | `text` | NOT NULL DEFAULT `'tour_horario'` CHECK (`IN ('tour_horario','mesa_comida','estadia_noches','servicio_general')`) | Perfil adaptativo del formulario |
| `pricing_mode` | `text` | NOT NULL DEFAULT `'calculado'` CHECK (`IN ('calculado','sin_costo')`) | Tarifa calculada en CLP o sin costo / consumo en local |
| `confirmation_mode` | `text` | NOT NULL DEFAULT `'inmediata'` CHECK (`IN ('inmediata','pendiente')`) | Confirmación automática o pendiente de aprobación |
| `titulo_modulo` | `text` | NOT NULL DEFAULT `'Reserva tu experiencia'` | Título del bloque en la ficha pública |
| `subtitulo_modulo` | `text` | DEFAULT `''` | Bajada explicativa |
| `codigo_prefijo` | `text` | NOT NULL DEFAULT `'THK'` | Prefijo para códigos de pase (ej. `COL` para Collowara) |
| `badge_ubicacion` | `text` | DEFAULT `''` | Ej. `Cerro Churqui · 1.300 m s.n.m.` |
| `badge_extra` | `text` | DEFAULT `''` | Ej. `+300 noches despejadas / año` |
| `nota_logistica_titulo` | `text` | DEFAULT `''` | Ej. `Traslado desde Plaza Andacollo` |
| `nota_logistica_detalle` | `text` | DEFAULT `''` | Ej. `Salida 30 min antes de cada turno · 12 min de viaje` |
| `estado_operacion` | `text` | DEFAULT `'Disponible Hoy'` | Etiqueta de estado (ej. `Abierto Hoy`) |
| `descuento_residente_activo` | `boolean` | NOT NULL DEFAULT `false` | Habilita casilla de descuento local |
| `descuento_residente_pct` | `integer` | NOT NULL DEFAULT `20` CHECK (`BETWEEN 0 AND 100`) | Porcentaje de descuento local |
| `highlights` | `jsonb` | NOT NULL DEFAULT `'[]'::jsonb` | Arreglo de `{ title, subtitle, accent }` (ej. Cúpula 14", 3 Terrazas, Anfiteatro, Planetario) |
| `galeria` | `jsonb` | NOT NULL DEFAULT `'[]'::jsonb` | Arreglo de `{ img, title, subtitle }` para galería ampliable |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Última actualización |
| — | `UNIQUE(entity_type, entity_id)` | — | Una configuración por entidad |

### `public.booking_packages`
Modalidades, servicios, mesas o habitaciones por configuración:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador |
| `config_id` | `uuid` | FK → `public.booking_configs(id)` ON DELETE CASCADE, NOT NULL | Configuración padre |
| `nombre` | `text` | NOT NULL | Nombre del tour/servicio/habitación/mesa |
| `descripcion` | `text` | DEFAULT `''` | Descripción breve |
| `pricing_unit` | `text` | NOT NULL DEFAULT `'por_persona'` CHECK (`IN ('por_persona','tarifa_fija','por_noche')`) | Forma de cálculo |
| `precio_adulto` | `integer` | NOT NULL DEFAULT `0` CHECK (`>= 0`) | Precio base / adulto / por noche / tarifa fija en CLP |
| `precio_nino` | `integer` | NOT NULL DEFAULT `0` CHECK (`>= 0`) | Precio niño / adulto mayor en CLP (cuando aplica) |
| `capacidad_maxima` | `integer` | NOT NULL DEFAULT `10` CHECK (`>= 1`) | Máximo de personas por reserva (ej. 4 para VIP) |
| `orden` | `integer` | NOT NULL DEFAULT `1` | Orden de visualización |
| `activo` | `boolean` | NOT NULL DEFAULT `true` | Estado activo |

### `public.booking_slots`
Bloques horarios disponibles por configuración:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador |
| `config_id` | `uuid` | FK → `public.booking_configs(id)` ON DELETE CASCADE, NOT NULL | Configuración padre |
| `hora_inicio` | `text` | NOT NULL | Hora formateada `HH:MM` (ej. `20:30`, `22:00`, `23:30`) |
| `capacidad_base` | `integer` | NOT NULL DEFAULT `12` CHECK (`>= 1`) | Cupos base por fecha |
| `orden` | `integer` | NOT NULL DEFAULT `1` | Orden de visualización |
| `activo` | `boolean` | NOT NULL DEFAULT `true` | Estado activo |
| — | `UNIQUE(config_id, hora_inicio)` | — | Sin horarios duplicados por entidad |

### `public.bookings`
Reservas / Pases emitidos:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador |
| `config_id` | `uuid` | FK → `public.booking_configs(id)` ON DELETE CASCADE, NOT NULL | Configuración de origen |
| `entity_type` | `text` | NOT NULL | Tipo de entidad (denormalizado para consultas rápidas) |
| `entity_id` | `uuid` | NOT NULL | ID de entidad |
| `entity_name` | `text` | NOT NULL | Nombre legible de la entidad al momento de reservar |
| `user_id` | `uuid` | FK → `auth.users(id)` ON DELETE CASCADE, NOT NULL | Usuario que reservó |
| `package_id` | `uuid` | FK → `public.booking_packages(id)` ON DELETE SET NULL | Modalidad elegida (opcional en perfiles simples) |
| `package_name` | `text` | NOT NULL DEFAULT `'Reserva General'` | Nombre guardado del servicio |
| `slot_id` | `uuid` | FK → `public.booking_slots(id)` ON DELETE SET NULL | Bloque horario (cuando aplica) |
| `booking_profile` | `text` | NOT NULL | Perfil aplicado al crear la reserva |
| `codigo` | `text` | NOT NULL UNIQUE | Código único de pase (ej. `COL-2026-4819`) |
| `fecha_inicio` | `date` | NOT NULL | Fecha de visita / check-in / comida |
| `fecha_fin` | `date` | NULL | Fecha check-out (solo `estadia_noches`) |
| `hora_inicio` | `text` | NULL | Hora seleccionada |
| `adultos` | `integer` | NOT NULL DEFAULT `1` CHECK (`>= 1`) | Adultos / comensales / huéspedes |
| `ninos` | `integer` | NOT NULL DEFAULT `0` CHECK (`>= 0`) | Niños / adultos mayores |
| `cupos_reservados` | `integer` | NOT NULL DEFAULT `1` CHECK (`>= 1`) | Cupos descontados del bloque horario |
| `es_residente` | `boolean` | NOT NULL DEFAULT `false` | Descuento local aplicado |
| `titular_nombre` | `text` | NOT NULL | Nombre completo del titular |
| `titular_telefono` | `text` | NOT NULL | Teléfono / WhatsApp de contacto |
| `notas` | `text` | DEFAULT `''` | Preferencias, alergias o comentarios |
| `total_clp` | `integer` | NOT NULL DEFAULT `0` CHECK (`>= 0`) | Total calculado en CLP (`0` si `sin_costo`) |
| `estado` | `text` | NOT NULL DEFAULT `'confirmada'` CHECK (`IN ('pendiente','confirmada','cancelada')`) | Estado actual del pase |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Fecha de creación |

**Transiciones de estado**:
- Creación: `confirmada` (si `confirmation_mode = 'inmediata'`) o `pendiente` (si `confirmation_mode = 'pendiente'`).
- Aprobación (solo admin): `pendiente` → `confirmada`.
- Cancelación (titular o admin): `pendiente` | `confirmada` → `cancelada` (libera `cupos_reservados` en el cálculo de disponibilidad).

## 4. Nuevas Tablas — Guías Turísticos Certificados

### `public.tour_guides`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador |
| `user_id` | `uuid` | FK → `auth.users(id)` ON DELETE SET NULL | Usuario que postuló (nullable para semillas) |
| `nombre` | `text` | NOT NULL | Nombre completo |
| `especialidad` | `text` | NOT NULL | Ej. `Astroturismo & Cielo Profundo`, `Astrofotografía Guiada`, `Patrimonio & Ruta Minera`, `Trekking Nocturno` |
| `certificacion` | `text` | NOT NULL | Ej. `SERNATUR Sello R & Sello Q · Starlight` |
| `experiencia` | `text` | NOT NULL DEFAULT `'Guía Local Andacollo'` | Años/nivel de experiencia |
| `idiomas` | `text[]` | NOT NULL DEFAULT `ARRAY['Español']` | Idiomas hablados |
| `sectores` | `text[]` | NOT NULL DEFAULT `ARRAY['Andacollo']` | Sectores donde opera |
| `tarifa_referencial` | `text` | NOT NULL | Texto de tarifa (ej. `$18.000 CLP / persona`) |
| `rating` | `numeric(3,1)` | NOT NULL DEFAULT `5.0` | Calificación |
| `resenas_count` | `integer` | NOT NULL DEFAULT `0` | Cantidad de reseñas |
| `equipamiento` | `text` | NOT NULL DEFAULT `''` | Equipamiento incluido |
| `biografia` | `text` | NOT NULL | Descripción de experiencia |
| `itinerario` | `jsonb` | NOT NULL DEFAULT `'[]'::jsonb` | Arreglo de pasos del itinerario tipo |
| `telefono` | `text` | DEFAULT `''` | Contacto opcional |
| `verificado` | `boolean` | NOT NULL DEFAULT `true` | Sello de verificación ThakiGo |
| `activo` | `boolean` | NOT NULL DEFAULT `true` | Visible en el directorio público |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Fecha de registro |

### `public.guide_booking_requests`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, `DEFAULT gen_random_uuid()` | Identificador |
| `guide_id` | `uuid` | FK → `public.tour_guides(id)` ON DELETE CASCADE, NOT NULL | Guía solicitado |
| `user_id` | `uuid` | FK → `auth.users(id)` ON DELETE CASCADE, NOT NULL | Usuario solicitante |
| `fecha` | `date` | NOT NULL | Fecha solicitada |
| `personas` | `integer` | NOT NULL DEFAULT `2` CHECK (`BETWEEN 1 AND 20`) | Cantidad de personas |
| `telefono` | `text` | NOT NULL | WhatsApp / teléfono de contacto |
| `notas` | `text` | DEFAULT `''` | Comentarios adicionales |
| `estado` | `text` | NOT NULL DEFAULT `'pendiente'` CHECK (`IN ('pendiente','confirmada','cancelada')`) | Estado |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Fecha de solicitud |

## 5. Políticas de Seguridad (RLS)

- **Lectura pública (`SELECT USING (true)`)**: `astro_photos` (activas o admin), `astro_photo_likes`, `user_follows`, `booking_configs` (activas o admin), `booking_packages` (activas o admin), `booking_slots` (activas o admin), `tour_guides` (activos o admin).
- **Lectura/Escritura de usuario autenticado**:
  - `astro_photos`: insertar si `auth.uid() = author_id`; actualizar/eliminar si `auth.uid() = author_id OR public.is_admin()`.
  - `astro_photo_likes` & `user_follows`: insertar/eliminar solo sus propios registros (`auth.uid() = user_id` / `follower_id`).
  - `bookings`: leer sus propias reservas (`auth.uid() = user_id OR public.is_admin()`); crear mediante RPC `create_entity_booking` o INSERT validado (`auth.uid() = user_id`); cancelar propias (`auth.uid() = user_id`) o administrar todas si `public.is_admin()`.
  - `tour_guides`: postular (INSERT) autenticado (`auth.uid() = user_id`); gestionar (UPDATE/DELETE) si `public.is_admin()`.
  - `guide_booking_requests`: leer/crear propias (`auth.uid() = user_id OR public.is_admin()`); actualizar estado si `auth.uid() = user_id OR public.is_admin()`.
- **Escritura administrativa (`public.is_admin()`)**: `booking_configs`, `booking_packages`, `booking_slots`, gestión global de `bookings`, `tour_guides` y moderación de `astro_photos`.
