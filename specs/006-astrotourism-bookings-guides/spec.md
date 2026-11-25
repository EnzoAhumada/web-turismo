# Feature Specification: Astroturismo Comunitario, Reservas de Lugares, Guías Certificados y Perfil Mejorado

**Feature Branch**: `006-astrotourism-bookings-guides`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Implementa las 3 opciones del mockup funcional de esta web (Galería Astrofotos, Obs. Collowara, Guías Certificados) y las mejoras de Mi Perfil - Subir foto, adaptadas al estilo de mi app, funcionales con datos y estructura persistente reutilizando la información y ejemplos del mockup. Módulo de reserva inicialmente activo para el Observatorio Collowara, extensible a otros lugares de la app y gestionable desde un apartado en el panel de administración (datos, información, servicios, precios y activar/desactivar en diferentes lugares)."

## Clarifications

### Session 2026-11-24

- Q: ¿Qué tipos de elementos de la plataforma deben poder activar y gestionar el módulo de reservas desde el panel de administración? → A: Todos los tipos del catálogo: Lugares turísticos, Restaurantes (comida), Alojamientos, Eventos y Experiencias/Servicios, gestionados desde un único panel de Reservas (inicialmente activo solo en Observatorio Turístico Collowara).
- Q: ¿Qué modalidades o tipos de formulario de reserva debe soportar el módulo para adaptarse a los distintos casos (visitas/tours, comida, alojamientos, servicios u otros)? → A: 4 perfiles adaptativos seleccionables por el admin: (1) Tour / Visita por horario y cupos (ej. Collowara), (2) Mesa / Comida (fecha, hora, comensales, comentarios/alergias), (3) Estadía / Alojamiento (fecha entrada y salida, noches, huéspedes, tipo habitación/cabaña) y (4) Servicio / Otros (fecha, opción de servicio, personas y notas).
- Q: ¿Cómo deben comportarse los precios y el estado de confirmación inicial cuando el administrador configura reservas en distintos tipos de negocios (ej. tours con tarifa fija vs. reservas de mesa sin costo o servicios a confirmar)? → A: Configurable por entidad en el admin: elegir si muestra tarifa calculada en CLP o "Sin costo / Consumo en local", y si las reservas nacen como Confirmada automáticamente (por defecto en Collowara) o Pendiente de aprobación en el panel admin.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Galería Comunitaria de Astrofotografía y Subida de Capturas (Priority: P1)

Como viajero o astrofotógrafo local, quiero acceder desde el menú de **Fotografía** a una **Galería de Astrofotos** de Andacollo donde pueda consultar las condiciones actuales del cielo, explorar capturas filtradas por sector de observación, revisar sus parámetros técnicos (EXIF), dar "Me gusta", visitar el perfil de cada autor y subir mis propias astrofotografías.

**Why this priority**: Reemplaza directamente la vista actual del menú "Fotografía" por una experiencia interactiva central del mockup que impulsa el pilar de astroturismo de Andacollo y alimenta los portafolios de usuario.

**Independent Test**: Se puede probar de forma independiente entrando al menú "Fotografía", filtrando por sector (ej. Cerro Yahuín, Observatorio Collowara), ordenando por "Más valoradas", abriendo el detalle EXIF de una foto, dando "Me gusta" y publicando una nueva captura con sesión iniciada para verificar que persiste al recargar.

**Acceptance Scenarios**:

1. **Given** un visitante accede a la opción de menú "Fotografía" (reemplazada por "Galería Astrofotos"), **When** la vista carga, **Then** visualiza el encabezado con telemetría astronómica de Andacollo (estado del cielo/escala Bortle, visibilidad, fase lunar y horario del núcleo galáctico), la barra de filtros por sector con contador de fotos por sector, el selector de ordenamiento ("Más recientes" / "Más valoradas") y la grilla de astrofotografías precargadas con los ejemplos del mockup.
2. **Given** el visitante selecciona un filtro de sector (por ejemplo, "Observatorio Collowara") o cambia el orden a "Más valoradas", **When** aplica la selección, **Then** la grilla muestra únicamente las capturas correspondientes ordenadas según el criterio elegido sin recargar la página.
3. **Given** el visitante hace clic sobre una tarjeta de astrofotografía, **When** se abre el modal de detalle, **Then** ve la imagen ampliada, sector, título, historia de la toma, parámetros técnicos EXIF completos (equipo/cámara, ISO, exposición, apertura), botón de "Me gusta" y enlace al portafolio completo del autor.
4. **Given** un usuario autenticado hace clic en "Me gusta" en una tarjeta o en el modal de detalle, **When** confirma la acción, **Then** el contador de "Me gusta" se actualiza de forma inmediata y el estado persiste en futuras visitas.
5. **Given** un usuario autenticado hace clic en "Subir Foto", **When** completa el formulario modal (archivo de imagen o escena de muestra con vista previa, título, sector de observación, descripción e información EXIF) y envía el formulario, **Then** la nueva captura se guarda de forma persistente, aparece al inicio de la galería comunitaria y en el portafolio de su perfil, y se muestra una notificación visual dentro de la interfaz.
6. **Given** un usuario no autenticado intenta subir una foto o dar "Me gusta", **When** realiza la acción, **Then** recibe un aviso visual estilizado invitándolo a iniciar sesión sin usar diálogos nativos del navegador.

