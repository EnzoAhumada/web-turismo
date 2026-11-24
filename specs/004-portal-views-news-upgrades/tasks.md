# Tasks: Mejoras de Mapa Móvil, Noticias de Andacollo, Vistas Administrables (Astronomía y Experiencias), Itinerario de Planificador y Perfil con Ranking Real

**Input**: Design documents from `/specs/004-portal-views-news-upgrades/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/services-and-edge-api.md`, `quickstart.md`

**Tests**: No se solicitaron pruebas unitarias automatizadas explícitas; la validación se realiza mediante compilación limpia (`npm run build`) y escenarios end-to-end de `quickstart.md`.

**Organization**: Las tareas están agrupadas por Historia de Usuario (US1–US6) en orden de prioridad (P1 → P2 → P3) para permitir implementación y verificación independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia de tareas incompletas).
- **[Story]**: Historia de usuario asociada (`[US1]`–`[US6]`).

---

## Phase 1: Setup (Infraestructura Compartida)

**Purpose**: Preparar la estructura de directorios para los nuevos módulos administrativos y la función de sincronización de noticias.

- [X] T001 Crear directorios de nuevos módulos administrativos y Edge Function en `src/pages/admin/NewsAdminPage/`, `src/pages/admin/AstronomyAdminPage/`, `src/pages/admin/ExperiencesAdminPage/` y `supabase/functions/sync-andacollo-news/`

---

## Phase 2: Foundational (Prerrequisitos Bloqueantes de Base de Datos y Navegación Admin)

**Purpose**: Aplicar el esquema de base de datos, políticas RLS, datos semilla base y enlaces comunes de administración requeridos por las historias de usuario.

**⚠️ CRITICAL**: Completar esta fase antes de implementar las historias que dependen de las nuevas tablas/políticas.

- [X] T002 Crear migración SQL `supabase/migrations/20261123000001_news_admin_profile_enhancements.sql` con: tabla `public.noticias` (`titulo NOT NULL`, `slug UNIQUE`, `resumen NOT NULL`, `contenido NOT NULL`, `imagen_url`, `fuente NOT NULL DEFAULT 'Municipalidad de Andacollo'`, `url_externa` con índice único parcial `WHERE url_externa IS NOT NULL`, `categoria NOT NULL DEFAULT 'Comuna'`, `origen CHECK (origen IN ('manual', 'automatica'))`, `fecha_publicacion timestamptz NOT NULL DEFAULT now()`, `destacada boolean NOT NULL DEFAULT false`, `activa boolean NOT NULL DEFAULT true`, `comuna DEFAULT 'Andacollo'`, `region DEFAULT 'Coquimbo'`, `created_at`, `updated_at`) y políticas RLS (lectura pública si `activa = true OR public.is_admin()`, escritura para `public.is_admin()`); columnas en `public.profiles` (`biografia text DEFAULT ''`, `ciudad_origen text DEFAULT 'Región de Coquimbo'`, `preferencia_offline boolean NOT NULL DEFAULT false`); columna `updated_at` y políticas RLS de admin en `public.astronomia_condiciones`, `public.astronomia_horarios` y `public.astronomia_recursos`; ampliación de `CHECK` en `public.experiencias.categoria` a `('Tours', 'Gastronomía', 'Aventura', 'Astroturismo', 'Cultura')`; y política RLS de lectura pública en `public.usuario_insignias`
- [X] T003 Agregar 10 noticias recientes y reales de Andacollo (con `ON CONFLICT (slug) DO UPDATE`) en `supabase/seed.sql` cubriendo actualidad comunal, patrimonio religioso, astroturismo, minería, cultura y turismo local
- [X] T004 [P] Actualizar enlaces del menú lateral administrativo agregando Noticias (`/admin/noticias`), Astronomía (`/admin/astronomia`) y Experiencias (`/admin/experiencias`) en `src/components/layout/AdminSidebar/AdminSidebar.jsx`
- [X] T005 [P] Verificar iconos necesarios (`newspaper`/`file-text`, `moon-star`, `compass`, `refresh-cw`, `calendar`, `trophy`, `check-circle`) y agregar los faltantes en `src/components/ui/Icon/Icon.jsx`

**Checkpoint**: Esquema SQL, seed de 10 noticias, RLS e infraestructura de navegación listos.

---

## Phase 3: User Story 1 - Filtro de Búsqueda del Mapa Adaptado a Dispositivos Móviles (Priority: P1) 🎯 MVP

**Goal**: Garantizar que el buscador y los filtros de categoría del mapa se visualicen y operen de forma limpia, sin desbordamientos ni solapamientos en teléfonos móviles (360px–430px).

