# Interface Contracts: Servicio de Reseñas y Componente UI

**Feature**: `005-reviews-and-ratings`  
**Date**: 2026-11-24

## 1. Contrato de Servicio (`src/services/reviews.service.js`)

Todas las funciones trabajan contra `public.resenas` en Supabase y lanzan errores con mensajes amigables en español en caso de fallo.

### Tipos compartidos (JSDoc / contrato de datos)

```js
/**
 * @typedef {'lugar' | 'restaurante' | 'alojamiento'} ReviewEntityType
 *
 * @typedef {Object} ReviewItem
 * @property {string} id
 * @property {string} user_id
 * @property {ReviewEntityType} tipo
 * @property {string} item_id
 * @property {number} calificacion          // entero 1..5
 * @property {string} comentario            // texto 5..600 caracteres
 * @property {string} created_at            // ISO timestamp
 * @property {string} updated_at            // ISO timestamp
 * @property {{ id: string, nombre: string, apellido: string, avatar_url: string | null, titulo_nivel: string | null } | null} autor
 *
 * @typedef {Object} ReviewSummary
 * @property {number} average               // redondeado a 1 decimal (0 si count === 0)
 * @property {number} count                 // entero >= 0
 * @property {Record<1|2|3|4|5, number>} distribution
 */
```

### Funciones exportadas

1. `getReviewsByEntity(tipo, itemId)`
   - **Input**: `tipo: ReviewEntityType`, `itemId: string`
   - **Output**: `Promise<{ reviews: ReviewItem[], summary: ReviewSummary }>`
   - **Comportamiento**: Consulta `public.resenas` con join a `public.profiles(id, nombre, apellido, avatar_url, titulo_nivel)`, ordena por `created_at DESC`, calcula `summary` (promedio, conteo y distribución de 1 a 5 estrellas).

2. `createReview({ userId, tipo, itemId, calificacion, comentario })`
   - **Input**: datos validados (`calificacion` 1..5, `comentario.trim()` 5..600).
   - **Output**: `Promise<ReviewItem>`
   - **Comportamiento**: Inserta en `public.resenas` y retorna la fila con los datos de `profiles`. Si detecta violación de unicidad (`23505`), retorna error claro en español indicando que ya existe una reseña del usuario.

3. `updateReview(reviewId, userId, { calificacion, comentario })`
   - **Input**: `reviewId`, `userId`, nueva `calificacion` y `comentario`.
   - **Output**: `Promise<ReviewItem>`
   - **Comportamiento**: Actualiza en `public.resenas` filtrando por `id` y `user_id` y retorna la fila actualizada con `profiles`.

4. `deleteReview(reviewId, userId)`
   - **Input**: `reviewId`, `userId`.
   - **Output**: `Promise<boolean>`
   - **Comportamiento**: Elimina la fila en `public.resenas` filtrando por `id` y `user_id`.

## 2. Contrato del Hook (`src/hooks/useReviews.js`)

```js
const {
  reviews,            // ReviewItem[]
  summary,            // ReviewSummary
  userReview,         // ReviewItem | null (reseña del usuario autenticado actual)
  loading,            // boolean
  submitting,         // boolean
  deleting,           // boolean
  error,              // string
  feedback,           // { type: 'success' | 'error' | 'info', message: string } | null
  clearFeedback,      // () => void
  reloadReviews,      // () => Promise<void>
  submitReview,       // ({ calificacion, comentario }) => Promise<boolean>
  removeUserReview,   // () => Promise<boolean>
} = useReviews(entityType, entityId, { onSummaryChange });
```

- `onSummaryChange({ rating_promedio, resenas_count })` se invoca tras cargar, crear, editar o eliminar reseñas para mantener sincronizado el encabezado de `DetailLayout` a través de `useEntityDetail`.

## 3. Contrato del Componente UI (`src/components/ui/ReviewsSection`)

```jsx
<ReviewsSection
  entityType="lugar" // | "restaurante" | "alojamiento"
  entityId={id}
  entityName={item.nombre}
  onSummaryChange={updateRatingSummary}
/>
```

### Reglas de Interacción y Accesibilidad

- Todos los eventos `submit` y `click` personalizados llaman a `event.preventDefault()`.
- Selector de estrellas accesible con `role="radiogroup"`, botones con `aria-label="Calificar con N estrellas"` y estado visual claro en hover/selección usando `--color-gold` (`#FFB800`).
- Validaciones en vivo y al enviar mostradas en `FeedbackBanner` o mensajes inline en español (nunca `alert`, `confirm` ni `prompt`).
- Eliminación protegida mediante el componente existente `ConfirmModal`.
- Visitantes sin sesión ven el listado completo y una tarjeta de invitación con enlace a `/login` y `/registro` (pasando `state={{ from: location.pathname }}`).
- Si `summary.count === 0`, `StarRating` muestra un estado limpio (`Sin reseñas` / `0 reseñas`) sin valores `NaN` o `null`.
