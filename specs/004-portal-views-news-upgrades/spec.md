# Feature Specification: Mejoras de Mapa Móvil, Noticias de Andacollo, Vistas Administrables (Astronomía y Experiencias), Itinerario de Planificador y Perfil con Ranking Real

**Feature Branch**: `004-portal-views-news-upgrades`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "Agrega las siguientes mejoras e implementaciones nuevas para el sistema:
- Arreglar el filtro de búsqueda del mapa en modo celular, se debe visualizar de forma correcta y adaptada.
- Mejorar la vista de inicio que muestre noticias de andacollo, se debe poder mantener con el admin y debe ya venir 10 noticias recientes de andacollo que ya esten registradas en bd, si es posible ahora seria bueno dejar algo que automaticamente tome noticias desde alguna fuente de andacollo y las muestre en la app.
- Generar vista de Astronomía segun mockups, con datos en bd pero fijos que se puedan manejar desde el administrador.
- Generar vista experiencias y agregarlo a la base de datos que se puedan manejat desde el administrador
- realizar un ejemplo del planificador como un itenerario segun eventos, actividades y lugares a visitar.
- mejorar vista de perfil y vista de logros-ranking para tener datos de la bd y que sean utilis para el usuario
Respecta el orden y estandar actual para incorporar los cambios con un codigo ordenado y legible como lo es actualmente"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filtro de Búsqueda del Mapa Adaptado a Dispositivos Móviles (Priority: P1)

El viajero que abre el mapa interactivo desde un teléfono móvil visualiza el buscador y los filtros de categoría completamente adaptados al ancho de pantalla, sin solapamientos, recortes ni bloqueos sobre el mapa o la navegación inferior, pudiendo buscar lugares y cambiar de categoría cómodamente con una mano.

**Why this priority**: La mayoría de los turistas consulta el mapa en terreno desde su celular; un filtro desbordado o mal alineado impide usar la herramienta principal de orientación.

**Independent Test**: Se puede probar abriendo la vista del mapa en anchos de pantalla móviles (por ejemplo, 360px, 390px y 430px), escribiendo una búsqueda, limpiándola y alternando entre todas las categorías de filtro, verificando que el buscador, las píldoras de categoría, el área interactiva del mapa y la tarjeta de vista previa se mantengan legibles, accesibles y sin desbordamiento horizontal.

**Acceptance Scenarios**:

1. **Given** un usuario que accede a la vista de Mapa desde un dispositivo móvil, **When** la pantalla termina de cargar, **Then** el campo de búsqueda y la barra de filtros por categoría se muestran ordenados, alineados dentro del área visible y sin desbordar el ancho de la pantalla ni superponerse con los controles del mapa.
2. **Given** el usuario en modo móvil dentro del mapa, **When** escribe un término en el buscador o desliza horizontalmente los filtros de categoría para seleccionar uno, **Then** los marcadores y resultados se filtran inmediatamente y existe una acción visible y cómoda para limpiar la búsqueda.
3. **Given** un usuario móvil que selecciona un marcador del mapa, **When** se despliega la tarjeta de vista previa del lugar, **Then** la tarjeta se posiciona limpiamente sin tapar la barra de búsqueda ni quedar oculta detrás de la navegación móvil.

---

### User Story 2 - Noticias de Andacollo en Inicio con Gestión Administrativa y Actualización Automática (Priority: P1)

El visitante que ingresa a la vista de Inicio descubre una sección destacada de noticias locales de Andacollo con al menos 10 noticias recientes precargadas, pudiendo leer su resumen, fecha, fuente y acceder a la noticia completa. Además, el administrador municipal puede crear, editar, publicar/ocultar y eliminar noticias desde el panel de administración, y el sistema cuenta con un mecanismo automático o bajo demanda para incorporar noticias recientes desde una fuente local de Andacollo sin duplicar registros existentes.

