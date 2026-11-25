# Implementation Plan: Menú Lateral Ocultable y Vista Limpia del Mapa

**Branch**: `008-map-sidebar-drawer` | **Date**: 2026-11-24 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/008-map-sidebar-drawer/spec.md)

**Input**: Feature specification from `/specs/008-map-sidebar-drawer/spec.md`

## Summary

Mejorar la experiencia de la página del mapa (`MapPage`) en dos frentes solicitados por el usuario:
1. Eliminar por completo el recuadro superior flotante `"Ubicación seleccionada"` (`.map-focus`) que aparecía sobre el mapa al seleccionar un lugar.
2. Transformar el menú del mapa (buscador, filtros por categoría y listado de ubicaciones) en un menú lateral desplegable oculto por defecto al estilo de Google Maps, superpuesto sobre el costado izquierdo del mapa mediante un botón flotante accesible, maximizando el espacio visible del mapa tanto en escritorio como en dispositivos móviles.

## Technical Context

**Language/Version**: JavaScript (ES6+) / JSX, HTML5, CSS3 nativo  
**Primary Dependencies**: React `^18.3.1`, React Router DOM `^6.26.2`, `@supabase/supabase-js` `^2.112.3`, Vite `^5.4.1` (sin nuevas dependencias externas)  
**Storage**: N/A (consume los datos existentes mediante `useMapExplorer` y `map.service.js`)  
**Testing**: Compilación de producción (`npm run build`) y verificación manual interactiva en resoluciones de escritorio y móvil (ver `quickstart.md`)  
**Target Platform**: Navegadores web modernos en escritorio y móvil (Responsive Design)  
**Project Type**: Aplicación web SPA (React + Vite)  
**Performance Goals**: Apertura/cierre suave del menú lateral a 60 fps mediante transformaciones CSS (`transform`) sin provocar reflujo ni recarga del `<iframe>` del mapa  
**Constraints**: Cero dependencias externas nuevas; medidas en `rem` con base `10px`; paleta de colores oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`); todo texto en español; prohibido `alert`/`confirm`/`prompt`/`innerHTML`; `event.preventDefault()` en manejadores interactivos  
**Scale/Scope**: Mejora acotada a la vista pública del mapa (`src/pages/MapPage/MapPage.jsx` y `src/pages/MapPage/MapPage.css`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio de la Constitución | Estado Pre-Diseño | Estado Post-Diseño | Evidencia / Cumplimiento |
|---|---|---|---|
| **I. Identidad Territorial (Andacollo y IV Región)** | ✅ Pasa | ✅ Pasa | Conserva todos los puntos turísticos, gastronomía, hospedajes y rutas de Andacollo sin alterar la estructura de datos. |
| **II. Experiencia TripAdvisor y Descubrimiento Integral** | ✅ Pasa | ✅ Pasa | Mantiene búsqueda, filtros por categoría, calificaciones y acceso a fichas detalladas en un patrón de exploración familiar tipo Google Maps. |
| **III. Experiencia Multiplataforma y Diseño Responsivo** | ✅ Pasa | ✅ Pasa | El cajón lateral ocultable funciona de forma fluida en escritorio y móvil con Flexbox, HTML5 semántico y cierre automático al seleccionar en móvil. |
| **IV. Sistema de Diseño, Paleta y `rem` base `10px`** | ✅ Pasa | ✅ Pasa | Utiliza exclusivamente variables CSS oficiales del proyecto y unidades `rem` (base `10px`). |
| **V. Seguridad del DOM, Feedback Nativo y Rutas Protegidas** | ✅ Pasa | ✅ Pasa | Sin `innerHTML`, sin `alert`/`confirm`/`prompt`; mantiene `FeedbackBanner`, `LoadingState`, `EmptyState` y `event.preventDefault()` en botones. |
| **VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio** | ✅ Pasa | ✅ Pasa | Cero dependencias nuevas; reutiliza `Icon.jsx`; todos los textos y etiquetas ARIA están en español. |

## Project Structure

### Documentation (this feature)

```text
specs/008-map-sidebar-drawer/
├── spec.md                    # Especificación funcional (/speckit-specify)
├── plan.md                    # Este archivo (/speckit-plan)
├── research.md                # Decisiones técnicas y alternativas evaluadas
├── data-model.md              # Estado del cajón lateral y entidades del mapa
├── quickstart.md              # Guía de validación manual y build
├── contracts/
│   └── map-drawer-ui.md       # Contrato de interacción y accesibilidad del menú lateral
├── checklists/
│   └── requirements.md        # Checklist de calidad de la especificación
└── tasks.md                   # Generado posteriormente por /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ui/
│       └── Icon/              # Reutilizado (íconos menu, x, search, chevron-right, map-pin, plus, minus, navigation)
├── hooks/
│   └── useMapExplorer.js      # Reutilizado sin cambios (filtros, búsqueda, pins, selectedPin)
├── lib/
│   └── andacolloGeo.js        # Reutilizado sin cambios (URLs de Google Maps)
└── pages/
    └── MapPage/
        ├── MapPage.jsx        # MODIFICAR: eliminar .map-focus y convertir .map-panel en cajón lateral ocultable con botón flotante, cierre Escape y backdrop móvil
        └── MapPage.css        # MODIFICAR: eliminar estilos de .map-focus y .map-mobile-results; añadir estilos del cajón superpuesto, botón flotante y responsive
```

**Structure Decision**: Se mantiene la arquitectura modular existente de React (`src/pages/MapPage/`). Todos los cambios se concentran en `MapPage.jsx` y `MapPage.css`, reutilizando `useMapExplorer`, `Icon` y los componentes UI existentes sin introducir archivos ni dependencias innecesarias.

## Complexity Tracking

Sin violaciones a la Constitución; no se requiere justificación adicional.
