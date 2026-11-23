-- =============================================================================
-- THAKIGO — Turismo Andacollo y Región de Coquimbo
-- Datos Semilla Idempotentes (Seeders) con Información Real de Andacollo
-- Mínimo 5 a 12 registros reales por categoría y módulo (Iconos vectoriales)
-- =============================================================================

-- 1. CATEGORIAS (10 categorías del Explorador Turístico)
INSERT INTO public.categorias (id, slug, nombre, icono, color, color_fondo, orden, mostrar_inicio, mostrar_planificador)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'religion',    'Religión',    'church',    '#0c869c', '#e0f7fa', 1, true,  true),
  ('10000000-0000-0000-0000-000000000002', 'astronomia',  'Astronomía',  'moon-star', '#132756', '#e8eaf6', 2, true,  true),
  ('10000000-0000-0000-0000-000000000003', 'mineria',     'Minería',     'pickaxe',   '#1e242c', '#fef9c3', 3, true,  false),
  ('10000000-0000-0000-0000-000000000004', 'naturaleza',  'Naturaleza',  'trees',     '#2c7d32', '#dcfce7', 4, true,  true),
  ('10000000-0000-0000-0000-000000000005', 'cultura',     'Cultura',     'landmark',  '#8a5219', '#fef3c7', 5, false, true),
  ('10000000-0000-0000-0000-000000000006', 'gastronomia', 'Gastronomía', 'utensils',  '#c94a1a', '#ffedd5', 6, false, true),
  ('10000000-0000-0000-0000-000000000007', 'trekking',    'Trekking',    'mountain',  '#137b3d', '#d1fae5', 7, false, true),
  ('10000000-0000-0000-0000-000000000008', 'fotografia',  'Fotografía',  'camera',    '#2b243c', '#f3e8ff', 8, false, false),
  ('10000000-0000-0000-0000-000000000009', 'eventos',     'Eventos',     'calendar',  '#f26a4b', '#ffedd5', 9, false, false),
  ('10000000-0000-0000-0000-000000000010', 'otros',       'Otros',       'compass',   '#16b3ac', '#ccfbf1', 10, false, false)
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  icono = EXCLUDED.icono,
  color = EXCLUDED.color,
  color_fondo = EXCLUDED.color_fondo,
  orden = EXCLUDED.orden,
  mostrar_inicio = EXCLUDED.mostrar_inicio,
  mostrar_planificador = EXCLUDED.mostrar_planificador;

