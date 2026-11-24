import { supabase } from '../lib/supabase';

export const ALLOWED_REVIEW_TYPES = ['lugar', 'restaurante', 'alojamiento'];
export const MIN_COMMENT_LENGTH = 5;
export const MAX_COMMENT_LENGTH = 600;

const REVIEW_SELECT = `
  id,
  user_id,
  tipo,
  item_id,
  calificacion,
  comentario,
  created_at,
  updated_at,
  autor:profiles (
    id,
    nombre,
    apellido,
    avatar_url,
    titulo_nivel
  )
`;

export function computeReviewsSummary(reviews = []) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const list = Array.isArray(reviews) ? reviews : [];
  const count = list.length;

  if (count === 0) {
    return { average: 0, count: 0, distribution };
  }

  let total = 0;
  for (const rev of list) {
    const score = Number(rev.calificacion) || 0;
    total += score;
    if (score >= 1 && score <= 5) {
      distribution[score] = (distribution[score] || 0) + 1;
    }
  }

  const average = Math.round((total / count) * 10) / 10;
  return { average, count, distribution };
}

export function validateReviewPayload({ calificacion, comentario }) {
  const rating = Number(calificacion);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return 'Selecciona una calificación entre 1 y 5 estrellas.';
  }

  const trimmed = String(comentario || '').trim();
  if (trimmed.length < MIN_COMMENT_LENGTH) {
    return `Escribe un comentario de al menos ${MIN_COMMENT_LENGTH} caracteres.`;
  }
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return `El comentario no puede superar los ${MAX_COMMENT_LENGTH} caracteres.`;
  }

  return null;
}

export async function getReviewsByEntity(tipo, itemId) {
  if (!ALLOWED_REVIEW_TYPES.includes(tipo) || !itemId) {
    return { reviews: [], summary: computeReviewsSummary([]) };
  }

  const { data, error } = await supabase
    .from('resenas')
    .select(REVIEW_SELECT)
    .eq('tipo', tipo)
    .eq('item_id', itemId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('No se pudieron cargar las reseñas en este momento.');
  }

  const reviews = data || [];
  return {
    reviews,
    summary: computeReviewsSummary(reviews),
  };
}

export async function createReview({ userId, tipo, itemId, calificacion, comentario }) {
  if (!userId) {
    throw new Error('Debes iniciar sesión para publicar una reseña.');
  }
  if (!ALLOWED_REVIEW_TYPES.includes(tipo) || !itemId) {
    throw new Error('No se pudo identificar el elemento a valorar.');
  }

  const validationError = validateReviewPayload({ calificacion, comentario });
  if (validationError) {
    throw new Error(validationError);
  }

  const payload = {
    user_id: userId,
    tipo,
    item_id: itemId,
    calificacion: Number(calificacion),
    comentario: String(comentario).trim(),
  };

  let { data, error } = await supabase
    .from('resenas')
    .insert(payload)
    .select(REVIEW_SELECT)
    .single();

  if (error && error.code === '23503') {
    await supabase.from('profiles').upsert(
      { id: userId, nombre: 'Viajero', apellido: '' },
      { onConflict: 'id' }
    );
    const retry = await supabase
      .from('resenas')
      .insert(payload)
      .select(REVIEW_SELECT)
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya publicaste una reseña aquí. Puedes editar tu valoración existente.');
    }
    throw new Error('No se pudo publicar tu reseña. Intenta nuevamente.');
  }

  return data;
}

export async function updateReview(reviewId, userId, { calificacion, comentario }) {
  if (!reviewId || !userId) {
    throw new Error('No se pudo verificar la reseña a actualizar.');
  }

  const validationError = validateReviewPayload({ calificacion, comentario });
  if (validationError) {
    throw new Error(validationError);
  }

  const { data, error } = await supabase
    .from('resenas')
    .update({
      calificacion: Number(calificacion),
      comentario: String(comentario).trim(),
    })
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select(REVIEW_SELECT)
    .single();

  if (error) {
    throw new Error('No se pudo actualizar tu reseña. Intenta nuevamente.');
  }

  return data;
}

export async function deleteReview(reviewId, userId) {
  if (!reviewId || !userId) {
    throw new Error('No se pudo verificar la reseña a eliminar.');
  }

  const { error } = await supabase
    .from('resenas')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('No se pudo eliminar tu reseña. Intenta nuevamente.');
  }

  return true;
}
