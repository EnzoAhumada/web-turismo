# Implementation Plan: Mejoras de Mapa Móvil, Noticias de Andacollo, Vistas Administrables (Astronomía y Experiencias), Itinerario de Planificador y Perfil con Ranking Real

**Branch**: `004-portal-views-news-upgrades` | **Date**: 2026-11-23 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/004-portal-views-news-upgrades/spec.md)

**Input**: Feature specification from `/specs/004-portal-views-news-upgrades/spec.md`

## Summary

Se incorporan seis mejoras integrales respetando la arquitectura modular actual (`React + Vite + CSS3 nativo en rem base 10px + Supabase`):
1. **Filtro del Mapa en Móvil**: Ajuste responsivo completo en `MapPage` para barra de búsqueda, chips de categoría en fila única deslizable horizontalmente y posicionamiento seguro sobre `BottomNav`.
2. **Noticias de Andacollo**: Nueva tabla `public.noticias` con 10 noticias recientes precargadas, sección visual en `HomePage` con lectura detallada en modal del diseño, módulo CRUD `/admin/noticias` y Supabase Edge Function `sync-andacollo-news` para sincronización automática/bajo demanda desde fuente pública local con prevención de duplicados y respaldo seguro.
3. **Vista de Turismo Astronómico Administrable**: Refinamiento visual según `design/8 turismo astronomico.jpg`, políticas RLS de administrador sobre las tablas astronómicas y nuevo módulo `/admin/astronomia`.
4. **Vista de Experiencias Administrable**: Alineación visual con `design/11 experiencias locales.jpg` y nuevo módulo CRUD `/admin/experiencias` siguiendo el patrón `useAdminCrud` + `AdminCrudView`.
5. **Planificador de Viajes con Itinerario de Ejemplo**: Itinerario real de ejemplo visible desde el inicio (organizado por días y bloques Mañana/Tarde/Noche integrando lugares, experiencias, restaurantes y eventos) más generación personalizada y guardado con XP real.
6. **Perfil y Logros-Ranking con Datos Reales**: Eliminación de cifras ficticias, conexión real a `profiles`, `usuario_insignias`, `usuario_desafios` y `favoritos`, persistencia de preferencias y ranking comunitario real.

## Technical Context

