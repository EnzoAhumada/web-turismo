import { supabase } from '../lib/supabase';
import { getCategories } from './categories.service';

export async function getPlannerOptions() {
  const categories = await getCategories({ onlyPlanner: true });

  const interests = categories.map((c) => ({
    id: c.slug,
    label: c.nombre,
    categoryId: c.id,
  }));

  const durations = ['Medio día', '1 día', '2 – 3 días', '+3 días'];
  const budgets = ['Económico', 'Moderado', 'Premium'];

  return {
    durations,
    interests,
    budgets,
  };
}

function formatClp(amount) {
  if (!amount || Number.isNaN(Number(amount))) return 'Entrada liberada';
  return `$${Number(amount).toLocaleString('es-CL')} CLP`;
}

function formatEventDate(dateStr) {
  if (!dateStr) return 'Próximamente';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
  });
}

async function fetchCatalogForPlanner() {
  const [
    { data: placesData, error: placesErr },
    { data: experiencesData },
    { data: restaurantsData },
    { data: eventsData },
  ] = await Promise.all([
    supabase
      .from('lugares')
      .select('id, nombre, subtitulo, descripcion, tiempo_estimado, es_gratis, es_astronomico, categorias(slug, nombre)')
      .eq('activo', true)
      .order('rating_promedio', { ascending: false }),
    supabase
      .from('experiencias')
      .select('id, nombre, descripcion, categoria, precio, duracion')
      .eq('disponible', true)
      .order('rating_promedio', { ascending: false }),
    supabase
      .from('restaurantes')
      .select('id, nombre, especialidad, precio_rango, descripcion')
      .eq('activo', true)
      .order('rating_promedio', { ascending: false }),
    supabase
      .from('eventos')
      .select('id, nombre, descripcion, categoria, fecha_inicio, es_astronomico')
      .eq('activo', true)
      .order('fecha_inicio', { ascending: true }),
  ]);

  if (placesErr) {
    throw new Error('No se pudieron cargar los datos de Andacollo para el planificador.');
  }

  return {
    places: placesData || [],
    experiences: experiencesData || [],
    restaurants: restaurantsData || [],
    events: eventsData || [],
  };
}

function buildStopFromPlace(place, time) {
  return {
    id: `lugar-${place.id}-${time}`,
    entityId: place.id,
    entityType: 'lugar',
    time,
    title: place.nombre,
    description: place.subtitulo || place.descripcion?.slice(0, 110) || 'Atractivo patrimonial de Andacollo.',
    typeLabel: place.categorias?.nombre ? `Lugar · ${place.categorias.nombre}` : 'Lugar turístico',
    duration: place.tiempo_estimado || '1.5 h',
    costLabel: place.es_gratis ? 'Gratuito' : 'Tarifa local',
    icon: place.es_astronomico ? 'moon-star' : 'map-pin',
    routePath: `/lugar/${place.id}`,
  };
}

function buildStopFromRestaurant(rest, time) {
  return {
    id: `rest-${rest.id}-${time}`,
    entityId: rest.id,
    entityType: 'restaurante',
    time,
    title: rest.nombre,
    description: rest.especialidad || rest.descripcion?.slice(0, 110) || 'Gastronomía típica andacollina.',
    typeLabel: 'Gastronomía',
    duration: '1 h 15 min',
    costLabel: rest.precio_rango === '$' ? 'Económico' : rest.precio_rango === '$$$' ? 'Especial' : 'Moderado',
    icon: 'utensils',
    routePath: `/restaurantes/${rest.id}`,
  };
}

function buildStopFromExperience(exp, time) {
  return {
    id: `exp-${exp.id}-${time}`,
    entityId: exp.id,
    entityType: 'experiencia',
    time,
    title: exp.nombre,
    description: exp.descripcion?.slice(0, 120) || 'Actividad local guiada en Andacollo.',
    typeLabel: `Actividad · ${exp.categoria || 'Experiencia'}`,
    duration: exp.duracion || '2 h',
    costLabel: formatClp(exp.precio),
    icon: 'compass',
    routePath: `/experiencias/${exp.id}`,
  };
}

function buildStopFromEvent(ev, time) {
  return {
    id: `ev-${ev.id}-${time}`,
    entityId: ev.id,
    entityType: 'evento',
    time,
    title: ev.nombre,
    description: ev.descripcion?.slice(0, 120) || 'Evento cultural o festividad de Andacollo.',
    typeLabel: `Evento · ${formatEventDate(ev.fecha_inicio)}`,
    duration: '1.5 h',
    costLabel: 'Acceso comunitario',
    icon: 'calendar',
    routePath: `/eventos/${ev.id}`,
  };
}

function pickByInterest(places, selectedInterests, usedIds) {
  const preferred = places.find(
    (p) =>
      !usedIds.has(p.id) &&
      (selectedInterests.length === 0 || selectedInterests.includes(p.categorias?.slug))
  );
  const chosen = preferred || places.find((p) => !usedIds.has(p.id));
  if (chosen) usedIds.add(chosen.id);
  return chosen || null;
}

