import { supabase } from '../lib/supabase';

export async function getEvents({
  search = '',
  onlyAstronomic = false,
  limit = null,
  includeInactive = false,
} = {}) {
  let query = supabase.from('eventos').select('*');

  if (!includeInactive) {
    query = query.eq('activo', true);
  }
  if (search && search.trim()) {
    query = query.ilike('nombre', `%${search.trim()}%`);
  }
  if (onlyAstronomic) {
    query = query.eq('es_astronomico', true);
  }

  query = query.order('fecha_inicio', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error('No se pudieron cargar los eventos.');
  return data || [];
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('No se pudo cargar el evento.');
  return data;
}

export async function getOtherEvents(excludeId, limit = 3) {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('activo', true)
    .neq('id', excludeId)
    .order('fecha_inicio', { ascending: true })
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function saveEvent(payload, id = null) {
  if (id) {
    const { data, error } = await supabase
      .from('eventos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Error al actualizar el evento.');
    return data;
  }
  const { data, error } = await supabase
    .from('eventos')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message || 'Error al crear el evento.');
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase.from('eventos').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Error al eliminar el evento.');
  return true;
}
