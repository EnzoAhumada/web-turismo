<!--
Sync Impact Report
- Version change: N/A (template) → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Identidad Territorial y Enfoque Turístico Local (Andacollo y IV Región)
  - [PRINCIPLE_2_NAME] → II. Experiencia Inspirada en TripAdvisor y Descubrimiento Integral
  - [PRINCIPLE_3_NAME] → III. Experiencia Multiplataforma (Web y Móvil) y Diseño Responsivo
  - [PRINCIPLE_4_NAME] → IV. Sistema de Diseño, Paleta de Colores y Tipografía Escalable
  - [PRINCIPLE_5_NAME] → V. Seguridad del DOM, Feedback Visual Nativo y Rutas Protegidas
  - (Added) VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio
- Added sections:
  - Alcance Funcional y Categorías del Ecosistema
  - Estándares Técnicos y Flujo de Desarrollo
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ alineado con Constitution Check)
  - .specify/templates/spec-template.md (✅ alineado con requisitos e historias de usuario)
  - .specify/templates/tasks-template.md (✅ alineado con estructura de fases y categorías)
- Follow-up TODOs: None
-->

# Thakigo — Turismo Andacollo y Región de Coquimbo Constitution

## Core Principles

### I. Identidad Territorial y Enfoque Turístico Local (Andacollo y IV Región)
La plataforma MUST centrar su propuesta de valor en el turismo de la Cuarta Región de Chile
(Región de Coquimbo), manteniendo su foco operativo actual de forma exclusiva en la comuna de
Andacollo.
- El contenido y la arquitectura de información MUST destacar los tres pilares patrimoniales de
  Andacollo: **Astroturismo**, **Turismo Religioso** y **Turismo Minero**.
- La aplicación MUST integrar información histórica y cultural para conocer más de la comuna,
  además de cubrir servicios complementarios esenciales para el visitante: gastronomía (comida),
  alojamientos, eventos, pasatiempos y servicios básicos.
- La arquitectura de datos en Supabase MUST permitir la escalabilidad futura hacia otras comunas de
  la Región de Coquimbo sin requerir rediseños estructurales.

*Rationale*: Posicionar a Andacollo como destino integral requiere articular tanto sus atractivos
principales como la infraestructura de soporte (alimentación, hospedaje y servicios básicos) bajo
una arquitectura preparada para crecer en toda la IV Región.

### II. Experiencia Inspirada en TripAdvisor y Descubrimiento Integral
El diseño de interacción y descubrimiento MUST seguir un modelo inspirado en TripAdvisor,
centrado en la exploración visual, categorización clara, fichas detalladas y valoraciones.
- Cada sitio turístico, restaurante, alojamiento, evento o servicio MUST presentarse mediante
  tarjetas y vistas de detalle con fotografías destacadas, calificación promedio (estrellas),
  categoría, ubicación e información práctica.
- Los usuarios MUST poder explorar, filtrar y buscar elementos por categoría de forma intuitiva
  desde la parte pública de la plataforma.

*Rationale*: Un patrón familiar tipo TripAdvisor reduce la fricción cognitiva del viajero y
fomenta la confianza mediante reseñas visuales, calificaciones y categorización estructurada.

### III. Experiencia Multiplataforma (Web y Móvil) y Diseño Responsivo
Toda interfaz MUST diseñarse y construirse con soporte fluido tanto para aplicación web como para
dispositivos móviles (Mobile-First / Responsive Design).
- La maquetación MUST utilizar HTML5 semántico y CSS3 nativo empleando Flexbox y CSS Grid Layout.
- Todos los flujos públicos (exploración, búsqueda, detalle) y privados (autenticación y panel de
  administración) MUST ser completamente operables en pantallas móviles, tablets y escritorio.
- Los diseños implementados MUST basarse fielmente en las referencias visuales almacenadas en la
  carpeta `design/`.

*Rationale*: Los turistas consultan información principalmente en movimiento desde dispositivos
móviles, mientras que los administradores y planificadores alternan entre escritorio y móvil.

### IV. Sistema de Diseño, Paleta de Colores y Tipografía Escalable
La interfaz visual MUST respetar estrictamente la identidad cromática y métrica del proyecto:
- **Paleta de colores oficial**:
  - `Primary`: `#071B3A`
  - `Navy`: `#031126`
  - `Gold`: `#FFB800`
  - `Orange`: `#FF9D00`
  - `White`: `#FFFFFF`
  - `Soft`: `#F5F7FA`
- Todas las medidas de espaciado, tipografía y dimensionamiento MUST definirse en unidades `rem`,
  estableciendo un `font-size` base de `10px` en la raíz (`html { font-size: 62.5%; }` o `10px`)
  para garantizar consistencia y accesibilidad.

*Rationale*: La paleta combina la profundidad del cielo nocturno de Andacollo (`Primary`, `Navy`)
con la riqueza mineral y solar (`Gold`, `Orange`), mientras el sistema `rem` base 10px asegura
proporciones predecibles en web y móvil.