**Why this priority**: Mantener la portada viva con actualidad comunal (actividades culturales, anuncios turísticos, festividades y novedades locales) convierte la aplicación en un punto de consulta recurrente tanto para visitantes como para vecinos.

**Independent Test**: Se puede probar ingresando a la vista de Inicio para verificar que aparecen las 10 noticias recientes precargadas de Andacollo con formato ordenado; luego accediendo al panel de administración para crear, editar y ocultar una noticia comprobando el reflejo inmediato en Inicio; y finalmente ejecutando la actualización desde la fuente externa de Andacollo verificando la incorporación sin duplicados y el respaldo seguro si la fuente no responde.

**Acceptance Scenarios**:

1. **Given** un usuario que abre la vista de Inicio, **When** recorre la pantalla principal, **Then** visualiza una sección dedicada de "Noticias de Andacollo" mostrando noticias publicadas ordenadas por fecha más reciente, con imagen, titular, resumen breve, fecha de publicación, etiqueta o fuente y acceso para leer el contenido completo.
2. **Given** el sistema recién inicializado con sus datos base, **When** se consultan las noticias disponibles, **Then** existen al menos 10 noticias recientes y verídicas de Andacollo disponibles para lectura inmediata.
3. **Given** un administrador autenticado en el panel de administración, **When** crea una nueva noticia, modifica una existente o cambia su estado de publicación, **Then** los cambios se reflejan de inmediato en la vista de Inicio y recibe confirmación visual en pantalla.
4. **Given** el mecanismo de obtención automática de noticias desde una fuente local de Andacollo, **When** se ejecuta la sincronización, **Then** las noticias nuevas se incorporan al listado sin duplicar titulares ya registrados, y si la fuente externa no está disponible, la aplicación continúa mostrando sin errores las noticias almacenadas.

---

### User Story 3 - Vista de Turismo Astronómico según Mockup con Datos Administrables (Priority: P2)

El visitante interesado en el astroturismo accede a la vista "Ruta Astronómica", diseñada fielmente según el mockup de referencia (estética nocturna, condiciones actuales del cielo, visibilidad, fase lunar, mejores horarios de observación y listado de lugares astronómicos recomendados), cuyos datos se almacenan en el sistema y pueden ser actualizados por el administrador cuando cambien las condiciones o recomendaciones.

**Why this priority**: El astroturismo es uno de los tres pilares patrimoniales obligatorios de Andacollo y la vista debe ofrecer información clara, atractiva y administrable sin depender de cambios manuales en el código.

**Independent Test**: Se puede probar navegando a la vista de Astronomía para comprobar la presentación fiel al mockup (bloque de condiciones actuales con cielo, visibilidad, fase lunar y mejores horarios, seguido de lugares recomendados con calificación y distancia), y luego editando esos parámetros y recomendaciones desde el panel de administración para verificar que la vista pública se actualiza al instante.

**Acceptance Scenarios**:

1. **Given** un usuario que abre la vista de Turismo Astronómico, **When** carga el contenido, **Then** observa el encabezado de "Ruta Astronómica", el panel de "Condiciones actuales" con estado del cielo, nivel de visibilidad, fase lunar y franja de "Mejores horarios", y la sección de "Lugares recomendados" con fotografía, nombre, calificación, distancia aproximada y acceso al detalle.
2. **Given** un administrador autenticado en el panel de administración, **When** actualiza las condiciones astronómicas fijas (estado del cielo, visibilidad, fase lunar, horario recomendado o notas) o gestiona los lugares astronómicos recomendados, **Then** los nuevos valores quedan persistidos y visibles inmediatamente para todos los visitantes en la vista de Astronomía.
3. **Given** un visitante en móvil o escritorio, **When** consulta la vista de Astronomía, **Then** los bloques nocturnos, iconos e indicadores mantienen contraste adecuado, legibilidad y alineación fiel al sistema de diseño del proyecto.

---

### User Story 4 - Vista de Experiencias Locales Conectada a Datos Administrables (Priority: P2)

