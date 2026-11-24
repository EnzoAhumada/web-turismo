# Data Model: Comentarios y Valoraciones

**Feature**: `005-reviews-and-ratings`  
**Date**: 2026-11-24

## 1. Nueva Tabla: `public.resenas`

Almacena cada comentario y valoración emitida por un usuario sobre un lugar turístico, restaurante o alojamiento.

| Columna | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Identificador único de la reseña. |
| `user_id` | `uuid` | `NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE` | Autor de la reseña (usuario autenticado o perfil comunitario semilla). |
| `tipo` | `text` | `NOT NULL CHECK (tipo IN ('lugar', 'restaurante', 'alojamiento'))` | Categoría de entidad evaluada. |
| `item_id` | `uuid` | `NOT NULL` | Identificador del lugar, restaurante o alojamiento evaluado. |
| `calificacion` | `smallint` | `NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5)` | Puntuación entera en estrellas (1 a 5). |
| `comentario` | `text` | `NOT NULL CHECK (char_length(btrim(comentario)) BETWEEN 5 AND 600)` | Texto de la reseña validado en longitud útil. |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha y hora de publicación. |
| `updated_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha y hora de última edición. |

### Restricciones e Índices

- `UNIQUE (user_id, tipo, item_id)`: Impide reseñas duplicadas de un mismo usuario sobre el mismo lugar, restaurante o alojamiento.
- `idx_resenas_item_created` en `(tipo, item_id, created_at DESC)`: Acelera la consulta ordenada de reseñas en cada ficha de detalle.
- `idx_resenas_user_id` en `(user_id)`: Acelera la actualización de conteos de reseñas por usuario y consultas del perfil.

## 2. Tablas Existentes Actualizadas Automáticamente

No requieren nuevas columnas estructurales porque ya poseen `rating_promedio` y `resenas_count`:

- `public.lugares` (`rating_promedio numeric(3,1)`, `resenas_count integer`)
- `public.restaurantes` (`rating_promedio numeric(3,1)`, `resenas_count integer`)
- `public.alojamientos` (`rating_promedio numeric(3,1)`, `resenas_count integer`)
- `public.profiles` (`resenas_count integer`)

## 3. Triggers y Reglas de Integridad

1. **`set_resenas_updated_at`** (`BEFORE UPDATE ON public.resenas`):
   - Asigna `NEW.updated_at = now()` cada vez que un autor edita su reseña.
2. **`sync_resenas_metrics`** (`AFTER INSERT OR UPDATE OR DELETE ON public.resenas`, `SECURITY DEFINER`):
   - Determina el par `(tipo, item_id)` afectado (tanto `NEW` como `OLD` en caso de actualización/eliminación).
   - Recalcula sobre `public.resenas`:
     - `resenas_count = COUNT(*)`
     - `rating_promedio = COALESCE(ROUND(AVG(calificacion)::numeric, 1), 0.0)`
   - Actualiza la fila correspondiente en `public.lugares`, `public.restaurantes` o `public.alojamientos`.
   - Recalcula `public.profiles.resenas_count` para el `user_id` afectado.

## 4. Políticas RLS en `public.resenas`

| Política | Operación | Regla |
| --- | --- | --- |
| Lectura pública de reseñas | `SELECT` | `USING (true)` |
| Usuarios crean su propia reseña | `INSERT` | `WITH CHECK (auth.uid() = user_id)` |
| Usuarios editan su propia reseña | `UPDATE` | `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)` |
| Usuarios eliminan su propia reseña | `DELETE` | `USING (auth.uid() = user_id OR public.is_admin())` |

## 5. Relación Conceptual y Flujo de Estados

```text
profiles (1) ────────< (N) resenas (N) >──────── (1) lugares | restaurantes | alojamientos
                                                     [via tipo + item_id]
```

### Transiciones de Estado de una Reseña (por Usuario y Elemento)

1. **Sin reseña del usuario** → El usuario autenticado completa calificación (1–5) y comentario (5–600 caracteres) → **Publicada** (trigger recalcula promedio y conteo).
2. **Publicada** → El usuario selecciona "Editar", modifica estrellas o texto y guarda → **Actualizada** (`updated_at` cambia, trigger recalcula promedio).
3. **Publicada / Actualizada** → El usuario selecciona "Eliminar" y confirma en `ConfirmModal` → **Eliminada** (trigger recalcula promedio y decrementa conteo; si llega a 0, `rating_promedio = 0.0` y `resenas_count = 0`).

## 6. Datos Semilla de Ejemplo (`supabase/seed.sql`)

- Se insertarán con UUIDs determinísticos (`e0000000-0000-0000-0000-0000000000XX`) e idempotencia (`ON CONFLICT (id) DO UPDATE`) al menos **2 reseñas de ejemplo por cada registro base**:
  - 12 lugares turísticos × 2–3 reseñas = 26 reseñas de ejemplo.
  - 6 restaurantes × 2–3 reseñas = 14 reseñas de ejemplo.
  - 6 alojamientos × 2–3 reseñas = 12 reseñas de ejemplo.
  - **Total**: ~52 reseñas realistas de Andacollo distribuidas entre los 5 perfiles comunitarios (`Carlos Muñoz`, `María Torres`, `Ana Valdés`, `Pedro Silva`, `Lucía Pérez`), con calificaciones variadas (4 y 5 estrellas, y alguna de 3 estrellas para realismo) y fechas escalonadas.
