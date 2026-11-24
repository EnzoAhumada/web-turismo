# Tasks: Comentarios y Valoraciones para Lugares, Restaurantes y Alojamientos

**Input**: Design documents from `/specs/005-reviews-and-ratings/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/reviews-service.md`, `quickstart.md`

**Tests**: No se solicitaron pruebas automatizadas TDD explícitas en la especificación; la validación se realiza mediante compilación (`npm run build`), verificación de migración/semilla en Supabase y los escenarios end-to-end de `quickstart.md`.

**Organization**: Las tareas están agrupadas por historia de usuario (US1–US4) para permitir implementación y verificación incremental.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia de tareas incompletas)
- **[Story]**: Historia de usuario a la que pertenece (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Cada tarea incluye la ruta exacta de archivo

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar la estructura modular del nuevo componente UI de reseñas conforme al plan.

- [X] T001 Create component directory and barrel export file `src/components/ui/ReviewsSection/index.js` exporting `ReviewsSection`
- [X] T002 Verify current migration sequence in `supabase/migrations/` and confirm target migration filename `supabase/migrations/20261124000001_reviews_and_ratings.sql`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura de base de datos, datos semilla de ejemplo, servicio de acceso a datos y soporte base en `DetailLayout`/`useEntityDetail` necesarios para todas las historias de usuario.

**⚠️ CRITICAL**: Completar esta fase antes de implementar las historias de usuario.

- [X] T003 Create SQL migration `supabase/migrations/20261124000001_reviews_and_ratings.sql` defining `public.resenas` (`id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, `user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`, `tipo text NOT NULL CHECK (tipo IN ('lugar', 'restaurante', 'alojamiento'))`, `item_id uuid NOT NULL`, `calificacion smallint NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5)`, `comentario text NOT NULL CHECK (char_length(btrim(comentario)) BETWEEN 5 AND 600)`, `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz NOT NULL DEFAULT now()`, `UNIQUE (user_id, tipo, item_id)`), indexes `idx_resenas_item_created` and `idx_resenas_user_id`, triggers `set_resenas_updated_at` and `sync_resenas_metrics` (`SECURITY DEFINER`) updating `rating_promedio`/`resenas_count` on `lugares`, `restaurantes`, `alojamientos`, and `profiles`, RLS policies (`SELECT` public, `INSERT`/`UPDATE` owner `auth.uid() = user_id`, `DELETE` owner or `public.is_admin()`), and defensive `INSERT` policy on `public.profiles` for `auth.uid() = id`
- [X] T004 Add idempotent seed records (`ON CONFLICT (id) DO UPDATE`) for at least 2 realistic Andacollo example reviews per item across all 12 `lugares`, 6 `restaurantes`, and 6 `alojamientos` (~52 reviews total using deterministic UUIDs `e0000000-0000-0000-0000-0000000000XX` linked to the 5 community profiles) in `supabase/seed.sql`
- [X] T005 Implement reviews data service in `src/services/reviews.service.js` with `getReviewsByEntity(tipo, itemId)` (joining `profiles(id, nombre, apellido, avatar_url, titulo_nivel)` ordered by `created_at DESC` and computing `summary` with `average`, `count`, `distribution`), `createReview({ userId, tipo, itemId, calificacion, comentario })`, `updateReview(reviewId, userId, { calificacion, comentario })`, and `deleteReview(reviewId, userId)` with Spanish error messages
- [X] T006 [P] Update `src/hooks/useEntityDetail.js` to expose `updateRatingSummary({ rating_promedio, resenas_count })` so detail pages synchronize header rating metrics immediately after review changes
- [X] T007 [P] Update `src/components/layout/DetailLayout/DetailLayout.jsx` to accept an optional `reviewsSection` prop rendered inside `<article className="place-main">` before `relatedSection`, and update `src/components/ui/StarRating/StarRating.jsx` to format `0` reviews cleanly (`Sin reseñas`) and singular/plural (`1 reseña` / `N reseñas`)

**Checkpoint**: Base de datos, reseñas de ejemplo, servicio de reseñas y soporte en layout listos.

---

## Phase 3: User Story 1 - Visualizar Comentarios y Valoraciones Reales en Fichas de Detalle (Priority: P1) 🎯 MVP

**Goal**: Permitir que cualquier visitante visualice el resumen de valoraciones, la distribución por estrellas y el listado cronológico de comentarios persistidos (incluyendo reseñas de ejemplo de Andacollo) en lugares turísticos, restaurantes y alojamientos.

**Independent Test**: Abrir sin iniciar sesión una ficha de lugar turístico, una de restaurante y una de alojamiento; confirmar que cada una muestra su calificación promedio, cantidad total de reseñas y al menos 2 comentarios de ejemplo con autor, estrellas, texto y fecha en español, más una invitación clara a iniciar sesión para opinar.

### Implementation for User Story 1

- [X] T008 [US1] Create `src/hooks/useReviews.js` to fetch reviews and summary via `getReviewsByEntity`, track loading/error states, identify the current user's review (`userReview`), and invoke `onSummaryChange` when summary data loads
- [X] T009 [P] [US1] Create base native CSS3 styles in `src/components/ui/ReviewsSection/ReviewsSection.css` using project color variables (`--color-primary`, `--color-navy`, `--color-gold`, `--color-orange`, `--color-white`, `--color-soft`), `rem` units (base `10px`), Flexbox/Grid layout for rating summary, distribution bars, review cards, empty state, and auth CTA
- [X] T010 [US1] Implement `ReviewsSection` read/display view in `src/components/ui/ReviewsSection/ReviewsSection.jsx` rendering rating summary (average, star icons, total count, 5-to-1 distribution bars), loading/error states, Spanish empty state, chronological list of review cards (author avatar or initials, full name, star rating, comment text, Spanish formatted date), and unauthenticated prompt linking to `/login` and `/registro`
- [X] T011 [P] [US1] Integrate `<ReviewsSection entityType="lugar" entityId={id} entityName={place?.nombre} onSummaryChange={updateRatingSummary} />` via `reviewsSection` prop in `src/pages/PlaceDetailPage/PlaceDetailPage.jsx`
- [X] T012 [P] [US1] Integrate `<ReviewsSection entityType="restaurante" entityId={id} entityName={item?.nombre} onSummaryChange={updateRatingSummary} />` via `reviewsSection` prop in `src/pages/RestaurantDetailPage/RestaurantDetailPage.jsx`
- [X] T013 [P] [US1] Integrate `<ReviewsSection entityType="alojamiento" entityId={id} entityName={item?.nombre} onSummaryChange={updateRatingSummary} />` via `reviewsSection` prop in `src/pages/AccommodationDetailPage/AccommodationDetailPage.jsx`

**Checkpoint**: User Story 1 es completamente funcional y verificable de forma independiente (MVP de visualización con datos reales en BD).

---

## Phase 4: User Story 2 - Publicar un Comentario y Valoración como Usuario Autenticado (Priority: P1)

**Goal**: Permitir que usuarios autenticados seleccionen una valoración de 1 a 5 estrellas, escriban un comentario validado y lo publiquen con persistencia inmediata y recálculo de métricas.

**Independent Test**: Iniciar sesión, abrir un lugar, restaurante o alojamiento donde el usuario no haya opinado, probar validaciones con campos vacíos, luego seleccionar estrellas y publicar un comentario; recargar la página y verificar persistencia y actualización de promedio y conteo.

### Implementation for User Story 2

- [X] T014 [US2] Extend `src/hooks/useReviews.js` with `submitReview({ calificacion, comentario })` validating integer `calificacion` (1..5) and trimmed `comentario` length (`5..600`), calling `createReview`, updating local list/summary immediately, triggering `onSummaryChange`, and exposing Spanish `feedback` state (`success`/`error`)
- [X] T015 [US2] Add interactive review creation form in `src/components/ui/ReviewsSection/ReviewsSection.jsx` with accessible 1–5 star selector (`role="radiogroup"`, `aria-label` in Spanish, hover and selected preview), `<textarea>` with live character counter (`0 / 600`), explicit `event.preventDefault()` on submit and button clicks, and `FeedbackBanner` for inline validation/success/error feedback
- [X] T016 [US2] Add interactive star selector, review form, character counter, and submit button styles in `src/components/ui/ReviewsSection/ReviewsSection.css`

**Checkpoint**: Usuarios autenticados pueden publicar comentarios y valoraciones que persisten en BD y actualizan métricas en vivo.

---

## Phase 5: User Story 3 - Editar o Eliminar la Propia Reseña y Evitar Duplicados (Priority: P2)

**Goal**: Evitar reseñas duplicadas por usuario y elemento, permitiendo editar o eliminar la propia reseña con confirmación visual mediante `ConfirmModal` y recálculo automático del promedio.

**Independent Test**: Con un usuario que ya publicó una reseña en un elemento, comprobar que se muestra su reseña con insignia "Tu reseña" y acciones "Editar" y "Eliminar" (sin formulario duplicado); editarla y confirmar persistencia; luego eliminarla confirmando en `ConfirmModal` y verificar recálculo de promedio y conteo.

### Implementation for User Story 3

- [X] T017 [US3] Extend `src/hooks/useReviews.js` so `submitReview` updates an existing `userReview` via `updateReview` when editing, and add `removeUserReview()` calling `deleteReview`, updating local reviews/summary, notifying `onSummaryChange`, and setting Spanish confirmation/error feedback
- [X] T018 [US3] Add own-review management UI in `src/components/ui/ReviewsSection/ReviewsSection.jsx`: hide duplicate creation form when `userReview` exists, display "Tu reseña" badge with "Editar" and "Eliminar" buttons (`event.preventDefault()`), support inline edit mode pre-filled with current rating/comment plus "Guardar cambios"/"Cancelar", and integrate `ConfirmModal` for delete confirmation (zero native `confirm`/`alert`)
- [X] T019 [US3] Add styling for own-review card highlight, "Tu reseña" badge, and edit/delete action controls in `src/components/ui/ReviewsSection/ReviewsSection.css`

**Checkpoint**: Gestión completa de reseña propia (crear, editar, eliminar) sin duplicados y con confirmación visual nativa del diseño.

---

## Phase 6: User Story 4 - Consistencia de Calificaciones en Catálogos y Experiencia Responsiva (Priority: P3)

**Goal**: Garantizar que las calificaciones promedio y totales coincidan entre fichas de detalle y tarjetas de catálogo, y que la experiencia sea cómoda y sin desbordamiento desde 360px hasta escritorio.

**Independent Test**: Publicar o modificar una reseña y volver a `/explorar`, `/restaurantes` y `/alojamientos` verificando la coincidencia de promedio/conteo; inspeccionar la ficha de detalle en anchos móviles (`360px`, `390px`) y escritorio comprobando controles táctiles y cero scroll horizontal.

### Implementation for User Story 4

- [X] T020 [P] [US4] Audit and refine rating display in `src/components/ui/Card/Card.jsx` and `src/components/ui/StarRating/StarRating.jsx` so items with `0` reviews or newly recalculated 1-decimal averages render consistently across catalog grids and detail headers
- [X] T021 [US4] Refine responsive media queries (`<= 48rem` / `<= 30rem`) in `src/components/ui/ReviewsSection/ReviewsSection.css` ensuring touch-friendly star controls (minimum 3.6rem tap target), clean wrapping of review headers/dates, and zero horizontal overflow at `360px` width

**Checkpoint**: Consistencia total entre vistas de catálogo y detalle en móvil y escritorio.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Aplicar cambios en base de datos, compilar y validar todos los requisitos de calidad y Constitución.

- [X] T022 Apply migration and seed data (`npm run db:reset` or `npx supabase migration up` + seed verification) and verify in PostgreSQL/Supabase that `public.resenas` has seeded reviews across all 12 `lugares`, 6 `restaurantes`, and 6 `alojamientos` with synchronized `rating_promedio` and `resenas_count`
- [X] T023 Run `npm run build` and validate end-to-end scenarios in `specs/005-reviews-and-ratings/quickstart.md` alongside Constitution checks (100% Spanish UI, zero `alert`/`confirm`/`prompt`/`innerHTML`, `event.preventDefault()`, zero new npm dependencies)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias, inicia de inmediato.
- **Phase 2 (Foundational)**: Depende de Phase 1 — **BLOQUEA** todas las historias de usuario.
- **Phase 3 (US1 - P1)**: Depende de Phase 2. Entrega el MVP de visualización con datos persistidos de ejemplo.
- **Phase 4 (US2 - P1)**: Depende de US1 (extiende `useReviews.js` y `ReviewsSection.jsx`).
- **Phase 5 (US3 - P2)**: Depende de US2 (agrega edición/eliminación sobre el mismo flujo de reseña propia).
- **Phase 6 (US4 - P3)**: Depende de US1–US3 para auditar consistencia final y responsividad.
- **Phase 7 (Polish)**: Depende de la finalización de todas las fases anteriores.

### Parallel Opportunities

- En **Phase 2**: `T006` (`useEntityDetail.js`) y `T007` (`DetailLayout.jsx` + `StarRating.jsx`) pueden ejecutarse en paralelo con `T005` (`reviews.service.js`).
- En **Phase 3 (US1)**: `T009` (`ReviewsSection.css`) puede escribirse en paralelo con `T008` (`useReviews.js`); luego `T011`, `T012` y `T013` (las tres páginas de detalle) pueden actualizarse en paralelo.
- En **Phase 6 (US4)**: `T020` (`Card.jsx`/`StarRating.jsx`) puede ejecutarse en paralelo con `T021` (`ReviewsSection.css`).

---

## Parallel Example: User Story 1

```text
# En paralelo tras completar T008 y T010:
Task T011 [P] [US1]: Integrate ReviewsSection in src/pages/PlaceDetailPage/PlaceDetailPage.jsx
Task T012 [P] [US1]: Integrate ReviewsSection in src/pages/RestaurantDetailPage/RestaurantDetailPage.jsx
Task T013 [P] [US1]: Integrate ReviewsSection in src/pages/AccommodationDetailPage/AccommodationDetailPage.jsx
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)
1. Completar Phase 1 (Setup) + Phase 2 (Migración SQL, Semilla de ejemplo, Servicio y Layout).
2. Completar Phase 3 (US1: visualización de reseñas reales de ejemplo en lugares, restaurantes y alojamientos).
3. Completar Phase 4 (US2: publicación de comentarios y valoraciones por usuarios autenticados).
4. Completar Phase 5 (US3: edición/eliminación sin duplicados) y Phase 6 (US4: consistencia en catálogos y responsividad móvil).
5. Ejecutar Phase 7 (aplicación en BD, `npm run build` y validación completa de `quickstart.md`).
