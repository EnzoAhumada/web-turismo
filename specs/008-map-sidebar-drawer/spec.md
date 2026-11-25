# Feature Specification: Menú Lateral Ocultable y Vista Limpia del Mapa

**Feature Branch**: `008-map-sidebar-drawer`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "aplica las mejoras - Al seleccionar una ubicacion en el mapa, quita la parte de arriba que dice ubicacion seleccionada - Mejora la vista del menu de mapa para que el buscador, la seleccion de categorias de ubicacion y las ubicaciones esten en un menu lateral que esta oculto algo asi como en google maps, para que la vista muestre mas el mapa"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exploración del mapa a pantalla amplia con menú lateral ocultable (Priority: P1)

Como visitante que entra a la sección del mapa de Andacollo, quiero ver el mapa ocupando casi todo el espacio disponible desde el primer momento y contar con un botón visible para abrir o cerrar un menú lateral desplegable (al estilo de Google Maps) donde se agrupan el buscador, los filtros de categoría y la lista de ubicaciones, para poder explorar visualmente el territorio sin que el menú me reste espacio.

**Why this priority**: Es la mejora central de usabilidad solicitada. Liberar el área del mapa maximiza la visibilidad geográfica tanto en escritorio como en dispositivos móviles, manteniendo a un solo toque o clic todas las herramientas de búsqueda y descubrimiento.

**Independent Test**: Se puede probar ingresando directamente a la página del mapa, comprobando que el mapa ocupa el ancho completo con el menú lateral oculto por defecto, abriendo el menú desde su control flotante, buscando o filtrando lugares, y volviéndolo a ocultar sin perder el estado del mapa ni los filtros aplicados.

**Acceptance Scenarios**:

1. **Given** un usuario abre la vista del mapa, **When** termina de cargar la pantalla, **Then** el mapa ocupa toda el área principal de la vista y el menú lateral de exploración se encuentra oculto, mostrando únicamente un botón flotante claramente identificable en español para desplegarlo.
2. **Given** el menú lateral está oculto sobre el mapa, **When** el usuario activa el botón flotante de apertura, **Then** el menú lateral se despliega suavemente sobre el costado izquierdo mostrando el campo de búsqueda, los filtros por categoría y el listado de ubicaciones disponibles.
3. **Given** el menú lateral está desplegado, **When** el usuario activa el botón de cierre del menú lateral (o presiona la tecla Escape, o toca fuera del panel en pantallas pequeñas), **Then** el menú lateral se oculta nuevamente y el mapa vuelve a mostrarse sin obstrucciones.
4. **Given** el usuario aplica un término de búsqueda o selecciona una categoría dentro del menú lateral y luego lo oculta, **When** vuelve a abrir el menú lateral, **Then** el término de búsqueda, la categoría activa y los resultados filtrados se conservan intactos.

---

### User Story 2 - Selección de ubicación sin cartel superior obstructivo (Priority: P1)

Como visitante que selecciona un punto turístico, restaurante, alojamiento o servicio en el mapa, quiero que el mapa se enfoque en el lugar elegido sin mostrar el recuadro superior flotante que dice "Ubicación seleccionada", para disfrutar de una vista limpia y despejada del mapa.

**Why this priority**: Corresponde directamente a la primera mejora solicitada por el usuario y elimina un elemento visual que tapaba la parte superior del mapa al elegir cualquier punto.

**Independent Test**: Se puede probar abriendo el menú lateral, seleccionando cualquier ubicación de la lista y verificando que el mapa se centra en ese lugar sin renderizar ningún aviso, etiqueta o tarjeta superior con el texto "Ubicación seleccionada".

**Acceptance Scenarios**:

