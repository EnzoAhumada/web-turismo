# Feature Specification: Arquitectura Modular, Datos 100% Dinámicos en Supabase y Documentación Integral

**Feature Branch**: `001-modular-architecture-supabase`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Realiza los siguientes cambios - Separar por carpetas los modulos de paginas - Separar la logica de las paginas y su interfaz para mantener responsabilidades separadas, UI, Hooks, Services, etc - Todos los datos deben venir de la base de datos: - Estructura supabase en local para pruebas, despliegues, migraciones, seeders - Generar componentes reutilizables para los casos de interfaz compartida - Generar Readme: - Objetivo del proyecto - Arquitectura - Comandos para iniciar proyecto local, despliegues, bd, front, back, etc - Consideraciones para despliegues"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consulta y Gestión de Contenido 100% Dinámico desde Base de Datos (Priority: P1)

Los visitantes, viajeros registrados y administradores interactúan con la plataforma de turismo de Andacollo visualizando y gestionando información real y actualizada que proviene íntegramente de la base de datos, eliminando cualquier contenido fijo (hardcoded) en las vistas de sitios turísticos, gastronomía, alojamientos, eventos, experiencias, ruta astronómica, mapa interactivo, recomendaciones, gamificación y planificador de viajes.

**Why this priority**: Es la base funcional del sistema; garantiza que todo lo que ve el turista en las secciones públicas y privadas refleje el estado real de los datos administrables y que el entorno local cuente con una estructura de base de datos reproducible (migraciones y datos semilla).

**Independent Test**: Se puede probar levantando la base de datos local desde cero aplicando sus migraciones y datos semilla (seeders), y navegando por todas las vistas de la plataforma para verificar que cada listado, detalle, pin de mapa, condición astronómica, logro o ruta cargue sus registros desde la base de datos y refleje cambios realizados en ella.

**Acceptance Scenarios**:

1. **Given** un entorno de base de datos local recién inicializado con migraciones y datos semilla, **When** un visitante o usuario registrado accede a cualquier módulo (Explorar, Restaurantes, Alojamientos, Eventos, Experiencias, Astronomía, Mapa, Recomendaciones, Gamificación, Planificador, Favoritos o Perfil), **Then** el sistema muestra exclusivamente registros provenientes de la base de datos sin depender de arreglos estáticos en el código.
2. **Given** un administrador autenticado en el panel privado, **When** crea, edita o cambia el estado de un registro (sitio turístico, restaurante, alojamiento o evento), **Then** el cambio se persiste en la base de datos y se refleja inmediatamente en las vistas públicas, mapas y métricas del panel.
3. **Given** una consulta que no devuelve registros o falla al comunicarse con la base de datos, **When** el usuario visualiza la pantalla correspondiente, **Then** el sistema presenta un estado vacío o un mensaje de error visual en español integrado en la interfaz, sin utilizar alertas nativas del navegador.

---

### User Story 2 - Organización Modular por Páginas y Separación de Responsabilidades (Priority: P2)

El equipo de desarrollo mantiene y escala la aplicación trabajando sobre una estructura donde cada módulo de página está organizado en su propia carpeta, con la interfaz visual desacoplada de la lógica de estado y del acceso a datos (servicios, lógica de estado/hooks y presentación), además de emplear componentes visuales reutilizables para los patrones de interfaz compartidos.

**Why this priority**: Una vez garantizado el flujo de datos completo, la separación de responsabilidades y la reutilización de componentes aseguran que el sistema sea legible, mantenible y fácil de evolucionar sin duplicar código ni mezclar consultas de datos con la presentación visual.

**Independent Test**: Se puede verificar inspeccionando la estructura de directorios de las páginas y componentes compartidos, comprobando que ninguna vista de interfaz realice llamadas directas al cliente de base de datos, que cada página resida en su carpeta modular con sus estilos y lógica separados, y que los elementos repetidos (encabezados de sección, estados de carga, estados vacíos, filtros, tarjetas y modales) utilicen componentes compartidos.

**Acceptance Scenarios**:

1. **Given** la estructura del proyecto, **When** se revisa cualquier módulo de página (público, autenticado o de administración), **Then** dicho módulo se encuentra encapsulado en su propia carpeta de dominio/página y delega la obtención/mutación de datos a una capa de servicios y la gestión de estado a una capa lógica separada de la vista.
2. **Given** dos o más páginas que comparten patrones visuales (como banners de cabecera/hero, barras de filtros por chips/pestañas, grillas de tarjetas, indicadores de carga, bloques de estado vacío o tablas/formularios administrativos), **When** se renderizan en pantalla, **Then** utilizan componentes reutilizables unificados manteniendo coherencia visual y de estilos en español.
3. **Given** cualquier flujo de interacción del usuario (navegación, filtrado, búsqueda, autenticación, guardado en favoritos o CRUD administrativo), **When** se ejecuta tras la refactorización modular, **Then** conserva el 100% de su funcionalidad y diseño responsivo original sin regresiones.

---

### User Story 3 - Puesta en Marcha Local y Despliegue Guiado por Documentación (README) (Priority: P3)

