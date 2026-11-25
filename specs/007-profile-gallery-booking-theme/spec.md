# Feature Specification: Perfil de Usuario, Galería Interactiva, Submenú de Reservas y Unificación Visual Clara

**Feature Branch**: `007-profile-gallery-booking-theme`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "- Perfil de usuario para el usuario autentificado, debe tener su vista propia de visualizacion de datos asi como se puede ver perfil de otros usuarios
- Fotos de galeria de perfil usuario, debe poderse visualizar las fotos asi como se ven en el menu astrofotos
- Ajustar menu de servicios - reserva para que sea un submenu dentro de la vista de detalle de lugares y no directo en el detalle
- Cambia los colores del diseño para las vistas de astronomia, astrofotos, guias y reserva, deben usar los colores y formatos de diseño que tienen las demas vistas con fondos y colores claros. Guiate por las demas vistas para tener un diseño con paleta de colores de mi app actual."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unificación Visual con Paleta Clara en Astronomía, Astrofotos, Guías y Reservas (Priority: P1)

Un visitante o usuario registrado navega por las secciones de Astronomía, Astrofotos, Guías y el módulo de Servicios y Reserva, y percibe una identidad visual completamente coherente con el resto de la aplicación turística de Andacollo: fondos claros suaves, tarjetas blancas con bordes sutiles y sombras limpias, tipografía principal oscura de alto contraste, encabezados en azul marino institucional y acentos dorados y naranjas que mantienen la legibilidad en escritorio y móvil.

**Why this priority**: La coherencia visual entre todas las secciones públicas impacta de inmediato la percepción de calidad, accesibilidad y confianza del visitante; actualmente estas cuatro áreas rompen el estilo del resto del portal al usar fondos oscuros.

**Independent Test**: Se puede verificar de forma independiente recorriendo las vistas de Astronomía, Astrofotos, Guías y el módulo de Servicios y Reserva (tanto en escritorio como en móvil) y comprobando que todas utilizan fondos claros, tarjetas claras, contraste legible y la paleta oficial del portal sin elementos oscuros heredados ni texto ilegible.

**Acceptance Scenarios**:

1. **Given** un visitante accede a la sección de Astronomía, **When** visualiza el encabezado, las condiciones de observación, los eventos celestes y los sitios recomendados, **Then** la página presenta fondo claro, tarjetas claras con alto contraste y la misma jerarquía tipográfica y paleta oficial que las demás vistas del portal.
2. **Given** un visitante accede a Astrofotos (galería comunitaria), **When** explora el filtro por categorías, las tarjetas de capturas, el visor ampliado de foto y el formulario de subida, **Then** toda la interfaz usa fondos claros, etiquetas legibles y controles coherentes con el estilo general de la aplicación.
3. **Given** un visitante accede a la sección de Guías, **When** revisa el catálogo de guías, filtros, perfiles resumidos y formulario de contacto o solicitud, **Then** los paneles, tarjetas, insignias y botones utilizan la paleta clara oficial y el mismo formato de tarjetas y espaciado que las vistas de exploración.
4. **Given** un visitante abre el módulo de Servicios y Reserva en una ficha de detalle, **When** revisa las opciones, horarios, formulario de reserva y pases activos, **Then** el módulo mantiene fondos claros, tarjetas limpias, campos legibles y acentos dorados/marinos consistentes con la vista de detalle.

---

### User Story 2 - Submenú de Servicios y Reserva dentro de la Vista de Detalle (Priority: P1)

Un visitante abre la vista de detalle de un lugar turístico (u otro establecimiento con servicios reservables) para leer su descripción, dirección, horarios, mapa y reseñas sin sentirse abrumado por un extenso formulario de reserva incrustado directamente en medio de la ficha. Cuando desea consultar los servicios disponibles o realizar una reserva, selecciona la pestaña o submenú "Servicios y Reserva" dentro de la misma vista de detalle y accede de forma ordenada al flujo completo de reserva y a sus pases activos.

