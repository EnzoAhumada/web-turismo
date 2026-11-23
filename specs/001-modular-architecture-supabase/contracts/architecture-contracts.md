# Contratos de Arquitectura: Servicios, Hooks y Componentes Reutilizables

**Feature**: `001-modular-architecture-supabase`
**Date**: 2026-11-20

## 1. Contrato de la Capa de Servicios (`src/services/`)

Toda interacción con Supabase MUST ejecutarse mediante funciones asíncronas en `src/services/`. Cada función devuelve datos normalizados o lanza un error con mensaje en español apto para mostrarse en el DOM.

| Servicio | Archivo | Operaciones Expuestas | Tablas Consultadas |
| :--- | :--- | :--- | :--- |
| **Auth Service** | `src/services/auth.service.js` | `getSession()`, `onAuthStateChange(cb)`, `signIn(email, password)`, `signUp({ email, password, nombre, apellido })`, `signOut()`, `getProfile(userId)`, `updateProfile(userId, updates)` | `auth.users`, `profiles` |
| **Categories Service** | `src/services/categories.service.js` | `getCategories({ onlyHome })`, `getCategoryBySlug(slug)` | `categorias` |
| **Places Service** | `src/services/places.service.js` | `getPlaces({ search, categorySlug, onlyAstronomic, limit, includeInactive })`, `getPlaceById(id)`, `getNearbyPlaces(excludeId, limit)`, `savePlace(payload, id)`, `deletePlace(id)` | `lugares`, `categorias` |
| **Restaurants Service** | `src/services/restaurants.service.js` | `getRestaurants({ search, priceRange, limit, includeInactive })`, `getRestaurantById(id)`, `getOtherRestaurants(excludeId, limit)`, `saveRestaurant(payload, id)`, `deleteRestaurant(id)` | `restaurantes` |
| **Accommodations Service** | `src/services/accommodations.service.js` | `getAccommodations({ search, limit, includeInactive })`, `getAccommodationById(id)`, `getOtherAccommodations(excludeId, limit)`, `saveAccommodation(payload, id)`, `deleteAccommodation(id)` | `alojamientos` |
| **Events Service** | `src/services/events.service.js` | `getEvents({ search, onlyAstronomic, limit, includeInactive })`, `getEventById(id)`, `getOtherEvents(excludeId, limit)`, `saveEvent(payload, id)`, `deleteEvent(id)` | `eventos` |
| **Experiences Service** | `src/services/experiences.service.js` | `getExperiences({ search, category, limit })`, `getExperienceById(id)`, `getOtherExperiences(excludeId, limit)` | `experiencias` |
| **Favorites Service** | `src/services/favorites.service.js` | `getUserFavoritesByType(userId, tipo)`, `isItemFavorite(userId, tipo, itemId)`, `toggleFavorite(userId, tipo, itemId)`, `removeFavoriteById(favId)`, `getUserFavoritesCount(userId)` | `favoritos`, `lugares`, `restaurantes`, `alojamientos`, `eventos`, `experiencias` |
| **Astronomy Service** | `src/services/astronomy.service.js` | `getAstronomyPageData()` (retorna condiciones, horarios, spots astronómicos, eventos astronómicos, consejos y equipamiento) | `astronomia_condiciones`, `astronomia_horarios`, `astronomia_recursos`, `lugares`, `eventos` |
| **Map Service** | `src/services/map.service.js` | `getMapPins({ typeFilter, search })` (unifica pines de lugares, restaurantes y alojamientos con sus coordenadas y rutas de detalle) | `lugares`, `restaurantes`, `alojamientos` |
| **Gamification Service** | `src/services/gamification.service.js` | `getGamificationData(userId)` (retorna perfil/nivel, insignias con estado desbloqueado, desafíos con progreso y leaderboard de `profiles`) | `profiles`, `insignias`, `usuario_insignias`, `desafios`, `usuario_desafios` |
| **Planner Service** | `src/services/planner.service.js` | `getPlannerOptions()`, `generateItinerary({ duration, interests, budget })` | `categorias`, `rutas_paradas` |
| **Recommendations Service** | `src/services/recommendations.service.js` | `getHomeHighlights()`, `getRecommendationsPageData()` | `destacados_dia`, `lugares`, `restaurantes`, `experiencias`, `eventos` |
| **Admin Service** | `src/services/admin.service.js` | `getDashboardStats()`, `getCrudRecords(table, orderBy)`, `saveCrudRecord(table, payload, id)`, `deleteCrudRecord(table, id)` | `lugares`, `restaurantes`, `alojamientos`, `eventos`, `profiles`, `favoritos` |