---

### User Story 2 - Módulo de Reservas en Ficha de Lugar (Observatorio Collowara) (Priority: P1)

Como visitante de Andacollo, quiero entrar a la ficha del **Observatorio Turístico Collowara** (y en el futuro a cualquier otro lugar con reservas activas) para conocer sus instalaciones, elegir una modalidad de tour o servicio, seleccionar fecha y bloque horario con cupos disponibles en tiempo real, aplicar descuento de residente local si corresponde, confirmar mi reserva y gestionar mis pases emitidos.

**Why this priority**: Es la funcionalidad transaccional principal solicitada, diseñada de forma genérica para operar inicialmente en el Observatorio Collowara y poder habilitarse luego en otros lugares turísticos de la plataforma.

**Independent Test**: Se puede probar abriendo la ficha de Observatorio Collowara, verificando las instalaciones y galería, seleccionando una modalidad de tour, eligiendo fecha y bloque horario, activando el descuento de residente (-20%), confirmando la reserva, verificando que los cupos del horario disminuyen y que el pase aparece en "Mis Pases", copiando el código y luego cancelando la reserva para comprobar la liberación de cupos.

**Acceptance Scenarios**:

1. **Given** un usuario abre la ficha de detalle de un lugar con reservas habilitadas (inicialmente Observatorio Turístico Collowara), **When** la página carga, **Then** además de la información habitual del lugar, se muestra el módulo de reservas con la información de infraestructura/destacados, galería de instalaciones ampliable, modalidades de tour disponibles, selector de fecha, bloques horarios con cupos disponibles y el panel de "Mis Pases".
2. **Given** un usuario abre la ficha de un lugar que NO tiene reservas habilitadas, **When** la página carga, **Then** el módulo de reservas no se muestra y la ficha mantiene su comportamiento estándar.
3. **Given** el usuario está en el formulario de reserva, **When** cambia la modalidad (tarifa por persona adulto/niño-adulto mayor o tarifa fija grupal como Tour Privado VIP), la cantidad de asistentes o la casilla de "Residente Andacollo (-20%)", **Then** el total estimado en CLP se recalcula automáticamente en pantalla y muestra la insignia de descuento local cuando aplica.
4. **Given** un usuario autenticado completa los datos del titular (prellenados con su perfil cuando existen) y confirma la reserva en un bloque horario con cupos suficientes, **When** envía el formulario, **Then** el sistema descuenta los cupos reservados para esa fecha y bloque horario, genera un código de pase único (ej. `COL-2026-XXXX`), guarda la reserva de forma persistente, la muestra en "Mis Pases" y despliega una notificación visual de confirmación.
5. **Given** un usuario tiene una reserva confirmada en "Mis Pases", **When** hace clic en "Copiar Código", **Then** el código del pase se copia al portapapeles con confirmación visual; y **When** hace clic en "Cancelar Reserva" y confirma en un modal estilizado de la plataforma, **Then** la reserva cambia a estado "Cancelada" y los cupos vuelven a quedar disponibles en ese bloque horario.

---

### User Story 3 - Panel de Administración de Reservas, Servicios y Entidades Habilitadas (Priority: P1)

Como administrador de la plataforma turística, quiero contar con un apartado dedicado en el panel de administración privado para activar o desactivar el módulo de reservas en cualquier elemento del catálogo (lugares, restaurantes, alojamientos, eventos o experiencias), elegir su perfil de reserva adaptativo, configurar su modo de precio y confirmación, gestionar su información destacada, servicios/modalidades, precios, descuentos locales y horarios/cupos, así como visualizar y administrar las reservas realizadas por los viajeros.

