# Implementation Plan: Comentarios y Valoraciones para Lugares, Restaurantes y Alojamientos

**Branch**: `005-reviews-and-ratings` | **Date**: 2026-11-24 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/005-reviews-and-ratings/spec.md)

**Input**: Feature specification from `/specs/005-reviews-and-ratings/spec.md`

## Summary

Implementar un sistema completo y persistente de comentarios y valoraciones (1 a 5 estrellas) para **lugares turísticos**, **restaurantes** y **alojamientos** en ThakiGo. La solución incorpora una nueva migración de Supabase con la tabla `public.resenas` (modelo polimórfico `(tipo, item_id)` consistente con `public.favoritos`), políticas RLS de lectura pública y escritura restringida al propio usuario, triggers SQL para mantener sincronizados automáticamente `rating_promedio`, `resenas_count` y el contador de reseñas del perfil, y un conjunto idempotente de reseñas realistas de ejemplo de otros usuarios en `supabase/seed.sql`. En el frontend React, se construye un servicio dedicado (`reviews.service.js`), un hook (`useReviews.js`) y un componente reutilizable (`ReviewsSection`) integrado en `DetailLayout` para `PlaceDetailPage`, `RestaurantDetailPage` y `AccommodationDetailPage`, cumpliendo estrictamente con CSS3 nativo en `rem` (base `10px`), español obligatorio y feedback visual en el DOM.

## Technical Context

**Language/Version**: JavaScript (ES6+ / JSX), HTML5, CSS3 nativo, SQL (PostgreSQL 15+ vía Supabase)  
**Primary Dependencies**: React 18.3.1, React Router DOM 6.26.2, `@supabase/supabase-js` 2.112.3, Vite 5.4.1 (cero dependencias externas adicionales)  
**Storage**: PostgreSQL en Supabase (`public.resenas`, sincronizado vía triggers con `public.lugares`, `public.restaurantes`, `public.alojamientos` y `public.profiles`)  
**Testing**: Validación de compilación (`npm run build`), reinicio y verificación de migraciones/seed (`npm run db:reset`) y pruebas funcionales end-to-end documentadas en `quickstart.md`  
**Target Platform**: Aplicación Web Responsiva (Mobile-First 360px+ y Desktop) en navegadores modernos  
**Project Type**: Web application (SPA React + Backend-as-a-Service Supabase)  
**Performance Goals**: Carga de reseñas por ficha en una sola consulta con índice compuesto `(tipo, item_id, created_at DESC)` y actualización inmediata de métricas en interfaz tras mutaciones  
**Constraints**: Sin librerías externas nuevas; medidas en `rem` con `font-size` base `10px`; paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`); prohibido `alert()`, `confirm()`, `prompt()` e `innerHTML`; todos los textos visibles en español  
**Scale/Scope**: 3 tipos de entidades evaluables (`lugar`, `restaurante`, `alojamiento`), 24 registros base sembrados (12 lugares, 6 restaurantes, 6 alojamientos) con al menos 2 reseñas de ejemplo cada uno (~52 reseñas iniciales)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación Pre-Diseño | Evaluación Post-Diseño | Evidencia / Cumplimiento |
| --- | --- | --- | --- |
| I. Identidad Territorial (Andacollo y IV Región) | PASS | PASS | Las reseñas de ejemplo reflejan sitios, gastronomía y alojamientos reales de Andacollo y la tabla polimórfica escala naturalmente a otras comunas de la IV Región. |
| II. Experiencia Inspirada en TripAdvisor | PASS | PASS | Se incorpora resumen de estrellas, distribución de calificaciones, promedio sincronizado en tarjetas y listado cronológico de reseñas en fichas de detalle. |
| III. Multiplataforma y Diseño Responsivo | PASS | PASS | `ReviewsSection` usa HTML5 semántico (`section`, `article`, `form`, `fieldset`) y CSS3 nativo con Flexbox/Grid adaptado desde 360px hasta escritorio. |
| IV. Sistema de Diseño, Paleta y `rem` base `10px` | PASS | PASS | Todos los estilos nuevos utilizan exclusivamente las variables CSS del proyecto (`--color-primary`, `--color-navy`, `--color-gold`, `--color-orange`, `--color-white`, `--color-soft`) y medidas en `rem`. |
| V. Seguridad del DOM, Feedback Visual y Rutas Protegidas | PASS | PASS | Cero `innerHTML`, `alert`, `confirm` o `prompt`; validaciones y resultados usan `FeedbackBanner`, eliminación usa `ConfirmModal`, y todos los eventos `submit`/`click` ejecutan `event.preventDefault()`. RLS garantiza escritura solo al propietario autenticado. |
| VI. Simplicidad, Cero Dependencias y Español Obligatorio | PASS | PASS | Sin nuevas dependencias npm; todos los textos, fechas, estados vacíos y errores están en español; código modular siguiendo los patrones existentes. |

**Gate Result**: PASS (0 violaciones).

## Project Structure

### Documentation (this feature)

```text
specs/005-reviews-and-ratings/
├── plan.md                        # Este documento (/speckit-plan)
├── research.md                    # Decisiones técnicas y alternativas evaluadas
├── data-model.md                  # Esquema de public.resenas, triggers, RLS y semilla
├── quickstart.md                  # Guía de validación end-to-end
├── contracts/
│   └── reviews-service.md         # Contratos de servicio, hook y componente UI
├── checklists/
│   └── requirements.md            # Checklist de calidad de la especificación
└── tasks.md                       # A generar en la fase /speckit-tasks
```

### Source Code (repository root)

```text
supabase/
├── migrations/
│   └── 20261124000001_reviews_and_ratings.sql   # Nueva migración: tabla resenas, índices, triggers y RLS
└── seed.sql                                     # Ampliado con reseñas de ejemplo para lugares, restaurantes y alojamientos

