# Tasks: Vista Limpia del Mapa y Enlace Externo a Google Maps

**Input**: Design documents from `/specs/009-map-clean-google-link/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/map-clean-link-ui.md`, `quickstart.md`

**Tests**: No se solicitaron pruebas automatizadas en la especificación; la validación se realiza mediante compilación de producción (`npm run build`) y verificación end-to-end según `quickstart.md`.

**Organization**: Las tareas están agrupadas por historia de usuario (US1, US2, US3) para permitir implementación y validación independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias en tareas incompletas)
- **[Story]**: Historia de usuario a la que pertenece (`[US1]`, `[US2]`, `[US3]`)
- Cada tarea incluye la ruta exacta del archivo a modificar o verificar

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la disponibilidad del ícono `external-link` y la estructura base antes de aplicar cambios.

- [X] T001 Verificar la exportación del ícono `external-link` en `src/components/ui/Icon/Icon.jsx` y las utilidades actuales de Google Maps en `src/lib/andacolloGeo.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Proveer la utilidad compartida de URL externa de Google Maps requerida por las vistas de detalle resumido.

**⚠️ CRITICAL**: Completar esta fase antes de implementar el enlace externo en la interfaz (US2/US3).

- [X] T002 Agregar la función pura `googleMapsPlaceUrl(query)` que retorne `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` en `src/lib/andacolloGeo.js`

**Checkpoint**: Utilidad `googleMapsPlaceUrl` lista para ser consumida desde `MapPage.jsx`.

---

## Phase 3: User Story 1 - Mapa libre de la tarjeta informativa superpuesta de Google Maps (Priority: P1) 🎯 MVP

**Goal**: Eliminar visualmente la tarjeta informativa nativa de Google Maps (nombre, estrellas y "Ampliar el mapa") del área visible del mapa en escritorio y móvil, manteniendo centrado el marcador y operables todos los controles propios.

**Independent Test**: Abrir `/mapa` en escritorio y móvil, seleccionar varias ubicaciones y usar los botones de zoom (`+` / `-`), verificando que el recuadro blanco de Google Maps nunca es visible y que el pin rojo permanece centrado.

### Implementation for User Story 1

- [X] T003 [US1] Asegurar `overflow: hidden` en `.map-canvas` y aplicar recorte vertical simétrico (`position: absolute; left: 0; top: -16rem; width: 100%; height: calc(100% + 32rem);`) a `.map-canvas__frame` en `src/pages/MapPage/MapPage.css`
- [X] T004 [US1] Ajustar el recorte vertical simétrico en vista móvil (`@media (max-width: 48rem)`) con `top: -15rem; height: calc(100% + 30rem);` para `.map-canvas__frame` en `src/pages/MapPage/MapPage.css`

**Checkpoint**: La vista del mapa se muestra limpia sin la ayuda visual de Google Maps en todas las resoluciones y niveles de zoom.

---

## Phase 4: User Story 2 - Enlace discreto a Google Maps externo en la vista de detalle resumido (Priority: P1)

**Goal**: Incorporar un enlace compacto, accesible y dinámico hacia Google Maps externo en ambas vistas de detalle resumido (panel lateral en escritorio y tarjeta compacta inferior en móvil), evitando enlaces anidados y navegación accidental.

**Independent Test**: Seleccionar una ubicación en escritorio y en móvil, pulsar el enlace externo a Google Maps desde la tarjeta de detalle resumido y confirmar que abre el destino exacto en una nueva pestaña sin abandonar `/mapa` ni disparar la navegación interna; cambiar de ubicación y confirmar que el enlace se actualiza dinámicamente.

### Implementation for User Story 2

- [X] T005 [US2] Importar `googleMapsPlaceUrl` desde `../../lib/andacolloGeo` y derivar `externalMapsUrl = googleMapsPlaceUrl(mapsQuery)` en `src/pages/MapPage/MapPage.jsx`
- [X] T006 [US2] Agrupar el enlace `<Link to={selectedPin.to}>Ver detalles</Link>` junto al enlace compacto externo `<a href={externalMapsUrl} target="_blank" rel="noopener noreferrer" aria-label={...}>` con `<Icon name="external-link" size={12} />` y texto `"Ver en Maps"` dentro de `.map-selected-card__actions` en `src/pages/MapPage/MapPage.jsx`
- [X] T007 [US2] Refactorizar `.map-mobile-preview` de `<Link>` raíz a `<article className="map-mobile-preview" aria-label={...}>` con enlaces hermanos `<Link>` para imagen, título/categoría y flecha derecha, e insertar el enlace compacto externo `<a href={externalMapsUrl} target="_blank" rel="noopener noreferrer" aria-label={...}>` con `<Icon name="external-link" size={11} />` y texto `"Maps"` en `.map-mobile-preview__meta` en `src/pages/MapPage/MapPage.jsx`

**Checkpoint**: Ambas tarjetas de detalle resumido ofrecen acceso directo en 1 clic/toque a Google Maps externo sin enlaces anidados y con actualización reactiva al cambiar de pin.

---

## Phase 5: User Story 3 - Armonía visual y experiencia responsiva en escritorio y móvil (Priority: P2)

**Goal**: Estilizar el enlace externo en escritorio y móvil con proporciones pequeñas, jerarquía secundaria clara, colores oficiales en `rem` (base `10px`) y adaptación limpia desde `360px` de ancho sin desbordamientos ni saltos desordenados.

**Independent Test**: Inspeccionar la tarjeta de detalle resumido en escritorio (`>= 1280px`) y móvil (`360px`–`430px`) con nombres de lugares cortos y largos, verificando alineación armónica, contraste, estados hover/focus y ausencia de recortes o superposiciones.

### Implementation for User Story 3

- [X] T008 [US3] Agregar los estilos en `rem` para `.map-selected-card__actions` y `.map-selected-card__maps-link` (pill sutil con `font-size: 1.15rem`, colores `--color-soft`, `--color-border`, `--color-muted` y hover/focus a `--color-primary`) en `src/pages/MapPage/MapPage.css`
- [X] T009 [US3] Agregar los estilos responsivos en `rem` dentro de `@media (max-width: 48rem)` para `.map-mobile-preview__heading`, `.map-mobile-preview__maps-link` (compacto y armónico junto a estrellas y distancia con `flex-wrap: wrap`) y `.map-mobile-preview__go` en `src/pages/MapPage/MapPage.css`

**Checkpoint**: El diseño del enlace externo resulta compacto, accesible y visualmente armónico con el resto de la aplicación en escritorio y móvil.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificación integral de compilación, accesibilidad, cumplimiento constitucional y escenarios de `quickstart.md`.

- [X] T010 Ejecutar `npm run build` y validar ausencia de errores de compilación y bundling en el proyecto
- [X] T011 Verificar cumplimiento de la Constitución (`rem` base `10px`, español obligatorio, sin `innerHTML`, sin diálogos nativos, `rel="noopener noreferrer"`, sin `<a>` anidados) y validar los 3 escenarios de `specs/009-map-clean-google-link/quickstart.md` en `src/pages/MapPage/MapPage.jsx` y `src/pages/MapPage/MapPage.css`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias; inicia de inmediato.
- **Phase 2 (Foundational)**: Depende de Phase 1; bloquea Phase 4 (US2).
- **Phase 3 (US1 - P1)**: Puede ejecutarse de forma independiente en `MapPage.css` (no depende de Phase 2).
- **Phase 4 (US2 - P1)**: Depende de Phase 2 (`googleMapsPlaceUrl` en `andacolloGeo.js`).
- **Phase 5 (US3 - P2)**: Depende de Phase 4 (clases JSX introducidas en `MapPage.jsx`) y edita `MapPage.css` después de Phase 3.
- **Phase 6 (Polish)**: Depende de completar Phases 3, 4 y 5.

### Parallel Opportunities

- `T002` (`src/lib/andacolloGeo.js`) y `T003`–`T004` (`src/pages/MapPage/MapPage.css`) tocan archivos distintos y pueden ejecutarse en paralelo.
- `T005`–`T007` (`src/pages/MapPage/MapPage.jsx`) pueden ejecutarse en paralelo con `T003`–`T004` (`src/pages/MapPage/MapPage.css`) una vez completada `T002`.

---

## Parallel Example: MVP + External Link

```bash
# En paralelo tras T001:
Task: "T002 Agregar googleMapsPlaceUrl(query) en src/lib/andacolloGeo.js"
Task: "T003-T004 Recorte vertical simétrico en src/pages/MapPage/MapPage.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Completar Phase 1 (`T001`) y Phase 2 (`T002`).
2. Completar Phase 3 (`T003`–`T004`): mapa limpio sin tarjeta nativa de Google Maps.
3. Completar Phase 4 (`T005`–`T007`): enlace compacto a Google Maps externo en escritorio y móvil sin enlaces anidados.
4. Completar Phase 5 (`T008`–`T009`): pulido visual armónico en `rem` para escritorio y móvil.
5. Completar Phase 6 (`T010`–`T011`): build de producción y validación end-to-end de `quickstart.md`.
