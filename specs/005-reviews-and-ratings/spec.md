# Feature Specification: Comentarios y Valoraciones para Lugares, Restaurantes y Alojamientos

**Feature Branch**: `005-reviews-and-ratings`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Agrega la opcion de comentar y valorar en los lugares, restauratantes, alojamientos. Ademas agrega comentarios y valoracion de ejemplos de otros usuarios. Debe estar todo en bd y poderse visualizar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar Comentarios y Valoraciones Reales en Fichas de Detalle (Priority: P1)

El visitante (autenticado o anónimo) que ingresa a la ficha de detalle de cualquier lugar turístico, restaurante o alojamiento de Andacollo visualiza el resumen de valoraciones (calificación promedio de 1 a 5 estrellas y cantidad total de reseñas) junto con el listado de comentarios publicados por otros usuarios, incluyendo nombre del autor, puntaje en estrellas, texto del comentario y fecha de publicación. Desde el primer uso del sistema, los lugares, restaurantes y alojamientos ya cuentan con comentarios y valoraciones de ejemplo de otros usuarios almacenados de forma persistente para ofrecer contexto real al viajero.

**Why this priority**: Permite entregar valor inmediato a cualquier turista que explore Andacollo, fortaleciendo la confianza en los atractivos, la gastronomía y los hospedajes mediante opiniones visibles y auténticas desde el primer momento.

**Independent Test**: Se puede probar abriendo la vista de detalle de distintos lugares turísticos, restaurantes y alojamientos sin iniciar sesión, comprobando que cada uno muestra su calificación promedio, el total de reseñas y los comentarios de ejemplo persistidos con autor, estrellas, texto y fecha, ordenados del más reciente al más antiguo.

**Acceptance Scenarios**:

1. **Given** un visitante que abre la ficha de detalle de un lugar turístico, restaurante o alojamiento con reseñas registradas, **When** recorre la sección de comentarios y valoraciones, **Then** visualiza la calificación promedio (de 1 a 5 estrellas), el conteo total de reseñas y la lista de comentarios ordenados del más reciente al más antiguo, mostrando nombre del autor, puntaje en estrellas, texto y fecha.
2. **Given** el sistema inicializado con sus datos base, **When** se consultan los lugares turísticos, restaurantes y alojamientos del catálogo, **Then** existen comentarios y valoraciones de ejemplo de distintos usuarios almacenados de forma persistente y visibles en la interfaz, con calificaciones promedio y conteos coherentes con dichas reseñas.
3. **Given** un lugar turístico, restaurante o alojamiento que aún no tiene reseñas registradas, **When** un visitante abre su ficha de detalle, **Then** se muestra un estado vacío claro en español invitando a compartir la primera experiencia, sin errores visuales ni valores inconsistentes.

---

### User Story 2 - Publicar un Comentario y Valoración como Usuario Autenticado (Priority: P1)

El usuario con sesión iniciada que visita la ficha de detalle de un lugar turístico, restaurante o alojamiento puede seleccionar una puntuación de 1 a 5 estrellas, redactar su comentario y publicarlo. Al enviarlo, la reseña queda guardada de forma persistente, aparece de inmediato en el listado visible y actualiza automáticamente la calificación promedio y la cantidad total de reseñas del establecimiento o sitio, tanto en su ficha de detalle como en las tarjetas de los listados públicos.

**Why this priority**: Es la funcionalidad interactiva central solicitada por el usuario: permite que los viajeros participen activamente, compartan su experiencia real y enriquezcan la información turística de Andacollo.

