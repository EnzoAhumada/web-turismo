---
description: "Task list for feature 002-professional-ui-real-data"
---

# Tasks: Rediseño Visual Profesional, Navegación Adaptativa y Catálogo Real de Andacollo

**Input**: Design documents from `/specs/002-professional-ui-real-data/`  
**Prerequisites**: [plan.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/plan.md), [spec.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/spec.md), [research.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/research.md), [data-model.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/data-model.md), [ui-design-system.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/contracts/ui-design-system.md), [quickstart.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/quickstart.md)

**Tests**: Validation scenarios are defined in `quickstart.md` and executed via database reset, production build, and visual/responsive checks.

**Organization**: Tasks are grouped by user story (`[US1]`, `[US2]`, `[US3]`) to enable independent implementation and testing of each increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Exact file paths are included in all task descriptions

---

## Phase 1: Setup (Shared Brand & Visual Assets)

**Purpose**: Prepare the official brand logo, updated favicon, local fallback illustration, and design tokens in CSS.

- [X] T001 Copy the official brand logo from `design/ChatGPT Image Jun 2, 2026, 03_42_10 PM.png` to `public/logo-thakigo.png`
- [X] T002 [P] Update `public/favicon.svg` and `index.html` to reference the new ThakiGo mountain-path-sun-stars identity and Spanish title `"ThakiGo — Turismo Andacollo"`
- [X] T003 [P] Create local fallback image `public/fallback-andacollo.svg` for resilient offline/slow-network photography rendering
- [X] T004 Update design tokens and layout variables (`--bottom-nav-h`, category palette tokens, elevation shadows, and dark/light surfaces) in `src/styles/variables.css` and `src/styles/global.css`

---

## Phase 2: Foundational (Core Design System & Database Schema Evolution)

**Purpose**: Build the zero-dependency professional vector icon library (`<Icon />`), `<BrandLogo />`, `<SmartImage />`, and database migration required by all user stories.

**⚠️ CRITICAL**: No user story phase can begin until this phase is complete.

- [X] T005 [P] Create professional vector icon library component (Lucide/Tabler style, `strokeWidth={1.85}`, zero emojis, legacy alias fallback) in `src/components/ui/Icon/Icon.jsx`, `src/components/ui/Icon/Icon.css`, and `src/components/ui/Icon/index.js`
- [X] T006 [P] Create reusable official brand logo component (`variant="dark|light"`, `size="sm|md|lg"`, `stacked={boolean}`) in `src/components/ui/BrandLogo/BrandLogo.jsx`, `src/components/ui/BrandLogo/BrandLogo.css`, and `src/components/ui/BrandLogo/index.js`
- [X] T007 [P] Create resilient image component with fixed aspect ratio and automatic fallback to `/fallback-andacollo.svg` in `src/components/ui/SmartImage/SmartImage.jsx`, `src/components/ui/SmartImage/SmartImage.css`, and `src/components/ui/SmartImage/index.js`
- [X] T008 Create incremental SQL migration `supabase/migrations/20261120000002_professional_ui_and_real_data.sql` expanding `public.categorias` (`slug` CHECK for `'cultura'`, `'gastronomia'`, `'astronomia'`, `'naturaleza'`, `'religion'`, `'mineria'`, `'trekking'`, `'fotografia'`, `'eventos'`, `'otros'`), `public.lugares` (`subtitulo`, `resenas_count`, `tiempo_estimado`, `telefono`, `es_gratis`, `es_familiar`, `abierto_ahora`), `public.restaurantes` (`especialidad`, `resenas_count`, `telefono`, `abierto_ahora`), `public.alojamientos` (`tipo`, `servicios`, `resenas_count`, `telefono`), `public.experiencias` (`resenas_count`, `icono`), and creating `public.estadisticas_municipales` with RLS public read and admin write policies

**Checkpoint**: Foundation ready — `<Icon />`, `<BrandLogo />`, `<SmartImage />`, and expanded database schema are in place.

---

## Phase 3: User Story 1 - Experiencia Visual Profesional, Nuevo Logo e Iconografía Vectorial (Priority: P1) 🎯 MVP

**Goal**: Replace 100% of generic AI styles and system emojis with the official `<BrandLogo />` and professional vector `<Icon />` system across shared UI components and all 14 views modeled in `/design`.

**Independent Test**: Navigate through Landing/Login, Inicio, Explorar, Astronomía, Recomendaciones, Planificador, Eventos, Experiencias, Gamificación, Perfil, and Dashboard Municipal verifying that `<BrandLogo />` is rendered in brand headers/login/sidebar, 0 emojis exist in UI controls/cards/badges, and each view matches its corresponding `/design` mockup aesthetic.

