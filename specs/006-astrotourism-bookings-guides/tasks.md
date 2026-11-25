# Tasks: Astroturismo Comunitario, Reservas Adaptativas, Guías Certificados y Perfil Mejorado

**Input**: Design documents from `/specs/006-astrotourism-bookings-guides/`
**Prerequisites**: [plan.md](file:///home/i/Documentos/web-turismo/specs/006-astrotourism-bookings-guides/plan.md), [spec.md](file:///home/i/Documentos/web-turismo/specs/006-astrotourism-bookings-guides/spec.md), [research.md](file:///home/i/Documentos/web-turismo/specs/006-astrotourism-bookings-guides/research.md), [data-model.md](file:///home/i/Documentos/web-turismo/specs/006-astrotourism-bookings-guides/data-model.md), [services-and-routes.md](file:///home/i/Documentos/web-turismo/specs/006-astrotourism-bookings-guides/contracts/services-and-routes.md)

**Tests**: Not explicitly requested in the feature specification; validation is covered via `npm run build`, Supabase migration verification, and the end-to-end scenarios in [quickstart.md](file:///home/i/Documentos/web-turismo/specs/006-astrotourism-bookings-guides/quickstart.md).

**Organization**: Tasks are grouped by user story (P1 → P2) to enable independent implementation and verification of each increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story mapping (`[US1]`..`[US5]`)

---

## Phase 1: Setup (Shared Utilities & Visual Helpers)

**Purpose**: Create reusable client-side utilities needed across gallery, bookings, and profiles without adding external dependencies.

- [X] T001 [P] Create procedural astronomical Canvas scene generator and image resolver (`resolveAstroImage` supporting `preset:milkyway`, `preset:carina`, `preset:startrails`, `preset:moon_mining`, `preset:collowara_dome`, `preset:collowara_terrace`, `preset:chacana`, plus direct URLs/DataURLs) in `src/lib/astroScenes.js`
- [X] T002 [P] Add CSS variables/tokens if needed for astro-cards and reservation badges (preserving official palette `#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA` and `rem` base `10px`) in `src/styles/variables.css`

---

## Phase 2: Foundational (Blocking Database & Shared Layout Prerequisites)

**Purpose**: Database schema, triggers, RLS policies, seeded mockup data, and shared layout slots that block all user stories.

**⚠️ CRITICAL**: Complete this phase before implementing any user story.

- [X] T003 Create Supabase migration `supabase/migrations/20261124000002_astrotourism_bookings_guides.sql` implementing:
  - `ALTER TABLE public.profiles` adding `handle text UNIQUE`, `rol_fotografico text`, `certificacion text`, `gear_bag jsonb NOT NULL DEFAULT '[]'::jsonb`, `astro_badges jsonb NOT NULL DEFAULT '[]'::jsonb`
  - `public.categorias` update replacing `otros` with `guias` (`Guías Turísticos`) and updating slug CHECK constraint
  - Tables `public.astro_photos` (with `base_likes integer NOT NULL DEFAULT 0`, `likes_count integer NOT NULL DEFAULT 0 CHECK (likes_count >= 0)`), `public.astro_photo_likes` (`UNIQUE(photo_id, user_id)`), and `public.user_follows` (`UNIQUE(follower_id, following_profile_id)`) plus `trg_sync_astro_photo_likes` trigger
  - Tables `public.booking_configs` (`entity_type IN ('lugar','restaurante','alojamiento','evento','experiencia')`, `UNIQUE(entity_type, entity_id)`, `booking_profile IN ('tour_horario','mesa_comida','estadia_noches','servicio_general')`, `pricing_mode IN ('calculado','sin_costo')`, `confirmation_mode IN ('inmediata','pendiente')`, `descuento_residente_pct BETWEEN 0 AND 100`), `public.booking_packages` (`pricing_unit IN ('por_persona','tarifa_fija','por_noche')`, `capacidad_maxima >= 1`), `public.booking_slots` (`UNIQUE(config_id, hora_inicio)`, `capacidad_base >= 1`), and `public.bookings` (`estado IN ('pendiente','confirmada','cancelada')`, `codigo text UNIQUE`)
  - Tables `public.tour_guides` and `public.guide_booking_requests` (`personas BETWEEN 1 AND 20`, `estado IN ('pendiente','confirmada','cancelada')`)
  - Full RLS policies per `data-model.md` (public read for active records, authenticated user write for own records, `public.is_admin()` for admin management)
  - Idempotent seed data from the mockup: 3 photographers (`leokaant_astrophoto`, `matias_astro`, `valentina_sky`), 4 astrophotographs, Observatorio Collowara active `booking_config` (`tour_horario`, `calculado`, `inmediata`, 20% resident discount, highlights, gallery) with 3 packages and 3 slots (`20:30`, `22:00`, `23:30`), and 4 certified guides with itineraries
- [X] T004 [P] Update `supabase/seed.sql` so category `otros` reflects `guias` (`Guías Turísticos`) consistently on fresh `db:reset`
- [X] T005 [P] Add `bookingSection = null` prop and render slot in `src/components/layout/DetailLayout/DetailLayout.jsx` so all 5 entity detail pages can display adaptive reservations cleanly above `reviewsSection`
- [X] T006 [P] Update `src/components/ui/CategoryIcon/CategoryIcon.jsx` to support the `guias` category icon/style replacing `otros`

**Checkpoint**: Database schema, seeded mockup data, and shared layout slot are ready — user story work can now proceed.

---

## Phase 3: User Story 1 - Galería Comunitaria de Astrofotografía y Subida de Capturas (Priority: P1) 🎯 MVP

**Goal**: Replace the "Fotografía" menu view with the community Astrophotography Gallery featuring Andacollo sky telemetry, spot filters with counts, sorting, EXIF detail modal, persistent likes, and photo upload modal.

**Independent Test**: Open `/fotografia` (or click "Fotografía" in Explorer/Header), verify sky telemetry + 4 seeded captures, filter by spot, sort by likes, inspect EXIF modal, toggle like (authenticated), and upload a new photo confirming persistence on reload.

- [X] T007 [P] [US1] Implement `src/services/astrophotos.service.js` (`getAstroPhotos`, `createAstroPhoto`, `uploadAstroPhotoFile` validating `image/*` and `<= 5 MB` with Storage + DataURL fallback, `toggleAstroPhotoLike`, `deleteAstroPhoto`)
- [X] T008 [P] [US1] Implement `src/components/ui/AstroPhotoUploadModal/AstroPhotoUploadModal.jsx`, `src/components/ui/AstroPhotoUploadModal/AstroPhotoUploadModal.css`, and `src/components/ui/AstroPhotoUploadModal/index.js` with file upload + preview, 3 preset sample scenes (`milkyway`, `carina`, `startrails`), title, spot selector, story description, EXIF inputs, `event.preventDefault()`, and DOM feedback (no native dialogs)
- [X] T009 [US1] Implement `src/hooks/useAstroGallery.js` combining `astrophotos.service.js` and `astronomy.service.js` (live sky telemetry fallback + spot filter counts + sort by `recent`/`likes` + like toggle + upload refresh)
- [X] T010 [US1] Implement `src/pages/AstroGalleryPage/AstroGalleryPage.jsx`, `src/pages/AstroGalleryPage/AstroGalleryPage.css`, and `src/pages/AstroGalleryPage/index.js` adapted to official palette & `rem` CSS3 layout, including EXIF photo detail modal and links to `/fotografo/:handleOrId`
- [X] T011 [US1] Wire `/fotografia` route in `src/App.jsx`, update `src/hooks/useExplorerData.js` so selecting category `fotografia` navigates to `/fotografia`, and add "Astrofotos" link in `src/components/layout/Header/Header.jsx`

**Checkpoint**: User Story 1 is independently functional and testable at `/fotografia`.

---

## Phase 4: User Story 2 - Módulo de Reservas Adaptativo en Fichas de Detalle (Observatorio Collowara y Catálogo) (Priority: P1)

**Goal**: Render a configurable, adaptive reservation module inside any catalog detail page when enabled (initially active for Observatorio Turístico Collowara), supporting all 4 profiles (`tour_horario`, `mesa_comida`, `estadia_noches`, `servicio_general`), pricing modes (`calculado`/`sin_costo`), confirmation modes (`inmediata`/`pendiente`), live slot capacity, pass generation, and "Mis Pases" management.

**Independent Test**: Open Observatorio Collowara (`/lugar/20000000-0000-0000-0000-000000000002`), verify infrastructure highlights + enlargeable facility gallery + 3 packages + 3 slots, book a tour with 20% resident discount, verify unique `COL-YYYY-XXXX` pass and reduced slot spots, copy code, and cancel via styled `ConfirmModal` verifying spot release.

- [X] T012 [P] [US2] Implement `src/services/bookings.service.js` public functions (`getEntityBookingSetup`, `getSlotAvailability`, `calculateBookingTotal`, `createEntityBooking` validating future dates, `fecha_fin > fecha_inicio` for `estadia_noches`, and live slot capacity, `getUserBookings`, `cancelBooking`)
- [X] T013 [US2] Implement `src/hooks/useEntityBooking.js` managing active config loading, adaptive form state across all 4 profiles, live slot availability reload on date change, real-time CLP total calculation, booking submission, clipboard copy feedback, and cancellation state
- [X] T014 [US2] Implement `src/components/ui/BookingSection/BookingSection.jsx`, `src/components/ui/BookingSection/BookingSection.css`, and `src/components/ui/BookingSection/index.js` with infrastructure highlights, enlargeable facility gallery modal, adaptive booking form (all 4 profiles + `calculado`/`sin_costo` + `inmediata`/`pendiente`), and "Mis Pases / Reservas" panel using `ConfirmModal` and `FeedbackBanner`
- [X] T015 [P] [US2] Connect `<BookingSection entityType="lugar" entityId={id} entityName={place?.nombre} />` in `src/pages/PlaceDetailPage/PlaceDetailPage.jsx`
- [X] T016 [P] [US2] Connect `<BookingSection />` in `src/pages/RestaurantDetailPage/RestaurantDetailPage.jsx` (`restaurante`), `src/pages/AccommodationDetailPage/AccommodationDetailPage.jsx` (`alojamiento`), `src/pages/EventDetailPage/EventDetailPage.jsx` (`evento`), and `src/pages/ExperienceDetailPage/ExperienceDetailPage.jsx` (`experiencia`)

**Checkpoint**: User Story 2 is fully operational on Observatorio Collowara and ready for any other entity enabled by an admin.

---

## Phase 5: User Story 3 - Panel de Administración de Reservas Multi-Entidad (Priority: P1)

**Goal**: Provide a private admin section (`/admin/reservas`) to enable/disable reservations across all 5 catalog types, choose adaptive booking profiles, pricing/confirmation modes, manage highlights/gallery/packages/slots, and view/approve/cancel customer bookings.

**Independent Test**: Sign in as admin, open `/admin/reservas`, edit a Collowara package price, then enable a Restaurant with profile `mesa_comida` (`sin_costo`, `pendiente`) + time slots, verify it works on the public restaurant page, and approve/cancel the resulting reservation from the admin panel.

- [X] T017 [P] [US3] Add admin functions to `src/services/bookings.service.js` (`getAdminCatalogEntities`, `upsertBookingConfig`, `saveBookingPackage`, `deleteBookingPackage`, `saveBookingSlot`, `deleteBookingSlot`, `getAdminBookings`, `updateBookingStatus`)
- [X] T018 [US3] Implement `src/pages/admin/BookingsAdminPage/BookingsAdminPage.jsx`, `src/pages/admin/BookingsAdminPage/BookingsAdminPage.css`, and `src/pages/admin/BookingsAdminPage/index.js` with 2 tabs: (1) Configuración por Entidad (catalog type filter, entity selector, active toggle, profile/pricing/confirmation selectors, logistics/discount/highlights/gallery editor, packages CRUD, slots CRUD) and (2) Reservas Recibidas (filters by entity type, entity, date, status + approve/cancel actions via `ConfirmModal`)
- [X] T019 [US3] Add "Reservas" menu item in `src/components/layout/AdminSidebar/AdminSidebar.jsx` and register `/admin/reservas` inside `<AdminRoute>` in `src/App.jsx`

**Checkpoint**: Admins can fully configure reservations across any place, restaurant, accommodation, event, or experience.

---

## Phase 6: User Story 4 - Directorio de Guías Turísticos Certificados y Panel Admin de Guías (Priority: P2)

**Goal**: Replace the "Otros" menu/category with "Guías Turísticos" (`/guias`) featuring SERNATUR/Starlight header, specialty filters, search by name/sector/language, itinerary + direct booking request modal, local guide application modal, and admin management (`/admin/guias`).

**Independent Test**: Verify "Otros" is replaced by "Guías Turísticos" in Explorer/Header, open `/guias`, filter by specialty and search by language, open itinerary modal and submit a booking request, submit "+ Postular como Guía Local", and manage guides/requests in `/admin/guias`.

- [X] T020 [P] [US4] Implement `src/services/guides.service.js` (`getGuides`, `createGuideApplication`, `createGuideBookingRequest`, `getUserGuideRequests`, `updateGuide`, `deleteGuide`, `getAdminGuideRequests`, `updateGuideRequestStatus`)
- [X] T021 [US4] Implement `src/hooks/useGuides.js` handling specialty filter, search query (name/sectors/languages), itinerary detail modal, direct booking request submission, and local guide application submission
- [X] T022 [US4] Implement `src/pages/GuidesPage/GuidesPage.jsx`, `src/pages/GuidesPage/GuidesPage.css`, and `src/pages/GuidesPage/index.js` styled in native CSS3 (`rem` base `10px`), with 4 seeded guides, specialty filter chips, search bar, itinerary + booking modal, and "+ Postular como Guía Local" modal
- [X] T023 [P] [US4] Implement `src/pages/admin/GuidesAdminPage/GuidesAdminPage.jsx`, `src/pages/admin/GuidesAdminPage/GuidesAdminPage.css`, and `src/pages/admin/GuidesAdminPage/index.js` with Guides CRUD (verify/activate/deactivate/edit/delete) and Guide Booking Requests management tab
- [X] T024 [US4] Update `src/hooks/useExplorerData.js` replacing `otros` with `{ id: 'guias', label: 'Guías Turísticos' }` routing to `/guias`, add "Guías" link in `src/components/layout/Header/Header.jsx`, add "Guías" item in `src/components/layout/AdminSidebar/AdminSidebar.jsx`, and register `/guias` and `/admin/guias` in `src/App.jsx`

**Checkpoint**: User Story 4 is independently functional on `/guias` and manageable via `/admin/guias`.

---

## Phase 7: User Story 5 - Mejoras a "Mi Perfil" y Perfiles Públicos de Astrofotógrafos (Priority: P2)

**Goal**: Preserve 100% of existing `ProfilePage` features while adding "+ Subir Captura", photography metrics, editable Gear Bag, observation badges, personal capture portfolio, active bookings/passes summary, and public photographer profiles (`/fotografo/:handleOrId`) with persistent Follow/Unfollow.

**Independent Test**: Open `/perfil` signed in, confirm all existing sections work, add/remove an item in Gear Bag, upload a photo from profile and verify it appears in portfolio, review active bookings/passes, and click another photographer in `/fotografia` to open `/fotografo/:handleOrId` and toggle Follow.

- [X] T025 [P] [US5] Implement `src/services/photographers.service.js` (`getPhotographerProfile`, `toggleFollowPhotographer`, `updateUserGearBag`)
- [X] T026 [US5] Extend `src/hooks/useProfileStats.js` to load user's astrophotography portfolio, photography metrics (captures, likes, unique spots), Gear Bag CRUD (`handleAddGear`, `handleRemoveGear`), active place bookings (`getUserBookings`), and guide booking requests (`getUserGuideRequests`), plus support editing `handle`, `rol_fotografico`, and `certificacion` while keeping all existing profile state/actions intact
- [X] T027 [US5] Enhance `src/pages/ProfilePage/ProfilePage.jsx` and `src/pages/ProfilePage/ProfilePage.css` preserving all existing sections and adding "+ Subir Captura" (`AstroPhotoUploadModal`), photography stats bar, editable Gear Bag card, observation badges, personal capture portfolio grid, and "Mis Reservas y Pases" section
- [X] T028 [P] [US5] Implement `src/hooks/usePhotographerProfile.js`, `src/pages/PhotographerProfilePage/PhotographerProfilePage.jsx`, `src/pages/PhotographerProfilePage/PhotographerProfilePage.css`, and `src/pages/PhotographerProfilePage/index.js` with banner header, stats, Gear Bag, badges, portfolio grid, EXIF modal, and persistent Follow/Unfollow toggle
- [X] T029 [US5] Register `/fotografo/:handleOrId` route in `src/App.jsx`

**Checkpoint**: User Story 5 is complete with zero regressions on existing profile features.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verify full integration, security/constitution compliance, responsive polish, and production build.

- [X] T030 [P] Audit all new components and pages for Constitution compliance (zero `innerHTML`, zero `alert`/`confirm`/`prompt`, `event.preventDefault()` on all submit/click handlers, 100% Spanish UI, `rem` units, official palette, no new npm dependencies)
- [X] T031 Run `npm run build` to verify zero syntax, import, or CSS bundling errors across all new and updated modules
- [X] T032 Execute validation checklist from `specs/006-astrotourism-bookings-guides/quickstart.md` (and apply Supabase migration if local Supabase instance is running)

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup)** → No dependencies; start immediately (`T001`, `T002` in parallel).
2. **Phase 2 (Foundational)** → Depends on Phase 1; **BLOCKS** all user stories (`T003` first, then `T004`, `T005`, `T006` in parallel).
3. **Phase 3 (US1 - Galería Astrofotos)**, **Phase 4 (US2 - Reservas en Fichas)**, **Phase 6 (US4 - Guías)** → Can start immediately after Phase 2.
4. **Phase 5 (US3 - Admin Reservas)** → Depends on `T012` (bookings service base) from Phase 4.
5. **Phase 7 (US5 - Perfil Mejorado & Perfil Público)** → Reuses `AstroPhotoUploadModal` (T008), `astrophotos.service.js` (T007), `bookings.service.js` (T012), and `guides.service.js` (T020).
6. **Phase 8 (Polish)** → Depends on all user stories being complete.

### Parallel Opportunities

- **Phase 1**: `T001` and `T002` in parallel.
- **Phase 2**: `T004`, `T005`, `T006` in parallel after `T003`.
- **US1**: `T007` (service) and `T008` (upload modal) in parallel.
- **US2**: `T015` and `T016` (detail page integrations) in parallel once `T014` (`BookingSection`) is ready.
- **US4**: `T020` (service) and `T023` (admin page structure) can overlap; `T022` and `T023` in parallel once `T020`/`T021` are done.
- **US5**: `T025` (photographers service) and `T028` (public profile page) can progress alongside `T026`/`T027`.

---

## Implementation Strategy

1. **MVP First**: Complete Phases 1–4 (`Setup` + `Foundational` + `US1 Galería Astrofotos` + `US2 Reservas Collowara`) to deliver immediate visible value on the two highest-priority public experiences.
2. **Admin Control**: Complete Phase 5 (`US3 Admin Reservas`) so Collowara and any other catalog entity (restaurants, accommodations, events, experiences) can be configured live.
3. **Community Expansion**: Complete Phase 6 (`US4 Guías Turísticos`) and Phase 7 (`US5 Perfil Mejorado + Perfil Público`).
4. **Final Verification**: Run Phase 8 build and quickstart audit.