-- 2. LUGARES (12 sitios turísticos reales de Andacollo, incluyendo 5 puntos astronómicos)
INSERT INTO public.lugares (
  id, categoria_id, nombre, subtitulo, descripcion, imagen_url, direccion, horario,
  rating_promedio, resenas_count, tiempo_estimado, telefono,
  distancia_km, latitud, longitud, mapa_x, mapa_y, color_pin,
  badge_texto, mejor_epoca, es_astronomico, es_gratis, es_familiar, abierto_ahora, activo
)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Basílica Menor de Andacollo',
    'Fe, historia y tradición',
    'Monumento Nacional inaugurado en 1893 y diseñado por Eusebio Chelli. Es el centro espiritual de la Fiesta de Nuestra Señora del Rosario de Andacollo y destaca por su estructura en madera de pino oregón y adobe.',
    'https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=900&q=80',
    'Plaza Videla s/n, Centro de Andacollo',
    '08:00 - 20:00',
    4.8, 120, '1 – 2 horas', '+56 51 243 1020',
    0.4, -30.228600, -71.085300, 50, 46, '#0c869c',
    'Patrimonio Nacional', 'Todo el año', false, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Observatorio Turístico Collowara',
    'Cielos increíbles en altura',
    'Ubicado a 1.300 metros sobre el nivel del mar en el Cerro El Churqui, es uno de los observatorios turísticos pioneros de Chile con cúpula principal, telescopios de alta precisión y terrazas astronómicas.',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&q=80',
    'Cerro El Churqui s/n, a 5 km de Andacollo',
    '19:30 - 00:30',
    4.9, 148, '2.5 – 3 horas', '+56 51 243 1300',
    5.4, -30.251200, -71.063100, 74, 28, '#132756',
    'Cielo Certificado', 'Octubre a Abril', true, false, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000004',
    'Mirador Natural El Toro',
    'Atardeceres únicos y vista panorámica',
    'Mirador cordillerano ubicado en el acceso norte de la comuna. Ofrece una panorámica limpia de los cerros semiáridos y cielo libre de contaminación lumínica para astrofotografía.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    'Ruta D-51, Acceso Norte Andacollo',
    'Abierto 24 horas',
    4.7, 82, '1 hora', '+56 51 243 1200',
    1.2, -30.215000, -71.092000, 30, 32, '#2c7d32',
    'Vista Panorámica', 'Septiembre a Mayo', true, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000005',
    'Museo de Ofrendas y Casa del Peregrino',
    'Memoria religiosa y bailes chinos',
    'Resguarda cientos de exvotos, trajes históricos de bailes chinos, estandartes y piezas devocionales entregadas a la Virgen del Rosario desde el siglo XIX.',
    'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=900&q=80',
    'Calle Urmeneta 599, Centro de Andacollo',
    '10:00 - 18:00',
    4.8, 94, '1 – 1.5 horas', '+56 51 243 1088',
    0.6, -30.231000, -71.084000, 42, 64, '#8a5219',
    'Museo Local', 'Todo el año', false, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    'Cumbre Astronómica Cerro El Churqui',
    'Observación de la Vía Láctea',
    'Explanada natural en altura rodeada de cielos oscuros clase Bortle 2, utilizada para sesiones de observación a simple vista y telescopios portátiles.',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
    'Sector Alto El Churqui, Andacollo',
    'Abierto 24 horas',
    4.8, 57, '2 horas', '+56 51 243 1300',
    6.2, -30.254000, -71.061000, 80, 22, '#132756',
    'Cielo Oscuro', 'Octubre a Abril', true, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000003',
    'Parque Minero y Trapiche Churrumata',
    'Historia viva de pirquineros',
    'Circuito patrimonial dedicado a la pequeña minería aurífera y cuprífera de Andacollo, donde se conserva el funcionamiento tradicional de los trapiches de piedra.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80',
    'Sector Churrumata Alto, Andacollo',
    '09:30 - 17:30',
    4.7, 68, '1.5 – 2 horas', '+56 51 243 1410',
    3.5, -30.238000, -71.079000, 58, 72, '#1e242c',
    'Ruta Minera', 'Todo el año', false, false, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000001',
    'Templo Chico (Parroquia San Miguel)',
    'Templo histórico del siglo XVIII',
    'Conocido tradicionalmente como el Templo Chico, fue el primer gran santuario de Andacollo antes de la construcción de la Basílica Menor, conservando altares coloniales.',
    'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=900&q=80',
    'Costado Poniente Plaza Videla, Andacollo',
    '08:30 - 19:00',
    4.8, 76, '45 min', '+56 51 243 1020',
    0.5, -30.228900, -71.085800, 47, 48, '#0c869c',
    'Patrimonio Histórico', 'Todo el año', false, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000003',
    'Lavaderos de Oro y Mina El Culebrón',
    'Tradición aurífera artesanal',
    'Antigua quebrada aurífera donde generaciones de andacollinos practicaron el bateo artesanal de oro en polvo y vetas de cobre.',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&q=80',
    'Quebrada El Culebrón, Andacollo',
    '09:00 - 18:00',
    4.6, 41, '1.5 horas', '+56 51 243 1410',
    2.8, -30.233500, -71.091000, 34, 60, '#1e242c',
    'Ruta del Oro', 'Marzo a Noviembre', false, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000007',
    'Quebrada y Oasis de Chepiquilla',
    'Senderismo y flora nativa',
    'Sector rural y oasis cordillerano al sur de Andacollo rodeado de algarrobos, espinos y vertientes naturales ideales para caminatas familiares.',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80',
    'Camino a Chepiquilla Km 6, Andacollo',
    '08:00 - 19:00',
    4.7, 53, '2 – 3 horas', '+56 51 243 1200',
    6.8, -30.261000, -71.089000, 26, 78, '#137b3d',
    'Trekking', 'Abril a Octubre', false, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000008',
    'Cerro El Curque y Ruta de Petroglifos',
    'Arte rupestre diaguita y paisaje',
    'Sitio arqueológico con grabados rupestres prehispánicos y vistas limpias hacia los valles transversales de la Región de Coquimbo.',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80',
    'Sector El Curque, Andacollo',
    'Abierto 24 horas',
    4.7, 39, '2 horas', '+56 51 243 1200',
    4.9, -30.220000, -71.069000, 70, 40, '#2b243c',
    'Arqueología', 'Todo el año', true, true, false, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000008',
    'Mirador Astronómico Cruz Verde',
    'Balcón natural sobre la comuna',
    'Punto alto en el sector poniente desde donde se aprecia la silueta iluminada de la Basílica Menor al atardecer y la bóveda celeste nocturna.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80',
    'Sector Cruz Verde Alto, Andacollo',
    'Abierto 24 horas',
    4.8, 61, '1 hora', '+56 51 243 1200',
    2.1, -30.226000, -71.094000, 22, 42, '#2b243c',
    'Astrofotografía', 'Todo el año', true, true, true, true, true
  ),
  (
    '20000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000005',
    'Casa del Encuentro Ciudadano',
    'Centro cultural y exposiciones',
    'Espacio municipal de difusión artística, exposiciones fotográficas de Andacollo, artesanía local en piedra combarbalita y cobre.',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=80',
    'Plaza Videla 50, Andacollo',
    '09:00 - 18:30',
    4.6, 35, '45 min', '+56 51 243 1150',
    0.3, -30.228200, -71.084600, 53, 50, '#8a5219',
    'Cultura Viva', 'Todo el año', false, true, true, true, true
  )
