# Implementation Plan: Perfil de Usuario, Galería Interactiva, Submenú de Reservas y Unificación Visual Clara

**Branch**: `007-profile-gallery-booking-theme` (actual: `main`) | **Date**: 2026-11-24 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/007-profile-gallery-booking-theme/spec.md)

**Input**: Feature specification from `specs/007-profile-gallery-booking-theme/spec.md`

## Summary

Esta iteración unifica la experiencia visual y de navegación del portal turístico ThakiGo (Andacollo) en cuatro frentes complementarios:

1. **Unificación visual con paleta clara**: Migración completa de las vistas de Astronomía (`AstronomyPage`), Astrofotos (`AstroGalleryPage`), Guías (`GuidesPage`), módulo de Servicios y Reserva (`BookingSection`), y vistas de perfil (`ProfilePage`, `PhotographerProfilePage`) desde fondos oscuros (`page-wrapper--dark`) hacia la paleta clara oficial de la aplicación (`#F5F7FA`, `#FFFFFF`, `#071B3A`, `#031126`, `#FFB800`, `#FF9D00`), respetando tokens CSS en unidades `rem` (base `10px`).
2. **Submenú de Servicios y Reserva en vista de detalle**: Reubicación de `BookingSection` dentro de un submenú de pestañas interno en `DetailLayout` (`Información y Detalle` / `Servicios y Reserva`), visible únicamente cuando el elemento tiene configuración de reservas activa, preservando el estado del formulario al cambiar de pestaña.
3. **Vista propia de perfil autentificado y perfil público de otros usuarios**: Reorganización de `ProfilePage` como vista dedicada a la visualización estructurada de datos del usuario autentificado (separando el modo de edición/configuración) y armonización de `PhotographerProfilePage` (accesible también desde `/usuario/:handleOrId` y `/fotografo/:handleOrId`) para consultar perfiles de terceros con el mismo lenguaje visual y sin exponer datos privados.
4. **Visor interactivo de fotos en galería de perfiles**: Extracción de un componente reutilizable `AstroPhotoModal` (lightbox detallado con imagen ampliada, spot, título, descripción, EXIF, enlace al autor y «Me gusta» interactivo) compartido entre `AstroGalleryPage`, `ProfilePage` y `PhotographerProfilePage`.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3 nativo  
**Primary Dependencies**: React `^18.3.1`, React DOM `^18.3.1`, React Router DOM `^6.26.2`, `@supabase/supabase-js` `^2.112.3`, Vite `^5.4.1` (cero librerías externas de UI adicionales)  
**Storage**: Supabase PostgreSQL + Supabase Storage (tablas existentes `profiles`, `astro_photos`, `astro_photo_likes`, `photographer_follows`, `booking_configs`, `booking_packages`, `booking_slots`, `bookings`, `guide_requests`; sin migraciones de esquema requeridas)  
**Testing**: Validación de compilación (`npm run build`) y verificación manual/visual responsiva (escritorio y móvil 360px+) según `quickstart.md`  
**Target Platform**: Aplicación Web Responsiva (navegadores modernos de escritorio y móvil)  
**Project Type**: Single-page web application (React + Vite + Supabase)  
**Performance Goals**: Apertura instantánea del visor modal de fotografía (<100 ms al estar la foto ya cargada en el perfil), cambio de pestaña del submenú sin recargas ni consultas duplicadas, compilación limpia sin advertencias  
**Constraints**: Sin dependencias externas nuevas; prohibido `innerHTML`, `alert()`, `confirm()`, `prompt()`; `e.preventDefault()` obligatorio en manejadores de eventos; medidas exclusivamente en `rem` con base `10px`; 100% textos en español; paleta oficial estricta  
**Scale/Scope**: 6 páginas principales, 1 layout de detalle compartido, 1 módulo de reservas, 1 nuevo componente modal reutilizable, 2 hooks de perfil actualizados y sus hojas de estilo CSS nativo

## Constitution Check

*GATE: Evaluated before Phase 0 and re-checked after Phase 1 design.*

