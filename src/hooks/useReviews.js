import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getReviewsByEntity,
  createReview,
  updateReview,
  deleteReview,
  computeReviewsSummary,
  validateReviewPayload,
} from '../services/reviews.service';

export function useReviews(entityType, entityId, { onSummaryChange } = {}) {
  const { user, reloadProfile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const onSummaryChangeRef = useRef(onSummaryChange);
  onSummaryChangeRef.current = onSummaryChange;

  const summary = useMemo(() => computeReviewsSummary(reviews), [reviews]);

  const userReview = useMemo(() => {
    if (!user?.id) return null;
    return reviews.find((rev) => rev.user_id === user.id) || null;
  }, [reviews, user?.id]);

  const notifySummary = useCallback((nextList) => {
    const nextSummary = computeReviewsSummary(nextList);
    if (onSummaryChangeRef.current) {
      onSummaryChangeRef.current({
        rating_promedio: nextSummary.average,
        resenas_count: nextSummary.count,
      });
    }
  }, []);

  const loadReviews = useCallback(async () => {
    if (!entityType || !entityId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { reviews: fetched } = await getReviewsByEntity(entityType, entityId);
      setReviews(fetched);
      notifySummary(fetched);
    } catch (err) {
      setError(err?.message || 'No se pudieron cargar las reseñas.');
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, notifySummary]);

  useEffect(() => {
    setFeedback(null);
    loadReviews();
  }, [loadReviews]);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const submitReview = useCallback(
    async ({ calificacion, comentario }) => {
      if (!user?.id) {
        setFeedback({
          type: 'error',
          message: 'Debes iniciar sesión para publicar una valoración y comentario.',
        });
        return false;
      }

      const validationError = validateReviewPayload({ calificacion, comentario });
      if (validationError) {
        setFeedback({ type: 'error', message: validationError });
        return false;
      }

      setSubmitting(true);
      setFeedback(null);
      try {
        let nextList;
        if (userReview) {
          const updated = await updateReview(userReview.id, user.id, {
            calificacion,
            comentario,
          });
          nextList = reviews.map((rev) => (rev.id === updated.id ? updated : rev));
          setFeedback({
            type: 'success',
            message: 'Tu reseña se actualizó correctamente.',
          });
        } else {
          const created = await createReview({
            userId: user.id,
            tipo: entityType,
            itemId: entityId,
            calificacion,
            comentario,
          });
          nextList = [created, ...reviews];
          setFeedback({
            type: 'success',
            message: '¡Gracias por compartir tu experiencia en Andacollo!',
          });
        }

        setReviews(nextList);
        notifySummary(nextList);
        if (reloadProfile) reloadProfile();
        return true;
      } catch (err) {
        setFeedback({
          type: 'error',
          message: err?.message || 'Ocurrió un error al guardar tu reseña.',
        });
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [user?.id, userReview, reviews, entityType, entityId, notifySummary, reloadProfile]
  );

  const removeUserReview = useCallback(async () => {
    if (!user?.id || !userReview) return false;

    setDeleting(true);
    setFeedback(null);
    try {
      await deleteReview(userReview.id, user.id);
      const nextList = reviews.filter((rev) => rev.id !== userReview.id);
      setReviews(nextList);
      notifySummary(nextList);
      if (reloadProfile) reloadProfile();
      setFeedback({
        type: 'info',
        message: 'Tu reseña fue eliminada correctamente.',
      });
      return true;
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo eliminar tu reseña.',
      });
      return false;
    } finally {
      setDeleting(false);
    }
  }, [user?.id, userReview, reviews, notifySummary, reloadProfile]);

  return {
    reviews,
    summary,
    userReview,
    loading,
    submitting,
    deleting,
    error,
    feedback,
    clearFeedback,
    reloadReviews: loadReviews,
    submitReview,
    removeUserReview,
  };
}
