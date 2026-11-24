import { supabase } from '../lib/supabase';

export async function getPlaces({
  search = '',
  categorySlug = '',
  onlyAstronomic = false,
  limit = null,
  includeInactive = false,
} = {}) {
  let query = supabase
    .from('lugares')
    .select('*, categorias(id, nombre, slug)');

  if (!includeInactive) {
    query = query.eq('activo', true);
  }
  if (search && search.trim()) {
    query = query.ilike('nombre', `%${search.trim()}%`);
  }
  if (onlyAstronomic) {
    query = query.eq('es_astronomico', true);
  }

  query = query.order('rating_promedio', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error('No se pudieron cargar los lugares turísticos.');

  let results = data || [];
  if (categorySlug && categorySlug.trim()) {
    results = results.filter((p) => p.categorias?.slug === categorySlug.trim());
  }
  return results;
}

export async function getPlaceById(id) {
  const { data, error } = await supabase
    .from('lugares')
    .select('*, categorias(id, nombre, slug)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('No se pudo cargar el detalle del lugar.');
  return data;
}

export async function getNearbyPlaces(excludeId, limit = 3) {
  const { data, error } = await supabase
    .from('lugares')
    .select('*, categorias(nombre, slug)')
    .eq('activo', true)
    .neq('id', excludeId)
    .order('rating_promedio', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function savePlace(payload, id = null) {
  if (id) {
    const { data, error } = await supabase
      .from('lugares')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Error al actualizar el lugar.');
    return data;
  }
  const { data, error } = await supabase
    .from('lugares')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al crear el lugar.');
  return data;
}

export async function deletePlace(id) {
  const { error } = await supabase.from('lugares').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el lugar.');
  return true;
}
