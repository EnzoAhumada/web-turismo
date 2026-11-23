# Phase 0 Research: Rediseño Visual Profesional, Navegación Adaptativa y Catálogo Real de Andacollo

**Feature**: `002-professional-ui-real-data`  
**Date**: 2026-11-20  
**Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/spec.md)

---

## 1. Integración del Nuevo Logotipo Oficial de ThakiGo

- **Decision**: Copiar y servir el activo de marca ubicado en `/design/ChatGPT Image Jun 2, 2026, 03_42_10 PM.png` como `/public/logo-thakigo.png` (y actualizar `/public/favicon.svg` / `index.html` con el isotipo de montañas, sendero, sol y estrellas), encapsulándolo en un componente reutilizable `<BrandLogo />` (`src/components/ui/BrandLogo/`).
- **Rationale**:
  - Actualmente `Header`, `LandingPage` y `AdminSidebar` utilizan un polígono amarillo genérico en SVG que no coincide con los mockups ni con el nuevo logo entregado por el usuario en `/design`.
  - Un componente `<BrandLogo variant="dark|light" size="sm|md|lg" showText={true|false} />` garantiza que el isotipo oficial y la tipografía `ThakiGo` ("Thaki" en blanco o azul primario y "Go" en dorado `#FFB800`) se presenten con proporciones exactas en la cabecera web, la vista móvil, la portada de Login (`14 login.jpg`) y la barra lateral del Dashboard Municipal (`13 dashboard municipal.jpg`).
- **Alternatives considered**:
  - *Mantener el SVG triangular actual*: Descartado porque incumple directamente el requisito explícito de cambiar el logo usando el recurso de `/design`.
  - *Importar directamente la ruta con espacios desde `/design`*: Descartado para producción porque Vite sirve estáticos limpios desde `public/` con nombres URL-safe (`logo-thakigo.png`), conservando intacto el archivo original en `/design`.

---

## 2. Sistema de Iconografía Vectorial Profesional sin Dependencias Externas

- **Decision**: Implementar un sistema de iconografía vectorial propio basado en la colección libre y de código abierto **Lucide / Tabler Icons** (licencia ISC/MIT) a través de un componente centralizado `<Icon name="..." size={20} strokeWidth={1.85} />` en `src/components/ui/Icon/`, y almacenar identificadores semánticos de iconos (ej. `'church'`, `'telescope'`, `'pickaxe'`, `'mountain'`, `'utensils'`, `'compass'`, `'camera'`, `'calendar'`, `'map-pin'`, `'sparkles'`, `'sun'`, `'eye'`, `'moon'`, `'award'`, `'shield-check'`) en la base de datos en lugar de emojis Unicode.
- **Rationale**:
  - La Constitución del proyecto (Principio VI) y `AGENTS.md` prohíben añadir dependencias externas fuera del stack aprobado (`React`, `React Router`, `@supabase/supabase-js`, `HTML5`, `CSS3`).
  - Los emojis de sistema (`⛪`, `🔭`, `⛏️`, `🍽️`, `🏨`, `🎉`, `🎯`, `👋`, `✨`, `🥇`) se renderizan de forma distinta en cada sistema operativo y dan aspecto de prototipo generado por IA.
  - Un diccionario curado de trazos vectoriales SVG de `24x24` con `stroke-linecap="round"` y `stroke-linejoin="round"` ofrece estética comercial idéntica a Airbnb y a los mockups de `/design`, además de incluir un mapeo retrocompatible por si algún registro antiguo contiene un nombre o código legado.
- **Alternatives considered**:
  - *Instalar paquetes npm como `lucide-react` o `react-icons`*: Descartado porque violaría la restricción estricta de `AGENTS.md` ("No añada dependencias externas").
  - *Cargar una fuente de iconos por CDN externo*: Descartado porque degrada el tiempo de carga en conexiones móviles rurales de Andacollo y puede fallar sin conexión.

---

## 3. Arquitectura de Navegación Adaptativa Web y Móvil (Inspiración Airbnb + Mockups `/design`)

