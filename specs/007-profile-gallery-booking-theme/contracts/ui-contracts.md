# UI & Component Contracts: Feature 007

**Feature**: `007-profile-gallery-booking-theme`  
**Date**: 2026-11-24

## 1. Componente `AstroPhotoModal`

**Ubicación**: `src/components/ui/AstroPhotoModal/AstroPhotoModal.jsx`

### Props
```js
{
  photo: {
    id: string,
    title: string,
    spot: string,
    description: string,
    image: string,
    likes: number,
    liked: boolean,
    authorHandle: string,
    authorName: string,
    authorAvatar?: string,
    exif?: {
      camera?: string,
      iso?: string,
      shutter?: string,
      aperture?: string,
    },
  } | null,
  onClose: () => void,
  onToggleLike: (photo) => void | Promise<void>,
  hideAuthorLink?: boolean, // opcional, default false
}
```

### Comportamiento garantizado
- Si `photo` es `null`, retorna `null`.
- Renderiza `role="dialog"`, `aria-modal="true"`, `aria-labelledby="astro-detail-title"`.
- Escucha `keydown` para cerrar con tecla `Escape`.
- Cierra al hacer clic en el backdrop o en el botón de cierre (con `e.preventDefault()`).
- Usa paleta clara (`#FFFFFF`, `#F5F7FA`, `#071B3A`, `#FFB800`, `#e2e8f0`) coherente con el resto de la app.
- Muestra `"No especificado"` cuando falte algún valor EXIF.

## 2. Submenú de `DetailLayout` + `BookingSection`

**Ubicación**: `src/components/layout/DetailLayout/DetailLayout.jsx`

### Nuevas Props de `DetailLayout`
```js
{
  bookingProps?: {
    entityType: 'lugar' | 'restaurante' | 'alojamiento' | 'evento' | 'experiencia',
    entityId: string,
    entityName?: string,
  } | null,
  // bookingSection?: ReactNode (se mantiene por compatibilidad)
}
```

### Comportamiento garantizado
- Cuando `bookingProps` tiene configuración activa en `useEntityBooking`:
  - Renderiza barra de submenú semántica (`role="tablist"`, `aria-label="Secciones del detalle"`) con:
    - Pestaña 1 (`id="tab-detalle"`): **Información y Detalle** (seleccionada por defecto).
    - Pestaña 2 (`id="tab-reservas"`): **Servicios y Reserva** (con insignia numérica si el usuario tiene pases activos).
  - En pestaña **Información y Detalle**: muestra descripción, `infoRows`, `reviewsSection` y `relatedSection` (sin el módulo de reserva incrustado).
  - En pestaña **Servicios y Reserva**: muestra `<BookingSection booking={booking} />` con paleta clara.
- Cuando no existe configuración de reserva para la entidad: no renderiza la barra de submenú ni el módulo de reserva.

### Props de `BookingSection`
```js
{
  entityType?: string,
  entityId?: string,
  entityName?: string,
  booking?: ReturnType<typeof useEntityBooking>, // inyección directa para evitar doble fetch
}
```

## 3. Contratos de Hooks de Perfil

### `useProfileStats()`
Añade al objeto retornado:
- `handleTogglePhotoLike(photo)`: invoca `toggleAstroPhotoLike`, actualiza `astroPhotos` (y por consecuencia `astroStats.totalLikes`) y emite feedback en caso de error.

### `usePhotographerProfile(handleOrId)`
Añade al objeto retornado:
- `handleTogglePhotoLike(photo)`: valida sesión (mostrando `FeedbackBanner` informativo si no hay sesión), invoca `toggleAstroPhotoLike` y actualiza `data.photos` + `data.stats.totalLikes`.

## 4. Rutas de Perfil
- `/perfil` (`ProtectedRoute`): Vista propia del usuario autentificado (`ProfilePage`).
- `/usuario/:handleOrId` y `/fotografo/:handleOrId` (pública): Vista de perfil público de usuario (`PhotographerProfilePage`). Si el usuario autentificado abre su propio handle/ID, se le ofrece botón `"Ir a Mi Perfil"` hacia `/perfil`.
