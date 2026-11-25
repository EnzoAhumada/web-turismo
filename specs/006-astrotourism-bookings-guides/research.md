# Phase 0 Research: Astroturismo Comunitario, Reservas Adaptativas, Guías Certificados y Perfil Mejorado

**Feature**: `006-astrotourism-bookings-guides`
**Date**: 2026-11-24

## Architectural & Technical Decisions

### 1. Modelo Polimórfico y Adaptativo para Reservas en Todo el Catálogo

- **Decision**: Implementar un sistema de reservas polimórfico (`entity_type IN ('lugar', 'restaurante', 'alojamiento', 'evento', 'experiencia')`, `entity_id uuid`) gobernado por una tabla `booking_configs` con 4 perfiles adaptativos (`tour_horario`, `mesa_comida`, `estadia_noches`, `servicio_general`), modo de precio (`calculado`, `sin_costo`) y modo de confirmación (`inmediata`, `pendiente`).
- **Rationale**: El proyecto ya utiliza el patrón polimórfico con éxito en `public.resenas` (`tipo` + `item_id`). Replicar esta convención permite habilitar reservas desde un único módulo administrativo y un único componente `<BookingSection />` inyectado en `DetailLayout` para las 5 páginas de detalle, sin duplicar tablas por entidad. Inicialmente solo Observatorio Turístico Collowara (`lugar`, id `20000000-0000-0000-0000-000000000002`) se precarga activo con perfil `tour_horario`, precio `calculado` y confirmación `inmediata`.
- **Alternatives considered**:
  - *Tablas separadas por entidad (`place_bookings`, `restaurant_bookings`, `accommodation_bookings`)*: Rechazada por triplicar código, políticas RLS y vistas de administración.
  - *Modelo rígido exclusivo para Collowara*: Rechazada explícitamente por el usuario en la clarificación; impediría soportar mesas de restaurantes, noches en alojamientos o servicios flexibles.

### 2. Cálculo de Cupos en Vivo y Concurrencia en Bloques Horarios

- **Decision**: Calcular los cupos disponibles por `(config_id, booking_date, slot_id)` mediante agregación de reservas activas (`status IN ('pendiente', 'confirmada')`) descontadas de `booking_slots.capacidad_base`, respaldado por una función PostgreSQL (`public.create_entity_booking`) y una función de cancelación (`public.cancel_entity_booking`) con validación en servidor.
- **Rationale**: Evita depender únicamente de validaciones en cliente (race conditions o manipulación del DOM) y garantiza que al cancelar una reserva (ya sea por el usuario titular o por el administrador), los cupos se liberen de manera consistente y no se puedan duplicar liberaciones sobre reservas ya canceladas.
- **Alternatives considered**:
  - *Restar un contador mutable en `booking_slots.spots`*: Rechazada porque un bloque horario se repite cada día (fecha diferente) y restar un contador global mezclaría fechas distintas.

### 3. Perfiles de Astrofotógrafos Unificados en `public.profiles`

- **Decision**: Extender la tabla existente `public.profiles` con columnas opcionales (`handle`, `rol_fotografico`, `certificacion`, `gear_bag`, `astro_badges`) y crear `public.user_follows` referenciando `public.profiles(id)`.
- **Rationale**: En el esquema actual (`20261120000001_initial_schema.sql`), `public.profiles` ya permite registros semilla de la comunidad sin clave foránea estricta hacia `auth.users`. Esto permite sembrar los 3 astrofotógrafos del mockup (`leokaant_astrophoto`, `matias_astro`, `valentina_sky`) y tratar de forma idéntica a cualquier usuario registrado que suba capturas o edite su Gear Bag, con una sola ruta `/fotografo/:handleOrId`.
- **Alternatives considered**:
  - *Tabla separada `photographers` desvinculada de `profiles`*: Rechazada porque duplicaría identidad, avatar, biografía y obligaría a sincronizar manualmente cambios del perfil del usuario autenticado.

### 4. Estrategia de Imágenes para Astrofotografías y Escenas del Mockup

- **Decision**: Permitir subida de imágenes reales mediante conversión/validación de archivo (límite 5 MB, solo `image/*`) con soporte prioritario para Supabase Storage (`bucket: astro-photos`) y respaldo seguro a Data URL optimizada / escenas astronómicas generadas en Canvas (reutilizando el generador procedural del mockup como escenas de muestra y fallback offline/local).
- **Rationale**: Garantiza que la aplicación funcione de forma inmediata tanto en entornos locales con Supabase sin bucket externo configurado como en producción con Storage activo, además de conservar la opción del mockup "O prueba con una captura de muestra" (Vía Láctea, Nebulosa Carina, Circumpolar) y renderizar las 4 capturas iniciales y la galería de Collowara con cero enlaces rotos.
- **Alternatives considered**:
  - *Solo URLs externas de terceros*: Rechazada porque el usuario pidió explícitamente subir fotos desde archivo y reutilizar las escenas del mockup de forma confiable.

### 5. Reemplazo de Menús ("Fotografía" y "Otros") y Adaptación Visual

- **Decision**:
  - La categoría `fotografia` del Explorador (y la nueva ruta `/fotografia`, también accesible desde navegación principal/Home) abre la nueva página **Galería de Astrofotos** (`AstroGalleryPage`).
  - La categoría `otros` en `EXPLORER_CATEGORIES` y `public.categorias` se reemplaza por `guias` (**Guías Turísticos**), dirigiendo a `/guias` (`GuidesPage`), y se añade acceso directo en la navegación.
  - Todo el estilo del mockup (Tailwind dark/glass) se reescribe en **CSS3 nativo** con `rem` (base `10px`), Flexbox/Grid y la paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`), sin añadir ninguna dependencia externa.
- **Rationale**: Cumple estrictamente los Principios III, IV, V y VI de la Constitución y `AGENTS.md` (cero librerías externas, CSS3 nativo en `rem`, sin `innerHTML`, sin `alert`/`confirm`/`prompt`, 100% en español).

### 6. Panel de Administración Unificado

- **Decision**: Añadir dos nuevos apartados en `AdminSidebar` y rutas protegidas con `<AdminRoute>`:
  - `/admin/reservas` (`BookingsAdminPage`): Gestor maestro con 2 pestañas principales: (1) **Configuración por Entidad** (selector de tipo de catálogo + entidad, interruptor activar/desactivar, selector de perfil adaptativo, modo precio/confirmación, destacados, galería, CRUD de servicios/precios y CRUD de horarios/cupos) y (2) **Reservas Recibidas** (tabla filtrable por tipo, entidad, fecha y estado, con acciones aprobar/confirmar/cancelar).
  - `/admin/guias` (`GuidesAdminPage`): CRUD completo de guías certificados (activar/verificar, editar itinerario/tarifa/sectores) + vista de solicitudes de reserva a guías recibidas.
- **Rationale**: Sigue exactamente el patrón arquitectónico de `AdminSidebar` + `AdminCrud.css` + páginas dedicadas en `src/pages/admin/`, manteniendo separación clara y baja complejidad cognitiva para administradores municipales/locales.
