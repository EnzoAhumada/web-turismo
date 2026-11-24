# Interface & Service Contracts

**Feature**: `004-portal-views-news-upgrades`  
**Date**: 2026-11-23

## 1. News Service (`src/services/news.service.js`)

### `getLatestNews({ limit = 10, category = null, onlyActive = true })`
- **Output**: `Promise<NewsItem[]>` ordenado por `fecha_publicacion DESC`.
- **Shape de `NewsItem`**:
  ```js
  {
    id, titulo, slug, resumen, contenido, imagen_url,
    fuente, url_externa, categoria, origen,
    fecha_publicacion, destacada, activa
  }
  ```

### `syncAndacolloNews({ force = false })`
- **Behavior**: Invoca la Edge Function `sync-andacollo-news` mediante `supabase.functions.invoke('sync-andacollo-news', { body: { force } })`.
- **Fallback**: Si la función no está desplegada, falla la red o el feed externo no responde, retorna `{ synced: false, inserted: 0, skipped: 0, fallback: true, message: 'Se muestran las noticias almacenadas localmente.' }` sin lanzar errores bloqueantes a la vista pública.
- **Success Output**: `{ synced: true, inserted: number, skipped: number, source: string, message: string }`.

## 2. Supabase Edge Function (`supabase/functions/sync-andacollo-news/index.ts`)

- **Method**: `POST`
- **Headers**: CORS habilitado para orígenes de la aplicación web.
- **Execution Flow**:
  1. Consulta feeds RSS públicos de actualidad de Andacollo con timeout seguro (6s por fuente).
  2. Extrae hasta 10 ítems recientes (título, resumen limpio de HTML, enlace externo, fecha, imagen si existe en enclosure/media).
  3. Genera `slug` normalizado y realiza `upsert` / inserción ignorando conflictos por `url_externa` o `slug` en `public.noticias` con `origen = 'automatica'`.
  4. Retorna JSON `{ synced: true, inserted, skipped, source, timestamp }`.

## 3. Astronomy Service (`src/services/astronomy.service.js`)

Además de `getAstronomyPageData()` (lectura pública), expone operaciones de administración protegidas por RLS:
- `getAstronomyAdminData()`: Retorna `{ conditions, times, resources, places }` (incluyendo todos los lugares para activar/desactivar `es_astronomico`).
- `saveAstronomyCondition(condition)` / `deleteAstronomyCondition(id)`
- `saveAstronomySchedule(schedule)` / `deleteAstronomySchedule(id)`
- `saveAstronomyResource(resource)` / `deleteAstronomyResource(id)`
- `togglePlaceAstronomical(placeId, esAstronomico)`

## 4. Planner Service (`src/services/planner.service.js`)

### `getExampleItinerary()`
- **Behavior**: Construye un itinerario de ejemplo real de 1 día en Andacollo (Mañana, Tarde, Noche) consultando `lugares`, `restaurantes`, `experiencias` y `eventos` activos de Supabase.
- **Output**:
  ```js
  {
    id: 'ejemplo-andacollo',
    title: 'Itinerario de Ejemplo: Un Día Inolvidable en Andacollo',
    subtitle: 'Combina patrimonio religioso y minero, gastronomía local, experiencia guiada y astroturismo',
    duration: '1 día',
    budget: 'Moderado',
    estimatedCost: '$28.000 CLP aprox.',
    isExample: true,
    days: [
      {
        dayNumber: 1,
        label: 'Día 1 · Esencia de Andacollo',
        blocks: [
          {
            period: 'Mañana', // 'Mañana' | 'Tarde' | 'Noche'
            stops: [
              {
                id, time, title, description, entityType, // 'lugar' | 'experiencia' | 'restaurante' | 'evento'
                typeLabel, duration, costLabel, icon, routePath // '/lugar/:id', '/experiencias/:id', etc.
              }
            ]
          }
        ]
      }
    ]
  }
  ```

### `generateItinerary({ selectedInterests, duration, budget })`
- **Behavior**: Construye un itinerario estructurado con el mismo formato `{ title, subtitle, duration, budget, estimatedCost, isExample: false, days: [...] }` según la duración elegida (`Medio día` = 1 día / 2 bloques, `1 día` = 1 día / 3 bloques, `2 – 3 días` = 2 días, `+3 días` = 3 días), priorizando lugares, experiencias, restaurantes y eventos acordes a los intereses y presupuesto seleccionados.

### `completeItineraryForUser(userId, xpReward = 120)`
- **Behavior**: Incrementa `rutas_completadas` (+1) y `xp` (+`xpReward`) en `public.profiles` del usuario autenticado, recalculando `nivel` y retornando el perfil actualizado.

## 5. Profile & Gamification Services (`src/services/gamification.service.js`, `src/hooks/useProfileStats.js`)

### `getProfileDashboardData(userId)`
- **Output**:
  ```js
  {
    profile,
    badgesCount,       // conteo real en usuario_insignias
    earnedBadges,      // lista de insignias ganadas con nombre e icono
    favoritesCount,    // conteo real en favoritos
    recentFavorites,   // últimos 4 elementos guardados con título y ruta
    userRank,          // posición real en ranking global por XP
    totalTravelers     // total de viajeros en profiles
  }
  ```

### `getGamificationData(userId)`
- **Output**:
  ```js
  {
    profileStats,      // xp, nivel, titulo_nivel, lugares_visitados, rutas_completadas, badgesCount, userRank
    badges,            // todas las insignias con { id, icon, name, desc, xpRequired, earned }
    challenges,        // desafíos activos con { id, title, desc, xp, progress, done }
    leaderboard        // top viajeros reales con { id, rank, name, initials, avatar, level, xp, places, routes, badgesCount, isMe }
  }
  ```

### `completeUserChallenge(userId, challengeId, xpReward)`
- **Behavior**: Marca el desafío como completado (`progreso_pct = 100`, `completado = true`) en `usuario_desafios` y suma `xpReward` al perfil en `public.profiles`.