**Why this priority**: Reorganizar la reserva como submenú interno limpia la lectura principal de las fichas de lugares, mejora drásticamente la experiencia en pantallas móviles y reduce el desplazamiento innecesario sin perder el acceso directo a las reservas.

**Independent Test**: Se puede probar abriendo la ficha de detalle de un lugar con servicios reservables: al cargar se muestra la vista general del lugar sin el formulario de reserva desplegado directamente; al pulsar el submenú "Servicios y Reserva", se muestra el módulo completo de servicios/reservas, y al volver a la pestaña de detalle general se retorna a la información principal.

**Acceptance Scenarios**:

1. **Given** un visitante abre el detalle de un lugar que dispone de servicios reservables, **When** carga la vista inicial de detalle, **Then** ve la información principal del lugar (descripción, datos prácticos, reseñas, mapa y relacionados) y un submenú interno que incluye las opciones de detalle general y "Servicios y Reserva", sin mostrar el formulario de reserva incrustado directamente en la vista general.
2. **Given** el visitante está en el detalle de un lugar con servicios reservables, **When** selecciona la opción "Servicios y Reserva" del submenú interno, **Then** se despliega el módulo completo de servicios y reserva (paquetes/modalidades, horarios o fechas, cálculo de tarifa, formulario de confirmación y pases existentes del usuario) dentro de la misma ficha.
3. **Given** un visitante abre el detalle de un lugar que NO tiene servicios reservables configurados, **When** carga la vista de detalle, **Then** no se muestra la opción de "Servicios y Reserva" en el submenú (ni secciones vacías de reserva).
4. **Given** un visitante selecciona el submenú "Servicios y Reserva" en un dispositivo móvil, **When** alterna entre las secciones del submenú, **Then** la transición es fluida, los controles son táctiles y el contenido se adapta sin desbordamiento horizontal.

---

### User Story 3 - Vista Propia de Perfil del Usuario Autentificado y Consulta de Perfiles de Otros Usuarios (Priority: P2)

Un usuario autentificado accede a su perfil personal y cuenta con una vista propia clara y estructurada para visualizar sus datos (identidad, fotografía de avatar, nombre de usuario, biografía, ciudad de origen, nivel de experiencia, estadísticas de exploración, equipamiento, insignias, galería de capturas, favoritos y reservas), con acceso separado y ordenado a la edición de sus datos personales y preferencias. Asimismo, tanto el usuario autentificado como otros visitantes pueden consultar el perfil público de otros usuarios con una estructura visual equivalente que muestra su información pública, estadísticas, equipamiento, insignias y galería de fotos, permitiendo acciones sociales (como seguir al usuario) sin exponer información privada de la cuenta.

**Why this priority**: Diferenciar y armonizar la vista propia del usuario autentificado frente a la vista de perfil de terceros permite que el usuario gestione y visualice su identidad en la comunidad de forma intuitiva, manteniendo privacidad sobre sus datos personales y reservas.

**Independent Test**: Se puede probar iniciando sesión y abriendo el perfil propio (verificando la visualización clara de datos propios y la capacidad de editarlos y ver información privada como reservas/preferencias), y luego accediendo al perfil de otro usuario (desde la galería o enlace de autor) verificando que se muestran sus datos públicos y acciones sociales sin exponer controles de edición ni datos privados.

**Acceptance Scenarios**:

