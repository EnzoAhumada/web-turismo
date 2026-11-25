export const ANDACOLLO_CENTER = { lat: -30.2312273, lng: -71.0847955 };

export function storedCoords(latitud, longitud) {
  const lat = Number(latitud);
  const lng = Number(longitud);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) return null;
  return { lat, lng };
}

export function distanceFromCenter(lat, lng) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthKm = 6371;
  const dLat = toRad(lat - ANDACOLLO_CENTER.lat);
  const dLng = toRad(lng - ANDACOLLO_CENTER.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(ANDACOLLO_CENTER.lat)) *
      Math.cos(toRad(lat)) *
      Math.sin(dLng / 2) ** 2;
  const km = earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  if (km < 0.15) return 'En el centro';
  return `${km.toFixed(1)} km`;
}

export function googleMapsQuery({ nombre, direccion }) {
  const parts = [nombre, direccion].filter(Boolean);
  const text = parts.join(', ');
  if (/chile/i.test(text)) return text;
  if (/andacollo/i.test(text)) return `${text}, Chile`;
  return `${text}, Andacollo, Región de Coquimbo, Chile`;
}

export function googleMapsEmbedUrl(query, zoom = 17) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&hl=es&t=m&output=embed`;
}

export function googleMapsDirectionsUrl(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function googleMapsPlaceUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