**Why this priority**: El usuario especificó explícitamente que el módulo de reservas debe ser configurable desde el panel de administración para gestionar datos, información, servicios, precios y adaptarse a distintos tipos de lugares y negocios (visitas, comida, alojamientos, servicios u otros).

**Independent Test**: Se puede probar ingresando como administrador al nuevo apartado de Reservas en el panel privado, editando el precio de un tour de Collowara, activando el módulo de reservas en un restaurante con perfil "Mesa / Comida" (sin costo, pendiente de aprobación) o en un alojamiento con perfil "Estadía / Alojamiento", y verificando que cada ficha pública renderiza el formulario adaptado a su perfil.

**Acceptance Scenarios**:

1. **Given** un administrador accede al panel de administración privado, **When** navega al nuevo apartado de "Reservas", **Then** visualiza el listado filtrable de entidades del catálogo (Lugares, Restaurantes, Alojamientos, Eventos y Experiencias) con su estado de activación y perfil de reserva (Observatorio Collowara activo por defecto como Tour/Visita por horario y cupos).
2. **Given** el administrador selecciona una entidad del catálogo, **When** activa el módulo de reservas, elige su perfil (`tour_horario`, `mesa_comida`, `estadia_noches` o `servicio_general`), define el modo de precio (`calculado` o `sin_costo`) y el modo de confirmación (`inmediata` o `pendiente`) y guarda, **Then** la ficha pública de esa entidad muestra inmediatamente el formulario adaptado a dicha configuración.
3. **Given** el administrador gestiona la configuración de una entidad habilitada, **When** edita su información complementaria (destacados de infraestructura, nota de traslado/operación, porcentaje de descuento local, galería de instalaciones) o crea/edita/elimina servicios/modalidades (nombre, descripción, precio base/adulto, precio niño/adulto mayor, unidad de cobro por persona/grupo/noche, cupo máximo) y bloques horarios (hora, cupos base), **Then** todos los cambios persisten y se reflejan en el formulario público de reserva de esa entidad.
4. **Given** existen reservas creadas por los usuarios, **When** el administrador consulta el listado de reservas filtrando por tipo de entidad, entidad, fecha o estado (`pendiente`, `confirmada`, `cancelada`), **Then** puede ver el código de pase, titular, contacto, modalidad, fechas/horario, asistentes, notas, monto total y cambiar el estado (aprobar reservas pendientes o cancelar liberando cupos).

---

### User Story 4 - Directorio de Guías Turísticos Certificados y Solicitud de Reserva (Priority: P2)

Como visitante de Andacollo, quiero que el menú **Otros** sea reemplazado por **Guías Turísticos**, donde pueda descubrir guías locales certificados (SERNATUR / Starlight), filtrarlos por especialidad o buscarlos por nombre, sector o idioma, revisar su itinerario tipo y equipamiento incluido, enviarles una solicitud directa de reserva y permitir que nuevos guías locales postulen su perfil.

**Why this priority**: Reemplaza el menú genérico "Otros" con una oferta de alto valor turístico local y habilita el contacto directo con anfitriones certificados de la comuna.

**Independent Test**: Se puede probar accediendo a "Guías Turísticos" desde el menú/explorador, filtrando por especialidad (ej. "Astrofotografía Guiada"), buscando por idioma ("Inglés"), abriendo el detalle de un guía para revisar su itinerario y enviar una solicitud de reserva, y usando "+ Postular como Guía Local" para registrar un nuevo perfil.

**Acceptance Scenarios**:

1. **Given** un visitante navega por el explorador o la navegación de la plataforma, **When** busca las categorías/menús, **Then** la opción anterior "Otros" ha sido reemplazada por "Guías Turísticos" y al seleccionarla se abre la vista de Guías Certificados precargada con los 4 guías de ejemplo del mockup.
2. **Given** el visitante está en la vista de Guías Turísticos, **When** selecciona un filtro de especialidad (Todos, Astroturismo & Cielo Profundo, Astrofotografía Guiada, Patrimonio & Ruta Minera, Trekking Nocturno) o escribe en el buscador (nombre, sector o idioma), **Then** la grilla se actualiza mostrando solo los guías que cumplen los criterios.
3. **Given** el visitante hace clic en "Ver Itinerario y Reservar" en la tarjeta de un guía, **When** se abre el modal de detalle, **Then** ve la certificación, experiencia, itinerario paso a paso en Andacollo y un formulario para solicitar reserva directa (fecha, cantidad de personas y teléfono/WhatsApp de contacto).
4. **Given** el usuario envía una solicitud de reserva a un guía, **When** completa los campos obligatorios y confirma, **Then** la solicitud queda registrada en la plataforma y el usuario recibe confirmación visual clara en pantalla.
5. **Given** un usuario autenticado hace clic en "+ Postular como Guía Local", **When** completa el formulario (nombre, especialidad, certificación, tarifa referencial, sectores donde opera y descripción/equipamiento) y envía, **Then** el perfil de guía se guarda y queda disponible para gestión desde el panel de administración y visualización en el directorio según su estado activo.
6. **Given** un administrador accede al panel privado, **When** entra a la gestión de Guías Turísticos, **Then** puede crear, editar, verificar/activar o desactivar guías locales y revisar las solicitudes de reserva recibidas.

