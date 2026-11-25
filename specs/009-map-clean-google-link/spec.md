# Feature Specification: Vista Limpia del Mapa y Enlace Externo a Google Maps

**Feature Branch**: `009-map-clean-google-link`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "En la vista del mapa quita la ayuda visual de google map donde dice la ubicacion estrellas y abrir en maps. Ademas agrega que en la vista del detalle resumido de mi app en el mapa aparezca tambien ahi un link para ir a ver en el mapa externo de google, debe ser algo chico y armonico con el diseño actual y sus demas elementos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mapa libre de la tarjeta informativa superpuesta de Google Maps (Priority: P1)

Como visitante que explora los puntos turísticos, restaurantes, alojamientos y servicios de Andacollo en la vista del mapa, quiero que el mapa se muestre limpio sin el recuadro informativo propio de Google Maps (donde aparecen el nombre de la ubicación, sus estrellas y la opción de ampliar o abrir el mapa), para evitar información duplicada y distracciones visuales que compiten con la interfaz propia de la aplicación.

**Why this priority**: Elimina el ruido visual y la duplicación de datos (nombre, calificación y accesos) directamente sobre la zona del mapa, asegurando que el usuario consuma una experiencia unificada y coherente con la identidad de la plataforma.

**Independent Test**: Se puede probar abriendo la vista del mapa y seleccionando distintas ubicaciones, comprobando que sobre la superficie del mapa no aparece la tarjeta informativa de Google Maps con ubicación, calificación en estrellas ni botón de abrir/ampliar mapa, tanto en escritorio como en dispositivos móviles.

**Acceptance Scenarios**:

1. **Given** un usuario accede a la vista del mapa de Andacollo, **When** el mapa termina de mostrarse en pantalla, **Then** el área visible del mapa no muestra el recuadro informativo de Google Maps con el nombre del lugar, estrellas ni enlace de "Abrir en Maps" o "Ampliar el mapa".
2. **Given** el usuario selecciona cualquier punto de interés desde el menú lateral del mapa, **When** el mapa se centra en la nueva ubicación, **Then** el mapa mantiene una presentación limpia sin mostrar la tarjeta informativa superpuesta de Google Maps y sin ocultar el marcador o enfoque del lugar elegido.
3. **Given** el usuario abre y cierra el menú lateral o utiliza los controles de acercar y alejar, **When** interactúa con la vista del mapa, **Then** la tarjeta informativa de Google Maps permanece ausente y todos los controles propios de la aplicación siguen visibles y operables.

---

### User Story 2 - Enlace discreto a Google Maps externo en la vista de detalle resumido (Priority: P1)

Como visitante que seleccionó una ubicación en el mapa, quiero encontrar dentro de la tarjeta de detalle resumido propia de la aplicación un enlace pequeño y armónico que me permita abrir esa ubicación en Google Maps externo, para poder consultar indicaciones, reseñas externas o navegar desde mi aplicación de mapas sin perder la estética limpia de la pantalla.

**Why this priority**: Al retirar la tarjeta nativa de Google Maps, el usuario necesita una vía directa y natural para abrir la ubicación seleccionada en Google Maps externo desde el mismo resumen donde consulta el lugar.

**Independent Test**: Se puede probar seleccionando una ubicación en el mapa, ubicando el enlace externo a Google Maps dentro de la tarjeta de detalle resumido, verificando que su tamaño y estilo armonizan con el enlace existente "Ver detalles" y demás elementos, y activándolo para confirmar que abre la ubicación exacta en Google Maps en una pestaña o ventana externa.

**Acceptance Scenarios**:

