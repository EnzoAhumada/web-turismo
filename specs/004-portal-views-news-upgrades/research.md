# Phase 0 Research: Mejoras de Mapa Móvil, Noticias de Andacollo, Vistas Administrables, Planificador y Perfil/Ranking

**Feature**: `004-portal-views-news-upgrades`  
**Date**: 2026-11-23

## Decisiones Técnicas

### 1. Corrección del Filtro de Búsqueda del Mapa en Modo Celular
- **Decision**: Rediseñar la distribución responsiva (`@media (max-width: 900px)` y `@media (max-width: 600px)`) en `MapPage.css` y `MapPage.jsx` para que el contenedor de búsqueda y filtros forme una cabecera compacta fija sobre el mapa con barra de búsqueda de ancho completo (`100%`, `min-width: 0`) y una fila única de píldoras de categoría con desplazamiento horizontal suave (`flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;`), reservando espacio inferior seguro para `BottomNav` (`--bottom-nav-h`) para que la tarjeta móvil de vista previa (`.map-mobile-preview`) y los controles de zoom (`.map-controls`) nunca queden ocultos ni se solapen.
- **Rationale**: Actualmente en móvil `.map-panel__filters` hace `flex-wrap: wrap` (consumiendo demasiado espacio vertical en pantallas de 360px–430px), el contenedor `.map-page` usa `height: 100vh` sin compensar `BottomNav`, y la tarjeta `.map-mobile-preview` se posiciona en `bottom: var(--space-4)`, quedando parcialmente tapada por la barra inferior móvil. Usar `100dvh` con margen inferior para `BottomNav` y chips en scroll horizontal coincide directamente con el mockup `design/2 mapa interactivo.jpg`.
- **Alternatives considered**: Ocultar los filtros detrás de un modal desplegable en móvil. Se descartó porque añade un clic extra y se aleja del mockup `2 mapa interactivo.jpg`, donde el buscador y los chips son visibles directamente arriba del mapa.

### 2. Noticias de Andacollo: Persistencia, 10 Noticias Semilla y Sincronización Automática desde Fuente Local
- **Decision**:
  1. Crear la tabla `public.noticias` en una nueva migración SQL (`supabase/migrations/20261123000001_news_admin_profile_enhancements.sql`) con campos para título, resumen, contenido completo, imagen, fuente, categoría, `url_externa` (única cuando existe para evitar duplicados), `origen` (`manual` | `automatica`), `fecha_publicacion`, `destacada` y `activa`, junto con políticas RLS (lectura pública de noticias activas y CRUD completo para administradores).
  2. Precargar **10 noticias recientes y reales de Andacollo** en `supabase/seed.sql` (y mediante `ON CONFLICT` idempotente) cubriendo actualidad comunal, patrimonio religioso, astroturismo, minería, cultura, deportes y servicios turísticos locales.
  3. Implementar una **Supabase Edge Function** (`supabase/functions/sync-andacollo-news/index.ts`) en Deno (sin dependencias externas npm en el frontend) que consulta fuentes públicas RSS de noticias de Andacollo (priorizando medios locales/regionales como `https://andacolloconectado.cl/feed/` y respaldo `https://www.elobservatodo.cl/taxonomy/term/andacollo/feed` / feed municipal), parsea XML RSS estándar con expresiones seguras, normaliza fecha/resumen/imagen y realiza `upsert` idempotente en `public.noticias` evitando duplicados por `url_externa` o título normalizado.
  4. Desde el frontend (`src/services/news.service.js`), invocar `supabase.functions.invoke('sync-andacollo-news')` de forma no bloqueante (tanto manualmente desde el botón "Sincronizar fuente local" en `NewsAdminPage` como mediante verificación ligera controlada por tiempo en `HomePage` cuando han pasado más de 6 horas desde la última sincronización), con degradación elegante hacia las noticias ya guardadas en base de datos si el entorno local no tiene la Edge Function desplegada o no hay acceso a internet.
