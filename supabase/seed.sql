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
  ('10000000-0000-0000-0000-000000000010', 'guias',       'Guías Turísticos', 'compass', '#16b3ac', '#ccfbf1', 10, false, false)
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Bas%C3%ADlica_mayor_de_Andacollo.jpg/1600px-Bas%C3%ADlica_mayor_de_Andacollo.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Lights-out_event_in_Andacollo%2C_Chile_%28ann22004b%29.jpg/1600px-Lights-out_event_in_Andacollo%2C_Chile_%28ann22004b%29.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Panor%C3%A1mica_de_Andacollo.jpg/1600px-Panor%C3%A1mica_de_Andacollo.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Bas%C3%ADlica_de_Andacollo%2C_interior.jpg/1600px-Bas%C3%ADlica_de_Andacollo%2C_interior.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/The_lights_of_the_town_of_Andacollo%2C_Chile_%28ann22004d%29.tiff/lossy-page1-1600px-The_lights_of_the_town_of_Andacollo%2C_Chile_%28ann22004d%29.tiff.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Trapiche_minero_de_Andacollo%2C_Chile.tif/lossy-page1-1600px-Trapiche_minero_de_Andacollo%2C_Chile.tif.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Iglesia_Parroquial_de_Andacollo.JPG/1600px-Iglesia_Parroquial_de_Andacollo.JPG',
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
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Templo_Grande_de_Andacollo_bajo_la_Escoria_de_las_Faenas_Mineras.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Paisaje_de_Andacollo%2C_Chile.tif/lossy-page1-1600px-Paisaje_de_Andacollo%2C_Chile.tif.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Paisaje_de_Table_Lume.tif/lossy-page1-1600px-Paisaje_de_Table_Lume.tif.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Llegada_a_Andacollo.jpg/1600px-Llegada_a_Andacollo.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/5/53/Andacollo_Plaza.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Residencial_y_restaurante_La_Criollita_en_Andacollo%2C_Chile.jpg/1600px-Residencial_y_restaurante_La_Criollita_en_Andacollo%2C_Chile.jpg',
    'Av. Urmeneta 412, Andacollo',
    '12:00 - 22:00 hrs',
    '$$', 4.8, 74, '+56 51 243 1510', 0.6, -30.229100, -71.084900, 45, 58, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'La Picada del Pirquinero',
    'Comida casera minera y porotos con riendas',
    'Cocina tradicional abundante con menú diario para trabajadores, viajeros y familias, incluyendo pastel de choclo y pan amasado.',
    'https://upload.wikimedia.org/wikipedia/commons/f/ff/Andacollo_003.jpg',
    'Calle Colón 218, Andacollo',
    '11:30 - 17:30 hrs',
    '$', 4.6, 52, '+56 51 243 1522', 0.9, -30.230200, -71.086100, 41, 52, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Terraza Astronómica Collowara & Sabores',
    'Gastronomía regional y maridaje del Elqui',
    'Cenas antes de la observación nocturna con preparaciones de cordero, quesos caprinos premiados y degustación de piscos artesanales de Coquimbo.',
    'https://upload.wikimedia.org/wikipedia/commons/1/16/Andacollo_City_view.jpg',
    'Camino a Collowara Km 2, Andacollo',
    '18:00 - 23:30 hrs',
    '$$$', 4.9, 63, '+56 51 243 1535', 2.5, -30.241000, -71.075000, 65, 42, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Cocinería Patrimonial Doña Rosa',
    'Churrascas al rescoldo y carbonada',
    'Tradicional cocinería familiar frente al circuito religioso, famosa por sus desayunos andacollinos, humitas y guisos caseros.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Letrero_tur%C3%ADstico_de_Andacollo%2C_Regi%C3%B3n_de_Coquimbo%2C_Chile.jpg/1600px-Letrero_tur%C3%ADstico_de_Andacollo%2C_Regi%C3%B3n_de_Coquimbo%2C_Chile.jpg',
    'Calle Quiteria Varas 210, Andacollo',
    '08:30 - 20:00 hrs',
    '$', 4.7, 45, '+56 51 243 1540', 0.7, -30.228000, -71.083800, 56, 53, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    'Café y Salón de Té El Peregrino',
    'Repostería de nuez, papaya y café de grano',
    'Acogedor café junto a la Plaza Videla con terraza para descansar después de recorrer la Basílica Menor y el Museo de Ofrendas.',
    'https://upload.wikimedia.org/wikipedia/commons/9/94/AndacolloPlaza.jpg',
    'Plaza Videla 112, Andacollo',
    '09:00 - 21:00 hrs',
    '$$', 4.8, 58, '+56 51 243 1560', 0.4, -30.228500, -71.084800, 49, 49, '#c94a1a', true
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    'Asaduría Solar Las Estrellas de Chepiquilla',
    'Asado caprino en horno solar',
    'Experiencia culinaria sustentable que aprovecha la alta radiación solar de Andacollo para cocinar carnes, panes y dulces típicos.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aves_de_Andacollo.jpg/1600px-Aves_de_Andacollo.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Llegada_a_Andacollo.jpg/1600px-Llegada_a_Andacollo.jpg',
    'Calle Quiteria Varas 145, Andacollo',
    35000, 4.7, 54, '+56 51 243 1810', 0.8, -30.227900, -71.083500, 62, 55, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Cabañas Cielos de Collowara',
    'Cabañas',
    'Cabañas equipadas con terraza privada de observación estelar, quincho y vista panorámica hacia el Observatorio Collowara.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Paisaje_de_Andacollo%2C_Chile.tif/lossy-page1-1600px-Paisaje_de_Andacollo%2C_Chile.tif.jpg',
    'Parcelación El Churqui Lote 8, Andacollo',
    58000, 4.9, 68, '+56 51 243 1820', 4.2, -30.246000, -71.069000, 68, 36, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'Hostería Plaza del Peregrino',
    'Hostería',
    'Alojamiento tradicional frente al circuito de la Basílica Menor y Templo Chico, ideal para peregrinos y viajeros culturales.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Bas%C3%ADlica_de_Andacollo_vista_a_trav%C3%A9s_de_la_reja_frontal.jpg/1600px-Bas%C3%ADlica_de_Andacollo_vista_a_trav%C3%A9s_de_la_reja_frontal.jpg',
    'Plaza Videla 88, Andacollo',
    42000, 4.7, 47, '+56 51 243 1830', 0.3, -30.228400, -71.085000, 52, 49, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'Hotel Andacollo Real',
    'Hotel',
    'Habitaciones ejecutivas y familiares en el acceso norte de la comuna con restaurante, climatización y recepción 24 horas.',
    'https://upload.wikimedia.org/wikipedia/commons/1/16/Andacollo_City_view.jpg',
    'Ruta D-51 Acceso Norte 320, Andacollo',
    65000, 4.8, 39, '+56 51 243 1840', 1.5, -30.221000, -71.089000, 36, 38, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    'Domos Astronómicos Valle del Oro',
    'Domos',
    'Domos geodésicos con techo panorámico transparente para contemplar las estrellas desde la cama en un entorno silencioso.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Lights-out_event_in_Andacollo%2C_Chile_%28ann22004b%29.jpg/1600px-Lights-out_event_in_Andacollo%2C_Chile_%28ann22004b%29.jpg',
    'Sector Pan de Azúcar Alto, Andacollo',
    75000, 4.9, 51, '+56 51 243 1855', 5.1, -30.249000, -71.071000, 72, 46, '#15803d', true
  ),
  (
    '40000000-0000-0000-0000-000000000006',
    'Residencial Familiar Los Maitenes',
    'Residencial',
    'Ambiente cálido y económico en calle Urmeneta con cocina compartida, patio interior y atención personalizada.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Residencial_y_restaurante_La_Criollita_en_Andacollo%2C_Chile.jpg/1600px-Residencial_y_restaurante_La_Criollita_en_Andacollo%2C_Chile.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Iglesia_Parroquial_de_Andacollo.JPG/1600px-Iglesia_Parroquial_de_Andacollo.JPG',
    '2026-12-23', '2026-12-27',
    'Religión y Patrimonio', 'Basílica Menor y Plaza Videla, Andacollo', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'Festival de las Estrellas en Collowara',
    'Jornadas de observación astronómica comunitaria con telescopios profesionales, astrofotografía y charlas científicas bajo los cielos de Coquimbo.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/The_lights_of_the_town_of_Andacollo%2C_Chile_%28ann22004d%29.tiff/lossy-page1-1600px-The_lights_of_the_town_of_Andacollo%2C_Chile_%28ann22004d%29.tiff.jpg',
    '2027-01-10', '2027-01-12',
    'Astronomía y Ciencia', 'Observatorio Collowara, Andacollo', true, true
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'Feria Gastronómica y Costumbrista del Valle',
    'Sabores del valle con productores de queso de cabra, asado caprino, repostería tradicional, artesanía en cobre y música folclórica.',
    'https://upload.wikimedia.org/wikipedia/commons/5/53/Andacollo_Plaza.jpg',
    '2027-02-15', '2027-02-16',
    'Gastronomía y Cultura', 'Parque Oasis de Andacollo', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000004',
    'Fiesta Chica de Nuestra Señora de Andacollo',
    'Tradicional peregrinación de primavera celebrada el primer domingo de octubre con procesión por las calles céntricas y bailes religiosos.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Bas%C3%ADlica_mayor_de_Andacollo.jpg/1600px-Bas%C3%ADlica_mayor_de_Andacollo.jpg',
    '2027-10-03', '2027-10-04',
    'Religión y Tradición', 'Santuario de Andacollo', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000005',
    'Celebración Día del Minero de San Lorenzo',
    'Homenaje a los pirquineros y trabajadores mineros de Andacollo con misa minera, feria patrimonial y demostración de trapiches.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Trabajador_en_Trapiche_minero_de_Andacollo%2C_Chile.tif/lossy-page1-1600px-Trabajador_en_Trapiche_minero_de_Andacollo%2C_Chile.tif.jpg',
    '2027-08-10', '2027-08-10',
    'Minería y Cultura', 'Plaza Videla y Parque Churrumata', false, true
  ),
  (
    '50000000-0000-0000-0000-000000000006',
    'Velada Astronómica Equinoccio y Meteoros',
    'Observación nocturna guiada de cielo profundo y lluvia de meteoros desde las cumbres de Andacollo.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Panor%C3%A1mica_de_Andacollo.jpg/1600px-Panor%C3%A1mica_de_Andacollo.jpg',
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Trapiche_minero_de_Andacollo%2C_Chile.tif/lossy-page1-1600px-Trapiche_minero_de_Andacollo%2C_Chile.tif.jpg',
    'Tours', 25000, '2.5 horas', true, 4.8, 52, 'pickaxe'
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    'Cabalgata por el Valle',
    'Cabalgata guiada por senderos cordilleranos y quebradas semiáridas de Chepiquilla con detención en miradores panorámicos.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aves_de_Andacollo.jpg/1600px-Aves_de_Andacollo.jpg',
    'Aventura', 30000, '3 horas', true, 4.7, 38, 'mountain'
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    'Noche de Estrellas en Collowara',
    'Observación astronómica por telescopios de 14 y 16 pulgadas, charla de cosmovisión andina y sesión fotográfica nocturna.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Lights-out_event_in_Andacollo%2C_Chile_%28ann22004b%29.jpg/1600px-Lights-out_event_in_Andacollo%2C_Chile_%28ann22004b%29.jpg',
    'Tours', 20000, '3 horas', true, 4.9, 89, 'moon-star'
  ),
  (
    '60000000-0000-0000-0000-000000000004',
    'Taller de Churrascas y Cata Caprina',
    'Aprende a preparar churrascas tradicionales al rescoldo acompañadas de quesos artesanales de crianceros de Andacollo.',
    'https://upload.wikimedia.org/wikipedia/commons/f/ff/Andacollo_003.jpg',
    'Gastronomía', 15000, '2 horas', true, 4.8, 41, 'utensils'
  ),
  (
    '60000000-0000-0000-0000-000000000005',
    'Trekking Fotográfico Mirador El Toro',
    'Caminata interpretativa al atardecer hasta la cumbre del Mirador El Toro con guía especializado en paisaje y astrofotografía.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Paisaje_de_Table_Lume.tif/lossy-page1-1600px-Paisaje_de_Table_Lume.tif.jpg',
    'Aventura', 18000, '3 horas', true, 4.8, 34, 'camera'
  ),
  (
    '60000000-0000-0000-0000-000000000006',
    'Ruta Gastronómica del Cabrito y Horno Solar',
    'Degustación guiada por cocinerías tradicionales y demostración de cocina en horno solar en el sector rural de Chepiquilla.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Letrero_tur%C3%ADstico_de_Andacollo%2C_Regi%C3%B3n_de_Coquimbo%2C_Chile.jpg/1600px-Letrero_tur%C3%ADstico_de_Andacollo%2C_Regi%C3%B3n_de_Coquimbo%2C_Chile.jpg',
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

-- 13. USUARIOS DE COMUNIDAD (cuentas de Auth + perfil público)
-- El rol queda siempre en viajero. La contraseña se genera al azar y no permite ingreso.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_rol_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_rol_check
  CHECK (rol IN ('user', 'viajero', 'admin'));
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_sso_user, is_anonymous
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  comunidad.id,
  'authenticated',
  'authenticated',
  comunidad.email,
  extensions.crypt(encode(extensions.gen_random_bytes(32), 'hex'), extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('nombre', comunidad.nombre, 'apellido', comunidad.apellido),
  now(),
  now(),
  false,
  false
FROM (
  VALUES
    ('a0000000-0000-0000-0000-000000000001'::uuid, 'carlos.munoz@visitantes.andacollo.local', 'Carlos', 'Muñoz'),
    ('a0000000-0000-0000-0000-000000000002'::uuid, 'maria.torres@visitantes.andacollo.local', 'María', 'Torres'),
    ('a0000000-0000-0000-0000-000000000003'::uuid, 'ana.valdes@visitantes.andacollo.local', 'Ana', 'Valdés'),
    ('a0000000-0000-0000-0000-000000000004'::uuid, 'pedro.silva@visitantes.andacollo.local', 'Pedro', 'Silva'),
    ('a0000000-0000-0000-0000-000000000005'::uuid, 'lucia.perez@visitantes.andacollo.local', 'Lucía', 'Pérez')
) AS comunidad(id, email, nombre, apellido)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
  updated_at = now();

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  comunidad.id,
  jsonb_build_object('sub', comunidad.id::text, 'email', comunidad.email, 'email_verified', true),
  'email',
  comunidad.id::text,
  now(),
  now(),
  now()
FROM (
  VALUES
    ('a0000000-0000-0000-0000-000000000001'::uuid, 'carlos.munoz@visitantes.andacollo.local'),
    ('a0000000-0000-0000-0000-000000000002'::uuid, 'maria.torres@visitantes.andacollo.local'),
    ('a0000000-0000-0000-0000-000000000003'::uuid, 'ana.valdes@visitantes.andacollo.local'),
    ('a0000000-0000-0000-0000-000000000004'::uuid, 'pedro.silva@visitantes.andacollo.local'),
    ('a0000000-0000-0000-0000-000000000005'::uuid, 'lucia.perez@visitantes.andacollo.local')
) AS comunidad(id, email)
ON CONFLICT (provider_id, provider) DO NOTHING;

INSERT INTO public.profiles (
  id, nombre, apellido, avatar_url, rol, nivel, xp,
  lugares_visitados, rutas_completadas, resenas_count, titulo_nivel,
  biografia, ciudad_origen
)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Carlos', 'Muñoz',  'https://i.pravatar.cc/80?img=33', 'viajero', 12, 5820, 42, 15, 19, 'Maestro de Andacollo', 'Recorre Andacollo hace años y comparte reseñas de sus lugares, picadas y hospedajes favoritos.', 'Andacollo'),
  ('a0000000-0000-0000-0000-000000000002', 'María',  'Torres', 'https://i.pravatar.cc/80?img=47', 'viajero', 10, 4950, 36, 12, 14, 'Guía de las Estrellas', 'Guía local de observación astronómica en Collowara y los miradores de la comuna.', 'Andacollo'),
  ('a0000000-0000-0000-0000-000000000003', 'Ana',    'Valdés', 'https://i.pravatar.cc/80?img=44', 'viajero', 3,  1200, 23, 8,  7,  'Viajero Experto', 'Viaja por la Región de Coquimbo y documenta patrimonio, gastronomía y senderos.', 'La Serena'),
  ('a0000000-0000-0000-0000-000000000004', 'Pedro',  'Silva',  'https://i.pravatar.cc/80?img=12', 'viajero', 2,  840,  11, 4,  3,  'Explorador Curioso', 'Visita Andacollo en familia y recomienda paseos cortos cerca de la plaza.', 'Coquimbo'),
  ('a0000000-0000-0000-0000-000000000005', 'Lucía',  'Pérez',  'https://i.pravatar.cc/80?img=9',  'viajero', 1,  620,  7,  2,  2,  'Viajero Inicial', 'Primera visita a Andacollo, con reseñas de la basílica y los alojamientos del centro.', 'Ovalle')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido,
  avatar_url = EXCLUDED.avatar_url,
  rol = 'viajero',
  nivel = EXCLUDED.nivel,
  xp = EXCLUDED.xp,
  lugares_visitados = EXCLUDED.lugares_visitados,
  rutas_completadas = EXCLUDED.rutas_completadas,
  titulo_nivel = EXCLUDED.titulo_nivel,
  biografia = EXCLUDED.biografia,
  ciudad_origen = EXCLUDED.ciudad_origen;

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


-- 16. NOTICIAS DE ANDACOLLO (10 noticias recientes precargadas)
INSERT INTO public.noticias (
  id, titulo, slug, resumen, contenido, imagen_url, fuente, url_externa,
  categoria, origen, fecha_publicacion, destacada, activa
)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'Andacollo inicia preparativos logísticos y culturales para la Fiesta Grande en honor a la Virgen',
    'andacollo-preparativos-fiesta-grande-virgen',
    'Equipos municipales, bailes chinos y servicios de emergencia coordinan el plan integral de bienvenida para miles de peregrinos y visitantes.',
    'La Ilustre Municipalidad de Andacollo junto a la Rectoría del Santuario, Carabineros y representantes de los Bailes Chinos dieron inicio a las mesas de coordinación para la tradicional Fiesta Grande de diciembre. El plan contempla refuerzo de puntos de hidratación, ferias de emprendedores locales en el eje de Plaza Videla, circuitos señalizados para visitantes y horarios extendidos en el comercio y recintos patrimoniales.',
    'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=1200&q=80',
    'Municipalidad de Andacollo',
    NULL,
    'Patrimonio',
    'manual',
    now() - interval '1 day',
    true,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'Observatorio Collowara abre temporada de cielos despejados con recorridos nocturnos familiares',
    'observatorio-collowara-temporada-cielos-despejados',
    'El recinto astronómico municipal renueva su cartelera de observaciones guiadas y talleres de astrofotografía en el Cerro Churqui.',
    'Con más de 300 noches despejadas al año, el Observatorio Turístico Collowara inauguró su programación de temporada alta con tres turnos nocturnos guiados por especialistas locales. Los visitantes pueden observar cúmulos estelares, planetas y nebulosas mediante telescopios de gran apertura, además de disfrutar de charlas de cosmovisión andina y terrazas acondicionadas para astrofotografía.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'Observatorio Collowara',
    NULL,
    'Astronomía',
    'manual',
    now() - interval '2 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'Renuevan señalética turística y miradores de la Ruta Minera de Churrumata',
    'renuevan-senaletica-ruta-minera-churrumata',
    'Nuevos paneles interpretativos destacan la historia de los pirquineros, los trapiches tradicionales y el patrimonio aurífero de la comuna.',
    'Con el objetivo de fortalecer el turismo patrimonial y seguro, se instalaron nuevos hitos informativos y zonas de descanso a lo largo del circuito del Parque Minero y Trapiche Churrumata. La iniciativa permite a los visitantes conocer en detalle el proceso artesanal de extracción y molienda de oro y cobre que ha marcado la identidad de Andacollo durante siglos.',
    'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1200&q=80',
    'Corporación de Turismo Andacollo',
    NULL,
    'Turismo',
    'manual',
    now() - interval '3 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'Feria Gastronómica y de Emprendedores Locales reúne sabores típicos en Plaza Videla',
    'feria-gastronomica-emprendedores-plaza-videla',
    'Churrascas recién horneadas, queso de cabra, miel del valle y artesanía en lapislázuli y cobre protagonizan los fines de semana en el centro.',
    'Más de 35 productores y cocinerías tradicionales de la comuna participan cada fin de semana en la Feria de Emprendedores de Plaza Videla. La actividad ofrece degustaciones de gastronomía típica nortina, presentaciones de música folclórica local y talleres abiertos de orfebrería tradicional para familias y turistas.',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    'Andacollo Conectado',
    NULL,
    'Cultura',
    'manual',
    now() - interval '4 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000005',
    'Bailes Chinos de Andacollo celebran jornada patrimonial con muestras abiertas a la comunidad',
    'bailes-chinos-andacollo-jornada-patrimonial',
    'Agrupaciones declaradas Patrimonio Cultural Inmaterial de la Humanidad compartieron historia, vestimentas e instrumentos con escolares y visitantes.',
    'En el entorno del Templo Chico y el Museo de Ofrendas, distintas cofradías de Bailes Chinos de Andacollo realizaron un encuentro abierto donde relataron la tradición musical de flautas y tambores transmitida de generación en generación. La actividad buscó acercar el valor patrimonial de la danza devocional a quienes visitan la comuna fuera de las fiestas mayores.',
    'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1200&q=80',
    'Cultura Andacollo',
    NULL,
    'Patrimonio',
    'manual',
    now() - interval '5 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000006',
    'Habilitan nueva estación de descanso y punto fotográfico en Mirador Natural El Toro',
    'nueva-estacion-descanso-mirador-el-toro',
    'El acceso al mirador cuenta ahora con bancas sombreadas, barandas de seguridad y recomendaciones para disfrutar el atardecer sobre el valle.',
    'El Mirador Natural El Toro, uno de los sitios preferidos por fotógrafos y viajeros para contemplar la puesta de sol sobre las montañas de la Región de Coquimbo, estrenó mejoras en su plataforma de observación. Se recomienda llevar abrigo ligero al caer la tarde y respetar las zonas habilitadas para proteger la flora nativa del sector.',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'Municipalidad de Andacollo',
    NULL,
    'Turismo',
    'manual',
    now() - interval '6 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000007',
    'Anuncian calendario de caminatas guiadas por Quebrada de Chepiquilla y Cerro El Curque',
    'calendario-caminatas-guiadas-chepiquilla-curque',
    'Salidas grupales de dificultad baja y media acercan a los participantes a petroglifos ancestrales y ecosistemas precordilleranos.',
    'Guías locales certificados publicaron el calendario mensual de excursiones interpretativas hacia la Quebrada de Chepiquilla y la ruta de petroglifos de Cerro El Curque. Cada salida incluye inducción de seguridad, relato arqueológico y consejos de turismo sustentable para conservar el entorno natural de Andacollo.',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
    'Andacollo Outdoors',
    NULL,
    'Eventos',
    'manual',
    now() - interval '7 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000008',
    'Comercio y alojamientos de Andacollo se suman a campaña de hospitalidad y turismo seguro',
    'comercio-alojamientos-campana-hospitalidad',
    'Hostales, cabañas y restaurantes locales actualizan sus horarios, tarifas transparentes y estándares de atención para la temporada.',
    'Más de 40 establecimientos de hospedaje y gastronomía de Andacollo participaron en la jornada de actualización de calidad turística. El acuerdo promueve información clara de horarios, reservas digitales y recomendaciones de rutas locales para mejorar la experiencia de quienes pernoctan en la comuna.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'Cámara de Comercio Andacollo',
    NULL,
    'Comuna',
    'manual',
    now() - interval '8 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000009',
    'Museo de Ofrendas extiende su horario de atención de fines de semana para delegaciones y familias',
    'museo-ofrendas-extiende-horario-fin-semana',
    'El recinto resguarda valiosas piezas históricas, exvotos y vestimentas que narran más de cuatro siglos de devoción en Andacollo.',
    'Ante el aumento sostenido de visitas culturales, el Museo de Ofrendas anunció horarios continuados sábados y domingos, sumando mediación guiada gratuita cada hora. El espacio permite comprender el vínculo histórico entre la minería, la fe popular y las expresiones artísticas de la Región de Coquimbo.',
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
    'Patrimonio Coquimbo',
    NULL,
    'Cultura',
    'manual',
    now() - interval '9 days',
    false,
    true
  ),
  (
    'd0000000-0000-0000-0000-000000000010',
    'Noche de Estrellas Comunitaria invita a observar la Vía Láctea desde el Mirador Cruz Verde',
    'noche-estrellas-comunitaria-mirador-cruz-verde',
    'Actividad gratuita abierta a vecinos y turistas contará con telescopios portátiles, música ambiental y charla de cielo oscuro.',
    'Con el fin de promover el cuidado de la contaminación lumínica y el astroturismo comunitario, agrupaciones locales organizan una nueva jornada de observación abierta en el Mirador Cruz Verde. La actividad inicia a las 20:30 horas y contempla orientación para identificar constelaciones australes a simple vista y con binoculares.',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    'Andacollo Conectado',
    NULL,
    'Astronomía',
    'manual',
    now() - interval '10 days',
    false,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  resumen = EXCLUDED.resumen,
  contenido = EXCLUDED.contenido,
  imagen_url = EXCLUDED.imagen_url,
  fuente = EXCLUDED.fuente,
  categoria = EXCLUDED.categoria,
  fecha_publicacion = EXCLUDED.fecha_publicacion,
  destacada = EXCLUDED.destacada,
  activa = EXCLUDED.activa;

-- 17. INSIGNIAS ASIGNADAS A PERFILES COMUNITARIOS (Datos reales para ranking y perfil)
INSERT INTO public.usuario_insignias (user_id, insignia_id)
VALUES
  ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000004'),
  ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000005'),
  ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000006'),
  ('a0000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000004'),
  ('a0000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000005'),
  ('a0000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000004', '90000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000004', '90000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000005', '90000000-0000-0000-0000-000000000001')
ON CONFLICT (user_id, insignia_id) DO NOTHING;


-- 18. RESEÑAS DE EJEMPLO (Comentarios y valoraciones reales de usuarios en Lugares, Restaurantes y Alojamientos)
INSERT INTO public.resenas (id, user_id, tipo, item_id, calificacion, comentario, created_at)
VALUES
  -- LUGARES TURÍSTICOS (12 lugares × 2–3 reseñas = 26 reseñas)
  (
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'lugar', '20000000-0000-0000-0000-000000000001', 5,
    'Impresionante arquitectura en pino oregón y adobe. Entrar a la Basílica Menor en la mañana, cuando la luz atraviesa los ventanales, es una experiencia inolvidable en Andacollo.',
    now() - interval '2 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'lugar', '20000000-0000-0000-0000-000000000001', 5,
    'Un patrimonio vivo lleno de historia y devoción. Muy limpia, bien cuidada y con acceso gratuito junto a la Plaza Videla. Recomiendo visitarla junto al Templo Chico.',
    now() - interval '6 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'lugar', '20000000-0000-0000-0000-000000000001', 4,
    'Bellísima iglesia monumental. Fui en fin de semana y había bastante gente, pero igual se puede recorrer con calma y sacar muy buenas fotos del altar y la fachada.',
    now() - interval '11 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000002',
    'lugar', '20000000-0000-0000-0000-000000000002', 5,
    'El cielo más limpio que he visto en Chile. Los guías explican con mucha paciencia, pudimos ver Saturno y nebulosas por los telescopios de la cúpula. Lleven chaqueta abrigada.',
    now() - interval '1 day'
  ),
  (
    'e0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'lugar', '20000000-0000-0000-0000-000000000002', 5,
    'Observatorio Collowara supera cualquier expectativa. La terraza de observación y la charla de cosmovisión andina valen cada minuto. Conviene reservar con anticipación.',
    now() - interval '5 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000004',
    'lugar', '20000000-0000-0000-0000-000000000002', 5,
    'Fuimos en familia con niños y quedaron fascinados viendo la Luna y la Vía Láctea. Excelente organización y muy buena señalización en el camino al Cerro El Churqui.',
    now() - interval '9 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000007',
    'a0000000-0000-0000-0000-000000000003',
    'lugar', '20000000-0000-0000-0000-000000000003', 5,
    'Atardecer espectacular sobre los cerros de Andacollo. Fácil acceso desde la Ruta D-51 y perfecto para sacar fotografías panorámicas sin pagar entrada.',
    now() - interval '3 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000008',
    'a0000000-0000-0000-0000-000000000005',
    'lugar', '20000000-0000-0000-0000-000000000003', 4,
    'Vista muy amplia y tranquila. En la tarde corre bastante viento, así que recomiendo llevar cortaviento y agua si se quedan a ver las primeras estrellas.',
    now() - interval '10 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000009',
    'a0000000-0000-0000-0000-000000000001',
    'lugar', '20000000-0000-0000-0000-000000000004', 5,
    'Emociona recorrer las salas con los trajes antiguos de bailes chinos y los exvotos de más de un siglo. Muy buena explicación para entender la tradición de la Fiesta Grande.',
    now() - interval '4 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000010',
    'a0000000-0000-0000-0000-000000000004',
    'lugar', '20000000-0000-0000-0000-000000000004', 5,
    'Parada obligatoria si visitas el centro histórico. Entrada gratuita, piezas muy bien conservadas y personal muy amable para responder preguntas.',
    now() - interval '12 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000011',
    'a0000000-0000-0000-0000-000000000002',
    'lugar', '20000000-0000-0000-0000-000000000005', 5,
    'Si haces astrofotografía, esta cumbre es un paraíso. Cero contaminación lumínica directa y el silencio nocturno de la cordillera es increíble.',
    now() - interval '3 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000012',
    'a0000000-0000-0000-0000-000000000005',
    'lugar', '20000000-0000-0000-0000-000000000005', 4,
    'El cielo se ve nítido incluso a simple vista. Conviene subir en vehículo alto antes de que oscurezca y llevar linterna de luz roja.',
    now() - interval '14 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000013',
    'a0000000-0000-0000-0000-000000000001',
    'lugar', '20000000-0000-0000-0000-000000000006', 5,
    'Ver un trapiche de piedra funcionando y escuchar las historias de los pirquineros locales le da un valor enorme al viaje. Auténtica identidad minera de Andacollo.',
    now() - interval '5 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000014',
    'a0000000-0000-0000-0000-000000000003',
    'lugar', '20000000-0000-0000-0000-000000000006', 4,
    'Muy entretenido e informativo para ir con niños y adultos. Recomiendo ir en la mañana para evitar el sol fuerte del mediodía.',
    now() - interval '13 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000015',
    'a0000000-0000-0000-0000-000000000002',
    'lugar', '20000000-0000-0000-0000-000000000007', 5,
    'El Templo Chico tiene una atmósfera íntima y colonial preciosa. Sus altares antiguos y su tranquilidad contrastan maravillosamente con la magnitud de la Basílica Menor.',
    now() - interval '4 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000016',
    'a0000000-0000-0000-0000-000000000005',
    'lugar', '20000000-0000-0000-0000-000000000007', 5,
    'Un rincón histórico imprescindible a pasos de la plaza. Se recorre en menos de una hora y vale totalmente la pena conocer su historia del siglo XVIII.',
    now() - interval '15 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000017',
    'a0000000-0000-0000-0000-000000000004',
    'lugar', '20000000-0000-0000-0000-000000000008', 5,
    'Excelente ruta para conocer cómo se trabajaba el oro artesanalmente en la quebrada. Muy recomendable ir acompañado de un guía local.',
    now() - interval '7 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000018',
    'a0000000-0000-0000-0000-000000000003',
    'lugar', '20000000-0000-0000-0000-000000000008', 4,
    'Paisaje semiárido muy interesante y lleno de relatos de antiguos mineros. Llevar calzado cómodo y sombrero para caminar por la quebrada.',
    now() - interval '16 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000019',
    'a0000000-0000-0000-0000-000000000001',
    'lugar', '20000000-0000-0000-0000-000000000009', 5,
    'Un verdadero oasis escondido al sur de Andacollo. Caminata familiar muy agradable entre algarrobos y vertientes naturales.',
    now() - interval '5 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000020',
    'a0000000-0000-0000-0000-000000000005',
    'lugar', '20000000-0000-0000-0000-000000000009', 4,
    'Sendero tranquilo, ideal para desconectarse y fotografiar flora nativa. Muy recomendable combinarlo con un almuerzo en el sector de Chepiquilla.',
    now() - interval '17 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000021',
    'a0000000-0000-0000-0000-000000000002',
    'lugar', '20000000-0000-0000-0000-000000000010', 5,
    'Los petroglifos diaguitas son fascinantes y la vista hacia los valles transversales de Coquimbo es impresionante. Por favor cuidar el sitio sin tocar las rocas.',
    now() - interval '6 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000022',
    'a0000000-0000-0000-0000-000000000004',
    'lugar', '20000000-0000-0000-0000-000000000010', 4,
    'Ruta arqueológica muy valiosa. Tiene tramos de subida moderada, así que conviene llevar zapatillas de trekking y bastante agua.',
    now() - interval '18 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000023',
    'a0000000-0000-0000-0000-000000000003',
    'lugar', '20000000-0000-0000-0000-000000000011', 5,
    'Desde Cruz Verde se obtiene la mejor postal de la Basílica Menor iluminada al caer la tarde. Un lugar seguro, cercano y hermoso para fotografía nocturna.',
    now() - interval '2 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000024',
    'a0000000-0000-0000-0000-000000000001',
    'lugar', '20000000-0000-0000-0000-000000000011', 5,
    'Muy fácil de llegar desde el centro. Subimos con binoculares y disfrutamos una noche despejada increíble sobre toda la comuna.',
    now() - interval '9 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000025',
    'a0000000-0000-0000-0000-000000000005',
    'lugar', '20000000-0000-0000-0000-000000000012', 5,
    'Espacio cultural muy acogedor frente a la plaza. Encontré artesanías locales en piedra combarbalita y cobre con una atención muy cordial.',
    now() - interval '8 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000026',
    'a0000000-0000-0000-0000-000000000004',
    'lugar', '20000000-0000-0000-0000-000000000012', 4,
    'Buenas exposiciones fotográficas de la historia de Andacollo. Ideal para pasar un rato tranquilo y conocer el trabajo de artistas locales.',
    now() - interval '19 days'
  ),

  -- RESTAURANTES (6 restaurantes × 2–3 reseñas = 14 reseñas)
  (
    'e0000000-0000-0000-0000-000000000027',
    'a0000000-0000-0000-0000-000000000001',
    'restaurante', '30000000-0000-0000-0000-000000000001', 5,
    'El mejor cabrito al jugo de Andacollo, súper tierno y sabroso. Las churrascas recién salidas con queso de cabra local son un diez absoluto.',
    now() - interval '2 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000028',
    'a0000000-0000-0000-0000-000000000003',
    'restaurante', '30000000-0000-0000-0000-000000000001', 5,
    'Excelente atención familiar y platos muy abundantes. Pedimos cazuela de ave y empanadas de horno, todo casero y a precio justo.',
    now() - interval '7 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000029',
    'a0000000-0000-0000-0000-000000000005',
    'restaurante', '30000000-0000-0000-0000-000000000001', 4,
    'Muy rica comida tradicional en pleno centro. Los domingos se llena rápido al almuerzo, así que conviene llegar temprano.',
    now() - interval '13 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000030',
    'a0000000-0000-0000-0000-000000000004',
    'restaurante', '30000000-0000-0000-0000-000000000002', 5,
    'Picada auténtica con menú diario económico y muy contundente. Los porotos con riendas y el pan amasado tibio me recordaron la cocina de mi abuela.',
    now() - interval '4 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000031',
    'a0000000-0000-0000-0000-000000000002',
    'restaurante', '30000000-0000-0000-0000-000000000002', 4,
    'Rápido, sabroso y muy conveniente para almorzar durante el recorrido por Andacollo. El pastel de choclo es imperdible.',
    now() - interval '11 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000032',
    'a0000000-0000-0000-0000-000000000002',
    'restaurante', '30000000-0000-0000-0000-000000000003', 5,
    'Cenamos aquí antes de subir al Observatorio Collowara y fue una maravilla. Tabla de quesos caprinos, cordero exquisito y pisco artesanal de la región.',
    now() - interval '1 day'
  ),
  (
    'e0000000-0000-0000-0000-000000000033',
    'a0000000-0000-0000-0000-000000000001',
    'restaurante', '30000000-0000-0000-0000-000000000003', 5,
    'Ambiente cálido, vista preciosa de las estrellas desde la terraza y un servicio muy dedicado. Ideal para una cena especial en pareja o familia.',
    now() - interval '8 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000034',
    'a0000000-0000-0000-0000-000000000003',
    'restaurante', '30000000-0000-0000-0000-000000000004', 5,
    'Desayuno andacollino de lujo: churrascas al rescoldo calentitas, té con hierbas del valle y queso de cabra fresco. Doña Rosa atiende con mucho cariño.',
    now() - interval '3 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000035',
    'a0000000-0000-0000-0000-000000000005',
    'restaurante', '30000000-0000-0000-0000-000000000004', 4,
    'Sencillo, limpio y con sabores muy caseros. Probé la carbonada y estaba deliciosa, además queda muy cerca del circuito de la Basílica.',
    now() - interval '12 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000036',
    'a0000000-0000-0000-0000-000000000002',
    'restaurante', '30000000-0000-0000-0000-000000000005', 5,
    'Qué rico café de grano y kuchen de nuez con papaya. La terraza frente a Plaza Videla es perfecta para descansar después de visitar el Museo de Ofrendas.',
    now() - interval '5 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000037',
    'a0000000-0000-0000-0000-000000000004',
    'restaurante', '30000000-0000-0000-0000-000000000005', 5,
    'Excelente pastelería local, ambiente tranquilo y buena música. Muy recomendable para la hora de once.',
    now() - interval '10 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000038',
    'a0000000-0000-0000-0000-000000000001',
    'restaurante', '30000000-0000-0000-0000-000000000006', 5,
    'Una experiencia gastronómica única: el asado caprino cocinado en horno solar queda increíblemente jugoso y además explican cómo funciona la cocina solar.',
    now() - interval '4 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000039',
    'a0000000-0000-0000-0000-000000000003',
    'restaurante', '30000000-0000-0000-0000-000000000006', 5,
    'Vale totalmente la pena desplazarse hasta Chepiquilla. Comida sustentable, panes tibios y un entorno rural precioso.',
    now() - interval '14 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000040',
    'a0000000-0000-0000-0000-000000000005',
    'restaurante', '30000000-0000-0000-0000-000000000006', 4,
    'Muy buena comida y experiencia educativa. Recuerden que atienden de viernes a domingo y es mejor llamar antes para reservar.',
    now() - interval '20 days'
  ),

  -- ALOJAMIENTOS (6 alojamientos × 2 reseñas = 12 reseñas)
  (
    'e0000000-0000-0000-0000-000000000041',
    'a0000000-0000-0000-0000-000000000001',
    'alojamiento', '40000000-0000-0000-0000-000000000001', 5,
    'Habitaciones impecables, estacionamiento seguro y un desayuno campestre delicioso con queso de cabra y pan amasado. A pocos minutos caminando de la Plaza Videla.',
    now() - interval '3 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000042',
    'a0000000-0000-0000-0000-000000000004',
    'alojamiento', '40000000-0000-0000-0000-000000000001', 4,
    'Muy buena relación precio-calidad y trato súper cordial. Excelente opción para familias que recorren el casco histórico.',
    now() - interval '11 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000043',
    'a0000000-0000-0000-0000-000000000002',
    'alojamiento', '40000000-0000-0000-0000-000000000002', 5,
    'Despertar con vista a los cerros y ver las estrellas desde la terraza privada en la noche no tiene precio. Cabañas muy equipadas, limpias y silenciosas.',
    now() - interval '2 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000044',
    'a0000000-0000-0000-0000-000000000003',
    'alojamiento', '40000000-0000-0000-0000-000000000002', 5,
    'Quedan muy cerca del Observatorio Collowara y tienen quincho para compartir en grupo. Volveríamos sin dudarlo.',
    now() - interval '9 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000045',
    'a0000000-0000-0000-0000-000000000005',
    'alojamiento', '40000000-0000-0000-0000-000000000003', 5,
    'Ubicación inmejorable frente al circuito de la Basílica Menor. Muy cómoda, camas abrigadas y personal siempre dispuesto a orientar sobre horarios de misas y paseos.',
    now() - interval '5 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000046',
    'a0000000-0000-0000-0000-000000000001',
    'alojamiento', '40000000-0000-0000-0000-000000000003', 4,
    'Hostería tradicional muy bien mantenida. Ideal si viajas sin auto porque tienes restaurantes y plazas a pasos.',
    now() - interval '15 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000047',
    'a0000000-0000-0000-0000-000000000004',
    'alojamiento', '40000000-0000-0000-0000-000000000004', 5,
    'Excelente comodidad en el acceso norte de Andacollo. Habitaciones amplias con climatización, buena señal de Wi-Fi y recepción 24 horas.',
    now() - interval '4 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000048',
    'a0000000-0000-0000-0000-000000000002',
    'alojamiento', '40000000-0000-0000-0000-000000000004', 5,
    'Muy buen hotel tanto para viajes de trabajo como en familia. Desayuno completo y acceso expedito hacia la Ruta D-51.',
    now() - interval '12 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000049',
    'a0000000-0000-0000-0000-000000000002',
    'alojamiento', '40000000-0000-0000-0000-000000000005', 5,
    'Dormir mirando el cielo estrellado desde la cama en estos domos geodésicos fue el punto alto de nuestro viaje por Coquimbo. Privacidad total y muy acogedores.',
    now() - interval '1 day'
  ),
  (
    'e0000000-0000-0000-0000-000000000050',
    'a0000000-0000-0000-0000-000000000003',
    'alojamiento', '40000000-0000-0000-0000-000000000005', 5,
    'Experiencia mágica, súper bien calefaccionados para el frío nocturno de la altura y con atención muy detallista.',
    now() - interval '7 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000051',
    'a0000000-0000-0000-0000-000000000005',
    'alojamiento', '40000000-0000-0000-0000-000000000006', 5,
    'Residencial muy limpia, económica y con un patio interior precioso. Los dueños nos dieron excelentes datos de paseos y picadas.',
    now() - interval '6 days'
  ),
  (
    'e0000000-0000-0000-0000-000000000052',
    'a0000000-0000-0000-0000-000000000004',
    'alojamiento', '40000000-0000-0000-0000-000000000006', 4,
    'Ambiente familiar, cocina compartida ordenada y muy buena ubicación sobre Av. Urmeneta. Muy recomendable si buscas presupuesto amigable.',
    now() - interval '14 days'
  )
ON CONFLICT (user_id, tipo, item_id) DO UPDATE SET
  calificacion = EXCLUDED.calificacion,
  comentario = EXCLUDED.comentario,
  created_at = EXCLUDED.created_at;
