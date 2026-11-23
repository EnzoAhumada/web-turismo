# Implementation Plan: Arquitectura Modular, Datos 100% Dinámicos en Supabase y Documentación Integral

**Branch**: `001-modular-architecture-supabase` | **Date**: 2026-11-20 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/001-modular-architecture-supabase/spec.md)

**Input**: Feature specification from `/specs/001-modular-architecture-supabase/spec.md`

## Summary

Refactorizar integralmente la aplicación web de turismo de Andacollo (**ThakiGo**) para:
1. **Modularizar las páginas por carpetas** (`src/pages/<PageName>/` y `src/pages/admin/<AdminPageName>/`).
2. **Desacoplar responsabilidades** en tres capas estrictas: **Services** (`src/services/`), **Hooks** (`src/hooks/`) y **UI** (`src/pages/` + `src/components/`).
3. **Eliminar el 100% de datos estáticos (hardcoded)** en las vistas, creando la estructura completa de **Supabase en local** (`supabase/config.toml`, `supabase/migrations/` y `supabase/seed.sql`) para pruebas, migraciones, seeders y despliegues.
4. **Unificar patrones de interfaz compartida** en componentes reutilizables (`PageHero`, `FilterTabs`, `LoadingState`, `EmptyState`, `FeedbackBanner`, `ConfirmModal`, `DetailLayout`, `AdminCrudView`), reemplazando además cualquier uso de `window.confirm` por modales propios del DOM.
5. **Generar el `README.md`** oficial con objetivo del proyecto, arquitectura, comandos de operación (local, BD, migraciones, seeders, front, back, despliegues) y consideraciones de puesta en producción.

## Technical Context

**Language/Version**: HTML5, CSS3 nativo (`rem` base `10px`), JavaScript (ES6+ / ES2022), JSX

**Primary Dependencies**: `react@^18.3.1`, `react-dom@^18.3.1`, `react-router-dom@^6.26.2`, `@supabase/supabase-js@^2.112.3`, `vite@^5.4.1` (Cero dependencias externas adicionales)

**Storage**: Supabase (PostgreSQL 15+, Supabase Auth, Row Level Security) con entorno local en `supabase/`

**Testing**: Validación de compilación con `vite build`, verificación estática de contratos/imports y pruebas funcionales sobre base de datos local con `supabase db reset`

**Target Platform**: Navegadores Web modernos de Escritorio y Móviles (Responsive Design / Mobile-First)

**Project Type**: Single-Page Web Application (SPA) con Backend-as-a-Service (Supabase)

**Performance Goals**: Carga inicial de vistas y transiciones fluidas (<1s en entorno local), consultas indexadas y carga en paralelo (`Promise.all`) en vistas compuestas (`HomePage`, `AstronomyPage`, `GamificationPage`, `DashboardPage`)

