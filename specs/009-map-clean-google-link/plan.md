# Implementation Plan: Vista Limpia del Mapa y Enlace Externo a Google Maps

**Branch**: `009-map-clean-google-link` | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-map-clean-google-link/spec.md`

## Summary

Eliminar de la vista visible del mapa la tarjeta informativa superpuesta de Google Maps (ubicación, estrellas y enlace de abrir/ampliar en Maps) mediante recorte vertical simétrico (overscan CSS) que mantiene el marcador central perfectamente centrado sin añadir dependencias externas, e incorporar un enlace compacto, discreto y visualmente armónico para abrir la ubicación seleccionada en Google Maps externo dentro de ambas vistas de detalle resumido de la aplicación (tarjeta inferior del menú lateral en escritorio y tarjeta compacta inferior en móvil), asegurando HTML5 semántico sin enlaces anidados.

## Technical Context

**Language/Version**: JavaScript (ES6+), React 18.3.1, HTML5 semántico, CSS3 nativo  
**Primary Dependencies**: `react`, `react-router-dom` (6.26.2), `@supabase/supabase-js` (sin nuevas dependencias)  
**Storage**: N/A (sin cambios en base de datos ni almacenamiento; se consumen los datos existentes de `useMapExplorer`)  
**Testing**: Compilación de producción con Vite (`npm run build`) y verificación manual/visual en escritorio y móvil según `quickstart.md`  
**Target Platform**: Aplicación web responsiva (escritorio y dispositivos móviles desde `360px` de ancho)  
**Project Type**: Aplicación web SPA (Vite + React)  
**Performance Goals**: Cero sobrecarga de red o bundle; actualización instantánea del enlace externo al cambiar de ubicación  
**Constraints**: Paleta oficial del proyecto, medidas estrictamente en `rem` (base `10px`), español obligatorio, cero dependencias externas, HTML5 semántico válido (sin `<a>` anidados), sin `alert/confirm/prompt` ni `innerHTML`  
**Scale/Scope**: Mejora localizada en 3 archivos fuente existentes (`src/lib/andacolloGeo.js`, `src/pages/MapPage/MapPage.jsx`, `src/pages/MapPage/MapPage.css`)

## Constitution Check

*GATE: Evaluated before Phase 0 research and re-checked after Phase 1 design.*

| Principio | Estado | Verificación |
|-----------|--------|--------------|
| **I. Identidad Territorial y Enfoque Turístico Local** | ✅ PASS | Se mantiene el foco exclusivo en Andacollo y la IV Región; el enlace externo reutiliza `mapsQuery` normalizado a Andacollo, Región de Coquimbo, Chile. |
| **II. Experiencia Inspirada en TripAdvisor y Descubrimiento Integral** | ✅ PASS | Conserva fotografías, calificación en estrellas, categoría, distancia y acceso a la ficha completa, eliminando duplicación visual del recuadro nativo de Google Maps. |
| **III. Experiencia Multiplataforma (Web y Móvil) y Diseño Responsivo** | ✅ PASS | Cubre explícitamente escritorio (`.map-selected-card`) y móvil (`.map-mobile-preview`) con HTML5 semántico (`<article>`, `<Link>`, `<a>` hermanos) y Flexbox nativo. |
| **IV. Sistema de Diseño, Paleta de Colores y Tipografía Escalable** | ✅ PASS | Usa exclusivamente variables de la paleta oficial (`--color-primary`, `--color-muted`, `--color-soft`, `--color-border`, `--color-white`) y medidas en `rem` con base `10px`. |
| **V. Seguridad del DOM, Feedback Visual Nativo y Rutas Protegidas** | ✅ PASS | Sin `innerHTML`, sin diálogos nativos, enlaces externos seguros con `target="_blank" rel="noopener noreferrer"`, sin impacto en rutas protegidas. |
| **VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio** | ✅ PASS | Cero dependencias nuevas; reutiliza `<Icon name="external-link" />` existente; todas las etiquetas visibles y atributos `aria-label` están en español. |

**Post-Design Gate Result**: Todas las compuertas constitucionales se cumplen sin violaciones ni excepciones.

## Project Structure

### Documentation (this feature)

```text
specs/009-map-clean-google-link/
├── plan.md                        # Este archivo (/speckit-plan)
├── research.md                    # Decisiones técnicas y alternativas evaluadas
├── data-model.md                  # Entidades proyectadas y reglas de estado
├── quickstart.md                  # Guía de validación end-to-end
├── contracts/
│   └── map-clean-link-ui.md       # Contrato de utilidad y estructura UI/CSS
└── tasks.md                       # Generado en la siguiente fase (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── andacolloGeo.js            # [MODIFICAR] Agregar helper googleMapsPlaceUrl(query)
└── pages/
    └── MapPage/
        ├── MapPage.jsx            # [MODIFICAR] Integrar enlace externo en .map-selected-card y refactorizar .map-mobile-preview
        └── MapPage.css            # [MODIFICAR] Recorte vertical simétrico del mapa + estilos compactos y armónicos del enlace externo
```

**Structure Decision**: Se mantiene la arquitectura modular React existente en `src/lib/` y `src/pages/MapPage/`, modificando únicamente los tres archivos directamente responsables de las URLs de Google Maps, la estructura JSX de la página del mapa y sus estilos nativos CSS3.

## Complexity Tracking

No aplica — no existen violaciones constitucionales ni complejidad adicional que justificar.
