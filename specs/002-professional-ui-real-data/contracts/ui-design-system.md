# UI, Navigation & Visual System Contracts: ThakiGo Andacollo

**Feature**: `002-professional-ui-real-data`  
**Date**: 2026-11-20  
**Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/spec.md)

---

## 1. Contrato de Identidad Visual y Marca (`<BrandLogo />`)

- **Ubicación**: `src/components/ui/BrandLogo/`
- **Activo fuente**: `/design/ChatGPT Image Jun 2, 2026, 03_42_10 PM.png` copiado a `/public/logo-thakigo.png`.
- **Props**:
  - `size`: `'sm'` (`2.8rem`), `'md'` (`3.6rem`), `'lg'` (`6.4rem`, portada Login)
  - `variant`: `'dark'` (texto `Thaki` blanco + `Go` dorado `#FFB800`) | `'light'` (texto `Thaki` azul `#071B3A` + `Go` dorado `#FFB800`)
  - `stacked`: `boolean` (en `LandingPage` muestra el isotipo arriba y `ThakiGo` debajo, tal como en `14 login.jpg`; en `Header` y `AdminSidebar` lo muestra en línea horizontal tal como en `13 dashboard municipal.jpg`).

---

## 2. Contrato de Iconografía Vectorial (`<Icon />`)

- **Ubicación**: `src/components/ui/Icon/`
- **Estándar**: Trazos SVG `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth={1.85}`, `strokeLinecap="round"`, `strokeLinejoin="round"`.
- **Catálogo de Iconos Soportados**:
  - **Navegación Inferior y Cabecera**: `home`, `search`, `compass`, `map`, `map-pin`, `heart`, `bookmark`, `bag`, `user`, `bell`, `menu`, `x`, `chevron-left`, `chevron-right`, `arrow-left`, `arrow-right`, `log-out`, `settings`, `globe`, `wifi-off`, `shield`.
  - **Categorías Turísticas (Mockup 3 y 6)**: `landmark` (Cultura), `utensils` (Gastronomía), `moon-star` (Astronomía), `trees` (Naturaleza), `church` (Religión), `pickaxe` (Minería), `mountain` (Trekking / Aventura), `camera` (Fotografía), `calendar` (Eventos), `grid` (Otros).
  - **Acciones de Ficha de Lugar (Mockup 4)**: `navigation` (Cómo llegar), `phone` (Llamar), `bookmark` (Guardar), `share` (Compartir), `clock` (Horario / Tiempo estimado).
  - **Astronomía y Clima (Mockups 5 y 8)**: `sun` (Cielo despejado), `eye` (Visibilidad), `moon` (Fase lunar), `thermometer` (Temperatura), `sparkles` (Destacado / Estrellas), `telescope` (Observación), `lightbulb` (Consejo), `shirt` (Ropa abrigada), `smartphone` (App estelar), `flashlight` (Linterna roja).
  - **Gamificación y Dashboard (Mockups 10, 12 y 13)**: `award` (Logro / Medalla), `trophy` (Ranking), `route` (Rutas completadas), `lock` (Insignia bloqueada), `check-circle` (Completado), `trending-up` (Crecimiento KPI), `users` (Visitantes), `bar-chart` (Reportes), `plus` (Crear).
- **Regla de Retrocompatibilidad**: Si `<Icon name={val} />` recibe un valor no registrado o un código legado, lo traduce mediante un diccionario de alias o renderiza el icono vectorial `compass` / `map-pin` por defecto, garantizando **0 emojis** en el DOM.

---

## 3. Contrato de Navegación Adaptativa (Inspiración Airbnb + Mockups `/design`)