ON CONFLICT (id) DO UPDATE SET
  categoria_id = EXCLUDED.categoria_id,
  nombre = EXCLUDED.nombre,
  subtitulo = EXCLUDED.subtitulo,
  descripcion = EXCLUDED.descripcion,
  imagen_url = EXCLUDED.imagen_url,
  direccion = EXCLUDED.direccion,
  horario = EXCLUDED.horario,
  rating_promedio = EXCLUDED.rating_promedio,
  resenas_count = EXCLUDED.resenas_count,
  tiempo_estimado = EXCLUDED.tiempo_estimado,
  telefono = EXCLUDED.telefono,
  distancia_km = EXCLUDED.distancia_km,
  latitud = EXCLUDED.latitud,
  longitud = EXCLUDED.longitud,
  mapa_x = EXCLUDED.mapa_x,
  mapa_y = EXCLUDED.mapa_y,
  color_pin = EXCLUDED.color_pin,
  badge_texto = EXCLUDED.badge_texto,
  es_astronomico = EXCLUDED.es_astronomico,
  es_gratis = EXCLUDED.es_gratis,
  es_familiar = EXCLUDED.es_familiar,
  abierto_ahora = EXCLUDED.abierto_ahora,
  activo = EXCLUDED.activo;

-- 3. RESTAURANTES (6 establecimientos gastronómicos de Andacollo)
INSERT INTO public.restaurantes (
  id, nombre, especialidad, descripcion, imagen_url, direccion, horario, precio_rango,
  rating_promedio, resenas_count, telefono, distancia_km, latitud, longitud, mapa_x, mapa_y, color_pin, activo
)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    'Restaurante Tradicional El Valle',
    'Cabrito al jugo y cazuelas de campo',
    'Clásico andacollino en el centro histórico, reconocido por su cabrito al jugo, cazuelas de ave, empanadas de horno y churrascas con queso de cabra.',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    'Av. Urmeneta 412, Andacollo',
    '12:00 - 22:00 hrs',
    '$$', 4.8, 74, '+56 51 243 1510', 0.6, -30.229100, -71.084900, 45, 58, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'La Picada del Pirquinero',
    'Comida casera minera y porotos con riendas',
    'Cocina tradicional abundante con menú diario para trabajadores, viajeros y familias, incluyendo pastel de choclo y pan amasado.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80',
    'Calle Colón 218, Andacollo',
    '11:30 - 17:30 hrs',
    '$', 4.6, 52, '+56 51 243 1522', 0.9, -30.230200, -71.086100, 41, 52, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Terraza Astronómica Collowara & Sabores',
    'Gastronomía regional y maridaje del Elqui',
    'Cenas antes de la observación nocturna con preparaciones de cordero, quesos caprinos premiados y degustación de piscos artesanales de Coquimbo.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
    'Camino a Collowara Km 2, Andacollo',
    '18:00 - 23:30 hrs',
    '$$$', 4.9, 63, '+56 51 243 1535', 2.5, -30.241000, -71.075000, 65, 42, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Cocinería Patrimonial Doña Rosa',
    'Churrascas al rescoldo y carbonada',
    'Tradicional cocinería familiar frente al circuito religioso, famosa por sus desayunos andacollinos, humitas y guisos caseros.',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80',
    'Calle Quiteria Varas 210, Andacollo',
    '08:30 - 20:00 hrs',
    '$', 4.7, 45, '+56 51 243 1540', 0.7, -30.228000, -71.083800, 56, 53, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    'Café y Salón de Té El Peregrino',
    'Repostería de nuez, papaya y café de grano',
    'Acogedor café junto a la Plaza Videla con terraza para descansar después de recorrer la Basílica Menor y el Museo de Ofrendas.',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=80',
    'Plaza Videla 112, Andacollo',
    '09:00 - 21:00 hrs',
    '$$', 4.8, 58, '+56 51 243 1560', 0.4, -30.228500, -71.084800, 49, 49, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    'Asaduría Solar Las Estrellas de Chepiquilla',
    'Asado caprino en horno solar',
    'Experiencia culinaria sustentable que aprovecha la alta radiación solar de Andacollo para cocinar carnes, panes y dulces típicos.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80',
    'Sector Chepiquilla Km 4, Andacollo',
    '12:30 - 18:00 hrs (Vie a Dom)',
    '$$', 4.9, 41, '+56 51 243 1599', 4.6, -30.256000, -71.087000, 32, 74, '#c94a1a', true
  )
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  especialidad = EXCLUDED.especialidad,
  descripcion = EXCLUDED.descripcion,
  imagen_url = EXCLUDED.imagen_url,
  direccion = EXCLUDED.direccion,
  horario = EXCLUDED.horario,
  precio_rango = EXCLUDED.precio_rango,
  rating_promedio = EXCLUDED.rating_promedio,
  resenas_count = EXCLUDED.resenas_count,
  telefono = EXCLUDED.telefono,
  mapa_x = EXCLUDED.mapa_x,
  mapa_y = EXCLUDED.mapa_y,
  activo = EXCLUDED.activo;

