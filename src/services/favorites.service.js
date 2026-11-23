import { supabase } from '../lib/supabase';

export async function getUserFavoritesByType(userId, tipo) {
  if (!userId) return [];

  const { data: favRows, error } = await supabase
    .from('favoritos')
    .select('id, item_id, tipo')
    .eq('user_id', userId)
    .eq('tipo', tipo);

  if (error || !favRows || favRows.length === 0) {
    return [];
  }

  const ids = favRows.map((f) => f.item_id);

  if (tipo === 'lugar') {
    const { data } = await supabase
      .from('lugares')
      .select('id, nombre, imagen_url, rating_promedio, distancia_km, categorias(nombre)')
      .in('id', ids);
    return (data || []).map((d) => ({
      id: d.id,
      title: d.nombre,
      category: d.categorias?.nombre || 'Lugar turístico',
      image: d.imagen_url,
      rating: d.rating_promedio,
      distance: d.distancia_km ? `${d.distancia_km} km` : null,
      to: `/lugar/${d.id}`,
      favId: favRows.find((f) => f.item_id === d.id)?.id,
    }));
  }

  if (tipo === 'experiencia') {
    const { data } = await supabase
      .from('experiencias')
      .select('id, nombre, imagen_url, categoria, precio, rating_promedio')
      .in('id', ids);
    return (data || []).map((d) => ({
      id: d.id,
      title: d.nombre,
      category: d.categoria || 'Experiencia',
      image: d.imagen_url,
      rating: d.rating_promedio,
      to: `/experiencias/${d.id}`,
      favId: favRows.find((f) => f.item_id === d.id)?.id,
    }));
  }

  if (tipo === 'evento') {
    const { data } = await supabase
      .from('eventos')
      .select('id, nombre, imagen_url, categoria, fecha_inicio')
      .in('id', ids);
    return (data || []).map((d) => ({
      id: d.id,
      title: d.nombre,
      category: d.categoria || 'Evento',
      image: d.imagen_url,
      to: `/eventos/${d.id}`,
      favId: favRows.find((f) => f.item_id === d.id)?.id,
    }));
  }

  if (tipo === 'restaurante') {
    const { data } = await supabase
      .from('restaurantes')
      .select('id, nombre, imagen_url, precio_rango, rating_promedio')
      .in('id', ids);
    return (data || []).map((d) => ({
      id: d.id,
      title: d.nombre,
      category: d.precio_rango ? `Restaurante · ${d.precio_rango}` : 'Restaurante',
      image: d.imagen_url,
      rating: d.rating_promedio,
      to: `/restaurantes/${d.id}`,
      favId: favRows.find((f) => f.item_id === d.id)?.id,
    }));
  }

  if (tipo === 'alojamiento') {
    const { data } = await supabase
      .from('alojamientos')
      .select('id, nombre, imagen_url, precio_por_noche, rating_promedio')
      .in('id', ids);
    return (data || []).map((d) => ({
      id: d.id,
      title: d.nombre,
      category: 'Alojamiento',
      image: d.imagen_url,
      rating: d.rating_promedio,
      to: `/alojamientos/${d.id}`,
      favId: favRows.find((f) => f.item_id === d.id)?.id,
    }));
  }

  return [];
}

export async function isItemFavorite(userId, tipo, itemId) {
  if (!userId || !itemId) return false;
  const { data } = await supabase
    .from('favoritos')
    .select('id')
    .eq('user_id', userId)
    .eq('tipo', tipo)
    .eq('item_id', itemId)
    .maybeSingle();
  return Boolean(data);
}

export async function toggleFavoriteItem(userId, tipo, itemId, currentlySaved) {
  if (!userId || !itemId) return false;
  if (currentlySaved) {
    await supabase
      .from('favoritos')
      .delete()
      .eq('user_id', userId)
      .eq('tipo', tipo)
      .eq('item_id', itemId);
    return false;
  }
  await supabase.from('favoritos').insert({
    user_id: userId,
    tipo,
    item_id: itemId,
  });
  return true;
}

export async function removeFavoriteById(favId) {
  const { error } = await supabase.from('favoritos').delete().eq('id', favId);
  if (error) throw new Error('No se pudo eliminar de favoritos.');
  return true;
}

export async function getUserFavoritesCount(userId) {
  if (!userId) return 0;
  const { count, error } = await supabase
    .from('favoritos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) return 0;
  return count || 0;
}

export async function getUserEventFavoritesIds(userId) {
  if (!userId) return [];
  const { data } = await supabase
    .from('favoritos')
    .select('item_id')
    .eq('user_id', userId)
    .eq('tipo', 'evento');
  return (data || []).map((r) => r.item_id);
}