El viajero explora la vista de "Experiencias" diseñada según el mockup de referencia (filtro por categorías como Todas, Tours, Gastronomía y Aventura; tarjetas con imagen, título, precio referencial en pesos chilenos y calificación; y acceso a la ficha detallada), con todo el catálogo almacenado en el sistema y gestionable por el administrador desde el panel privado.

**Why this priority**: Permite destacar actividades locales reservables (tours mineros, cabalgatas, noches de estrellas, rutas gastronómicas) con mantenimiento autónomo desde el panel municipal.

**Independent Test**: Se puede probar visitando la vista de Experiencias, filtrando por cada categoría y abriendo la ficha de una experiencia, y luego ingresando como administrador para crear, editar y eliminar una experiencia comprobando que el catálogo público refleja cada cambio.

**Acceptance Scenarios**:

1. **Given** un usuario que ingresa a la vista de Experiencias, **When** se carga el catálogo, **Then** visualiza el título, subtítulo descriptivo, píldoras de filtro por categoría y la lista de experiencias almacenadas con fotografía, nombre, precio en CLP, calificación y acceso a su vista de detalle.
2. **Given** el listado de experiencias visibles, **When** el usuario selecciona una categoría de filtro (por ejemplo, "Tours", "Gastronomía" o "Aventura"), **Then** el listado se actualiza instantáneamente mostrando solo las experiencias correspondientes, o un estado vacío claro en español si no existen registros en esa categoría.
3. **Given** un administrador autenticado en el panel de administración, **When** accede al módulo de gestión de Experiencias y crea, edita o elimina una actividad, **Then** el registro se guarda en la base de datos y se refleja inmediatamente en la vista pública de Experiencias.

---

### User Story 5 - Planificador de Viajes con Itinerario de Ejemplo Estructurado (Priority: P2)

El visitante que entra al Planificador de Viajes puede seleccionar duración, intereses y presupuesto según el mockup, y además visualizar de inmediato un itinerario de ejemplo completo y realista de Andacollo organizado por días y bloques horarios (mañana, tarde, noche) que combina lugares turísticos a visitar, actividades/experiencias locales y eventos de la comuna, pudiendo generar nuevas variantes personalizadas y abrir la ficha de cada parada del recorrido.

**Why this priority**: Mostrar un itinerario concreto y accionable demuestra de inmediato el valor del planificador y ayuda al turista a visualizar cómo combinar atractivos, gastronomía, eventos y astroturismo en un viaje real.

**Independent Test**: Se puede probar abriendo el Planificador de Viajes y verificando que presenta un itinerario de ejemplo claro y navegable con paradas reales de lugares, actividades y eventos ordenados por horario, y luego cambiando duración, intereses o presupuesto para generar una ruta ajustada a las preferencias elegidas.

**Acceptance Scenarios**:

1. **Given** un usuario que abre la vista del Planificador de Viajes, **When** consulta la pantalla, **Then** dispone de los controles de tiempo disponible, intereses y presupuesto, y puede ver un itinerario de ejemplo completo de Andacollo estructurado por día y franja horaria (mañana, tarde y noche).
2. **Given** el itinerario mostrado en pantalla, **When** el usuario revisa cada parada, **Then** distingue claramente el tipo de parada (lugar a visitar, actividad/experiencia, restaurante o evento), el horario sugerido, una descripción breve de qué hacer allí, el costo referencial y un enlace directo a su ficha detallada.
3. **Given** un usuario que ajusta sus preferencias (duración, intereses y presupuesto) y pulsa "Generar mi ruta", **Then** el planificador construye un itinerario coherente con sus selecciones utilizando lugares, experiencias y eventos reales registrados en la aplicación.

---

### User Story 6 - Vista de Perfil y Vista de Logros y Ranking con Datos Reales Útiles (Priority: P3)