**Language/Version**: JavaScript (ES6+) con React 18.3.1, HTML5 semántico, CSS3 nativo, SQL (PostgreSQL/Supabase) y TypeScript/Deno para Edge Function opcional de sincronización de noticias.  
**Primary Dependencies**: `react`, `react-dom`, `react-router-dom`, `@supabase/supabase-js` (sin nuevas dependencias externas).  
**Storage**: Supabase PostgreSQL (`public.noticias`, `public.astronomia_*`, `public.experiencias`, `public.lugares`, `public.eventos`, `public.restaurantes`, `public.rutas_paradas`, `public.profiles`, `public.insignias`, `public.usuario_insignias`, `public.desafios`, `public.usuario_desafios`, `public.favoritos`) con Row Level Security (RLS).  
**Testing**: Validación de build de producción (`npm run build`), verificación de migraciones/seed SQL y pruebas manuales responsivas (móvil 360px/390px y escritorio) según `quickstart.md`.  
**Target Platform**: Aplicación web responsiva (navegadores móviles y escritorio).  
**Project Type**: Web application (SPA React + backend Supabase).  
**Performance Goals**: Carga fluida en redes móviles locales, sin librerías externas pesadas, sincronización externa no bloqueante (<6s timeout con fallback inmediato a BD).  
**Constraints**: Cero dependencias externas adicionales; textos 100% en español; paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`); medidas en `rem` con base `10px`; prohibido `alert()`, `confirm()`, `prompt()` e `innerHTML`; prevenir default en `submit`/`click`.  
**Scale/Scope**: 6 vistas públicas mejoradas, 3 nuevas vistas administrativas (`/admin/noticias`, `/admin/astronomia`, `/admin/experiencias`), 1 migración SQL, 10 noticias semilla, 1 Edge Function de sincronización.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Identidad Territorial (Andacollo y IV Región)**: Noticias reales de Andacollo, pilares Astroturismo/Religioso/Minero destacados en Astronomía, Experiencias e Itinerario, tablas con `comuna`/`region`.
- [x] **II. Experiencia Inspirada en TripAdvisor**: Tarjetas visuales, calificaciones, filtros claros y fichas detalladas enlazadas desde Inicio, Experiencias, Astronomía y Planificador.
- [x] **III. Multiplataforma y Diseño Responsivo**: Corrección explícita del filtro móvil del mapa y adaptación fiel a mockups `design/1`, `2`, `6`, `8`, `10`, `11`, `12` con HTML5 semántico, Flexbox y CSS Grid.
- [x] **IV. Sistema de Diseño, Paleta y `rem` base `10px`**: Todas las hojas de estilo nuevas y actualizadas utilizan `variables.css` y medidas en `rem`.
- [x] **V. Seguridad del DOM, Feedback Visual Nativo y Rutas Protegidas**: Uso exclusivo de componentes React (`FeedbackBanner`, `AdminCrudModal`, modal propio para lectura de noticias), cero `innerHTML`, cero `alert`/`confirm`/`prompt`, `preventDefault()` en formularios/botones y rutas `/admin/*` protegidas con `AdminRoute` + RLS `public.is_admin()`.
- [x] **VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio**: Ninguna dependencia agregada en `package.json`; todos los textos visibles en español; reutilización de `useAdminCrud`, `AdminCrudView`, `Card`, `Icon`, `SmartImage`.

*Re-evaluación post-diseño (Phase 1)*: Todas las puertas de la Constitución pasan sin excepciones ni violaciones.

## Project Structure

### Documentation (this feature)

```text
specs/004-portal-views-news-upgrades/
├── plan.md              # Plan maestro de implementación
├── research.md          # Decisiones técnicas y alternativas evaluadas
├── data-model.md        # Esquema de tabla noticias, ampliaciones y RLS
├── quickstart.md        # Guía de verificación end-to-end
├── contracts/
│   └── services-and-edge-api.md  # Contratos de servicios y Edge Function
└── checklists/
    └── requirements.md  # Checklist de calidad de especificación
```

### Source Code (repository root)

```text
supabase/
├── migrations/
│   └── 20261123000001_news_admin_profile_enhancements.sql  # Tabla noticias, RLS astronomía/insignias, campos perfil
├── functions/
│   └── sync-andacollo-news/
│       └── index.ts                                        # Edge Function de sincronización RSS de Andacollo
└── seed.sql                                                # +10 noticias reales recientes de Andacollo y datos consistentes

src/
├── App.jsx                                                 # Nuevas rutas /admin/noticias, /admin/astronomia, /admin/experiencias
├── components/
│   └── layout/
│       └── AdminSidebar/AdminSidebar.jsx                   # Nuevos enlaces del menú administrativo
├── services/
│   ├── news.service.js                                     # Consulta y sincronización de noticias de Andacollo
│   ├── astronomy.service.js                                # Ampliado con CRUD administrativo de astronomía
│   ├── planner.service.js                                  # Itinerario de ejemplo y generador multi-entidad (lugares, eventos, experiencias, restaurantes)
│   └── gamification.service.js                             # Datos reales de perfil, insignias, desafíos y ranking
├── hooks/
│   ├── useHomeData.js                                      # Integración de noticias de Andacollo en Inicio
│   ├── useAstronomy.js                                     # Datos astronómicos sincronizados con BD
│   ├── useTripPlanner.js                                   # Carga de itinerario de ejemplo + generación + completar ruta
│   ├── useProfileStats.js                                  # Métricas reales (logros, favoritos, ranking, preferencias)
│   └── useGamification.js                                  # Datos reales de logros, desafíos completables y ranking
└── pages/
    ├── MapPage/
    │   ├── MapPage.jsx                                     # Estructura móvil limpia de buscador + filtros
    │   └── MapPage.css                                     # Fix responsivo móvil sin solapamientos ni overflow
    ├── HomePage/
    │   ├── HomePage.jsx                                    # Sección "Noticias de Andacollo" + modal de lectura
    │   └── HomePage.css                                    # Estilos de tarjetas y modal de noticias
    ├── AstronomyPage/
    │   ├── AstronomyPage.jsx                               # Fiel a mockup 8 turismo astronomico.jpg
    │   └── AstronomyPage.css                               # Estética nocturna y layout responsivo
    ├── ExperiencesPage/
    │   ├── ExperiencesPage.jsx                             # Fiel a mockup 11 experiencias locales.jpg
    │   └── ExperiencesPage.css                             # Layout de tarjetas y filtros
    ├── TripPlannerPage/
    │   ├── TripPlannerPage.jsx                             # Itinerario de ejemplo + generador por días/franjas
    │   └── TripPlannerPage.css                             # Estilos de línea de tiempo por Mañana/Tarde/Noche
    ├── ProfilePage/
    │   ├── ProfilePage.jsx                                 # Datos reales de BD, favoritos recientes, edición y preferencias
    │   └── ProfilePage.css                                 # Estilos actualizados de perfil
    ├── GamificationPage/
    │   ├── GamificationPage.jsx                            # Logros reales, desafíos interactivos y ranking comunitario
    │   └── GamificationPage.css                            # Estilos de ranking y medallas
    └── admin/
        ├── NewsAdminPage/                                  # CRUD de noticias + botón de sincronización automática
        │   ├── NewsAdminPage.jsx
        │   ├── NewsAdminPage.css
        │   └── index.js
        ├── AstronomyAdminPage/                             # Gestión de condiciones fijas, horarios, recursos y lugares astronómicos
        │   ├── AstronomyAdminPage.jsx
        │   ├── AstronomyAdminPage.css
        │   └── index.js
        └── ExperiencesAdminPage/                           # CRUD de experiencias con AdminCrudView
            ├── ExperiencesAdminPage.jsx
            └── index.js
```

**Structure Decision**: Se mantiene la arquitectura modular actual de proyecto único React (`src/pages`, `src/components`, `src/hooks`, `src/services`, `supabase/`) sin introducir capas adicionales ni dependencias externas, extendiendo el patrón `AdminCrudView` + `useAdminCrud` para los nuevos módulos administrativos.

## Complexity Tracking

No existen violaciones a la Constitución; no se requiere justificación de complejidad adicional.
