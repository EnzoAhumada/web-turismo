# Data Model: Mejoras de Mapa Móvil, Noticias, Astronomía, Experiencias, Planificador y Perfil/Ranking

**Feature**: `004-portal-views-news-upgrades`  
**Date**: 2026-11-23

## 1. Nuevas Tablas

### `public.noticias`
Almacena noticias locales de Andacollo creadas manualmente por administradores o sincronizadas automáticamente desde fuentes locales.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Identificador único |
| `titulo` | `text` | `NOT NULL` | Titular de la noticia |
| `slug` | `text` | `UNIQUE` | Identificador normalizado para deduplicación y URL amigable |
| `resumen` | `text` | `NOT NULL` | Bajada o extracto breve mostrado en tarjetas de Inicio |
| `contenido` | `text` | `NOT NULL` | Desarrollo completo de la noticia (mostrado en modal/detalle) |
| `imagen_url` | `text` | `NULL` | Fotografía principal de la noticia |
| `fuente` | `text` | `NOT NULL DEFAULT 'Municipalidad de Andacollo'` | Nombre del medio o entidad emisora |
| `url_externa` | `text` | `UNIQUE` (parcial cuando `NOT NULL`) | Enlace a la fuente original; previene duplicados en sincronización |
| `categoria` | `text` | `NOT NULL DEFAULT 'Comuna'` | Etiqueta (`Comuna`, `Turismo`, `Cultura`, `Astronomía`, `Eventos`, `Patrimonio`) |
| `origen` | `text` | `NOT NULL DEFAULT 'manual' CHECK (origen IN ('manual', 'automatica'))` | Indica si fue ingresada por admin o sincronizada automáticamente |
| `fecha_publicacion` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha y hora de publicación para ordenamiento descendente |
| `destacada` | `boolean` | `NOT NULL DEFAULT false` | Permite resaltar noticia principal en Inicio |
| `activa` | `boolean` | `NOT NULL DEFAULT true` | Controla visibilidad pública |
| `comuna` | `text` | `NOT NULL DEFAULT 'Andacollo'` | Escalabilidad regional (IV Región) |
| `region` | `text` | `NOT NULL DEFAULT 'Coquimbo'` | Escalabilidad regional |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de creación |
| `updated_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de última modificación |

**Políticas RLS**:
- `SELECT`: Lectura pública para filas con `activa = true` (o todas si `public.is_admin()`).
- `INSERT / UPDATE / DELETE`: Solo `public.is_admin()` (y `service_role` desde Edge Function).

---

## 2. Tablas Existentes Modificadas / Ampliadas

### `public.profiles`
Se amplía con campos útiles de perfil y preferencias persistentes:
- `biografia text DEFAULT ''` — Descripción breve del viajero (opcional).
- `ciudad_origen text DEFAULT 'Región de Coquimbo'` — Procedencia del viajero.
- `preferencia_offline boolean NOT NULL DEFAULT false` — Preferencia de modo ahorro/offline persistida.

**Reglas de validación y consistencia**:
- `nivel` se deriva o sincroniza con `xp` (`FLOOR(xp / 500) + 1`, mínimo 1).
- `lugares_visitados`, `rutas_completadas` y `resenas_count` nunca se sustituyen por números ficticios en UI; si son `0`, se muestran como `0`.

### `public.astronomia_condiciones`, `public.astronomia_horarios`, `public.astronomia_recursos`
Se conservan sus columnas existentes y se agregan:
- `updated_at timestamptz NOT NULL DEFAULT now()` en `astronomia_condiciones` para mostrar cuándo actualizó por última vez el administrador las condiciones del cielo.
- **Nuevas Políticas RLS de Administración** (faltantes en migración 001):
  - `Admin gestiona condiciones astronómicas` (`FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())`)
  - `Admin gestiona horarios astronómicos` (`FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())`)
  - `Admin gestiona recursos astronómicos` (`FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())`)

### `public.experiencias`
Se conserva la tabla existente y se amplía el `CHECK` de `categoria` para admitir:
- `('Tours', 'Gastronomía', 'Aventura', 'Astroturismo', 'Cultura')`
Manteniendo `Tours`, `Gastronomía` y `Aventura` como filtros principales del mockup y permitiendo clasificar actividades locales con precisión desde `ExperiencesAdminPage`.

### `public.usuario_insignias` y `public.usuario_desafios`
Se agregan políticas RLS de lectura pública (o lectura del propio usuario + conteo agregado para ranking) para que `GamificationPage` y `ProfilePage` reflejen el conteo exacto de insignias por usuario:
- `Lectura pública de insignias de usuarios` (`FOR SELECT USING (true)`) — permite mostrar cuántas insignias tiene cada viajero en la tabla de ranking y en su perfil sin exponer datos privados.

---

## 3. Relaciones Clave

- `noticias`: Entidad independiente vinculada territorialmente por `comuna` / `region`.
- `astronomia_condiciones` + `astronomia_horarios` + `astronomia_recursos` + `lugares (es_astronomico = true)` + `eventos (es_astronomico = true)`: Componen la vista pública `AstronomyPage` y el panel `AstronomyAdminPage`.
- `experiencias`: Entidad de catálogo público (`ExperiencesPage`, `ExperienceDetailPage`) y CRUD privado (`ExperiencesAdminPage`), además de insumo para el Planificador de Viajes.
- `rutas_paradas` + `lugares` + `experiencias` + `restaurantes` + `eventos`: Combinados por `planner.service.js` para construir el itinerario de ejemplo y los itinerarios personalizados por días y franjas horarias.
- `profiles` ↔ `usuario_insignias` ↔ `insignias`, `profiles` ↔ `usuario_desafios` ↔ `desafios`, `profiles` ↔ `favoritos`: Alimentan `ProfilePage` y `GamificationPage` con datos reales 100% persistidos.
