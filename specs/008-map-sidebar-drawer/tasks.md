# Tasks: Menú Lateral Ocultable y Vista Limpia del Mapa

**Input**: Design documents from `/specs/008-map-sidebar-drawer/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/map-drawer-ui.md`, `quickstart.md`

**Tests**: No se solicitaron pruebas automatizadas en la especificación; la validación se realiza mediante compilación de producción (`npm run build`) y los escenarios de verificación de `quickstart.md`.

**Organization**: Las tareas están agrupadas por historia de usuario para permitir implementación y validación incremental e independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias sobre tareas incompletas)
- **[Story]**: Historia de usuario a la que pertenece la tarea (`[US1]`, `[US2]`, `[US3]`)
- Cada tarea incluye la ruta exacta del archivo afectado.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar los puntos de entrada actuales de la vista del mapa antes de iniciar la refactorización.

- [X] T001 Revisar la estructura actual de estados, handlers y estilos en `src/pages/MapPage/MapPage.jsx` y `src/pages/MapPage/MapPage.css` para asegurar compatibilidad con `useMapExplorer` y `Icon`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establecer el estado base del cajón lateral oculto por defecto y la disposición a pantalla completa del mapa requerida por todas las historias de usuario.

**⚠️ CRITICAL**: Completar esta fase antes de implementar las historias de usuario.

- [X] T002 Añadir estado local `isDrawerOpen` inicializado en `false` y listener de teclado `Escape` (cuando `isDrawerOpen === true`) mediante `useEffect` en `src/pages/MapPage/MapPage.jsx`.
- [X] T003 [P] Ajustar el contenedor `.map-page` (`position: relative`) y `.map-area` (`width: 100%; height: 100%`) para que el mapa ocupe toda el área útil bajo el header sin depender del ancho del panel en `src/pages/MapPage/MapPage.css`.

**Checkpoint**: El mapa ocupa el 100% del área útil y existe el estado controlado `isDrawerOpen` listo para las historias de usuario.

---

## Phase 3: User Story 1 - Exploración del mapa a pantalla amplia con menú lateral ocultable (Priority: P1) 🎯 MVP

**Goal**: Ocultar el menú lateral por defecto al entrar al mapa y ofrecer un botón flotante estilo Google Maps para desplegar y cerrar el cajón lateral con buscador, filtros de categoría y listado de ubicaciones conservando su estado.

**Independent Test**: Abrir `/mapa`, comprobar que el mapa ocupa todo el ancho con el menú oculto, abrir el cajón con `Explorar lugares`, buscar y filtrar por categoría, cerrar con `X` o `Escape` y reabrir verificando que los filtros y búsqueda siguen activos.

### Implementation for User Story 1

- [X] T004 [US1] Implementar el botón flotante `.map-drawer-toggle` (ícono `menu`, texto `"Explorar lugares"`, indicador discreto cuando `activeFilter !== 'Todos'` o `searchQuery` no está vacío, `aria-expanded`, `aria-controls="map-explorer-drawer"`, `e.preventDefault()`) y la barra superior del cajón `#map-explorer-drawer` con título `"Explorar mapa"` y botón de cierre (`Icon name="x"`, `aria-label="Cerrar menú del mapa"`) en `src/pages/MapPage/MapPage.jsx`.
- [X] T005 [P] [US1] Implementar los estilos CSS del botón flotante `.map-drawer-toggle`, el cajón lateral superpuesto `.map-panel` / `.map-panel--open` (`position: absolute`, `width: 36rem`, `transform: translateX(-100%)` a `translateX(0)`, transición suave, `z-index`, sombra elevada y paleta oficial en `rem` base `10px`) y su cabecera `.map-panel__top` en `src/pages/MapPage/MapPage.css`.

**Checkpoint**: User Story 1 funcional e independientemente verificable (MVP).

---

## Phase 4: User Story 2 - Selección de ubicación sin cartel superior obstructivo (Priority: P1)

**Goal**: Eliminar por completo el cartel flotante superior `"Ubicación seleccionada"` al elegir cualquier ubicación en el mapa, manteniendo el enfoque del mapa y el acceso discreto a `"Ver detalles"`.

**Independent Test**: Abrir el menú lateral, seleccionar distintas ubicaciones de la lista y verificar que el mapa se centra en cada lugar sin renderizar ningún recuadro o texto `"Ubicación seleccionada"` en la parte superior del mapa.

### Implementation for User Story 2