function buildStructuredItinerary({
  catalog,
  selectedInterests = [],
  duration = '1 día',
  budget = 'Moderado',
  isExample = false,
}) {
  const { places, experiences, restaurants, events } = catalog;
  const dayCount =
    duration === 'Medio día' ? 1 : duration === '1 día' ? 1 : duration === '2 – 3 días' ? 2 : 3;

  const usedPlaces = new Set();
  const usedExperiences = new Set();
  const usedRestaurants = new Set();
  const usedEvents = new Set();

  const astroPlace = places.find((p) => p.es_astronomico);
  const nonAstroPlaces = places.filter((p) => !p.es_astronomico);
  const dayTitles = [
    'Patrimonio, Sabores y Cielos de Andacollo',
    'Ruta Minera, Naturaleza y Cultura Viva',
    'Miradores, Tradición y Experiencias del Valle',
  ];

  const days = [];
  let totalEstimatedClp = 0;

  for (let d = 0; d < dayCount; d += 1) {
    const morningStops = [];
    const afternoonStops = [];
    const nightStops = [];

    const firstPlace = pickByInterest(nonAstroPlaces, selectedInterests, usedPlaces);
    if (firstPlace) morningStops.push(buildStopFromPlace(firstPlace, '09:30'));

    const morningExp = experiences.find((ex) => !usedExperiences.has(ex.id));
    if (morningExp) {
      usedExperiences.add(morningExp.id);
      morningStops.push(buildStopFromExperience(morningExp, '11:15'));
      if (morningExp.precio) totalEstimatedClp += Number(morningExp.precio);
    }

    const lunchRest =
      restaurants.find((r) => !usedRestaurants.has(r.id) && (budget !== 'Económico' || r.precio_rango === '$')) ||
      restaurants.find((r) => !usedRestaurants.has(r.id));
    if (lunchRest) {
      usedRestaurants.add(lunchRest.id);
      afternoonStops.push(buildStopFromRestaurant(lunchRest, '13:30'));
      totalEstimatedClp += budget === 'Económico' ? 9000 : budget === 'Premium' ? 22000 : 14000;
    }

    if (duration !== 'Medio día') {
      const secondPlace = pickByInterest(nonAstroPlaces, selectedInterests, usedPlaces);
      if (secondPlace) afternoonStops.push(buildStopFromPlace(secondPlace, '15:45'));

      const dayEvent = events.find((ev) => !usedEvents.has(ev.id));
      if (dayEvent) {
        usedEvents.add(dayEvent.id);
        afternoonStops.push(buildStopFromEvent(dayEvent, '17:30'));
      }

      if (d === 0 && astroPlace && !usedPlaces.has(astroPlace.id)) {
        usedPlaces.add(astroPlace.id);
        nightStops.push(buildStopFromPlace(astroPlace, '20:30'));
      } else {
        const nightExp = experiences.find((ex) => !usedExperiences.has(ex.id));
        if (nightExp) {
          usedExperiences.add(nightExp.id);
          nightStops.push(buildStopFromExperience(nightExp, '20:30'));
          if (nightExp.precio) totalEstimatedClp += Number(nightExp.precio);
        } else {
          const dinnerRest = restaurants.find((r) => !usedRestaurants.has(r.id));
          if (dinnerRest) {
            usedRestaurants.add(dinnerRest.id);
            nightStops.push(buildStopFromRestaurant(dinnerRest, '20:30'));
          }
        }
      }
    }

    const blocks = [
      { period: 'Mañana', stops: morningStops },
      { period: 'Tarde', stops: afternoonStops },
      { period: 'Noche', stops: nightStops },
    ].filter((block) => block.stops.length > 0);

    days.push({
      dayNumber: d + 1,
      label: `Día ${d + 1} · ${dayTitles[d % dayTitles.length]}`,
      blocks,
    });
  }

  return {
    id: isExample ? 'ejemplo-andacollo' : `ruta-${Date.now()}`,
    title: isExample
      ? 'Itinerario de Ejemplo: Un Día Inolvidable en Andacollo'
      : `Tu Itinerario Personalizado (${duration})`,
    subtitle: isExample
      ? 'Ejemplo real combinando lugares patrimoniales, gastronomía local, actividades y eventos de la comuna.'
      : `Ruta optimizada para presupuesto ${budget.toLowerCase()} con lugares, actividades y eventos reales.`,
    duration,
    budget,
    estimatedCost: totalEstimatedClp > 0 ? `$${totalEstimatedClp.toLocaleString('es-CL')} CLP aprox.` : 'Desde $10.000 CLP',
    isExample,
    days,
  };
}

export async function getExampleItinerary() {
  const catalog = await fetchCatalogForPlanner();
  return buildStructuredItinerary({
    catalog,
    selectedInterests: ['religion', 'astronomia', 'cultura', 'gastronomia'],
    duration: '1 día',
    budget: 'Moderado',
    isExample: true,
  });
}

export async function generateItinerary({
  selectedInterests = [],
  duration = '1 día',
  budget = 'Moderado',
}) {
  const catalog = await fetchCatalogForPlanner();
  return buildStructuredItinerary({
    catalog,
    selectedInterests,
    duration,
    budget,
    isExample: false,
  });
}

export async function completeItineraryForUser(userId, xpReward = 120) {
  if (!userId) return null;

  const { data: current, error: readErr } = await supabase
    .from('profiles')
    .select('xp, rutas_completadas')
    .eq('id', userId)
    .single();

  if (readErr) throw new Error('No se pudo leer tu perfil para registrar la ruta.');

  const nextXp = (current?.xp || 0) + xpReward;
  const nextRoutes = (current?.rutas_completadas || 0) + 1;
  const nextLevel = Math.floor(nextXp / 500) + 1;

  const { data: updated, error: updateErr } = await supabase
    .from('profiles')
    .update({
      xp: nextXp,
      rutas_completadas: nextRoutes,
      nivel: nextLevel,
    })
    .eq('id', userId)
    .select()
    .single();

  if (updateErr) throw new Error('No se pudo registrar la ruta completada.');
  return updated;
}