---

### User Story 5 - Mejoras a "Mi Perfil" y Perfiles Públicos de Astrofotógrafos (Priority: P2)

Como usuario registrado, quiero que mi sección **Mi Perfil** conserve todas sus funcionalidades actuales (nivel, XP, ranking, rutas, favoritos, reseñas, edición de datos, modo offline y cierre de sesión) e incorpore las mejoras del mockup: botón directo para subir fotos, estadísticas fotográficas, gestión de mi equipo fotográfico (Gear Bag), portafolio de mis capturas, mis pases/reservas activas, y la posibilidad de explorar el perfil público de otros astrofotógrafos de la comunidad y seguirlos.

**Why this priority**: Enriquecer el perfil conecta la galería comunitaria y el módulo de reservas con la identidad del viajero sin perder ninguna capacidad existente de la app.

**Independent Test**: Se puede probar abriendo "Mi Perfil" con sesión iniciada para confirmar que todas las secciones previas siguen funcionando, agregando un ítem al Gear Bag, subiendo una foto desde el perfil y viéndola en el portafolio personal, consultando los pases de reserva activos, y haciendo clic en el nombre de otro autor en la Galería de Astrofotos para abrir su perfil público y pulsar "Seguir".

**Acceptance Scenarios**:

1. **Given** un usuario autenticado abre "Mi Perfil", **When** la página carga, **Then** mantiene intactas sus funcionalidades previas (avatar, nombre, nivel/XP, puesto en ranking, accesos a logros, rutas completadas, lugares visitados, favoritos guardados y recientes, reseñas publicadas, edición de datos personales, idioma, modo offline, enlace admin si aplica y cierre de sesión).
2. **Given** el usuario visualiza su perfil mejorado, **When** revisa la cabecera y las nuevas secciones, **Then** encuentra un botón rápido "+ Subir Captura", métricas de astrofotografía (capturas publicadas, total de "Me gusta" recibidos y sectores documentados), su sección editable de "Equipo Fotográfico (Gear Bag)", sus insignias de observación, su "Portafolio de Capturas" y un resumen de "Mis Reservas y Pases".
3. **Given** el usuario agrega o elimina un elemento de su "Equipo Fotográfico (Gear Bag)", **When** guarda el cambio, **Then** la lista de equipo se persiste y se muestra tanto en su perfil propio como en su vista pública de astrofotógrafo.
4. **Given** cualquier visitante hace clic en el autor de una fotografía desde la Galería de Astrofotos, **When** navega al perfil público de ese astrofotógrafo, **Then** ve su cabecera con banner, biografía, certificación/rol, estadísticas fotográficas, Gear Bag, insignias y portafolio de capturas, además de un botón "Seguir / Siguiendo" (para usuarios autenticados) que actualiza de forma persistente el seguimiento y el contador de seguidores.

---

### Edge Cases

- **Sin cupos disponibles en un bloque horario**: Si el número de visitantes solicitados (o el cupo de un paquete grupal VIP) supera los cupos restantes de un bloque horario para la fecha seleccionada, el sistema impide confirmar la reserva, indica visualmente los cupos disponibles y sugiere elegir otro horario o fecha.
- **Fecha de reserva pasada o rango de estadía inválido**: El formulario de reservas impide seleccionar fechas anteriores al día actual y, en el perfil de Estadía/Alojamiento, exige que la fecha de salida sea posterior a la fecha de entrada (al menos 1 noche), mostrando mensajes de validación en español.
- **Cancelación duplicada o sin permisos**: Solo el titular de la reserva o un administrador puede cancelar un pase; si ya está cancelado, la acción no vuelve a sumar cupos.
- **Subida de imagen grande o formato no válido**: Si el usuario intenta subir un archivo que no es una imagen o supera el tamaño máximo permitido, el modal muestra un mensaje de error claro en el DOM y mantiene el formulario utilizable.
- **Lugar con reservas activadas pero sin paquetes u horarios configurados**: Si un administrador activa reservas en un lugar pero aún no define servicios o bloques horarios, la ficha pública muestra un aviso amigable de "Próximamente horarios disponibles" en lugar de un formulario roto.
- **Visitante sin sesión intentando acciones privadas**: Intentar subir una foto, dar "Me gusta", seguir a un fotógrafo, reservar un tour o postular como guía sin sesión activa muestra un aviso visual claro con acceso directo al inicio de sesión, sin perder el contexto visual de la app.
- **Dispositivos móviles y pantallas pequeñas**: Todas las nuevas vistas (Galería, Reservas, Guías, Perfil mejorado y Panel Admin de Reservas/Guías) se adaptan de forma fluida a móvil, tablet y escritorio sin desbordamiento horizontal.