1. **Given** un usuario autentificado ingresa a su perfil personal, **When** carga la vista, **Then** visualiza su propia ficha de perfil completa (avatar, nombre, identificador, biografía, origen, nivel/progreso, estadísticas de actividad y capturas, equipamiento, insignias, galería de fotos, reservas y favoritos) con diseño claro consistente con la aplicación.
2. **Given** el usuario autentificado está en su vista propia de perfil, **When** decide modificar sus datos personales o preferencias de cuenta, **Then** puede abrir la sección de edición de datos, actualizar su información y recibir confirmación visual inmediata en pantalla sin diálogos nativos del navegador.
3. **Given** un usuario (autentificado o visitante) abre el perfil de otro usuario desde una foto o enlace comunitario, **When** carga la vista del perfil ajeno, **Then** visualiza los datos públicos del otro usuario con la misma estructura y paleta visual clara (identidad pública, biografía, estadísticas, equipamiento, insignias y galería de capturas) y la acción de seguir/dejar de seguir, sin mostrar opciones de edición de cuenta ni reservas privadas.
4. **Given** un usuario autentificado abre su propio perfil público a través de un enlace comunitario, **When** visualiza dicha ficha, **Then** el sistema reconoce que es su propio perfil y le ofrece acceso directo a gestionar su perfil personal en lugar de mostrarse la acción de seguirse a sí mismo.

---

### User Story 4 - Visualización Interactiva de Fotos en la Galería del Perfil de Usuario (Priority: P2)

Un usuario está viendo su propia galería de fotos en su perfil o la galería de capturas en el perfil de otro usuario. Al seleccionar cualquier fotografía de la galería, en lugar de salir de la vista hacia otra sección, se abre un visor interactivo detallado idéntico al del menú de Astrofotos, mostrando la imagen ampliada, el lugar de captura, el título, la descripción, los parámetros técnicos fotográficos (equipo, ISO, exposición y apertura), los datos del autor y el botón interactivo de "Me gusta".

**Why this priority**: Permite inspeccionar las fotografías en detalle directamente desde cualquier perfil sin perder el contexto de navegación, unificando la experiencia de visualización de imágenes en toda la aplicación.

**Independent Test**: Se puede verificar entrando tanto al perfil propio como al perfil de otro usuario con fotos publicadas, haciendo clic en una miniatura de la galería y comprobando que se abre el visor detallado con imagen ampliada, metadatos técnicos, interacción de "Me gusta" y cierre limpio regresando exactamente al perfil.

**Acceptance Scenarios**:

1. **Given** un usuario autentificado visualiza la galería de fotos en su propio perfil, **When** selecciona una fotografía, **Then** se abre el visor detallado en ventana modal mostrando la imagen ampliada, ubicación de captura, título, descripción, parámetros técnicos (equipo, ISO, exposición, apertura) y contador interactivo de "Me gusta", sin abandonar la vista de perfil.
2. **Given** un visitante o usuario autentificado visualiza la galería de fotos en el perfil de otro usuario, **When** selecciona una fotografía, **Then** se abre el mismo visor detallado con toda la información de la captura y la opción de marcar o desmarcar "Me gusta".
3. **Given** el visor detallado de fotografía está abierto en un perfil, **When** el usuario pulsa el botón de cerrar, hace clic fuera del panel o presiona la tecla Escape, **Then** el visor se cierra suavemente y el usuario permanece en la misma posición de la vista de perfil.
4. **Given** el usuario marca o desmarca "Me gusta" dentro del visor detallado de una foto en el perfil, **When** la acción se completa, **Then** el contador de "Me gusta" se actualiza de inmediato tanto en el visor como en la tarjeta de la galería y en las métricas visibles del perfil.

---

### Edge Cases

