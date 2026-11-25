import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAstroGallery } from '../../hooks/useAstroGallery';
import { resolveAstroImage } from '../../lib/astroScenes';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import AstroPhotoUploadModal from '../../components/ui/AstroPhotoUploadModal';
import './AstroGalleryPage.css';

export default function AstroGalleryPage() {
  const { user } = useAuth();
  const {
    photos,
    spotCounts,
    selectedSpot,
    setSelectedSpot,
    sortBy,
    setSortBy,
    telemetry,
    loading,
    error,
    feedback,
    setFeedback,
    handleToggleLike,
    handlePhotoUploaded,
  } = useAstroGallery();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [activePhotoId, setActivePhotoId] = useState(null);

  const activePhoto = photos.find((p) => p.id === activePhotoId) || null;

  function handleOpenUpload(e) {
    e.preventDefault();
    if (!user?.id) {
      setFeedback({
        type: 'info',
        message: 'Inicia sesión para subir tu astrofotografía a la galería comunitaria.',
      });
      return;
    }
    setUploadOpen(true);
  }

  return (
    <>
      <Header darkNav />
      <main className="page-wrapper page-wrapper--dark">
        <div className="container page-content astro-gallery-wrap">
          <section className="astro-gallery-hero" aria-label="Condiciones del cielo y galería">
            <div className="astro-gallery-hero__copy">
              <div className="astro-gallery-status">
                <span className="astro-gallery-status__dot" />
                <span>{telemetry.skyBadge}</span>
              </div>
              <h1 className="astro-gallery-hero__title">
                Cielos Limpios del Valle:{' '}
                <span>Astrofotografía Comunitaria</span>
              </h1>
              <p className="astro-gallery-hero__desc">
                Comparte tus capturas de la Vía Láctea, nebulosas y trazas estelares tomadas desde
                Cerro Yahuín, Mirador La Caldera y Observatorio Collowara. Explora los parámetros
                EXIF de otros astrofotógrafos locales.
              </p>
              <div className="astro-gallery-hero__actions">
                <Button type="button" variant="gold" onClick={handleOpenUpload}>
                  <Icon name="camera" size={16} />
                  <span>Subir Foto</span>
                </Button>
                <Link to="/astronomia" className="astro-gallery-hero__link">
                  Ver Ruta Astronómica
                </Link>
              </div>
            </div>

            <div className="astro-telemetry-card" aria-label="Telemetría astronómica">
              <div className="astro-telemetry-item">
                <span className="astro-telemetry-item__label">Visibilidad</span>
                <strong className="astro-telemetry-item__val astro-telemetry-item__val--sky">
                  {telemetry.visibilityValue}
                </strong>
                <span className="astro-telemetry-item__sub">{telemetry.visibilitySub}</span>
              </div>
              <div className="astro-telemetry-item astro-telemetry-item--mid">
                <span className="astro-telemetry-item__label">Fase Lunar</span>
                <strong className="astro-telemetry-item__val astro-telemetry-item__val--gold">
                  {telemetry.moonValue}
                </strong>
                <span className="astro-telemetry-item__sub">{telemetry.moonSub}</span>
              </div>
              <div className="astro-telemetry-item">
                <span className="astro-telemetry-item__label">Núcleo Galáctico</span>
                <strong className="astro-telemetry-item__val astro-telemetry-item__val--emerald">
                  {telemetry.coreValue}
                </strong>
                <span className="astro-telemetry-item__sub">{telemetry.coreSub}</span>
              </div>
            </div>
          </section>

          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              onDismiss={() => setFeedback(null)}
            />
          )}
          <FeedbackBanner type="error" message={error} />

          <section className="astro-gallery-toolbar" aria-label="Filtros de la galería">
            <div className="astro-spot-filters">
              {spotCounts.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`astro-spot-chip ${selectedSpot === s.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSpot(s.id);
                  }}
                >
                  <span>{s.label}</span>
                  <span className="astro-spot-chip__count">{s.count}</span>
                </button>
              ))}
            </div>

            <div className="astro-sort-box">
              <label htmlFor="astro-sort-select">Ordenar:</label>
              <select
                id="astro-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Más recientes</option>
                <option value="likes">Más valoradas</option>
              </select>
            </div>
          </section>

          {loading ? (
            <LoadingState message="Cargando galería de astrofotografías..." />
          ) : photos.length === 0 ? (
            <EmptyState
              icon="camera"
              title="No hay capturas en este sector"
              description="Sé el primero en compartir una astrofotografía desde este punto de Andacollo."
              actionLabel="Ver todos los sectores"
              onAction={() => setSelectedSpot('Todos')}
            />
          ) : (
            <section className="astro-gallery-grid" aria-label="Capturas publicadas">
              {photos.map((photo) => (
                <article key={photo.id} className="astro-photo-card">
                  <button
                    type="button"
                    className="astro-photo-card__media"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePhotoId(photo.id);
                    }}
                  >
                    <img
                      src={resolveAstroImage(photo.image)}
                      alt={photo.title}
                      loading="lazy"
                    />
                    <span className="astro-photo-card__spot">
                      <Icon name="map-pin" size={12} />
                      <span>{photo.spot}</span>
                    </span>
                    <span className="astro-photo-card__exif">
                      {photo.exif.iso} · {photo.exif.shutter}
                    </span>
                  </button>

                  <div className="astro-photo-card__body">
                    <h2
                      className="astro-photo-card__title"
                      onClick={(e) => {
                        e.preventDefault();
                        setActivePhotoId(photo.id);
                      }}
                    >
                      {photo.title}
                    </h2>
                    <p className="astro-photo-card__desc">{photo.description}</p>
                  </div>

                  <footer className="astro-photo-card__foot">
                    <Link
                      to={`/fotografo/${encodeURIComponent(photo.authorHandle)}`}
                      className="astro-author-link"
                    >
                      <span className="astro-author-avatar">
                        {photo.authorAvatar ? (
                          <img src={photo.authorAvatar} alt={photo.authorName} />
                        ) : (
                          photo.authorName.charAt(0).toUpperCase()
                        )}
                      </span>
                      <div>
                        <strong>{photo.authorName}</strong>
                        <span>{photo.dateLabel}</span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      className={`astro-like-btn ${photo.liked ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleLike(photo);
                      }}
                      aria-pressed={photo.liked}
                    >
                      <Icon name="heart" size={14} filled={photo.liked} />
                      <span>{photo.likes}</span>
                    </button>
                  </footer>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      {activePhoto && (
        <div
          className="astro-detail-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="astro-detail-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePhotoId(null);
          }}
        >
          <div className="astro-detail-modal">
            <div className="astro-detail-modal__media">
              <img src={resolveAstroImage(activePhoto.image)} alt={activePhoto.title} />
            </div>

            <div className="astro-detail-modal__info">
              <div className="astro-detail-modal__top">
                <span className="astro-detail-spot">
                  <Icon name="map-pin" size={13} />
                  <span>{activePhoto.spot}</span>
                </span>
                <button
                  type="button"
                  className="astro-detail-close"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePhotoId(null);
                  }}
                  aria-label="Cerrar detalle"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              <h2 id="astro-detail-title" className="astro-detail-title">
                {activePhoto.title}
              </h2>
              <p className="astro-detail-desc">{activePhoto.description}</p>

              <div className="astro-exif-box">
                <h3>Parámetros Técnicos (EXIF)</h3>
                <dl className="astro-exif-grid">
                  <div>
                    <dt>Equipo</dt>
                    <dd>{activePhoto.exif.camera}</dd>
                  </div>
                  <div>
                    <dt>ISO</dt>
                    <dd>{activePhoto.exif.iso}</dd>
                  </div>
                  <div>
                    <dt>Exposición</dt>
                    <dd>{activePhoto.exif.shutter}</dd>
                  </div>
                  <div>
                    <dt>Apertura</dt>
                    <dd>{activePhoto.exif.aperture}</dd>
                  </div>
                </dl>
              </div>

              <div className="astro-detail-modal__foot">
                <Link
                  to={`/fotografo/${encodeURIComponent(activePhoto.authorHandle)}`}
                  className="astro-author-link"
                  onClick={() => setActivePhotoId(null)}
                >
                  <span className="astro-author-avatar">
                    {activePhoto.authorName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{activePhoto.authorName}</strong>
                    <span className="astro-author-cta">Ver portafolio completo →</span>
                  </div>
                </Link>

                <button
                  type="button"
                  className={`astro-like-btn ${activePhoto.liked ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleLike(activePhoto);
                  }}
                >
                  <Icon name="heart" size={15} filled={activePhoto.liked} />
                  <span>{activePhoto.likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AstroPhotoUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handlePhotoUploaded}
      />

      <Footer />
    </>
  );
}