- [X] T006 [US2] Eliminar por completo el bloque JSX `.map-focus` (pin animado superior y tarjeta `"Ubicación seleccionada"`) manteniendo `.map-selected-card` dentro del cajón lateral y `.map-mobile-preview` en móvil en `src/pages/MapPage/MapPage.jsx`.
- [X] T007 [P] [US2] Eliminar las reglas CSS obsoletas `.map-focus`, `.map-focus__pin`, `.map-focus__ring`, `.map-focus__card`, `.map-focus__kicker` y `@keyframes map-focus-pulse` (incluyendo sus overrides en `@media (max-width: 48rem)`) en `src/pages/MapPage/MapPage.css`.

**Checkpoint**: User Stories 1 y 2 operativas e independientemente verificables.

---

## Phase 5: User Story 3 - Búsqueda, filtrado y selección fluida en dispositivos móviles y escritorio (Priority: P2)

**Goal**: Unificar la experiencia móvil y de escritorio dentro del menú lateral ocultable, agregando backdrop de cierre táctil y cierre automático al seleccionar una ubicación en pantallas móviles sin solapamientos con controles del mapa.

**Independent Test**: Probar en vista móvil (`<= 768px`) abrir el menú lateral, buscar o filtrar, seleccionar una ubicación y comprobar que el cajón se cierra automáticamente mostrando el mapa limpio, la vista previa inferior y los controles de zoom/ruta accesibles.

### Implementation for User Story 3

- [X] T008 [US3] Eliminar el bloque duplicado `.map-mobile-results`, añadir el backdrop `.map-drawer-backdrop` cuando `isDrawerOpen` es `true`, y actualizar `selectPin` para cerrar automáticamente el cajón cuando `window.matchMedia('(max-width: 48rem)').matches` en `src/pages/MapPage/MapPage.jsx`.
- [X] T009 [P] [US3] Actualizar las reglas responsivas `@media (max-width: 48rem)` en `src/pages/MapPage/MapPage.css` para eliminar estilos de `.map-mobile-results`, mostrar `.map-place-list` desplazable dentro del cajón móvil (`width: min(34rem, 88vw)`), estilizar `.map-drawer-backdrop` y garantizar que `.map-drawer-toggle`, `.map-controls` y `.map-mobile-preview` no se superpongan.

**Checkpoint**: Todas las historias de usuario (US1, US2, US3) funcionan de forma fluida en escritorio y móvil.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificación final de accesibilidad, cumplimiento constitucional y compilación sin errores.

- [X] T010 Auditar accesibilidad (`aria-hidden`, `aria-expanded`, `aria-controls`, `aria-label` en español, `e.preventDefault()` en botones) y cumplimiento constitucional (cero `innerHTML`, cero `alert`/`confirm`/`prompt`, unidades `rem` base `10px`, paleta oficial) en `src/pages/MapPage/MapPage.jsx` y `src/pages/MapPage/MapPage.css`.
- [X] T011 Ejecutar compilación de producción (`npm run build`) y verificar todos los escenarios de validación definidos en `specs/008-map-sidebar-drawer/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias, se ejecuta primero (`T001`).
- **Phase 2 (Foundational)**: Depende de `T001`; `T002` (JSX) y `T003` (CSS) pueden ejecutarse en paralelo. Bloquea las fases de historias de usuario.
- **Phase 3 (US1 - P1 MVP)**: Depende de Phase 2. `T004` (JSX) y `T005` (CSS) pueden ejecutarse en paralelo.
- **Phase 4 (US2 - P1)**: Depende de Phase 2 (y secuencialmente en los mismos archivos tras US1 para evitar conflictos de edición). `T006` (JSX) y `T007` (CSS) pueden ejecutarse en paralelo.
- **Phase 5 (US3 - P2)**: Depende de US1 y US2. `T008` (JSX) y `T009` (CSS) pueden ejecutarse en paralelo.
- **Phase 6 (Polish)**: Depende de que US1, US2 y US3 estén completas (`T010` → `T011`).

### Parallel Opportunities

- Dentro de cada fase, la tarea de `MapPage.jsx` y la tarea de `MapPage.css` tocan archivos distintos y están marcadas con `[P]` para ejecutarse en paralelo:
  - Phase 2: `T002` || `T003`
  - Phase 3 (US1): `T004` || `T005`
  - Phase 4 (US2): `T006` || `T007`
  - Phase 5 (US3): `T008` || `T009`

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Completar Phase 1 (`T001`) y Phase 2 (`T002`, `T003`).
2. Completar Phase 3 (`T004`, `T005`) para habilitar el menú lateral ocultable estilo Google Maps.
3. Completar Phase 4 (`T006`, `T007`) para eliminar el recuadro superior `"Ubicación seleccionada"`.
4. Completar Phase 5 (`T008`, `T009`) para el comportamiento móvil óptimo (backdrop y auto-cierre).
5. Finalizar con Phase 6 (`T010`, `T011`) ejecutando `npm run build` y validando los escenarios de `quickstart.md`.
