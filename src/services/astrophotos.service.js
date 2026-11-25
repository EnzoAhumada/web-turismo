import { supabase } from '../lib/supabase';

export const ASTRO_SPOTS = [
  'Cerro Yahuín',
  'Mirador La Caldera',
  'Observatorio Collowara',
  'Ruta Minera',
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function formatRelativeDate(iso) {
  if (!iso) return 'Reciente';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 2) return 'Justo ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} hora${hours === 1 ? '' : 's'}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ayer';
  if (days < 30) return `Hace ${days} días`;
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function mapPhotoRow(row, likedSet) {
  const author = row.profiles || {};
  const authorName =
    `${author.nombre || ''} ${author.apellido || ''}`.trim() || 'Astrofotógrafo Local';
  return {
    id: row.id,
    authorId: row.author_id,
    authorHandle: author.handle || row.author_id,
    authorName,
    authorAvatar: author.avatar_url || '',
    authorRole: author.rol_fotografico || author.titulo_nivel || 'Comunidad ThakiGo',
    title: row.titulo,
    spot: row.spot,
    description: row.descripcion,
    image: row.imagen_url,
    likes: Number(row.likes_count || 0),
    liked: likedSet ? likedSet.has(row.id) : false,
    createdAt: row.created_at,
    dateLabel: formatRelativeDate(row.created_at),
    exif: {
      camera: row.exif_camera || 'Cámara / Smartphone',
      iso: row.exif_iso || 'ISO 1600',
      shutter: row.exif_shutter || '30 seg',
      aperture: row.exif_aperture || 'f/2.8',
    },
  };
}

export async function getAstroPhotos({
  spot = 'Todos',
  sortBy = 'recent',
  authorId = null,
  userId = null,
} = {}) {
  let query = supabase
    .from('astro_photos')
    .select(
      'id, author_id, titulo, spot, descripcion, imagen_url, exif_camera, exif_iso, exif_shutter, exif_aperture, likes_count, activo, created_at, profiles:author_id(id, nombre, apellido, avatar_url, handle, rol_fotografico, titulo_nivel)'
    )
    .eq('activo', true);

  if (spot && spot !== 'Todos') {
    query = query.eq('spot', spot);
  }
  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  if (sortBy === 'likes') {
    query = query
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message || 'No se pudieron cargar las astrofotografías.');
  }

  const likedSet = new Set();
  if (userId && data && data.length > 0) {
    const ids = data.map((p) => p.id);
    const { data: likesData } = await supabase
      .from('astro_photo_likes')
      .select('photo_id')
      .eq('user_id', userId)
      .in('photo_id', ids);
    (likesData || []).forEach((l) => likedSet.add(l.photo_id));
  }

  return (data || []).map((row) => mapPhotoRow(row, likedSet));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadAstroPhotoFile(file, userId) {
  if (!file) throw new Error('Selecciona un archivo de imagen válido.');
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP).');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('La imagen supera el límite máximo de 5 MB.');
  }

  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${userId || 'public'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`;

  try {
    const { error: uploadErr } = await supabase.storage
      .from('astro-photos')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (!uploadErr) {
      const { data: pub } = supabase.storage.from('astro-photos').getPublicUrl(path);
      if (pub?.publicUrl) return pub.publicUrl;
    }
  } catch {
    // Fallback controlado a DataURL cuando el bucket Storage no está provisionado
  }

  return readFileAsDataUrl(file);
}

export async function createAstroPhoto({
  authorId,
  titulo,
  spot,
  descripcion,
  imagenUrl,
  exifCamera,
  exifIso,
  exifShutter,
  exifAperture,
}) {
  if (!authorId) throw new Error('Debes iniciar sesión para publicar una astrofotografía.');
  if (!titulo?.trim()) throw new Error('Ingresa un título para tu captura.');
  if (!descripcion?.trim()) throw new Error('Agrega una breve historia o descripción de la toma.');

  const payload = {
    author_id: authorId,
    titulo: titulo.trim(),
    spot: spot || 'Cerro Yahuín',
    descripcion: descripcion.trim(),
    imagen_url: imagenUrl || 'preset:milkyway',
    exif_camera: exifCamera?.trim() || 'Cámara / Smartphone',
    exif_iso: exifIso?.trim() || 'ISO 1600',
    exif_shutter: exifShutter?.trim() || '30 seg',
    exif_aperture: exifAperture?.trim() || 'f/2.8',
    base_likes: 0,
    likes_count: 0,
    activo: true,
  };

  const { data, error } = await supabase
    .from('astro_photos')
    .insert(payload)
    .select(
      'id, author_id, titulo, spot, descripcion, imagen_url, exif_camera, exif_iso, exif_shutter, exif_aperture, likes_count, activo, created_at, profiles:author_id(id, nombre, apellido, avatar_url, handle, rol_fotografico, titulo_nivel)'
    )
    .single();

  if (error) {
    throw new Error(error.message || 'No se pudo publicar la astrofotografía.');
  }

  return mapPhotoRow(data, new Set());
}

export async function toggleAstroPhotoLike(photoId, userId, currentlyLiked) {
  if (!userId) {
    throw new Error('Inicia sesión para valorar astrofotografías.');
  }

  if (currentlyLiked) {
    const { error } = await supabase
      .from('astro_photo_likes')
      .delete()
      .eq('photo_id', photoId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message || 'No se pudo quitar el Me gusta.');
  } else {
    const { error } = await supabase
      .from('astro_photo_likes')
      .insert({ photo_id: photoId, user_id: userId });
    if (error && error.code !== '23505') {
      throw new Error(error.message || 'No se pudo registrar tu Me gusta.');
    }
  }

  const { data: updated } = await supabase
    .from('astro_photos')
    .select('likes_count')
    .eq('id', photoId)
    .single();

  return {
    liked: !currentlyLiked,
    likes: Number(updated?.likes_count ?? 0),
  };
}

export async function deleteAstroPhoto(photoId) {
  const { error } = await supabase.from('astro_photos').delete().eq('id', photoId);
  if (error) throw new Error(error.message || 'No se pudo eliminar la captura.');
}
