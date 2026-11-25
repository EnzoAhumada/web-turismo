# Tasks: Perfil de Usuario, Galería Interactiva, Submenú de Reservas y Unificación Visual Clara

**Input**: Design documents from `/specs/007-profile-gallery-booking-theme/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/ui-contracts.md`, `quickstart.md`

**Tests**: No se solicitaron pruebas automatizadas en la especificación; la validación se realiza mediante compilación (`npm run build`) y los escenarios end-to-end de `quickstart.md`.

**Organization**: Las tareas están agrupadas por historia de usuario (US1–US4) para permitir implementación y validación incremental e independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias sobre tareas incompletas)
- **[Story]**: Historia de usuario a la que pertenece (`US1`, `US2`, `US3`, `US4`)
- Todas las tareas incluyen rutas exactas de archivo

---

## Phase 1: Setup (Shared Design Tokens Verification)

**Purpose**: Verificar disponibilidad de tokens claros oficiales y utilidades CSS base antes de modificar vistas.

- [X] T001 Verificar y ajustar (si falta algún token auxiliar de superficie clara/acento) los tokens de paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`) y utilidades base en `src/styles/variables.css` y `src/styles/global.css`

---

## Phase 2: Foundational (Blocking Shared UI Components)

**Purpose**: Crear y armonizar los componentes modales compartidos que serán reutilizados por Astrofotos y ambas vistas de perfil.

**⚠️ CRITICAL**: Completar antes de integrar el visor en Astrofotos y perfiles.

- [X] T002 [P] Crear el componente reutilizable `AstroPhotoModal` (imagen ampliada, spot, título, descripción, grilla EXIF con respaldo `"No especificado"`, enlace al autor opcional con `hideAuthorLink`, botón interactivo de «Me gusta», cierre con botón/backdrop/tecla `Escape` y `e.preventDefault()`) en `src/components/ui/AstroPhotoModal/AstroPhotoModal.jsx`, `src/components/ui/AstroPhotoModal/AstroPhotoModal.css` y `src/components/ui/AstroPhotoModal/index.js`
- [X] T003 [P] Adaptar el modal de subida de fotografías a la paleta clara oficial (`#FFFFFF`, `#F5F7FA`, `#071B3A`, `#FFB800`, bordes `#e2e8f0`) en `src/components/ui/AstroPhotoUploadModal/AstroPhotoUploadModal.css`

**Checkpoint**: Componentes modales reutilizables listos en tema claro.

---

## Phase 3: User Story 1 - Unificación Visual con Paleta Clara en Astronomía, Astrofotos, Guías y Reservas (Priority: P1) 🎯 MVP

**Goal**: Migrar las vistas de Astronomía, Astrofotos, Guías y el módulo de Servicios y Reserva desde tema oscuro hacia fondos y tarjetas claros coherentes con el resto de la aplicación.

**Independent Test**: Abrir `/astronomia`, `/fotografia`, `/guias` y el módulo de reserva en una ficha de detalle (escritorio y móvil 360px) y comprobar fondos claros `#F5F7FA`, tarjetas `#FFFFFF`, tipografía `#071B3A`/`#1a2b45` y acentos `#FFB800`/`#FF9D00` con alto contraste.

### Implementation for User Story 1

- [X] T004 [P] [US1] Retirar `page-wrapper--dark` y `darkNav` en `src/pages/AstronomyPage/AstronomyPage.jsx` y rediseñar `src/pages/AstronomyPage/AstronomyPage.css` con la paleta clara oficial y formato de tarjetas coherente con el resto del portal
- [X] T005 [P] [US1] Retirar `page-wrapper--dark` y `darkNav`, reemplazar el modal inline por el componente compartido `AstroPhotoModal` en `src/pages/AstroGalleryPage/AstroGalleryPage.jsx` y rediseñar `src/pages/AstroGalleryPage/AstroGalleryPage.css` con la paleta clara oficial
- [X] T006 [P] [US1] Retirar `page-wrapper--dark` y `darkNav` en `src/pages/GuidesPage/GuidesPage.jsx` y rediseñar `src/pages/GuidesPage/GuidesPage.css` con la paleta clara oficial y tarjetas limpias
- [X] T007 [P] [US1] Rediseñar el módulo de reservas (cabecera, highlights, galería, paquetes, horarios, formulario, pases activos y lightbox interno) con la paleta clara oficial en `src/components/ui/BookingSection/BookingSection.css`