-- 4. ALOJAMIENTOS (6 hospedajes reales en Andacollo)
INSERT INTO public.alojamientos (
  id, nombre, tipo, descripcion, imagen_url, direccion, precio_por_noche,
  rating_promedio, resenas_count, telefono, distancia_km, latitud, longitud, mapa_x, mapa_y, color_pin, activo
)
VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    'Hostal Patrimonio Minero',
    'Hostal',
    'Habitaciones privadas y familiares a pasos de la Plaza Videla, incluye desayuno campestre con queso de cabra local y estacionamiento interior.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
    'Calle Quiteria Varas 145, Andacollo',
    35000, 4.7, 54, '+56 51 243 1810', 0.8, -30.227900, -71.083500, 62, 55, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Cabañas Cielos de Collowara',
    'Cabañas',
    'Cabañas equipadas con terraza privada de observación estelar, quincho y vista panorámica hacia el Observatorio Collowara.',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&q=80',
    'Parcelación El Churqui Lote 8, Andacollo',
    58000, 4.9, 68, '+56 51 243 1820', 4.2, -30.246000, -71.069000, 68, 36, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'Hostería Plaza del Peregrino',
    'Hostería',
    'Alojamiento tradicional frente al circuito de la Basílica Menor y Templo Chico, ideal para peregrinos y viajeros culturales.',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80',
    'Plaza Videla 88, Andacollo',
    42000, 4.7, 47, '+56 51 243 1830', 0.3, -30.228400, -71.085000, 52, 49, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'Hotel Andacollo Real',
    'Hotel',
    'Habitaciones ejecutivas y familiares en el acceso norte de la comuna con restaurante, climatización y recepción 24 horas.',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80',
    'Ruta D-51 Acceso Norte 320, Andacollo',
    65000, 4.8, 39, '+56 51 243 1840', 1.5, -30.221000, -71.089000, 36, 38, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    'Domos Astronómicos Valle del Oro',
    'Domos',
    'Domos geodésicos con techo panorámico transparente para contemplar las estrellas desde la cama en un entorno silencioso.',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=900&q=80',
    'Sector Pan de Azúcar Alto, Andacollo',
    75000, 4.9, 51, '+56 51 243 1855', 5.1, -30.249000, -71.071000, 72, 46, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000006',
    'Residencial Familiar Los Maitenes',
    'Residencial',
    'Ambiente cálido y económico en calle Urmeneta con cocina compartida, patio interior y atención personalizada.',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
    'Av. Urmeneta 740, Andacollo',
    28000, 4.6, 33, '+56 51 243 1870', 1.1, -30.232000, -71.084500, 44, 68, '#15803d', true
  )
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  tipo = EXCLUDED.tipo,
  descripcion = EXCLUDED.descripcion,
  imagen_url = EXCLUDED.imagen_url,
  direccion = EXCLUDED.direccion,
  precio_por_noche = EXCLUDED.precio_por_noche,
  rating_promedio = EXCLUDED.rating_promedio,
  resenas_count = EXCLUDED.resenas_count,
  telefono = EXCLUDED.telefono,
  mapa_x = EXCLUDED.mapa_x,
  mapa_y = EXCLUDED.mapa_y,
  activo = EXCLUDED.activo;