1. **Given** el usuario tiene una ubicación seleccionada y visualiza la tarjeta de detalle resumido dentro del menú lateral, **When** observa las acciones disponibles de esa tarjeta, **Then** ve un enlace pequeño, legible en español y visualmente armónico junto al acceso "Ver detalles" para abrir la ubicación en Google Maps externo.
2. **Given** el usuario tiene una ubicación seleccionada con el menú lateral cerrado y visualiza la tarjeta de detalle resumido compacta sobre el mapa, **When** observa sus elementos, **Then** dispone igualmente del enlace pequeño y armónico para abrir esa ubicación en Google Maps externo sin interferir con el acceso a la ficha completa del lugar.
3. **Given** el usuario activa el enlace a Google Maps externo desde la vista de detalle resumido, **When** realiza el clic o toque, **Then** la ubicación seleccionada se abre en Google Maps externo en una nueva pestaña o aplicación externa, manteniendo abierta y sin cambios la sesión actual en la vista del mapa de la aplicación.

---

### User Story 3 - Armonía visual y experiencia responsiva en escritorio y móvil (Priority: P2)

Como viajero que consulta el mapa desde un teléfono móvil o desde un computador, quiero que el enlace externo a Google Maps dentro del detalle resumido conserve proporciones compactas, buena legibilidad y separación adecuada respecto a la calificación, distancia y enlace "Ver detalles", para que la tarjeta nunca se vea sobrecargada ni difícil de pulsar.

**Why this priority**: Garantiza que la incorporación del nuevo enlace respete la jerarquía visual, la paleta de colores y la usabilidad táctil en pantallas pequeñas sin romper el equilibrio del diseño actual.

**Independent Test**: Se puede probar en resoluciones de escritorio y móvil con nombres de lugares cortos y largos, verificando que el enlace externo mantiene un aspecto discreto, no genera saltos de línea desordenados ni desbordamientos y permite distinguir claramente entre ver el detalle interno y abrir el mapa externo.

**Acceptance Scenarios**:

1. **Given** un usuario visualiza el detalle resumido de un lugar con nombre o dirección extensa en pantalla móvil o escritorio, **When** se muestran las acciones de la tarjeta, **Then** el enlace externo a Google Maps se acomoda de forma ordenada y compacta sin recortar texto ni superponerse con otros elementos.
2. **Given** el usuario interactúa con la tarjeta de detalle resumido compacta sobre el mapa, **When** pulsa específicamente el enlace a Google Maps externo, **Then** únicamente se abre el mapa externo sin navegar accidentalmente a la ficha interna del lugar.
3. **Given** el usuario interactúa con el resto de la tarjeta de detalle resumido o pulsa "Ver detalles", **When** confirma la acción, **Then** navega normalmente a la ficha completa del lugar dentro de la aplicación.

---

### Edge Cases

- ¿Qué ocurre si el usuario selecciona un lugar que no tiene dirección detallada o cuya ubicación se identifica solo por nombre y comuna? El enlace externo a Google Maps utiliza la referencia de ubicación disponible del lugar (nombre y referencia de Andacollo) para abrir un destino válido sin fallar.
- ¿Qué ocurre si el usuario cambia rápidamente de una ubicación seleccionada a otra? El enlace externo en el detalle resumido se actualiza de inmediato para apuntar a la nueva ubicación seleccionada, y el mapa continúa sin mostrar la ayuda visual de Google Maps.
- ¿Qué ocurre si no hay ninguna ubicación seleccionada o el catálogo está cargando o vacío? No se muestra la tarjeta de detalle resumido ni un enlace externo huérfano, y el mapa general de Andacollo sigue mostrándose limpio sin la tarjeta informativa de Google Maps.
- ¿Qué ocurre al hacer acercamiento o alejamiento máximo en el mapa? La eliminación de la ayuda visual de Google Maps no debe interferir con la visualización central de la ubicación ni recortar los controles propios de la aplicación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La vista del mapa MUST ocultar o eliminar de la presentación visible el recuadro de ayuda visual propio de Google Maps que muestra la ubicación, la calificación con estrellas y la opción de abrir o ampliar en Maps.
- **FR-002**: La eliminación de dicha ayuda visual MUST mantenerse efectiva tanto en la vista inicial del mapa de Andacollo como al seleccionar cualquier ubicación del catálogo, en todos los niveles de acercamiento disponibles.
- **FR-003**: La vista de detalle resumido de la ubicación seleccionada dentro del menú lateral MUST incluir un enlace compacto en español para ver esa ubicación en Google Maps externo.
- **FR-004**: La vista de detalle resumido compacta mostrada sobre el mapa cuando el menú lateral está cerrado MUST incluir también el enlace compacto en español para abrir la ubicación seleccionada en Google Maps externo.
- **FR-005**: El enlace a Google Maps externo MUST tener un tamaño visual discreto y una jerarquía secundaria armónica respecto al diseño actual, respetando la paleta de colores oficial, la tipografía escalable y la coexistencia clara con el enlace "Ver detalles" y los metadatos del lugar.
- **FR-006**: Al activar el enlace a Google Maps externo, el sistema MUST abrir la ubicación correspondiente en Google Maps en una nueva pestaña o ventana externa sin abandonar ni recargar la vista actual del mapa en la aplicación.
- **FR-007**: Al activar el enlace a Google Maps externo dentro de la tarjeta compacta sobre el mapa, el sistema MUST evitar que el clic o toque dispare accidentalmente la navegación interna hacia la ficha del lugar.
- **FR-008**: El enlace a Google Maps externo MUST actualizar dinámicamente su destino cada vez que el usuario seleccione una ubicación diferente.
- **FR-009**: El enlace a Google Maps externo MUST ser accesible mediante teclado y lectores de pantalla, contando con una etiqueta clara en español que indique que abre la ubicación en Google Maps externo.
- **FR-010**: Todos los controles existentes de la vista del mapa (apertura y cierre del menú lateral, búsqueda, filtros por categoría, acercar, alejar, "Cómo llegar" y acceso a "Ver detalles") MUST seguir funcionando con normalidad y sin superposiciones en escritorio y móvil.