## Requirements *(mandatory)*

### Functional Requirements

#### Integración Visual y Navegación

- **FR-001**: Todas las vistas, tarjetas, formularios, modales y notificaciones de los nuevos módulos MUST adaptarse visualmente a la identidad oficial de la plataforma (paleta Primary `#071B3A`, Navy `#031126`, Gold `#FFB800`, Orange `#FF9D00`, White `#FFFFFF`, Soft `#F5F7FA`, diseño responsivo y textos 100% en español), sin usar alertas ni confirmaciones nativas del navegador.
- **FR-002**: El menú/categoría **Fotografía** MUST reemplazar su vista anterior para dirigir y presentar la nueva **Galería de Astrofotos**.
- **FR-003**: El menú/categoría **Otros** MUST ser reemplazado en la navegación y el explorador por **Guías Turísticos**, presentando el directorio de guías certificados.
- **FR-004**: El módulo de reservas MUST integrarse dentro de la ficha de detalle de cualquier elemento del catálogo (Lugares turísticos, Restaurantes, Alojamientos, Eventos y Experiencias/Servicios) cuando dicho elemento tenga habilitadas las reservas, iniciando activo para **Observatorio Turístico Collowara**.

#### Galería de Astrofotos

- **FR-005**: La Galería de Astrofotos MUST mostrar un bloque de condiciones actuales del cielo en Andacollo (estado general/escala Bortle, visibilidad/seeing, fase lunar y hora del núcleo galáctico) alimentado desde los datos astronómicos persistentes de la plataforma.
- **FR-006**: Los usuarios MUST poder filtrar las astrofotografías por sector de observación (con contador de capturas por sector) y ordenarlas por "Más recientes" o "Más valoradas".
- **FR-007**: Cada astrofotografía MUST almacenar y mostrar imagen, título, sector de observación, descripción/historia de la toma, fecha de publicación, autor, contador de "Me gusta" y parámetros técnicos EXIF (cámara/equipo, ISO, exposición y apertura).
- **FR-008**: Los usuarios MUST poder abrir un modal de detalle completo de cada astrofotografía y navegar desde allí al perfil público del autor.
- **FR-009**: Los usuarios autenticados MUST poder dar o quitar "Me gusta" a una astrofotografía con persistencia de datos y actualización inmediata.
- **FR-010**: Los usuarios autenticados MUST poder publicar nuevas astrofotografías mediante un modal estilizado con carga de imagen (y vista previa inmediata), título, sector, descripción y datos EXIF; la nueva captura MUST aparecer inmediatamente en la galería y en el portafolio del autor.
- **FR-011**: El sistema MUST incluir datos iniciales precargados basados en los ejemplos del mockup (astrofotógrafos y capturas de Cerro Yahuín, Observatorio Collowara, Mirador La Caldera y Ruta Minera).

#### Módulo de Reservas Configurable (Collowara y Todo el Catálogo)