- **Decision**:
  1. **En formato Móvil (`<= 768px` / `48rem`)**:
     - Incorporar un componente fijo inferior `<BottomNav />` (`src/components/layout/BottomNav/`) con los 5 destinos presentes en todas las láminas móviles de `/design`: `Inicio` (`/inicio`), `Explorar` (`/explorar`), `Mapa` (`/mapa`), `Favoritos` (`/favoritos`) y `Perfil` (`/perfil`).
     - Simplificar la barra superior en móvil para que no duplique enlaces ni muestre menú hamburguesa redundante, dejando cabeceras contextuales limpias (saludo y campana/bolsa en Inicio, botón de retroceso flotante en Perfil de Lugar, Astronomía, Eventos, Experiencias y Planificador).
     - Añadir padding inferior seguro (`padding-bottom: calc(var(--bottom-nav-h) + var(--space-6))`) en `.page-wrapper` y vistas de mapa para evitar solapamientos.
  2. **En formato Web de Escritorio (`> 768px`)**:
     - Mantener `<Header />` superior de diseño limpio y profesional con el nuevo `<BrandLogo />`, buscador rápido estilo píldora inspirado en Airbnb, navegación principal con indicadores activos suaves y menú de usuario/admin.
     - En páginas de catálogo (`Explorar`, `Restaurantes`, `Alojamientos`, `Experiencias`, `Eventos`), presentar una barra horizontal de categorías con iconos vectoriales y chips de filtro rápido (`Cerca de mí`, `Gratis`, `Familiar`, `Abierto ahora`) junto con grillas multi-columna de tarjetas con proporción fotográfica uniforme (`aspect-ratio: 4 / 3` o `16 / 10`), bordes redondeados (`1.6rem`) y micro-interacciones sutiles.
- **Rationale**:
  - Combina la ergonomía móvil de una sola mano (patrón Airbnb y mockups `1` a `12` de `/design`) con la riqueza visual de una aplicación web de escritorio sin romper el diseño original ni usar estilos artificiales.
- **Alternatives considered**:
  - *Usar solo menú hamburguesa en móvil*: Descartado porque contradice tanto la solicitud explícita del usuario ("barra de navegación abajo para el formato móvil") como los mockups de `/design`.

---

## 4. Alineación Visual con las 14 Láminas de `/design`

- **Decision**: Alinear la estructura visual y los temas cromáticos de cada página con su mockup correspondiente:
  - **Lámina 1 (`1 inicio inteligente.jpg`)**: Cabecera luminosa en fondo `Soft` (`#F5F7FA`) con saludo `"¡Hola, Viajero!"`, icono vectorial de notificación/viaje, buscador píldora `"Buscar lugares, rutas, experiencias..."`, tarjeta hero principal (`Santuario de Andacollo` con imagen a sangre, título, subtítulo y `4.8 (120 reseñas)`), y sección `"Recomendado para ti"` con tarjetas de bordes limpios.
  - **Lámina 2 (`2 mapa interactivo.jpg`)**: Buscador flotante superior `"Buscar en el mapa"`, chips de filtro (`Lugares`, `Restaurantes`, `Hospedajes`, `Rutas`), lienzo cartográfico estilizado de Andacollo con pines vectoriales por color de categoría, punto azul de ubicación central, botones circulares flotantes de brújula/centrado y tarjeta flotante inferior con miniatura, calificación y distancia en km.
  - **Lámina 3 (`3 explorador turistico.jpg`)**: Título `"Explorar"`, buscador `"¿Qué quieres descubrir?"`, grilla de **10 iconos circulares de categorías** (`Cultura`, `Gastronomía`, `Astronomía`, `Naturaleza`, `Religión`, `Minería`, `Trekking`, `Fotografía`, `Eventos`, `Otros`), fila de `"Filtros populares"` (`Cerca de mí`, `Gratis`, `Familiar`, `Abierto ahora`) y listado/grilla de `"Lugares destacados"` y pestañas de catálogo.
  - **Lámina 4 (`4 perfil del lugar.jpg`)**: Imagen superior inmersiva con botones circulares flotantes, hoja inferior (`bottom sheet` en móvil / panel principal en web) con bordes superiores redondeados (`2.4rem`), título, subtítulo, rating con número de reseñas, indicador verde `"Abierto ahora"` + horario, barra de **4 acciones con iconos vectoriales** (`Cómo llegar`, `Llamar`, `Guardar`, `Compartir`), descripción expandible y tabla de `"Información"` (`Dirección`, `Tiempo estimado`, `Teléfono`).
  - **Lámina 5 (`5 recomendaciones de ia.jpg`)**: Banner oscuro estelar `"¡Cielo despejado esta noche!"` con luna creciente vectorial y botón píldora naranja `"Ver ruta astronómica"`, grilla `"Te puede interesar"` y lista horizontal `"Otras recomendaciones"`.
  - **Lámina 6 (`6 planificador de viajes.jpg`)**: Selectores tipo píldora en verde/azul profundo para `"Tiempo disponible"` y `"Presupuesto"`, círculos seleccionables de `"Intereses"` con iconos vectoriales y botón principal `"Generar mi ruta"`.
  - **Lámina 7 (`7 sistema de favoritos.jpg`)**: Pestañas con subrayado activo (`Lugares`, `Rutas`, `Experiencias`) y tarjetas horizontales con foto cuadrada redondeada, título, estrella + rating, pin + distancia en km y corazón activo.
  - **Lámina 8 (`8 turismo astronomico.jpg`)**: Tema oscuro nocturno (`#031126`), tarjeta oscura de `"Condiciones actuales"` con 3 columnas separadas por líneas verticales sutiles e iconos vectoriales finos (`Cielo Despejado`, `Visibilidad Excelente`, `Luna Creciente 35%`), fila de `"Mejores horarios"` (`20:00 - 02:00`) y tarjetas horizontales de `"Lugares recomendados"`.
  - **Lámina 9 (`9 eventos y festividades.jpg`)**: Pestañas (`Próximos`, `Mis eventos`) y tarjetas horizontales con miniatura, título, rango de fechas, descripción breve y botón de marcador (`bookmark`) para guardar/quitar de `"Mis eventos"`.
  - **Lámina 10 (`10 gamificacion.jpg`)**: Cabecera oscura (`Navy`) con avatar circular, título `"Explorador Thaki"`, `"Nivel 3 – Viajero Experto"`, barra de progreso dorada, contenedor inferior blanco con bordes redondeados mostrando medallas vectoriales ilustradas (`Explorador`, `Ruta Minera`, `Cazador de Estrellas`, etc.) y 3 tarjetas de `"Estadísticas"` (`Lugares visitados`, `Rutas completadas`, `Insignias`).
  - **Lámina 11 (`11 experiencias locales.jpg`)**: Píldoras de filtro (`Todas`, `Tours`, `Gastronomía`, `Aventura`) y tarjetas horizontales/grilla con miniatura, título, precio formateado en CLP (`$25.000 CLP`), duración, estrella con calificación e icono vectorial de categoría.
  - **Lámina 12 (`12 perfil del usuario.jpg`)**: Diseño en modo oscuro elegante (`Navy`), avatar circular centrado con borde, nombre, `"Explorador nivel X"`, barra de progreso XP, lista de filas interactivas con iconos vectoriales y contadores (`Mis logros`, `Rutas completadas`, `Lugares visitados`) y bloque de ajustes (`Configuración` / edición de datos, `Idioma: Español`, switch interactivo de `Modo offline` y cierre de sesión).
  - **Lámina 13 (`13 dashboard municipal.jpg`)**: Barra lateral oscura con nuevo logo `ThakiGo`, título `"Resumen turístico – Andacollo"`, tarjetas blancas de resumen (`Visitantes hoy` con variación porcentual, ranking numerado de `Lugares más visitados`, `Tiempo promedio de visita` y calificación promedio), gráfico vectorial SVG de `"Flujo de visitantes"`, gráfico de anillo SVG de `"Procedencia de visitantes"`, barras de progreso de `"Intereses principales"` y acceso directo a la gestión CRUD de `Lugares`, `Restaurantes`, `Alojamientos` y `Eventos`.
  - **Lámina 14 (`14 login.jpg`)**: Fotografía nocturna de la Basílica Menor de Andacollo iluminada bajo cielo estrellado, nuevo logo `ThakiGo` centrado en la parte superior, lema `"Explora tu próximo camino"`, titular `"Andacollo te encanta"` con corazón vectorial dorado, subtítulo `"Tierra minera, religiosa y astronómica."`, botón primario dorado `"Comenzar"` (que abre el modal/tarjeta de inicio de sesión y registro) y botón secundario transparente con borde dorado `"Explorar sin cuenta"`.

