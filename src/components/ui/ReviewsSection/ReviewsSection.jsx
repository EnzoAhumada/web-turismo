import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useReviews } from '../../../hooks/useReviews';
import { MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH } from '../../../services/reviews.service';
import Icon from '../Icon';
import FeedbackBanner from '../FeedbackBanner';
import ConfirmModal from '../ConfirmModal';
import './ReviewsSection.css';

const RATING_LABELS = {
  1: 'Muy malo',
  2: 'Regular',
  3: 'Bueno',
  4: 'Muy bueno',
  5: 'Excelente',
};

function formatSpanishDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getAuthorDisplayName(autor) {
  if (!autor) return 'Viajero de Andacollo';
  const full = `${autor.nombre || ''} ${autor.apellido || ''}`.trim();
  return full || 'Viajero de Andacollo';
}

function getAuthorInitials(name) {
  const parts = String(name || 'V').trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function renderStarsRow(score, size = 15) {
  return (
    <span className="reviews-stars-inline" aria-label={`${score} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`reviews-stars-inline__item ${star <= Math.round(score) ? 'is-filled' : ''}`}
          aria-hidden="true"
        >
          <Icon name="star" size={size} filled={star <= Math.round(score)} />
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection({
  entityType,
  entityId,
  entityName = '',
  onSummaryChange,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const {
    reviews,
    summary,
    userReview,
    loading,
    submitting,
    deleting,
    error,
    feedback,
    clearFeedback,
    reloadReviews,
    submitReview,
    removeUserReview,
  } = useReviews(entityType, entityId, { onSummaryChange });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    setIsEditing(false);
    setConfirmDeleteOpen(false);
    setRating(0);
    setHoverRating(0);
    setComment('');
  }, [entityType, entityId]);

  const activeStarPreview = hoverRating || rating;
  const trimmedLength = comment.trim().length;
  const showForm = Boolean(user) && (!userReview || isEditing);

  function handleStartEdit(e) {
    e.preventDefault();
    if (!userReview) return;
    clearFeedback();
    setRating(Number(userReview.calificacion) || 5);
    setHoverRating(0);
    setComment(userReview.comentario || '');
    setIsEditing(true);
  }

  function handleCancelEdit(e) {
    e.preventDefault();
    clearFeedback();
    setIsEditing(false);
    setRating(0);
    setHoverRating(0);
    setComment('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await submitReview({
      calificacion: rating,
      comentario: comment,
    });
    if (ok) {
      setIsEditing(false);
      setRating(0);
      setHoverRating(0);
      setComment('');
    }
  }

  async function handleConfirmDelete() {
    const ok = await removeUserReview();
    if (ok) {
      setConfirmDeleteOpen(false);
      setIsEditing(false);
      setRating(0);
      setComment('');
    }
  }

  const countText =
    summary.count === 0
      ? 'Sin reseñas aún'
      : summary.count === 1
        ? '1 reseña'
        : `${summary.count} reseñas`;

  return (
    <section className="place-section reviews-section" aria-labelledby="reviews-heading">
      <header className="reviews-section__header">
        <div>
          <h2 id="reviews-heading" className="place-section__title">
            Opiniones y valoraciones
          </h2>
          <p className="reviews-section__subtitle">
            Experiencias reales de viajeros en {entityName || 'Andacollo'}
          </p>
        </div>
      </header>

      <div className="reviews-summary">
        <div className="reviews-summary__score">
          <span className="reviews-summary__number">
            {summary.count > 0 ? summary.average.toFixed(1) : '—'}
          </span>
          {renderStarsRow(summary.count > 0 ? summary.average : 0, 18)}
          <span className="reviews-summary__count">{countText}</span>
        </div>

        <div className="reviews-summary__bars" aria-label="Distribución de valoraciones">
          {[5, 4, 3, 2, 1].map((stars) => {
            const starCount = summary.distribution[stars] || 0;
            const pct = summary.count > 0 ? Math.round((starCount / summary.count) * 100) : 0;
            return (
              <div key={stars} className="reviews-bar-row">
                <span className="reviews-bar-row__label">{stars} ★</span>
                <div className="reviews-bar-row__track" aria-hidden="true">
                  <div className="reviews-bar-row__fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="reviews-bar-row__count">{starCount}</span>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className="reviews-feedback">
          <FeedbackBanner
            type={feedback.type}
            message={feedback.message}
            onDismiss={clearFeedback}
          />
        </div>
      )}

      {!user && (
        <div className="reviews-auth-cta">
          <div className="reviews-auth-cta__text">
            <h3>¿Visitaste este lugar?</h3>
            <p>Inicia sesión o crea una cuenta para dejar tu calificación y comentario.</p>
          </div>
          <div className="reviews-auth-cta__actions">
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="reviews-btn reviews-btn--primary"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              state={{ from: location.pathname }}
              className="reviews-btn reviews-btn--secondary"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}

      {showForm && (
        <form className="reviews-form" onSubmit={handleSubmit} noValidate>
          <h3 className="reviews-form__title">
            {isEditing ? 'Editar tu reseña' : 'Escribe tu reseña'}
          </h3>

          <fieldset className="reviews-form__stars-group">
            <legend className="reviews-form__label">Tu calificación</legend>
            <div className="reviews-star-picker" role="radiogroup" aria-label="Selecciona de 1 a 5 estrellas">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= activeStarPreview;
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`Calificar con ${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                    className={`reviews-star-picker__btn ${filled ? 'is-active' : ''}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onFocus={() => setHoverRating(star)}
                    onBlur={() => setHoverRating(0)}
                    onClick={(e) => {
                      e.preventDefault();
                      setRating(star);
                    }}
                  >
                    <Icon name="star" size={24} filled={filled} />
                  </button>
                );
              })}
              <span className="reviews-star-picker__caption">
                {activeStarPreview > 0
                  ? `${activeStarPreview}/5 · ${RATING_LABELS[activeStarPreview]}`
                  : 'Elige una puntuación'}
              </span>
            </div>
          </fieldset>

          <div className="reviews-form__field">
            <label htmlFor={`review-comment-${entityId}`} className="reviews-form__label">
              Tu comentario
            </label>
            <textarea
              id={`review-comment-${entityId}`}
              className="reviews-form__textarea"
              rows={4}
              maxLength={MAX_COMMENT_LENGTH}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntale a otros viajeros qué te gustó, qué recomiendas y cómo fue tu experiencia..."
              disabled={submitting}
            />
            <div className="reviews-form__meta">
              <span className="reviews-form__hint">
                Mínimo {MIN_COMMENT_LENGTH} caracteres
              </span>
              <span
                className={`reviews-form__counter ${
                  trimmedLength > MAX_COMMENT_LENGTH ? 'is-over' : ''
                }`}
              >
                {comment.length} / {MAX_COMMENT_LENGTH}
              </span>
            </div>
          </div>

          <div className="reviews-form__actions">
            {isEditing && (
              <button
                type="button"
                className="reviews-btn reviews-btn--secondary"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="reviews-btn reviews-btn--primary"
              disabled={submitting}
            >
              {submitting
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Publicar reseña'}
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="reviews-state" role="status">
          Cargando opiniones de viajeros...
        </div>
      )}

      {!loading && error && (
        <div className="reviews-error-box">
          <FeedbackBanner type="error" message={error} />
          <button
            type="button"
            className="reviews-btn reviews-btn--secondary"
            onClick={(e) => {
              e.preventDefault();
              reloadReviews();
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="reviews-empty">
          <span className="reviews-empty__icon" aria-hidden="true">
            <Icon name="star" size={28} />
          </span>
          <h3>Aún no hay reseñas</h3>
          <p>¡Sé el primero en compartir tu experiencia y valorar este lugar de Andacollo!</p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="reviews-list" role="list">
          {reviews.map((rev) => {
            const authorName = getAuthorDisplayName(rev.autor);
            const isOwn = Boolean(user?.id && rev.user_id === user.id);
            const wasEdited =
              rev.updated_at &&
              rev.created_at &&
              new Date(rev.updated_at).getTime() - new Date(rev.created_at).getTime() > 60000;

            return (
              <article
                key={rev.id}
                role="listitem"
                className={`review-card ${isOwn ? 'review-card--own' : ''}`}
              >
                <div className="review-card__top">
                  <div className="review-card__author">
                    {rev.autor?.avatar_url ? (
                      <img
                        src={rev.autor.avatar_url}
                        alt={authorName}
                        className="review-card__avatar"
                        loading="lazy"
                      />
                    ) : (
                      <span className="review-card__avatar-fallback" aria-hidden="true">
                        {getAuthorInitials(authorName)}
                      </span>
                    )}
                    <div className="review-card__author-meta">
                      <div className="review-card__name-row">
                        <strong className="review-card__name">{authorName}</strong>
                        {isOwn && <span className="review-card__own-badge">Tu reseña</span>}
                      </div>
                      <span className="review-card__role">
                        {rev.autor?.titulo_nivel || 'Viajero de Andacollo'}
                      </span>
                    </div>
                  </div>

                  <div className="review-card__rating-meta">
                    {renderStarsRow(rev.calificacion, 15)}
                    <time className="review-card__date" dateTime={rev.created_at}>
                      {formatSpanishDate(rev.created_at)}
                      {wasEdited ? ' · Editada' : ''}
                    </time>
                  </div>
                </div>

                <p className="review-card__body">{rev.comentario}</p>

                {isOwn && !isEditing && (
                  <div className="review-card__actions">
                    <button
                      type="button"
                      className="review-card__action-btn"
                      onClick={handleStartEdit}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="review-card__action-btn review-card__action-btn--danger"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmDeleteOpen(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title="Eliminar reseña"
        message="¿Estás seguro de que deseas eliminar tu valoración y comentario? Esta acción actualizará la calificación promedio."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </section>
  );
}
