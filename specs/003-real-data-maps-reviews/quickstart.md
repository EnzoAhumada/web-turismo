# Quickstart Validation Guide

**Feature**: `003-real-data-maps-reviews`  
**Date**: 2026-11-20

## Prerrequisitos
1. Tener Docker y Supabase CLI disponibles (`npm run db:start`).
2. Configurar `.env` a partir de `.env.example` (opcionalmente añadir `VITE_GOOGLE_MAPS_API_KEY` si se desea probar el modo JS API multi-pin; sin la clave funciona el modo Google Maps Embed).

## Pasos de Validación

### 1. Reiniciar Base de Datos y Aplicar Migraciones + Seeders
```bash
npm run db:reset
```
**Esperado**: La migración `20261120000003_reviews_structured_data_and_seed_users.sql` y `supabase/seed.sql` se aplican sin errores, cargando datos reales, reseñas y los 5 usuarios semilla.

### 2. Iniciar Aplicación Web
```bash
npm run dev
```

### 3. Validar Escenarios Clave
1. **Datos reales, fotos y fichas estructuradas**:
   - Abrir `/explorar`, `/restaurantes`, `/alojamientos`, `/eventos`, `/experiencias`.
   - Entrar al detalle de al menos 1 elemento de cada tipo. Verificar que la fotografía carga, que la descripción es extensa y ordenada en secciones (descripción, destacados, información práctica, recomendaciones).
2. **Google Maps**:
   - Abrir `/mapa`, probar filtros y selección de pines/lugares. Verificar que Google Maps se renderiza y actualiza la ubicación.
   - Abrir una ficha de lugar (`/lugar/...`) y verificar el mapa embebido de ubicación y el botón `"Cómo llegar"`.
3. **Buscador con Autocompletado**:
   - Escribir `"Basílica"` o `"Collowara"` en el buscador superior. Verificar sugerencias instantáneas, navegación con flechas/Enter y clic directo a la ficha.
4. **Reseñas y Comentarios**:
   - Sin sesión iniciada: abrir un lugar y verificar que se leen reseñas existentes y aparece la invitación a iniciar sesión para comentar.
   - Con sesión iniciada (ej. `mateo.valdivia@thakigo.cl`): enviar una reseña con calificación de 5 estrellas y comentario. Verificar confirmación visual en el DOM y aparición inmediata en la lista.
5. **5 Usuarios Semilla y README**:
   - Revisar `README.md` y comprobar que las 5 cuentas documentadas (1 admin + 4 viajeros) permiten iniciar sesión, mostrando favoritos, logros/insignias y comentarios repartidos, y que el admin accede a `/admin`.

### 4. Compilación de Producción
```bash
npm run build
```
**Esperado**: Compilación limpia sin errores ni advertencias de sintaxis.