### Key Entities

- **Ubicación seleccionada**: Punto de interés activo en el mapa (sitio turístico, restaurante, alojamiento, evento o servicio de Andacollo) que provee el nombre, categoría, valoración, distancia, enlace interno a su ficha de detalle y referencia geográfica para abrir su ubicación en Google Maps externo.
- **Vista de detalle resumido**: Presentación breve de la ubicación seleccionada dentro de la experiencia del mapa (tanto en el panel lateral como en la tarjeta compacta inferior cuando el panel está cerrado) que agrupa la información esencial del lugar y sus accesos rápidos ("Ver detalles" y enlace compacto a Google Maps externo).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En el 100% de las visualizaciones del mapa (carga inicial y selección de cualquier ubicación en escritorio y móvil), el recuadro informativo nativo de Google Maps con nombre, estrellas y botón de abrir en Maps deja de ser visible para el usuario.
- **SC-002**: El 100% de las ubicaciones seleccionables muestran un enlace compacto y funcional hacia Google Maps externo en su vista de detalle resumido (tanto dentro del menú lateral como en la tarjeta compacta con menú cerrado).
- **SC-003**: Un usuario puede abrir la ubicación seleccionada en Google Maps externo en 1 solo clic o toque desde la vista de detalle resumido, conservando su vista actual de la aplicación intacta.
- **SC-004**: El nuevo enlace externo no incrementa en más de una línea la altura habitual de las acciones de la tarjeta de detalle resumido ni genera desbordamientos visuales en pantallas móviles (desde 360px de ancho) ni de escritorio.

## Assumptions

- El texto visible del enlace compacto será breve, claro y en español (por ejemplo, "Ver en Maps" o "Google Maps") acompañado de un ícono discreto de enlace externo o mapa, manteniendo coherencia con el estilo de "Ver detalles".
- El enlace externo apunta a la visualización de la ubicación seleccionada en Google Maps (vista de lugar/mapa) y se abre en una nueva pestaña o en la app nativa de mapas del dispositivo móvil según el comportamiento estándar del navegador.
- El botón existente de "Cómo llegar" en los controles flotantes del mapa se conserva como acceso rápido a indicaciones de ruta, mientras que el nuevo enlace dentro del detalle resumido ofrece acceso directo para ver el lugar en Google Maps externo.
- Se mantiene intacta la identidad visual del proyecto (paleta oficial, idioma español y diseño responsivo para web y móvil).
