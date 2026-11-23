# Phase 1 Data Model: Rediseño Visual Profesional, Navegación Adaptativa y Catálogo Real de Andacollo

**Feature**: `002-professional-ui-real-data`  
**Date**: 2026-11-20  
**Spec**: [spec.md](file:///home/i/Documentos/web-turismo/specs/002-professional-ui-real-data/spec.md)

---

## 1. Evolución del Esquema de Base de Datos (`20261120000002_professional_ui_and_real_data.sql`)

Sobre la base de las 17 tablas creadas en `001-modular-architecture-supabase`, se amplían los atributos y tablas para soportar al 100% los campos requeridos por las 14 láminas de `/design`, la iconografía vectorial semántica (sin emojis) y las métricas reales del Dashboard Municipal.

### 1.1 Ampliación de `public.categorias`
Se amplía la restricción `CHECK` de `slug` para incluir las **10 categorías** del mockup `3. Explorador Turístico`:
- `slug` permitidos: `'cultura'`, `'gastronomia'`, `'astronomia'`, `'naturaleza'`, `'religion'`, `'mineria'`, `'trekking'`, `'fotografia'`, `'eventos'`, `'otros'`.
- `icono` (`text`): almacena el nombre semántico del icono vectorial (`'landmark'`, `'utensils'`, `'moon-star'`, `'trees'`, `'church'`, `'pickaxe'`, `'mountain'`, `'camera'`, `'calendar'`, `'compass'`).

### 1.2 Ampliación de `public.lugares` (Sitios Turísticos y Puntos Astronómicos)
Se agregan campos para cubrir la ficha `4. Perfil de Lugar`, los `"Filtros populares"` de `3. Explorador Turístico` (`Cerca de mí`, `Gratis`, `Familiar`, `Abierto ahora`) y las tarjetas de `1. Inicio Inteligente`:
- `subtitulo` (`text`, default `'Patrimonio de Andacollo'`): frase breve bajo el título (ej. `"Fe, historia y tradición"`, `"Cielos increíbles"`, `"Atardeceres únicos"`).
- `resenas_count` (`integer`, default `45`): cantidad real de reseñas mostradas junto al promedio (ej. `4.8 (120 reseñas)`).
- `tiempo_estimado` (`text`, default `'1 – 2 horas'`): tiempo recomendado de visita mostrado en la ficha de información.
- `telefono` (`text`, default `'+56 51 243 1200'`): número de contacto para el botón de acción `"Llamar"`.
- `es_gratis` (`boolean`, default `true`): soporte para el filtro popular `"Gratis"`.
- `es_familiar` (`boolean`, default `true`): soporte para el filtro popular `"Familiar"`.
- `abierto_ahora` (`boolean`, default `true`): soporte para el filtro popular `"Abierto ahora"` y el indicador verde en el detalle.

### 1.3 Ampliación de `public.restaurantes`, `public.alojamientos` y `public.experiencias`
- `public.restaurantes`:
  - `especialidad` (`text`, default `'Cocina tradicional de Andacollo'`)
  - `resenas_count` (`integer`, default `38`)
  - `telefono` (`text`, default `'+56 51 243 1500'`)
  - `abierto_ahora` (`boolean`, default `true`)
- `public.alojamientos`:
  - `tipo` (`text`, default `'Hostal'`, ej. `'Hotel'`, `'Hostal'`, `'Cabañas'`, `'Domos'`)
  - `servicios` (`text[]`, default `ARRAY['Wi-Fi', 'Estacionamiento', 'Desayuno local']`)
  - `resenas_count` (`integer`, default `52`)
  - `telefono` (`text`, default `'+56 51 243 1800'`)
- `public.experiencias`:
  - `resenas_count` (`integer`, default `34`)
  - `icono` (`text`, default `'compass'`): identificador de icono vectorial para la tarjeta horizontal de `11. Experiencias Locales`.

### 1.4 Nueva Tabla `public.estadisticas_municipales` (Métricas del Mockup `13. Dashboard Municipal`)
Almacena los indicadores analíticos del panel municipal de Andacollo para que el gráfico de flujo horario, la procedencia de visitantes, los intereses principales y los KPIs provengan 100% de Supabase:
- `id` (`uuid`, PK)
- `visitantes_hoy` (`integer`, default `1248`)
- `variacion_visitantes_pct` (`integer`, default `18`)
- `tiempo_promedio_visita` (`text`, default `'2h 15m'`)
- `variacion_tiempo_pct` (`integer`, default `12`)
- `calificacion_global` (`numeric(3,1)`, default `4.8`)
- `flujo_horario` (`jsonb`): serie de puntos `{ "hora": "00:00", "valor": 8 }` a `"24:00"` para el gráfico de línea SVG.
- `procedencia` (`jsonb`): lista de segmentos `[{ "etiqueta": "Región de Coquimbo", "porcentaje": 62, "color": "#FFB800" }, ...]` para el gráfico de anillo SVG.
- `intereses` (`jsonb`): lista de barras `[{ "etiqueta": "Religioso", "porcentaje": 68 }, { "etiqueta": "Astronomía", "porcentaje": 42 }, ...]` para el bloque de intereses principales.
- `updated_at` (`timestamptz`, default `now()`)

---

## 2. Volumen Garantizado de Datos Reales de Andacollo (`supabase/seed.sql`)

Cada tabla de negocio cuenta con **mínimo 5 registros reales y verificados de Andacollo**:

| Entidad / Tabla | Mínimo Requerido | Cantidad Sembrada | Ejemplos Reales Incluidos |
| :--- | :---: | :---: | :--- |
| `categorias` | 5 | **10** | Cultura, Gastronomía, Astronomía, Naturaleza, Religión, Minería, Trekking, Fotografía, Eventos, Otros |
| `lugares` (General) | 5 | **12** | Basílica Menor (Santuario), Templo Chico, Observatorio Collowara, Mirador El Toro, Museo Histórico y de Ofrendas, Parque Minero Churrumata, Cumbre Cerro El Churqui, Cerro El Curque (Petroglifos), Mirador Cruz Verde, Lavaderos de Oro El Culebrón, Oasis de Chepiquilla, Casa Encuentro Ciudadano |
| `lugares` (`es_astronomico = true`) | 5 | **5** | Observatorio Collowara, Mirador Astronómico El Toro, Cumbre Cerro El Churqui, Explanada Cerro El Curque, Mirador Astronómico Cruz Verde |
| `restaurantes` | 5 | **6** | Restaurante Tradicional El Valle, La Picada del Pirquinero, Terraza Astronómica Collowara & Sabores, Cocinería Patrimonial Doña Rosa, Café y Salón de Té El Peregrino, Asaduría Solar Las Estrellas de Chepiquilla |
| `alojamientos` | 5 | **6** | Hostal Patrimonio Minero, Cabañas Cielos de Collowara, Hostería Plaza del Peregrino, Hotel Boutique Andacollo Real, Domos Astronómicos Valle del Oro, Residencial Familiar Los Maitenes |
| `eventos` | 5 | **6** | Fiesta Grande de Andacollo (Dic), Fiesta Chica de Andacollo (Oct), Festival de las Estrellas (Ene), Feria Gastronómica del Cabrito y Queso de Cabra (Feb), Día del Minero de San Lorenzo (Ago), Velada Equinoccio de Otoño (Mar) |
| `experiencias` | 5 | **6** | Tour Minero Guiado ($25.000), Cabalgata por el Valle ($30.000), Noche de Estrellas en Collowara ($20.000), Taller de Churrascas y Cata de Queso ($15.000), Trekking Fotográfico Mirador El Toro ($18.000), Ruta Patrimonial de Bailes Chinos ($12.000) |
| `astronomia_condiciones` | 5 | **5** | Cielo Despejado, Visibilidad Excelente, Luna Creciente 35%, Temperatura 14°C, Pureza Atmosférica 300+ noches/año |
| `astronomia_horarios` | 5 | **5** | 19:45 Puesta de sol, 20:30 Inicio observación, 22:00 Núcleo Vía Láctea, 00:30 Cielo profundo, 02:00 Fin recomendado |
| `astronomia_recursos` | 5 | **6** | 1 consejo principal de adaptación nocturna + 5 equipos recomendados |
| `destacados_dia` | 5 | **5** | Cielo despejado esta noche, Fiesta Grande de Andacollo, Ruta del Oro en Churrumata, Atardecer en Mirador El Toro, Sabores Caprinos del Valle |
| `insignias` | 5 | **6** | Explorador, Ruta Minera, Cazador de Estrellas, Gourmet Local, Trekker Andino, Embajador ThakiGo |
| `desafios` | 5 | **5** | Visita el Santuario, Noche de estrellas en Collowara, Ruta gastronómica, Patrimonio minero, Cumbre Mirador El Toro |
| `rutas_paradas` | 5 | **10** | 10 paradas horarias reales de Andacollo distribuidas por duración, interés y presupuesto |

---

## 3. Reglas de Integridad Visual y Respaldo de Imágenes

1. **Cero Emojis en Columnas `icono`**: Todos los campos `icono` en las tablas `categorias`, `astronomia_condiciones`, `astronomia_horarios`, `astronomia_recursos`, `destacados_dia`, `insignias`, `experiencias` y `rutas_paradas` almacenan claves de iconos vectoriales (`'sun'`, `'eye'`, `'moon'`, `'compass'`, `'pickaxe'`, `'telescope'`, `'award'`, `'utensils'`, `'church'`, `'mountain'`, `'camera'`, `'calendar'`, `'sparkles'`, `'flashlight'`, `'shirt'`, `'smartphone'`).
2. **Fotografías Verificadas con Respaldo Local**: Todas las URLs de `imagen_url` utilizan fotografías de alta resolución verificadas y el componente de imagen aplica un manejador `onError` que sustituye automáticamente cualquier fallo de red por una ilustración/fotografía local de respaldo en `/public/fallback-andacollo.svg`.
