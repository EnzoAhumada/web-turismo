# Quickstart Validation Guide: Vista Limpia del Mapa y Enlace Externo a Google Maps

**Feature**: `009-map-clean-google-link`  
**Spec**: [spec.md](./spec.md)  
**Contracts**: [map-clean-link-ui.md](./contracts/map-clean-link-ui.md)

## Prerequisites

- Node.js y dependencias del proyecto instaladas (`npm install`).
- Servidor de desarrollo ejecutándose en local (`npm run dev`).

## Build & Verification Commands

```bash
# 1. Compilar para verificar ausencia de errores de sintaxis o bundling
npm run build

# 2. Iniciar servidor local para verificación visual (escritorio y móvil)
npm run dev
```

## End-to-End Validation Scenarios

### Escenario 1 — Ausencia de la ayuda visual nativa de Google Maps (US1)
1. Abrir `/mapa` en escritorio (`>= 1280px`) y en vista móvil (`375px` / `390px`).
2. Verificar en la carga inicial que la esquina superior izquierda del mapa no muestra la tarjeta blanca de Google Maps (sin nombre de ubicación, sin estrellas ni enlace "Ampliar el mapa").
3. Abrir "Explorar lugares", seleccionar 2 o 3 ubicaciones distintas y probar acercar (`+`) y alejar (`-`).
4. **Resultado esperado**: El recuadro de ayuda visual de Google Maps nunca aparece, el marcador rojo queda centrado y los controles propios ("Explorar lugares", `+`, `-`, "Cómo llegar") permanecen visibles y operables.

### Escenario 2 — Enlace compacto externo en detalle resumido de escritorio (US2)
1. En escritorio, abrir "Explorar lugares" y seleccionar una ubicación de la lista.
2. Observar la tarjeta de detalle resumido al pie del panel lateral (`.map-selected-card`).
3. Confirmar que junto a "Ver detalles" aparece el enlace discreto y pequeño `Ver en Maps` con ícono de enlace externo, en armonía con la paleta y tipografía.
4. Hacer clic en `Ver en Maps`.
5. **Resultado esperado**: Se abre una nueva pestaña con la ubicación exacta en Google Maps (`google.com/maps/search/...`) mientras la vista `/mapa` permanece abierta intacta.
6. Seleccionar otra ubicación y verificar que el `href` del enlace se actualiza inmediatamente al nuevo lugar.

### Escenario 3 — Enlace compacto externo en detalle resumido móvil sin navegación accidental (US2 & US3)
1. En resolución móvil (`360px`–`430px`), abrir "Explorar lugares" y elegir una ubicación (el panel lateral se cierra automáticamente).
2. Observar la tarjeta compacta inferior sobre el mapa (`.map-mobile-preview`).
3. Verificar que no hay desbordamiento horizontal, el texto no se corta de forma desordenada y el enlace pequeño `Maps` convive armónicamente con las estrellas y la distancia.
4. Pulsar el enlace `Maps`.
5. **Resultado esperado**: Se abre Google Maps externo en una nueva pestaña y la app **no** navega a la ficha interna del lugar.
6. Volver a la tarjeta y pulsar el título, la imagen o la flecha derecha (`>`).
7. **Resultado esperado**: La app navega normalmente a la ficha completa del lugar.
