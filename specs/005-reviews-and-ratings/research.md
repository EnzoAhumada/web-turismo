# Research: Comentarios y Valoraciones para Lugares, Restaurantes y Alojamientos

**Feature**: `005-reviews-and-ratings`  
**Date**: 2026-11-24

## 1. Modelo de tabla para reseñas multientidad en PostgreSQL / Supabase

- **Decision**: Crear una tabla unificada `public.resenas` con clave polimórfica controlada `(tipo, item_id)` donde `tipo IN ('lugar', 'restaurante', 'alojamiento')`, restricción `UNIQUE (user_id, tipo, item_id)` y referencia relacional `user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`.
- **Rationale**:
  - Sigue exactamente la convención ya establecida en el proyecto por `public.favoritos` (`user_id`, `tipo`, `item_id`, `UNIQUE(user_id, tipo, item_id)`), manteniendo el código y las consultas simples y homogéneas.
  - Evita triplicar tablas, servicios, políticas RLS y triggers (`resenas_lugares`, `resenas_restaurantes`, `resenas_alojamientos`), alineándose con el principio VI de la Constitución (simplicidad y mantenibilidad).
  - Referenciar `public.profiles(id)` en lugar de `auth.users(id)` permite que tanto los usuarios reales autenticados mediante Supabase Auth (cuyo perfil se crea automáticamente vía `handle_new_user`) como los 5 perfiles comunitarios ya sembrados en `supabase/seed.sql` (`Carlos Muñoz`, `María Torres`, `Ana Valdés`, `Pedro Silva`, `Lucía Pérez`) puedan ser autores de reseñas reales consultables con un solo `SELECT ... profiles(...)`.
- **Alternatives considered**:
  - *Tres tablas separadas (una por entidad)*: Mayor integridad referencial por FK directa, pero triplica políticas RLS, triggers, endpoints y lógica de servicio sin necesidad práctica en esta escala.
  - *Columnas anulables `lugar_id`, `restaurante_id`, `alojamiento_id` en una sola tabla*: Complica restricciones `UNIQUE` con valores `NULL` en PostgreSQL y exige múltiples índices parciales y lógica condicional en el cliente.

## 2. Sincronización de `rating_promedio` y `resenas_count`

- **Decision**: Implementar una función de trigger `public.sync_resenas_metrics()` ejecutada `AFTER INSERT OR UPDATE OR DELETE ON public.resenas` con `SECURITY DEFINER SET search_path = public` que recalcula `rating_promedio` (`ROUND(AVG(calificacion)::numeric, 1)`, o `0.0` cuando no hay reseñas) y `resenas_count` (`COUNT(*)`) en la tabla correspondiente (`lugares`, `restaurantes` o `alojamientos`), y actualiza también `public.profiles.resenas_count` del autor.
- **Rationale**:
  - Garantiza consistencia atómica en base de datos sin depender de que el cliente tenga permisos de `UPDATE` sobre `lugares`, `restaurantes` o `alojamientos` (cuyas políticas RLS solo permiten edición a `is_admin()`).
  - Asegura que las tarjetas de los listados públicos (`HomePage`, `ExplorerPage`, `RestaurantsPage`, `AccommodationsPage`, `PlaceDetailPage`, etc.) y las fichas de detalle muestren siempre los mismos valores tras cualquier creación, edición o eliminación.
  - Al ejecutarse también durante la carga de `supabase/seed.sql`, los promedios y conteos de los 12 lugares, 6 restaurantes y 6 alojamientos quedan exactamente sincronizados con las reseñas de ejemplo insertadas.
- **Alternatives considered**:
  - *Calcular promedios en cada consulta desde el frontend*: Requeriría descargar todas las reseñas en cada listado de catálogo o crear vistas adicionales rompiendo los servicios actuales que leen `rating_promedio` y `resenas_count` directamente de cada tabla.
  - *Actualizar desde el cliente tras insertar la reseña*: Inseguro y bloqueado por las políticas RLS actuales de solo-admin en catálogos.

