# Feature Specification: Rediseño Visual Profesional, Navegación Adaptativa y Catálogo Real de Andacollo

**Feature Branch**: `002-professional-ui-real-data`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Realiza los ajustes para el proyecto, la idea es mejorar el aspecto visual para que sea profesional y que sea mas inspirado en los diseños propuestos y complementar con buenas practicas de diseño como las que se aplican en aplicaciones reales:
- Cambiar logo
- Cambiar la iconografia para usar una libreria gratis pero profesional
- AJustar el diseño general para seguir el diseño de la especificacion, para el diseño movil debe ser adaptativo y mantener el estilo, se debe tomar como base la app de airbnb (https://www.airbnb.cl/) u otro similar con barra de navegacion abajo para el formato movil y lo demas del formato web. EL diseño debe ser solo inspirado en otras app similares pero mantener un diseño original.
- Agrega informacion real para todos los datos de la APP, con la informacion real de puntos de interes de andacollo y fotos, para cada opcion deberia tener minimo 5 datos.
- Evita todos los iconos y estilos en comun que genera la IA y usa diseños profesionales 
- Toma como base para el diseño los mockup que estan en la carpeta '/design'"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Experiencia Visual Profesional, Nuevo Logo e Iconografía Vectorial (Priority: P1)

Los visitantes y usuarios exploran la plataforma ThakiGo percibiendo una identidad visual auténtica, limpia y profesional, libre de emojis genéricos o estilos sintéticos generados por IA. La marca destaca mediante el nuevo logotipo oficial (montañas con sendero, sol y estrellas de Andacollo) y un sistema de iconografía vectorial profesional y uniforme en todas las vistas, inspirado directamente en los mockups de la carpeta `/design`.

**Why this priority**: Es el núcleo de la percepción de calidad y confianza de la plataforma. Reemplazar los emojis e estilos genéricos por el nuevo logotipo, una iconografía limpia de trazo consistente y la estética de los mockups de `/design` transforma inmediatamente la aplicación en un producto real de nivel comercial.

**Independent Test**: Se puede verificar recorriendo todas las pantallas públicas, de usuario y de administración para comprobar que el nuevo logotipo se muestra en encabezados, login y panel administrativo, que el 100% de los emojis o iconos genéricos han sido sustituidos por iconos vectoriales de trazo consistente, y que cada vista respeta la composición, jerarquía tipográfica y paleta de los mockups en `/design`.

**Acceptance Scenarios**:

1. **Given** un usuario que accede a cualquier sección de la aplicación (barra de navegación, bienvenida/login, inicio o panel municipal), **When** visualiza la identidad de marca de ThakiGo, **Then** se muestra el nuevo logotipo oficial de la carpeta `/design` integrado armónicamente con el nombre de la marca y el fondo correspondiente.
2. **Given** cualquier pantalla con categorías, filtros, acciones rápidas (Cómo llegar, Llamar, Guardar, Compartir), condiciones astronómicas, insignias o menús, **When** se renderizan los elementos gráficos de apoyo, **Then** se muestran exclusivamente iconos vectoriales de trazo limpio y profesional, sin utilizar emojis de texto ni decoraciones artificiales típicas de plantillas generadas por IA.
3. **Given** las 14 pantallas de referencia en `/design` (Inicio Inteligente, Mapa Interactivo, Explorador Turístico, Perfil de Lugar, Recomendaciones, Planificador, Favoritos, Turismo Astronómico, Eventos, Gamificación, Experiencias, Perfil de Usuario, Dashboard Municipal y Login), **When** el usuario navega por sus equivalentes en la aplicación, **Then** las tarjetas, botones, cabeceras, insignias y paneles reflejan fielmente el lenguaje visual de los mockups manteniendo un diseño original y pulido.

---

### User Story 2 - Navegación Adaptativa Web y Móvil con Barra Inferior al Estilo Airbnb (Priority: P1)

Un viajero que consulta la plataforma desde su teléfono móvil cuenta con una experiencia nativa y ergonómica con una barra de navegación fija en la parte inferior (`Inicio`, `Explorar`, `Mapa`, `Favoritos`, `Perfil`) y barras de categorías desplazables horizontalmente inspiradas en aplicaciones líderes como Airbnb, mientras que en pantallas de escritorio disfruta de una disposición web amplia, equilibrada y con navegación superior y grillas multi-columna.

**Why this priority**: El uso turístico ocurre tanto en terreno (móvil con una sola mano) como durante la planificación en casa (escritorio). Garantizar que el formato móvil utilice navegación inferior fija y que el formato escritorio aproveche el espacio sin distorsionar el estilo original de los mockups es indispensable para la usabilidad real.

**Independent Test**: Se puede probar redimensionando la ventana o accediendo desde dispositivos móviles y de escritorio, comprobando que en resoluciones móviles la navegación principal se fija en la parte inferior con sus 5 accesos clave y las fichas se adaptan al formato de tarjeta móvil de `/design`, mientras que en escritorio se activa la cabecera web completa con grillas adaptativas y proporciones de fotografía consistentes.

**Acceptance Scenarios**:

1. **Given** un usuario que accede desde un dispositivo móvil o pantalla estrecha, **When** navega por cualquiera de las vistas de viajero, **Then** dispone de una barra de navegación inferior fija con los 5 destinos principales (`Inicio`, `Explorar`, `Mapa`, `Favoritos`, `Perfil`) con iconos vectoriales y resaltado activo, ocultando menús superiores redundantes y asegurando que el contenido final no quede cubierto por la barra.
2. **Given** un usuario que explora listados y categorías en formato web de escritorio, **When** interactúa con el catálogo de lugares, alojamientos, restaurantes o experiencias, **Then** visualiza una barra de cabecera superior limpia con buscador integrado, barra horizontal de categorías con iconos, y grillas de tarjetas multi-columna con fotografías de proporción uniforme, calificaciones y precios/distancias claramente jerarquizados.
3. **Given** la vista de detalle de un lugar (`Perfil de Lugar`) o el `Mapa Interactivo`, **When** se abre en móvil o en escritorio, **Then** en móvil presenta la cabecera fotográfica con tarjeta inferior de bordes redondeados (`bottom sheet`) y botones de acción circular/rápida tal como en `/design/4 perfil del lugar.jpg` y `/design/2 mapa interactivo.jpg`, y en escritorio organiza la galería, la ficha informativa y el mapa en una distribución equilibrada de múltiples columnas.

---

### User Story 3 - Catálogo Completo con Datos Reales y Fotografías de Andacollo (Mínimo 5 por Categoría) (Priority: P2)

El visitante explora información auténtica, verificable y útil sobre la comuna de Andacollo en todas las secciones de la aplicación, encontrando como mínimo 5 registros reales con fotografías representativas, ubicaciones precisas, horarios, precios en pesos chilenos y descripciones patrimoniales en cada categoría y módulo funcional.

**Why this priority**: Una aplicación turística profesional carece de valor si muestra textos de relleno o lugares ficticios. Contar con al menos 5 registros reales por cada opción (sitios turísticos, restaurantes, alojamientos, eventos, experiencias, puntos astronómicos, rutas e insignias) permite que el viajero descubra el verdadero patrimonio religioso, minero, astronómico y cultural de Andacollo.

**Independent Test**: Se puede probar reiniciando o consultando la base de datos y navegando por cada categoría y módulo de la aplicación para contabilizar que existan al menos 5 registros reales de Andacollo por cada apartado, todos con fotografías válidas que cargan correctamente, coordenadas reales dentro de la comuna y descripciones precisas en español.

**Acceptance Scenarios**:

1. **Given** el catálogo público de la plataforma, **When** un usuario consulta cualquiera de las opciones principales (`Sitios Turísticos / Lugares`, `Restaurantes / Gastronomía`, `Alojamientos / Hospedajes`, `Eventos y Festividades`, `Experiencias Locales` y `Puntos / Recursos de Turismo Astronómico`), **Then** cada una muestra como mínimo 5 registros reales de Andacollo (por ejemplo: Basílica Menor, Templo Grande, Observatorio Collowara, Mina Churrumata / Museo Minero, Mirador El Toro, Pichasca / oasis y servicios gastronómicos y hoteleros reales de la comuna).
2. **Given** cada registro mostrado en tarjetas de listado, pines del mapa o vistas de detalle, **When** se renderiza en pantalla, **Then** incluye una fotografía real o representativa de alta calidad que carga sin enlaces rotos (con respaldo visual elegante en caso de desconexión), calificación, ubicación/distancia real en Andacollo, horario o fecha y descripción detallada en español.
3. **Given** los módulos complementarios de `Planificador de Viajes`, `Recomendaciones`, `Gamificación` y `Dashboard Municipal`, **When** el usuario los consulta, **Then** también despliegan al menos 5 elementos reales y coherentes con la realidad de Andacollo (mínimo 5 rutas/itinerarios temáticos, 5 recomendaciones contextuales, 5 insignias/desafíos culturales y métricas municipales basadas en los atractivos reales).

---

### Edge Cases

- **Fallo de carga en fotografías externas o red móvil lenta**: Si la fotografía de un punto de interés tarda en cargar o falla por conectividad en terreno, la tarjeta muestra un contenedor con proporción fija, animación suave de carga y una imagen local de respaldo representativa de Andacollo, evitando iconos de imagen rota o saltos en el diseño.
- **Superposición de la barra de navegación inferior en móvil**: En pantallas móviles pequeñas o con barras gestuales del sistema operativo, el contenedor principal mantiene un margen inferior seguro para que ningún botón de acción (como `"Generar mi ruta"`, `"Comenzar"` o tarjetas flotantes del mapa) quede oculto detrás de la barra de navegación inferior.
- **Nombres largos o descripciones extensas en tarjetas**: En grillas tanto móviles como de escritorio, los títulos y resúmenes de lugares reales mantienen una altura controlada mediante truncado limpio a una o dos líneas, preservando la alineación perfecta de las tarjetas al estilo de aplicaciones comerciales.
- **Transición entre vistas con tema claro y vistas con tema nocturno**: Pantallas como `Turismo Astronómico`, `Perfil de Usuario`, `Login / Bienvenida` y la barra lateral del `Dashboard Municipal` utilizan el tema oscuro profundo (`Navy` / `Primary`) definido en `/design`, mientras que `Inicio`, `Explorar`, `Mapa`, `Favoritos` y `Planificador` utilizan el fondo luminoso (`Soft` / `White`), manteniendo la barra de navegación y los controles legibles con contraste óptimo en ambos modos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Nuevo Logotipo Oficial)**: El sistema MUST incorporar y mostrar el nuevo logotipo oficial ubicado en `/design/ChatGPT Image Jun 2, 2026, 03_42_10 PM.png` (isotipo de montañas con camino, sol y estrellas acompañado de la marca `ThakiGo` donde corresponda) en la barra de navegación web, pantalla de bienvenida/login, cabecera móvil y barra lateral del panel de administración municipal, además de actualizar el icono de pestaña del navegador (`favicon`).
- **FR-002 (Iconografía Vectorial Profesional)**: El sistema MUST reemplazar el 100% de los emojis de texto y símbolos decorativos improvisados por un sistema de iconografía vectorial gratuita de estándar profesional (trazo limpio, grosor uniforme de `1.75px` a `2px`, bordes redondeados coherentes con los mockups de `/design`), cubriendo navegación, categorías turísticas, acciones de contacto/mapa, clima/astronomía, medallas de gamificación y controles de interfaz.
- **FR-003 (Eliminación de Estética Genérica de IA)**: El diseño visual MUST prescindir de patrones artificiales típicos de código autogenerado (como abuso de emojis en títulos, gradientes neón no contemplados en la paleta, sombras desproporcionadas o bordes inconsistentes) y aplicar prácticas de diseño de producto real: jerarquía tipográfica clara, espaciado respirable en base `rem` (`10px`), bordes redondeados consistentes, sombras sutiles de elevación y fotografías protagonistas con relación de aspecto controlada.
- **FR-004 (Navegación Adaptativa Inspirada en Airbnb)**: La arquitectura de navegación MUST adaptarse dinámicamente según el dispositivo manteniendo una identidad original propia de ThakiGo:
  - **En formato móvil**: Barra de navegación inferior fija con 5 accesos directos (`Inicio`, `Explorar`, `Mapa`, `Favoritos`, `Perfil`) con icono vectorial y etiqueta en español, barra de búsqueda tipo píldora en la parte superior y navegación interna con botón de retroceso limpio en vistas secundarias, siguiendo los mockups de `/design`.
  - **En formato web (escritorio y tablet horizontal)**: Cabecera superior fija con el nuevo logotipo, buscador centralizado estilo píldora, enlaces de navegación claros, acceso a perfil/administración y barra horizontal de categorías con iconos para filtrado rápido.