**Checkpoint**: User Story 1 completa y verificable de forma independiente en las 4 áreas solicitadas.

---

## Phase 4: User Story 2 - Submenú de Servicios y Reserva dentro de la Vista de Detalle (Priority: P1)

**Goal**: Mover el módulo de Servicios y Reserva fuera del cuerpo directo del detalle hacia un submenú interno de pestañas (`Información y Detalle` / `Servicios y Reserva`) visible solo cuando el elemento tiene servicios reservables configurados.

**Independent Test**: Abrir un lugar con reservas (ej. Observatorio Collowara) y verificar que carga en `Información y Detalle` sin formulario incrustado; pulsar `Servicios y Reserva` para ver el módulo completo; abrir un lugar sin reservas y confirmar que no aparece la pestaña de reserva.

### Implementation for User Story 2

- [X] T008 [US2] Actualizar `src/components/ui/BookingSection/BookingSection.jsx` para aceptar una prop opcional `booking` inyectada desde `DetailLayout` (evitando consultas duplicadas a `useEntityBooking` y preservando estado al alternar pestañas)
- [X] T009 [US2] Implementar el submenú interno accesible (`role="tablist"`, pestañas `Información y Detalle` por defecto y `Servicios y Reserva` con contador de pases activos solo cuando `!booking.loading && Boolean(booking.config)`, reiniciando `activeTab` a `'detalle'` al cambiar `entityId`) en `src/components/layout/DetailLayout/DetailLayout.jsx` y agregar sus estilos responsivos claros en `src/components/layout/DetailLayout/DetailLayout.css`
- [X] T010 [P] [US2] Reemplazar `bookingSection` inline por `bookingProps={{ entityType: 'lugar', entityId: id, entityName: place?.nombre }}` en `src/pages/PlaceDetailPage/PlaceDetailPage.jsx`
- [X] T011 [P] [US2] Reemplazar `bookingSection` inline por `bookingProps` en `src/pages/RestaurantDetailPage/RestaurantDetailPage.jsx` y `src/pages/AccommodationDetailPage/AccommodationDetailPage.jsx`
- [X] T012 [P] [US2] Reemplazar `bookingSection` inline por `bookingProps` en `src/pages/EventDetailPage/EventDetailPage.jsx` y `src/pages/ExperienceDetailPage/ExperienceDetailPage.jsx`

**Checkpoint**: User Story 2 completa; todas las fichas de detalle muestran reservas exclusivamente mediante submenú interno cuando están configuradas.

---

## Phase 5: User Story 3 - Vista Propia de Perfil del Usuario Autentificado y Consulta de Perfiles de Otros Usuarios (Priority: P2)

**Goal**: Consolidar una vista propia clara y estructurada de visualización de datos para el usuario autentificado (separando la edición de cuenta) y armonizar la vista de perfil público de otros usuarios con el mismo lenguaje visual claro y sin exponer datos privados.

**Independent Test**: Iniciar sesión y revisar `/perfil` (visualización clara de datos propios + panel de edición separado); abrir el perfil de otro usuario en `/usuario/:handleOrId` o `/fotografo/:handleOrId` verificando datos públicos, acción de seguir y ausencia de controles privados.

### Implementation for User Story 3

- [X] T013 [P] [US3] Añadir el alias de ruta pública `/usuario/:handleOrId` apuntando a `PhotographerProfilePage` (manteniendo `/fotografo/:handleOrId` activo) en `src/App.jsx`
- [X] T014 [US3] Reorganizar `src/pages/ProfilePage/ProfilePage.jsx` retirando `page-wrapper--dark`/`darkNav`, presentando una ficha propia clara de visualización de datos del usuario autentificado (identidad, origen, biografía, nivel/XP, métricas, reservas activas, solicitudes de guías, gear bag, insignias, portafolio y favoritos) con la edición de datos y configuración claramente separadas, y rediseñar `src/pages/ProfilePage/ProfilePage.css` con la paleta clara oficial
- [X] T015 [US3] Armonizar `src/pages/PhotographerProfilePage/PhotographerProfilePage.jsx` retirando `page-wrapper--dark`/`darkNav` y mostrando datos públicos completos del usuario (incluyendo ciudad de origen, nivel/rol, biografía, estadísticas, gear bag, insignias y botón de seguir o `"Ir a Mi Perfil"` si es el propio usuario, sin exponer reservas ni edición), y rediseñar `src/pages/PhotographerProfilePage/PhotographerProfilePage.css` con la paleta clara oficial

