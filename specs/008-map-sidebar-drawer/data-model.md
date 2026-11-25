# Data Model: Menú Lateral Ocultable y Vista Limpia del Mapa

**Feature**: `008-map-sidebar-drawer`  
**Date**: 2026-11-24

Esta mejora es estrictamente de interfaz y experiencia de usuario en el cliente; no modifica tablas ni esquemas en Supabase.

## Entidades de Estado en Cliente

### 1. `MapDrawerState` (estado local de `MapPage`)

| Campo | Tipo | Valor Inicial | Reglas / Transiciones |
|---|---|---|---|
| `isDrawerOpen` | `boolean` | `false` | Inicia oculto (`false`) para maximizar el mapa. Cambia a `true` al pulsar el botón flotante de apertura; vuelve a `false` al pulsar el botón de cierre, pulsar `Escape`, tocar el backdrop (móvil) o seleccionar una ubicación en resolución móvil (`<= 48rem` / `768px`). |
| `zoom` | `number` | `17` | Rango permitido `[12, 20]`. Al seleccionar una ubicación sube a `18`. Incrementa/decrementa con los botones flotantes de zoom. |

### 2. `MapExplorerState` (existente en `useMapExplorer`)

Se reutiliza sin cambios estructurales y persiste mientras el usuario abre y cierra el menú lateral:

| Campo | Tipo | Descripción |
|---|---|---|
| `filterTypes` | `string[]` | Categorías disponibles (`Todos`, `Lugares`, `Restaurantes`, `Hospedajes`, `Rutas`). |
| `activeFilter` | `string` | Categoría activa (por defecto `'Todos'`). |
| `searchQuery` | `string` | Texto de búsqueda libre en el mapa. |
| `pins` | `MapPin[]` | Lista de ubicaciones filtradas desde `map.service.js`. |
| `selectedPin` | `MapPin \| null` | Ubicación actualmente enfocada en el mapa. |
| `loading` | `boolean` | Indicador de carga de ubicaciones. |
| `error` | `string` | Mensaje de error visual si falla la consulta. |

### 3. `MapPin` (entidad de solo lectura proveniente de `map.service.js`)

| Campo | Tipo | Uso en la vista |
|---|---|---|
| `id` | `string` | Identificador único y estado activo en la lista. |
| `label` | `string` | Nombre visible en la lista, tarjeta seleccionada y vista previa móvil. |
| `categoryLabel` | `string` | Etiqueta de categoría en la tarjeta de detalle resumido. |
| `address` | `string` | Dirección del lugar en la tarjeta seleccionada. |
| `color` | `string` | Color del indicador circular (`.map-place-item__dot`). |
| `image` | `string` | Imagen destacada en la tarjeta seleccionada y vista previa móvil. |
| `rating` | `number` | Calificación promedio mostrada con `StarRating`. |
| `distance` | `string` | Distancia aproximada mostrada junto al ícono de ubicación. |
| `mapsQuery` | `string` | Consulta usada para centrar el mapa y abrir indicaciones en Google Maps. |
| `to` | `string` | Ruta interna hacia la ficha completa del lugar (`Ver detalles`). |

## Transiciones de Estado Clave

1. **Carga inicial**: `isDrawerOpen = false` → Mapa ocupa el 100% del área principal; botón flotante visible; `useMapExplorer` carga `pins` y selecciona el primer pin sin mostrar ningún recuadro superior sobre el mapa.
2. **Abrir menú**: Click en botón flotante → `isDrawerOpen = true` → Cajón lateral se desliza desde la izquierda mostrando buscador, categorías y lista de `pins`.
3. **Filtrar / Buscar**: Cambios en `searchQuery` o `activeFilter` actualizan `pins` dentro del cajón sin cerrar el menú.
4. **Seleccionar ubicación**: Click en un item de `.map-place-list` → `setSelectedPin(pin)`, `setZoom(18)`. Si el viewport es móvil (`window.matchMedia('(max-width: 48rem)').matches`), además `setIsDrawerOpen(false)`.
5. **Cerrar menú**: Click en botón `Cerrar`, click en backdrop o tecla `Escape` → `isDrawerOpen = false`, conservando intactos `searchQuery`, `activeFilter` y `selectedPin`.
