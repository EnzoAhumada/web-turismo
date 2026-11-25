# Quickstart & Validation Guide: Astroturismo, Reservas Adaptativas, Guías y Perfil

**Feature**: `006-astrotourism-bookings-guides`

## Prerrequisitos

1. Entorno Node.js con dependencias instaladas (`npm install`).
2. Instancia de Supabase (local o remota configurada en `.env`) con la nueva migración aplicada:
   ```bash
   npm run db:migrate
   # o para reiniciar con semillas actualizadas:
   npm run db:reset
   ```
3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Verificar compilación de producción sin errores:
   ```bash
   npm run build
   ```

## Escenarios de Validación End-to-End

### 1. Galería de Astrofotos (Menú "Fotografía")
1. Navegar a **Explorar** y hacer clic en la categoría **Fotografía** (o ir a `/fotografia`).
2. Confirmar que carga el encabezado con telemetría del cielo de Andacollo, 4 capturas precargadas del mockup y filtros por sector con contadores.
3. Filtrar por `Observatorio Collowara` y ordenar por `Más valoradas`; abrir el modal de detalle para verificar parámetros EXIF completos.
4. Con sesión iniciada, dar "Me gusta" a una foto, recargar la página y comprobar persistencia.
5. Hacer clic en **Subir Foto**, elegir una imagen local o escena de muestra, completar título/sector/EXIF y publicar; verificar que aparece al inicio de la galería y en **Mi Perfil**.

### 2. Módulo de Reservas en Observatorio Collowara
1. Abrir la ficha pública de **Observatorio Turístico Collowara** (`/lugar/20000000-0000-0000-0000-000000000002`).
2. Comprobar que muestra los destacados de infraestructura (Cúpula 14", 3 Terrazas, Anfiteatro, Planetario), galería ampliable, las 3 modalidades (Clásico, Astrofotografía, VIP) y los 3 bloques horarios (20:30, 22:00, 23:30) con cupos.
3. Seleccionar una modalidad, fecha futura, bloque horario y activar **Residente Andacollo (-20%)**; confirmar que el total en CLP se recalcula automáticamente.
4. Confirmar reserva con sesión iniciada → verificar emisión de código único `COL-2026-XXXX`, descuento inmediato de cupos y aparición en **Mis Pases**.
5. Probar **Copiar Código** (notificación visual) y **Cancelar Reserva** (modal estilizado + liberación de cupos).

### 3. Panel de Administración de Reservas (Multi-entidad y Perfiles Adaptativos)
1. Ingresar como administrador a `/admin/reservas`.
2. Verificar que **Observatorio Turístico Collowara** aparece activo con perfil `Tour / Visita por horario y cupos`, precio `Calculado` y confirmación `Inmediata`.
3. Seleccionar un **Restaurante** del catálogo, activar reservas con perfil `Mesa / Comida`, modo de precio `Sin costo / Consumo en local` y confirmación `Pendiente`, agregar bloques horarios (ej. 13:00, 20:30) y guardar.
4. Abrir la ficha pública de ese restaurante y comprobar que muestra el formulario adaptado (comensales, hora, notas/alergias, aviso sin costo) y que al reservar nace en estado `Pendiente`.
5. Volver a `/admin/reservas` → pestaña **Reservas Recibidas** y aprobar la reserva pendiente a `Confirmada`.

### 4. Guías Turísticos Certificados (Reemplaza "Otros")
1. En **Explorar** (y navegación), comprobar que la opción **Otros** fue reemplazada por **Guías Turísticos** (`/guias`).
2. Filtrar por especialidad (`Astrofotografía Guiada`) y buscar por idioma (`Inglés`).
3. Abrir **Ver Itinerario y Reservar** en un guía, revisar su itinerario paso a paso y enviar una solicitud de reserva directa.
4. Usar **+ Postular como Guía Local** para registrar un nuevo guía y verificar su gestión en `/admin/guias`.

### 5. Mi Perfil Mejorado y Perfil Público de Astrofotógrafo
1. Abrir `/perfil` con sesión iniciada y verificar que siguen operativas todas las funciones previas (XP, nivel, ranking, logros, rutas, lugares, favoritos, reseñas, edición de cuenta, modo offline y cierre de sesión).
2. Agregar un ítem en **Mi Equipo Fotográfico (Gear Bag)**, recargar y confirmar persistencia.
3. Comprobar que el **Portafolio de Capturas** y **Mis Reservas y Pases** muestran las capturas subidas y reservas activas.
4. Desde `/fotografia`, hacer clic en el autor de una captura para abrir `/fotografo/:handleOrId` y probar el botón **Seguir / Siguiendo**.
