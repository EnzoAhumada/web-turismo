import { supabase } from '../lib/supabase';

export async function getDashboardStats() {
  const [
    { count: lugares },
    { count: restaurantes },
    { count: alojamientos },
    { count: eventos },
    { count: usuarios },
    { count: favoritos },
    { data: eventsData },
    { data: municipalData },
    { data: topPlacesData },
  ] = await Promise.all([
    supabase.from('lugares').select('*', { count: 'exact', head: true }),
    supabase.from('restaurantes').select('*', { count: 'exact', head: true }),
    supabase.from('alojamientos').select('*', { count: 'exact', head: true }),
    supabase.from('eventos').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('favoritos').select('*', { count: 'exact', head: true }),
    supabase
      .from('eventos')
      .select('id, nombre, fecha_inicio, categoria, activo')
      .order('fecha_inicio', { ascending: true })
      .limit(5),
    supabase
      .from('estadisticas_municipales')
      .select('*')
      .limit(1)
      .maybeSingle(),
    supabase
      .from('lugares')
      .select('id, nombre, rating_promedio, resenas_count')
      .eq('activo', true)
      .order('resenas_count', { ascending: false })
      .limit(3),
  ]);

  return {
    stats: {
      lugares: lugares || 0,
      restaurantes: restaurantes || 0,
      alojamientos: alojamientos || 0,
      eventos: eventos || 0,
      usuarios: usuarios || 0,
      favoritos: favoritos || 0,
    },
    municipal: municipalData || null,
    topPlaces: topPlacesData || [],
    recentEvents: eventsData || [],
  };
}

export async function getCrudRecords(table, orderColumn = 'created_at', ascending = false) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderColumn, { ascending });
  if (error) throw new Error(`No se pudieron cargar los registros de ${table}.`);
  return data || [];
}

export async function saveCrudRecord(table, payload, id = null) {
  if (id) {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'No se pudo actualizar el registro.');
    return data;
  }
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message || 'No se pudo crear el registro.');
  return data;
}

export async function deleteCrudRecord(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message || 'No se pudo eliminar el registro.');
  return true;
}