1. **Given** el usuario está en la vista del mapa con el menú lateral abierto, **When** selecciona una ubicación de la lista, **Then** el mapa se enfoca en dicha ubicación y no aparece ningún bloque ni encabezado superior con el texto "Ubicación seleccionada" sobre el mapa.
2. **Given** el usuario ya tiene una ubicación seleccionada, **When** selecciona otra ubicación distinta, **Then** el mapa actualiza su enfoque hacia la nueva ubicación manteniendo la parte superior del mapa completamente libre de carteles flotantes de selección.
3. **Given** el usuario selecciona una ubicación en el mapa, **When** desea ver más información o ir a la ficha completa del lugar, **Then** sigue disponiendo de un resumen discreto del lugar seleccionado (con acceso a "Ver detalles" y opción de cómo llegar) sin obstaculizar la zona superior del mapa.

---

### User Story 3 - Búsqueda, filtrado y selección fluida en dispositivos móviles y escritorio (Priority: P2)

Como viajero que consulta el mapa desde un teléfono móvil o desde un computador, quiero que el menú lateral ocultable se adapte cómodamente a mi pantalla para buscar lugares, filtrar por categoría y elegir un destino sin que los controles se superpongan ni dificulten ver el mapa.

**Why this priority**: La experiencia multiplataforma (web y móvil) es un pilar del proyecto y el comportamiento de un menú lateral tipo Google Maps debe sentirse natural en pantallas pequeñas donde el espacio del mapa es aún más valioso.

**Independent Test**: Se puede probar en resoluciones móviles y de escritorio abriendo el menú lateral, filtrando por una categoría, eligiendo un lugar y comprobando que en móvil el menú se retrae automáticamente al elegir una ubicación para dejar visible el mapa y la tarjeta inferior de acceso rápido.

**Acceptance Scenarios**:

1. **Given** un usuario en pantalla móvil abre el menú lateral y selecciona una ubicación de la lista, **When** confirma la selección, **Then** el menú lateral se cierra automáticamente para mostrar el mapa enfocado y la vista previa compacta del lugar en la parte inferior.
2. **Given** el usuario busca un texto que no coincide con ninguna ubicación o aplica un filtro sin resultados dentro del menú lateral, **When** se actualizan los resultados, **Then** el menú lateral muestra un estado vacío claro en español y permite limpiar la búsqueda o cambiar de categoría con un solo toque o clic.
3. **Given** el usuario está visualizando el mapa con el menú lateral oculto, **When** utiliza los controles de acercar, alejar o abrir indicaciones de ruta, **Then** dichos controles permanecen accesibles y nunca quedan tapados por el botón de apertura del menú ni por la vista previa del lugar.

---

### Edge Cases