## 3. Seguridad y Row Level Security (RLS)

- **Decision**: Habilitar RLS en `public.resenas` con políticas explícitas:
  - `SELECT`: lectura pública (`USING (true)`).
  - `INSERT`: solo usuario autenticado para sí mismo (`WITH CHECK (auth.uid() = user_id)`).
  - `UPDATE`: solo el autor sobre sus propias reseñas (`USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`).
  - `DELETE`: autor sobre sus propias reseñas o administrador (`USING (auth.uid() = user_id OR public.is_admin())`).
  - Además, incorporar una política `INSERT` defensiva en `public.profiles` (`WITH CHECK (auth.uid() = id)`) si no existiera, y asegurar que el trigger `handle_new_user()` cubra usuarios registrados previamente.
- **Rationale**: Cumple con FR-006, FR-007 y FR-008 a nivel de base de datos, impidiendo suplantación o modificación de reseñas ajenas incluso si alguien llama directamente a la API de Supabase.
- **Alternatives considered**:
  - *Validar propiedad únicamente en React*: Insuficiente frente a llamadas directas al cliente de Supabase.

## 4. Integración en la arquitectura React existente y reutilización de UI

- **Decision**:
  - Crear un servicio dedicado `src/services/reviews.service.js` y un hook `src/hooks/useReviews.js`.
  - Crear un componente autocontenido y reutilizable `src/components/ui/ReviewsSection/` (con su CSS nativo en `rem` base `10px`) que encapsule:
    1. Resumen de valoración (promedio, estrellas, total de reseñas y distribución por estrellas).
    2. Formulario interactivo para crear o editar la reseña propia (selector táctil y accesible de 1 a 5 estrellas, textarea con contador de caracteres `5–600`, prevención explícita de `event.preventDefault()`).
    3. Banner visual (`FeedbackBanner`) para validaciones, confirmaciones y errores.
    4. Modal de confirmación visual (`ConfirmModal`) para eliminar la propia reseña (cero `alert`/`confirm`/`prompt`).
    5. Invitación con enlace directo a `/login` y `/registro` (preservando retorno) para visitantes no autenticados.
    6. Listado de reseñas ordenadas de más reciente a más antigua con avatar/iniciales, nombre completo, estrellas, fecha en español y etiqueta "Tu reseña" cuando corresponda.
  - Integrar `ReviewsSection` en `DetailLayout` mediante una prop opcional `reviewsSection` usada por `PlaceDetailPage`, `RestaurantDetailPage` y `AccommodationDetailPage`, y exponer `updateRatingSummary` desde `useEntityDetail` para sincronizar el encabezado de calificación al instante.
- **Rationale**: Evita duplicar código en tres páginas de detalle, respeta el patrón arquitectónico existente (`services/` + `hooks/` + `components/ui/` + `DetailLayout`) y mantiene cero dependencias externas.
- **Alternatives considered**:
  - *Montar la lógica de reseñas independientemente dentro de cada página de detalle*: Duplicaría estado, formularios, modales y estilos en tres archivos.

## 5. Datos semilla idempotentes de comentarios de ejemplo

- **Decision**: Incorporar en `supabase/seed.sql` (con `ON CONFLICT (id) DO UPDATE`) al menos 2 a 3 reseñas realistas por cada uno de los 12 lugares turísticos, 6 restaurantes y 6 alojamientos (mínimo 48 reseñas reales sobre Andacollo) distribuidas entre los 5 perfiles comunitarios existentes y con fechas escalonadas recientes.
- **Rationale**: Cumple con SC-001 (100% de lugares, restaurantes y alojamientos del catálogo base con al menos 2 comentarios y valoraciones de ejemplo) y garantiza recargas idempotentes mediante `npm run db:reset` sin duplicar registros.
- **Alternatives considered**:
  - *Solo 5–10 comentarios en algunos lugares destacados*: No cumpliría con la expectativa de que al explorar lugares, restaurantes y alojamientos todos muestren ejemplos reales.
