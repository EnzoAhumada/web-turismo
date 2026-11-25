# Implementation Plan: Astroturismo Comunitario, Reservas Adaptativas, Guías Certificados y Perfil Mejorado

**Branch**: `006-astrotourism-bookings-guides` | **Date**: 2026-11-24 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/006-astrotourism-bookings-guides/spec.md)

**Input**: Feature specification from `/specs/006-astrotourism-bookings-guides/spec.md`

## Summary

Incorporar de forma persistente y adaptada a la identidad visual de ThakiGo los módulos del mockup funcional:
1. **Galería de Astrofotos** (`/fotografia`, reemplazando la vista del menú "Fotografía") con telemetría astronómica, filtros por sector, ordenamiento, detalle EXIF, "Me gusta" y subida de fotos.
2. **Módulo de Reservas Polimórfico y Adaptativo** integrado vía `DetailLayout` en las 5 fichas de detalle del catálogo (`lugar`, `restaurante`, `alojamiento`, `evento`, `experiencia`), con 4 perfiles configurables (`tour_horario`, `mesa_comida`, `estadia_noches`, `servicio_general`), modo de precio (`calculado` / `sin_costo`) y modo de confirmación (`inmediata` / `pendiente`), precargado y activo inicialmente para **Observatorio Turístico Collowara**.
3. **Panel de Administración de Reservas y Guías** (`/admin/reservas` y `/admin/guias`) para activar/desactivar reservas por entidad, gestionar información, servicios, precios, horarios/cupos, aprobar/cancelar reservas y administrar guías locales.
4. **Directorio de Guías Turísticos Certificados** (`/guias`, reemplazando el menú "Otros") con filtros por especialidad, búsqueda, modal de itinerario + solicitud directa y postulación de nuevos guías locales.
5. **Mejoras a "Mi Perfil" + Perfil Público de Astrofotógrafo** (`/perfil` y `/fotografo/:handleOrId`), preservando 100% de las capacidades actuales e integrando subida rápida de fotos, estadísticas fotográficas, Gear Bag editable, insignias, portafolio, pases/reservas y seguimiento entre usuarios.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5 semántico, CSS3 nativo (`rem` base `10px`), SQL (PostgreSQL 15+ en Supabase)

**Primary Dependencies**: React `^18.3.1`, React Router DOM `^6.26.2`, `@supabase/supabase-js` `^2.112.3`, Vite `^5.4.1` (cero dependencias externas adicionales)

**Storage**: Supabase PostgreSQL (migración SQL + RLS + triggers + funciones RPC) y Supabase Storage (`astro-photos` con fallback a DataURL optimizada y generador Canvas para escenas de muestra)

**Testing**: Validación de compilación (`npm run build`), verificación SQL/migraciones (`npm run db:reset` / `db:migrate`), y pruebas funcionales end-to-end según `quickstart.md` en escritorio y móvil

**Target Platform**: Web responsiva (Desktop, Tablet y Mobile-First) en navegadores modernos

**Project Type**: Single-Page Web Application (React + Vite) respaldada por Supabase

**Performance Goals**: Renderizado instantáneo de filtros/búsqueda y recálculo en vivo de tarifas (<100 ms percibido); carga fluida de galerías con lazy-loading de imágenes

**Constraints**: Sin librerías externas de UI/CSS; CSS3 nativo con variables de `src/styles/variables.css` y `rem` base `10px`; prohibido `innerHTML`, `alert()`, `confirm()` y `prompt()`; 100% textos en español; rutas admin protegidas con `<AdminRoute>`

**Scale/Scope**: 1 migración SQL (+ actualización de `seed.sql`), 4 nuevos servicios, 4 nuevos hooks, 3 nuevas páginas públicas, 2 nuevas páginas admin, 1 componente compartido de reservas adaptativas, 1 modal compartido de subida de astrofotos y mejoras en `ProfilePage`, `DetailLayout`, `Header`, `AdminSidebar` y `ExplorerPage`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Verificación |
|-----------|--------|--------------|
| **I. Identidad Territorial (Andacollo y IV Región)** | PASS | Todos los contenidos, sectores (Cerro Yahuín, Collowara, La Caldera, Ruta Minera), certificaciones SERNATUR/Starlight y reservas refuerzan el astroturismo y turismo local con estructura escalable a toda la IV Región. |
| **II. Experiencia Inspirada en TripAdvisor** | PASS | Tarjetas visuales, filtros claros, calificaciones, fichas detalladas con reseñas + módulo de reservas integrado y perfiles de guías/fotógrafos. |
| **III. Multiplataforma y Diseño Responsivo** | PASS | Maquetación con HTML5 semántico, CSS3 nativo (Flexbox + CSS Grid) adaptable a móvil, tablet y escritorio en todas las nuevas vistas públicas y admin. |
| **IV. Sistema de Diseño, Paleta y `rem` base `10px`** | PASS | Reemplaza las clases Tailwind del mockup por CSS3 nativo usando `--color-primary` (`#071B3A`), `--color-navy` (`#031126`), `--color-gold` (`#FFB800`), `--color-orange` (`#FF9D00`), `--color-white` y `--color-soft`, todas las medidas en `rem`. |
| **V. Seguridad DOM, Feedback Visual y Rutas Protegidas** | PASS | Cero `innerHTML` (todo render declarativo React); cero `alert`/`confirm`/`prompt` (uso de `FeedbackBanner` y `ConfirmModal`); `event.preventDefault()` en todos los `submit`/`click`; rutas admin bajo `<AdminRoute>` y políticas RLS en Supabase. |
| **VI. Simplicidad, Cero Dependencias Innecesarias y Español** | PASS | Cero paquetes nuevos en `package.json`; todos los textos, etiquetas, validaciones y estados vacíos en español. |