El usuario autenticado visualiza en su Perfil y en la vista de Logros y Ranking información real derivada de su actividad registrada en el sistema (nivel de explorador, puntos de experiencia, barra de progreso hacia el siguiente nivel, logros desbloqueados y pendientes, lugares visitados, rutas completadas, favoritos y reseñas), además de un ranking comunitario de viajeros reales y opciones útiles en el perfil (edición de datos básicos y accesos directos a su actividad).

**Why this priority**: Conectar el perfil y la gamificación con datos reales del sistema convierte estas pantallas en herramientas genuinamente útiles para seguir el progreso del viaje y motivar la exploración de Andacollo.

**Independent Test**: Se puede probar iniciando sesión con distintos usuarios de prueba que tienen diferente actividad registrada, verificando que tanto el Perfil como la vista de Logros y Ranking muestran sus contadores reales, insignias correspondientes, posición en el ranking comunitario y que al editar el nombre o preferencias del perfil o registrar nueva actividad los datos se actualizan y persisten.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado que accede a su Perfil, **When** carga la vista, **Then** visualiza su nombre, nivel actual, barra de progreso de experiencia (XP), y contadores reales provenientes de la base de datos para logros obtenidos, rutas completadas, lugares visitados, favoritos y reseñas publicadas, con accesos rápidos a cada sección.
2. **Given** un usuario autenticado en la vista de Perfil, **When** accede a su configuración para actualizar su nombre visible o preferencias de cuenta y guarda los cambios, **Then** la información se persiste correctamente, se refleja en toda la aplicación y muestra confirmación visual en pantalla.
3. **Given** un usuario autenticado que accede a la vista de Logros y Ranking, **When** revisa la pantalla, **Then** visualiza su progreso de nivel, el detalle de logros desbloqueados y bloqueados (indicando qué falta para obtenerlos), sus estadísticas personales reales y una tabla de ranking comunitario ordenada por puntaje donde puede identificar su posición actual.

---

### Edge Cases

