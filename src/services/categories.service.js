import { supabase } from '../lib/supabase';

export async function getCategories({ onlyHome = false, onlyPlanner = false } = {}) {
  let query = supabase
    .from('categorias')
    .select('*')
    .order('orden', { ascending: true });

  if (onlyHome) {
    query = query.eq('mostrar_inicio', true);
  }
  if (onlyPlanner) {
    query = query.eq('mostrar_planificador', true);
  }

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return null;
  return data;
}
