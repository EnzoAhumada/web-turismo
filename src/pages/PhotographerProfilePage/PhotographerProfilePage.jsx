import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePhotographerProfile } from '../../hooks/usePhotographerProfile';
import { resolveAstroImage } from '../../lib/astroScenes';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import AstroPhotoModal from '../../components/ui/AstroPhotoModal';
import './PhotographerProfilePage.css';

export default function PhotographerProfilePage() {
  const { handleOrId } = useParams();
  const {
    data,
    loading,
    feedback,
    setFeedback,
    isOwnProfile,
    handleToggleFollow,
    handleTogglePhotoLike,
  } = usePhotographerProfile(handleOrId);

  const [activePhotoId, setActivePhotoId] = useState(null);
  const activePhoto = data?.photos?.find((p) => p.id === activePhotoId) || null;

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content pub-profile-wrap">
          <div className="pub-profile-top">
            <Link to="/fotografia" className="pub-profile-back">
              ← Volver a Astrofotos
            </Link>
            <span className="pub-profile-verified">Perfil Público · Comunidad ThakiGo</span>
          </div>

          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              onDismiss={() => setFeedback(null)}
            />
          )}

          {loading ? (
            <LoadingState message="Cargando perfil de usuario..." />
          ) : !data ? (
            <EmptyState
              icon="user"
              title="Perfil no encontrado"
              description="No encontramos este perfil de usuario en la comunidad de Andacollo."
              actionLabel="Volver a Astrofotos"
              actionTo="/fotografia"
            />
          ) : (
            <>
              <section className="pub-profile-header">
                <div className="pub-profile-banner">
                  <img src={resolveAstroImage('preset:milkyway')} alt="Cielo nocturno de Andacollo" />
                </div>

                <div className="pub-profile-header__body">
                  <div className="pub-profile-identity">
                    <div className="pub-profile-avatar">
                      {data.profile.avatar_url ? (
                        <img src={data.profile.avatar_url} alt={data.displayName} />
                      ) : (
                        data.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="pub-profile-meta">
                      <div className="pub-profile-name-row">
                        <h1>{data.displayName}</h1>
                        {data.profile.certificacion && (
                          <span className="pub-profile-cert">✓ {data.profile.certificacion}</span>
                        )}
                      </div>
                      <p className="pub-profile-handle">
                        @{data.profile.handle || 'viajero'} ·{' '}
                        {data.profile.rol_fotografico || data.profile.titulo_nivel || 'Explorador de Andacollo'}
                      </p>
                      {data.profile.ciudad_origen && (
                        <p className="pub-profile-origin">
                          <Icon name="map-pin" size={14} />
                          <span>{data.profile.ciudad_origen}</span>
                        </p>
                      )}
                      {data.profile.biografia && (
                        <p className="pub-profile-bio">{data.profile.biografia}</p>
                      )}
                    </div>
                  </div>

                  <div className="pub-profile-side">
                    <div className="pub-profile-stats">
                      <div>
                        <strong>{data.stats.capturesCount}</strong>
                        <span>Capturas</span>
                      </div>
                      <div>
                        <strong>{data.stats.totalLikes}</strong>
                        <span>Me gusta</span>
                      </div>
                      <div>
                        <strong>{data.stats.uniqueSpots}</strong>
                        <span>Spots</span>
                      </div>
                      <div>
                        <strong>{data.stats.followersCount}</strong>
                        <span>Seguidores</span>
                      </div>
                    </div>

                    {isOwnProfile ? (
                      <Link to="/perfil" className="btn btn--gold">
                        Ir a Mi Perfil
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        variant={data.isFollowing ? 'outline' : 'gold'}
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleFollow();
                        }}
                      >
                        {data.isFollowing ? '✓ Siguiendo' : '+ Seguir Usuario'}
                      </Button>
                    )}
                  </div>
                </div>
              </section>

              <div className="pub-profile-grid">
                <aside className="pub-profile-col-left">
                  <section className="pub-profile-card">
                    <h2>
                      <Icon name="camera" size={17} />
                      <span>Equipamiento &amp; Óptica</span>
                    </h2>
                    {data.gearBag.length === 0 ? (
                      <p className="pub-profile-empty">Sin equipamiento listado todavía.</p>
                    ) : (
                      <div className="pub-gear-list">
                        {data.gearBag.map((g, idx) => (
                          <div key={g.id || idx} className="pub-gear-item">
                            <strong>{g.name}</strong>
                            <span>{g.detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="pub-profile-card">
                    <h2>
                      <Icon name="award" size={17} />
                      <span>Insignias de Observación</span>
                    </h2>
                    {data.astroBadges.length === 0 ? (
                      <p className="pub-profile-empty">Explorando los cielos de Andacollo.</p>
                    ) : (
                      <div className="pub-badges-list">
                        {data.astroBadges.map((b, idx) => (
                          <div key={idx} className="pub-badge-item">
                            <Icon name={b.icon || 'sparkles'} size={18} />
                            <div>
                              <strong>{b.title}</strong>
                              <span>{b.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </aside>

                <section className="pub-profile-col-right">
                  <h2>Galería de {data.displayName} ({data.photos.length})</h2>
                  {data.photos.length === 0 ? (
                    <EmptyState
                      icon="camera"
                      title="Sin capturas publicadas"
                      description="Este usuario aún no ha compartido fotografías en su galería."
                    />
                  ) : (
                    <div className="pub-photos-grid">
                      {data.photos.map((p) => (
                        <article key={p.id} className="pub-photo-card">
                          <button
                            type="button"
                            className="pub-photo-card__img"
                            onClick={(e) => {
                              e.preventDefault();
                              setActivePhotoId(p.id);
                            }}
                            aria-label={`Ver detalles de ${p.title}`}
                          >
                            <img src={resolveAstroImage(p.image)} alt={p.title} loading="lazy" />
                            <span className="pub-photo-card__spot">
                              <Icon name="map-pin" size={12} />
                              <span>{p.spot}</span>
                            </span>
                            <span className="pub-photo-card__exif">
                              {p.exif?.iso || 'EXIF'} · {p.exif?.shutter || 'Ver'}
                            </span>
                          </button>
                          <div className="pub-photo-card__body">
                            <button
                              type="button"
                              className="pub-photo-card__title"
                              onClick={(e) => {
                                e.preventDefault();
                                setActivePhotoId(p.id);
                              }}
                            >
                              {p.title}
                            </button>
                            <p>{p.description}</p>
                            <div className="pub-photo-card__meta">
                              <span>{p.exif?.camera || 'Cámara'} · {p.exif?.shutter || 'No especificado'}</span>
                              <button
                                type="button"
                                className={`pub-like-btn ${p.liked ? 'liked' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleTogglePhotoLike(p);
                                }}
                                aria-pressed={Boolean(p.liked)}
                              >
                                <Icon name="heart" size={13} filled={Boolean(p.liked)} />
                                <span>{p.likes}</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </main>

      <AstroPhotoModal
        photo={activePhoto}
        onClose={() => setActivePhotoId(null)}
        onToggleLike={handleTogglePhotoLike}
        hideAuthorLink
      />

      <Footer />
    </>
  );
}
