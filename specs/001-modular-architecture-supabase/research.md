# Research & Technical Decisions: Arquitectura Modular, Datos 100% Dinámicos en Supabase y Documentación Integral

**Feature**: `001-modular-architecture-supabase`
**Date**: 2026-11-20

## 1. Organización Modular de Páginas por Carpetas

- **Decision**: Organizar cada módulo de página dentro de su propio subdirectorio en `src/pages/<ModuleName>/` (y `src/pages/admin/<AdminModuleName>/`), conteniendo el componente contenedor (`<ModuleName>Page.jsx`), su hoja de estilos (`<ModuleName>Page.css`), sus subcomponentes específicos de vista (si aplica) y un archivo `index.js` (barrel export) que re-exporte el componente principal para mantener importaciones limpias en `src/App.jsx`.
- **Rationale**: Actualmente existen 35 archivos planos mezclados en `src/pages/`. Agrupar cada página en su propia carpeta cumple con `FR-001`, aísla estilos y vistas locales, y permite escalar cada pantalla sin saturar el directorio raíz de páginas.
- **Alternatives considered**:
  - *Feature-sliced completo (`src/features/<domain>/{pages,hooks,services}`)*: Descartado porque varias páginas como `HomePage`, `ExplorerPage`, `MapPage`, `RecommendationsPage` y `FavoritesPage` consumen transversalmente múltiples entidades (`lugares`, `restaurantes`, `alojamientos`, `eventos`, `experiencias`, `favoritos`). Mantener `src/services/` y `src/hooks/` como capas dedicadas junto a `src/pages/<PageFolder>/` evita dependencias circulares entre features y responde directamente al requerimiento de separar responsabilidades (`UI`, `Hooks`, `Services`) y separar por carpetas los módulos de páginas.

## 2. Separación de Responsabilidades: UI, Hooks y Services

- **Decision**: Establecer una arquitectura en 3 capas estrictas dentro de `src/`:
  1. **Capa de Servicios (`src/services/*.service.js`)**: Módulos puros de acceso a datos que encapsulan el cliente `supabase` (`src/lib/supabase.js`). Ningún archivo fuera de `src/services/` puede importar `supabase` para consultas de datos.
  2. **Capa de Lógica y Estado (`src/hooks/use*.js`)**: Custom Hooks de React que gestionan estados (`loading`, `error`, `data`, filtros, formularios, modales) e invocan a `src/services/`.
  3. **Capa de Interfaz (`src/pages/<PageFolder>/` y `src/components/`)**: Componentes declarativos enfocados exclusivamente en renderizado HTML5 semántico, accesibilidad y eventos de interfaz (`event.preventDefault()`).
- **Rationale**: Desacopla la vista del origen de datos (`FR-002`, `FR-003`), facilita pruebas y mantenimiento, y elimina la duplicación de consultas a Supabase que hoy ocurre entre `HomePage`, `ExplorerPage`, `PlaceDetailPage`, `FavoritesPage` y las páginas de administración.
- **Alternatives considered**:
  - *React Context global para todas las tablas*: Descartado por sobrecarga innecesaria de memoria y re-renders; los custom hooks por dominio (`usePlaces`, `useRestaurants`, `useAdminCrud`, etc.) mantienen el código simple y sin dependencias externas (Principio VI).

## 3. Eliminación del 100% de Datos Hardcoded y Esquema en Supabase

- **Decision**: Ampliar el esquema relacional de Supabase para cubrir tanto las entidades ya consultadas (`profiles`, `categorias`, `lugares`, `restaurantes`, `alojamientos`, `eventos`, `experiencias`, `favoritos`) como todas las secciones que tenían arreglos estáticos en el código:
  - **Coordenadas y Mapa**: Añadir `latitud`, `longitud`, `color_pin`, `distancia_km` a las entidades georreferenciables (`lugares`, `restaurantes`, `alojamientos`) para que `MapPage` cargue todos sus pines y filtros desde la base de datos.
  - **Módulo de Astronomía**: Crear tablas `astronomia_condiciones` (estado del cielo, visibilidad, fase lunar, temperatura), `astronomia_horarios` (hora, etiqueta, icono, calidad) y `astronomia_recursos` (consejos de observación y lista de equipamiento recomendado), además de filtrar `lugares` y `eventos` de categoría `astronomia`.
  - **Módulo de Gamificación**: Crear tablas `insignias` (catálogo de medallas), `usuario_insignias` (logros obtenidos por usuario), `desafios` (retos activos con XP) y `usuario_desafios` (progreso por usuario), y alimentar la tabla de posiciones (Leaderboard) directamente desde `profiles` ordenado por `xp DESC`.
  - **Módulo Planificador de Viajes**: Crear tablas `planificador_config` (duraciones, presupuestos) y `rutas_sugeridas` / `ruta_paradas` vinculadas a categorías/intereses, duración y presupuesto, además de permitir guardar la ruta generada en `favoritos` o `usuario_rutas`.
  - **Módulo Recomendaciones y Home**: Crear tabla `destacados_dia` (banners contextuales de clima/eventos para `HomePage` y `RecommendationsPage`) y alimentar las grillas desde `lugares`, `restaurantes`, `experiencias` y `eventos`.