- **Rationale**: El navegador no puede leer feeds RSS externos directamente por restricciones CORS; una Supabase Edge Function resuelve CORS de forma nativa dentro del stack aprobado (`Supabase`), evita añadir dependencias externas al cliente React y garantiza cero duplicados al persistir directamente en PostgreSQL con clave de servicio.
- **Alternatives considered**:
  - Usar un proxy CORS público de terceros en el cliente: descartado por fragilidad, privacidad y dependencia de servicios externos no controlados.
  - Cargar noticias solo desde un JSON estático: descartado porque el usuario requiere gestión desde el panel de administración y sincronización real con una fuente de Andacollo.

### 3. Vista de Turismo Astronómico Administrable según Mockup `8 turismo astronomico.jpg`
- **Decision**:
  1. Mantener y refinar las tablas existentes `astronomia_condiciones`, `astronomia_horarios` y `astronomia_recursos`, añadiendo políticas RLS de escritura para administradores (`public.is_admin()`) que faltaban en la migración inicial, además de una tabla/campos complementarios de configuración general (o gestión directa de los 3 indicadores fijos: cielo, visibilidad, fase lunar, más mejores horarios y orden de lugares astronómicos en `lugares.es_astronomico`).
  2. Alinear `AstronomyPage.jsx` y `AstronomyPage.css` fielmente al mockup `design/8 turismo astronomico.jpg`: encabezado nocturno oscuro con título "Ruta Astronómica" y subtítulo "Observación de estrellas", panel "Condiciones actuales" en 3 columnas con iconos circulares (Cielo, Visibilidad, Luna) y fila "Mejores horarios" destacada, seguido de "Lugares recomendados" con tarjeta compacta (foto, título, calificación, distancia, descripción breve y enlace a `/lugar/:id`), manteniendo el bloque complementario de eventos celestes y recomendaciones en escritorio.
  3. Crear `src/pages/admin/AstronomyAdminPage/` y agregar el acceso "Astronomía" en `AdminSidebar` y `App.jsx` (`/admin/astronomia`) para que el administrador pueda editar en línea o mediante formulario las condiciones fijas del cielo, horarios recomendados, consejos/equipamiento y marcar qué lugares aparecen en la Ruta Astronómica.
- **Rationale**: Las tablas astronómicas ya existen en el esquema, pero carecían de políticas RLS de administrador y de interfaz de gestión en el panel privado. Completar ambas capas evita duplicar tablas y mantiene la arquitectura limpia.
- **Alternatives considered**: Crear una nueva tabla monolítica `astronomia_config` descartando las 3 tablas existentes. Se descartó para no romper la compatibilidad con el esquema y seed ya operativos.

### 4. Vista de Experiencias Conectada a Base de Datos y Módulo Admin
- **Decision**:
  1. Conservar `public.experiencias` (ya existente con RLS de lectura pública y CRUD de administrador), ampliando su restricción de categorías si es necesario para soportar consistentemente `Tours`, `Gastronomía`, `Aventura`, `Astroturismo` y `Cultura` (conservando las píldoras del mockup `Todas`, `Tours`, `Gastronomía`, `Aventura`).
  2. Refinar `ExperiencesPage.jsx` y `ExperiencesPage.css` para reflejar el layout limpio y escaneable del mockup `design/11 experiencias locales.jpg` (píldoras de filtro con estado activo destacado, tarjetas con fotografía lateral en móvil y grilla limpia en escritorio, precio formateado en `$XX.XXX CLP`, duración, calificación y enlace directo a `/experiencias/:id`).
  3. Crear `src/pages/admin/ExperiencesAdminPage/` siguiendo exactamente el patrón reutilizable `useAdminCrud` + `AdminCrudView` y registrar la ruta `/admin/experiencias` en `App.jsx` y `AdminSidebar`.
- **Rationale**: Maximiza la reutilización del patrón CRUD administrativo existente (`AdminCrudView`, `AdminCrudModal`, `useAdminCrud`) y garantiza consistencia visual y de código.
- **Alternatives considered**: Construir un formulario administrativo separado con lógica propia. Se descartó por duplicar código que ya resuelve `AdminCrudView`.

