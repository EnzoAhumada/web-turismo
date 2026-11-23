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
    desc: s.descripcion,
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