- **Rationale**: Cumple con `FR-004` y `SC-001` garantizando que ninguna vista tenga constantes de datos de negocio cableadas en los archivos `.jsx` y que todo sea administrable desde Supabase.
- **Alternatives considered**:
  - *Guardar datos estáticos en un JSON local*: Rechazado porque el requerimiento exige explícitamente que "Todos los datos deben venir de la base de datos".

## 4. Estructura Local de Supabase (Pruebas, Migraciones, Seeders y Despliegues)

- **Decision**: Configurar el directorio estándar `supabase/` en la raíz del proyecto con:
  - `supabase/config.toml`: Configuración oficial del entorno local de Supabase CLI (puertos locales API `54321`, DB `54322`, Studio `54323`, Inbucket `54324`, configuración de Auth y ruta a `seed.sql`).
  - `supabase/migrations/20261120000001_initial_schema.sql`: DDL completo idempotente con todas las tablas, claves foráneas, índices, triggers de creación automática de perfil en `auth.users` y políticas Row Level Security (RLS) para lectura pública, escritura de usuarios autenticados en sus propios registros (`profiles`, `favoritos`, progreso) y control total para rol `admin`.
  - `supabase/seed.sql`: Seeder idempotente (`ON CONFLICT DO UPDATE` / `TRUNCATE ... CASCADE`) con datos reales y representativos de Andacollo (Basílica Menor, Observatorio Collowara, Mina Churrumata, Mirador El Toro, restaurantes locales, alojamientos, festividades, experiencias, condiciones astronómicas, insignias, desafíos, paradas de rutas y perfiles de prueba).
  - Scripts NPM en `package.json`: Comandos directos (`db:start`, `db:stop`, `db:reset`, `db:migrate`, `db:seed`, `db:push`) para facilitar la operación local y el despliegue.
- **Rationale**: Es el estándar oficial de Supabase para desarrollo local reproducible, pruebas de integración y despliegue continuo hacia proyectos remotos (`supabase db push`).
- **Alternatives considered**:
  - *Scripts SQL sueltos sin estructura de CLI*: Descartado porque impide usar `supabase start` y `supabase db reset` de manera automatizada para pruebas locales.

## 5. Catálogo de Componentes Reutilizables y Reemplazo de `window.confirm`

- **Decision**: Crear y consolidar en `src/components/ui/` y `src/components/admin/` los siguientes componentes reutilizables:
  1. `PageHero`: Banner de cabecera configurable (título, subtítulo, eyebrow, imagen/clase de fondo, buscador opcional) para unificar `HomePage`, `ExplorerPage`, `RestaurantsPage`, `AccommodationsPage`, `ExperiencesPage`, `AstronomyPage` y `EventsPage`.
  2. `FilterTabs` / `FilterChips`: Barra reutilizable de pestañas o chips de filtrado con accesibilidad (`aria-pressed` / `role="tablist"`).
  3. `LoadingState`: Indicador de carga unificado (de página completa o de sección) con texto accesible en español.
  4. `EmptyState`: Bloque visual reutilizable para listas sin resultados o errores de carga, con icono, título, descripción y acción opcional.
  5. `FeedbackBanner`: Alerta visual en el DOM (`role="alert"` / `role="status"`) para errores y confirmaciones sin usar `alert()`.
  6. `ConfirmModal`: Ventana modal estilizada con la paleta oficial (`Primary`, `Navy`, `Gold`, `White`, medidas en `rem`) para confirmar eliminaciones en el panel de administración, eliminando las 4 llamadas a `window.confirm()` detectadas en `PlacesAdminPage`, `RestaurantsAdminPage`, `AccommodationsAdminPage` y `EventsAdminPage`.
  7. `DetailLayout`: Plantilla compartida para las 5 páginas de detalle (`PlaceDetailPage`, `RestaurantDetailPage`, `AccommodationDetailPage`, `EventDetailPage`, `ExperienceDetailPage`), que hoy duplican el 85% del JSX y comparten `PlaceDetailPage.css`.
  8. `AdminCrudTable`: Tabla administrativa reutilizable que unifica las vistas CRUD del panel privado.
- **Rationale**: Cumple con `FR-006`, `FR-007`, `SC-004` y corrige la violación al Principio V de la Constitución y `AGENTS.md` (prohibición estricta de `alert`, `confirm`, `prompt`).
- **Alternatives considered**:
  - *Mantener cada página de detalle y tabla admin con su propio JSX*: Rechazado por alta duplicación (~1,200 líneas repetidas entre las 5 páginas de detalle y las 4 páginas de administración).