**Constraints**:
- Prohibido añadir librerías externas de UI, estado o utilidades.
- Prohibido usar `alert()`, `confirm()`, `prompt()` o `innerHTML`.
- Todos los textos visibles al usuario deben estar en español.
- Uso obligatorio de medidas en `rem` con base `10px` y paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`).
- `event.preventDefault()` obligatorio en todos los manejadores de eventos `submit` o acciones personalizadas.

**Scale/Scope**: 19 módulos de páginas públicas/autenticadas, 5 módulos de páginas de administración, 14 servicios de datos, 15 hooks de lógica de vista, 13 componentes UI/Layout/Admin reutilizables, esquema SQL de 17 tablas con RLS y seeders completos de Andacollo.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio de la Constitución | Evaluación Pre-Diseño | Evaluación Post-Diseño | Evidencia en el Plan |
| :--- | :---: | :---: | :--- |
| **I. Identidad Territorial y Enfoque Turístico Local (Andacollo y IV Región)** | ✅ PASS | ✅ PASS | Esquema de BD en `data-model.md` y `supabase/seed.sql` cubren Astroturismo, Religioso, Minero, Gastronomía, Alojamientos, Eventos y Experiencias de Andacollo, con columnas `comuna` y `region` para escalar a la IV Región. |
| **II. Experiencia Inspirada en TripAdvisor y Descubrimiento Integral** | ✅ PASS | ✅ PASS | Tarjetas `Card`, calificaciones `StarRating`, filtros `FilterTabs` y plantilla `DetailLayout` muestran fotos, ratings, categorías, horarios, precios y favoritos. |
| **III. Experiencia Multiplataforma (Web y Móvil) y Diseño Responsivo** | ✅ PASS | ✅ PASS | HTML5 semántico, CSS3 nativo con Flexbox y CSS Grid conservando y limpiando los estilos responsivos basados en `design/`. |
| **IV. Sistema de Diseño, Paleta de Colores y Tipografía Escalable** | ✅ PASS | ✅ PASS | Variables CSS oficiales y unidades `rem` con base `10px` mantenidas en todos los componentes nuevos (`ConfirmModal`, `FeedbackBanner`, `PageHero`, `DetailLayout`). |
| **V. Seguridad del DOM, Feedback Visual Nativo y Rutas Protegidas** | ✅ PASS | ✅ PASS | Se eliminan las 4 llamadas a `window.confirm()` en páginas Admin reemplazándolas por `ConfirmModal`. Cero uso de `innerHTML`. `ProtectedRoute` y `AdminRoute` resguardan rutas privadas. |
| **VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio** | ✅ PASS | ✅ PASS | No se añade ninguna dependencia en `package.json`. Todos los textos, estados vacíos, errores y el `README.md` están íntegramente en español. |

## Project Structure

### Documentation (this feature)

```text
specs/001-modular-architecture-supabase/
├── plan.md                                  # Este plan de implementación
├── research.md                              # Decisiones arquitectónicas (Fase 0)
├── data-model.md                            # Modelo entidad-relación completo (Fase 1)
├── quickstart.md                            # Guía de validación y arranque rápido (Fase 1)
├── contracts/
│   └── architecture-contracts.md            # Contratos de Services, Hooks y Componentes UI (Fase 1)
└── tasks.md                                 # Lista de tareas (se genera con /speckit-tasks)
```

### Source Code (repository root)

```text
/home/i/Documentos/web-turismo/
├── README.md                                # Documentación integral del proyecto
├── AGENTS.md                                # Reglas y preferencias del agente
├── package.json                             # Scripts de front y base de datos local/despliegue
├── .env.example                             # Plantilla documentada de variables de entorno
├── supabase/                                # Estructura local de Supabase (BD, migraciones, seeders)
│   ├── config.toml                          # Configuración de Supabase CLI local
│   ├── migrations/
│   │   └── 20261120000001_initial_schema.sql # Esquema completo (17 tablas, triggers Auth, RLS)
│   └── seed.sql                             # Datos iniciales de Andacollo para todas las vistas
└── src/
    ├── main.jsx
    ├── App.jsx                              # Enrutador principal importando desde carpetas modulares
    ├── lib/
    │   └── supabase.js                      # Instancia única del cliente Supabase
    ├── context/
    │   └── AuthContext.jsx                  # Contexto de sesión apoyado en auth.service.js
    ├── services/                            # CAPA DE ACCESO A DATOS (100% consultas Supabase)
    │   ├── auth.service.js
    │   ├── categories.service.js
    │   ├── places.service.js
    │   ├── restaurants.service.js
    │   ├── accommodations.service.js
    │   ├── events.service.js
    │   ├── experiences.service.js
    │   ├── favorites.service.js
    │   ├── astronomy.service.js
    │   ├── map.service.js
    │   ├── gamification.service.js
    │   ├── planner.service.js
    │   ├── recommendations.service.js
    │   └── admin.service.js
    ├── hooks/                               # CAPA DE LÓGICA DE ESTADO Y CONTROLADORES DE VISTA
    │   ├── useAsyncData.js
    │   ├── useHomeData.js
    │   ├── useExplorerData.js
    │   ├── useEntityDetail.js
    │   ├── useRestaurants.js
    │   ├── useAccommodations.js
    │   ├── useEvents.js
    │   ├── useExperiences.js
    │   ├── useAstronomy.js
    │   ├── useMapExplorer.js
    │   ├── useGamification.js
    │   ├── useTripPlanner.js
    │   ├── useRecommendations.js
    │   ├── useFavorites.js
    │   ├── useProfileStats.js
    │   ├── useAdminDashboard.js
    │   └── useAdminCrud.js
    ├── components/                          # CAPA DE COMPONENTES REUTILIZABLES COMPARTIDOS
    │   ├── auth/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── AdminRoute.jsx
    │   │   └── RouteLoading.css
    │   ├── layout/
    │   │   ├── Header/
    │   │   ├── Footer/
    │   │   ├── AdminSidebar/
    │   │   └── DetailLayout/                # Layout reutilizable para las 5 páginas de detalle
    │   ├── admin/
    │   │   ├── AdminCrudModal/
    │   │   └── AdminCrudView/               # Vista de tabla + barra superior + ConfirmModal
    │   └── ui/
    │       ├── Button/
    │       ├── Card/
    │       ├── CategoryIcon/
    │       ├── SearchBar/
    │       ├── StarRating/
    │       ├── PageHero/                    # Hero banner reutilizable
    │       ├── FilterTabs/                  # Barra de pestañas y chips de filtro
    │       ├── LoadingState/                # Spinner de carga estandarizado
    │       ├── EmptyState/                  # Estado vacío reutilizable
    │       ├── FeedbackBanner/              # Alertas de éxito/error en el DOM
    │       └── ConfirmModal/                # Modal de confirmación en el DOM (reemplaza confirm())
    └── pages/                               # MÓDULOS DE PÁGINAS SEPARADOS POR CARPETAS
        ├── LandingPage/
        │   ├── LandingPage.jsx
        │   ├── LandingPage.css
        │   └── index.js
        ├── HomePage/
        │   ├── HomePage.jsx
        │   ├── HomePage.css
        │   └── index.js
        ├── ExplorerPage/
        │   ├── ExplorerPage.jsx
        │   ├── ExplorerPage.css
        │   └── index.js
        ├── MapPage/
        │   ├── MapPage.jsx
        │   ├── MapPage.css
        │   └── index.js
        ├── PlaceDetailPage/
        │   ├── PlaceDetailPage.jsx
        │   └── index.js
        ├── RestaurantsPage/
        │   ├── RestaurantsPage.jsx
        │   ├── RestaurantsPage.css
        │   └── index.js
        ├── RestaurantDetailPage/
        │   ├── RestaurantDetailPage.jsx
        │   └── index.js
        ├── AccommodationsPage/
        │   ├── AccommodationsPage.jsx
        │   ├── AccommodationsPage.css
        │   └── index.js
        ├── AccommodationDetailPage/
        │   ├── AccommodationDetailPage.jsx
        │   └── index.js
        ├── EventsPage/
        │   ├── EventsPage.jsx
        │   ├── EventsPage.css
        │   └── index.js
        ├── EventDetailPage/
        │   ├── EventDetailPage.jsx
        │   └── index.js
        ├── ExperiencesPage/
        │   ├── ExperiencesPage.jsx
        │   ├── ExperiencesPage.css
        │   └── index.js
        ├── ExperienceDetailPage/
        │   ├── ExperienceDetailPage.jsx
        │   └── index.js
        ├── AstronomyPage/
        │   ├── AstronomyPage.jsx
        │   ├── AstronomyPage.css
        │   └── index.js
        ├── RecommendationsPage/
        │   ├── RecommendationsPage.jsx
        │   ├── RecommendationsPage.css
        │   └── index.js
        ├── TripPlannerPage/
        │   ├── TripPlannerPage.jsx
        │   ├── TripPlannerPage.css
        │   └── index.js
        ├── FavoritesPage/
        │   ├── FavoritesPage.jsx
        │   ├── FavoritesPage.css
        │   └── index.js
        ├── GamificationPage/
        │   ├── GamificationPage.jsx
        │   ├── GamificationPage.css
        │   └── index.js
        ├── ProfilePage/
        │   ├── ProfilePage.jsx
        │   ├── ProfilePage.css
        │   └── index.js
        └── admin/
            ├── DashboardPage/
            │   ├── DashboardPage.jsx
            │   ├── DashboardPage.css
            │   └── index.js
            ├── PlacesAdminPage/
            │   ├── PlacesAdminPage.jsx
            │   └── index.js
            ├── RestaurantsAdminPage/
            │   ├── RestaurantsAdminPage.jsx
            │   └── index.js
            ├── AccommodationsAdminPage/
            │   ├── AccommodationsAdminPage.jsx
            │   └── index.js
            └── EventsAdminPage/
                ├── EventsAdminPage.jsx
                └── index.js
```

**Structure Decision**: Se adopta una arquitectura modular de proyecto único con separación explícita por capas (`src/services/`, `src/hooks/`, `src/components/`, `src/pages/<Module>/`) complementada por el directorio estándar `supabase/` en la raíz para el ciclo de vida completo de base de datos local, migraciones y seeders.

## Complexity Tracking

No se registran violaciones a la Constitución del proyecto. Todos los principios (I al VI) y las reglas de `AGENTS.md` se cumplen sin excepciones.
