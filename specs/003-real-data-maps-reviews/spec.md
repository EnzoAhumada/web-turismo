# Feature Specification: Datos Reales Verificados, Fichas Completas, Google Maps, Autocompletado, Reseñas y Usuarios Semilla

**Feature Branch**: `003-real-data-maps-reviews`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Aplica estas mejoras:
- Busca en internet informacion, ubicacion y fotos reales para utilizar en los lugares que tiene mi app en bd. Para esto es importante que si sea informacion, fotos y datos reales obtenidos en internet
- Mejora la informacion y descripcion que se muestra por cada lugar, deben ser informacion mas completa y no resumidas, ademas de mostrarse de forma ordenada en la app con estilos y formatos
- Agrega google maps para mostrar y ubicar los lugares de la app
- Agrega 5 usuarios de seed para el sistema, uno de admin y ootros genericos que tengan favoritos, logros, comentarios, etc repartidos, ademas deja en el readme las credenciales de prueba de esos user, y toodos los datos que hagan falta para poder revisarlos
- Mejora el buscador general para que tenga autocompletado
- Agrega la visualizacion de reseñas y la posibilidad de comentar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Información Real Verificada, Fotografías Auténticas y Fichas Detalladas Ordenadas (Priority: P1)

El visitante que explora los atractivos turísticos, restaurantes, alojamientos, eventos y experiencias de Andacollo accede a fichas completas, verídicas y enriquecidas con información real investigada de la comuna (historia, características patrimoniales, dirección exacta, coordenadas reales, horarios, precios referenciales, recomendaciones prácticas y fotografías reales del lugar), presentadas de forma ordenada con jerarquía visual, secciones claras y formato legible en lugar de resúmenes breves.

**Why this priority**: La credibilidad y utilidad de una guía turística dependen directamente de que los datos, ubicaciones y fotografías correspondan a lugares reales de Andacollo y entreguen contexto suficiente para planificar una visita real.

**Independent Test**: Se puede verificar consultando el catálogo completo y abriendo las fichas de detalle de cada lugar (sitios turísticos, restaurantes, alojamientos, eventos y experiencias) para comprobar que todas las fotografías cargan imágenes reales correspondientes a cada sitio o entorno auténtico, que las coordenadas y direcciones corresponden a Andacollo, y que cada ficha presenta descripciones extensas y estructuradas en bloques ordenados (reseña histórica/descripción general, qué ver o hacer, información práctica y recomendaciones).

**Acceptance Scenarios**:

1. **Given** un usuario que navega por cualquier categoría del catálogo público, **When** visualiza las tarjetas y abre la vista de detalle de cualquier lugar, **Then** observa fotografías reales y verificadas del lugar o actividad, su ubicación real en Andacollo y una descripción completa (no resumida) organizada en secciones visuales claras y estilizadas.
2. **Given** la vista de detalle de un lugar, **When** el usuario recorre la ficha informativa, **Then** distingue de forma ordenada la descripción extendida, los aspectos destacados o atractivos principales, la información práctica (dirección, horario, tarifas o rango de precios, contacto y tiempo estimado de visita) y consejos útiles para el visitante.
3. **Given** un lugar con múltiples datos complementarios, **When** se visualiza tanto en escritorio como en teléfono móvil, **Then** la estructura ordenada de títulos, listas, insignias informativas y bloques de contenido mantiene legibilidad, espaciado equilibrado y sin desbordamientos.

---

### User Story 2 - Ubicación y Exploración Interactiva en Google Maps (Priority: P1)

El viajero visualiza la ubicación real de todos los lugares de Andacollo directamente sobre Google Maps, tanto en la vista de mapa general (con marcadores interactivos filtrables por categoría y vista previa del lugar seleccionado) como en la ficha individual de cada lugar (con mapa embebido de ubicación y acceso directo para abrir indicaciones de ruta).

**Why this priority**: Los turistas necesitan ubicar geográficamente los atractivos, restaurantes y hospedajes respecto al centro de Andacollo y sus caminos de acceso para orientarse y llegar sin perderse.

**Independent Test**: Se puede probar abriendo la sección de Mapa y la ficha de detalle de distintos lugares, verificando que Google Maps renderiza el mapa centrado en Andacollo con marcadores ubicados en las coordenadas reales de cada registro, que al pulsar un marcador se muestra la tarjeta de vista previa del lugar, y que desde cada ficha se puede visualizar su punto exacto y abrir indicaciones de llegada.

**Acceptance Scenarios**:

