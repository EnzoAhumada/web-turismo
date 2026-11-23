# Implementation Plan: Rediseño Visual Profesional, Navegación Adaptativa y Catálogo Real de Andacollo

**Branch**: `002-professional-ui-real-data` | **Date**: 2026-11-20 | **Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/spec.md)

**Input**: Feature specification from `/specs/002-professional-ui-real-data/spec.md`

## Summary

Elevar la calidad visual, ergonómica y de contenido de **ThakiGo Andacollo** para alcanzar un estándar comercial y profesional fiel a las 14 láminas de `/design` y a patrones probados de aplicaciones líderes como Airbnb:
1. **Nuevo Logotipo e Identidad Visual**: Incorporar el nuevo logotipo oficial (`/design/ChatGPT Image Jun 2, 2026, 03_42_10 PM.png` → `/public/logo-thakigo.png`) mediante el componente reutilizable `<BrandLogo />` en cabecera, login, vistas móviles, panel municipal y favicon.
2. **Iconografía Vectorial Profesional (Cero Emojis)**: Reemplazar el 100% de los emojis y símbolos genéricos por un sistema de iconografía vectorial SVG propio (`<Icon />`) basado en trazos limpios de código abierto (Lucide/Tabler), sin añadir dependencias externas.
3. **Diseño Adaptativo Web/Móvil (Inspirado en Airbnb y `/design`)**: Implementar la barra de navegación inferior fija en móvil (`<BottomNav />` con `Inicio`, `Explorar`, `Mapa`, `Favoritos`, `Perfil`), hojas inferiores (`bottom sheets`) en Mapa y Perfil de Lugar, y grillas/cabeceras web proporcionadas en escritorio, respetando fielmente los temas claros y oscuros de las 14 pantallas de `/design`.
4. **Catálogo Real de Andacollo (Mínimo 5 Registros por Categoría)**: Ampliar el esquema y poblar `supabase/seed.sql` con información real, fotografías verificadas (con respaldo automático `fallback`), coordenadas reales y precios en CLP, asegurando al menos 5 a 12 registros reales en cada entidad (`lugares`, `restaurantes`, `alojamientos`, `eventos`, `experiencias`, puntos astronómicos, condiciones/horarios/recursos astronómicos, insignias, desafíos, rutas del planificador y estadísticas del Dashboard Municipal).

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5 semántico, CSS3 nativo (`1rem = 10px`)  
**Primary Dependencies**: React `^18.3.1`, React Router DOM `^6.26.2`, `@supabase/supabase-js` `^2.112.3`, Vite `^5.4.1` (Cero librerías externas adicionales de UI o iconos)  
**Storage**: Supabase (PostgreSQL 17 local/remoto con migraciones SQL y `seed.sql` idempotente)  
**Testing**: Validación de compilación (`npm run build`), verificación de esquema y seeders (`npm run db:reset`), y pruebas funcionales/responsivas en navegador según `quickstart.md`  
**Target Platform**: Web moderna multiplataforma (Escritorio, Tablet y Móvil con diseño adaptativo Mobile-First)  
**Project Type**: Single-Page Web Application (SPA) con Backend-as-a-Service (Supabase)  
**Performance Goals**: Renderizado instantáneo de iconografía vectorial inline (`0ms` de latencia de fuentes externas), carga progresiva de imágenes con contenedor de relación de aspecto fija (`CLS < 0.05`) y navegación fluida a `60fps`  
**Constraints**:
- Prohibido añadir paquetes npm externos fuera del stack aprobado.
- Prohibido usar `alert()`, `confirm()`, `prompt()` o `innerHTML`.
- Todos los textos visibles íntegramente en español.
- Uso estricto de unidades `rem` con base `10px` y paleta oficial (`#071B3A`, `#031126`, `#FFB800`, `#FF9D00`, `#FFFFFF`, `#F5F7FA`).  
**Scale/Scope**: 19 módulos de páginas de viajero + 5 páginas de administración municipal, 18 tablas en base de datos con más de 80 registros reales de Andacollo sembrados por defecto.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio de la Constitución | Estado Pre-Diseño | Estado Post-Diseño | Evidencia / Verificación |
| :--- | :---: | :---: | :--- |
| **I. Identidad Territorial y Enfoque Turístico Local (Andacollo y IV Región)** | ✅ PASS | ✅ PASS | El catálogo semilla incorpora `>= 5` a `12` atractivos reales de Andacollo por categoría (Basílica Menor, Templo Chico, Observatorio Collowara, Churrumata, Mirador El Toro, gastronomía caprina, festividades y hospedajes reales). |
| **II. Experiencia Inspirada en TripAdvisor y Descubrimiento Integral** | ✅ PASS | ✅ PASS | Fichas con fotografías reales, calificación promedio con conteo de reseñas (`4.8 (120 reseñas)`), filtros populares (`Cerca de mí`, `Gratis`, `Familiar`, `Abierto ahora`), horarios y precios en CLP. |
| **III. Experiencia Multiplataforma (Web y Móvil) y Diseño Responsivo** | ✅ PASS | ✅ PASS | Se añade `<BottomNav />` fijo en móvil al estilo Airbnb/mockups y cabecera/grillas multi-columna en escritorio con CSS Grid y Flexbox nativos. |
| **IV. Sistema de Diseño, Paleta de Colores y Tipografía Escalable** | ✅ PASS | ✅ PASS | Respeta estrictamente la paleta oficial (`Primary`, `Navy`, `Gold`, `Orange`, `White`, `Soft`) y medidas en `rem` con `html { font-size: 10px; }`. |
| **V. Seguridad del DOM, Feedback Visual Nativo y Rutas Protegidas** | ✅ PASS | ✅ PASS | Cero uso de `innerHTML` o diálogos nativos; todos los eventos `submit`/`click` previenen el comportamiento por defecto y las rutas siguen protegidas por `ProtectedRoute` y `AdminRoute`. |
| **VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio** | ✅ PASS | ✅ PASS | La iconografía vectorial profesional se implementa mediante un componente SVG nativo `<Icon />` en React sin instalar dependencias externas, y el 100% de la interfaz está en español. |

