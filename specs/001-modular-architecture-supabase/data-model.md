# Data Model: Ecosistema Turístico ThakiGo (Supabase PostgreSQL)

**Feature**: `001-modular-architecture-supabase`
**Date**: 2026-11-20

## Diagrama Entidad-Relación

```mermaid
erDiagram
    PROFILES ||--o{ FAVORITOS : "guarda"
    PROFILES ||--o{ USUARIO_INSIGNIAS : "desbloquea"
    PROFILES ||--o{ USUARIO_DESAFIOS : "progresa"
    CATEGORIAS ||--o{ LUGARES : "clasifica"
    CATEGORIAS ||--o{ RUTAS_PARADAS : "asocia_interes"
    INSIGNIAS ||--o{ USUARIO_INSIGNIAS : "otorga"
    DESAFIOS ||--o{ USUARIO_DESAFIOS : "define"

    PROFILES {
        uuid id PK "FK auth.users.id"
        text nombre
        text apellido
        text avatar_url
        text rol "viajero | admin"
        integer nivel "DEFAULT 1"
        integer xp "DEFAULT 0"
        integer lugares_visitados "DEFAULT 0"
        integer rutas_completadas "DEFAULT 0"
        integer resenas_count "DEFAULT 0"
        timestamptz created_at
    }

    CATEGORIAS {
        uuid id PK
        text slug UK "religion | astronomia | mineria | naturaleza | cultura | gastronomia | trekking"
        text nombre
        text icono
        text color
        text color_fondo
        integer orden
        boolean mostrar_inicio
    }

    LUGARES {
        uuid id PK
        uuid categoria_id FK
        text nombre
        text descripcion
        text imagen_url
        text direccion
        text horario
        numeric rating_promedio
        numeric distancia_km
        numeric latitud
        numeric longitud
        numeric mapa_x "Posición X (%) en mapa interactivo"
        numeric mapa_y "Posición Y (%) en mapa interactivo"
        text color_pin
        text badge_texto
        text mejor_epoca
        boolean es_astronomico
        boolean activo
        timestamptz created_at
    }

    RESTAURANTES {
        uuid id PK
        text nombre
        text descripcion
        text imagen_url
        text direccion
        text horario
        text precio_rango "$ | $$ | $$$"
        numeric rating_promedio
        numeric distancia_km
        numeric latitud
        numeric longitud
        numeric mapa_x
        numeric mapa_y
        text color_pin
        text consejo_viajero
        boolean activo
        timestamptz created_at
    }

    ALOJAMIENTOS {
        uuid id PK
        text nombre
        text descripcion
        text imagen_url
        text direccion
        numeric precio_por_noche
        numeric rating_promedio
        numeric distancia_km
        numeric latitud
        numeric longitud
        numeric mapa_x
        numeric mapa_y
        text color_pin
        text mejor_temporada
        boolean activo
        timestamptz created_at
    }

    EVENTOS {
        uuid id PK
        text nombre
        text descripcion
        text imagen_url
        date fecha_inicio
        date fecha_fin
        text categoria
        text ubicacion
        boolean es_astronomico
        boolean activo
        timestamptz created_at
    }

    EXPERIENCIAS {
        uuid id PK
        text nombre
        text descripcion
        text imagen_url
        text categoria "Tours | Gastronomía | Aventura"
        numeric precio
        text duracion
        text[] incluye
        numeric rating_promedio
        boolean disponible
        timestamptz created_at
    }

    FAVORITOS {
        uuid id PK
        uuid user_id FK
        text tipo "lugar | restaurante | alojamiento | evento | experiencia"
        uuid item_id
        timestamptz created_at
    }

    ASTRONOMIA_CONDICIONES {
        uuid id PK
        text etiqueta "Cielo | Visibilidad | Luna | Temperatura"
        text valor "Despejado | Excelente | Creciente 35% | 14°C"
        text icono
        integer orden
        boolean activo
    }

    ASTRONOMIA_HORARIOS {
        uuid id PK
        text hora "20:00 | 21:30 | 02:00"
        text etiqueta "Puesta de sol | Inicio observación | Fin recomendado"
        text icono
        text calidad "good | best"
        integer orden
    }

    ASTRONOMIA_RECURSOS {
        uuid id PK
        text tipo "consejo | equipo"
        text icono
        text titulo
        text contenido
        integer orden
    }

    DESTACADOS_DIA {
        uuid id PK
        text tipo "weather | event | promo"
        text icono
        text titulo
        text descripcion
        text cta_texto
        text cta_ruta
        text variante "dark | gold"
        boolean mostrar_home
        boolean mostrar_recomendaciones
        integer orden
        boolean activo
    }

    INSIGNIAS {
        uuid id PK
        text nombre
        text descripcion
        text icono
        integer xp_requerido
        integer orden
    }

    USUARIO_INSIGNIAS {
        uuid id PK
        uuid user_id FK
        uuid insignia_id FK
        timestamptz obtenido_en
    }

    DESAFIOS {
        uuid id PK
        text titulo
        text descripcion
        integer xp_recompensa
        integer meta_total
        boolean activo
        integer orden
    }

    USUARIO_DESAFIOS {
        uuid id PK
        uuid user_id FK
        uuid desafio_id FK
        integer progreso_pct
        boolean completado
    }

    RUTAS_PARADAS {
        uuid id PK
        uuid categoria_id FK
        text hora "09:00"
        text titulo
        text tipo_etiqueta "Cultura · Religión"
        text duracion_estimada "1.5 h"
        text icono
        text duracion_viaje "Medio día | 1 día | 2 – 3 días | +3 días"
        text presupuesto "Económico | Moderado | Premium"
        integer orden
    }
```

## Reglas de Validación e Integridad

1. **Identificadores y Relaciones**:
   - Todas las tablas emplean `uuid` con `gen_random_uuid()` como llave primaria, permitiendo inserciones seguras tanto en seeders determinísticos como desde el panel de administración.
   - `favoritos` tiene restricción de unicidad `UNIQUE(user_id, tipo, item_id)` para evitar duplicados al marcar/desmarcar un elemento.
2. **Escalabilidad Territorial (Principio I de la Constitución)**:
   - Las tablas principales (`lugares`, `restaurantes`, `alojamientos`, `eventos`, `experiencias`) incluyen un atributo `comuna` con valor por defecto `'Andacollo'` y `region` con valor por defecto `'Coquimbo'`, preparando la base de datos para escalar a otras comunas de la IV Región sin cambios estructurales.
3. **Políticas de Seguridad (Row Level Security - RLS)**:
   - **Lectura pública (`SELECT`)**: Habilitada para usuarios anónimos (`anon`) y autenticados (`authenticated`) en todas las tablas de catálogo (`categorias`, `lugares`, `restaurantes`, `alojamientos`, `eventos`, `experiencias`, `astronomia_*`, `destacados_dia`, `insignias`, `desafios`, `rutas_paradas`, y lectura de `profiles` para leaderboard).
   - **Escritura de viajero (`INSERT`, `UPDATE`, `DELETE`)**: En `favoritos`, `usuario_insignias`, `usuario_desafios` y actualización de su propio registro en `profiles` restringida mediante `auth.uid() = user_id` (o `auth.uid() = id`).
   - **Administración (`ALL`)**: En todas las tablas de catálogo permitida para usuarios cuyo `profiles.rol = 'admin'`.