Un desarrollador o administrador técnico configura, levanta en local, ejecuta pruebas con datos de ejemplo y despliega tanto la base de datos como la aplicación frontal siguiendo únicamente las instrucciones del documento principal del proyecto (`README.md`).

**Why this priority**: Permite que cualquier integrante del equipo o evaluador pueda reproducir el entorno completo (base de datos local, migraciones, seeders, aplicación frontal y paso a producción) de manera autónoma y estandarizada.

**Independent Test**: Se puede probar siguiendo paso a paso el archivo `README.md` en un entorno limpio para levantar la base de datos local, aplicar migraciones y seeders, iniciar el servidor de desarrollo, compilar para producción y verificar las consideraciones de despliegue.

**Acceptance Scenarios**:

1. **Given** un desarrollador que clona el repositorio por primera vez, **When** consulta el archivo `README.md`, **Then** encuentra claramente documentados el objetivo del proyecto, el diagrama y explicación de la arquitectura modular, los requisitos previos y las variables de entorno necesarias.
2. **Given** las instrucciones de comandos del `README.md`, **When** el desarrollador ejecuta los comandos indicados para base de datos (inicio local, migraciones, reinicio y carga de seeders), backend y frontend (desarrollo, compilación y previsualización), **Then** el entorno completo queda operativo con datos iniciales de Andacollo listos para pruebas.
3. **Given** la preparación para publicar la plataforma en un entorno productivo, **When** el responsable revisa la sección de consideraciones de despliegue en el `README.md`, **Then** dispone de una guía completa sobre configuración de variables de entorno, aplicación de migraciones en producción, políticas de seguridad de datos, autenticación y enrutamiento SPA.

---

### Edge Cases

- **Base de datos sin registros o categoría vacía**: Cuando una tabla o filtro de categoría no devuelve resultados, la interfaz muestra un componente reutilizable de estado vacío en español con opción para limpiar los filtros aplicados.
- **Error de conexión o consulta a la base de datos**: Si el servicio de datos reporta un fallo de red o permisos, la capa lógica captura el error y la vista muestra un aviso visual integrado en el diseño de la página con opción de reintentar, sin romper la navegación ni usar diálogos nativos.
- **Re-ejecución de migraciones y seeders locales**: Los scripts de inicialización y carga de datos semilla (seeders) deben poder ejecutarse al reiniciar la base de datos local sin generar conflictos de claves duplicadas ni inconsistencias de relaciones foráneas.
- **Usuario autenticado sin perfil o sin datos de gamificación/rutas**: Si un usuario recién registrado accede a Inicio, Perfil, Gamificación o Planificador antes de tener actividad registrada, el sistema muestra valores iniciales por defecto obtenidos de las tablas de configuración/catálogo de la base de datos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST organizar todas las páginas de la aplicación en carpetas modulares independientes por página o dominio funcional (tanto para vistas públicas, vistas protegidas de viajero y vistas del panel de administración).
- **FR-002**: Cada módulo de página MUST separar explícitamente sus responsabilidades en capas diferenciadas: interfaz de usuario (componentes de presentación y estilos), lógica de estado y ciclo de vida (hooks/controladores de vista), y capa de acceso a datos (servicios de comunicación con la base de datos).
- **FR-003**: Ningún componente de presentación o página MUST invocar directamente consultas a la base de datos; toda lectura o escritura de datos MUST realizarse a través de la capa de servicios.
- **FR-004**: El 100% de los datos de negocio mostrados en la aplicación MUST provenir de la base de datos, incluyendo:
  - Categorías, sitios turísticos (lugares), restaurantes, alojamientos, eventos y experiencias (listados y vistas de detalle).
  - Puntos y ubicaciones del mapa interactivo.
  - Condiciones de observación, horarios recomendados, puntos astronómicos, eventos astronómicos y equipamiento/consejos de la vista de Astronomía.
  - Niveles, insignias/logros, desafíos y tabla de posiciones de Gamificación.
  - Opciones y paradas de itinerarios del Planificador de Viajes y Recomendaciones.
  - Perfiles de usuario, favoritos y estadísticas del Panel de Administración.
- **FR-005**: El proyecto MUST incluir una estructura formal de base de datos local que contenga archivos de configuración local, migraciones secuenciales del esquema completo (tablas, relaciones y políticas de seguridad de acceso) y archivos de carga de datos iniciales (seeders) con información turística representativa de Andacollo.
- **FR-006**: El sistema MUST contar con un catálogo de componentes visuales reutilizables para todos los patrones de interfaz compartidos entre páginas, incluyendo como mínimo: secciones de cabecera (Hero/encabezado de página), barras de filtros y pestañas, estados de carga (spinners/skeletons), estados vacíos y mensajes de error/confirmación en el DOM, tarjetas de contenido e interfaz de tablas/modales administrativos.
- **FR-007**: Toda retroalimentación al usuario (errores de carga, confirmaciones de creación/edición/eliminación en administración, estados vacíos y validaciones de formulario) MUST mostrarse mediante componentes visuales integrados en el DOM y en español, sin emplear diálogos nativos del navegador.
- **FR-008**: El repositorio MUST incluir un archivo `README.md` completo en español que documente:
  - Objetivo del proyecto y contexto turístico de Andacollo.
  - Arquitectura de la aplicación (organización por carpetas de páginas, separación de UI, Hooks y Services, componentes compartidos y modelo de datos).
  - Comandos detallados para iniciar el proyecto en local, gestionar la base de datos local (arranque, migraciones, seeders, reinicio), ejecutar el frontend y operar el backend/servicios.
  - Consideraciones técnicas y operativas para despliegues en entornos de prueba y producción (variables de entorno, migraciones remotas, seguridad de acceso a datos y configuración de rutas).