- **FR-012**: El sistema MUST soportar la activación o desactivación independiente del módulo de reservas para cualquier elemento de los 5 tipos del catálogo (Lugares turísticos, Restaurantes, Alojamientos, Eventos y Experiencias/Servicios) mediante una referencia polimórfica unificada, quedando habilitado por defecto solo para el **Observatorio Turístico Collowara**.
- **FR-013**: Para cada entidad con reservas activas, el sistema MUST permitir al administrador elegir uno de 4 perfiles adaptativos de reserva (`tour_horario`, `mesa_comida`, `estadia_noches`, `servicio_general`) y configurar su información propia: descripción/destacados de infraestructura o servicios, nota de traslado u operación, estado de atención, galería fotográfica ampliable, porcentaje y habilitación de descuento para residentes locales, modalidades/opciones de servicio y bloques horarios con cupos base (cuando el perfil lo utilice).
- **FR-014**: El formulario público de reserva MUST adaptarse dinámicamente al perfil configurado para la entidad:
  - **Tour / Visita por horario y cupos** (ej. Collowara): modalidad/tour, fecha de visita, bloque horario con cupos en vivo, adultos, niños/adultos mayores y descuento residente opcional.
  - **Mesa / Comida** (ej. Restaurantes): opción/zona o menú opcional, fecha, hora o bloque horario, cantidad de comensales y campo de notas/preferencias o alergias.
  - **Estadía / Alojamiento** (ej. Cabañas/Hostales): tipo de habitación/cabaña, fecha de entrada (check-in), fecha de salida (check-out) con cálculo automático de noches, cantidad de huéspedes y notas especiales.
  - **Servicio / Otros** (ej. Experiencias, visitas guiadas o servicios comunales): opción de servicio, fecha deseada, horario opcional, cantidad de personas y comentarios de solicitud.
- **FR-015**: Cada modalidad/opción de servicio MUST soportar nombre, descripción, precio base/adulto en CLP, precio niño/adulto mayor en CLP, unidad de cobro acorde al perfil (por persona, por grupo fijo con cupo máximo o por noche) y estado activo/inactivo. Cada entidad MUST poder configurarse en modo de precio **Tarifa calculada en CLP** (recalculando en tiempo real asistentes/noches y descuento local si aplica) o **Sin costo / Consumo en local** (mostrando aviso claro en lugar de un total cobrado).
- **FR-016**: El sistema MUST calcular y mostrar los cupos disponibles por fecha y bloque horario (en los perfiles que utilicen bloques horarios) descontando las reservas activas (`pendiente` o `confirmada`) existentes para esa entidad, fecha y hora, e impedir reservas que excedan la capacidad disponible.
- **FR-017**: Al enviar una reserva válida, el sistema MUST generar un código de pase único, persistir la reserva vinculada al usuario y a la entidad con el estado inicial configurado por el administrador (**Confirmada** automáticamente —como en Observatorio Collowara— o **Pendiente** de aprobación), actualizar los cupos disponibles si aplica y mostrar el registro en "Mis Pases / Reservas" del usuario.
- **FR-018**: Los usuarios MUST poder copiar el código de sus pases activos y cancelar reservas confirmadas mediante un modal de confirmación estilizado, cambiando su estado a "Cancelada" y liberando los cupos correspondientes.
- **FR-019**: El Observatorio Turístico Collowara MUST venir precargado con la información, equipamiento, galería, 3 modalidades (Tour Astronómico Clásico, Experiencia Astrofotografía, Tour Privado VIP), 3 bloques horarios (20:30, 22:00, 23:30) y descuento residente del 20% del mockup.

#### Panel de Administración (Reservas, Guías y Moderación)

- **FR-020**: El panel de administración privado MUST incorporar un apartado dedicado de **Reservas** donde el administrador pueda:
  - Filtrar y seleccionar cualquier elemento de los 5 tipos del catálogo (Lugares, Restaurantes, Alojamientos, Eventos y Experiencias/Servicios) para activar o desactivar su módulo de reservas.
  - Configurar el perfil de reserva (`tour_horario`, `mesa_comida`, `estadia_noches`, `servicio_general`), el modo de precio (`calculado` o `sin_costo`), el modo de confirmación inicial (`inmediata` o `pendiente`) y la información de reserva de cada elemento (infraestructura destacada, traslado/estado, descuento residente, galería de instalaciones).
  - Crear, editar, activar/desactivar y eliminar modalidades/servicios, unidad de cobro y precios.
  - Crear, editar y eliminar bloques horarios y sus cupos base.
  - Consultar, filtrar (por tipo de entidad, elemento, fecha y estado) y gestionar las reservas realizadas por los usuarios (aprobar reservas pendientes, confirmar o cancelar liberando cupos).
- **FR-021**: El panel de administración privado MUST incorporar un apartado para gestionar **Guías Turísticos** (crear, editar, verificar/activar, desactivar o eliminar perfiles de guías y revisar solicitudes de reserva recibidas) y moderar capturas de la galería si es necesario.

#### Guías Turísticos Certificados