-- 5. EVENTOS (6 festividades y encuentros reales de Andacollo)
INSERT INTO public.eventos (
  id, nombre, descripcion, imagen_url, fecha_inicio, fecha_fin,
  categoria, ubicacion, es_astronomico, activo
)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    'Fiesta Grande de la Virgen de Andacollo',
    'Tradición, fe y música que reúne a cientos de miles de peregrinos y cofradías de bailes chinos, turbantes y danzas ancestrales en honor a Nuestra Señora del Rosario.',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=80',
    '2026-12-23', '2026-12-27',
    'Religión y Patrimonio', 'Basílica Menor y Plaza Videla, Andacollo', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'Festival de las Estrellas en Collowara',
    'Jornadas de observación astronómica comunitaria con telescopios profesionales, astrofotografía y charlas científicas bajo los cielos de Coquimbo.',
    'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=900&q=80',
    '2027-01-10', '2027-01-12',
    'Astronomía y Ciencia', 'Observatorio Collowara, Andacollo', true, true
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'Feria Gastronómica y Costumbrista del Valle',
    'Sabores del valle con productores de queso de cabra, asado caprino, repostería tradicional, artesanía en cobre y música folclórica.',
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=80',
    '2027-02-15', '2027-02-16',
    'Gastronomía y Cultura', 'Parque Oasis de Andacollo', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000004',
    'Fiesta Chica de Nuestra Señora de Andacollo',
    'Tradicional peregrinación de primavera celebrada el primer domingo de octubre con procesión por las calles céntricas y bailes religiosos.',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&q=80',
    '2027-10-03', '2027-10-04',
    'Religión y Tradición', 'Santuario de Andacollo', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000005',
    'Celebración Día del Minero de San Lorenzo',
    'Homenaje a los pirquineros y trabajadores mineros de Andacollo con misa minera, feria patrimonial y demostración de trapiches.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80',
    '2027-08-10', '2027-08-10',
    'Minería y Cultura', 'Plaza Videla y Parque Churrumata', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000006',
    'Velada Astronómica Equinoccio y Meteoros',
    'Observación nocturna guiada de cielo profundo y lluvia de meteoros desde las cumbres de Andacollo.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80',
    '2027-03-21', '2027-03-21',
    'Astronomía', 'Mirador El Toro y Cerro Collowara', true, true
  )
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  imagen_url = EXCLUDED.imagen_url,
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin = EXCLUDED.fecha_fin,
  categoria = EXCLUDED.categoria,
  ubicacion = EXCLUDED.ubicacion,
  es_astronomico = EXCLUDED.es_astronomico,
  activo = EXCLUDED.activo;

-- 6. EXPERIENCIAS (6 experiencias reales en Andacollo)
INSERT INTO public.experiencias (
  id, nombre, descripcion, imagen_url, categoria, precio, duracion, disponible, rating_promedio, resenas_count, icono
)
VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    'Tour Minero Guiado',
    'Recorrido guiado junto a pirquineros locales por el Parque Minero Churrumata con demostración en vivo de molienda en trapiche y bateo de oro.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80',
    'Tours', 25000, '2.5 horas', true, 4.8, 52, 'pickaxe'
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    'Cabalgata por el Valle',
    'Cabalgata guiada por senderos cordilleranos y quebradas semiáridas de Chepiquilla con detención en miradores panorámicos.',
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80',
    'Aventura', 30000, '3 horas', true, 4.7, 38, 'mountain'
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    'Noche de Estrellas en Collowara',
    'Observación astronómica por telescopios de 14 y 16 pulgadas, charla de cosmovisión andina y sesión fotográfica nocturna.',
    'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=900&q=80',
    'Tours', 20000, '3 horas', true, 4.9, 89, 'moon-star'
  ),
  (
    '60000000-0000-0000-0000-000000000004',
    'Taller de Churrascas y Cata Caprina',
    'Aprende a preparar churrascas tradicionales al rescoldo acompañadas de quesos artesanales de crianceros de Andacollo.',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80',
    'Gastronomía', 15000, '2 horas', true, 4.8, 41, 'utensils'
  ),
  (
    '60000000-0000-0000-0000-000000000005',
    'Trekking Fotográfico Mirador El Toro',
    'Caminata interpretativa al atardecer hasta la cumbre del Mirador El Toro con guía especializado en paisaje y astrofotografía.',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80',
    'Aventura', 18000, '3 horas', true, 4.8, 34, 'camera'
  ),
  (
    '60000000-0000-0000-0000-000000000006',
    'Ruta Gastronómica del Cabrito y Horno Solar',
    'Degustación guiada por cocinerías tradicionales y demostración de cocina en horno solar en el sector rural de Chepiquilla.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80',
    'Gastronomía', 22000, '2.5 horas', true, 4.9, 29, 'sun'
  )
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  imagen_url = EXCLUDED.imagen_url,
  categoria = EXCLUDED.categoria,
  precio = EXCLUDED.precio,
  duracion = EXCLUDED.duracion,
  disponible = EXCLUDED.disponible,
  rating_promedio = EXCLUDED.rating_promedio,
  resenas_count = EXCLUDED.resenas_count,
  icono = EXCLUDED.icono;

-- 7. ASTRONOMIA_CONDICIONES (5 condiciones reales del cielo de Andacollo)
INSERT INTO public.astronomia_condiciones (id, etiqueta, valor, icono, orden, activo)
VALUES
  ('70000000-0000-0000-0000-000000000001', 'Cielo',            'Despejado',       'sun',         1, true),
  ('70000000-0000-0000-0000-000000000002', 'Visibilidad',      'Excelente',       'eye',         2, true),
  ('70000000-0000-0000-0000-000000000003', 'Luna',             'Creciente 35%',   'moon',        3, true),
  ('70000000-0000-0000-0000-000000000004', 'Temperatura',      '14 °C nocturna',  'thermometer', 4, true),
  ('70000000-0000-0000-0000-000000000005', 'Noches despejadas', '+300 al año',     'sparkles',    5, true)