src/
├── services/
│   └── reviews.service.js                       # CRUD de reseñas + cálculo de resumen y distribución
├── hooks/
│   ├── useReviews.js                            # Estado reactivo de reseñas, creación, edición y eliminación
│   └── useEntityDetail.js                       # Exponer updateRatingSummary para sincronizar cabecera
├── components/
│   ├── layout/
│   │   └── DetailLayout/
│   │       └── DetailLayout.jsx                 # Slot opcional reviewsSection antes de elementos relacionados
│   └── ui/
│       ├── StarRating/
│       │   └── StarRating.jsx                   # Manejo limpio de 0 reseñas y singular/plural (1 reseña)
│       └── ReviewsSection/
│           ├── ReviewsSection.jsx               # Resumen, selector 1–5 estrellas, formulario, listado y ConfirmModal
│           ├── ReviewsSection.css               # Estilos nativos CSS3 en rem (base 10px) y responsivos
│           └── index.js                         # Re-export limpio del componente
└── pages/
    ├── PlaceDetailPage/
    │   └── PlaceDetailPage.jsx                  # Integración de ReviewsSection (entityType="lugar")
    ├── RestaurantDetailPage/
    │   └── RestaurantDetailPage.jsx             # Integración de ReviewsSection (entityType="restaurante")
    └── AccommodationDetailPage/
        └── AccommodationDetailPage.jsx          # Integración de ReviewsSection (entityType="alojamiento")
```

**Structure Decision**: Se mantiene la arquitectura modular existente de aplicación web SPA en `src/` (`services/`, `hooks/`, `components/ui/`, `components/layout/`, `pages/`) y migraciones/semilla en `supabase/`, incorporando una sola migración SQL y un módulo UI reutilizable en `src/components/ui/ReviewsSection/` para evitar duplicación en las tres páginas de detalle.

## Complexity Tracking

No existen violaciones a la Constitución que requieran justificación.
