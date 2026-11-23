import { supabase } from '../lib/supabase';

export async function getExperiences({
  search = '',
  category = '',
  limit = null,
} = {}) {
  let query = supabase.from('experiencias').select('*');

  if (search && search.trim()) {
    query = query.ilike('nombre', `%${search.trim()}%`);
  }
  if (category && category !== 'Todas') {
    query = query.eq('categoria', category);
  }

  query = query.order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error('No se pudieron cargar las experiencias.');
  return data || [];
}

export async function getExperienceById(id) {
  const { data, error } = await supabase
    .from('experiencias')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('No se pudo cargar la experiencia.');
  return data;
}

export async function getOtherExperiences(excludeId, limit = 3) {
  const { data, error } = await supabase
    .from('experiencias')
    .select('*')
    .neq('id', excludeId)
    .limit(limit);
  if (error) return [];
  return data || [];
}