ON CONFLICT (id) DO UPDATE SET
  etiqueta = EXCLUDED.etiqueta,
  valor = EXCLUDED.valor,
  icono = EXCLUDED.icono,
  orden = EXCLUDED.orden;

-- 8. ASTRONOMIA_HORARIOS (5 franjas horarias)
INSERT INTO public.astronomia_horarios (id, hora, etiqueta, icono, calidad, orden)
VALUES
  ('71000000-0000-0000-0000-000000000001', '19:45', 'Puesta de sol en el valle', 'sunrise',   'good', 1),
  ('71000000-0000-0000-0000-000000000002', '20:30', 'Inicio de observación',     'telescope', 'best', 2),
  ('71000000-0000-0000-0000-000000000003', '22:00', 'Cenit de la Vía Láctea',    'sparkles',  'best', 3),
  ('71000000-0000-0000-0000-000000000004', '00:15', 'Cielo profundo y nebulosas','moon-star', 'best', 4),
  ('71000000-0000-0000-0000-000000000005', '02:00', 'Fin de jornada recomendada', 'clock',    'good', 5)
ON CONFLICT (id) DO UPDATE SET
  hora = EXCLUDED.hora,
  etiqueta = EXCLUDED.etiqueta,
  icono = EXCLUDED.icono,
  calidad = EXCLUDED.calidad,
  orden = EXCLUDED.orden;

-- 9. ASTRONOMIA_RECURSOS (6 consejos y equipamiento)
INSERT INTO public.astronomia_recursos (id, tipo, icono, titulo, contenido, orden)
VALUES
  ('72000000-0000-0000-0000-000000000001', 'consejo', 'lightbulb',  'Consejo de observación',   'Llega al observatorio o mirador 30 minutos antes para que tus ojos se adapten a la oscuridad y evita usar pantallas con brillo alto.', 1),
  ('72000000-0000-0000-0000-000000000002', 'equipo',  'telescope',  'Binoculares o telescopio', 'Binoculares astronómicos 10x50 o telescopio portátil', 1),
  ('72000000-0000-0000-0000-000000000003', 'equipo',  'shirt',      'Ropa abrigada',            'Chaqueta cortaviento para noches sobre los 1.100 m s. n. m.', 2),
  ('72000000-0000-0000-0000-000000000004', 'equipo',  'smartphone', 'Mapa estelar nocturno',    'Aplicación de cartas celestes con filtro rojo activado', 3),
  ('72000000-0000-0000-0000-000000000005', 'equipo',  'flashlight', 'Linterna de luz roja',     'Linterna de luz roja para no perder la adaptación visual', 4),
  ('72000000-0000-0000-0000-000000000006', 'equipo',  'camera',     'Trípode fotográfico',      'Trípode firme para exposiciones largas de 15 a 25 segundos', 5)
ON CONFLICT (id) DO UPDATE SET
  tipo = EXCLUDED.tipo,
  icono = EXCLUDED.icono,
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  orden = EXCLUDED.orden;

-- 10. DESTACADOS_DIA (5 recomendaciones contextuales de Andacollo)
INSERT INTO public.destacados_dia (
  id, tipo, icono, titulo, descripcion, cta_texto, cta_ruta,
  variante, mostrar_home, mostrar_recomendaciones, orden, activo
)
VALUES
  (
    '80000000-0000-0000-0000-000000000001',
    'weather', 'moon-star',
    '¡Cielo despejado esta noche!',
    'Condiciones perfectas para observar estrellas en el Observatorio Collowara y Mirador El Toro.',
    'Ver ruta astronómica', '/astronomia',
    'dark', true, true, 1, true
  ),
  (
    '80000000-0000-0000-0000-000000000002',
    'event', 'calendar',
    'Fiesta Grande de Andacollo',
    'Planifica tu visita al santuario más emblemático de la Región de Coquimbo en diciembre.',
    'Ver eventos', '/eventos',
    'gold', false, true, 2, true
  ),
  (
    '80000000-0000-0000-0000-000000000003',
    'promo', 'pickaxe',
    'Circuito Minero Churrumata',
    'Conoce el funcionamiento real de los trapiches y la historia de los pirquineros andacollinos.',
    'Ver experiencias', '/experiencias',
    'dark', false, true, 3, true
  ),
  (
    '80000000-0000-0000-0000-000000000004',
    'promo', 'utensils',
    'Sabores del Valle y Cabrito',
    'Descubre picadas tradicionales con churrascas recién horneadas y queso de cabra local.',
    'Ver gastronomía', '/restaurantes',
    'gold', false, true, 4, true
  ),
  (
    '80000000-0000-0000-0000-000000000005',
    'weather', 'mountain',
    'Atardecer en Mirador El Toro',
    'A solo 1.2 km del centro, disfruta de una vista en 360° sobre la cordillera de Andacollo.',
    'Explorar mapa', '/mapa',
    'dark', false, true, 5, true
  )
