import { supabase } from '../lib/supabase';
import {
  distanceFromCenter,
  googleMapsQuery,
  storedCoords,
} from '../lib/andacolloGeo';

function toPin(row, extra) {
  const coords = storedCoords(row.latitud, row.longitud);
  const query = googleMapsQuery({
    nombre: row.nombre,
    direccion: row.direccion,
  });

  return {
    id: row.id,
    label: row.nombre,
    address: row.direccion || 'Andacollo',
    image: row.imagen_url,
    rating: row.rating_promedio || null,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    mapsQuery: query,
    distance: coords ? distanceFromCenter(coords.lat, coords.lng) : null,
    ...extra,
  };
}

export async function getMapPins({ typeFilter = 'Todos', search = '' } = {}) {
  const [
    { data: placesData, error: placesError },
    { data: restaurantsData, error: restaurantsError },
    { data: accommodationsData, error: accommodationsError },
  ] = await Promise.all([
    supabase.from('lugares').select('*, categorias(nombre, slug)').eq('activo', true),
    supabase.from('restaurantes').select('*').eq('activo', true),
    supabase.from('alojamientos').select('*').eq('activo', true),
  ]);

  if (placesError && restaurantsError && accommodationsError) {
    throw new Error('No se pudieron cargar los puntos del mapa.');
  }

  const placePins = (placesData || []).map((place) =>
    toPin(place, {
      type: 'lugar',
      filterGroup: 'Lugares',
      categoryLabel: place.categorias?.nombre || 'Lugar turístico',
      color: '#0b5d66',
      to: `/lugar/${place.id}`,
    })
  );

  const restaurantPins = (restaurantsData || []).map((restaurant) =>
    toPin(restaurant, {
      type: 'restaurante',
      filterGroup: 'Restaurantes',
      categoryLabel: restaurant.precio_rango
        ? `Restaurante · ${restaurant.precio_rango}`
        : 'Restaurante',
      color: '#e67e22',
      to: `/restaurantes/${restaurant.id}`,
    })
  );

  const accommodationPins = (accommodationsData || []).map((stay) =>
    toPin(stay, {
      type: 'hospedaje',
      filterGroup: 'Hospedajes',
      categoryLabel: stay.tipo || 'Alojamiento',
      color: '#1f8a4c',
      to: `/alojamientos/${stay.id}`,
    })
  );

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
        pin.categoryLabel.toLowerCase().includes(q) ||
        pin.address.toLowerCase().includes(q)
    );
  }

  return allPins;
}
