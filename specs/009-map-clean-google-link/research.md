# Research: Vista Limpia del Mapa y Enlace Externo a Google Maps

**Feature**: `009-map-clean-google-link`  
**Date**: 2026-11-25  
**Spec**: [spec.md](./spec.md)

## 1. Ocultamiento de la ayuda visual nativa de Google Maps en el mapa embebido

### Decision
Aplicar un recorte vertical simétrico (overscan CSS) en el contenedor `.map-canvas` (`overflow: hidden`) sobre el `<iframe>` `.map-canvas__frame`, desplazando el marco verticalmente hacia arriba (`top: -16rem`) y compensando la altura por igual arriba y abajo (`height: calc(100% + 32rem)`), con ajuste compacto en móvil (`top: -15rem; height: calc(100% + 30rem)`).

### Rationale
- El `<iframe>` de `maps.google.com/maps?...&output=embed` pertenece a un origen externo (cross-origin), por lo que el navegador impide modificar o eliminar su DOM interno mediante JavaScript o CSS inyectado.
- En la versión actual del embebido de Google Maps, la tarjeta blanca superior izquierda (`.place-card` con nombre del lugar, dirección, estrellas, "Cómo llegar" y "Ampliar el mapa") se renderiza siempre cuando `q=` resuelve una ubicación, ocupando aproximadamente entre `100px` y `145px` desde el borde superior del `<iframe>`.
- Al usar un desplazamiento **simétrico** (`-16rem` arriba y `+16rem` abajo = `+32rem` total, equivalente a `160px` con base `10px`), el punto medio vertical del `<iframe>` coincide exactamente con el punto medio vertical del contenedor visible `.map-canvas` (`(-16rem + H + 16rem) / 2 = H / 2`). Así, el marcador rojo central de Google Maps permanece perfectamente centrado sin desplazarse hacia arriba ni quedar oculto.
- Como beneficio adicional, el desplazamiento inferior también retira los controles nativos duplicados de zoom de Google Maps en la esquina inferior derecha, dejando exclusivamente los controles propios de la aplicación (`.map-controls`: acercar, alejar y "Cómo llegar").
- Cumple estrictamente con el Principio VI de la Constitución: **cero dependencias externas**, sin API keys de pago ni SDKs adicionales, y 100% en CSS3 nativo con medidas `rem`.

### Alternatives Considered
- **Parámetros URL (`iwloc=near` o `iwloc=`)**: No eliminan la tarjeta blanca superior izquierda (`place-card`) en el embebido moderno de Google Maps; solo afectan la burbuja flotante sobre el pin en versiones heredadas.
- **Capa blanca/opaca superpuesta (`div` tapa) sobre la esquina superior izquierda**: Generaría un parche visual artificial que taparía calles reales del mapa y rompería la estética limpia.
- **Migrar a Leaflet / MapLibre / Google Maps JS SDK**: Violaría la restricción constitucional de cero dependencias externas y/o requeriría facturación y clave de API externa, excediendo el alcance de esta mejora puntual.

---

## 2. URL estándar para abrir la ubicación seleccionada en Google Maps externo

### Decision
Agregar una función pura `googleMapsPlaceUrl(query)` en `src/lib/andacolloGeo.js` que construya la URL universal oficial de Google Maps:
`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

### Rationale
- Es el formato oficial documentado de Google Maps URLs para mostrar un lugar/ubicación (a diferencia de `/maps/dir/?api=1&destination=...`, que abre directamente el modo de indicaciones de ruta ya cubierto por el botón oscuro "Cómo llegar").
- Funciona de manera universal: en escritorio abre Google Maps en una nueva pestaña del navegador y en dispositivos móviles abre directamente la aplicación nativa de Google Maps si está instalada.
- Reutiliza `mapsQuery` ya calculado en `MapPage.jsx` (`selectedPin?.mapsQuery || 'Andacollo, Coquimbo, Chile'`), el cual ya garantiza incluir la referencia a Andacollo y Chile incluso si un registro no tiene dirección detallada.

### Alternatives Considered
- **Reutilizar `googleMapsDirectionsUrl`**: Abre directamente la pantalla de rutas ("Cómo llegar") en lugar de mostrar la ficha/ubicación en el mapa externo, lo que no responde exactamente a "ver en el mapa externo de Google".
- **Construir la URL inline dentro de `MapPage.jsx`**: Duplicaría lógica de URLs de Google Maps fuera de `src/lib/andacolloGeo.js`, rompiendo la modularidad ya establecida.

---

## 3. Estructura semántica y diseño armónico del enlace en las vistas de detalle resumido

### Decision
- **En escritorio (`.map-selected-card`)**: Agrupar las acciones en un contenedor flex `.map-selected-card__actions` que muestre "Ver detalles" como acción principal a la izquierda y un enlace compacto secundario `Ver en Maps` (con `<Icon name="external-link" size={12} />`) a su lado, con tipografía pequeña (`1.15rem`), color discreto (`var(--color-muted)` con hover a `var(--color-primary)` y fondo suave `var(--color-soft)`), sin aumentar la altura visual de la tarjeta.
- **En móvil (`.map-mobile-preview`)**: Refactorizar el contenedor raíz de `<Link>` a `<article className="map-mobile-preview">` para evitar enlaces anidados (`<a>` dentro de `<a>`, inválido en HTML5), manteniendo enlaces independientes `<Link>` para la imagen, título/subtítulo y flecha derecha hacia la ficha interna, e incorporando el enlace compacto `<a target="_blank" rel="noopener noreferrer">` (`Maps` con `<Icon name="external-link" size={11} />`) dentro de la fila de metadatos/acciones.

### Rationale
- En HTML5 está prohibido anidar elementos interactivos (`<a>` dentro de `<a>`). Separar la estructura en un `<article>` con enlaces hermanos garantiza validez semántica, accesibilidad por teclado/lector de pantalla y cumplimiento estricto de `FR-007` (pulsar el enlace externo nunca dispara accidentalmente la navegación interna a la ficha del lugar).
- El componente `Icon` ya incluye el ícono `external-link` (`src/components/ui/Icon/Icon.jsx`), evitando crear activos nuevos.
- Todas las medidas se expresan en `rem` con base `10px`, usando las variables CSS existentes del sistema de diseño.

### Alternatives Considered
- **Usar `event.stopPropagation()` en un `<a>` dentro de `<Link>`**: Produce HTML inválido (enlaces anidados) y comportamiento inconsistente en lectores de pantalla y navegadores móviles.
- **Botón prominente de ancho completo**: Contradice el requisito explícito del usuario ("debe ser algo chico y armonico con el diseño actual y sus demas elementos").
