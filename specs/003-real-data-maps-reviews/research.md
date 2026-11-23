# Research: Datos Reales Verificados, Fichas Completas, Google Maps, Autocompletado, Reseñas y Usuarios Semilla

**Feature**: `003-real-data-maps-reviews`  
**Date**: 2026-11-20

## 1. Integración de Google Maps sin dependencias externas

- **Decision**: Implementar un componente reutilizable `GoogleMapView` (`src/components/ui/GoogleMapView/`) con doble modo:
  1. **Modo Google Maps JavaScript API** (`src/lib/googleMaps.js`): cuando `VITE_GOOGLE_MAPS_API_KEY` está configurada en `.env`, carga dinámicamente el script oficial de Google Maps JS API, renderiza marcadores personalizados por categoría, `InfoWindow` / tarjeta de vista previa al hacer clic, y centrado automático en Andacollo (`-30.2286, -71.0853`).
  2. **Modo Google Maps Embed (Respaldo automático sin API key)**: cuando `VITE_GOOGLE_MAPS_API_KEY` no está definida, renderiza un `<iframe>` oficial de Google Maps (`https://maps.google.com/maps?q=LAT,LNG&z=15&output=embed`) centrado en el punto seleccionado (en `MapPage` sincronizado con el pin activo y lista lateral; en fichas de detalle centrado en las coordenadas reales del lugar), acompañado del enlace directo `"Cómo llegar"` (`https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`).
- **Rationale**: Cumple estrictamente con la Constitución (Principio VI: cero dependencias externas adicionales fuera del stack aprobado) y garantiza que Google Maps funcione inmediatamente en desarrollo local y revisión sin bloquearse por falta de clave de facturación.
- **Alternatives considered**:
  - `@react-google-maps/api` o `leaflet`: rechazados por añadir dependencias npm externas no aprobadas en `AGENTS.md` ni en la Constitución.

## 2. Datos, Ubicaciones y Fotografías Reales de Andacollo

- **Decision**: Investigar mediante búsqueda web (`search_web`) la información real de cada atractivo, restaurante, alojamiento, evento y experiencia en Andacollo (direcciones exactas, coordenadas verificadas dentro de la comuna de Andacollo, horarios referenciales, historia/contexto patrimonial) y URLs de fotografías reales públicas y estables (principalmente Wikimedia Commons / fuentes oficiales de turismo de Chile/Coquimbo/Andacollo).
- **Rationale**: Reemplaza fotos genéricas de stock por imágenes y datos reales de Andacollo, manteniendo el componente `SmartImage` con respaldo local en caso de caída de red.
- **Alternatives considered**:
  - Mantener fotos genéricas de Unsplash: rechazado explícitamente por el usuario ("que sí sea información, fotos y datos reales obtenidos en internet").

## 3. Descripciones Completas y Estructuradas en Fichas

- **Decision**: Ampliar el esquema de las entidades del catálogo (`lugares`, `restaurantes`, `alojamientos`, `eventos`, `experiencias`) con campos estructurados (`descripcion_completa` / texto extenso, `destacados text[]`, `recomendaciones text[]`, y metadatos prácticos) y actualizar `DetailLayout` (`src/components/layout/DetailLayout/`) para mostrar secciones ordenadas con estilos nativos CSS3 (en unidades `rem` base `10px`):
  - Descripción completa (sin truncamiento por defecto o con lectura fluida en párrafos).
  - Qué ver / Aspectos destacados (lista estilizada con iconos vectoriales).
  - Información práctica (grilla limpia: dirección, horario, teléfono, duración/precio/época).
  - Consejos y recomendaciones para el visitante.
  - Mapa de ubicación Google Maps + botón "Cómo llegar".
  - Sección de Reseñas y Comentarios.
- **Rationale**: Resuelve la queja de descripciones resumidas y mejora la jerarquía visual siguiendo la estética de `design/` y TripAdvisor.

## 4. Sistema de Reseñas y Comentarios (`public.resenas`)

- **Decision**: Crear la tabla `public.resenas` en Supabase (Migración 003) con relación polimórfica `(tipo, item_id)` idéntica a `public.favoritos`, vinculada a `public.profiles(id)` para mostrar nombre, apellido, avatar y nivel del autor. Incorporar un trigger PostgreSQL `AFTER INSERT OR UPDATE OR DELETE` que recalcule automáticamente `rating_promedio` y `resenas_count` en la tabla destino y actualice `resenas_count` en `profiles`.
- **Rationale**: Centraliza todas las reseñas (lugares, restaurantes, alojamientos, eventos, experiencias) en una única tabla limpia con políticas RLS claras (lectura pública, escritura autenticada sobre reseñas propias) y consistencia automática de promedios.
- **Alternatives considered**:
  - Tablas separadas por cada entidad (`resenas_lugares`, `resenas_restaurantes`, etc.): rechazado por duplicar lógica de servicios, triggers y RLS.

## 5. Buscador General con Autocompletado

- **Decision**: Crear un servicio unificado de búsqueda (`src/services/search.service.js`) con caché ligera en memoria de sesión para consultar simultáneamente lugares, restaurantes, alojamientos, eventos y experiencias por nombre, categoría, subtítulo o dirección, junto con un hook `useSearchAutocomplete` (debounce de 180 ms, límite de 8 sugerencias) integrado en `SearchBar`.
- **Rationale**: Garantiza respuestas bajo 300 ms sin saturar la base de datos por cada tecla, soporta navegación accesible por teclado (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`) y permite ir directo a la ficha del resultado seleccionado.

## 6. 5 Usuarios Semilla en Supabase Auth y Documentación en README

- **Decision**: Sembrar 5 usuarios directamente en `auth.users` y `auth.identities` dentro de `supabase/seed.sql` usando `extensions.crypt(..., extensions.gen_salt('bf'))`, con UUIDs determinísticos (`00000000-0000-0000-0000-000000000001` a `...005`). El trigger existente `on_auth_user_created` crea sus filas en `public.profiles`, las cuales se actualizan enseguida con sus roles (`admin` para el #1, `viajero` para los #2–#5), niveles, XP y estadísticas, seguido de inserciones repartidas en `favoritos`, `usuario_insignias`, `usuario_desafios` y `resenas`.
- **Rationale**: Permite que `npx supabase db reset` deje los 5 usuarios listos para iniciar sesión inmediatamente sin pasos manuales, y facilita documentar credenciales exactas y resumen de actividad en `README.md`.
