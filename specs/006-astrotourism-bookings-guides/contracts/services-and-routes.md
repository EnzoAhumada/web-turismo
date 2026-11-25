# Phase 1 Contracts: Servicios, Rutas y Contratos de Interfaz

**Feature**: `006-astrotourism-bookings-guides`
**Date**: 2026-11-24

## 1. Rutas de la Aplicación (`src/App.jsx`)

### Rutas Públicas
| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/fotografia` | `AstroGalleryPage` | Reemplaza la vista del menú "Fotografía" con la Galería de Astrofotos comunitaria |
| `/guias` | `GuidesPage` | Reemplaza el menú "Otros" por el Directorio de Guías Turísticos Certificados |
| `/fotografo/:handleOrId` | `PhotographerProfilePage` | Vista pública del perfil de cualquier astrofotógrafo (cabecera, stats, Gear Bag, insignias, portafolio, seguir) |
| `/lugar/:id`, `/restaurantes/:id`, `/alojamientos/:id`, `/eventos/:id`, `/experiencias/:id` | Páginas de detalle existentes | Incorporan `<BookingSection entityType="..." entityId={id} entityName={item.nombre} />` vía `DetailLayout` cuando `booking_configs.activo = true` |

### Rutas Privadas de Usuario (`ProtectedRoute`)
| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/perfil` | `ProfilePage` (mejorada) | Mantiene 100% de funciones previas + "+ Subir Captura", métricas fotográficas, Gear Bag editable, insignias, portafolio y "Mis Reservas y Pases" |

### Rutas Privadas de Administración (`AdminRoute`)
| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin/reservas` | `BookingsAdminPage` | Gestión de reservas adaptativas para las 5 entidades del catálogo + listado y administración de reservas recibidas |
| `/admin/guias` | `GuidesAdminPage` | Gestión de guías certificados y solicitudes de reserva recibidas |

## 2. Contratos de Servicios (`src/services/`)

### `astrophotos.service.js`
- `getAstroPhotos({ spot, sortBy, authorId, userId })` → Lista de capturas activas enriquecidas con datos de autor (`profiles`) y bandera booleana `likedByMe`.
- `createAstroPhoto({ authorId, titulo, spot, descripcion, imagenUrl, exifCamera, exifIso, exifShutter, exifAperture })` → Inserta nueva captura y devuelve el registro enriquecido.
- `uploadAstroPhotoFile(file, userId)` → Valida tipo `image/*` y tamaño (`<= 5 MB`), intenta subir a Supabase Storage (`astro-photos`) y hace fallback a DataURL optimizada si el bucket no está aprovisionado.
- `toggleAstroPhotoLike(photoId, userId)` → Alterna fila en `astro_photo_likes` y devuelve `{ liked, likesCount }`.
- `deleteAstroPhoto(photoId)` → Eliminación por autor o admin.

### `photographers.service.js`
- `getPhotographerProfile(handleOrId, viewerUserId)` → Obtiene perfil público, sus capturas, total de "Me gusta", sectores únicos, contador de seguidores y estado `isFollowing`.
- `toggleFollowPhotographer(profileId, followerUserId)` → Alterna seguimiento en `user_follows` y devuelve `{ following, followersCount }`.
- `updateUserGearBag(userId, gearBag)` → Persiste el arreglo JSONB `gear_bag` en `public.profiles`.

### `bookings.service.js`
- `getEntityBookingSetup(entityType, entityId)` → Obtiene `booking_config` activa (si existe) con `packages` activos y `slots` activos.
- `getSlotAvailability(configId, fecha)` → Calcula cupos restantes por `slot_id` para la fecha indicada descontando reservas activas (`pendiente`, `confirmada`).
- `createEntityBooking(payload)` → Invoca lógica/RPC validada que verifica cupos (si el perfil usa horarios), valida fechas (`fecha_inicio >= hoy` y `fecha_fin > fecha_inicio` en `estadia_noches`), calcula total CLP (respetando `pricing_mode`, `pricing_unit` y descuento residente), genera código único (`<PREFIJO>-<AÑO>-<4D>`) y devuelve la reserva creada.
- `getUserBookings(userId, { entityType, entityId })` → Lista reservas del usuario ordenadas por fecha de creación descendente.
- `cancelBooking(bookingId)` → Cambia estado a `cancelada` (titular o admin) y retorna registro actualizado.
- **Funciones Admin**:
  - `getAdminCatalogEntities(entityType)` → Lista entidades de la tabla correspondiente junto con su `booking_config` (si existe).
  - `upsertBookingConfig(configPayload)` → Crea o actualiza la configuración polimórfica de una entidad (incluye `activo`, `booking_profile`, `pricing_mode`, `confirmation_mode`, highlights, galería, descuento).
  - `saveBookingPackage(packagePayload)` / `deleteBookingPackage(packageId)` → CRUD de modalidades/servicios.
  - `saveBookingSlot(slotPayload)` / `deleteBookingSlot(slotId)` → CRUD de bloques horarios.
  - `getAdminBookings({ entityType, configId, estado, fecha })` → Listado administrativo de reservas recibidas.
  - `updateBookingStatus(bookingId, nuevoEstado)` → Aprobar (`confirmada`) o cancelar (`cancelada`).

### `guides.service.js`
- `getGuides({ specialty, search, includeInactive })` → Lista guías filtrados por especialidad y búsqueda en nombre, sectores e idiomas.
- `createGuideApplication(payload)` → Registra nuevo guía local desde el modal "+ Postular como Guía Local".
- `createGuideBookingRequest(payload)` → Registra solicitud directa de reserva a un guía.
- `getUserGuideRequests(userId)` → Lista solicitudes enviadas por el usuario (para mostrar en Mi Perfil).
- **Funciones Admin**:
  - `updateGuide(id, payload)` / `deleteGuide(id)`
  - `getAdminGuideRequests()` / `updateGuideRequestStatus(id, estado)`

## 3. Contratos de Componentes Compartidos (`src/components/`)

### `<BookingSection entityType entityId entityName />`
- Se renderiza dentro de `DetailLayout` solo cuando existe una `booking_config` con `activo === true`.
- Adapta automáticamente campos, etiquetas y cálculo según `config.booking_profile`:
  - `tour_horario`: paquetes + fecha + bloques horarios con cupos en vivo + adultos/niños + residente.
  - `mesa_comida`: opción/zona (si hay paquetes) + fecha + bloques horarios + comensales + notas/alergias.
  - `estadia_noches`: tipo habitación/cabaña + check-in/check-out (mín. 1 noche) + huéspedes + notas.
  - `servicio_general`: opción de servicio + fecha + horario opcional + personas + comentarios.
- Respeta `config.pricing_mode`: muestra total calculado en CLP o etiqueta `"Reserva sin costo · Pago/consumo en destino"`.
- Respeta `config.confirmation_mode`: informa al usuario si el pase se confirma al instante o queda pendiente de aprobación.
- Incluye panel lateral "Mis Pases / Reservas" con botón "Copiar Código" y cancelación mediante `<ConfirmModal />` (nunca `window.confirm`).

### `<AstroPhotoUploadModal isOpen onClose onUploaded />`
- Reutilizado tanto en `AstroGalleryPage` como en `ProfilePage` ("+ Subir Captura").
- Soporta selección de archivo local (`<input type="file" accept="image/*" />`) con vista previa + 3 botones de escena rápida del mockup (Vía Láctea, Nebulosa Carina, Circumpolar).
- Valida campos requeridos y muestra feedback visual en el DOM.
