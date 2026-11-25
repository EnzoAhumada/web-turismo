# UI & Helper Contract: Vista Limpia del Mapa y Enlace Externo a Google Maps

**Feature**: `009-map-clean-google-link`  
**Date**: 2026-11-25

## 1. Utility Contract (`src/lib/andacolloGeo.js`)

### `googleMapsPlaceUrl(query: string): string`
Genera la URL externa oficial de Google Maps para visualizar una ubicación o punto de interés.

- **Input**: `query` (`string`) — consulta geográfica normalizada (ej. `"Basílica Menor de Andacollo, Urmeneta 850, Andacollo, Región de Coquimbo, Chile"`).
- **Output**: `string` — `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`.
- **Invariantes**:
  - Función pura, sin efectos secundarios ni dependencias externas.
  - Codifica correctamente caracteres especiales, tildes y espacios del español.

---

## 2. Visual & Structural UI Contract (`src/pages/MapPage/MapPage.jsx` y `MapPage.css`)

### 2.1 Limpieza del área del mapa (`.map-canvas` y `.map-canvas__frame`)
- `.map-canvas` mantiene `position: relative; width: 100%; height: 100%; overflow: hidden;`.
- `.map-canvas__frame` aplica recorte vertical simétrico:
  - Escritorio: `position: absolute; left: 0; top: -16rem; width: 100%; height: calc(100% + 32rem); border: 0; display: block;`
  - Móvil (`@media (max-width: 48rem)`): `top: -15rem; height: calc(100% + 30rem);`
- **Resultado esperado**:
  - La tarjeta informativa nativa de Google Maps (esquina superior izquierda con nombre, estrellas y "Ampliar el mapa") queda 100% fuera del área visible recortada.
  - El centro vertical del mapa y el pin rojo permanecen centrados en `.map-canvas`.
  - Los controles flotantes propios (`.map-drawer-toggle`, `.map-controls`, `.map-mobile-preview`) mantienen sus `z-index` y posiciones sin ser recortados ni obstruidos.

### 2.2 Tarjeta de detalle resumido en escritorio (`.map-selected-card`)
- Bloque de acciones `.map-selected-card__actions` (`display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 0.2rem;`):
  1. `<Link to={selectedPin.to} className="map-selected-card__link">` — `"Ver detalles"` + `<Icon name="arrow-right" size={14} />` (acción primaria).
  2. `<a href={googleMapsPlaceUrl(mapsQuery)} target="_blank" rel="noopener noreferrer" className="map-selected-card__maps-link" aria-label={`Ver ${selectedPin.label} en Google Maps`}>` — `<Icon name="external-link" size={12} />` + `"Ver en Maps"` (acción secundaria discreta).
- Estilo armónico de `.map-selected-card__maps-link`:
  - Tamaño pequeño (`font-size: 1.15rem`, `font-weight: 600`), pill sutil (`padding: 0.25rem 0.75rem`, `border-radius: var(--radius-full)`), fondo `var(--color-soft)`, borde `0.1rem solid var(--color-border)`, texto `var(--color-muted)`, transición suave a `var(--color-primary)` en hover/focus.

### 2.3 Tarjeta de detalle resumido compacta en móvil (`.map-mobile-preview`)
- Contenedor semántico `<article className="map-mobile-preview" aria-label={`Resumen de ${selectedPin.label}`}>` (sin enlaces anidados):
  - Enlace de imagen: `<Link to={selectedPin.to} className="map-mobile-preview__img-wrap" aria-label={`Ver detalles de ${selectedPin.label}`}>`.
  - Cuerpo `.map-mobile-preview__body`:
    - Enlace de cabecera: `<Link to={selectedPin.to} className="map-mobile-preview__heading">` conteniendo título (`h3`) y categoría (`p`).
    - Fila `.map-mobile-preview__meta`: `<StarRating />`, distancia opcional (`.map-mobile-preview__dist`) y enlace compacto externo:
      `<a href={googleMapsPlaceUrl(mapsQuery)} target="_blank" rel="noopener noreferrer" className="map-mobile-preview__maps-link" aria-label={`Ver ${selectedPin.label} en Google Maps`}>` con `<Icon name="external-link" size={11} />` y `<span>Maps</span>`.
  - Enlace de flecha derecha: `<Link to={selectedPin.to} className="map-mobile-preview__go" aria-label={`Ver detalles de ${selectedPin.label}`}>` con `<Icon name="chevron-right" size={18} />`.
- **Invariante de interacción (`FR-007`)**: Pulsar `.map-mobile-preview__maps-link` abre únicamente Google Maps en una pestaña/app externa y nunca navega a `selectedPin.to`.