- **FR-005 (Fidelidad a los Mockups de `/design`)**: Todas las pantallas de la aplicación MUST alinear su estructura y estilo visual con las 14 láminas de `/design`:
  - `1. Inicio Inteligente`: Saludo personalizado, buscador tipo píldora, tarjeta destacada principal con imagen a sangre y texto superpuesto con degradado oscuro inferior, y carrusel/grilla de `"Recomendado para ti"`.
  - `2. Mapa Interactivo`: Buscador flotante superior, chips de filtro (`Lugares`, `Restaurantes`, `Hospedajes`, `Rutas`), pines diferenciados por color de categoría, botón flotante de centrado/ubicación y tarjeta inferior flotante de vista previa del lugar seleccionado.
  - `3. Explorador Turístico`: Buscador superior, cuadrícula de iconos circulares de categorías con colores distintivos (`Cultura`, `Gastronomía`, `Astronomía`, `Naturaleza`, `Religión`, `Minería`, `Trekking`, `Fotografía`, `Eventos`, `Otros`), chips de `"Filtros populares"` (`Cerca de mí`, `Gratis`, `Familiar`, `Abierto ahora`) y sección de `"Lugares destacados"`.
  - `4. Perfil de Lugar`: Fotografía superior amplia con botones flotantes de regreso y categoría, contenedor inferior con bordes superiores redondeados, título, subtítulo, calificación con reseñas, estado (`Abierto ahora` y horario), fila de 4 acciones con iconos (`Cómo llegar`, `Llamar`, `Guardar`, `Compartir`), descripción y bloque de información práctica (`Dirección`, `Tiempo estimado`).
  - `5. Recomendaciones`: Banner nocturno destacado (`"¡Cielo despejado esta noche!"` con botón naranja `"Ver ruta astronómica"`), grilla `"Te puede interesar"` y lista compacta `"Otras recomendaciones"`.
  - `6. Planificador de Viajes`: Selectores tipo píldora para `"Tiempo disponible"` (`Medio día`, `1 día`, `2 - 3 días`, `+3 días`), iconos circulares seleccionables para `"Intereses"` (`Cultura`, `Naturaleza`, `Aventura`, `Gastronomía`, `Astronomía`, `Religión`), píldoras de `"Presupuesto"` (`Económico`, `Moderado`, `Premium`) y botón principal de ancho completo `"Generar mi ruta"`.
  - `7. Sistema de Favoritos`: Pestañas superiores con línea activa (`Lugares`, `Rutas`, `Experiencias`) y tarjetas horizontales limpias con miniatura cuadrada redondeada, título, calificación, distancia e icono de corazón activo.
  - `8. Turismo Astronómico`: Interfaz en modo nocturno profundo (`Navy`), tarjeta de `"Condiciones actuales"` con 3 indicadores e iconos vectoriales (`Cielo Despejado`, `Visibilidad Excelente`, `Luna Creciente`), fila de `"Mejores horarios"` y lista de `"Lugares recomendados"` con acceso al detalle.
  - `9. Eventos y Festividades`: Pestañas (`Próximos`, `Mis eventos`) y tarjetas horizontales con fotografía, título del evento, rango de fechas, subtítulo temático e icono de guardado (marcador/bookmark).
  - `10. Gamificación`: Cabecera en tono oscuro con avatar, nombre de rango (`Explorador Thaki`), nivel, barra de progreso de experiencia (XP) en dorado, tarjeta inferior blanca con medallas ilustradas/vectoriales (`Explorador`, `Ruta Minera`, `Cazador de Estrellas`, etc.) y bloques de `"Estadísticas"` (`Lugares visitados`, `Rutas completadas`, `Insignias`).
  - `11. Experiencias Locales`: Chips de filtro (`Todas`, `Tours`, `Gastronomía`, `Aventura`) y tarjetas horizontales con fotografía, nombre de la actividad, precio en pesos chilenos (`CLP`), calificación e icono de categoría/reserva.
  - `12. Perfil de Usuario`: Interfaz en modo oscuro elegante (`Navy`), avatar circular centrado, nombre, nivel, barra de progreso XP, lista de accesos con iconos y contadores (`Mis logros`, `Rutas completadas`, `Lugares visitados`) y bloque de preferencias (`Configuración`, `Idioma: Español`, interruptor visual de `Modo offline`).
  - `13. Dashboard Municipal`: Panel web con barra lateral izquierda oscura (`Navy`) con el nuevo logo de `ThakiGo` y menú con iconos (`Resumen`, `Visitantes`, `Lugares`, `Eventos`, `Reportes`, `Configuración`), junto a un área principal clara con tarjetas de KPIs (`Visitantes hoy`, `Lugares más visitados`, `Tiempo promedio de visita`), gráfico de línea de `"Flujo de visitantes"`, gráfico de anillo de `"Procedencia de visitantes"` y barras horizontales de `"Intereses principales"`, además de las herramientas de gestión (CRUD) de registros.
  - `14. Login / Bienvenida`: Vista de portada nocturna con la Basílica de Andacollo iluminada de fondo, el nuevo logotipo y marca `ThakiGo` ("Explora tu próximo camino"), titular `"Andacollo te encanta"`, subtítulo `"Tierra minera, religiosa y astronómica"`, botón primario dorado/naranja `"Comenzar"` (que despliega el acceso/registro) y botón secundario con borde `"Explorar sin cuenta"`.