**Independent Test**: Abrir `/mapa` en viewport móvil (360×740 y 390×844), escribir y limpiar texto en el buscador, deslizar horizontalmente los filtros de categoría y tocar un marcador verificando que la tarjeta de vista previa queda visible sobre `BottomNav`.

### Implementation for User Story 1

- [X] T006 [US1] Ajustar estructura semántica y contenedor móvil de búsqueda/filtros (botón limpiar accesible y wrapper desplazable de chips) en `src/pages/MapPage/MapPage.jsx`
- [X] T007 [US1] Corregir estilos responsivos móviles (`100dvh`, compensación de `--bottom-nav-h`, `.map-panel__header` compacto, `.map-panel__search` con `min-width: 0`, `.map-panel__filters` en fila única con `flex-wrap: nowrap; overflow-x: auto`, y reposicionamiento de `.map-mobile-preview` y `.map-controls`) en `src/pages/MapPage/MapPage.css`

**Checkpoint**: User Story 1 completamente funcional y verificable en móvil y escritorio.

---

## Phase 4: User Story 2 - Noticias de Andacollo en Inicio con Gestión Administrativa y Actualización Automática (Priority: P1)

**Goal**: Mostrar noticias recientes de Andacollo en Inicio (con las 10 precargadas en BD), permitir gestionarlas desde el administrador y sincronizar automáticamente noticias desde una fuente local de Andacollo sin duplicados.

**Independent Test**: Abrir `/inicio` y verificar las 10 noticias de Andacollo con lectura completa en modal; ir a `/admin/noticias`, crear/editar/ocultar una noticia y verificar reflejo inmediato en Inicio; ejecutar sincronización automática/manual verificando cero duplicados y respaldo seguro ante fallo externo.

### Implementation for User Story 2

- [X] T008 [P] [US2] Crear Edge Function de sincronización de feeds RSS públicos de Andacollo con parseo seguro, timeout de 6s y deduplicación por `url_externa`/`slug` en `supabase/functions/sync-andacollo-news/index.ts`
- [X] T009 [P] [US2] Crear servicio de noticias `getLatestNews` y `syncAndacolloNews` (con fallback seguro si la Edge Function o red no responde) en `src/services/news.service.js`
- [X] T010 [US2] Integrar carga de noticias de Andacollo y verificación ligera no bloqueante de sincronización periódica en `src/hooks/useHomeData.js`
- [X] T011 [US2] Incorporar sección "Noticias de Andacollo" con tarjetas ordenadas, filtro rápido o indicador de fuente y modal estilizado de lectura completa (sin `innerHTML` ni diálogos nativos) en `src/pages/HomePage/HomePage.jsx` y `src/pages/HomePage/HomePage.css`
- [X] T012 [P] [US2] Crear módulo administrativo completo de noticias (CRUD con `useAdminCrud`/`AdminCrudView` + acción "Sincronizar fuente local" con feedback visual) en `src/pages/admin/NewsAdminPage/NewsAdminPage.jsx`, `src/pages/admin/NewsAdminPage/NewsAdminPage.css` y `src/pages/admin/NewsAdminPage/index.js`
- [X] T013 [US2] Registrar la ruta protegida `/admin/noticias` en `src/App.jsx`

**Checkpoint**: User Story 2 completamente funcional (Inicio + 10 noticias BD + Admin CRUD + sincronización automática).

---

## Phase 5: User Story 3 - Vista de Turismo Astronómico según Mockup con Datos Administrables (Priority: P2)

**Goal**: Alinear la vista de Turismo Astronómico al mockup `design/8 turismo astronomico.jpg` y permitir que todos sus datos fijos (condiciones del cielo, mejores horarios, recursos y lugares astronómicos recomendados) se administren desde el panel privado.

**Independent Test**: Abrir `/astronomia` y comprobar el diseño fiel al mockup; editar condiciones/horarios/lugares recomendados en `/admin/astronomia` y verificar actualización inmediata en `/astronomia`.

### Implementation for User Story 3