### V. Seguridad del DOM, Feedback Visual Nativo y Rutas Protegidas
El código JavaScript/React MUST garantizar seguridad en la manipulación del DOM, control de acceso
y consistencia en la retroalimentación al usuario:
- Queda estrictamente PROHIBIDO el uso de `alert()`, `confirm()` o `prompt()`. Todo feedback,
  notificación o confirmación MUST renderizarse visualmente en el DOM mediante componentes o
  ventanas modales que compartan el sistema de estilos de la aplicación.
- Queda estrictamente PROHIBIDO el uso de `innerHTML`. Cuando se requiera manipulación directa del
  DOM fuera del árbol declarativo de React, MUST utilizarse `document.createElement` e inserción
  mediante `appendChild`.
- Todos los manejadores de eventos `submit` o `click` que disparen acciones asíncronas o de
  navegación personalizada MUST prevenir explícitamente el comportamiento por defecto
  (`event.preventDefault()`).
- El acceso al panel de administración privado MUST estar resguardado mediante protección de rutas
  vinculada a la sesión y roles en Supabase.

*Rationale*: Evitar `innerHTML` previene vulnerabilidades XSS; reemplazar diálogos nativos del
navegador mantiene una experiencia multiplataforma coherente y profesional.

### VI. Simplicidad, Cero Dependencias Innecesarias y Español Obligatorio
El desarrollo MUST priorizar código legible, mantenible y sencillo de entender:
- Todos los textos visibles para el usuario final (etiquetas, mensajes de error, estados vacíos,
  navegación y contenido) MUST estar íntegramente en **español**.
- No MUST añadirse librerías ni dependencias externas de UI, estilos o utilidades fuera del stack
  base aprobado (`React`, `React Router`, `@supabase/supabase-js`, `HTML5`, `CSS3` nativo).

*Rationale*: Mantener el proyecto libre de dependencias externas pesadas asegura alto rendimiento
en redes móviles locales y facilita el mantenimiento a largo plazo.

## Alcance Funcional y Categorías del Ecosistema

- **Autenticación y Usuarios (Supabase)**:
  - Registro e inicio de sesión de usuarios gestionados mediante Supabase Auth.
  - Diferenciación clara entre vistas públicas para viajeros y rutas protegidas de administración.
- **Catálogo Público y Categorías**:
  - Visualización y filtrado por categorías: Sitios Turísticos (Astroturismo, Religioso, Minero,
    Naturaleza/Cultura comunal), Restaurantes (comida), Alojamientos, Eventos, Pasatiempos y
    Servicios Básicos.
- **Panel de Administración Privado**:
  - Gestión protegida que MUST permitir crear y administrar: Restaurantes, Alojamientos, Eventos,
    Sitios Turísticos y servicios comunales asociados.

## Estándares Técnicos y Flujo de Desarrollo

- **Stack Tecnológico Obligatorio**: HTML5 semántico, CSS3 nativo (variables CSS, Flexbox, Grid,
  unidades `rem` con base `10px`), JavaScript moderno (ES6+), React y Supabase (Base de datos y
  Backend).
- **Estructura de Archivos**: Organización modular propia de proyectos React (`src/components`,
  `src/pages`, `src/context`, `src/lib`), conservando `AGENTS.md` y la carpeta `design/` como
  fuentes de referencia.
- **Resolución de Dudas**: Ante cualquier ambigüedad funcional o visual, el equipo o agente de
  desarrollo MUST consultar las especificaciones del proyecto (`AGENTS.md`, `design/`, `.specify/`)
  y, si persiste la duda, preguntar explícitamente al usuario antes de asumir comportamientos.

## Governance

Esta Constitución rige todas las decisiones arquitectónicas, de diseño y de implementación del
proyecto web y móvil de turismo de Andacollo (y futura expansión a la IV Región).
- **Procedimiento de Enmienda**: Cualquier modificación a estos principios MUST documentarse en
  `.specify/memory/constitution.md`, registrando un reporte de impacto y actualizando la fecha de
  última enmienda (`Last Amended`).
- **Política de Versionado Semántico**:
  - `MAJOR`: Eliminación o redefinición incompatible de principios o cambio de stack base.
  - `MINOR`: Adición de nuevos principios, nuevas categorías de negocio o expansión material de
    reglas técnicas.
  - `PATCH`: Aclaraciones de redacción, correcciones ortográficas o ajustes no semánticos.
- **Revisión de Cumplimiento**: Toda especificación (`spec.md`), plan de implementación (`plan.md`),
  lista de tareas (`tasks.md`) y revisión de código MUST verificar el cumplimiento estricto de los
  6 principios fundamentales y de las reglas definidas en `AGENTS.md`.

**Version**: 1.0.0 | **Ratified**: 2026-11-20 | **Last Amended**: 2026-11-20
