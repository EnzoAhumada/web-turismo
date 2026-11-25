# Research & Technical Decisions: Menú Lateral Ocultable y Vista Limpia del Mapa

**Feature**: `008-map-sidebar-drawer`  
**Date**: 2026-11-24

## 1. Patrón de menú lateral ocultable (estilo Google Maps)

- **Decision**: Implementar el panel lateral (`.map-panel`) como un cajón superpuesto (*overlay drawer*) posicionado de forma absoluta sobre el costado izquierdo de `.map-page`, oculto por defecto (`isDrawerOpen = false`), con transición suave en `transform: translateX(...)` y botón flotante de apertura sobre la esquina superior izquierda del mapa.
- **Rationale**:
  - Al usar un cajón superpuesto en lugar de cambiar el ancho del contenedor flex del mapa, el `<iframe>` de Google Maps mantiene un tamaño constante del 100% del viewport disponible y no sufre saltos visuales ni recargas innecesarias al abrir/cerrar el menú.
  - Mantiene el patrón visual familiar de Google Maps: botón flotante limpio para abrir búsqueda/lugares y panel desplegable con sombra elevada que agrupa buscador, chips de categorías, listado y resumen del lugar seleccionado.
  - Garantiza que al entrar a la vista del mapa se cumpla ampliamente el objetivo de ≥90% del área útil visible para el mapa.
- **Alternatives considered**:
  - *Sidebar flex colapsable (cambiando `width` de `36rem` a `0`)*: Provoca reflujo del `<iframe>` del mapa en cada animación y resulta incómodo en pantallas medianas y móviles. Descartado.
  - *Bottom sheet móvil + sidebar fijo en escritorio*: En escritorio seguiría restando `36rem` fijos al mapa y no cumpliría la solicitud de tener el menú lateral oculto por defecto para mostrar más mapa. Descartado.

## 2. Eliminación del recuadro superior "Ubicación seleccionada"

- **Decision**: Eliminar completamente el bloque `.map-focus` (y sus estilos asociados `.map-focus`, `.map-focus__pin`, `.map-focus__ring`, `.map-focus__card`, `.map-focus__kicker` y `@keyframes map-focus-pulse`) de `MapPage.jsx` y `MapPage.css`.
- **Rationale**:
  - Responde de forma exacta a la solicitud del usuario ("Al seleccionar una ubicacion en el mapa, quita la parte de arriba que dice ubicacion seleccionada").
  - Al quedar libre la esquina superior izquierda del mapa, el botón flotante de apertura del menú lateral ("Explorar mapa" / botón menú + búsqueda) se ubica cómodamente en esa zona sin colisiones ni solapamientos.
  - El usuario conserva acceso claro a la ficha del lugar seleccionado a través de `.map-selected-card` (dentro del cajón lateral en escritorio) y `.map-mobile-preview` (tarjeta compacta inferior en móvil, y opcionalmente también un acceso compacto en escritorio si está cerrado, manteniendo limpia la parte superior).
- **Alternatives considered**:
  - *Ocultar solo el texto kicker "Ubicación seleccionada" dejando el pin/tarjeta arriba*: Seguiría tapando la zona superior del mapa al seleccionar un lugar. Descartado.

## 3. Comportamiento responsivo (escritorio vs. móvil) y accesibilidad

- **Decision**:
  - **Estado inicial**: `isDrawerOpen = false` en todas las resoluciones.
  - **Botón flotante de apertura**: Visible cuando el cajón está cerrado (esquina superior izquierda del área del mapa). Muestra ícono `menu` y texto corto en español (`Explorar lugares` o `Buscar en el mapa`) + indicador discreto si hay filtro o búsqueda activa.
  - **Cierre del cajón**:
    - Botón explícito de cierre (`x`) en la cabecera del cajón lateral con `aria-label="Cerrar menú del mapa"`.
    - Tecla `Escape` mediante listener en `window` cuando el cajón está abierto.
    - En pantallas móviles (`<= 48rem`), renderizar un fondo semitransparente (`.map-drawer-backdrop`) que cierra el cajón al hacer clic/tocar fuera, y cerrar automáticamente el cajón al seleccionar una ubicación (`selectPin`) para mostrar de inmediato el mapa enfocado y la tarjeta inferior `.map-mobile-preview`.
  - **Unificación móvil/escritorio**: Como ahora el buscador, las categorías y la lista completa de ubicaciones viven dentro del cajón lateral ocultable en todas las resoluciones, ya no es necesario el bloque `.map-mobile-results` duplicado que ocupaba la parte superior en móvil. En móvil, el cajón lateral muestra la misma estructura limpia (buscador + filtros + lista completa desplazable).
- **Rationale**:
  - Simplifica el DOM y el CSS eliminando controles duplicados entre móvil y escritorio.
  - En móvil libera casi toda la pantalla que antes consumía el encabezado apilado (buscador + filtros + tira de pills).
  - Cumple con los principios de accesibilidad (`aria-expanded`, `aria-controls`, `aria-label`, soporte de teclado `Escape`, `event.preventDefault()` en botones interactivos).
- **Alternatives considered**:
  - *Mantener la barra superior móvil fija y ocultar solo la lista*: Seguiría ocultando un 25%-30% del mapa en móvil. Descartado.

## 4. Cumplimiento de restricciones del stack y constitución

- **Decision**: Implementar todos los cambios exclusivamente en `src/pages/MapPage/MapPage.jsx` y `src/pages/MapPage/MapPage.css` usando React 18, HTML5 semántico, CSS3 nativo con unidades `rem` (base `10px`), variables CSS del tema existente e íconos ya provistos por `src/components/ui/Icon/Icon.jsx`.
- **Rationale**:
  - Cero dependencias externas nuevas.
  - No requiere cambios en `useMapExplorer.js`, `map.service.js`, ni en Supabase.
  - Mantiene intactos los estilos oficiales (`--color-primary`, `--color-navy`, `--color-gold`, `--color-white`, `--color-soft`) y el feedback 100% visual en el DOM.
