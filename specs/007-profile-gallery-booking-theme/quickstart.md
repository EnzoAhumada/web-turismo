# Quickstart & Validation Guide: Feature 007

**Feature**: `007-profile-gallery-booking-theme`  
**Date**: 2026-11-24

## Prerrequisitos

- Dependencias instaladas (`node_modules` presente) y variables de entorno `.env` configuradas para Supabase.
- Entorno local ejecutándose con Vite:

```bash
npm run dev
```

- Verificación de compilación de producción:

```bash
npm run build
```

## Escenarios de Validación End-to-End

### 1. Unificación visual clara (US1)
1. Abrir `/astronomia`, `/fotografia` (Astrofotos) y `/guias`.
2. Verificar que todas las páginas usan fondo claro (`#F5F7FA`), tarjetas blancas (`#FFFFFF`), tipografía oscura legible (`#071B3A` / `#1a2b45`) y acentos dorados/naranjas (`#FFB800` / `#FF9D00`), coherentes con `/explorar`, `/restaurantes` y `/alojamientos`.
3. Verificar en ancho móvil (`360px`) que no existe desbordamiento horizontal ni textos cortados.

### 2. Submenú de Servicios y Reserva en Detalle de Lugares (US2)
1. Abrir un lugar turístico (o restaurante/alojamiento/evento/experiencia) que tenga reservas configuradas (ej. Observatorio Collowara).
2. Confirmar que al cargar la vista solo se muestra la pestaña **Información y Detalle** (descripción, datos prácticos, reseñas, mapa y relacionados) y el formulario de reserva **no** aparece incrustado directamente.
3. Hacer clic en la pestaña **Servicios y Reserva** del submenú interno.
4. Confirmar que aparece el módulo de reservas con diseño claro (fondos claros, tarjetas blancas, botones y campos legibles).
5. Abrir un lugar sin configuración de reservas y confirmar que **no** se muestra la pestaña de reserva.

### 3. Perfil Propio del Usuario Autentificado y Perfil de Otros Usuarios (US3)
1. Iniciar sesión y navegar a `/perfil`.
2. Confirmar que la vista tiene fondo claro y muestra de forma ordenada todos los datos del usuario (avatar, nombre, handle, biografía, origen, nivel/XP, estadísticas, reservas activas, gear bag, insignias, portafolio de capturas y favoritos), con la edición de datos separada bajo el botón de edición/configuración.
3. Desde `/fotografia` o desde una foto de otro usuario, abrir el perfil de otro usuario (`/usuario/:handleOrId` o `/fotografo/:handleOrId`).
4. Confirmar que usa la misma estética clara, muestra los datos públicos del usuario y el botón de seguir, y **no** expone reservas privadas ni formularios de edición.

### 4. Visor Interactivo de Fotos en Galería de Perfil (US4)
1. En `/perfil` (propio) y en el perfil de otro usuario, hacer clic en una fotografía de la galería.
2. Confirmar que se abre el visor modal detallado (idéntico al de Astrofotos) sin abandonar la vista de perfil, mostrando imagen ampliada, spot, título, descripción, parámetros EXIF y botón de «Me gusta».
3. Pulsar «Me gusta» y confirmar que el contador se actualiza de inmediato en el modal, en la tarjeta de la galería y en las métricas del perfil.
4. Cerrar con la tecla `Escape`, clic fuera o botón cerrar y confirmar que se permanece en el perfil.