*Post-Design Re-check*: PASS — El diseño de `data-model.md` y `contracts/services-and-routes.md` cumple todos los principios sin excepciones ni violaciones.

## Project Structure

### Documentation (this feature)

```text
specs/006-astrotourism-bookings-guides/
├── plan.md                              # Este archivo
├── research.md                          # Decisiones arquitectónicas Phase 0
├── data-model.md                        # Esquema de tablas, triggers y RLS
├── quickstart.md                        # Guía de validación end-to-end
├── contracts/
│   └── services-and-routes.md           # Contratos de rutas, servicios y componentes
└── checklists/
    └── requirements.md                  # Checklist de calidad de especificación
```

### Source Code (repository root)

```text
supabase/
├── migrations/
│   └── 20261124000002_astrotourism_bookings_guides.sql   # Tablas, triggers, RPCs, RLS y semillas idempotentes
└── seed.sql                                               # Actualización de categoría 'guias' y datos semilla

src/
├── lib/
│   └── astroScenes.js                                     # Generador Canvas procedural para escenas astronómicas de muestra/fallback
├── services/
│   ├── astrophotos.service.js                             # CRUD galería, likes, subida de archivos
│   ├── photographers.service.js                           # Perfiles públicos, Gear Bag, seguimientos
│   ├── bookings.service.js                                # Reservas polimórficas, disponibilidad, admin CRUD
│   └── guides.service.js                                  # Guías certificados, postulación, solicitudes, admin CRUD
├── hooks/
│   ├── useAstroGallery.js                                 # Estado y acciones de Galería de Astrofotos
│   ├── useEntityBooking.js                                # Estado, cupos en vivo y envío de reservas en fichas
│   ├── useGuides.js                                       # Filtros, búsqueda, solicitudes y postulación de guías
│   ├── usePhotographerProfile.js                          # Carga y seguimiento de perfil público
│   ├── useExplorerData.js                                 # (Update) Fotografía → /fotografia, Otros → Guías Turísticos (/guias)
│   └── useProfileStats.js                                 # (Update) Integra Gear Bag, portafolio, métricas foto y reservas activas
├── components/
│   ├── layout/
│   │   ├── Header/Header.jsx                              # (Update) Enlaces a Astrofotos y Guías Turísticos
│   │   ├── AdminSidebar/AdminSidebar.jsx                  # (Update) Apartados Reservas y Guías
│   │   └── DetailLayout/DetailLayout.jsx                  # (Update) Prop bookingSection compartida por las 5 fichas
│   └── ui/
│       ├── BookingSection/                                # Módulo de reservas adaptativo (4 perfiles + Mis Pases + galería)
│       │   ├── BookingSection.jsx
│       │   ├── BookingSection.css
│       │   └── index.js
│       ├── AstroPhotoUploadModal/                         # Modal reutilizable para subir astrofotos (Galería + Perfil)
│       │   ├── AstroPhotoUploadModal.jsx
│       │   ├── AstroPhotoUploadModal.css
│       │   └── index.js
│       └── CategoryIcon/CategoryIcon.jsx                  # (Update) Icono/estilo para 'guias'
├── pages/
│   ├── AstroGalleryPage/                                  # Vista Galería de Astrofotos (/fotografia)
│   │   ├── AstroGalleryPage.jsx
│   │   ├── AstroGalleryPage.css
│   │   └── index.js
│   ├── GuidesPage/                                        # Vista Guías Turísticos Certificados (/guias)
│   │   ├── GuidesPage.jsx
│   │   ├── GuidesPage.css
│   │   └── index.js
│   ├── PhotographerProfilePage/                           # Vista Perfil Público de Astrofotógrafo (/fotografo/:handleOrId)
│   │   ├── PhotographerProfilePage.jsx
│   │   ├── PhotographerProfilePage.css
│   │   └── index.js
│   ├── ProfilePage/                                       # (Update) Mejoras perfil: subir foto, stats, Gear Bag, portafolio, pases
│   ├── PlaceDetailPage/PlaceDetailPage.jsx                # (Update) Conecta BookingSection (entityType="lugar")
│   ├── RestaurantDetailPage/RestaurantDetailPage.jsx      # (Update) Conecta BookingSection (entityType="restaurante")
│   ├── AccommodationDetailPage/AccommodationDetailPage.jsx# (Update) Conecta BookingSection (entityType="alojamiento")
│   ├── EventDetailPage/EventDetailPage.jsx                # (Update) Conecta BookingSection (entityType="evento")
│   ├── ExperienceDetailPage/ExperienceDetailPage.jsx      # (Update) Conecta BookingSection (entityType="experiencia")
│   └── admin/
│       ├── BookingsAdminPage/                             # Panel Admin de Reservas multi-entidad
│       │   ├── BookingsAdminPage.jsx
│       │   ├── BookingsAdminPage.css
│       │   └── index.js
│       └── GuidesAdminPage/                               # Panel Admin de Guías y solicitudes
│           ├── GuidesAdminPage.jsx
│           ├── GuidesAdminPage.css
│           └── index.js
└── App.jsx                                                # (Update) Registro de nuevas rutas públicas y admin
```

**Structure Decision**: Se mantiene la arquitectura modular React existente (`src/services`, `src/hooks`, `src/components/ui`, `src/components/layout`, `src/pages`, `src/pages/admin`, `supabase/migrations`), evitando introducir carpetas o paradigmas ajenos al proyecto.

## Complexity Tracking

No existen violaciones a la Constitución que requieran justificación.