---

## 2. Contrato de la Capa de Hooks (`src/hooks/`)

Los componentes de página consumen exclusivamente hooks que encapsulan llamadas a `src/services/`:

- `useAsyncData(fetcherFn, deps)`: Hook base reutilizable para manejo estandarizado de `{ data, loading, error, reload }`.
- `useHomeData()`: Gestiona datos de `HomePage` (lugar destacado, recomendados, categorías rápidas, banner astronómico).
- `useExplorerData()`: Gestiona pestañas, búsqueda por URL (`useSearchParams`) y carga dinámica de `ExplorerPage`.
- `useEntityDetail(entityType, id)`: Hook unificado para las 5 páginas de detalle (`lugar`, `restaurante`, `alojamiento`, `evento`, `experiencia`), gestionando carga del ítem, elementos relacionados, estado de favorito (`saved`, `toggleFavorite`) y expansión de descripción.
- `useRestaurants()`, `useAccommodations()`, `useEvents()`, `useExperiences()`: Hooks de listado y filtrado para cada catálogo público.
- `useAstronomy()`, `useMapExplorer()`, `useGamification()`, `useTripPlanner()`, `useRecommendations()`, `useFavorites()`, `useProfileStats()`: Hooks específicos para los módulos interactivos.
- `useAdminDashboard()`, `useAdminCrud(tableConfig)`: Hooks para el panel administrativo, incluyendo estado de modal de creación/edición, modal de confirmación de borrado (sin `window.confirm`) y mensajes de feedback en el DOM.

---

## 3. Contrato de Componentes Reutilizables (`src/components/`)

| Componente | Ubicación | Props Principales | Uso Compartido En |
| :--- | :--- | :--- | :--- |
| **`PageHero`** | `src/components/ui/PageHero/` | `eyebrow`, `title`, `subtitle`, `bgClass`, `bgImage`, `children` (buscador o acciones) | `HomePage`, `ExplorerPage`, `RestaurantsPage`, `AccommodationsPage`, `ExperiencesPage`, `AstronomyPage`, `EventsPage` |
| **`FilterTabs`** | `src/components/ui/FilterTabs/` | `tabs` (`[{ id, label, icon }]`), `activeTab`, `onChange`, `variant` (`tabs` \| `chips` \| `explorer`) | `ExplorerPage`, `EventsPage`, `ExperiencesPage`, `FavoritesPage`, `RestaurantsPage`, `MapPage` |
| **`LoadingState`** | `src/components/ui/LoadingState/` | `fullPage`, `message` (por defecto `"Cargando información..."`) | Todas las páginas y rutas protegidas |
| **`EmptyState`** | `src/components/ui/EmptyState/` | `icon`, `title`, `description`, `actionLabel`, `actionTo`, `onAction` | `ExplorerPage`, `RestaurantsPage`, `AccommodationsPage`, `EventsPage`, `ExperiencesPage`, `FavoritesPage`, `MapPage` |
| **`FeedbackBanner`** | `src/components/ui/FeedbackBanner/` | `type` (`error` \| `success` \| `info`), `message`, `onDismiss` | `LandingPage`, `ProfilePage`, `AdminCrudView`, vistas con manejo de errores de red |
| **`ConfirmModal`** | `src/components/ui/ConfirmModal/` | `isOpen`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`, `loading` | `PlacesAdminPage`, `RestaurantsAdminPage`, `AccommodationsAdminPage`, `EventsAdminPage` (reemplaza `window.confirm`) |
| **`DetailLayout`** | `src/components/layout/DetailLayout/` | `loading`, `notFoundConfig`, `hero` (`image`, `title`, `backTo`, `saved`, `onToggleFavorite`), `header` (`title`, `subtitle`, `badges`), `actions`, `description`, `infoRows`, `relatedSection`, `sidebarCards` | `PlaceDetailPage`, `RestaurantDetailPage`, `AccommodationDetailPage`, `EventDetailPage`, `ExperienceDetailPage` |
| **`AdminCrudView`** | `src/components/admin/AdminCrudView/` | `title`, `createButtonLabel`, `columns`, `fields`, `rows`, `loading`, `error`, `onSave`, `onDelete` | `PlacesAdminPage`, `RestaurantsAdminPage`, `AccommodationsAdminPage`, `EventsAdminPage` |
