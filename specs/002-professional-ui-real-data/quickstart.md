# Quickstart & Validation Guide: Rediseño Visual Profesional y Catálogo Real de Andacollo

**Feature**: `002-professional-ui-real-data`  
**Date**: 2026-11-20  
**Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/spec.md)

---

## 1. Requisitos Previos

- Node.js `>= 18` y npm instalados.
- Supabase CLI disponible (`npx supabase --version`) y Docker activo para base de datos local, o conexión a instancia de Supabase configurada en `.env`.

---

## 2. Comandos de Puesta en Marcha y Actualización de Datos

1. **Aplicar migraciones y cargar el catálogo real de Andacollo (mínimo 5 registros por categoría)**:
   ```bash
   npm run db:reset
   ```
   *(Este comando aplica `20261120000001_initial_schema.sql`, `20261120000002_professional_ui_and_real_data.sql` y ejecuta `supabase/seed.sql`).*

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Verificar compilación de producción sin errores**:
   ```bash
   npm run build
   ```

---

## 3. Escenarios de Validación End-to-End

### Escenario 1: Nuevo Logotipo Oficial e Iconografía Vectorial (Cero Emojis)
1. Abrir `/` (Bienvenida / Login), `/inicio`, `/explorar` y `/admin`.
2. **Resultado esperado**:
   - Se visualiza el nuevo logotipo oficial (`/logo-thakigo.png`, montañas con camino, sol y estrellas) junto a la marca `ThakiGo`.
   - Ninguna pantalla, botón, chip de categoría, tarjeta de condición astronómica ni insignia muestra emojis de texto Unicode; todos los iconos son trazos vectoriales SVG limpios y uniformes.

### Escenario 2: Navegación Adaptativa Móvil (Estilo Airbnb) y Web
1. Abrir las herramientas de desarrollo del navegador y activar la vista móvil (`375px x 812px`).
2. Navegar entre `Inicio`, `Explorar`, `Mapa`, `Favoritos` y `Perfil` desde la barra de navegación fija en la parte inferior (`<BottomNav />`).
3. Cambiar a vista de escritorio (`1280px x 800px`).
4. **Resultado esperado**:
   - En móvil, la barra inferior permanece fija con 5 iconos vectoriales y etiquetas en español, sin tapar botones ni tarjetas inferiores.
   - En escritorio, la barra inferior se oculta y se muestra la cabecera superior completa con grillas multi-columna proporcionadas.

### Escenario 3: Verificación de Mínimo 5 Datos Reales de Andacollo por Opción
1. Navegar por cada sección del Explorador y módulos temáticos:
   - **Lugares / Sitios Turísticos** (`/explorar?tab=lugares`): Verificar `>= 12` sitios reales de Andacollo (Basílica Menor, Templo Chico, Observatorio Collowara, Mirador El Toro, Museo de Ofrendas, Parque Minero Churrumata, etc.).
   - **Restaurantes** (`/restaurantes` o `/explorar?tab=restaurantes`): Verificar `>= 6` establecimientos gastronómicos reales con fotografías y horarios.
   - **Alojamientos** (`/alojamientos` o `/explorar?tab=alojamientos`): Verificar `>= 6` hospedajes reales con precios en CLP.
   - **Eventos** (`/eventos`): Verificar `>= 6` festividades reales de Andacollo y probar guardar un evento en `"Mis eventos"` con el icono `bookmark`.
   - **Experiencias** (`/experiencias`): Verificar `>= 6` tours y actividades reales con precios en CLP y filtros (`Todas`, `Tours`, `Gastronomía`, `Aventura`).
   - **Turismo Astronómico** (`/astronomia`): Verificar modo oscuro (`Navy`), condiciones actuales con iconos vectoriales, horarios y `>= 5` puntos reales de observación astronómica en Andacollo.
   - **Dashboard Municipal** (`/admin`): Verificar el resumen turístico de Andacollo con métricas, ranking de lugares más visitados, gráfico de flujo de visitantes, gráfico de anillo de procedencia y barras de intereses principales, además del CRUD funcional.