- **FR-006 (Mínimo 5 Registros Reales de Andacollo por Categoría y Opción)**: La base de datos (datos semilla y catálogo activo) MUST contener como mínimo **5 registros reales y verificables de Andacollo** con sus respectivas fotografías, coordenadas geográficas reales dentro de la comuna y datos completos en cada una de las siguientes entidades y opciones:
  - **Sitios Turísticos / Lugares (mínimo 5 por pilar y al menos 10-12 en total cubriendo las categorías del explorador)**: Basílica Menor Nuestra Señora del Rosario de Andacollo (Templo Grande), Iglesia Parroquial / Templo Chico, Observatorio Turístico Collowara, Museo Histórico y Religioso de Andacollo (Museo de Ofrendas), Mirador El Toro, Mina Escuela / Parque Minero Churrumata, Trapiches Coloniales y Lavaderos de Oro de Andacollo, Cerro El Curque / Ruta de Petroglifos, Quebrada y Oasis de El Manzano / Chepiquilla, Plaza de Armas y Casa Encuentro Ciudadano.
  - **Restaurantes y Gastronomía Local (mínimo 5)**: Establecimientos reales y tradicionales de Andacollo (cocinerías típicas de cabrito al jugo y cazuelas, restaurantes del centro histórico y Boulevard, cafés y salones de té patrimoniales, asadurías solares/regionales) con direcciones, rangos de precio y especialidades reales.
  - **Alojamientos y Hospedajes (mínimo 5)**: Opciones reales de hospedaje en Andacollo (hoteles locales en el centro y acceso norte, hostales patrimoniales, cabañas familiares en sectores altos y domos/alojamientos de observación astronómica) con precios por noche en CLP y servicios reales.
  - **Eventos y Festividades (mínimo 5)**: Fiesta Grande de Nuestra Señora de Andacollo (23 al 27 de diciembre), Fiesta Chica de Andacollo (primer domingo de octubre), Festival de las Estrellas / Cumbre Astroturística de Andacollo, Aniversario Comunal y Feria Costumbrista y Gastronómica del Valle, Día del Minero en Andacollo (San Lorenzo, agosto).
  - **Experiencias Locales y Tours (mínimo 5)**: Tour Astronómico Nocturno en Collowara, Ruta del Oro y Pirquineros en Churrumata, Cabalgata Patrimonial por los Cerros de Andacollo, Taller y Degustación de Gastronomía Caprina y Pisco del Limarí/Elqui, Trekking Guiado y Fotografía Nocturna en Mirador El Toro.
  - **Puntos y Recursos de Turismo Astronómico (mínimo 5 puntos de observación + 5 recursos/eventos celestes)**: Observatorio Collowara, Mirador Astronómico El Toro, Explanada Cerro El Curque, Sector Pan de Azúcar / Camino Alto Andacollo, Mirador Cruz Verde, junto con condiciones reales del cielo de Andacollo (más de 300 noches despejadas al año).
  - **Rutas del Planificador, Recomendaciones e Insignias de Gamificación (mínimo 5 en cada uno)**: Al menos 5 itinerarios completos con paradas reales, 5 recomendaciones contextuales destacadas y 5 insignias culturales/patrimoniales desbloqueables.