| Principio Constitucional | Estado | Cumplimiento en este diseño |
|---|---|---|
| **I. Identidad Territorial (Andacollo y IV Región)** | ✅ PASS | Se preservan todos los contenidos, pilares patrimoniales (Astroturismo, Religioso, Minero) y servicios locales de Andacollo. |
| **II. Experiencia TripAdvisor y Descubrimiento Integral** | ✅ PASS | El submenú interno en `DetailLayout` despeja la lectura principal de fichas (fotos, estrellas, descripción, reseñas) y agrupa Servicios/Reserva de forma ordenada. |
| **III. Multiplataforma y Diseño Responsivo** | ✅ PASS | HTML5 semántico, CSS3 Flexbox/Grid nativo, submenú táctil, visor modal adaptable y perfiles responsivos desde `360px`. |
| **IV. Sistema de Diseño, Paleta y Tipografía `rem`** | ✅ PASS | Unificación total a la paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`) con medidas en `rem` base `10px`. |
| **V. Seguridad del DOM, Feedback Nativo y Rutas Protegidas** | ✅ PASS | Cero `innerHTML` y cero diálogos nativos; feedback con `FeedbackBanner` y `ConfirmModal`; `/perfil` protegido con `ProtectedRoute`; datos privados ocultos en perfiles públicos. |
| **VI. Simplicidad, Cero Dependencias y Español Obligatorio** | ✅ PASS | Cero dependencias nuevas; componente `AstroPhotoModal` limpio y reutilizable; 100% interfaz en español. |

## Project Structure

### Documentation (this feature)

```text
specs/007-profile-gallery-booking-theme/
├── plan.md              # Este archivo
├── research.md          # Decisiones de diseño y arquitectura (Fase 0)
├── data-model.md        # Entidades, estados de UI y reglas de privacidad (Fase 1)
├── quickstart.md        # Guía de validación ejecutable paso a paso (Fase 1)
├── contracts/
│   └── ui-contracts.md  # Contratos de componentes, rutas y hooks (Fase 1)
└── tasks.md             # Generado posteriormente por /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── App.jsx                                            # Alias de ruta /usuario/:handleOrId -> PhotographerProfilePage
├── components/
│   ├── layout/
│   │   └── DetailLayout/
│   │       ├── DetailLayout.jsx                       # Submenú interno (Información / Servicios y Reserva) + hook compartido
│   │       └── DetailLayout.css                       # Estilos del submenú de pestañas con paleta clara oficial
│   └── ui/
│       ├── AstroPhotoModal/                           # [NUEVO] Visor detallado reutilizable de fotografías
│       │   ├── AstroPhotoModal.jsx
│       │   ├── AstroPhotoModal.css
│       │   └── index.js
│       ├── AstroPhotoUploadModal/
│       │   └── AstroPhotoUploadModal.css              # Armonización a tema claro
│       └── BookingSection/
│           ├── BookingSection.jsx                     # Soporte de estado inyectado desde DetailLayout
│           └── BookingSection.css                     # Rediseño completo a paleta clara oficial
├── hooks/
│   ├── useProfileStats.js                             # Añadir handleTogglePhotoLike y métricas sincronizadas
│   └── usePhotographerProfile.js                      # Añadir handleTogglePhotoLike y perfil público completo
└── pages/
    ├── AstronomyPage/
    │   ├── AstronomyPage.jsx                          # Retirar page-wrapper--dark / darkNav
    │   └── AstronomyPage.css                          # Rediseño a paleta clara oficial
    ├── AstroGalleryPage/
    │   ├── AstroGalleryPage.jsx                       # Usar AstroPhotoModal compartido y tema claro
    │   └── AstroGalleryPage.css                       # Rediseño a paleta clara oficial
    ├── GuidesPage/
    │   ├── GuidesPage.jsx                             # Retirar page-wrapper--dark / darkNav
    │   └── GuidesPage.css                             # Rediseño a paleta clara oficial
    ├── ProfilePage/
    │   ├── ProfilePage.jsx                            # Vista propia estructurada + AstroPhotoModal + edición separada
    │   └── ProfilePage.css                            # Rediseño a paleta clara oficial
    ├── PhotographerProfilePage/
    │   ├── PhotographerProfilePage.jsx                # Perfil de otros usuarios armonizado + AstroPhotoModal
    │   └── PhotographerProfilePage.css                # Rediseño a paleta clara oficial
    ├── PlaceDetailPage/PlaceDetailPage.jsx            # Pasar bookingProps a DetailLayout
    ├── RestaurantDetailPage/RestaurantDetailPage.jsx  # Pasar bookingProps a DetailLayout
    ├── AccommodationDetailPage/AccommodationDetailPage.jsx # Pasar bookingProps a DetailLayout
    ├── EventDetailPage/EventDetailPage.jsx            # Pasar bookingProps a DetailLayout
    └── ExperienceDetailPage/ExperienceDetailPage.jsx  # Pasar bookingProps a DetailLayout
```

**Structure Decision**: Se mantiene la arquitectura modular React existente (`src/components`, `src/hooks`, `src/pages`, `src/services`, `src/styles`) sin agregar capas ni dependencias innecesarias.

## Complexity Tracking

No existen violaciones a la Constitución; no se requiere tabla de excepciones.
