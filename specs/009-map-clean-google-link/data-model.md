# Data Model: Vista Limpia del Mapa y Enlace Externo a Google Maps

**Feature**: `009-map-clean-google-link`  
**Date**: 2026-11-25  
**Spec**: [spec.md](./spec.md)

## Overview

Esta mejora es estrictamente de interfaz y navegación externa en la vista del mapa (`MapPage`). **No requiere cambios en el esquema de base de datos Supabase, ni nuevas tablas, ni migraciones, ni nuevas llamadas de red.** Reutiliza completamente las entidades proyectadas por `useMapExplorer` y las utilidades geográficas de `src/lib/andacolloGeo.js`.

## Entities & Derived View Models

### 1. MapPin (Entidad existente en `useMapExplorer`)
Representa cada punto de interés de Andacollo renderizado en el explorador del mapa.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Sí | Identificador único del pin (`${kind}-${record.id}`) |
| `label` | `string` | Sí | Nombre visible del lugar (usado en títulos y `aria-label` del enlace externo) |
| `categoryLabel` | `string` | Sí | Etiqueta en español de la categoría |
| `address` | `string` | No | Dirección textual del lugar (puede estar vacía) |
| `rating` | `number` | Sí | Calificación promedio (0–5) |
| `distance` | `string` | No | Distancia aproximada desde el centro de Andacollo |
| `image` | `string` | No | URL de imagen destacada |
| `to` | `string` | Sí | Ruta interna hacia la ficha completa del lugar dentro de la aplicación |
| `mapsQuery` | `string` | Sí | Cadena geográfica normalizada hacia Andacollo/Chile generada por `googleMapsQuery()` |

### 2. ExternalMapLink (Valor derivado en `MapPage`)
Enlace derivado a partir de `selectedPin` para abrir el lugar en Google Maps externo.

| Field | Type | Derivation / Rule |
|-------|------|-------------------|
| `href` | `string` | `googleMapsPlaceUrl(selectedPin.mapsQuery)` → `https://www.google.com/maps/search/?api=1&query=<encoded>` |
| `label` | `string` | Texto compacto en español (`"Ver en Maps"` en tarjeta de escritorio; `"Maps"` en tarjeta compacta móvil) |
| `ariaLabel` | `string` | `` `Ver ${selectedPin.label} en Google Maps` `` |
| `target` | `string` | `"_blank"` |
| `rel` | `string` | `"noopener noreferrer"` |

## Validation & State Rules

- **Actualización reactiva**: Cada vez que `selectedPin` cambia, `mapsQuery` y `googleMapsPlaceUrl(mapsQuery)` se recalculan automáticamente en el render sin estado redundante.
- **Ausencia de selección**: Cuando `selectedPin` es `null` (durante carga, error o lista vacía), ni `.map-selected-card` ni `.map-mobile-preview` se renderizan; por lo tanto, nunca se muestra un enlace externo huérfano.
- **Fallback geográfico**: Si un registro carece de `address`, `googleMapsQuery({ nombre, direccion })` ya incluye el nombre junto con `", Andacollo, Región de Coquimbo, Chile"`, garantizando siempre una consulta válida para Google Maps externo.
