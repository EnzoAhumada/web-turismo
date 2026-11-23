import { supabase } from '../lib/supabase';

export async function getRestaurants({
  search = '',
  priceRange = null,
  limit = null,
  includeInactive = false,
} = {}) {
  let query = supabase.from('restaurantes').select('*');

  if (!includeInactive) {
    query = query.eq('activo', true);
  }
  if (search && search.trim()) {
    query = query.ilike('nombre', `%${search.trim()}%`);
  }
  if (priceRange) {
    query = query.eq('precio_rango', priceRange);
  }

  query = query.order('nombre', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error('No se pudieron cargar los restaurantes.');
  return data || [];
}

export async function getRestaurantById(id) {
  const { data, error } = await supabase
    .from('restaurantes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('No se pudo cargar el restaurante.');
  return data;
}

export async function getOtherRestaurants(excludeId, limit = 3) {
  const { data, error } = await supabase
    .from('restaurantes')
    .select('*')
    .eq('activo', true)
    .neq('id', excludeId)
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function saveRestaurant(payload, id = null) {
  if (id) {
    const { data, error } = await supabase
      .from('restaurantes')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Error al actualizar el restaurante.');
    return data;
  }
  const { data, error } = await supabase
    .from('restaurantes')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al crear el restaurante.');
  return data;
}

export async function deleteRestaurant(id) {
  const { error } = await supabase.from('restaurantes').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el restaurante.');
  return true;
}