- **FR-022**: La vista de **Guías Turísticos** MUST mostrar un encabezado informativo sobre certificaciones locales (SERNATUR Sello R & Q, Red Starlight Coquimbo), botón "+ Postular como Guía Local", filtros por especialidad y buscador por nombre, sector o idioma.
- **FR-023**: Cada ficha de guía MUST almacenar y mostrar nombre completo, especialidad principal, certificación, años/nivel de experiencia, idiomas, sectores donde opera, tarifa referencial, calificación, cantidad de reseñas, equipamiento incluido, biografía e itinerario tipo paso a paso.
- **FR-024**: Al seleccionar "Ver Itinerario y Reservar", el sistema MUST abrir un modal con el itinerario completo del guía y un formulario de solicitud directa de reserva (fecha, número de personas y teléfono/WhatsApp) que persista la solicitud y entregue confirmación visual.
- **FR-025**: Los usuarios autenticados MUST poder postular un nuevo perfil de guía local mediante un modal estilizado con los campos del mockup; la postulación MUST persistirse en el sistema.
- **FR-026**: El directorio MUST venir precargado con los 4 guías certificados del mockup (Carlos Alcayaga Munizaga, Valentina Araya Pizarro, Hernán Cortés Rivera y Fernanda Tapia Zepeda) con sus respectivos itinerarios y datos.

#### Mejoras a "Mi Perfil" y Perfiles Públicos

- **FR-027**: La vista **Mi Perfil** MUST preservar el 100% de las funcionalidades actuales (progreso de nivel/XP, ranking, logros, rutas completadas, lugares visitados, favoritos guardados y recientes, reseñas publicadas, edición de datos personales, idioma, modo offline, acceso a panel admin y cierre de sesión).
- **FR-028**: **Mi Perfil** MUST incorporar las siguientes mejoras inspiradas en el mockup:
  - Acción directa "+ Subir Captura" que abre el modal de publicación de astrofotografías.
  - Resumen de métricas fotográficas (capturas publicadas, total de "Me gusta" recibidos y sectores documentados).
  - Gestión persistente del "Equipo Fotográfico (Gear Bag)" del usuario (agregar/eliminar ítems con nombre y detalle).
  - Visualización de insignias de observación y del "Portafolio de Capturas" del usuario.
  - Sección de "Mis Reservas y Pases" con acceso al estado y código de sus reservas en lugares y solicitudes a guías.
- **FR-029**: El sistema MUST ofrecer una vista de **Perfil Público de Astrofotógrafo** accesible al hacer clic en cualquier autor de la galería, mostrando su cabecera, biografía, certificación/rol, estadísticas, Gear Bag, insignias, portafolio de capturas y botón persistente de "Seguir / Siguiendo" con contador de seguidores.

### Key Entities *(include if feature involves data)*