- **FR-007 (Calidad Fotográfica y Respaldo Visual)**: Todos los registros MUST contar con fotografías reales o altamente fieles a la arquitectura, paisaje semiárido, cielos estrellados, minería y gastronomía de Andacollo, garantizando que el 100% de las imágenes carguen correctamente y cuenten con un mecanismo automático de imagen de respaldo (`fallback`) para que nunca se muestre un icono de imagen rota.

### Key Entities *(include if feature involves data)*

- **Activo de Marca e Iconografía (`Logo` / `IconSet`)**: Representación visual del nuevo logotipo oficial de ThakiGo y colección estructurada de iconos vectoriales reutilizables por nombre semántico (categorías, navegación, acciones, estado del cielo, logros y métricas).
- **Punto de Interés Turístico (`lugares`)**: Atractivos reales de Andacollo clasificados en las categorías del Explorador (`Cultura`, `Gastronomía`, `Astronomía`, `Naturaleza`, `Religión`, `Minería`, `Trekking`, `Fotografía`), con coordenadas reales, horario, tiempo estimado de visita, teléfono/contacto, calificación, cantidad de reseñas y fotografía verificada.
- **Servicio Gastronómico (`restaurantes`)**: Restaurantes y cocinerías reales de Andacollo con especialidad culinaria, dirección, coordenadas para el mapa, horario de atención, rango de precios y fotografía.
- **Servicio de Hospedaje (`alojamientos`)**: Hoteles, hostales y cabañas reales de Andacollo con tarifa referencial en CLP, equipamiento, ubicación geográfica, calificación y fotografía.
- **Festividad o Evento (`eventos`)**: Celebraciones oficiales y culturales de Andacollo con fechas anuales, ubicación, categoría, resumen y capacidad de guardarse en `"Mis eventos"`.
- **Experiencia Reservable (`experiencias`)**: Actividades guiadas en Andacollo clasificadas en `Tours`, `Gastronomía` y `Aventura` con precio en CLP, duración, calificación y fotografía.
- **Métricas del Dashboard Municipal (`estadisticas_municipales`)**: Indicadores agregados de visitantes diarios, ranking de lugares más visitados (Basílica Menor, Observatorio Collowara, Museo de Ofrendas, etc.), tiempo promedio de visita, serie de flujo horario, distribución de procedencia e intereses principales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Volumen de Datos Reales)**: El 100% de las categorías y módulos de la plataforma (`Lugares`, `Restaurantes`, `Alojamientos`, `Eventos`, `Experiencias`, `Puntos Astronómicos`, `Rutas del Planificador` e `Insignias de Gamificación`) cuentan con al menos **5 registros reales de Andacollo** almacenados en la base de datos y visibles en la interfaz, con 0 enlaces de imágenes rotos.
- **SC-002 (Erradicación de Emojis y Estilos Sintéticos)**: El 0% de los botones, barras de navegación, chips de categorías, acciones de lugar, paneles de astronomía o menús laterales utilizan emojis de sistema; el 100% emplea iconos vectoriales uniformes y el nuevo logotipo oficial de `/design`.
- **SC-003 (Adaptabilidad Móvil y Web)**: En pantallas móviles (`<= 768px`), el usuario puede acceder a las 5 secciones principales (`Inicio`, `Explorar`, `Mapa`, `Favoritos`, `Perfil`) en 1 solo toque desde la barra de navegación inferior fija sin desbordamientos horizontales ni solapamiento de contenido; en escritorio (`> 768px`), las vistas aprovechan el ancho disponible con navegación superior y grillas multi-columna.
- **SC-004 (Alineación con Mockups)**: Las 14 vistas representadas en la carpeta `/design` conservan su estructura de bloques, jerarquía de información, modo de color (claro u oscuro según la lámina) y acciones interactivas especificadas en los mockups de referencia.

## Assumptions

- Para cumplir con la regla del proyecto en `AGENTS.md` y la Constitución de no añadir dependencias externas innecesarias de UI, la librería de iconografía gratuita y profesional (basada en trazos vectoriales limpios tipo Lucide / Tabler Icons) se integrará mediante un componente de iconos vectoriales SVG propio y ligero dentro del proyecto, evitando instalar paquetes pesados de terceros y asegurando control total sobre el grosor de trazo, tamaño en `rem` y color.
- El archivo de imagen `/design/ChatGPT Image Jun 2, 2026, 03_42_10 PM.png` es el nuevo logotipo oficial proporcionado por el usuario y se copiará/servirá como activo estático optimizado de la aplicación para su uso en todas las cabeceras, login y panel administrativo.
- Todas las coordenadas geográficas de los datos semilla corresponderán al radio urbano y rural real de la comuna de Andacollo (en torno a `-30.2333` de latitud y `-71.0833` de longitud) para que el mapa interactivo y las distancias reflejen ubicaciones auténticas.