- [X] T014 [US3] Ampliar `src/services/astronomy.service.js` con funciones administrativas (`getAstronomyAdminData`, `saveAstronomyCondition`, `deleteAstronomyCondition`, `saveAstronomySchedule`, `deleteAstronomySchedule`, `saveAstronomyResource`, `deleteAstronomyResource`, `togglePlaceAstronomical`)
- [X] T015 [US3] Refinar `src/pages/AstronomyPage/AstronomyPage.jsx` y `src/pages/AstronomyPage/AstronomyPage.css` para reflejar fielmente el mockup `design/8 turismo astronomico.jpg` (encabezado nocturno "Ruta Astronómica / Observación de estrellas", panel "Condiciones actuales" de 3 columnas con iconos, fila "Mejores horarios" y tarjetas compactas de "Lugares recomendados" con enlace al detalle)
- [X] T016 [P] [US3] Crear módulo administrativo `src/pages/admin/AstronomyAdminPage/AstronomyAdminPage.jsx`, `src/pages/admin/AstronomyAdminPage/AstronomyAdminPage.css` y `src/pages/admin/AstronomyAdminPage/index.js` para gestionar condiciones fijas, horarios, recursos y selección de lugares astronómicos recomendados
- [X] T017 [US3] Registrar la ruta protegida `/admin/astronomia` en `src/App.jsx`

**Checkpoint**: User Story 3 completamente funcional y administrable desde `/admin/astronomia`.

---

## Phase 6: User Story 4 - Vista de Experiencias Locales Conectada a Datos Administrables (Priority: P2)

**Goal**: Alinear la vista de Experiencias al mockup `design/11 experiencias locales.jpg` con datos en BD y habilitar su gestión completa desde el panel de administración.

**Independent Test**: Abrir `/experiencias`, filtrar por `Todas`, `Tours`, `Gastronomía` y `Aventura` y abrir detalle; luego ir a `/admin/experiencias`, crear/editar/desactivar una experiencia y confirmar reflejo inmediato en `/experiencias`.

### Implementation for User Story 4

- [X] T018 [US4] Refinar `src/pages/ExperiencesPage/ExperiencesPage.jsx` y `src/pages/ExperiencesPage/ExperiencesPage.css` para alinear tarjetas, filtros de categoría (`Todas`, `Tours`, `Gastronomía`, `Aventura`), precio CLP y calificaciones con `design/11 experiencias locales.jpg`
- [X] T019 [P] [US4] Crear módulo administrativo `src/pages/admin/ExperiencesAdminPage/ExperiencesAdminPage.jsx` y `src/pages/admin/ExperiencesAdminPage/index.js` reutilizando `useAdminCrud` y `AdminCrudView` (campos: `nombre`, `categoria`, `descripcion`, `imagen_url`, `precio`, `duracion`, `rating_promedio`, `disponible`)
- [X] T020 [US4] Registrar la ruta protegida `/admin/experiencias` en `src/App.jsx`

**Checkpoint**: User Story 4 completamente funcional y administrable desde `/admin/experiencias`.

---

## Phase 7: User Story 5 - Planificador de Viajes con Itinerario de Ejemplo Estructurado (Priority: P2)

**Goal**: Mostrar de inmediato un itinerario de ejemplo realista de Andacollo organizado por días y franjas horarias (Mañana, Tarde, Noche) combinando lugares, experiencias, restaurantes y eventos reales de BD, y permitir generar variantes personalizadas y registrar la ruta completada.

**Independent Test**: Abrir `/planificador`, verificar el itinerario de ejemplo inmediato con paradas clicables a lugares, experiencias, restaurantes y eventos; ajustar duración/intereses/presupuesto y generar una nueva ruta; pulsar "Marcar ruta completada" y validar el feedback y actualización en perfil.

### Implementation for User Story 5

- [X] T021 [US5] Reescribir `src/services/planner.service.js` para implementar `getExampleItinerary`, `generateItinerary` (combinando `lugares`, `experiencias`, `restaurantes`, `eventos` y `rutas_paradas` por días y bloques Mañana/Tarde/Noche) y `completeItineraryForUser` (actualizando `rutas_completadas` y `xp` en `profiles`)
- [X] T022 [US5] Actualizar `src/hooks/useTripPlanner.js` para precargar el itinerario de ejemplo al montar, generar itinerarios personalizados por días/bloques y persistir rutas completadas con feedback visual
- [X] T023 [US5] Rediseñar `src/pages/TripPlannerPage/TripPlannerPage.jsx` y `src/pages/TripPlannerPage/TripPlannerPage.css` para presentar el formulario según `design/6 planificador de viajes.jpg` junto al itinerario de ejemplo/generado por días y franjas horarias con badges de tipo (`Lugar`, `Experiencia`, `Gastronomía`, `Evento`), costo estimado y enlaces directos a cada ficha

**Checkpoint**: User Story 5 completamente funcional con itinerario de ejemplo real y generador multi-entidad.

---

## Phase 8: User Story 6 - Vista de Perfil y Vista de Logros y Ranking con Datos Reales Útiles (Priority: P3)