- **Perfil sin fotografías**: Cuando un usuario (propio o ajeno) no tiene fotos en su galería, se muestra un estado vacío claro y amigable en español; en el perfil propio incluye acceso directo para subir la primera captura.
- **Foto sin datos técnicos completos**: Cuando una fotografía no tiene todos sus parámetros técnicos registrados (por ejemplo, falta ISO o apertura), el visor muestra valores de respaldo claros (como "No especificado") sin romper el diseño.
- **Usuario no autentificado interactuando con "Me gusta" o "Seguir"**: Cuando un visitante sin sesión intenta dar "Me gusta" desde el visor del perfil o seguir a otro usuario, el sistema muestra un aviso visual integrado en la interfaz invitándole a iniciar sesión, sin usar alertas nativas del navegador.
- **Perfil inexistente o enlace roto**: Si se intenta acceder al perfil de un usuario que no existe, se muestra una vista clara de estado no encontrado con botón para regresar a la exploración o galería.
- **Cambio rápido entre submenús en detalle de lugar**: Si un usuario alterna entre el detalle general y "Servicios y Reserva" mientras ya había seleccionado opciones en el formulario, la navegación mantiene un comportamiento predecible y sin errores visuales.
- **Falta de configuración de reserva en un lugar**: Si un lugar no posee servicios o reservas habilitadas, el submenú de reserva no aparece y la vista de detalle opera únicamente con su contenido informativo estándar.
- **Pantallas pequeñas (móvil)**: El submenú de detalle de lugar, las tarjetas con paleta clara, los perfiles y el visor modal de fotos deben adaptarse a pantallas de 360px de ancho sin scroll horizontal ni textos cortados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST ofrecer al usuario autentificado una vista propia dedicada para visualizar todos sus datos de perfil (avatar, nombre completo, identificador, biografía, ciudad de origen, nivel y progreso, estadísticas de actividad, equipamiento, insignias, galería de fotos, favoritos y reservas activas), separando visualmente la visualización de datos del modo de edición de cuenta.
- **FR-002**: El sistema MUST permitir visualizar el perfil público de otros usuarios con una estructura visual y formato equivalentes al perfil propio, mostrando únicamente datos públicos (identidad, biografía, estadísticas públicas, equipamiento, insignias y galería de fotos) y acciones sociales (seguir/dejar de seguir), ocultando siempre datos privados (reservas personales, configuración de cuenta, preferencias offline y controles de edición).
- **FR-003**: El sistema MUST permitir que al hacer clic o tocar cualquier fotografía dentro de la galería del perfil (tanto en el perfil del usuario autentificado como en el perfil de otros usuarios) se abra un visor modal detallado con las mismas capacidades y presentación que el visor del menú Astrofotos: imagen ampliada, ubicación/spot, título, descripción, parámetros técnicos (equipo, ISO, exposición, apertura), información del autor y botón interactivo de "Me gusta".
- **FR-004**: El sistema MUST permitir cerrar el visor modal de fotografía mediante botón de cierre visible, clic fuera del contenido modal o tecla Escape, manteniendo al usuario en la misma vista de perfil sin recargar ni redirigir a otra página.
- **FR-005**: El sistema MUST sincronizar el estado y contador de "Me gusta" cuando el usuario interactúa desde el visor de fotografía del perfil, reflejando el cambio en la tarjeta de la galería y en el resumen de métricas del perfil.
- **FR-006**: El sistema MUST organizar el módulo de Servicios y Reserva como una sección accesible mediante un submenú interno dentro de la vista de detalle de lugares (y demás fichas de detalle que cuenten con reservas habilitadas), en lugar de renderizarlo directamente desplegado dentro del flujo principal de información del detalle.
- **FR-007**: El sistema MUST mostrar la vista principal de detalle (descripción, información práctica, reseñas, mapa y relacionados) de forma predeterminada al abrir un lugar, y mostrar la pestaña/submenú de "Servicios y Reserva" únicamente cuando el lugar tenga servicios o reservas disponibles.
- **FR-008**: El sistema MUST aplicar la paleta de colores clara y el formato visual estándar del resto de la aplicación (fondos claros suaves `#F5F7FA`, superficies y tarjetas blancas `#FFFFFF`, tipografía y encabezados en azul marino `#071B3A` / `#031126`, acentos en dorado `#FFB800` y naranja `#FF9D00`) a las vistas de Astronomía, Astrofotos, Guías y el módulo de Servicios y Reserva.
- **FR-009**: El sistema MUST aplicar la misma línea visual clara y coherente a las vistas de perfil de usuario (propio y de otros usuarios) y al visor de fotografías para que no existan rupturas visuales entre secciones al navegar por la aplicación.
- **FR-010**: Todos los textos visibles, etiquetas, pestañas del submenú, estados vacíos y mensajes de retroalimentación MUST presentarse íntegramente en español y con feedback visual integrado en la interfaz (sin diálogos nativos del navegador).
- **FR-011**: Todas las vistas actualizadas (perfiles, visor de galería, submenú de detalle/reserva, Astronomía, Astrofotos y Guías) MUST ser completamente responsivas para dispositivos móviles, tablets y escritorio.