---

## 5. Catálogo de Datos Reales de Andacollo (Mínimo 5 Registros por Categoría y Opción)

- **Decision**: Crear una segunda migración incremental (`supabase/migrations/20261120000002_professional_ui_and_real_data.sql`) que amplíe las columnas de detalle necesarias (ej. `resenas_count`, `tiempo_estimado`, `telefono`, `es_gratis`, `es_familiar`, `abierto_ahora`, nuevas categorías `fotografia`, `eventos`, `otros`, y tabla `estadisticas_municipales`) y actualizar `supabase/seed.sql` para poblar todas las entidades con **mínimo 5 a 12 registros reales de Andacollo**:
  1. **Categorías del Explorador (10 categorías)**: `Cultura`, `Gastronomía`, `Astronomía`, `Naturaleza`, `Religión`, `Minería`, `Trekking`, `Fotografía`, `Eventos`, `Otros`.
  2. **Sitios Turísticos / Lugares (`lugares` — 12 sitios reales de Andacollo, incluyendo >= 5 puntos astronómicos)**:
     - *Basílica Menor Nuestra Señora del Rosario de Andacollo (Templo Grande)* (`Religión`)
     - *Iglesia Parroquial San Miguel Arcángel (Templo Chico)* (`Religión`)
     - *Museo Histórico y Religioso de Andacollo (Museo de Ofrendas)* (`Cultura`)
     - *Casa del Encuentro Ciudadano y Sala Museográfica* (`Cultura`)
     - *Observatorio Turístico Collowara* (`Astronomía`, `es_astronomico: true`)
     - *Cumbre y Mirador Astronómico Cerro El Churqui* (`Astronomía`, `es_astronomico: true`)
     - *Mirador Natural y Astronómico El Toro* (`Naturaleza` / `Astronomía`, `es_astronomico: true`)
     - *Explanada Astronómica Cerro El Curque y Petroglifos* (`Fotografía` / `Astronomía`, `es_astronomico: true`)
     - *Mirador Cruz Verde y Balcón del Valle* (`Fotografía` / `Astronomía`, `es_astronomico: true`)
     - *Parque Minero y Trapiche Artesanal Churrumata* (`Minería`)
     - *Lavaderos de Oro y Ruta de Pirquineros del Culebrón* (`Minería`)
     - *Sendero Quebrada y Oasis de Chepiquilla / El Manzano* (`Trekking` / `Naturaleza`)
  3. **Restaurantes y Gastronomía (`restaurantes` — 6 establecimientos reales/tradicionales de Andacollo)**:
     - *Restaurante Tradicional El Valle (Av. Urmeneta)*
     - *La Picada del Pirquinero (Calle Colón)*
     - *Terraza Gastronómica Collowara & Sabores del Elqui*
     - *Cocinería Patrimonial Doña Rosa (Especialidad Cabrito al Jugo)*
     - *Café y Salón de Té El Peregrino (Plaza Videla)*
     - *Asaduría y Horno Solar Las Estrellas de Chepiquilla*
  4. **Alojamientos y Hospedajes (`alojamientos` — 6 hospedajes reales/representativos de Andacollo)**:
     - *Hostal Patrimonio Minero (Calle Quiteria Varas)*
     - *Cabañas Cielos de Collowara (Sector El Churqui)*
     - *Hostería Plaza del Peregrino (Plaza Videla)*
     - *Hotel Boutique Andacollo Real (Acceso Norte Ruta D-51)*
     - *Domos Astronómicos Valle del Oro (Sector Pan de Azúcar)*
     - *Residencial Familiar Los Maitenes de Andacollo (Calle Urmeneta)*
  5. **Eventos y Festividades (`eventos` — 6 eventos reales de Andacollo)**:
     - *Fiesta Grande de Nuestra Señora del Rosario de Andacollo (23 al 27 de diciembre)*
     - *Fiesta Chica de la Virgen de Andacollo (Primer domingo de octubre)*
     - *Festival de las Estrellas y Cumbre Astroturística en Collowara (Enero)*
     - *Feria Gastronómica y Costumbrista del Cabrito y Queso de Cabra (Febrero)*
     - *Celebración del Día del Minero de San Lorenzo en Andacollo (10 de agosto)*
     - *Maratón de Observación Messier y Equinoccio de Otoño en Mirador El Toro (Marzo)*
  6. **Experiencias Locales (`experiencias` — 6 experiencias reales)**:
     - *Tour Astronómico Nocturno y Astrofotografía en Collowara (`$25.000 CLP`)*
     - *Tour Minero Guiado: Ruta del Oro, Pirquineros y Trapiches en Churrumata (`$20.000 CLP`)*
     - *Cabalgata Patrimonial por el Valle y Cerros de Andacollo (`$30.000 CLP`)*
     - *Taller de Churrascas al Rescoldo y Cata de Queso de Cabra (`$15.000 CLP`)*
     - *Trekking Guiado y Fotografía al Atardecer en Mirador El Toro (`$18.000 CLP`)*
     - *Recorrido Patrimonial de Bailes Chinos y Campanarios del Santuario (`$12.000 CLP`)*
  7. **Módulos Complementarios (Mínimo 5 registros en cada uno)**:
     - *Condiciones Astronómicas (`astronomia_condiciones`)*: 5 indicadores (`Cielo Despejado`, `Visibilidad Excelente`, `Luna Creciente 35%`, `Temperatura 14°C`, `Noches despejadas 300+ al año`).
     - *Horarios Astronómicos (`astronomia_horarios`)*: 5 franjas horarias (`19:45 Crepúsculo`, `20:30 Inicio observación`, `22:00 Cenit Vía Láctea`, `00:30 Cielo profundo`, `02:00 Fin recomendado`).
     - *Recursos y Equipo Astronómico (`astronomia_recursos`)*: 6 recursos entre consejos y equipamiento.
     - *Destacados y Recomendaciones (`destacados_dia`)*: 5 recomendaciones contextuales de Andacollo.
     - *Insignias (`insignias`) y Desafíos (`desafios`)*: 6 insignias y 5 desafíos patrimoniales.
     - *Paradas de Rutas del Planificador (`rutas_paradas`)*: 10 paradas reales distribuidas entre las combinaciones de duración, intereses y presupuesto.
- **Rationale**: Supera el mínimo de 5 registros reales por cada opción solicitada, garantizando que cualquier filtro o pestaña tenga contenido verídico y rico en información de Andacollo.
