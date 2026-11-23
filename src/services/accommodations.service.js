import { supabase } from '../lib/supabase';

export async function getAccommodations({
  search = '',
  limit = null,
  includeInactive = false,
} = {}) {
  let query = supabase.from('alojamientos').select('*');

  if (!includeInactive) {
    query = query.eq('activo', true);
  }
  if (search && search.trim()) {
    query = query.ilike('nombre', `%${search.trim()}%`);
  }

  query = query.order('precio_por_noche', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error('No se pudieron cargar los alojamientos.');
  return data || [];
}

export async function getAccommodationById(id) {
  const { data, error } = await supabase
    .from('alojamientos')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('No se pudo cargar el alojamiento.');
  return data;
}

export async function getOtherAccommodations(excludeId, limit = 3) {
  const { data, error } = await supabase
    .from('alojamientos')
    .select('*')
    .eq('activo', true)
    .neq('id', excludeId)
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function saveAccommodation(payload, id = null) {
  if (id) {
    const { data, error } = await supabase
      .from('alojamientos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Error al actualizar el alojamiento.');
    return data;
  }
  const { data, error } = await supabase
    .from('alojamientos')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al crear el alojamiento.');
  return data;
}

export async function deleteAccommodation(id) {
  const { error } = await supabase.from('alojamientos').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el alojamiento.');
  return true;
}
