# Research & Design Decisions: Feature 007

**Feature**: `007-profile-gallery-booking-theme`  
**Date**: 2026-11-24

## 1. Submenú de Servicios y Reserva dentro de `DetailLayout`

- **Decision**: Elevar la invocación de `useEntityBooking(entityType, entityId, entityName)` al nivel de `DetailLayout` cuando se provee la prop `bookingProps`, y pasar el estado resultante a `BookingSection` dentro de la pestaña `"reservas"` de un submenú interno (`role="tablist"`).
- **Rationale**:
  1. `DetailLayout` necesita saber con certeza si la entidad tiene una configuración de reserva activa (`!booking.loading && Boolean(booking.config)`) para decidir si muestra o no la pestaña `"Servicios y Reserva"` (FR-007).
  2. Evita realizar doble consulta a Supabase (`getEntityBookingSetup`) entre el contenedor y `BookingSection`.
  3. Al mantener `useEntityBooking` montado en `DetailLayout`, si el usuario selecciona un paquete o fecha en la pestaña de reservas, vuelve a leer la descripción en la pestaña de detalle y regresa a reservas, sus selecciones se preservan intactas.
  4. Mantiene compatibilidad hacia atrás con cualquier página de detalle que no pase `bookingProps`.
- **Alternatives considered**:
  - *Renderizar un botón que abra un modal para reservas*: Descartado porque `BookingSection` contiene galería, paquetes, horarios, cálculo de tarifa y pases activos, lo que resulta incómodo en un modal estrecho y contradice el requerimiento explícito de "submenú dentro de la vista de detalle".
  - *Consultar `hasBooking` en cada página de detalle por separado*: Descartado por duplicación de código en las 5 páginas de detalle (`PlaceDetailPage`, `RestaurantDetailPage`, `AccommodationDetailPage`, `EventDetailPage`, `ExperienceDetailPage`).

## 2. Componente Compartido `AstroPhotoModal` para Galerías de Perfil y Astrofotos

- **Decision**: Extraer el modal de detalle fotográfico actualmente incrustado en `AstroGalleryPage.jsx` a un componente reutilizable `src/components/ui/AstroPhotoModal/AstroPhotoModal.jsx` + `AstroPhotoModal.css`.
- **Rationale**:
  1. Garantiza paridad visual y funcional al 100% entre el menú Astrofotos, el perfil del usuario autentificado (`ProfilePage`) y el perfil público de otros usuarios (`PhotographerProfilePage`) (FR-003).
  2. Centraliza accesibilidad (tecla `Escape`, cierre por clic en backdrop, `role="dialog"`, `aria-modal="true"`, bloqueo de scroll si aplica) y valores de respaldo para campos EXIF faltantes (`No especificado`).
  3. Recibe `photo`, `onClose`, `onToggleLike` y opcionalmente `hideAuthorCta` (para no mostrar un enlace redundante cuando ya estamos en el perfil del mismo autor).
- **Alternatives considered**:
  - *Duplicar el marcado del modal en `ProfilePage` y `PhotographerProfilePage`*: Descartado por violar mantenibilidad y arriesgar divergencias visuales.

## 3. Sincronización de «Me gusta» en Perfiles

- **Decision**: Exponer `handleTogglePhotoLike(photo)` en `useProfileStats` y `usePhotographerProfile`, reutilizando el servicio existente `toggleAstroPhotoLike(photo.id, user.id, photo.liked)` de `src/services/astrophotos.service.js`.
- **Rationale**:
  1. Actualiza de inmediato el array de fotos (`liked` y `likes`) y recalcula el contador total de `Me gusta` del perfil sin recargar la página (FR-005).
  2. Si el usuario no está autentificado, muestra un `FeedbackBanner` informativo en español sin diálogos nativos.
- **Alternatives considered**:
  - *Recargar todo el perfil tras cada clic en «Me gusta»*: Descartado por provocar parpadeo y latencia innecesaria.

## 4. Estrategia de Unificación Visual a Paleta Clara

- **Decision**: Sustituir el modo oscuro (`page-wrapper--dark`, fondos `#031126` / `#0c2244` en cuerpos de página y tarjetas) por el sistema claro estándar de la aplicación:
  - Fondo de página: `--color-soft` (`#F5F7FA`).
  - Encabezados Hero: gradiente institucional claro o bloque destacado con `--color-primary` (`#071B3A`) y texto blanco (igual que `PageHero` usado en Restaurantes, Alojamientos, Eventos y Experiencias) o superficie blanca limpia con bordes `--color-border` (`#e2e8f0`).
  - Tarjetas y formularios: `--color-white` (`#FFFFFF`), borde `0.1rem solid var(--color-border)`, sombra `--shadow-card`.
  - Texto principal: `--color-primary` (`#071B3A`) / `--color-text` (`#1a2b45`); texto secundario: `--color-muted` (`#64748b`).
  - Acentos y acciones primarias: `--color-gold` (`#FFB800`), `--color-orange` (`#FF9D00`) y `--color-primary` (`#071B3A`).
- **Rationale**:
  1. Sigue exactamente el patrón visual de `ExplorerPage`, `RestaurantsPage`, `AccommodationsPage`, `EventsPage` y `DetailLayout`.
  2. Asegura contraste AA/AAA en todos los textos, etiquetas, inputs y botones, tanto en escritorio como en pantallas móviles bajo luz natural.
- **Alternatives considered**:
  - *Mantener secciones oscuras parciales en Astronomía*: Descartado porque el usuario solicitó explícitamente que Astronomía, Astrofotos, Guías y Reserva usen fondos y colores claros guiados por las demás vistas.

## 5. Diferenciación Clara entre Perfil Propio y Perfil de Otros Usuarios

- **Decision**:
  - Mantener `/perfil` (`ProfilePage`, protegido por `ProtectedRoute`) como la vista propia de visualización de datos del usuario autentificado, con una presentación clara tipo ficha de perfil (cabecera, métricas, reservas activas, solicitudes de guías, portafolio interactivo de capturas, gear bag, insignias y favoritos) y con la edición de datos/configuración separada en un panel activable mediante botón `"Editar mis datos"` / `"Configuración"` para no ensuciar la vista de lectura.
  - Armonizar `/fotografo/:handleOrId` y añadir alias `/usuario/:handleOrId` apuntando a `PhotographerProfilePage` con la misma línea visual clara, mostrando los datos públicos del usuario (incluyendo ciudad de origen, nivel/título, biografía, estadísticas, gear bag, insignias y galería interactiva) y botón de seguir, ocultando estrictamente reservas, preferencias offline y edición.
- **Rationale**: Cumple exactamente FR-001 y FR-002 reutilizando las rutas y servicios ya probados en Supabase sin romper enlaces existentes.