**Goal**: Conectar `ProfilePage` y `GamificationPage` al 100% con datos reales de Supabase (`profiles`, `usuario_insignias`, `usuario_desafios`, `favoritos`), eliminar valores hardcodeados ficticios, habilitar edición útil del perfil/preferencias y mostrar un ranking comunitario real y desafíos interactivos.

**Independent Test**: Iniciar sesión con distintos usuarios semilla y verificar en `/perfil` y `/gamificacion` que todos los contadores, insignias, favoritos recientes, preferencias persistidas y posición en el ranking reflejan datos reales de BD; editar perfil y completar un desafío comprobando persistencia tras recargar.

### Implementation for User Story 6

- [X] T024 [US6] Ampliar `src/services/gamification.service.js` con `getProfileDashboardData(userId)`, `getGamificationData(userId)` (sin avatares/posiciones ficticias, con conteo real de insignias por usuario y posición real en ranking) y `completeUserChallenge(userId, challengeId, xpReward)`
- [X] T025 [US6] Actualizar `src/hooks/useProfileStats.js` para cargar datos reales de `getProfileDashboardData`, persistir `nombre`, `apellido`, `ciudad_origen`, `biografia`, `avatar_url` y `preferencia_offline` en `profiles`, y exponer favoritos recientes y posición en ranking
- [X] T026 [US6] Actualizar `src/hooks/useGamification.js` para consumir métricas reales del usuario autenticado, exponer acción `handleCompleteChallenge` con actualización de XP/nivel y refresco automático del ranking
- [X] T027 [P] [US6] Mejorar `src/pages/ProfilePage/ProfilePage.jsx` y `src/pages/ProfilePage/ProfilePage.css` eliminando fallbacks ficticios (`7`, `5`, `18`), mostrando conteos reales de logros, rutas, visitas, favoritos recientes, posición en el ranking, edición completa de datos y toggle persistente de modo offline
- [X] T028 [P] [US6] Mejorar `src/pages/GamificationPage/GamificationPage.jsx` y `src/pages/GamificationPage/GamificationPage.css` mostrando XP/nivel reales, medallas desbloqueadas vs bloqueadas con requisito de XP, desafíos activos completables y tabla de posiciones comunitaria real con posición del usuario destacada

**Checkpoint**: User Story 6 completamente funcional con datos reales persistidos en Perfil y Logros-Ranking.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Verificación integral de compilación, cumplimiento de la Constitución y consistencia visual/código.

- [X] T029 Verificar cumplimiento estricto de `AGENTS.md` y Constitución en todos los archivos nuevos y modificados (cero `alert`/`confirm`/`prompt`, cero `innerHTML`, `preventDefault()` en eventos, textos 100% en español, medidas en `rem`, sin nuevas dependencias en `package.json`)
- [X] T030 Ejecutar `npm run build` y validar los escenarios principales de `specs/004-portal-views-news-upgrades/quickstart.md` corrigiendo cualquier advertencia o error detectado

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias — inicia de inmediato.
- **Phase 2 (Foundational)**: Depende de Phase 1 — **BLOQUEA** US2, US3, US4 y US6 (US1 puede ejecutarse en paralelo al ser puramente de UI móvil).
- **Phase 3 (US1 - Mapa Móvil)**: Independiente tras Phase 1.
- **Phase 4 (US2 - Noticias)**: Depende de T002, T003, T004.
- **Phase 5 (US3 - Astronomía)**: Depende de T002, T004.
- **Phase 6 (US4 - Experiencias)**: Depende de T002, T004.
- **Phase 7 (US5 - Planificador)**: Depende de Phase 2 (usa catálogos reales existentes y `profiles`).
- **Phase 8 (US6 - Perfil y Ranking)**: Depende de T002.
- **Phase 9 (Polish)**: Depende de todas las historias completadas.

### Parallel Opportunities

- En Phase 2: `T004` y `T005` en paralelo tras `T002`/`T003`.
- En Phase 4 (US2): `T008`, `T009` y `T012` en paralelo.
- En Phase 5 (US3) y Phase 6 (US4): pueden ejecutarse en paralelo entre sí tras Phase 2 (`T014`–`T017` junto a `T018`–`T020`).
- En Phase 8 (US6): `T027` y `T028` en paralelo tras `T025`/`T026`.

### Implementation Strategy

- **MVP First**: Phase 1 → Phase 2 → Phase 3 (US1: Mapa Móvil) + Phase 4 (US2: Noticias de Andacollo).
- **Incremental Delivery**: Luego US3 (Astronomía) + US4 (Experiencias) → US5 (Planificador) → US6 (Perfil y Logros-Ranking) → Phase 9 (Validación y Build).
