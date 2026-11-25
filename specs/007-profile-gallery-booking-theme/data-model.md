# Data Model & UI State: Feature 007

**Feature**: `007-profile-gallery-booking-theme`  
**Date**: 2026-11-24

Esta feature no requiere cambios ni migraciones en el esquema de base de datos de Supabase; opera sobre las tablas y servicios existentes modelando vistas, estados de UI y reglas de visibilidad.

## 1. Entidades Existentes Reutilizadas

### Perfil de Usuario (`profiles`)
| Campo | Visibilidad | Uso en UI |
|---|---|---|
| `id`, `handle` | Pública | Identificador de ruta (`/usuario/:handleOrId`, `/fotografo/:handleOrId`) |
| `nombre`, `apellido` | Pública | Nombre visible en cabecera de perfil y autoría de capturas |
| `avatar_url` | Pública | Avatar circular (con respaldo de iniciales) |
| `biografia`, `ciudad_origen` | Pública | Presentación personal en perfil propio y de terceros |
| `rol_fotografico`, `certificacion`, `titulo_nivel`, `nivel`, `xp` | Pública | Insignias de nivel y rol comunitario |
| `gear_bag` (JSON array `{ id, name, detail }`) | Pública (editable solo por titular) | Equipamiento fotográfico / observación |
| `lugares_visitados`, `rutas_completadas`, `resenas_count` | Pública | Estadísticas de exploración |
| `preferencia_offline`, `rol` | Privada (solo titular en `/perfil`) | Preferencias de cuenta y acceso admin |

### Fotografía de Galería (`astro_photos` + `astro_photo_likes`)
| Campo | Tipo lógico | Notas |
|---|---|---|
| `id` | UUID / string | Clave única de la captura |
| `authorId`, `authorHandle`, `authorName`, `authorAvatar`, `authorRole` | string | Datos del autor para enlace a perfil |
| `title`, `spot`, `description`, `image`, `dateLabel` | string | Contenido visual y contextual |
| `exif` (`camera`, `iso`, `shutter`, `aperture`) | object | Parámetros técnicos (con fallback `"No especificado"`) |
| `likes` | number | Contador total sincronizado en UI y BD |
| `liked` | boolean | Estado de «Me gusta» del usuario autentificado actual |

### Módulo de Servicios y Reserva (`booking_configs`, `booking_packages`, `booking_slots`, `bookings`)
| Campo | Tipo lógico | Notas |
|---|---|---|
| `config` | object \| null | Determina si la pestaña `"Servicios y Reserva"` aparece en `DetailLayout` |
| `packages` | array | Modalidades / servicios reservables |
| `slots` | array | Horarios con disponibilidad calculada |
| `userBookings` | array | Pases activos/históricos del usuario autentificado para esa entidad |

## 2. Estados de UI Introducidos

### Submenú de Detalle (`DetailLayout`)
- `activeTab`: `'detalle' | 'reservas'` (valor inicial siempre `'detalle'`).
- Regla de transición: Si `entityId` cambia (navegación hacia otro lugar relacionado), `activeTab` se restablece a `'detalle'`.
- Regla de visibilidad: La barra de submenú solo se renderiza cuando `hasBooking === true` (`!booking.loading && Boolean(booking.config)`).

### Visor Modal de Fotografía (`AstroPhotoModal`)
- `activePhotoId`: `string | null` gestionado en `AstroGalleryPage`, `ProfilePage` y `PhotographerProfilePage`.
- Derivación: `activePhoto = photos.find((p) => p.id === activePhotoId) || null` (garantiza que los cambios de `likes` / `liked` se reflejen automáticamente dentro del modal abierto).
- Cierre: botón cerrar, clic en backdrop o tecla `Escape`.

### Separación Visualización / Edición en Perfil Propio (`ProfilePage`)
- `editing`: `boolean` (valor inicial `false`) controla la visibilidad del panel de edición de datos personales para que la vista principal sea de visualización limpia.
- `uploadOpen`: `boolean` controla `AstroPhotoUploadModal`.
