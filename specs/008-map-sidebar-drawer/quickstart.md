# Quickstart & Validation Guide: Menú Lateral Ocultable y Vista Limpia del Mapa

**Feature**: `008-map-sidebar-drawer`  
**Date**: 2026-11-24

## Prerrequisitos

- Dependencias instaladas (`npm install`).
- Variables de entorno configuradas para ejecutar la aplicación web localmente.

## Comandos de ejecución y verificación

1. **Compilación de producción (verificación sin errores)**:
   ```bash
   npm run build
   ```
2. **Servidor de desarrollo local**:
   ```bash
   npm run dev
   ```
   Abrir la ruta del mapa (`/mapa`) en el navegador.

## Escenarios de validación manual

### Escenario 1: Vista inicial amplia y menú oculto (Escritorio y Móvil)
- Navegar a `/mapa`.
- **Resultado esperado**:
  - El mapa ocupa todo el espacio bajo el encabezado principal (≥90% del área útil).
  - El menú lateral está oculto por defecto.
  - Se visualiza el botón flotante en español (`Explorar lugares`) en la esquina superior izquierda del mapa.
  - No existe ningún recuadro superior con el texto `"Ubicación seleccionada"`.

### Escenario 2: Apertura, búsqueda, filtrado y cierre del menú lateral
- Hacer clic en el botón flotante `Explorar lugares`.
- **Resultado esperado**:
  - El menú lateral se despliega suavemente desde el lado izquierdo mostrando buscador, chips de categoría y lista de ubicaciones.
- Escribir un término en el buscador y elegir una categoría (por ejemplo, `Restaurantes`).
- Cerrar el menú lateral con el botón `X` (y probar también con la tecla `Escape`).
- Volver a abrir el menú lateral.
- **Resultado esperado**:
  - El buscador, la categoría seleccionada y los resultados filtrados se mantienen conservados.

### Escenario 3: Selección de ubicación sin banner superior obstructivo
- Con el menú lateral abierto, hacer clic en cualquier ubicación del listado.
- **Resultado esperado**:
  - El mapa se enfoca en la ubicación elegida.
  - No aparece ningún banner o tarjeta en la parte superior del mapa que diga `"Ubicación seleccionada"`.
  - El ítem elegido queda resaltado en la lista y permite acceder a `"Ver detalles"`.

### Escenario 4: Experiencia móvil (`<= 768px` / `48rem`)
- Cambiar el navegador a vista móvil (ej. `390x844`).
- Abrir el menú lateral con `Explorar lugares`.
- Seleccionar una ubicación de la lista.
- **Resultado esperado**:
  - El menú lateral se cierra automáticamente al seleccionar la ubicación.
  - El mapa queda visible y despejado en la parte superior, y en la parte inferior se muestra la tarjeta compacta de vista previa con enlace a la ficha del lugar.
  - Los controles de acercar (`+`), alejar (`-`) y cómo llegar permanecen visibles y clicables sin superponerse con otros elementos.

### Escenario 5: Estados de error y sin resultados
- Escribir una búsqueda sin coincidencias (ej. `zzzzz`).
- **Resultado esperado**:
  - El menú lateral muestra el estado vacío en español (`Sin puntos en el mapa`) y el botón `X` dentro del buscador limpia el texto y restaura la lista inmediatamente.