### Key Entities *(include if feature involves data)*

- **Perfil de Usuario**: Representa la identidad del viajero o miembro de la comunidad. Incluye datos públicos (nombre visible, identificador/handle, avatar, biografía, rol/certificación, ciudad de origen, equipamiento fotográfico, insignias, estadísticas de actividad y capturas) y datos privados visibles solo para el titular autentificado (reservas, preferencias de cuenta y configuración).
- **Fotografía de Galería (Astrofoto / Captura)**: Representa una imagen publicada por un usuario. Incluye imagen, título, descripción, ubicación/spot, fecha, parámetros técnicos (equipo/cámara, ISO, exposición, apertura), autor y contador/estado de "Me gusta".
- **Módulo de Servicios y Reserva de un Lugar**: Representa la oferta reservable asociada a una ficha de detalle (lugar turístico, restaurante, alojamiento, evento o experiencia), incluyendo modalidades/servicios, horarios o disponibilidad, precios referenciales, formulario de reserva y pases activos del usuario.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las vistas objetivo (Astronomía, Astrofotos, Guías, módulo de Servicios y Reserva, y perfiles de usuario) utilizan fondos claros y la paleta cromática oficial del portal sin contraste deficiente ni secciones oscuras residuales en escritorio y móvil.
- **SC-002**: El 100% de las fichas de detalle con servicios reservables presentan la información principal libre del formulario de reserva incrustado en carga inicial y permiten acceder al módulo de reserva en 1 solo clic mediante el submenú interno.
- **SC-003**: Un usuario puede abrir cualquier fotografía desde su propio perfil o desde el perfil de otro usuario y visualizar todos sus detalles ampliados y parámetros técnicos en menos de 1 segundo sin abandonar la vista de perfil.
- **SC-004**: El usuario autentificado puede distinguir claramente su vista de visualización de datos personales de la vista de perfil público de terceros, con 0 exposiciones de datos privados (reservas o configuración de cuenta) en perfiles ajenos.
- **SC-005**: Todas las vistas modificadas superan la navegación completa en anchos móviles (desde 360px) y escritorio sin desbordamiento horizontal ni textos en idiomas distintos al español.

## Assumptions

- **Alcance del submenú de Servicios y Reserva**: Aunque el usuario mencionó "vista de detalle de lugares", el sistema actual reutiliza el mismo diseño de detalle y módulo de reserva en lugares turísticos, restaurantes, alojamientos, eventos y experiencias; se aplicará el patrón de submenú de forma uniforme en la plantilla de detalle para mantener consistencia en toda la aplicación.
- **Coherencia visual en perfiles**: Además de las cuatro vistas nombradas explícitamente (Astronomía, Astrofotos, Guías y Reserva), las vistas de perfil de usuario (propio y de otros usuarios) también adoptarán la paleta clara y el formato de tarjetas del resto de la aplicación para garantizar una transición visual uniforme al navegar desde Astrofotos o desde el menú principal.
- **Autenticación y datos existentes**: Se reutilizan las cuentas, sesiones, perfiles, capturas fotográficas, equipamiento, insignias y reservas existentes en la aplicación sin requerir migraciones disruptivas de datos de usuario.
- **Interacción de seguimiento y "Me gusta"**: Las acciones de seguir a otro usuario y dar "Me gusta" a fotografías requieren sesión iniciada; los visitantes sin sesión pueden consultar perfiles públicos y abrir el visor ampliado de fotografías en modo lectura.
- **Acceso a edición de perfil**: La edición de datos personales del usuario autentificado permanece accesible desde su propia vista de perfil (por ejemplo, mediante un botón o sección desplegable/modal de edición) para mantener la vista principal limpia y centrada en la visualización de datos.