### Implementation for User Story 1

- [X] T009 [P] [US1] Refactor `CategoryIcon` to support all 10 categories from `design/3 explorador turistico.jpg` (`Cultura`, `Gastronomía`, `Astronomía`, `Naturaleza`, `Religión`, `Minería`, `Trekking`, `Fotografía`, `Eventos`, `Otros`) with vector icons and distinctive circular palettes in `src/components/ui/CategoryIcon/CategoryIcon.jsx` and `src/components/ui/CategoryIcon/CategoryIcon.css`
- [X] T010 [P] [US1] Upgrade shared UI components (`SearchBar`, `FilterTabs`, `EmptyState`, `FeedbackBanner`, `StarRating`, and `PageHero`) to use `<Icon />`, refined typography, and review-count formatting in `src/components/ui/SearchBar/SearchBar.jsx`, `src/components/ui/FilterTabs/FilterTabs.jsx`, `src/components/ui/EmptyState/EmptyState.jsx`, `src/components/ui/FeedbackBanner/FeedbackBanner.jsx`, `src/components/ui/StarRating/StarRating.jsx`, and `src/components/ui/PageHero/PageHero.jsx`
- [X] T011 [P] [US1] Redesign `LandingPage` to match `design/14 login.jpg` (nighttime illuminated Basílica background, stacked `<BrandLogo size="lg" />`, tagline `"Explora tu próximo camino"`, headline `"Andacollo te encanta"` with vector heart, subtitle `"Tierra minera, religiosa y astronómica."`, primary `"Comenzar"` button toggling auth modal/card, and outlined `"Explorar sin cuenta"` button) in `src/pages/LandingPage/LandingPage.jsx` and `src/pages/LandingPage/LandingPage.css`
- [X] T012 [P] [US1] Redesign `HomePage` to match `design/1 inicio inteligente.jpg` (clean light header with `"¡Hola, {Nombre}!"` + vector bag/notification button, pill `<SearchBar />`, full-bleed hero card for featured sanctuary with rating and review count, `"Recomendado para ti"` grid, and vector quick-access cards) in `src/pages/HomePage/HomePage.jsx` and `src/pages/HomePage/HomePage.css`
- [X] T013 [P] [US1] Redesign `AstronomyPage` to match `design/8 turismo astronomico.jpg` (deep `Navy` dark theme, 3-column `"Condiciones actuales"` card with fine vector icons for `Cielo Despejado`, `Visibilidad Excelente`, `Luna Creciente 35%`, `"Mejores horarios"` row `20:00 – 02:00`, and horizontal dark recommended spot cards) in `src/pages/AstronomyPage/AstronomyPage.jsx` and `src/pages/AstronomyPage/AstronomyPage.css`
- [X] T014 [P] [US1] Redesign `RecommendationsPage` and `TripPlannerPage` to match `design/5 recomendaciones de ia.jpg` and `design/6 planificador de viajes.jpg` (night sky highlight banner with orange pill CTA, circular vector interest selectors, duration/budget pills, and vector timeline stops) in `src/pages/RecommendationsPage/RecommendationsPage.jsx`, `src/pages/RecommendationsPage/RecommendationsPage.css`, `src/pages/TripPlannerPage/TripPlannerPage.jsx`, and `src/pages/TripPlannerPage/TripPlannerPage.css`
- [X] T015 [P] [US1] Redesign `GamificationPage` and `ProfilePage` to match `design/10 gamificacion.jpg` and `design/12 perfil del usuario.jpg` (dark `Navy` header/theme, avatar with gold XP progress bar, illustrated vector medal badges for `Explorador`, `Ruta Minera`, `Cazador de Estrellas`, stats cards, and interactive profile rows for `Mis logros`, `Rutas completadas`, `Lugares visitados`, `Configuración`, `Idioma: Español`, and `Modo offline` toggle) in `src/pages/GamificationPage/GamificationPage.jsx`, `src/pages/GamificationPage/GamificationPage.css`, `src/pages/ProfilePage/ProfilePage.jsx`, and `src/pages/ProfilePage/ProfilePage.css`
- [X] T016 [US1] Update `AdminSidebar` and redesign `DashboardPage` to match `design/13 dashboard municipal.jpg` (`<BrandLogo />` in dark sidebar, `"Resumen turístico – Andacollo"` header, KPI cards for `Visitantes hoy`, ranked `Lugares más visitados`, `Tiempo promedio de visita` + `4.8 Excelentes reseñas`, SVG line chart for `"Flujo de visitantes"`, SVG donut chart for `"Procedencia de visitantes"`, progress bars for `"Intereses principales"`, and quick CRUD access) in `src/components/layout/AdminSidebar/AdminSidebar.jsx`, `src/pages/admin/DashboardPage/DashboardPage.jsx`, and `src/pages/admin/DashboardPage/DashboardPage.css`