- ¿Qué ocurre si los datos de ubicaciones están cargando cuando el usuario abre el menú lateral? El menú lateral muestra un indicador de carga claro en español dentro del listado sin bloquear el resto de la interfaz.
- ¿Qué ocurre si ocurre un error al obtener las ubicaciones? El menú lateral muestra un mensaje de error visual coherente con el diseño del sitio (sin diálogos nativos del navegador) y mantiene el mapa visible.
- ¿Qué ocurre si el usuario escribe una búsqueda, filtra por categoría y no hay coincidencias? Se muestra un estado vacío informativo en español dentro del menú lateral y el botón para limpiar la búsqueda permite recuperar todos los resultados inmediatamente.
- ¿Qué ocurre si el usuario cambia el tamaño de la ventana entre escritorio y móvil con el menú abierto? El menú lateral mantiene una presentación usable, sin desbordamientos horizontales y conservando el control de cierre visible.
- ¿Qué ocurre si hay muchas ubicaciones en la lista dentro del menú lateral? El listado dentro del panel permite desplazamiento vertical independiente manteniendo el buscador y el botón de cierre accesibles.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La vista del mapa MUST eliminar por completo el elemento flotante superior que muestra el texto "Ubicación seleccionada" (y su tarjeta/marcador superior asociado) al seleccionar cualquier ubicación.
- **FR-002**: La vista del mapa MUST presentar inicialmente el mapa ocupando el ancho y alto completo del área principal, con el menú de exploración oculto por defecto.
- **FR-003**: La vista del mapa MUST mostrar un control flotante siempre visible y accesible (con etiqueta clara en español) que permita abrir y cerrar el menú lateral en cualquier momento.
- **FR-004**: El menú lateral ocultable MUST contener de forma agrupada: el campo de búsqueda con opción de limpiar texto, los controles de selección de categorías de ubicación y la lista de ubicaciones filtradas.
- **FR-005**: Al abrirse, el menú lateral MUST superponerse desde el lateral izquierdo al estilo de un cajón desplegable (similar a Google Maps) sin reducir abruptamente ni ocultar los controles esenciales del mapa.
- **FR-006**: El menú lateral MUST ofrecer una forma clara y accesible de cerrarse (botón de cierre dentro del panel, soporte de tecla Escape y cierre al interactuar fuera del panel en pantallas pequeñas).
- **FR-007**: Al seleccionar una ubicación desde la lista del menú lateral, el sistema MUST enfocar el mapa en esa ubicación y resaltar la ubicación activa en la lista.
- **FR-008**: En pantallas móviles, al seleccionar una ubicación desde el menú lateral, el sistema MUST cerrar automáticamente el menú lateral para priorizar la visualización del mapa y mostrar el acceso rápido a la ficha del lugar.
- **FR-009**: El sistema MUST conservar el estado de búsqueda, la categoría seleccionada y la ubicación activa cuando el usuario abre y cierra el menú lateral repetidamente.
- **FR-010**: Todos los textos visibles de los controles nuevos y existentes (botón de apertura, cierre, buscador, categorías, estados vacíos, carga y errores) MUST estar en español y respetar la identidad visual del sitio.
- **FR-011**: Los controles de acercar, alejar y "Cómo llegar" MUST permanecer visibles y operables tanto con el menú lateral oculto como desplegado, sin superposiciones indeseadas.

### Key Entities

- **Ubicación del mapa**: Representa un punto de interés de Andacollo (sitio turístico, restaurante, alojamiento, evento o servicio) con nombre, categoría, dirección, valoración, distancia aproximada, imagen y enlace a su ficha de detalle.
- **Estado del menú lateral**: Representa si el panel lateral de exploración está abierto o cerrado, junto con el texto de búsqueda activo, la categoría filtrada y la ubicación actualmente seleccionada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al cargar la vista del mapa con el menú oculto, al menos el 90% del área útil bajo la barra de navegación superior queda visible y despejada para el mapa tanto en escritorio como en móvil.
- **SC-002**: Al seleccionar cualquier ubicación en el mapa, el 0% de la zona superior del mapa queda obstruida por el recuadro de "Ubicación seleccionada" (el elemento desaparece por completo en todas las resoluciones).
- **SC-003**: Un usuario puede abrir el menú lateral, filtrar por una categoría o buscar un lugar, seleccionar una ubicación y volver a ver el mapa despejado en 3 interacciones o menos.
- **SC-004**: El 100% de las acciones existentes del explorador de mapa (búsqueda por texto, limpieza de búsqueda, filtrado por categoría, selección de ubicación, zoom, indicaciones y navegación al detalle del lugar) siguen funcionando correctamente en escritorio y móvil sin pérdida de funcionalidad.

## Assumptions

- El menú lateral inicia oculto por defecto al ingresar a la página del mapa para maximizar el área visible del mapa desde el primer segundo, tal como se solicitó.
- El acceso a la ficha detallada del lugar seleccionado ("Ver detalles") se mantiene disponible: dentro del menú lateral en escritorio y mediante la tarjeta compacta inferior en móvil (o un acceso discreto en escritorio si se desea consultar con el menú cerrado).
- No se introducen nuevas fuentes de datos ni cambios en el catálogo de categorías; se reutilizan las ubicaciones, categorías y búsquedas ya existentes en el explorador del mapa.
- La experiencia visual mantiene la paleta de colores oficial del proyecto, el sistema tipográfico escalable y el idioma español en todos los controles.
