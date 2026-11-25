import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resolveAstroImage } from '../../../lib/astroScenes';
import Icon from '../Icon';
import './AstroPhotoModal.css';

export default function AstroPhotoModal({
  photo,
  onClose,
  onToggleLike,
  hideAuthorLink = false,
}) {
  useEffect(() => {
    if (!photo) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose]);

  if (!photo) return null;

  const authorName = photo.authorName || 'Viajero ThakiGo';
  const authorHandle = photo.authorHandle || photo.authorId || '';
  const exif = photo.exif || {};

  return (
    <div
      className="astro-detail-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="astro-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <div className="astro-detail-modal">
        <div className="astro-detail-modal__media">
          <img src={resolveAstroImage(photo.image)} alt={photo.title} />
        </div>

        <div className="astro-detail-modal__info">
          <div className="astro-detail-modal__top">
            <span className="astro-detail-spot">
              <Icon name="map-pin" size={13} />
              <span>{photo.spot || 'Andacollo'}</span>
            </span>
            <button
              type="button"
              className="astro-detail-close"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              aria-label="Cerrar detalle de fotografía"
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          <h2 id="astro-detail-title" className="astro-detail-title">
            {photo.title}
          </h2>
          {photo.description && (
            <p className="astro-detail-desc">{photo.description}</p>
          )}

          <div className="astro-exif-box">
            <h3>Parámetros Técnicos (EXIF)</h3>
            <dl className="astro-exif-grid">
              <div>
                <dt>Equipo</dt>
                <dd>{exif.camera || 'No especificado'}</dd>
              </div>
              <div>
                <dt>ISO</dt>
                <dd>{exif.iso || 'No especificado'}</dd>
              </div>
              <div>
                <dt>Exposición</dt>
                <dd>{exif.shutter || 'No especificado'}</dd>
              </div>
              <div>
                <dt>Apertura</dt>
                <dd>{exif.aperture || 'No especificado'}</dd>
              </div>
            </dl>
          </div>

          <div className="astro-detail-modal__foot">
            {!hideAuthorLink && authorHandle ? (
              <Link
                to={`/usuario/${encodeURIComponent(authorHandle)}`}
                className="astro-author-link"
                onClick={() => onClose()}
              >
                <span className="astro-author-avatar">
                  {photo.authorAvatar ? (
                    <img src={photo.authorAvatar} alt={authorName} />
                  ) : (
                    authorName.charAt(0).toUpperCase()
                  )}
                </span>
                <div>
                  <strong>{authorName}</strong>
                  <span className="astro-author-cta">Ver perfil completo →</span>
                </div>
              </Link>
            ) : (
              <div className="astro-author-static">
                <span className="astro-author-avatar">
                  {photo.authorAvatar ? (
                    <img src={photo.authorAvatar} alt={authorName} />
                  ) : (
                    authorName.charAt(0).toUpperCase()
                  )}
                </span>
                <div>
                  <strong>{authorName}</strong>
                  <span>{photo.dateLabel || 'Galería de usuario'}</span>
                </div>
              </div>
            )}

            {onToggleLike && (
              <button
                type="button"
                className={`astro-modal-like-btn ${photo.liked ? 'liked' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleLike(photo);
                }}
                aria-pressed={Boolean(photo.liked)}
                aria-label={photo.liked ? 'Quitar me gusta' : 'Dar me gusta'}
              >
                <Icon name="heart" size={15} filled={Boolean(photo.liked)} />
                <span>{Number(photo.likes || 0)}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
