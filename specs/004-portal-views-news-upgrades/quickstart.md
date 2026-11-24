# Quickstart & Validation Guide

**Feature**: `004-portal-views-news-upgrades`  
**Date**: 2026-11-23

## Prerrequisitos

1. Node.js 18+ y dependencias instaladas (`npm install`).
2. Instancia de Supabase (local con `npm run db:start` o proyecto remoto configurado en `.env`).
3. Migraciones y datos semilla aplicados:
   ```bash
   npm run db:reset
   ```
   *(En entorno remoto: ejecutar la nueva migración `20261123000001_news_admin_profile_enhancements.sql` y el seed de noticias).*
4. Servidor de desarrollo activo:
   ```bash
   npm run dev
   ```

## Escenarios de Validación End-to-End

### 1. Filtro de Mapa en Modo Celular (US1)
1. Abrir `/mapa` en modo responsivo móvil (360×740 y 390×844).
2. Verificar que la barra de búsqueda ocupa el ancho limpio sin desbordamiento horizontal y que los chips de categoría (`Todos`, `Lugares`, `Restaurantes`, `Alojamientos`, `Rutas`) se desplazan horizontalmente en una sola línea.
3. Escribir `"Basílica"` y pulsar el botón limpiar (`X`): los marcadores se filtran y restauran sin bloquear el mapa.
4. Tocar un marcador: la tarjeta `.map-mobile-preview` aparece por encima de `BottomNav` sin quedar tapada.

### 2. Noticias de Andacollo en Inicio, Admin y Sincronización (US2)
1. Iniciar sesión e ir a `/inicio`: comprobar que la sección **"Noticias de Andacollo"** muestra las **10 noticias recientes precargadas** con imagen, título, resumen, fecha, fuente y lectura completa en modal.
2. Iniciar sesión como administrador, ir a `/admin/noticias`, crear una noticia de prueba, editarla y ocultarla: verificar reflejo inmediato en `/inicio` y confirmación visual sin `alert`/`confirm`.
3. Pulsar **"Sincronizar fuente local"** en `/admin/noticias`: verificar que incorpora noticias nuevas sin duplicar existentes o muestra aviso limpio en español usando respaldo local si no hay conexión externa.

### 3. Turismo Astronómico Administrable según Mockup (US3)
1. Abrir `/astronomia` y comparar con `design/8 turismo astronomico.jpg`: encabezado oscuro "Ruta Astronómica", tarjeta de "Condiciones actuales" (Cielo, Visibilidad, Luna + Mejores horarios) y lista de "Lugares recomendados".
2. Ir a `/admin/astronomia`, modificar un indicador de condición actual (por ejemplo, fase lunar) y guardar.
3. Volver a `/astronomia` y verificar que el nuevo valor se muestra inmediatamente desde la base de datos.

### 4. Experiencias Locales y Gestión en Admin (US4)
1. Abrir `/experiencias` y comparar con `design/11 experiencias locales.jpg`: filtros `Todas`, `Tours`, `Gastronomía`, `Aventura`, precio en CLP y calificación.
2. Ir a `/admin/experiencias`, crear una nueva experiencia y cambiar su disponibilidad.
3. Verificar reflejo inmediato en `/experiencias` y en `/experiencias/:id`.

### 5. Planificador de Viajes con Itinerario de Ejemplo (US5)
1. Abrir `/planificador`: comprobar que se muestra de inmediato un **Itinerario de ejemplo** estructurado en Mañana, Tarde y Noche combinando lugares, restaurantes, experiencias y eventos reales de Andacollo, con enlaces activos a cada ficha.
2. Cambiar duración a `2 – 3 días`, seleccionar intereses y presupuesto, y pulsar **"Generar mi ruta"**: verificar que genera un itinerario multi-día coherente.
3. Pulsar **"Marcar ruta completada"** y verificar confirmación visual y actualización de contador en `/perfil`.

### 6. Perfil y Logros-Ranking con Datos Reales (US6)
1. Abrir `/perfil`: verificar que muestra conteos reales de logros (`usuario_insignias`), rutas completadas, lugares visitados, favoritos recientes y posición en el ranking, sin números ficticios hardcodeados.
2. Editar nombre/ciudad y activar "Modo offline", recargar la página y confirmar que los cambios persisten.
3. Abrir `/gamificacion`: verificar nivel, barra XP, insignias ganadas vs bloqueadas, desafíos activos y tabla de posiciones real con el usuario autenticado resaltado.

## Verificación de Compilación

```bash
npm run build
```
Debe compilar sin errores ni advertencias críticas, sin nuevas dependencias externas en `package.json`.