**Checkpoint**: User Story 1 complete — official logo, vector icons, and mockup-faithful visual design are active across the platform.

---

## Phase 4: User Story 2 - Navegación Adaptativa Web y Móvil con Barra Inferior al Estilo Airbnb (Priority: P1)

**Goal**: Provide a mobile-first bottom navigation bar (`<BottomNav />` with `Inicio`, `Explorar`, `Mapa`, `Favoritos`, `Perfil`), Airbnb-inspired desktop header and category filter strips, and adaptive mobile bottom-sheet / desktop multi-column layouts for Explorer, Map, Place Details, Favorites, Events, Experiences, Restaurants, and Accommodations.

**Independent Test**: Test at mobile (`375x812`) and desktop (`1280x800`) viewports verifying that `<BottomNav />` stays fixed at the bottom on mobile with 5 vector tabs and safe bottom padding, while desktop displays the full top header, horizontal category strip, and multi-column cards.

### Implementation for User Story 2

- [X] T017 [P] [US2] Create fixed mobile bottom navigation bar component `<BottomNav />` (`Inicio`, `Explorar`, `Mapa`, `Favoritos`, `Perfil` with light/dark theme awareness and active orange/gold state) in `src/components/layout/BottomNav/BottomNav.jsx`, `src/components/layout/BottomNav/BottomNav.css`, and `src/components/layout/BottomNav/index.js`
- [X] T018 [US2] Refactor `Header` and `Footer` to use `<BrandLogo />`, Airbnb-inspired pill navigation and user menu on desktop, compact contextual header on mobile, and integrate `<BottomNav />` across traveler layouts in `src/components/layout/Header/Header.jsx`, `src/components/layout/Header/Header.css`, `src/components/layout/Footer/Footer.jsx`, and `src/components/layout/Footer/Footer.css`
- [X] T019 [P] [US2] Upgrade `Card` component to support Airbnb-inspired vertical grid cards (fixed aspect-ratio `<SmartImage />`, subtle hover elevation, star rating with review count, distance badge) and horizontal list cards (for Favorites, Events, and Experiences) in `src/components/ui/Card/Card.jsx` and `src/components/ui/Card/Card.css`
- [X] T020 [US2] Redesign `ExplorerPage` and `useExplorerData` to match `design/3 explorador turistico.jpg` (10 circular category icons grid, `"Filtros populares"` chips for `Cerca de mí`, `Gratis`, `Familiar`, `Abierto ahora`, content-type tabs, and responsive `"Lugares destacados"` cards) in `src/pages/ExplorerPage/ExplorerPage.jsx`, `src/pages/ExplorerPage/ExplorerPage.css`, and `src/hooks/useExplorerData.js`
- [X] T021 [P] [US2] Redesign `MapPage` to match `design/2 mapa interactivo.jpg` (floating top search bar with clear button, `Lugares`, `Restaurantes`, `Hospedajes`, `Rutas` filter pills, stylized interactive map canvas of Andacollo with color-coded vector pins and central user location dot, floating compass/center buttons, and floating bottom preview card above `<BottomNav />`) in `src/pages/MapPage/MapPage.jsx`, `src/pages/MapPage/MapPage.css`, and `src/hooks/useMapExplorer.js`
- [X] T022 [P] [US2] Redesign `DetailLayout` and detail pages (`PlaceDetailPage`, `RestaurantDetailPage`, `AccommodationDetailPage`, `EventDetailPage`, `ExperienceDetailPage`) to match `design/4 perfil del lugar.jpg` (full-width hero photo with floating back & badge buttons, rounded `2.4rem` bottom-sheet container, green `"Abierto ahora"` + schedule row, 4 circular vector action buttons `Cómo llegar`, `Llamar`, `Guardar`, `Compartir`, expandable description, and vector `"Información"` rows for `Dirección`, `Tiempo estimado`, `Teléfono`) in `src/components/layout/DetailLayout/DetailLayout.jsx`, `src/components/layout/DetailLayout/DetailLayout.css`, `src/pages/PlaceDetailPage/PlaceDetailPage.jsx`, `src/pages/RestaurantDetailPage/RestaurantDetailPage.jsx`, `src/pages/AccommodationDetailPage/AccommodationDetailPage.jsx`, `src/pages/EventDetailPage/EventDetailPage.jsx`, and `src/pages/ExperienceDetailPage/ExperienceDetailPage.jsx`
- [X] T023 [P] [US2] Redesign `FavoritesPage`, `EventsPage`, `ExperiencesPage`, `RestaurantsPage`, and `AccommodationsPage` to match `design/7 sistema de favoritos.jpg`, `design/9 eventos y festividades.jpg`, and `design/11 experiencias locales.jpg` (horizontal thumbnail cards on mobile, multi-column grid on desktop, bookmark toggle for `"Mis eventos"`, and CLP price/rating badges) in `src/pages/FavoritesPage/FavoritesPage.jsx`, `src/pages/FavoritesPage/FavoritesPage.css`, `src/pages/EventsPage/EventsPage.jsx`, `src/pages/EventsPage/EventsPage.css`, `src/pages/ExperiencesPage/ExperiencesPage.jsx`, `src/pages/ExperiencesPage/ExperiencesPage.css`, `src/pages/RestaurantsPage/RestaurantsPage.jsx`, and `src/pages/AccommodationsPage/AccommodationsPage.jsx`

