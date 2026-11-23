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

export async function generateItinerary({ selectedInterests = [], duration = '1 día', budget = 'Moderado' }) {
  const { data, error } = await supabase
    .from('rutas_paradas')
    .select('*, categorias(slug, nombre)')
    .order('orden', { ascending: true });

  if (error) throw new Error('No se pudo generar la ruta desde la base de datos.');

  const allStops = data || [];
  let filtered = allStops;

  if (selectedInterests.length > 0) {
    const matched = allStops.filter(
      (stop) => !stop.categorias?.slug || selectedInterests.includes(stop.categorias.slug)
    );
    if (matched.length >= 2) {
      filtered = matched;
    }
  }

  if (duration === 'Medio día') {
    filtered = filtered.slice(0, 3);
  }

  return filtered.map((stop) => ({
    id: stop.id,
    lugarId: stop.lugar_id,
    time: stop.hora,
    title: stop.titulo,
    type: stop.tipo_etiqueta,
    duration: stop.duracion_estimada,
    icon: stop.icono,
    budget: stop.presupuesto || budget,
  }));
}
