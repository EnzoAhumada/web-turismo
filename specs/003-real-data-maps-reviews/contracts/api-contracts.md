# Interface & Service Contracts

**Feature**: `003-real-data-maps-reviews`  
**Date**: 2026-11-20

## 1. Servicio de Reseñas (`src/services/reviews.service.js`)

### `getReviewsByItem(tipo, itemId)`
- **Input**: `tipo` (`'lugar' | 'restaurante' | 'alojamiento' | 'evento' | 'experiencia'`), `itemId` (`string` UUID).
- **Output**: `Promise<Array<ReviewWithAuthor>>` ordenado por `created_at DESC`.
  - Cada elemento incluye: `id`, `user_id`, `tipo`, `item_id`, `calificacion`, `comentario`, `created_at`, `author: { nombre, apellido, avatar_url, titulo_nivel }`.

### `createReview({ userId, tipo, itemId, calificacion, comentario })`
- **Validación**: `calificacion` entero entre 1 y 5; `comentario` no vacío (mínimo 5 caracteres).
- **Output**: `Promise<ReviewWithAuthor>` recién creado.
- **Error**: Mensaje legible en español si falla RLS o validación.

### `deleteReview(reviewId)`
- **Input**: `reviewId` (`string` UUID).
- **Output**: `Promise<void>` (solo permitido al autor o admin por RLS).

## 2. Servicio de Búsqueda y Autocompletado (`src/services/search.service.js`)

### `searchCatalogSuggestions(query, limit = 8)`
- **Input**: `query` (`string`, mínimo 2 caracteres efectivos), `limit` (`number`).
- **Behavior**: Busca coincidencias insensibles a mayúsculas y tildes (`normalize('NFD')`) en `nombre`, `subtitulo`/`categoria` y `direccion`/`ubicacion` sobre `lugares`, `restaurantes`, `alojamientos`, `eventos` y `experiencias`.
- **Output**: `Promise<Array<SearchSuggestion>>`:
  - `id`: UUID
  - `tipo`: `'lugar' | 'restaurante' | 'alojamiento' | 'evento' | 'experiencia'`
  - `nombre`: string
  - `categoriaLabel`: string (ej. `'Sitio turístico'`, `'Restaurante'`, `'Alojamiento'`, `'Evento'`, `'Experiencia'`)
  - `subtitulo`: string (dirección o subtítulo)
  - `imagen_url`: string
  - `rating`: number | null
  - `to`: ruta de detalle (`/lugar/:id`, `/restaurantes/:id`, `/alojamientos/:id`, `/eventos/:id`, `/experiencias/:id`)

## 3. Contrato de Componente `GoogleMapView` (`src/components/ui/GoogleMapView`)

### Props
- `center`: `{ lat: number, lng: number }` (por defecto Andacollo: `-30.2286, -71.0853`)
- `zoom`: `number` (por defecto `14` en mapa general, `16` en detalle)
- `markers`: `Array<{ id, label, categoryLabel, lat, lng, color, to, image, rating }>`
- `selectedId`: `string | null`
- `onSelectMarker`: `(marker) => void`
- `height`: `string` (en `rem`, ej. `'42rem'` o `'100%'`)
- `title`: `string` (para `aria-label` / `title` del mapa)

### Comportamiento
- Si `VITE_GOOGLE_MAPS_API_KEY` existe, carga Google Maps JS API, dibuja pines interactivos con colores por categoría y sincroniza `selectedId` con `onSelectMarker`.
- Si no existe `VITE_GOOGLE_MAPS_API_KEY` o falla la carga de red, renderiza automáticamente el `<iframe>` oficial de Google Maps centrado en el marcador seleccionado (o centro de Andacollo) + enlace externo `"Abrir en Google Maps"` / `"Cómo llegar"`.

## 4. Contrato de Componente `ReviewsSection` (`src/components/ui/ReviewsSection`)

### Props
- `entityType`: `'lugar' | 'restaurante' | 'alojamiento' | 'evento' | 'experiencia'`
- `entityId`: `string`
- `initialRating`: `number`
- `initialCount`: `number`
- `onStatsUpdate`: `({ rating, count }) => void` (opcional para refrescar cabecera del detalle)

### Comportamiento
- Muestra resumen de estrellas promedio y total de reseñas.
- Lista reseñas existentes en tarjetas limpias (sin `innerHTML`).
- Si el usuario está autenticado, muestra formulario interactivo de calificación (1–5 estrellas seleccionables) + textarea + botón enviar con estado de carga y `FeedbackBanner` en el DOM (sin `alert`/`confirm`).
- Si no está autenticado, muestra aviso en español con enlace a `/bienvenida` para iniciar sesión y comentar.