### 5. Planificador de Viajes con Itinerario de Ejemplo (Eventos, Actividades y Lugares)
- **Decision**:
  1. Ampliar `src/services/planner.service.js` para que combine datos reales de 4 fuentes de Supabase: `lugares`, `experiencias`, `eventos` y `restaurantes` (complementando `rutas_paradas`), organizando el resultado en una estructura de **días** (`Día 1`, `Día 2`, etc.) y **bloques horarios** (`Mañana`, `Tarde`, `Noche`).
  2. Proveer un **itinerario de ejemplo inmediato** al abrir `/planificador` (por ejemplo, "Escapada Ideal de 1 Día en Andacollo: Patrimonio, Sabores y Estrellas") cargado con registros reales de la BD que incluye lugares turísticos, una parada gastronómica, una experiencia/actividad local y un evento vigente, cada uno con insignia de tipo (`Lugar`, `Experiencia`, `Gastronomía`, `Evento`), horario sugerido, descripción práctica, costo referencial y enlace navegable a su ficha (`/lugar/:id`, `/experiencias/:id`, `/restaurantes/:id`, `/eventos/:id`).
  3. Permitir regenerar el itinerario dinámicamente según `duration` (`Medio día`, `1 día`, `2 – 3 días`, `+3 días`), `selectedInterests` y `budget` (`Económico`, `Moderado`, `Premium`), además de guardar/completar la ruta actual actualizando `rutas_completadas` y `xp` del usuario autenticado en `public.profiles`.
- **Rationale**: Cumple exactamente con mostrar un ejemplo concreto y útil del planificador como itinerario real y al mismo tiempo vuelve funcional el generador según el mockup `design/6 planificador de viajes.jpg`.
- **Alternatives considered**: Mostrar un itinerario de ejemplo estático en el frontend sin consultar la base de datos. Se descartó porque rompería los enlaces reales a fichas y no reflejaría nuevos eventos/experiencias creados desde el administrador.

### 6. Mejora de Vistas de Perfil y Logros-Ranking con Datos Reales de BD
- **Decision**:
  1. En la migración SQL, añadir a `public.profiles` columnas útiles opcionales (`biografia`, `ciudad_origen`, `preferencia_offline boolean DEFAULT false`) y asegurar que existan funciones/consultas limpias para calcular métricas reales del usuario desde la BD:
     - Logros obtenidos reales: conteo real de `usuario_insignias` para el usuario (no `resenas_count` ni fallback `7`).
     - Favoritos reales: conteo y resumen reciente desde `favoritos` cruzado con los nombres de lugares/experiencias/eventos.
     - Lugares visitados y rutas completadas: valores reales desde `profiles` (sin fallbacks falsos `18` ni `5`; si es nuevo, muestra `0`).
     - Preferencia `modo_offline`: persistida en `profiles.preferencia_offline` (con respaldo en `localStorage` para respuesta inmediata).
  2. En `ProfilePage` y `useProfileStats.js`: mostrar estadísticas reales, sección útil de accesos directos y actividad reciente (últimos favoritos guardados y progreso al próximo nivel), edición completa de nombre, apellido, ciudad de origen y avatar URL, y estado real del ranking del usuario.
  3. En `GamificationPage` y `gamification.service.js`: eliminar valores ficticios (`index === 2`, avatares fijos externos) y calcular nivel/XP coherentes, mostrar insignias desbloqueadas vs bloqueadas con su requisito de XP/acción, permitir marcar/actualizar progreso de desafíos activos persistiendo en `usuario_desafios` y sumando XP real en `profiles`, y renderizar la **Tabla de posiciones (Ranking)** real ordenada por `xp` mostrando lugar del usuario, nivel, insignias, lugares visitados y destacando su posición exacta incluso si está fuera del Top 10.
- **Rationale**: Corrige inconsistencias existentes en `ProfilePage` (donde "Mis logros" mostraba `resenas_count ?? 7`) y convierte Perfil y Logros-Ranking en vistas genuinamente útiles y sincronizadas con la base de datos.
- **Alternatives considered**: Calcular XP solo en memoria del navegador. Se descartó porque el ranking comunitario requiere persistencia compartida en `public.profiles`.
