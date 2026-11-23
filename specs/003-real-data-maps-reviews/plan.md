# Implementation Plan: Datos Reales Verificados, Fichas Completas, Google Maps, Autocompletado, Reseñas y Usuarios Semilla

**Branch**: `main` (`003-real-data-maps-reviews`) | **Date**: 2026-11-20 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/003-real-data-maps-reviews/spec.md)  
**Input**: Feature specification from `specs/003-real-data-maps-reviews/spec.md`

## Summary

Esta fase eleva la calidad funcional y de contenido de **ThakiGo** en seis ejes:
1. Investigación web de datos, coordenadas, direcciones y fotografías reales de Andacollo para actualizar íntegramente `supabase/seed.sql`.
2. Ampliación del esquema y de `DetailLayout` para presentar descripciones extensas y ordenadas (contexto, destacados, información práctica, recomendaciones).
3. Integración de **Google Maps** (`GoogleMapView` con loader nativo de Google Maps JS API cuando exista `VITE_GOOGLE_MAPS_API_KEY` y respaldo automático mediante Google Maps Embed oficial + enlaces de ruta) tanto en `MapPage` como en todas las fichas de detalle.
4. **Buscador general con autocompletado** (`search.service.js`, `useSearchAutocomplete`, y `SearchBar` accesible con teclado y clic).
5. **Sistema de reseñas y comentarios** (`public.resenas`, triggers de recálculo de promedio, `reviews.service.js`, `ReviewsSection`).
6. **5 usuarios semilla** (1 admin municipal + 4 viajeros genéricos) con favoritos, logros, desafíos y comentarios repartidos en `supabase/seed.sql`, documentando credenciales y datos de prueba en `README.md`.

## Technical Context

**Language/Version**: JavaScript (ES6+), React 18.3.1, HTML5, CSS3 nativo, PostgreSQL (Supabase)  
**Primary Dependencies**: `react`, `react-dom`, `react-router-dom`, `@supabase/supabase-js` (sin nuevas dependencias externas)  
**Storage**: Supabase PostgreSQL + Supabase Auth (`supabase/migrations/`, `supabase/seed.sql`)  
**Testing**: Validación manual end-to-end contra Supabase local (`npm run db:reset`), compilación Vite (`npm run build`) y verificación de DOM/consola  
**Target Platform**: Web responsivo (escritorio, tablet y móvil)  
**Project Type**: Aplicación web SPA React + Backend Supabase  
**Performance Goals**: Sugerencias de autocompletado en `< 300ms`; carga fluida de mapas e imágenes con respaldo local  
**Constraints**:
- Cero dependencias externas nuevas (Principio VI y `AGENTS.md`).
- Paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`) y unidades `rem` base `10px`.
- Prohibido `innerHTML`, `alert()`, `confirm()`, `prompt()`; obligatorio `event.preventDefault()` en formularios/botones personalizados.
- 100% de textos visibles en español.

**Scale/Scope**: 12+ sitios turísticos, 5+ restaurantes, 5+ alojamientos, 5+ eventos, 5+ experiencias, 5 usuarios semilla, reseñas distribuidas y todas las vistas de detalle/mapa/búsqueda.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Identidad Territorial (Andacollo y IV Región)**: ✅ Todos los datos reales, coordenadas y fotos pertenecen a atractivos y servicios verificables de Andacollo.
- **II. Experiencia Inspirada en TripAdvisor**: ✅ Fichas detalladas y ordenadas, reseñas con estrellas y comentarios, autocompletado rápido y mapa interactivo.
- **III. Experiencia Multiplataforma y Diseño Responsivo**: ✅ `GoogleMapView`, `ReviewsSection`, `SearchBar` y `DetailLayout` diseñados con CSS Grid/Flexbox adaptable a móvil y escritorio.
- **IV. Sistema de Diseño, Paleta y `rem` base `10px`**: ✅ Todos los estilos nuevos usarán variables CSS existentes y medidas en `rem`.
- **V. Seguridad del DOM, Feedback Nativo y Rutas Protegidas**: ✅ Sin `innerHTML`, sin `alert`/`confirm`/`prompt`; feedback visual con `FeedbackBanner`; RLS en `resenas` y rutas `/admin` protegidas.
- **VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio**: ✅ Sin librerías externas nuevas (Google Maps vía API nativa / Embed estándar); toda la interfaz y mensajes en español.

*Post-Design Re-check*: Sin violaciones ni excepciones requeridas.

## Project Structure

### Documentation (this feature)

```text
specs/003-real-data-maps-reviews/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-contracts.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Se generará con /speckit-tasks
```

### Source Code (repository root)

```text
supabase/
├── migrations/
│   └── 20261120000003_reviews_structured_data_and_seed_users.sql
└── seed.sql

src/
├── lib/
│   └── googleMaps.js
├── services/
│   ├── reviews.service.js
│   ├── search.service.js
│   ├── places.service.js
│   ├── restaurants.service.js
│   ├── accommodations.service.js
│   ├── events.service.js
│   └── experiences.service.js
├── hooks/
│   ├── useSearchAutocomplete.js
│   ├── useReviews.js
│   └── useEntityDetail.js
├── components/
│   ├── ui/
│   │   ├── SearchBar/
│   │   ├── GoogleMapView/
│   │   └── ReviewsSection/
│   └── layout/
│       └── DetailLayout/
└── pages/
    ├── MapPage/
    ├── PlaceDetailPage/
    ├── RestaurantDetailPage/
    ├── AccommodationDetailPage/
    ├── EventDetailPage/
    └── ExperienceDetailPage/

.env.example
README.md
```

**Structure Decision**: Se mantiene la arquitectura modular existente de React (`src/lib`, `src/services`, `src/hooks`, `src/components`, `src/pages`) y Supabase (`supabase/migrations`, `supabase/seed.sql`), añadiendo únicamente los módulos necesarios para Google Maps, autocompletado y reseñas.

## Complexity Tracking

No hay violaciones a la Constitución; no se requiere justificación adicional.