1. **Given** un usuario que accede a la vista de Mapa Interactivo, **When** carga la pantalla, **Then** visualiza un mapa de Google Maps centrado en Andacollo con marcadores diferenciados por categoría en las ubicaciones reales de los lugares registrados.
2. **Given** el mapa interactivo con marcadores visibles, **When** el usuario aplica filtros por categoría o selecciona un marcador específico, **Then** los marcadores visibles se actualizan acorde al filtro y se despliega la tarjeta de vista previa del lugar seleccionado con acceso directo a su ficha completa.
3. **Given** la ficha de detalle de cualquier lugar, **When** el usuario consulta la sección de ubicación, **Then** visualiza un mapa de Google Maps mostrando el pin exacto del lugar y dispone de una acción clara ("Cómo llegar") para iniciar la navegación hacia sus coordenadas reales.

---

### User Story 3 - Visualización de Reseñas y Publicación de Comentarios (Priority: P2)

Los visitantes consultan las opiniones, calificaciones con estrellas y comentarios reales de otros viajeros en la ficha de cada lugar, y los usuarios autenticados pueden publicar sus propias reseñas con puntuación y comentario para compartir su experiencia con la comunidad.

**Why this priority**: Las reseñas y calificaciones son el corazón de la confianza social en plataformas turísticas tipo TripAdvisor y fomentan la participación activa de los usuarios registrados.

**Independent Test**: Se puede probar visitando la ficha de un lugar sin iniciar sesión (verificando el listado de reseñas existentes, promedio de estrellas y conteo total) y luego iniciando sesión con un usuario de prueba para enviar una nueva calificación y comentario, comprobando que aparece de inmediato en el listado y actualiza el promedio mostrado.

**Acceptance Scenarios**:

1. **Given** un visitante (autenticado o no) que abre la ficha de un lugar, **When** se desplaza a la sección de reseñas, **Then** visualiza el resumen de calificación promedio, el total de reseñas y la lista ordenada de comentarios con nombre del autor, fecha, puntuación en estrellas y texto de la opinión.
2. **Given** un usuario autenticado que visualiza la ficha de un lugar, **When** selecciona una puntuación (1 a 5 estrellas), redacta un comentario válido y envía el formulario, **Then** la nueva reseña se guarda, aparece inmediatamente en la lista de reseñas del lugar y recibe confirmación visual en pantalla sin usar diálogos nativos del navegador.
3. **Given** un visitante no autenticado que intenta comentar en un lugar, **When** visualiza el área de publicación de reseñas, **Then** observa un aviso claro en español invitándolo a iniciar sesión o registrarse para publicar su opinión, manteniendo visible la lectura de las reseñas existentes.

---

### User Story 4 - Buscador General con Autocompletado Inteligente (Priority: P2)

Cuando el usuario escribe en el buscador general de la aplicación, recibe sugerencias instantáneas en un menú desplegable con autocompletado que muestra coincidencias por nombre, categoría o ubicación (lugares, restaurantes, alojamientos, eventos y experiencias), permitiendo navegar directamente al resultado elegido o ejecutar la búsqueda completa.

**Why this priority**: El buscador es el punto de entrada principal para viajeros que ya tienen en mente un atractivo o servicio específico; el autocompletado reduce el tiempo de descubrimiento y evita búsquedas fallidas.

**Independent Test**: Se puede probar escribiendo términos parciales en el buscador general (por ejemplo `"Basílica"`, `"Collowara"`, `"Restaurante"`, `"Mina"`) y verificando que aparece una lista desplegable con sugerencias relevantes, categoría e imagen miniatura, navegando con teclado o clic hacia la ficha del lugar seleccionado.

**Acceptance Scenarios**:

1. **Given** un usuario posicionado en el buscador general, **When** comienza a escribir al menos 2 caracteres, **Then** se despliega de forma inmediata una lista de sugerencias filtradas con nombre del lugar, categoría y ubicación o subtítulo.
2. **Given** la lista de autocompletado desplegada, **When** el usuario hace clic en una sugerencia o la selecciona con las teclas de dirección y Enter, **Then** navega directamente a la ficha detallada de ese lugar y se cierra el menú desplegable.
3. **Given** una consulta sin coincidencias exactas, **When** el usuario escribe un término inexistente, **Then** el menú desplegable informa amablemente en español que no se encontraron coincidencias directas y ofrece limpiar o ver todo el catálogo.

---

### User Story 5 - 5 Usuarios Semilla con Actividad Distribuida y Documentación en README (Priority: P2)