ON CONFLICT (id) DO UPDATE SET
  icono = EXCLUDED.icono,
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  cta_texto = EXCLUDED.cta_texto,
  cta_ruta = EXCLUDED.cta_ruta,
  mostrar_home = EXCLUDED.mostrar_home,
  mostrar_recomendaciones = EXCLUDED.mostrar_recomendaciones;

-- 11. INSIGNIAS (6 insignias vectoriales)
INSERT INTO public.insignias (id, nombre, descripcion, icono, xp_requerido, desbloqueada_por_defecto, orden)
VALUES
  ('90000000-0000-0000-0000-000000000001', 'Explorador',           'Visitaste 5 lugares de Andacollo',       'award',     100,  true,  1),
  ('90000000-0000-0000-0000-000000000002', 'Ruta Minera',          'Completaste el circuito de Churrumata',  'pickaxe',   300,  true,  2),
  ('90000000-0000-0000-0000-000000000003', 'Cazador de Estrellas', 'Asististe a observación en Collowara',   'moon-star', 500,  true,  3),
  ('90000000-0000-0000-0000-000000000004', 'Gourmet Local',        'Probaste 3 restaurantes tradicionales',  'utensils',  800,  false, 4),
  ('90000000-0000-0000-0000-000000000005', 'Trekker Andino',       'Completaste 3 senderos de la comuna',    'mountain',  1200, false, 5),
  ('90000000-0000-0000-0000-000000000006', 'Embajador ThakiGo',    'Compartiste 10 reseñas de la comuna',    'camera',    2000, false, 6)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  icono = EXCLUDED.icono,
  xp_requerido = EXCLUDED.xp_requerido,
  desbloqueada_por_defecto = EXCLUDED.desbloqueada_por_defecto;

-- 12. DESAFIOS (5 desafíos patrimoniales)
INSERT INTO public.desafios (id, titulo, descripcion, xp_recompensa, progreso_base, completado_base, activo, orden)
VALUES
  ('91000000-0000-0000-0000-000000000001', 'Visita la Basílica Menor',  'Recorre el Santuario y el Templo Chico en Plaza Videla',      150, 100, true,  true, 1),
  ('91000000-0000-0000-0000-000000000002', 'Noche de estrellas',        'Asiste a una sesión nocturna en el Observatorio Collowara',   200, 60,  false, true, 2),
  ('91000000-0000-0000-0000-000000000003', 'Ruta gastronómica',         'Degusta cabrito o churrascas en 3 picadas de Andacollo',      120, 33,  false, true, 3),
  ('91000000-0000-0000-0000-000000000004', 'Patrimonio pirquinero',     'Visita el Parque Minero Churrumata y el Museo de Ofrendas',    250, 50,  false, true, 4),
  ('91000000-0000-0000-0000-000000000005', 'Atardecer en El Toro',      'Sube al Mirador El Toro y registra una fotografía panorámica',180, 20,  false, true, 5)
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  xp_recompensa = EXCLUDED.xp_recompensa,
  progreso_base = EXCLUDED.progreso_base,
  completado_base = EXCLUDED.completado_base;

-- 13. PROFILES DE COMUNIDAD (5 perfiles para ranking)
INSERT INTO public.profiles (id, nombre, apellido, avatar_url, rol, nivel, xp, lugares_visitados, rutas_completadas, resenas_count, titulo_nivel)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Carlos', 'Muñoz',  'https://i.pravatar.cc/80?img=33', 'viajero', 12, 5820, 42, 15, 19, 'Maestro de Andacollo'),
  ('a0000000-0000-0000-0000-000000000002', 'María',  'Torres', 'https://i.pravatar.cc/80?img=47', 'viajero', 10, 4950, 36, 12, 14, 'Guía de las Estrellas'),
  ('a0000000-0000-0000-0000-000000000003', 'Ana',    'Valdés', 'https://i.pravatar.cc/80?img=44', 'viajero', 3,  1200, 23, 8,  7,  'Viajero Experto'),
  ('a0000000-0000-0000-0000-000000000004', 'Pedro',  'Silva',  'https://i.pravatar.cc/80?img=12', 'viajero', 2,  840,  11, 4,  3,  'Explorador Curioso'),
  ('a0000000-0000-0000-0000-000000000005', 'Lucía',  'Pérez',  'https://i.pravatar.cc/80?img=9',  'viajero', 1,  620,  7,  2,  2,  'Viajero Inicial')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido,
  nivel = EXCLUDED.nivel,
  xp = EXCLUDED.xp,
  lugares_visitados = EXCLUDED.lugares_visitados,
  rutas_completadas = EXCLUDED.rutas_completadas,
  titulo_nivel = EXCLUDED.titulo_nivel;