**Checkpoint**: User Story 3 completa; perfil propio y perfil de terceros comparten estética clara y respetan estrictamente privacidad.

---

## Phase 6: User Story 4 - Visualización Interactiva de Fotos en la Galería del Perfil de Usuario (Priority: P2)

**Goal**: Permitir que al seleccionar cualquier fotografía dentro de la galería del perfil propio o del perfil de otro usuario se abra el visor interactivo `AstroPhotoModal` (igual que en Astrofotos) con sincronización en tiempo real de «Me gusta».

**Independent Test**: Hacer clic en una foto en `/perfil` y en `/usuario/:handleOrId`, verificar apertura del modal con imagen ampliada, EXIF y «Me gusta» sincronizado sin salir de la página, y cierre limpio con botón/backdrop/`Escape`.

### Implementation for User Story 4

- [X] T016 [P] [US4] Implementar `handleTogglePhotoLike(photo)` en `src/hooks/useProfileStats.js` invocando `toggleAstroPhotoLike` de `src/services/astrophotos.service.js` y actualizando `astroPhotos` (y métricas derivadas) inmediatamente en estado
- [X] T017 [P] [US4] Implementar `handleTogglePhotoLike(photo)` en `src/hooks/usePhotographerProfile.js` invocando `toggleAstroPhotoLike` (con `FeedbackBanner` informativo si no hay sesión) y actualizando `data.photos` y `data.stats.totalLikes` inmediatamente en estado
- [X] T018 [US4] Conectar las tarjetas de la galería en `src/pages/ProfilePage/ProfilePage.jsx` para abrir `AstroPhotoModal` (con `activePhotoId`, `hideAuthorLink`, `onToggleLike={handleTogglePhotoLike}`) en lugar de redirigir a `/fotografia`
- [X] T019 [US4] Conectar las tarjetas de la galería en `src/pages/PhotographerProfilePage/PhotographerProfilePage.jsx` para abrir `AstroPhotoModal` (con `activePhotoId`, `hideAuthorLink`, `onToggleLike={handleTogglePhotoLike}`) y agregar indicador visual interactivo en `src/pages/PhotographerProfilePage/PhotographerProfilePage.css`

**Checkpoint**: User Story 4 completa; la galería de fotos en ambos perfiles funciona exactamente como en el menú Astrofotos.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Auditoría constitucional, validación responsiva y verificación final de compilación.

- [X] T020 Auditar todos los archivos modificados para verificar cumplimiento estricto de la Constitución (cero `innerHTML`, cero `alert`/`confirm`/`prompt`, `e.preventDefault()` en manejadores, unidades `rem`, 100% textos en español y responsividad desde `360px`)
- [X] T021 Ejecutar `npm run build` para verificar compilación limpia sin errores ni imports rotos y repasar los escenarios de validación en `specs/007-profile-gallery-booking-theme/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)** → **Phase 2 (Foundational)**: `T002` y `T003` pueden correr en paralelo tras `T001`.
- **Phase 3 (US1)** depende de Phase 2 (`T005` usa `AstroPhotoModal` creado en `T002`). Todas las tareas `T004`, `T005`, `T006`, `T007` son paralelizables entre sí.
- **Phase 4 (US2)** depende de `T007` (estilos claros de reserva, aunque funcionalmente independiente) y sigue orden `T008` → `T009` → (`T010`, `T011`, `T012` en paralelo).
- **Phase 5 (US3)** depende de Phase 1/2 (`T013`, `T014`, `T015` pueden ejecutarse en paralelo).
- **Phase 6 (US4)** depende de `T002` y Phase 5 (`T016` y `T017` en paralelo → `T018` y `T019` en paralelo).
- **Phase 7 (Polish)** depende de la finalización de US1–US4.

### Implementation Strategy (MVP First)
1. **MVP**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2) — entrega de inmediato la paleta clara unificada y el submenú de Servicios y Reserva en fichas de detalle.
2. **Incremento 2**: Phase 5 (US3) + Phase 6 (US4) — entrega las vistas de perfil armonizadas y el visor interactivo de galería en perfiles.
3. **Cierre**: Phase 7 — auditoría constitucional y `npm run build`.
