# Data Model: Datos Reales, Google Maps, Reseñas y Usuarios Semilla

**Feature**: `003-real-data-maps-reviews`  
**Date**: 2026-11-20

## 1. Nueva Tabla: `public.resenas`

Almacena las reseñas, calificaciones y comentarios de usuarios sobre cualquier entidad del catálogo turístico.

| Columna | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Identificador único de la reseña |
| `user_id` | `uuid` | `NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE` | Autor de la reseña |
| `tipo` | `text` | `NOT NULL CHECK (tipo IN ('lugar', 'restaurante', 'alojamiento', 'evento', 'experiencia'))` | Tipo de entidad evaluada |
| `item_id` | `uuid` | `NOT NULL` | ID de la entidad evaluada |
| `calificacion` | `integer` | `NOT NULL CHECK (calificacion BETWEEN 1 AND 5)` | Puntuación en estrellas (1 a 5) |
| `comentario` | `text` | `NOT NULL CHECK (char_length(trim(comentario)) >= 5)` | Texto de la reseña en español |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de publicación |
| `updated_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de última edición |

### Índices y Seguridad (RLS)
- Índice compuesto `(tipo, item_id, created_at DESC)` para carga rápida de reseñas en fichas de detalle.
- Índice `(user_id)` para consultar reseñas de un usuario.
- **RLS**:
  - `SELECT`: público (`USING (true)`).
  - `INSERT`: usuario autenticado (`WITH CHECK (auth.uid() = user_id)`).
  - `UPDATE` / `DELETE`: autor propio o administrador (`USING (auth.uid() = user_id OR public.is_admin())`).

### Trigger de Sincronización (`sync_resenas_stats`)
- Al insertar, actualizar o eliminar una reseña:
  - Recalcula `rating_promedio` (redondeado a 1 decimal) y `resenas_count` en la tabla correspondiente (`lugares`, `restaurantes`, `alojamientos`, `experiencias`; y en `eventos` si aplica).
  - Actualiza `resenas_count` en `public.profiles` del autor.

## 2. Ampliación de Tablas del Catálogo (Migración 003)

Para mostrar información completa y ordenada (no resumida) en las fichas de detalle:

### `public.lugares`, `public.restaurantes`, `public.alojamientos`, `public.eventos`, `public.experiencias`
- `destacados` (`text[] DEFAULT ARRAY[]::text[]`): Lista de puntos clave, atractivos o características principales (qué ver / qué ofrece).
- `recomendaciones` (`text[] DEFAULT ARRAY[]::text[]`): Consejos prácticos para el visitante (vestimenta, reservas, mejor hora, accesibilidad).
- `servicios_info` (`text[] DEFAULT ARRAY[]::text[]`): Etiquetas informativas adicionales (ej. estacionamiento, entrada liberada, acceso universal, guía local).
- En `public.eventos`: añadir `latitud numeric(10,6)`, `longitud numeric(10,6)`, `rating_promedio numeric(3,1) DEFAULT 4.8`, `resenas_count integer DEFAULT 0` para soportar Google Maps y reseñas de forma uniforme.
- En `public.experiencias`: añadir `direccion text DEFAULT 'Andacollo, Región de Coquimbo'`, `latitud numeric(10,6)`, `longitud numeric(10,6)` para soportar Google Maps en experiencias.

## 3. Usuarios Semilla (5 cuentas en `auth.users` + `public.profiles`)

| # | Rol | Correo | Nombre | Nivel / XP | Actividad Semilla Repartida |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `admin` | `admin@thakigo.cl` | Camila Rojas (Admin Municipal) | Nivel 8 / 2400 XP | Gestión total en Dashboard Municipal, 3 favoritos, 5 insignias, 2 reseñas oficiales/informativas |
| 2 | `viajero` | `mateo.valdivia@thakigo.cl` | Mateo Valdivia | Nivel 5 / 1250 XP | Enfoque astroturismo: 4 favoritos, 4 insignias, 3 desafíos, 4 reseñas |
| 3 | `viajero` | `sofia.araya@thakigo.cl` | Sofía Araya | Nivel 4 / 890 XP | Enfoque religioso/cultural: 4 favoritos, 3 insignias, 2 desafíos, 3 reseñas |
| 4 | `viajero` | `lucas.mendez@thakigo.cl` | Lucas Méndez | Nivel 3 / 540 XP | Enfoque minería/trekking: 3 favoritos, 2 insignias, 2 desafíos, 3 reseñas |
| 5 | `viajero` | `valentina.tapia@thakigo.cl` | Valentina Tapia | Nivel 2 / 280 XP | Enfoque gastronomía/hospedaje: 3 favoritos, 1 insignia, 1 desafío, 2 reseñas |
