# Quickstart & Validation Guide: Arquitectura Modular y Supabase Local

**Feature**: `001-modular-architecture-supabase`
**Date**: 2026-11-20

## 1. Requisitos Previos

- **Node.js**: v18+ y `npm`
- **Supabase CLI**: Para levantar el stack local (`npx supabase` o binario `supabase`) y **Docker** activo (en caso de usar instancia local contenedorizada) o conexión a proyecto Supabase de desarrollo.

## 2. Configuración e Inicio Rápido Local

1. **Instalar dependencias del proyecto**:
   ```bash
   npm install
   ```

2. **Levantar e inicializar Supabase en local (Migraciones + Seeders)**:
   ```bash
   npx supabase start
   npx supabase db reset
   ```
   *Resultado esperado*: Se aplican todas las migraciones de `supabase/migrations/` y se insertan los datos semilla de `supabase/seed.sql` sin errores.

3. **Configurar variables de entorno (`.env`)**:
   Copia las credenciales locales entregadas por `npx supabase status` (`API URL` y `anon key`) en el archivo `.env`:
   ```env
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=<tu-anon-key-local>
   ```

4. **Iniciar el servidor de desarrollo Frontend**:
   ```bash
   npm run dev
   ```

## 3. Escenarios de Validación End-to-End

### Escenario A: Verificación de Separación de Capas y Modularidad
- **Comando de verificación**:
  ```bash
  grep -rn "from.*lib/supabase" src/pages/ src/components/
  ```
- **Resultado esperado**: `0` coincidencias. Ninguna página ni componente visual importa directamente el cliente `supabase`; solo los archivos en `src/services/` lo hacen.
- **Verificación de prohibiciones (`AGENTS.md` / Constitución)**:
  ```bash
  grep -rnE "window\.(confirm|alert|prompt)|(?<!\.)(confirm|alert|prompt)\(|innerHTML" src/
  ```
- **Resultado esperado**: `0` coincidencias en todo `src/`.

### Escenario B: Validación de Datos 100% desde Base de Datos
1. Abrir `http://localhost:5173/explorar`, `/restaurantes`, `/alojamientos`, `/eventos`, `/experiencias`, `/astronomia`, `/mapa`.
2. Comprobar que todas las tarjetas, pines del mapa, condiciones astronómicas y horarios provienen de los registros insertados por `supabase/seed.sql`.
3. Iniciar sesión y visitar `/inicio`, `/recomendaciones`, `/planificador`, `/gamificacion`, `/favoritos` y `/perfil`. Verificar que logros, desafíos, tabla de posiciones y paradas del planificador se cargan desde las tablas de Supabase.

### Escenario C: Compilación de Producción
- **Comando**:
  ```bash
  npm run build
  ```
- **Resultado esperado**: Compilación exitosa (`vite build`) sin errores de importación ni advertencias de módulos faltantes tras la reestructuración por carpetas.