- **Astrofotografía (`astro_photo`)**: Captura nocturna publicada por un usuario o fotógrafo destacado; incluye título, sector de observación, imagen, descripción, parámetros EXIF (cámara, ISO, exposición, apertura), autor, contador de "Me gusta" y fecha de creación.
- **Reacción de Astrofotografía (`astro_photo_like`)**: Registro único por usuario y astrofotografía que garantiza un solo "Me gusta" activo por usuario y mantiene el conteo consistente.
- **Configuración de Reservas por Entidad (`booking_config`)**: Configuración vinculada 1:1 con cualquier entidad del catálogo mediante referencia polimórfica (`entity_type`: lugar, restaurante, alojamiento, evento, experiencia + `entity_id`); incluye estado activo, perfil de reserva (`tour_horario`, `mesa_comida`, `estadia_noches`, `servicio_general`), modo de precio (`calculado`, `sin_costo`), modo de confirmación (`inmediata`, `pendiente`), porcentaje y habilitación de descuento para residentes locales, nota de traslado/operación, estado de apertura, destacados de infraestructura y galería de instalaciones.
- **Servicio / Modalidad de Reserva (`booking_package`)**: Paquete, mesa/zona, habitación/cabaña, entrada o servicio ofrecido dentro de una entidad con reservas activas; incluye nombre, descripción, precio adulto/base, precio niño/adulto mayor, modo de cobro (`por_persona`, `tarifa_fija`, `por_noche`), cupo máximo, orden y estado activo.
- **Bloque Horario de Reserva (`booking_slot`)**: Turno disponible de una entidad con reservas activas (usado en perfiles con horarios/cupos); incluye hora de inicio, capacidad base (cupos) y estado activo.
- **Reserva (`booking`)**: Pase o solicitud emitida para un usuario en una entidad del catálogo; incluye referencia polimórfica a la entidad, perfil usado, código único de pase, titular, teléfono/WhatsApp, modalidad seleccionada, fecha principal (y fecha de salida/noches para estadías), bloque horario opcional, adultos/huéspedes/comensales, niños/adultos mayores, notas/preferencias, indicador de residente local, total en CLP y estado (`pendiente`, `confirmada`, `cancelada`).
- **Guía Turístico (`tour_guide`)**: Perfil de guía certificado local; incluye nombre, especialidad, certificación, experiencia, idiomas, sectores de operación, tarifa referencial, calificación, reseñas, equipamiento incluido, biografía, itinerario tipo y estado de publicación/verificación.
- **Solicitud de Reserva a Guía (`guide_booking_request`)**: Solicitud enviada por un usuario a un guía turístico; incluye guía, usuario solicitante, fecha deseada, cantidad de personas, teléfono/WhatsApp de contacto y estado (`pendiente`, `confirmada`, `cancelada`).
- **Perfil Fotográfico Extendido y Equipo (`user_profile_extension` / `user_gear_item`)**: Extensión del perfil de usuario existente con handle/usuario público, rol/certificación fotográfica, lista de ítems de equipo fotográfico (nombre y detalle) y relación de seguimiento entre usuarios (`user_follow`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los usuarios pueden filtrar la Galería de Astrofotos, inspeccionar los parámetros EXIF de una captura y publicar una nueva astrofotografía completa en menos de 90 segundos, viéndola reflejada inmediatamente en la galería y en su perfil.
- **SC-002**: Un visitante puede completar una reserva en el Observatorio Turístico Collowara (selección de tour, fecha, horario, asistentes y emisión de pase) en menos de 2 minutos, con actualización inmediata de los cupos disponibles y del total en CLP.
- **SC-003**: Un administrador puede activar el módulo de reservas en cualquier otra entidad del catálogo (por ejemplo, un restaurante con perfil Mesa/Comida o un alojamiento con perfil Estadía/Noches), configurar su modo de precio y confirmación, agregar sus servicios u horarios, y verificar el formulario adaptado operativo en la ficha pública en menos de 3 minutos sin intervención técnica.
- **SC-004**: El 100% de las acciones de filtrado, búsqueda, detalle y solicitud de reserva en el directorio de Guías Turísticos reemplazan correctamente la antigua opción "Otros" y responden de forma inmediata en escritorio y dispositivos móviles.
- **SC-005**: El 100% de las funcionalidades previas de "Mi Perfil" permanecen operativas sin regresiones, sumando la carga de fotos, gestión de Gear Bag, portafolio de capturas y visualización de pases activos.
- **SC-006**: Todas las pantallas, formularios y modales nuevos mantienen coherencia visual con la paleta oficial de la plataforma, textos 100% en español y cero diálogos nativos del navegador.

## Assumptions

- **Reutilización de autenticación y roles existentes**: Se reutiliza el sistema actual de cuentas, sesiones y rol de administrador de la plataforma; las acciones de lectura (ver galería, ver ficha de Collowara y horarios, explorar guías, ver perfiles públicos) son accesibles para todos los visitantes, mientras que publicar fotos, dar "Me gusta", seguir perfiles, confirmar reservas y postular como guía requieren sesión iniciada.
- **Pago de reservas**: Al igual que en el mockup funcional, la emisión del pase de reserva genera un comprobante con código único y cálculo de tarifa estimada en CLP sin integración de pasarela de pago bancaria en esta versión (el pago se coordina o realiza en destino).
- **Publicación de postulaciones de guías**: Para mantener la fluidez demostrativa del mockup y a la vez dar control administrativo, las postulaciones de nuevos guías quedan registradas y visibles en el panel de administración (y publicadas de forma inmediata con etiqueta editable o activables/desactivables por el administrador desde el panel).
- **Imágenes y almacenamiento**: Las astrofotografías subidas por usuarios se almacenan de forma persistente (con límite razonable de tamaño de imagen, ej. hasta 5 MB, y soporte para imágenes de muestra o archivos locales), y los datos iniciales del mockup se precargan con imágenes válidas para que todas las vistas luzcan completas desde el primer uso.
- **Telemetría del cielo en Galería Astrofotos**: El encabezado de condiciones del cielo reutiliza y sincroniza los datos astronómicos ya administrados en la plataforma (con valores por defecto coherentes con el mockup si algún campo no existe aún).
- **Extensibilidad regional**: Las estructuras de datos de reservas, guías y astrofotografía se diseñan sin acoplarse únicamente a Collowara, permitiendo activarlas en cualquier lugar turístico actual o futuro de Andacollo y la Región de Coquimbo.
