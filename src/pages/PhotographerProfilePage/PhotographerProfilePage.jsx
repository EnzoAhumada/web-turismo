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
  } = usePhotographerProfile(handleOrId);

  return (
    <>
      <Header darkNav />
      <main className="page-wrapper page-wrapper--dark">
        <div className="container page-content pub-profile-wrap">
          <div className="pub-profile-top">
            <Link to="/fotografia" className="pub-profile-back">
              ← Volver a la Galería Comunitaria
            </Link>
            <span className="pub-profile-verified">Perfil Verificado · Comunidad ThakiGo</span>
          </div>

          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              onDismiss={() => setFeedback(null)}
            />
          )}

          {loading ? (
            <LoadingState message="Cargando perfil del astrofotógrafo..." />
          ) : !data ? (
            <EmptyState
              icon="user"
              title="Perfil no encontrado"
              description="No encontramos este perfil de astrofotógrafo en la comunidad."
              actionLabel="Volver a Galería"
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
                    <div>
                      <div className="pub-profile-name-row">
                        <h1>{data.displayName}</h1>
                        {data.profile.certificacion && (
                          <span className="pub-profile-cert">✓ {data.profile.certificacion}</span>
                        )}
                      </div>
                      <p className="pub-profile-handle">
                        @{data.profile.handle || 'viajero'} ·{' '}
                        {data.profile.rol_fotografico || data.profile.titulo_nivel || 'Astrofotógrafo Local'}
                      </p>
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
                        Editar Mi Perfil
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
                        {data.isFollowing ? '✓ Siguiendo' : '+ Seguir Astrofotógrafo'}
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
                      <span>Gear Bag &amp; Óptica</span>
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
                  <h2>Portafolio de {data.displayName} ({data.photos.length})</h2>
                  {data.photos.length === 0 ? (
                    <EmptyState
                      icon="camera"
                      title="Sin capturas publicadas"
                      description="Este perfil aún no ha compartido astrofotografías."
                    />
                  ) : (
                    <div className="pub-photos-grid">
                      {data.photos.map((p) => (
                        <article key={p.id} className="pub-photo-card">
                          <div className="pub-photo-card__img">
                            <img src={resolveAstroImage(p.image)} alt={p.title} loading="lazy" />
                            <span>{p.spot}</span>
                          </div>
                          <div className="pub-photo-card__body">
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            <div className="pub-photo-card__meta">
                              <span>{p.exif.camera} · {p.exif.shutter}</span>
                              <strong>❤️ {p.likes}</strong>
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
      <Footer />
    </>
  );
}
