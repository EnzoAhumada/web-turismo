# Quickstart Validation Guide: Comentarios y Valoraciones

**Feature**: `005-reviews-and-ratings`  
**Date**: 2026-11-24

## Prerrequisitos

- Node.js y npm instalados.
- Supabase CLI disponible (`npx supabase`) con entorno local activo (o proyecto remoto configurado en `.env`).
- Migración de `public.resenas` y datos semilla actualizados aplicados.

## 1. Aplicar Migración y Semilla

```bash
npm run db:reset
```

Verificar que el reinicio de base de datos finaliza sin errores y aplica tanto las migraciones como `supabase/seed.sql`.

## 2. Levantar la Aplicación y Compilar

```bash
npm run build
npm run dev
```

Confirmar que `npm run build` compila sin errores ni advertencias críticas.

## 3. Escenarios de Validación End-to-End

### Escenario A — Visualización pública y datos de ejemplo (US1)
1. Abrir la aplicación sin iniciar sesión.
2. Navegar a un lugar turístico (ej. *Basílica Menor de Andacollo*), un restaurante (ej. *Restaurante Tradicional El Valle*) y un alojamiento (ej. *Cabañas Cielos de Collowara*).
3. **Resultado esperado**:
   - Cada ficha muestra el resumen de calificación (estrellas, promedio a 1 decimal y cantidad total de reseñas) y al menos 2 reseñas de ejemplo de otros usuarios con nombre, estrellas, comentario y fecha en español.
   - Se muestra una invitación clara para iniciar sesión o registrarse si el visitante desea comentar.

### Escenario B — Publicar reseña autenticado y persistencia (US2)
1. Iniciar sesión con una cuenta de usuario registrada (o crear una cuenta en `/registro`).
2. Abrir la ficha de un lugar turístico, intentar enviar el formulario vacío y confirmar que aparece validación visual en español sin diálogos nativos.
3. Seleccionar una puntuación (ej. 5 estrellas), escribir un comentario válido y presionar **Publicar reseña**.
4. **Resultado esperado**:
   - Aparece confirmación visual en pantalla (`FeedbackBanner`).
   - El comentario aparece primero en el listado con etiqueta de reseña propia.
   - El promedio y el contador de reseñas se actualizan en la cabecera y en la sección de reseñas.
   - Al recargar la página (`F5`), la reseña y el nuevo promedio persisten.

### Escenario C — Editar y eliminar reseña propia (US3)
1. En la misma ficha donde el usuario ya publicó una reseña, confirmar que no se permite duplicar y se ofrecen las acciones **Editar** y **Eliminar**.
2. Editar la puntuación y el texto y guardar cambios; verificar que persisten y recalculan el promedio.
3. Presionar **Eliminar**, confirmar en el modal visual (`ConfirmModal`) y verificar que la reseña desaparece y que el promedio y total vuelven a actualizarse tras recargar.

### Escenario D — Consistencia en catálogos y responsividad móvil (US4)
1. Volver al listado de Lugares (`/explorar`), Restaurantes (`/restaurantes`) y Alojamientos (`/alojamientos`).
2. Confirmar que el promedio y cantidad de reseñas en las tarjetas coinciden con la ficha de detalle.
3. Probar la ficha de detalle en vista móvil (`360px` y `390px` de ancho) comprobando que el selector de estrellas, el formulario y las tarjetas de reseña se adaptan sin desbordamiento horizontal.