**Checkpoint**: User Story 2 complete — responsive mobile bottom navigation and Airbnb/mockup-aligned layouts work seamlessly on mobile and desktop.

---

## Phase 5: User Story 3 - Catálogo Completo con Datos Reales y Fotografías de Andacollo (Mínimo 5 por Categoría) (Priority: P2)

**Goal**: Populate the database and service/hook layer with verified, real Andacollo tourism data and photography ensuring at least 5 to 12 real records per category and module, and connect all new attributes (`subtitulo`, `resenas_count`, `tiempo_estimado`, `telefono`, `es_gratis`, `es_familiar`, `abierto_ahora`, and `estadisticas_municipales`) to the frontend services and hooks.

**Independent Test**: Run `npm run db:reset` and verify through the UI and database that every single option (`Lugares`, `Restaurantes`, `Alojamientos`, `Eventos`, `Experiencias`, `Puntos Astronómicos`, `Condiciones/Horarios/Recursos Astronómicos`, `Destacados`, `Insignias`, `Desafíos`, `Paradas de Ruta`, and `Dashboard Municipal`) displays at least 5 real Andacollo records with working photographs and zero emojis.

### Implementation for User Story 3

- [X] T024 [US3] Populate `supabase/seed.sql` with idempotent real Andacollo data (`>= 5` records per option, vector icon keys instead of emojis, verified photographs, and real coordinates): 10 `categorias`, 12 `lugares` (including 5 astronomical observation points), 6 `restaurantes`, 6 `alojamientos`, 6 `eventos`, 6 `experiencias`, 5 `astronomia_condiciones`, 5 `astronomia_horarios`, 6 `astronomia_recursos`, 5 `destacados_dia`, 6 `insignias`, 5 `desafios`, 5 community `profiles`, 10 `rutas_paradas`, and initial `estadisticas_municipales` in `supabase/seed.sql`
- [X] T025 [P] [US3] Update data services (`places.service.js`, `restaurants.service.js`, `accommodations.service.js`, `events.service.js`, `experiences.service.js`, `astronomy.service.js`, `map.service.js`, `gamification.service.js`, `planner.service.js`, `recommendations.service.js`, `favorites.service.js`, and `admin.service.js`) to query and return the new schema columns (`subtitulo`, `resenas_count`, `tiempo_estimado`, `telefono`, popular filter flags, and `estadisticas_municipales`) in `src/services/`
- [X] T026 [US3] Update state hooks (`useHomeData.js`, `useEvents.js`, `useExperiences.js`, `useRestaurants.js`, `useAccommodations.js`, `useAstronomy.js`, `useGamification.js`, `useTripPlanner.js`, `useRecommendations.js`, `useFavorites.js`, `useProfileStats.js`, and `useAdminDashboard.js`) to remove all emoji defaults, support event bookmarking in `"Mis eventos"`, and map real Andacollo metrics to the views in `src/hooks/`
- [X] T027 [US3] Update admin CRUD pages (`PlacesAdminPage`, `RestaurantsAdminPage`, `AccommodationsAdminPage`, `EventsAdminPage`) so administrators can create and edit the enriched Andacollo fields (`subtitulo`, `tiempo_estimado`, `telefono`, `especialidad`, `tipo`) with vector icons in `src/pages/admin/PlacesAdminPage/PlacesAdminPage.jsx`, `src/pages/admin/RestaurantsAdminPage/RestaurantsAdminPage.jsx`, `src/pages/admin/AccommodationsAdminPage/AccommodationsAdminPage.jsx`, and `src/pages/admin/EventsAdminPage/EventsAdminPage.jsx`