- **Pantalla móvil muy estrecha en el mapa (320px - 360px)**: El buscador y los filtros por categoría no deben generar desplazamiento horizontal de la página completa; los chips de categoría deben desplazarse suavemente dentro de su propio contenedor sin cortar texto ni tapar el botón de limpieza.
- **Fuente externa de noticias caída, lenta o con formato inesperado**: El sistema debe mostrar siempre las noticias almacenadas en base de datos sin bloquear la carga de Inicio ni mostrar pantallas de error técnicas; el administrador debe ver un aviso claro en español si la sincronización externa no pudo completarse.
- **Noticias duplicadas al sincronizar**: Si la fuente externa devuelve noticias ya existentes (mismo enlace o mismo titular normalizado), el sistema debe omitir duplicados y conservar la integridad del listado.
- **Datos astronómicos aún no editados o vacíos**: Si faltara algún campo opcional de condiciones astronómicas o no existieran lugares marcados como recomendados, la vista debe mostrar valores por defecto claros en español y un estado vacío amigable.
- **Experiencias sin resultados para un filtro**: Al seleccionar una categoría sin experiencias activas, se debe mostrar un mensaje claro en español invitando a ver "Todas" las experiencias.
- **Planificador sin eventos en una fecha o combinación muy restrictiva de filtros**: Si los filtros elegidos por el usuario tienen pocas coincidencias exactas, el planificador debe completar el itinerario con las mejores opciones disponibles de Andacollo indicando que se agregaron sugerencias complementarias.
- **Usuario recién registrado sin actividad en Perfil ni Ranking**: Un usuario nuevo con 0 XP, 0 logros y 0 visitas debe ver su perfil inicializado limpiamente (Nivel 1, barra en 0%, sugerencias de primeros pasos para ganar experiencia y su posición inicial en el ranking) sin valores vacíos ni errores de cálculo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La vista de Mapa Interactivo MUST adaptar su barra de búsqueda, botón de limpieza y filtros por categoría a dispositivos móviles sin desbordamientos horizontales, solapamientos ni obstrucción de los controles del mapa o de la barra de navegación inferior.
- **FR-002**: La vista de Inicio MUST incluir una sección visible de "Noticias de Andacollo" que muestre noticias publicadas ordenadas de la más reciente a la más antigua, con imagen, título, resumen, fecha, fuente y acceso a la lectura completa.
- **FR-003**: El sistema MUST incluir al menos 10 noticias recientes y reales de Andacollo precargadas en la base de datos como datos iniciales verificables.
- **FR-004**: El panel de administración privado MUST permitir crear, editar, activar/desactivar (publicar/ocultar) y eliminar noticias de Andacollo, manteniendo consistencia visual y de flujos con el resto de los módulos administrativos.
- **FR-005**: El sistema MUST proporcionar un mecanismo de obtención automática (y sincronización bajo demanda desde administración) de noticias desde una fuente pública local de Andacollo, evitando duplicados y manteniendo operación normal con las noticias almacenadas cuando la fuente externa no esté disponible.
- **FR-006**: La vista pública de Turismo Astronómico MUST respetar la estructura y estética del mockup de referencia ("Ruta Astronómica", bloque de condiciones actuales con estado del cielo, visibilidad, fase lunar y mejores horarios, y listado de lugares astronómicos recomendados con acceso a su ficha).
- **FR-007**: Los datos de condiciones astronómicas fijas y lugares astronómicos recomendados MUST persistirse en la base de datos y ser editables desde el panel de administración privado.
- **FR-008**: La vista pública de Experiencias MUST respetar la estructura del mockup de referencia, mostrando filtrado por categorías, tarjetas con imagen, título, precio referencial en CLP, calificación y navegación hacia la ficha detallada de cada experiencia.
- **FR-009**: El catálogo de Experiencias MUST persistirse en la base de datos y contar con un módulo completo de gestión (crear, editar, publicar/ocultar y eliminar) dentro del panel de administración privado.
- **FR-010**: La vista del Planificador de Viajes MUST presentar un itinerario de ejemplo completo y estructurado por días y franjas horarias (mañana, tarde y noche) que integre lugares a visitar, actividades/experiencias y eventos reales de Andacollo.
- **FR-011**: El Planificador de Viajes MUST permitir al usuario ajustar tiempo disponible, intereses y presupuesto para generar itinerarios personalizados enlazados a las fichas detalladas de cada lugar, experiencia o evento incluido.
- **FR-012**: La vista de Perfil MUST mostrar datos reales del usuario autenticado provenientes de la base de datos (identidad, nivel, XP, progreso, conteo real de logros, rutas completadas, lugares visitados, favoritos y reseñas) y permitir editar información básica y preferencias útiles del usuario con persistencia real.
- **FR-013**: La vista de Logros y Ranking MUST mostrar el progreso real del usuario (nivel, XP, estadísticas reales, insignias desbloqueadas y pendientes con su criterio de obtención) junto a un ranking comunitario construido con los datos reales de usuarios registrados.
- **FR-014**: Todos los textos visibles de las vistas nuevas y mejoradas, mensajes de estado, validaciones y notificaciones MUST estar íntegramente en español, utilizar retroalimentación visual integrada en la interfaz (sin diálogos nativos del navegador) y mantener el orden, estructura modular y sistema de diseño actual del proyecto.

### Key Entities *(include if feature involves data)*

