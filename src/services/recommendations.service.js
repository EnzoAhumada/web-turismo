import { supabase } from '../lib/supabase';

export async function getHomeHighlights() {
  const { data } = await supabase
    .from('destacados_dia')
    .select('*')
    .eq('activo', true)
    .eq('mostrar_home', true)
    .order('orden', { ascending: true })
    .limit(1);

  return (data && data[0]) || null;
}

export async function getRecommendationsPageData() {
  const [
    { data: highlightsData },
    { data: placesData },
    { data: restaurantsData },
    { data: experiencesData },
    { data: eventsData },
  ] = await Promise.all([
    supabase
      .from('destacados_dia')
      .select('*')
      .eq('activo', true)
      .eq('mostrar_recomendaciones', true)
      .order('orden', { ascending: true }),
    supabase
      .from('lugares')
      .select('*, categorias(nombre, slug)')
      .eq('activo', true)
      .order('rating_promedio', { ascending: false })
      .limit(4),
    supabase
      .from('restaurantes')
      .select('*')
      .eq('activo', true)
      .order('rating_promedio', { ascending: false })
      .limit(2),
    supabase
      .from('experiencias')
      .select('*')
      .eq('disponible', true)
      .order('rating_promedio', { ascending: false })
      .limit(2),
    supabase
      .from('eventos')
      .select('*')
      .eq('activo', true)
      .order('fecha_inicio', { ascending: true })
      .limit(2),
  ]);

  const highlights = (highlightsData || []).map((h) => ({
    id: h.id,
    type: h.tipo,
    icon: h.icono,
    title: h.titulo,
    desc: h.descripcion,
    cta: h.cta_texto,
    ctaTo: h.cta_ruta,
    variant: h.variante,
  }));

  const forYou = (placesData || []).slice(0, 3).map((p) => ({
    id: p.id,
    title: p.nombre,
    subtitle: p.subtitulo || p.categorias?.nombre || 'Lugar destacado',
    rating: p.rating_promedio,
    reviewsCount: p.resenas_count,
    distance: p.distancia_km ? `${p.distancia_km} km` : null,
    image: p.imagen_url,
    badge: p.badge_texto,
    to: `/lugar/${p.id}`,
  }));

  const otherRecs = [
    ...(placesData || []).slice(3).map((p) => ({
      id: `lugar-${p.id}`,
      title: p.nombre,
      category: p.categorias?.nombre || 'Naturaleza',
      date: p.horario || 'Abierto ahora',
      image: p.imagen_url,
      rating: p.rating_promedio || 4.7,
      to: `/lugar/${p.id}`,
    })),
    ...(restaurantsData || []).slice(0, 1).map((r) => ({
      id: `rest-${r.id}`,
      title: r.nombre,
      category: 'Restaurantes',
      date: r.horario || 'Abierto hoy',
      image: r.imagen_url,
      rating: r.rating_promedio || 4.6,
      to: `/restaurantes/${r.id}`,
    })),
    ...(experiencesData || []).slice(0, 1).map((exp) => ({
      id: `exp-${exp.id}`,
      title: exp.nombre,
      category: 'Experiencias',
      date: exp.duracion || 'Previa reserva',
      image: exp.imagen_url,
      rating: exp.rating_promedio || 4.8,
      to: `/experiencias/${exp.id}`,
    })),
    ...(eventsData || []).slice(0, 1).map((ev) => ({
      id: `ev-${ev.id}`,
      title: ev.nombre,
      category: 'Eventos',
      date: ev.fecha_inicio
        ? new Date(ev.fecha_inicio + 'T12:00:00').toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Próximamente',
      image: ev.imagen_url,
      rating: 4.8,
      to: `/eventos/${ev.id}`,
    })),
  ];

  return {
    highlights,
    forYou,
    otherRecs,
  };
}
