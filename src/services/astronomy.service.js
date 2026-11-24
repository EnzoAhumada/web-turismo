import { supabase } from '../lib/supabase';

export async function getAstronomyPageData() {
  const [
    { data: conditionsData },
    { data: timesData },
    { data: resourcesData },
    { data: spotsData },
    { data: eventsData },
  ] = await Promise.all([
    supabase
      .from('astronomia_condiciones')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true }),
    supabase
      .from('astronomia_horarios')
      .select('*')
      .order('orden', { ascending: true }),
    supabase
      .from('astronomia_recursos')
      .select('*')
      .order('orden', { ascending: true }),
    supabase
      .from('lugares')
      .select('*')
      .eq('activo', true)
      .eq('es_astronomico', true)
      .order('rating_promedio', { ascending: false })
      .limit(6),
    supabase
      .from('eventos')
      .select('*')
      .eq('activo', true)
      .eq('es_astronomico', true)
      .order('fecha_inicio', { ascending: true })
      .limit(5),
  ]);

  const conditions = (conditionsData || []).map((c) => ({
    id: c.id,
    icon: c.icono,
    label: c.etiqueta,
    value: c.valor,
    updatedAt: c.updated_at || null,
  }));

  const times = (timesData || []).map((t) => ({
    id: t.id,
    time: t.hora,
    label: t.etiqueta,
    icon: t.icono,
    quality: t.calidad,
  }));

  const spots = (spotsData || []).map((s) => ({
    id: s.id,
    title: s.nombre,
    desc: s.subtitulo || s.descripcion,
    rating: s.rating_promedio || 4.8,
    distance: s.distancia_km ? `${s.distancia_km} km` : '5.0 km',
    image: s.imagen_url,
    badge: s.badge_texto,
  }));

  const events = (eventsData || []).map((ev) => ({
    id: ev.id,
    date: ev.fecha_inicio
      ? new Date(ev.fecha_inicio + 'T12:00:00').toLocaleDateString('es-CL', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '',
    title: ev.nombre,
    desc: ev.descripcion,
  }));

  const tips = (resourcesData || []).filter((r) => r.tipo === 'consejo');
  const gear = (resourcesData || []).filter((r) => r.tipo === 'equipo');

  return {
    conditions,
    times,
    spots,
    events,
    tip: tips[0] || null,
    gear,
  };
}

export async function getAstronomyAdminData() {
  const [
    { data: conditions, error: condErr },
    { data: schedules, error: schedErr },
    { data: resources, error: resErr },
    { data: places, error: placesErr },
  ] = await Promise.all([
    supabase.from('astronomia_condiciones').select('*').order('orden', { ascending: true }),
    supabase.from('astronomia_horarios').select('*').order('orden', { ascending: true }),
    supabase.from('astronomia_recursos').select('*').order('orden', { ascending: true }),
    supabase
      .from('lugares')
      .select('id, nombre, subtitulo, rating_promedio, distancia_km, es_astronomico, activo')
      .order('es_astronomico', { ascending: false })
      .order('nombre', { ascending: true }),
  ]);

  if (condErr || schedErr || resErr || placesErr) {
    throw new Error('No se pudieron cargar los datos de administración de astronomía.');
  }

  return {
    conditions: conditions || [],
    schedules: schedules || [],
    resources: resources || [],
    places: places || [],
  };
}

export async function saveAstronomyCondition(condition) {
  const payload = {
    etiqueta: condition.etiqueta?.trim(),
    valor: condition.valor?.trim(),
    icono: condition.icono || 'sun',
    orden: Number(condition.orden) || 1,
    activo: condition.activo !== false,
    updated_at: new Date().toISOString(),
  };

  const query = condition.id
    ? supabase.from('astronomia_condiciones').update(payload).eq('id', condition.id)
    : supabase.from('astronomia_condiciones').insert(payload);

  const { error } = await query;
  if (error) throw new Error(error.message || 'No se pudo guardar la condición astronómica.');
}

export async function deleteAstronomyCondition(id) {
  const { error } = await supabase.from('astronomia_condiciones').delete().eq('id', id);
  if (error) throw new Error(error.message || 'No se pudo eliminar la condición.');
}

export async function saveAstronomySchedule(schedule) {
  const payload = {
    hora: schedule.hora?.trim(),
    etiqueta: schedule.etiqueta?.trim(),
    icono: schedule.icono || 'moon-star',
    calidad: schedule.calidad === 'best' ? 'best' : 'good',
    orden: Number(schedule.orden) || 1,
  };

  const query = schedule.id
    ? supabase.from('astronomia_horarios').update(payload).eq('id', schedule.id)
    : supabase.from('astronomia_horarios').insert(payload);

  const { error } = await query;
  if (error) throw new Error(error.message || 'No se pudo guardar el horario astronómico.');
}

export async function deleteAstronomySchedule(id) {
  const { error } = await supabase.from('astronomia_horarios').delete().eq('id', id);
  if (error) throw new Error(error.message || 'No se pudo eliminar el horario.');
}

export async function saveAstronomyResource(resource) {
  const payload = {
    tipo: resource.tipo === 'equipo' ? 'equipo' : 'consejo',
    icono: resource.icono || 'lightbulb',
    titulo: resource.titulo?.trim() || null,
    contenido: resource.contenido?.trim(),
    orden: Number(resource.orden) || 1,
  };

  const query = resource.id
    ? supabase.from('astronomia_recursos').update(payload).eq('id', resource.id)
    : supabase.from('astronomia_recursos').insert(payload);

  const { error } = await query;
  if (error) throw new Error(error.message || 'No se pudo guardar el recurso astronómico.');
}

export async function deleteAstronomyResource(id) {
  const { error } = await supabase.from('astronomia_recursos').delete().eq('id', id);
  if (error) throw new Error(error.message || 'No se pudo eliminar el recurso.');
}

export async function togglePlaceAstronomical(placeId, esAstronomico) {
  const { error } = await supabase
    .from('lugares')
    .update({ es_astronomico: Boolean(esAstronomico) })
    .eq('id', placeId);
  if (error) throw new Error(error.message || 'No se pudo actualizar el lugar astronómico.');
}