-- 14. RUTAS_PARADAS (10 paradas reales de Andacollo)
INSERT INTO public.rutas_paradas (
  id, categoria_id, lugar_id, hora, titulo, tipo_etiqueta,
  duracion_estimada, icono, duracion_viaje, presupuesto, orden
)
VALUES
  ('b0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '09:00', 'Basílica Menor y Templo Chico en Plaza Videla', 'Religión · Patrimonio', '1.5 h', 'church', '1 día', 'Económico', 1),
  ('b0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000006', NULL,                                   '10:30', 'Desayuno con Churrascas en Café El Peregrino', 'Gastronomía', '45 min', 'coffee', '1 día', 'Económico', 2),
  ('b0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', '11:30', 'Museo de Ofrendas y Bailes Chinos', 'Cultura', '1 h', 'landmark', '1 día', 'Económico', 3),
  ('b0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006', NULL,                                   '13:00', 'Almuerzo Criollo en Restaurante El Valle', 'Gastronomía', '1.5 h', 'utensils', '1 día', 'Moderado', 4),
  ('b0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', '15:30', 'Mirador Natural El Toro', 'Naturaleza · Aventura', '1.5 h', 'mountain', '1 día', 'Económico', 5),
  ('b0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', '17:00', 'Parque Minero y Trapiche Churrumata', 'Minería · Cultura', '1.5 h', 'pickaxe', '1 día', 'Moderado', 6),
  ('b0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '20:30', 'Observación Nocturna en Observatorio Collowara', 'Astronomía', '2.5 h', 'moon-star', '1 día', 'Premium', 7),
  ('b0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000009', '10:00', 'Trekking por Quebrada y Oasis de Chepiquilla', 'Trekking · Naturaleza', '2.5 h', 'mountain', '2 – 3 días', 'Económico', 8),
  ('b0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000010', '16:30', 'Cerro El Curque y Ruta de Petroglifos', 'Fotografía · Cultura', '2 h', 'camera', '2 – 3 días', 'Moderado', 9),
  ('b0000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000011', '21:30', 'Astrofotografía en Mirador Cruz Verde', 'Astronomía · Fotografía', '1.5 h', 'sparkles', '+3 días', 'Económico', 10)
ON CONFLICT (id) DO UPDATE SET
  categoria_id = EXCLUDED.categoria_id,
  lugar_id = EXCLUDED.lugar_id,
  hora = EXCLUDED.hora,
  titulo = EXCLUDED.titulo,
  tipo_etiqueta = EXCLUDED.tipo_etiqueta,
  duracion_estimada = EXCLUDED.duracion_estimada,
  icono = EXCLUDED.icono,
  orden = EXCLUDED.orden;

-- 15. ESTADISTICAS_MUNICIPALES (Datos del Dashboard Municipal - Lámina 13)
INSERT INTO public.estadisticas_municipales (
  id, visitantes_hoy, variacion_visitantes_pct, tiempo_promedio_visita,
  variacion_tiempo_pct, calificacion_global, flujo_horario, procedencia, intereses
)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  1248,
  18,
  '2h 15m',
  12,
  4.8,
  '[
    {"hora": "00:00", "valor": 8},
    {"hora": "06:00", "valor": 17},
    {"hora": "12:00", "valor": 25},
    {"hora": "18:00", "valor": 29},
    {"hora": "24:00", "valor": 16}
  ]'::jsonb,
  '[
    {"etiqueta": "Región de Coquimbo", "porcentaje": 62, "color": "#FFB800"},
    {"etiqueta": "Región Metropolitana", "porcentaje": 20, "color": "#0ea5e9"},
    {"etiqueta": "Otras regiones", "porcentaje": 12, "color": "#10b981"},
    {"etiqueta": "Extranjero", "porcentaje": 6, "color": "#071B3A"}
  ]'::jsonb,
  '[
    {"etiqueta": "Religioso", "porcentaje": 68},
    {"etiqueta": "Astronomía", "porcentaje": 42},
    {"etiqueta": "Minero", "porcentaje": 28},
    {"etiqueta": "Naturaleza", "porcentaje": 24},
    {"etiqueta": "Gastronomía", "porcentaje": 18}
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  visitantes_hoy = EXCLUDED.visitantes_hoy,
  variacion_visitantes_pct = EXCLUDED.variacion_visitantes_pct,
  tiempo_promedio_visita = EXCLUDED.tiempo_promedio_visita,
  variacion_tiempo_pct = EXCLUDED.variacion_tiempo_pct,
  calificacion_global = EXCLUDED.calificacion_global,
  flujo_horario = EXCLUDED.flujo_horario,
  procedencia = EXCLUDED.procedencia,
  intereses = EXCLUDED.intereses,
  updated_at = now();