## Project Structure

### Documentation (this feature)

```text
specs/002-professional-ui-real-data/
├── plan.md              # Este archivo (plan de implementación)
├── research.md          # Decisiones de diseño, iconografía, navegación y catálogo real
├── data-model.md        # Evolución del esquema SQL y catálogo de datos reales (mínimo 5 por opción)
├── quickstart.md        # Guía de ejecución y validación end-to-end
├── contracts/
│   └── ui-design-system.md  # Contratos de BrandLogo, Icon, BottomNav y las 14 vistas de /design
└── tasks.md             # Lista de tareas ordenadas (se genera con /speckit-tasks)
```

### Source Code (repository root)

```text
public/
├── logo-thakigo.png         # Nuevo logotipo oficial copiado desde /design
├── favicon.svg              # Favicon vectorial actualizado con la identidad de montañas, sol y estrellas
└── fallback-andacollo.svg   # Imagen de respaldo local para fotografías

supabase/
├── config.toml
├── migrations/
│   ├── 20261120000001_initial_schema.sql
│   └── 20261120000002_professional_ui_and_real_data.sql  # Nueva migración incremental
└── seed.sql                 # Catálogo real de Andacollo con >= 5 registros por categoría e iconos vectoriales

src/
├── components/
│   ├── layout/
│   │   ├── Header/          # Cabecera web profesional con BrandLogo y buscador estilo Airbnb
│   │   ├── BottomNav/       # NUEVO: Barra de navegación inferior móvil (5 destinos de /design)
│   │   ├── Footer/          # Pie de página con BrandLogo e iconos vectoriales
│   │   ├── AdminSidebar/    # Barra lateral oscura municipal con BrandLogo
│   │   └── DetailLayout/    # Ficha de lugar/entidad fiel a "4 perfil del lugar.jpg"
│   ├── ui/
│   │   ├── BrandLogo/       # NUEVO: Componente oficial del logotipo ThakiGo
│   │   ├── Icon/            # NUEVO: Librería de iconografía vectorial SVG profesional (Lucide/Tabler)
│   │   ├── SmartImage/      # NUEVO: Imagen con proporción controlada y fallback automático
│   │   ├── CategoryIcon/    # Círculos de categoría vectoriales fieles a "3 explorador turistico.jpg"
│   │   ├── Card/            # Tarjetas estilo Airbnb / Mockup con foto, rating, distancia y badge
│   │   ├── SearchBar/       # Buscador tipo píldora con icono vectorial
│   │   ├── FilterTabs/      # Pestañas y chips con iconos vectoriales
│   │   └── ...
├── pages/
│   ├── LandingPage/         # Rediseño fiel a "14 login.jpg" (portada nocturna + modal/card de acceso)
│   ├── HomePage/            # Rediseño fiel a "1 inicio inteligente.jpg"
│   ├── ExplorerPage/        # Rediseño fiel a "3 explorador turistico.jpg" (10 categorías + filtros populares)
│   ├── MapPage/             # Rediseño fiel a "2 mapa interactivo.jpg" (mapa visual + tarjeta flotante)
│   ├── PlaceDetailPage/     # Rediseño fiel a "4 perfil del lugar.jpg" (4 acciones + tiempo estimado)
│   ├── RecommendationsPage/ # Rediseño fiel a "5 recomendaciones de ia.jpg"
│   ├── TripPlannerPage/     # Rediseño fiel a "6 planificador de viajes.jpg"
│   ├── FavoritesPage/       # Rediseño fiel a "7 sistema de favoritos.jpg"
│   ├── AstronomyPage/       # Rediseño fiel a "8 turismo astronomico.jpg" (modo oscuro Navy)
│   ├── EventsPage/          # Rediseño fiel a "9 eventos y festividades.jpg" (con guardado bookmark)
│   ├── GamificationPage/    # Rediseño fiel a "10 gamificacion.jpg" (medallas vectoriales + cabecera oscura)
│   ├── ExperiencesPage/     # Rediseño fiel a "11 experiencias locales.jpg"
│   ├── ProfilePage/         # Rediseño fiel a "12 perfil del usuario.jpg" (modo oscuro Navy + preferencias)
│   ├── RestaurantsPage/     # Catálogo gastronómico con >= 6 restaurantes reales
│   ├── AccommodationsPage/  # Catálogo de hospedajes con >= 6 alojamientos reales
│   └── admin/
│       └── DashboardPage/   # Rediseño fiel a "13 dashboard municipal.jpg" (gráficos SVG + KPIs + CRUD)
├── services/                # Servicios de datos actualizados para nuevos campos y estadísticas municipales
├── hooks/                   # Hooks actualizados con soporte de filtros populares y guardado de eventos
└── styles/
    ├── variables.css        # Tokens actualizados (--bottom-nav-h, sombras refinadas, colores de categorías)
    └── global.css           # Utilidades responsivas web/móvil y espaciado seguro para BottomNav
```

**Structure Decision**: Se preserva y potencia la arquitectura modular por páginas (`UI / Hooks / Services`) implementada en la iteración anterior, añadiendo los componentes transversales de sistema de diseño (`BrandLogo`, `Icon`, `SmartImage`, `BottomNav`) y la migración/seeder de datos reales de Andacollo en `supabase/`.

## Complexity Tracking

> **Sin violaciones a la Constitución.** No se requieren excepciones ni dependencias adicionales.