- **Noticia Local (News)**: Representa una noticia o comunicado de Andacollo. Atributos clave: título, resumen, contenido completo, imagen, fuente, enlace externo de origen (si proviene de sincronización), categoría/etiqueta, fecha de publicación, indicador de origen (manual o sincronizada) y estado de publicación.
- **Condición Astronómica (Astronomy Condition)**: Registro administrable con los parámetros fijos actuales para observación nocturna en Andacollo. Atributos clave: estado del cielo, nivel de visibilidad, fase lunar y porcentaje de iluminación, rango de mejores horarios, recomendación u observación adicional, y fecha de última actualización.
- **Lugar Astronómico Recomendado (Astronomy Spot)**: Relación o configuración administrable de los lugares destacados en la Ruta Astronómica (observatorios, miradores de cielo oscuro), con orden de prioridad, distancia referencial, descripción breve y enlace al lugar turístico correspondiente.
- **Experiencia Local (Experience)**: Actividad turística o cultural reservable en Andacollo. Atributos clave: título, categoría (Tours, Gastronomía, Aventura, Astroturismo, Cultura), descripción corta y extendida, precio referencial en CLP, duración estimada, calificación, imagen, ubicación y estado activo.
- **Itinerario Planificado (Trip Itinerary)**: Secuencia ordenada de días y bloques horarios (mañana, tarde, noche) compuesta por paradas referenciadas a lugares turísticos, experiencias, restaurantes y eventos existentes, con parámetros de duración, intereses y presupuesto.
- **Perfil y Progreso de Usuario (User Profile & Gamification)**: Datos persistidos del viajero (nombre, avatar, rol, XP acumulada, nivel, preferencias) vinculados a sus logros obtenidos, lugares visitados, rutas completadas, favoritos y reseñas, utilizados tanto en su perfil como para calcular el ranking comunitario.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En pantallas móviles desde 360px de ancho, el 100% de los controles de búsqueda y filtrado del mapa son visibles, utilizables y no generan desbordamiento horizontal ni superposición con el mapa o la navegación.
- **SC-002**: La vista de Inicio muestra inmediatamente al menos 10 noticias recientes de Andacollo precargadas y cualquier cambio realizado por el administrador en noticias se refleja en la vista pública en menos de 2 segundos tras guardar.
- **SC-003**: El mecanismo de sincronización de noticias permite incorporar noticias nuevas desde una fuente local de Andacollo con 0 registros duplicados y mantiene disponibilidad del 100% de la vista de Inicio incluso si la fuente externa falla.
- **SC-004**: El 100% de los bloques visibles en las vistas de Astronomía y Experiencias coinciden con la estructura de los mockups de referencia y sus datos pueden ser creados o actualizados desde el panel de administración sin modificar código.
- **SC-005**: Un usuario que abre el Planificador de Viajes visualiza un itinerario de ejemplo completo con al menos 1 día estructurado en 3 bloques horarios que combinan lugares, actividades y eventos reales, y puede generar un itinerario personalizado en menos de 3 segundos.
- **SC-006**: El 100% de los indicadores mostrados en las vistas de Perfil y Logros-Ranking (XP, nivel, logros, visitas, rutas, favoritos/reseñas y tabla de ranking) corresponden a datos reales persistidos del usuario y de la comunidad, sin cifras ficticias codificadas de forma estática.

## Assumptions

- Se reutilizan el sistema de autenticación, protección de rutas, panel de administración privado y estructura modular existente del proyecto, respetando los principios de diseño, idioma español y retroalimentación visual definidos en la Constitución del proyecto.
- Las 10 noticias iniciales de Andacollo corresponden a hechos, actividades, anuncios o hitos culturales/turísticos recientes y reales de la comuna, debidamente redactados en español.
- La sincronización automática de noticias desde una fuente local de Andacollo utilizará una fuente pública accesible de la comuna o región (por ejemplo, feed público municipal o medio local de Andacollo/Coquimbo) con respaldo seguro hacia los datos ya almacenados en caso de indisponibilidad o restricción de red.
- Para la vista de Astronomía, los datos de condiciones actuales son registros fijos almacenados en base de datos y actualizables por el administrador (no requieren integración climática en tiempo real obligatoria).
- Las experiencias y los eventos ya cuentan con vistas o referencias parciales en el proyecto, las cuales se completarán, unificarán y conectarán plenamente con la base de datos y el panel de administración según el estándar actual.
- En el perfil del usuario, "Modo offline" o preferencias visuales se contemplan como preferencias de interfaz guardadas localmente/en perfil según corresponda, priorizando datos reales útiles de la cuenta y su actividad turística.
