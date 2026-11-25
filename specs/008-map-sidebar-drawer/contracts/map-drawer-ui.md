# UI Interaction Contract: Menú Lateral del Mapa

**Feature**: `008-map-sidebar-drawer`  
**Component**: `src/pages/MapPage/MapPage.jsx` + `src/pages/MapPage/MapPage.css`

## 1. Botón Flotante de Apertura (`.map-drawer-toggle`)

- **Visibilidad**: Visible cuando `isDrawerOpen === false`.
- **Ubicación**: Esquina superior izquierda del área del mapa (`.map-area`), con margen seguro para no obstruir los controles de zoom/ruta ubicados abajo a la derecha.
- **Contenido**:
  - Ícono `menu` (o `search`) de `Icon`.
  - Texto visible en español: `"Explorar lugares"` (y opcionalmente un pequeño indicador de filtro activo si `activeFilter !== 'Todos'` o `searchQuery` no está vacío).
- **Accesibilidad**:
  - `type="button"`
  - `aria-expanded={isDrawerOpen}`
  - `aria-controls="map-explorer-drawer"`
  - `aria-label="Abrir menú del mapa"`
- **Evento**: `onClick` previene comportamiento por defecto (`e.preventDefault()`) y establece `isDrawerOpen = true`.

## 2. Cajón Lateral Desplegable (`.map-panel` / `#map-explorer-drawer`)

- **Semántica**: `<aside id="map-explorer-drawer" className={...} aria-label="Menú de exploración del mapa" aria-hidden={!isDrawerOpen}>`
- **Estado cerrado**: Trasladado fuera del borde izquierdo (`transform: translateX(-100%)`), no intercepta clics sobre el mapa (`pointer-events: none`, `visibility: hidden` tras transición).
- **Estado abierto**: Superpuesto desde el borde izquierdo (`transform: translateX(0)`), con ancho máximo de `36rem` en escritorio y `min(34rem, 88vw)` en móvil, sombra elevada y fondo blanco/tema oficial.
- **Estructura interna**:
  1. **Barra superior del cajón**: Título corto `"Explorar mapa"` + botón de cierre (`<Icon name="x" />`, `aria-label="Cerrar menú del mapa"`).
  2. **Buscador**: `<input type="search" placeholder="Buscar en el mapa" aria-label="Buscar en el mapa" />` + botón limpiar (`aria-label="Limpiar búsqueda"`).
  3. **Categorías**: Grupo de chips (`role="group" aria-label="Filtrar por tipo"`) con todos los `filterTypes`.
  4. **Feedback / Estados**: `FeedbackBanner` (error), `LoadingState` (carga), `EmptyState` (sin resultados).
  5. **Lista de ubicaciones**: `<ul className="map-place-list">` desplazable verticalmente en todas las resoluciones.
  6. **Tarjeta de lugar seleccionado**: `.map-selected-card` con acceso `"Ver detalles"` visible en escritorio dentro del cajón.

## 3. Fondo de Cierre en Móvil (`.map-drawer-backdrop`)

- **Visibilidad**: Activo cuando `isDrawerOpen === true` en viewports estrechos (`<= 48rem`), o clicable fuera del cajón en móvil para cerrarlo.
- **Evento**: `onClick` cierra el cajón (`isDrawerOpen = false`).

## 4. Ausencia de Banner Superior de Selección

- El bloque `.map-focus` (incluyendo el texto `"Ubicación seleccionada"`, su pin animado superior y su tarjeta oscura en la esquina superior izquierda del mapa) **no debe renderizarse** en ningún estado ni resolución.

## 5. Controles del Mapa y Vista Previa Móvil

- **Controles de zoom y navegación** (`.map-controls`): Permanecen abajo a la derecha sin quedar cubiertos por el botón flotante ni por la vista previa móvil.
- **Vista previa móvil** (`.map-mobile-preview`): En pantallas `<= 48rem`, cuando hay `selectedPin` y el cajón está cerrado, sigue mostrándose en la parte inferior con acceso directo a la ficha del lugar (`selectedPin.to`).