**Independent Test**: Se puede probar iniciando sesión con una cuenta de usuario, accediendo a un lugar turístico, a un restaurante y a un alojamiento, seleccionando una puntuación en estrellas, escribiendo un comentario y enviándolo; luego recargando la página y navegando al listado correspondiente para confirmar que la reseña persiste y que el promedio y total de reseñas se actualizaron.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en la ficha de detalle de un lugar turístico, restaurante o alojamiento donde aún no ha opinado, **When** selecciona una valoración entre 1 y 5 estrellas, escribe un comentario válido y presiona publicar, **Then** la reseña se guarda de forma persistente, se muestra confirmación visual en pantalla (sin diálogos nativos del navegador), el nuevo comentario aparece al inicio del listado y se actualizan el promedio y el total de reseñas.
2. **Given** un usuario autenticado que intenta publicar una reseña sin haber elegido una calificación en estrellas o con el comentario vacío, **When** presiona el botón de publicar, **Then** el sistema impide el envío y muestra un mensaje de validación claro y visible en español indicando el dato faltante.
3. **Given** un visitante no autenticado en la ficha de detalle de un lugar, restaurante o alojamiento, **When** visualiza la sección de comentarios y valoraciones, **Then** puede leer todas las reseñas existentes y ve una invitación clara con acceso directo para iniciar sesión o registrarse si desea dejar su propia valoración y comentario.

---

### User Story 3 - Editar o Eliminar la Propia Reseña y Evitar Duplicados (Priority: P2)

El usuario autenticado que ya publicó una valoración y comentario en un lugar turístico, restaurante o alojamiento puede modificar su puntuación o texto posteriormente, o bien eliminar su reseña si lo desea mediante una confirmación visual integrada en la interfaz. El sistema evita reseñas duplicadas del mismo usuario sobre un mismo elemento, manteniendo siempre consistentes el promedio y el conteo de valoraciones.

**Why this priority**: Protege la integridad de las calificaciones (evitando votos repetidos de un mismo usuario) y entrega al viajero control real sobre el contenido que publica.

**Independent Test**: Se puede probar con un usuario autenticado que ya publicó una reseña: verificar que en lugar de permitir una segunda reseña duplicada se ofrece editar o eliminar la suya; al editar la puntuación o el texto, confirmar que el cambio persiste y recalcula el promedio; al eliminarla confirmando en el modal visual, comprobar que desaparece del listado y se recalcula el promedio y el total.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado que ya tiene una reseña publicada en un lugar, restaurante o alojamiento, **When** vuelve a abrir esa misma ficha de detalle, **Then** visualiza su reseña identificada como propia con opciones para editarla o eliminarla, en lugar de crear una reseña duplicada.
2. **Given** un usuario autenticado editando su propia reseña, **When** cambia la puntuación de estrellas o el texto del comentario y guarda los cambios, **Then** la reseña actualizada persiste, se refleja de inmediato en el listado y el promedio del lugar, restaurante o alojamiento se recalcula automáticamente.
3. **Given** un usuario autenticado que decide eliminar su propia reseña, **When** presiona eliminar y confirma la acción en una ventana modal visual acorde al diseño de la aplicación, **Then** la reseña se elimina de forma persistente, desaparece del listado y se actualizan el promedio y el conteo de reseñas.

---

### User Story 4 - Consistencia de Calificaciones en Catálogos y Experiencia Responsiva (Priority: P3)

El viajero que navega desde celular, tablet o escritorio por las vistas de listado (Lugares, Restaurantes, Alojamientos, Inicio o Explorador) y luego entra a una ficha de detalle observa que las calificaciones promedio y cantidades de reseñas coinciden entre las tarjetas y la vista de detalle, y que toda la sección de reseñas (resumen, selector interactivo de estrellas, formulario y lista de comentarios) es cómoda, legible y adaptable a cualquier tamaño de pantalla.

**Why this priority**: Garantiza coherencia informativa en todo el portal turístico y una experiencia fluida tanto para turistas en movimiento desde dispositivos móviles como para usuarios en escritorio.

**Independent Test**: Se puede probar publicando o modificando una reseña en un elemento y navegando de regreso al catálogo correspondiente en vistas móvil (360px–430px) y escritorio, verificando que el promedio y total de reseñas coinciden exactamente y que ningún control se corta ni desborda horizontalmente.

**Acceptance Scenarios**:

1. **Given** un usuario que publica, edita o elimina una reseña en un lugar, restaurante o alojamiento, **When** regresa al listado público de esa categoría, **Then** la tarjeta del elemento muestra la calificación promedio y la cantidad de reseñas actualizadas en coherencia con la ficha de detalle.
2. **Given** un usuario que accede desde un teléfono móvil a la ficha de detalle de un lugar, restaurante o alojamiento, **When** interactúa con el selector de estrellas, escribe un comentario y lee las reseñas existentes, **Then** todos los controles son táctiles, legibles y se ajustan al ancho de pantalla sin desbordamiento horizontal ni superposiciones.

---

### Edge Cases

- **Envío de comentario solo con espacios en blanco o demasiado corto**: El sistema recorta espacios innecesarios y rechaza comentarios vacíos o con menos de 5 caracteres útiles, mostrando un mensaje claro en pantalla.
- **Comentario excesivamente largo**: El sistema limita la longitud máxima del comentario (hasta 600 caracteres) e informa al usuario mediante un contador visible para evitar textos desbordados.
- **Intento de valorar fuera de rango**: Solo se aceptan puntuaciones enteras del 1 al 5; cualquier intento inválido es rechazado sin corromper el promedio.
- **Fallo de conexión al guardar o cargar reseñas**: Si ocurre un error de comunicación, el sistema muestra una notificación visual en español dentro de la interfaz, mantiene el texto que el usuario había redactado para que no pierda su trabajo y le permite reintentar.
- **Eliminación de la última reseña de un elemento**: Cuando se elimina la única reseña existente de un lugar, restaurante o alojamiento, el conteo regresa a 0 y el promedio se restablece limpiamente sin mostrar valores indefinidos ni errores matemáticos.
- **Recarga o reinicialización de datos de ejemplo**: Los comentarios y valoraciones de ejemplo de otros usuarios pueden cargarse de manera repetible sin generar comentarios duplicados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir visualizar una sección dedicada de comentarios y valoraciones en la ficha de detalle de cada lugar turístico, restaurante y alojamiento.
- **FR-002**: Cada reseña mostrada MUST incluir el nombre del autor (y su avatar o iniciales representativas), la valoración otorgada en escala de 1 a 5 estrellas, el texto del comentario y la fecha de publicación en formato legible en español.
- **FR-003**: El sistema MUST almacenar todas las reseñas (comentarios y valoraciones) de forma persistente, asociando cada una inequívocamente al tipo de elemento (lugar turístico, restaurante o alojamiento), al elemento específico y al usuario autor.
- **FR-004**: El sistema MUST precargar en su almacenamiento persistente comentarios y valoraciones de ejemplo realistas de otros usuarios distribuidos en lugares turísticos, restaurantes y alojamientos de Andacollo, de modo que sean visibles de inmediato al explorar la aplicación.
- **FR-005**: El sistema MUST permitir a los usuarios autenticados crear una nueva reseña seleccionando una puntuación entera entre 1 y 5 estrellas y escribiendo un comentario de entre 5 y 600 caracteres.
- **FR-006**: El sistema MUST impedir que visitantes no autenticados publiquen, editen o eliminen reseñas, mostrándoles en su lugar un aviso claro en español con acceso directo al inicio de sesión o registro.
- **FR-007**: El sistema MUST limitar a una sola reseña activa por usuario autenticado para cada lugar turístico, restaurante o alojamiento; si el usuario ya opinó sobre ese elemento, MUST permitirle editar su valoración/comentario existente o eliminarlo.
- **FR-008**: El sistema MUST permitir a cada usuario autenticado editar y eliminar únicamente sus propias reseñas, solicitando confirmación previa mediante una ventana modal visual coherente con el diseño de la aplicación antes de eliminar (sin usar diálogos nativos del navegador).
- **FR-009**: El sistema MUST recalcular y mantener sincronizados automáticamente la calificación promedio (redondeada a un decimal) y el número total de reseñas de cada lugar turístico, restaurante y alojamiento cada vez que se crea, actualiza o elimina una reseña.
- **FR-010**: La calificación promedio y el conteo de reseñas mostrados en las fichas de detalle y en las tarjetas de listados públicos MUST reflejar consistentemente las reseñas almacenadas.
- **FR-011**: El sistema MUST ordenar las reseñas visibles desde la más reciente hasta la más antigua y mostrar feedback visual en pantalla ante validaciones, confirmaciones de guardado/edición/eliminación y errores.
- **FR-012**: Toda la interfaz de comentarios y valoraciones MUST presentarse íntegramente en español, respetar la identidad visual del proyecto y ser completamente responsiva en dispositivos móviles, tablets y escritorio.

