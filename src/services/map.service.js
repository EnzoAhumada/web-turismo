import { supabase } from '../lib/supabase';

export async function getMapPins({ typeFilter = 'Todos', search = '' } = {}) {
  const [
    { data: placesData },
    { data: restaurantsData },
    { data: accommodationsData },
  ] = await Promise.all([
    supabase.from('lugares').select('*, categorias(nombre, slug)').eq('activo', true),
    supabase.from('restaurantes').select('*').eq('activo', true),
    supabase.from('alojamientos').select('*').eq('activo', true),
  ]);

  const placePins = (placesData || []).map((p, idx) => ({
    id: p.id,
    label: p.nombre,
    type: 'lugar',
    filterGroup: p.es_astronomico ? 'Rutas' : 'Lugares',
    categoryLabel: p.categorias?.nombre || 'Lugar turístico',
    image: p.imagen_url,
    rating: p.rating_promedio || 4.7,
    distance: p.distancia_km ? `${p.distancia_km} km` : '2.5 km',
    x: Number(p.mapa_x ?? (30 + (idx * 13) % 50)),
    y: Number(p.mapa_y ?? (28 + (idx * 17) % 45)),
    color: p.color_pin || 'var(--color-gold)',
    to: `/lugar/${p.id}`,
  }));

  const restaurantPins = (restaurantsData || []).map((r, idx) => ({
    id: r.id,
    label: r.nombre,
    type: 'restaurante',
    filterGroup: 'Restaurantes',
    categoryLabel: r.precio_rango ? `Restaurante · ${r.precio_rango}` : 'Restaurante',
    image: r.imagen_url,
    rating: r.rating_promedio || 4.6,
    distance: r.distancia_km ? `${r.distancia_km} km` : '1.2 km',
    x: Number(r.mapa_x ?? (42 + (idx * 11) % 35)),
    y: Number(r.mapa_y ?? (55 + (idx * 9) % 25)),
    color: r.color_pin || '#e67e22',
    to: `/restaurantes/${r.id}`,
  }));

  const accommodationPins = (accommodationsData || []).map((a, idx) => ({
    id: a.id,
    label: a.nombre,
    type: 'hospedaje',
    filterGroup: 'Hospedajes',
    categoryLabel: 'Alojamiento',
    image: a.imagen_url,
    rating: a.rating_promedio || 4.7,
    distance: a.distancia_km ? `${a.distancia_km} km` : '1.0 km',
    x: Number(a.mapa_x ?? (58 + (idx * 8) % 25)),
    y: Number(a.mapa_y ?? (48 + (idx * 11) % 25)),
    color: a.color_pin || '#27ae60',
    to: `/alojamientos/${a.id}`,
  }));

  let allPins = [...placePins, ...restaurantPins, ...accommodationPins];

  if (typeFilter && typeFilter !== 'Todos') {
    if (typeFilter === 'Rutas') {
      allPins = placePins;
    } else {
      allPins = allPins.filter((pin) => pin.filterGroup === typeFilter);
    }
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    allPins = allPins.filter(
      (pin) =>
        pin.label.toLowerCase().includes(q) ||
        pin.categoryLabel.toLowerCase().includes(q)
    );
  }

  return allPins;
}