El sistema incluye 5 usuarios de prueba precargados (1 administrador municipal y 4 usuarios viajeros/locales) con actividad realista y distribuida entre favoritos, logros/insignias, lugares visitados, rutas completadas y reseñas/comentarios publicados, junto con una guía clara en el `README.md` que detalla sus credenciales de acceso y el resumen de datos asociados para facilitar la revisión y pruebas.

**Why this priority**: Permite validar inmediatamente todos los flujos de la plataforma (administración, perfiles, gamificación, favoritos y reseñas) sin necesidad de crear cuentas ni poblar interacciones manualmente tras cada reinicio.

**Independent Test**: Se puede probar reiniciando el entorno de base de datos semilla, consultando las credenciales documentadas en `README.md` e iniciando sesión con cada uno de los 5 usuarios (el administrador en el panel municipal y los 4 usuarios en la app pública) para comprobar que sus favoritos, logros, historial de visitas y reseñas coinciden con lo documentado.

**Acceptance Scenarios**:

1. **Given** el entorno inicializado con los datos semilla del sistema, **When** un revisor consulta el archivo `README.md`, **Then** encuentra una sección dedicada con las credenciales completas (correo y contraseña) de los 5 usuarios de prueba, sus roles y el detalle de qué favoritos, logros y comentarios posee cada uno.
2. **Given** los 4 usuarios viajeros genéricos, **When** se inicia sesión con cualquiera de ellos, **Then** su perfil, pestaña de favoritos, módulo de gamificación y reseñas en fichas reflejan datos repartidos y coherentes con su perfil de actividad (por ejemplo, distintos niveles de XP, insignias desbloqueadas y lugares guardados/comentados).
3. **Given** el usuario administrador semilla, **When** inicia sesión en la aplicación, **Then** accede al panel de administración privado con permisos completos para crear, editar y gestionar lugares, alojamientos, restaurantes y eventos.

---

### Edge Cases