### 3.1 Barra de Navegación Inferior Móvil (`<BottomNav />`)
- **Ubicación**: `src/components/layout/BottomNav/`
- **Visibilidad**: Visible en resoluciones móviles y tablets verticales (`@media (max-width: 48rem)` / `768px`) en todas las vistas públicas y de viajero (oculta únicamente en `/admin/*` y en la portada `/`).
- **Ítems Fijos (5 destinos según mockups 1, 2, 3, 7, 10, 11, 12)**:
  1. `Inicio` → `/inicio` (si está autenticado) o `/explorar` / `/` (icono `home`)
  2. `Explorar` → `/explorar` (icono `search`)
  3. `Mapa` → `/mapa` (icono `map-pin`)
  4. `Favoritos` → `/favoritos` (icono `heart`)
  5. `Perfil` → `/perfil` (icono `user`)
- **Estados**: El ítem activo resalta su icono y etiqueta con `var(--color-orange)` / `var(--color-gold)` sobre fondo blanco (en vistas claras) o fondo `var(--color-navy)` con borde sutil superior (en vistas oscuras como `Perfil` y `Astronomía`).

### 3.2 Cabecera Superior Adaptativa (`<Header />`)
- **En Escritorio (`> 48rem`)**:
  - Muestra `<BrandLogo />` a la izquierda.
  - Navegación central limpia con píldoras/enlaces (`Inicio`, `Explorar`, `Mapa`, `Gastronomía`, `Alojamientos`, `Eventos`, `Experiencias`, `Astronomía`, `Planificador`).
  - Acciones a la derecha: acceso directo a `Favoritos`, `Gamificación` y menú de perfil o botón `"Ingresar"`.
- **En Móvil (`<= 48rem`)**:
  - Compacta y contextual sin menú hamburguesa invasivo (ya que la navegación principal vive en `<BottomNav />`), mostrando `<BrandLogo size="sm" />` y accesos rápidos a `Planificador`, `Astronomía` o `Perfil`.

---

## 4. Contrato Visual por Pantalla (Alineación con `/design`)