### Key Entities *(include if feature involves data)*

- **Categoría (`categorias`)**: Clasificación temática del ecosistema turístico de Andacollo (Religioso, Astronomía, Minería, Naturaleza, Cultura, Gastronomía, etc.).
- **Lugar / Sitio Turístico (`lugares`)**: Atractivo patrimonial o natural con nombre, descripción, categoría, ubicación/coordenadas para mapa, calificación promedio, distancia, imagen y estado activo.
- **Restaurante (`restaurantes`)**: Establecimiento gastronómico local con nombre, descripción, rango de precios, horario, dirección, coordenadas, imagen y estado activo.
- **Alojamiento (`alojamientos`)**: Servicio de hospedaje con nombre, tipo, descripción, precio por noche, servicios incluidos, dirección, coordenadas, calificación, imagen y estado activo.
- **Evento (`eventos`)**: Festividad o actividad programada (incluyendo eventos culturales, religiosos y astronómicos) con fechas de inicio y fin, ubicación, categoría, descripción, imagen y estado activo.
- **Experiencia (`experiencias`)**: Actividad o tour reservable con categoría, precio, duración, descripción, disponibilidad e imagen.
- **Información Astronómica (`astronomia_condiciones` / `astronomia_horarios` / `astronomia_recursos`)**: Datos dinámicos sobre condiciones de cielo, horarios óptimos de observación, consejos y equipamiento recomendado para la ruta astronómica.
- **Gamificación (`insignias`, `desafios`, `usuario_progreso` / `perfiles`)**: Catálogo de logros desbloqueables, desafíos con puntaje de experiencia (XP) y progreso/nivel de los viajeros para la tabla de posiciones.
- **Itinerario / Ruta (`rutas_planificador` / `paradas_ruta`)**: Plantillas y paradas horarias asociadas a intereses, duración y presupuesto para el planificador de viajes.
- **Perfil y Favoritos (`profiles`, `favoritos`)**: Información del usuario autenticado, su rol (viajero o administrador), puntaje/nivel y elementos guardados como favoritos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las páginas de la aplicación (19 vistas públicas/autenticadas y 5 vistas de administración) se encuentran organizadas en carpetas modulares propias y obtienen sus datos exclusivamente a través de la capa de servicios sin bloques de datos de negocio estáticos (hardcoded) en las vistas.
- **SC-002**: El 100% de los componentes de interfaz de página están libres de llamadas directas al cliente de base de datos, delegando toda operación de lectura y escritura a servicios y hooks dedicados.
- **SC-003**: Un desarrollador puede inicializar la base de datos local desde cero (aplicando migraciones y seeders) y levantar la aplicación frontal con todas las vistas pobladas de datos de Andacollo en menos de 5 minutos siguiendo únicamente los comandos del `README.md`.
- **SC-004**: Al menos 5 patrones de interfaz repetidos entre páginas (cabeceras de página, filtros/chips, estados de carga, estados vacíos/alertas y tarjetas/tablas) están unificados en componentes reutilizables compartidos, reduciendo la duplicación estructural en las vistas.
- **SC-005**: El `README.md` cubre el 100% de las secciones requeridas (Objetivo, Arquitectura, Comandos de BD/Front/Back/Local/Despliegue y Consideraciones de Despliegue) sin pasos omitidos ni enlaces rotos.

## Assumptions

- Se mantienen intactas las rutas públicas, protegidas y de administración definidas actualmente en la aplicación, así como la identidad visual y paleta de colores oficial del proyecto.
- Para los módulos que anteriormente tenían datos estáticos en el código (Astronomía, Mapa, Gamificación, Planificador de Viajes y Recomendaciones), se crearán o ampliarán las tablas correspondientes en las migraciones de base de datos y se poblarán mediante los seeders locales para que funcionen dinámicamente desde el primer arranque.
- La configuración local de base de datos seguirá la estructura estándar del directorio `supabase/` (`config.toml`, carpeta `migrations/` y archivo `seed.sql`), permitiendo tanto la ejecución con herramientas CLI locales como la aplicación de los scripts SQL en instancias remotas de despliegue.
- No se añadirán librerías externas adicionales de gestión de estado ni de componentes visuales, cumpliendo con la restricción del proyecto de utilizar únicamente las tecnologías base aprobadas.