- **Envío de reseña vacía o sin calificación**: Si un usuario autenticado intenta enviar un comentario vacío o sin seleccionar estrellas, el formulario muestra validación visual en español dentro de la interfaz sin recargar la página ni usar `alert()`.
- **Fallo o ausencia de configuración de clave de Google Maps**: Si en algún entorno local o de revisión no está configurada una clave de API de mapas o hay restricción de red, el componente de mapa muestra una alternativa funcional embebida o un estado visual claro con las coordenadas exactas y enlace directo para abrir la ubicación en Google Maps externo, sin romper la vista.
- **Imágenes externas con bloqueo temporal o carga lenta**: Si alguna fotografía real externa tarda en cargar o falla temporalmente, la tarjeta y la ficha mantienen sus proporciones fijas y muestran una imagen local de respaldo coherente sin iconos rotos.
- **Cierre del menú de autocompletado**: Al hacer clic fuera del buscador, presionar la tecla `Escape` o limpiar el campo de texto, la lista desplegable de autocompletado se cierra limpiamente sin interferir con otros elementos de la página.
- **Comentarios duplicados o múltiples en un mismo lugar**: El sistema maneja de forma clara la publicación de reseñas evitando envíos accidentales múltiples por doble clic (deshabilitando el botón mientras se procesa la solicitud).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Datos Reales Investigados de Andacollo)**: Todos los registros del catálogo en la base de datos semilla (sitios turísticos, restaurantes, alojamientos, eventos, experiencias y puntos astronómicos) MUST contener información real y verificable de Andacollo (nombres oficiales, ubicaciones/direcciones reales, coordenadas geográficas reales dentro de la comuna, horarios o fechas reales/referenciales y URLs de fotografías reales y accesibles correspondientes a cada lugar o su entorno real).
- **FR-002 (Descripciones Completas y Presentación Estructurada)**: Cada lugar MUST contar con una descripción extensa y detallada (no un resumen de una o dos líneas) presentada de forma ordenada mediante secciones visuales claras y estilizadas en la ficha de detalle (contexto e historia, qué incluye o qué hacer, información práctica estructurada y recomendaciones para el visitante).
- **FR-003 (Integración de Google Maps)**: La plataforma MUST integrar Google Maps tanto en la vista de Mapa Interactivo general (mostrando todos los lugares filtrables por categoría con marcadores y tarjeta de vista previa) como en la ficha individual de cada lugar (mostrando su ubicación exacta y acceso directo "Cómo llegar" con las coordenadas reales).
- **FR-004 (Buscador General con Autocompletado)**: El buscador general MUST ofrecer autocompletado en tiempo real mientras el usuario escribe, desplegando coincidencias por nombre, categoría o dirección/subtítulo, con soporte para selección por clic o teclado (flechas arriba/abajo, Enter y Escape) y navegación directa a la ficha del lugar seleccionado.
- **FR-005 (Visualización y Publicación de Reseñas/Comentarios)**: La ficha de cada lugar MUST mostrar el promedio de calificación, el conteo total y el listado de reseñas existentes (autor, fecha, estrellas y comentario). Los usuarios autenticados MUST poder publicar nuevas reseñas con calificación de 1 a 5 estrellas y comentario, actualizando el listado y promedio de forma inmediata con feedback visual nativo en el DOM.
- **FR-006 (5 Usuarios Semilla con Actividad Repartida)**: La base de datos semilla MUST incluir exactamente 5 usuarios de prueba funcionales: 1 usuario con rol administrador y 4 usuarios viajeros genéricos con distintos niveles de progreso, favoritos, logros/insignias, lugares visitados, rutas completadas y reseñas/comentarios distribuidos entre los distintos lugares del catálogo.
- **FR-007 (Documentación de Credenciales y Datos de Prueba en README)**: El archivo `README.md` MUST incluir una sección clara y completa con las credenciales de acceso (correo electrónico, contraseña y rol) de los 5 usuarios semilla, además de un resumen de los datos de prueba asociados a cada uno (favoritos, logros, reseñas y cómo probar cada flujo, incluyendo la configuración de mapa si aplica).
- **FR-008 (Cumplimiento de Reglas de Proyecto y Español Obligatorio)**: Todos los textos visibles nuevos (etiquetas del mapa, autocompletado, formulario y mensajes de reseñas, secciones de fichas y estados vacíos) MUST estar íntegramente en español, respetar la paleta de colores oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`), utilizar unidades `rem` (base `10px`), evitar `innerHTML`, `alert()`, `confirm()` y `prompt()`, y funcionar de manera responsiva en escritorio y móvil.

### Key Entities

- **Lugar / Atractivo Turístico (`places`)**: Entidad principal del catálogo con nombre real, categoría, subcategoría, descripción completa y estructurada, aspectos destacados, recomendaciones, dirección exacta en Andacollo, coordenadas geográficas reales (latitud y longitud), horarios, precio referencial, teléfono/contacto, fotografía principal real y galería/respaldo.
- **Reseña / Comentario (`reviews`)**: Opinión asociada a un lugar y a un usuario autor, con calificación numérica (1 a 5 estrellas), comentario en español y fecha de publicación.
- **Usuario Semilla (`profiles` + cuentas de autenticación)**: Perfil de usuario con nombre completo, rol (`admin` o viajero), nivel, puntos de experiencia (XP), insignias desbloqueadas, lugares favoritos, lugares visitados, rutas completadas y reseñas publicadas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los lugares cargados en la base de datos semilla cuentan con dirección real, coordenadas geográficas dentro de la comuna de Andacollo, fotografía real que carga correctamente y descripción completa estructurada en bloques legibles.
- **SC-002**: El 100% de las ubicaciones registradas se visualizan correctamente en Google Maps tanto en el mapa general (con filtrado por categoría) como en el mapa individual de cada ficha de detalle.
- **SC-003**: Al escribir 2 o más caracteres en el buscador general, el autocompletado muestra sugerencias relevantes en menos de 300 milisegundos sobre los datos cargados y permite abrir la ficha deseada en 1 clic o pulsación de Enter.
- **SC-004**: Cualquier usuario autenticado puede publicar una reseña con calificación y comentario en menos de 30 segundos, viéndola reflejada de inmediato en la ficha del lugar junto con las reseñas semilla preexistentes.
- **SC-005**: Un revisor puede iniciar sesión con los 5 usuarios semilla documentados en el `README.md` (1 administrador y 4 viajeros) tras inicializar la base de datos, verificando que cada uno posee datos distribuidos y funcionales de favoritos, logros y comentarios.

## Assumptions

- Los lugares reales de Andacollo se investigarán mediante búsqueda en internet para obtener datos verídicos (ubicaciones, horarios referenciales, historia, atractivos) y URLs de fotografías reales de fuentes públicas confiables (como Wikimedia Commons u otras fuentes abiertas/estables).
- Para Google Maps se soportará la configuración estándar mediante clave de API (documentada en `.env.example` y `README.md`), contemplando un modo embebido/respaldo funcional cuando no exista clave configurada para que la experiencia de mapa nunca quede bloqueada en desarrollo local.
- Los usuarios semilla tendrán contraseñas de prueba estándar y claramente documentadas en el `README.md` exclusivamente para fines de desarrollo, demostración y revisión.