| Lámina en `/design` | Ruta en la App | Contrato de Interfaz y Componentes Clave |
| :--- | :--- | :--- |
| `1 inicio inteligente.jpg` | `/inicio` | Fondo claro `Soft`, cabecera con saludo `"¡Hola, {Nombre}!"` + icono vectorial `bag`, `<SearchBar />` tipo píldora, tarjeta hero de `Santuario de Andacollo` con rating y reseñas, grilla `"Recomendado para ti"` y accesos a módulos con iconos vectoriales. |
| `2 mapa interactivo.jpg` | `/mapa` | Buscador flotante con botón `x`, chips (`Lugares`, `Restaurantes`, `Hospedajes`, `Rutas`), mapa interactivo visual de Andacollo con calles/sectores estilizados, pines de colores por categoría, punto azul central, botones circulares de brújula y tarjeta flotante inferior del lugar seleccionado. |
| `3 explorador turistico.jpg` | `/explorar` | Buscador `"¿Qué quieres descubrir?"`, cuadrícula de **10 iconos circulares de categoría** (`Cultura`, `Gastronomía`, `Astronomía`, `Naturaleza`, `Religión`, `Minería`, `Trekking`, `Fotografía`, `Eventos`, `Otros`), fila de `"Filtros populares"` (`Cerca de mí`, `Gratis`, `Familiar`, `Abierto ahora`), pestañas de tipo de contenido y grilla de `"Lugares destacados"`. |
| `4 perfil del lugar.jpg` | `/lugar/:id` (y detalles) | Fotografía hero superior con botones circulares flotantes (`Volver`, `Categoría/Guardar`), contenedor con bordes superiores redondeados (`2.4rem`), título, subtítulo, estrella + promedio + `(N reseñas)`, badge verde `"Abierto ahora"` + horario, fila de **4 botones de acción con icono circular** (`Cómo llegar`, `Llamar`, `Guardar`, `Compartir`), descripción y filas de `"Información"` con iconos (`Dirección`, `Tiempo estimado`, `Teléfono`). |
| `5 recomendaciones de ia.jpg` | `/recomendaciones` | Título con icono vectorial `sparkles`, banner nocturno `"¡Cielo despejado esta noche!"` con luna creciente e botón naranja `"Ver ruta astronómica"`, tarjetas verticales en `"Te puede interesar"` y filas horizontales compactas en `"Otras recomendaciones"`. |
| `6 planificador de viajes.jpg` | `/planificador` | Píldoras de `"Tiempo disponible"`, iconos circulares seleccionables en `"Intereses"`, píldoras de `"Presupuesto"` y botón principal `"Generar mi ruta"` que despliega la línea de tiempo con paradas reales de Andacollo. |
| `7 sistema de favoritos.jpg` | `/favoritos` | Pestañas con indicador inferior (`Lugares`, `Rutas`, `Experiencias` + `Restaurantes`, `Alojamientos`) y tarjetas horizontales con foto cuadrada redondeada, título, rating, distancia en km y botón de corazón rojo. |
| `8 turismo astronomico.jpg` | `/astronomia` | Tema oscuro (`Navy`), tarjeta oscura `"Condiciones actuales"` con 3 indicadores principales con iconos vectoriales finos (`Cielo Despejado`, `Visibilidad Excelente`, `Luna Creciente 35%`), barra `"Mejores horarios"` (`20:00 – 02:00`) y tarjetas horizontales oscuras de `"Lugares recomendados"`. |
| `9 eventos y festividades.jpg` | `/eventos` | Pestañas (`Próximos`, `Mis eventos`) y tarjetas horizontales con foto redondeada, título, fecha formateada, subtítulo temático y botón vectorial `bookmark` para guardar en `"Mis eventos"`. |
| `10 gamificacion.jpg` | `/gamificacion` | Cabecera oscura (`Navy`) con avatar circular, `"Explorador Thaki"`, nivel y barra de progreso dorada; cuerpo blanco redondeado con medallas circulares ilustradas en SVG (`Explorador`, `Ruta Minera`, `Cazador de Estrellas`, etc.), 3 bloques de `"Estadísticas"` (`Lugares visitados`, `Rutas completadas`, `Insignias`), desafíos activos y tabla de posiciones. |
| `11 experiencias locales.jpg` | `/experiencias` | Píldoras (`Todas`, `Tours`, `Gastronomía`, `Aventura`) y tarjetas con fotografía, título, precio en CLP (`$25.000 CLP`), duración, estrella con rating e icono vectorial de categoría. |
| `12 perfil del usuario.jpg` | `/perfil` | Tema oscuro (`Navy`), avatar circular centrado, nombre, `"Explorador nivel X"`, barra de progreso dorada + `"XP"`, filas de navegación con iconos (`Mis logros`, `Rutas completadas`, `Lugares visitados`) y bloque de preferencias (`Configuración` / editar perfil, `Idioma: Español`, switch `Modo offline` y cerrar sesión). |
| `13 dashboard municipal.jpg` | `/admin` | Sidebar oscuro con nuevo `<BrandLogo />` y menú vectorial; área principal `"Resumen turístico – Andacollo"` con tarjetas de KPIs (`Visitantes hoy 1.248`, ranking `Lugares más visitados`, `Tiempo promedio de visita 2h 15m` + `4.8 Excelentes reseñas`), gráfico SVG de línea `"Flujo de visitantes"`, gráfico SVG de anillo `"Procedencia de visitantes"`, barras de `"Intereses principales"` y accesos a CRUD de Lugares, Restaurantes, Alojamientos y Eventos. |
| `14 login.jpg` | `/` | Fondo fotográfico nocturno de la Basílica de Andacollo bajo cielo estrellado, nuevo `<BrandLogo size="lg" stacked />`, lema `"Explora tu próximo camino"`, titular `"Andacollo te encanta"` con corazón vectorial dorado, subtítulo `"Tierra minera, religiosa y astronómica."`, botón dorado `"Comenzar"` (que despliega el formulario de acceso/registro) y botón con borde `"Explorar sin cuenta"`. |