**Checkpoint**: User Story 3 complete — every category and module in the application is backed by at least 5 real Andacollo records with verified photos and municipal analytics.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification of database reset, zero-emoji audit, responsive mobile/desktop layout check, production build, and documentation update.

- [X] T028 [P] Audit all `src/` files to confirm 0 remaining system emojis in UI components/hooks/services and update `README.md` with the new design system (`BrandLogo`, `Icon`, `BottomNav`) and expanded real Andacollo seed catalog details
- [X] T029 Execute `npm run db:reset` and `npm run build` to verify clean database migration/seeding and zero compilation errors per `specs/002-professional-ui-real-data/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS** all user stories (`<Icon />`, `<BrandLogo />`, `<SmartImage />`, and migration `20261120000002` must exist first).
- **Phase 3 (User Story 1 - P1 🎯 MVP)**: Depends on Phase 2. Delivers the new brand identity, vector icon system, and visual redesign of core views.
- **Phase 4 (User Story 2 - P1)**: Depends on Phase 2 (and integrates smoothly with Phase 3). Delivers the Airbnb-inspired mobile `<BottomNav />`, desktop navigation, and adaptive catalog/map/detail views.
- **Phase 5 (User Story 3 - P2)**: Depends on Phase 2 migration (`T008`). Populates and connects the full real Andacollo dataset (`>= 5` items per option) and municipal analytics.
- **Phase 6 (Polish)**: Depends on Phases 3, 4, and 5.

### User Story Dependencies

- **User Story 1 (P1)**: Independent once Phase 2 completes.
- **User Story 2 (P1)**: Independent once Phase 2 completes; shares layout shell with US1.
- **User Story 3 (P2)**: Independent once Phase 2 migration (`T008`) completes; enriches all US1 and US2 views with real Andacollo data.

### Parallel Opportunities

- In **Phase 1**: `T002` and `T003` can run in parallel with `T001`.
- In **Phase 2**: `T005` (`<Icon />`), `T006` (`<BrandLogo />`), and `T007` (`<SmartImage />`) can be developed in parallel across separate folders.
- In **Phase 3 (US1)**: `T009`, `T010`, `T011`, `T012`, `T013`, `T014`, and `T015` operate on independent page modules and can run in parallel.
- In **Phase 4 (US2)**: `T017` (`<BottomNav />`), `T019` (`<Card />`), `T021` (`MapPage`), `T022` (`DetailLayout`), and `T023` (Catalog pages) can run in parallel.
- In **Phase 5 (US3)**: `T024` (`seed.sql`) and `T025` (`src/services/*`) can be prepared in parallel before `T026` (`src/hooks/*`).

---

## Parallel Example: User Story 1 & User Story 2

```bash
# Foundational design system components in parallel:
Task T005: "Create vector icon library in src/components/ui/Icon/Icon.jsx"
Task T006: "Create official brand logo component in src/components/ui/BrandLogo/BrandLogo.jsx"
Task T007: "Create SmartImage component with fallback in src/components/ui/SmartImage/SmartImage.jsx"

# Page visual redesigns in parallel (US1):
Task T011: "Redesign LandingPage matching design/14 login.jpg in src/pages/LandingPage/LandingPage.jsx"
Task T012: "Redesign HomePage matching design/1 inicio inteligente.jpg in src/pages/HomePage/HomePage.jsx"
Task T013: "Redesign AstronomyPage matching design/8 turismo astronomico.jpg in src/pages/AstronomyPage/AstronomyPage.jsx"
Task T015: "Redesign GamificationPage and ProfilePage matching design/10 & 12 in src/pages/GamificationPage/ and src/pages/ProfilePage/"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 - Core Visual & Adaptive UX)

1. Complete **Phase 1: Setup** (`T001`–`T004`) and **Phase 2: Foundational** (`T005`–`T008`).
2. Complete **Phase 3: User Story 1** (`T009`–`T016`) to activate the new logo, vector iconography, and mockup-faithful page aesthetics.
3. Complete **Phase 4: User Story 2** (`T017`–`T023`) to enable the Airbnb-style mobile `<BottomNav />` and adaptive desktop/mobile layouts.

### Full Delivery with Real Andacollo Data (User Story 3 & Polish)

4. Complete **Phase 5: User Story 3** (`T024`–`T027`) to seed and wire at least 5–12 real Andacollo records per category and municipal dashboard analytics.
5. Complete **Phase 6: Polish** (`T028`–`T029`) running `npm run db:reset` and `npm run build` to verify end-to-end readiness.