### Key Entities *(include if feature involves data)*

- **Reseña (Comentario y Valoración)**: Representa la opinión y calificación de un usuario sobre un elemento turístico específico. Atributos clave: identificador único, tipo de destino evaluado (`lugar`, `restaurante` o `alojamiento`), referencia al destino evaluado, referencia al autor (usuario registrado o perfil de comunidad), calificación entera (1 a 5), texto del comentario, fecha de creación y fecha de última modificación.
- **Elemento Evaluable (Lugar Turístico, Restaurante, Alojamiento)**: Entidades existentes del catálogo turístico que exponen un resumen agregado de valoraciones (calificación promedio y total de reseñas) derivado de sus reseñas persistidas.
- **Autor de Reseña (Perfil de Usuario)**: Identidad visible asociada a cada reseña (nombre visible y avatar opcional), correspondiente tanto a usuarios registrados que inician sesión como a perfiles comunitarios precargados para los comentarios de ejemplo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los lugares turísticos, restaurantes y alojamientos del catálogo base muestran al menos 2 comentarios y valoraciones de ejemplo realistas de otros usuarios al abrir su ficha de detalle, con promedio y conteo coherentes.
- **SC-002**: Un usuario autenticado puede seleccionar una puntuación, redactar y publicar una reseña completa en menos de 45 segundos y verla reflejada inmediatamente en la ficha de detalle.
- **SC-003**: El 100% de las operaciones de creación, edición y eliminación de reseñas persisten tras recargar la página y actualizan el promedio y el conteo total de reseñas sin discrepancias entre la ficha de detalle y las tarjetas de listado.
- **SC-004**: El 100% de las validaciones, confirmaciones y errores de la funcionalidad de reseñas se comunican mediante elementos visuales integrados en la interfaz en español, con cero diálogos nativos del navegador.
- **SC-005**: La sección completa de comentarios y valoraciones es utilizable y legible en pantallas móviles (desde 360px de ancho) y escritorio sin desbordamiento horizontal ni elementos superpuestos.

## Assumptions

- **Alcance de entidades**: La funcionalidad aplica específicamente a **lugares turísticos**, **restaurantes** y **alojamientos**, según lo solicitado explícitamente. Eventos y experiencias quedan fuera del alcance de esta iteración.
- **Escala de valoración**: Se utiliza la escala estándar de 1 a 5 estrellas enteras, consistente con la experiencia inspirada en TripAdvisor definida en la constitución del proyecto.
- **Política de unicidad**: Cada usuario autenticado puede mantener una reseña activa por cada lugar, restaurante o alojamiento, con posibilidad de editarla o eliminarla en cualquier momento para mantener la calidad del promedio.
- **Permisos de lectura y escritura**: Cualquier visitante puede leer los comentarios y valoraciones públicamente; solo usuarios autenticados pueden crear, editar o eliminar sus propias reseñas, reutilizando el sistema de autenticación y perfiles ya existente en la aplicación.
- **Perfiles de ejemplo**: Los comentarios y valoraciones de ejemplo de otros usuarios se asociarán a los perfiles comunitarios existentes (o equivalentes precargados en los datos semilla) con nombres, opiniones y contextos auténticos de Andacollo.
- **Moderación administrativa**: La moderación avanzada de reseñas desde el panel de administración no fue solicitada explícitamente y queda fuera del alcance inicial, pudiendo agregarse en una iteración posterior si se requiere.
