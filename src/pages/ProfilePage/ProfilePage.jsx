import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfileStats } from '../../hooks/useProfileStats';
import { resolveAstroImage } from '../../lib/astroScenes';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import AstroPhotoUploadModal from '../../components/ui/AstroPhotoUploadModal';
import AstroPhotoModal from '../../components/ui/AstroPhotoModal';
import './ProfilePage.css';

export default function ProfilePage() {
  const {
    user,
    profile,
    displayName,
    xp,
    nivel,
    nextThreshold,
    levelProgress,
    dashboard,
    editing,
    setEditing,
    nombre,
    setNombre,
    apellido,
    setApellido,
    ciudadOrigen,
    setCiudadOrigen,
    biografia,
    setBiografia,
    avatarUrl,
    setAvatarUrl,
    handle,
    setHandle,
    rolFotografico,
    setRolFotografico,
    certificacion,
    setCertificacion,
    offlineMode,
    handleToggleOffline,
    saving,
    feedback,
    setFeedback,
    handleSave,
    signOut,
    astroPhotos,
    astroStats,
    astroBadges,
    gearBag,
    handleAddGear,
    handleRemoveGear,
    handlePhotoUploaded,
    handleTogglePhotoLike,
    userBookings,
    guideRequests,
  } = useProfileStats();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [activePhotoId, setActivePhotoId] = useState(null);
  const [gearName, setGearName] = useState('');
  const [gearDetail, setGearDetail] = useState('');

  const activePhoto = astroPhotos.find((p) => p.id === activePhotoId) || null;
  const placesCount = Number(profile?.lugares_visitados || 0);
  const routesCount = Number(profile?.rutas_completadas || 0);
  const reviewsCount = Number(profile?.resenas_count || 0);
  const activeBookings = userBookings.filter((b) => b.estado !== 'cancelada');

  async function onSubmitGear(e) {
    e.preventDefault();
    const ok = await handleAddGear(gearName, gearDetail);
    if (ok) {
      setGearName('');
      setGearDetail('');
    }
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content profile-container">
          <section className="profile-hero-card" aria-label="Resumen de mi perfil">
            <div className="profile-hero-banner">
              <img src={resolveAstroImage('preset:milkyway')} alt="Paisaje de Andacollo" />
            </div>

            <div className="profile-hero-body">
              <div className="profile-hero-identity">
                <div className="profile-avatar">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={displayName} />
                  ) : (
                    <span className="profile-avatar__initials">
                      {(profile?.nombre?.[0] || user?.email?.[0] || 'T').toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="profile-hero-meta">
                  <div className="profile-name-row">
                    <h1 className="profile-name">{displayName}</h1>
                    {profile?.certificacion && (
                      <span className="profile-cert-pill">✓ {profile.certificacion}</span>
                    )}
                  </div>
                  <p className="profile-level-label">
                    {profile?.handle ? `@${profile.handle} · ` : ''}
                    Explorador nivel {nivel} · {profile?.rol_fotografico || profile?.titulo_nivel || 'Viajero Inicial'} ·{' '}
                    {profile?.rol === 'admin' ? 'Administrador' : 'Viajero'}
                  </p>
                  {profile?.ciudad_origen && (
                    <p className="profile-origin">
                      <Icon name="map-pin" size={14} />
                      <span>{profile.ciudad_origen}</span>
                      {dashboard.userRank && (
                        <span>
                          · Puesto #{dashboard.userRank} de {dashboard.totalTravelers}
                        </span>
                      )}
                    </p>
                  )}
                  {profile?.biografia && <p className="profile-bio">{profile.biografia}</p>}

                  <div className="profile-xp-wrap">
                    <div className="profile-xp__bar">
                      <div
                        className="profile-xp__fill"
                        style={{ width: `${Math.min(100, Math.round(levelProgress * 100))}%` }}
                      />
                    </div>
                    <span className="profile-xp__text">
                      {xp.toLocaleString('es-CL')} / {nextThreshold.toLocaleString('es-CL')} XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-astro-side">
                <div className="profile-astro-metrics">
                  <div>
                    <strong>{astroStats.capturesCount}</strong>
                    <span>Capturas</span>
                  </div>
                  <div>
                    <strong>{astroStats.totalLikes}</strong>
                    <span>Me gusta</span>
                  </div>
                  <div>
                    <strong>{astroStats.uniqueSpots}</strong>
                    <span>Spots</span>
                  </div>
                </div>

                <div className="profile-astro-bar__actions">
                  <Button
                    type="button"
                    variant="gold"
                    onClick={(e) => {
                      e.preventDefault();
                      setUploadOpen(true);
                    }}
                  >
                    <Icon name="camera" size={15} />
                    <span>+ Subir Captura</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditing(!editing);
                    }}
                  >
                    <Icon name="settings" size={15} />
                    <span>{editing ? 'Cerrar edición' : 'Editar datos'}</span>
                  </Button>
                  {user?.id && (
                    <Link
                      to={`/usuario/${encodeURIComponent(profile?.handle || user.id)}`}
                      className="profile-public-link"
                    >
                      Ver vista pública →
                    </Link>
                  )}
                </div>
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

          {editing && (
            <section className="profile-edit-card" aria-label="Editar datos personales">
              <h2 className="profile-edit-card__title">Editar datos personales y perfil público</h2>
              <form className="profile-form" onSubmit={handleSave}>
                <div className="profile-field-row">
                  <div className="profile-field">
                    <label htmlFor="pf-nombre">Nombre</label>
                    <input
                      id="pf-nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="profile-field">
                    <label htmlFor="pf-apellido">Apellido</label>
                    <input
                      id="pf-apellido"
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </div>
                </div>

                <div className="profile-field-row">
                  <div className="profile-field">
                    <label htmlFor="pf-handle">Usuario público (@handle)</label>
                    <input
                      id="pf-handle"
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="Ej: mi_astrofoto"
                    />
                  </div>
                  <div className="profile-field">
                    <label htmlFor="pf-rol-foto">Rol o especialidad</label>
                    <input
                      id="pf-rol-foto"
                      type="text"
                      value={rolFotografico}
                      onChange={(e) => setRolFotografico(e.target.value)}
                      placeholder="Ej: Astrofotógrafo Local · Andacollo"
                    />
                  </div>
                </div>

                <div className="profile-field-row">
                  <div className="profile-field">
                    <label htmlFor="pf-ciudad">Ciudad de origen</label>
                    <input
                      id="pf-ciudad"
                      type="text"
                      value={ciudadOrigen}
                      onChange={(e) => setCiudadOrigen(e.target.value)}
                      placeholder="Ej: La Serena, Coquimbo"
                    />
                  </div>
                  <div className="profile-field">
                    <label htmlFor="pf-cert">Certificación / Sello (opcional)</label>
                    <input
                      id="pf-cert"
                      type="text"
                      value={certificacion}
                      onChange={(e) => setCertificacion(e.target.value)}
                      placeholder="Ej: Embajador Cielos Andacollo"
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="pf-avatar">URL de foto de perfil (opcional)</label>
                  <input
                    id="pf-avatar"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="pf-bio">Sobre ti</label>
                  <textarea
                    id="pf-bio"
                    rows="3"
                    value={biografia}
                    onChange={(e) => setBiografia(e.target.value)}
                    placeholder="Comparte tus intereses turísticos en Andacollo..."
                  />
                </div>

                <div className="profile-form__actions">
                  <Button type="submit" variant="gold" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditing(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </section>
          )}

          <div className="profile-layout-grid">
            <aside className="profile-col-left">
              {/* Visualización estructurada de datos propios */}
              <section className="profile-menu-card profile-extra-card" aria-label="Mis datos de cuenta">
                <div className="profile-recent-card__head">
                  <h2>Mis Datos de Perfil</h2>
                </div>
                <dl className="profile-data-list">
                  <div>
                    <dt>Nombre</dt>
                    <dd>{displayName}</dd>
                  </div>
                  <div>
                    <dt>Correo</dt>
                    <dd>{user?.email || 'No registrado'}</dd>
                  </div>
                  <div>
                    <dt>Usuario público</dt>
                    <dd>{profile?.handle ? `@${profile.handle}` : 'Sin definir'}</dd>
                  </div>
                  <div>
                    <dt>Ciudad de origen</dt>
                    <dd>{profile?.ciudad_origen || 'Región de Coquimbo'}</dd>
                  </div>
                  <div>
                    <dt>Nivel y rol</dt>
                    <dd>
                      Nivel {nivel} · {profile?.rol === 'admin' ? 'Administrador' : 'Viajero'}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="profile-menu-card" aria-label="Actividad del viajero">
                <Link to="/gamificacion" className="profile-row">
                  <span className="profile-row__icon">
                    <Icon name="award" size={20} />
                  </span>
                  <span className="profile-row__label">Mis logros y ranking</span>
                  <span className="profile-row__count">{dashboard.badgesCount}</span>
                  <Icon name="chevron-right" size={18} className="profile-row__chevron" />
                </Link>
                <Link to="/planificador" className="profile-row">
                  <span className="profile-row__icon">
                    <Icon name="route" size={20} />
                  </span>
                  <span className="profile-row__label">Rutas completadas</span>
                  <span className="profile-row__count">{routesCount}</span>
                  <Icon name="chevron-right" size={18} className="profile-row__chevron" />
                </Link>
                <Link to="/explorar" className="profile-row">
                  <span className="profile-row__icon">
                    <Icon name="map-pin" size={20} />
                  </span>
                  <span className="profile-row__label">Lugares visitados</span>
                  <span className="profile-row__count">{placesCount}</span>
                  <Icon name="chevron-right" size={18} className="profile-row__chevron" />
                </Link>
                <Link to="/favoritos" className="profile-row">
                  <span className="profile-row__icon">
                    <Icon name="heart" size={20} />
                  </span>
                  <span className="profile-row__label">Favoritos guardados</span>
                  <span className="profile-row__count">{dashboard.favoritesCount}</span>
                  <Icon name="chevron-right" size={18} className="profile-row__chevron" />
                </Link>
                <div className="profile-row">
                  <span className="profile-row__icon">
                    <Icon name="star" size={20} />
                  </span>
                  <span className="profile-row__label">Reseñas publicadas</span>
                  <span className="profile-row__count">{reviewsCount}</span>
                </div>
              </section>

              {/* Equipo Fotográfico (Gear Bag) */}
              <section className="profile-menu-card profile-extra-card" aria-label="Equipo fotográfico">
                <div className="profile-recent-card__head">
                  <h2>Mi Equipo Fotográfico</h2>
                </div>
                {gearBag.length > 0 ? (
                  <div className="profile-gear-list">
                    {gearBag.map((g) => (
                      <div key={g.id} className="profile-gear-item">
                        <div>
                          <strong>{g.name}</strong>
                          {g.detail && <span>{g.detail}</span>}
                        </div>
                        <button
                          type="button"
                          className="profile-gear-del"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveGear(g.id);
                          }}
                          aria-label="Eliminar equipo"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="profile-extra-empty">
                    Agrega tu cámara, telescopio, trípode o apps de planificación nocturna.
                  </p>
                )}

                <form className="profile-gear-form" onSubmit={onSubmitGear}>
                  <input
                    type="text"
                    required
                    value={gearName}
                    onChange={(e) => setGearName(e.target.value)}
                    placeholder="Equipo (ej. Sony DSC-H300...)"
                  />
                  <input
                    type="text"
                    value={gearDetail}
                    onChange={(e) => setGearDetail(e.target.value)}
                    placeholder="Uso o detalle breve"
                  />
                  <Button type="submit" variant="outline">
                    + Añadir
                  </Button>
                </form>
              </section>

              {/* Preferencias */}
              <section className="profile-menu-card" aria-label="Configuración y preferencias">
                <div className="profile-row">
                  <span className="profile-row__icon">
                    <Icon name="globe" size={20} />
                  </span>
                  <span className="profile-row__label">Idioma</span>
                  <span className="profile-row__value">Español</span>
                </div>

                <div className="profile-row">
                  <span className="profile-row__icon">
                    <Icon name="wifi-off" size={20} />
                  </span>
                  <span className="profile-row__label">Modo offline</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={offlineMode}
                    aria-label="Activar modo offline"
                    className={`profile-toggle ${offlineMode ? 'on' : ''}`}
                    onClick={handleToggleOffline}
                  >
                    <span className="profile-toggle__thumb" />
                  </button>
                </div>
              </section>
            </aside>

            <div className="profile-col-right">
              {/* Mi Galería de Fotos */}
              <section className="profile-menu-card profile-extra-card" aria-label="Galería de fotos del usuario">
                <div className="profile-recent-card__head">
                  <h2>Mi Galería de Fotos ({astroPhotos.length})</h2>
                  <Link to="/fotografia">Ir a Astrofotos</Link>
                </div>
                {astroPhotos.length === 0 ? (
                  <div className="profile-empty-gallery">
                    <p className="profile-extra-empty">
                      Todavía no has publicado capturas. Sube tu primera fotografía para compartirla con la comunidad.
                    </p>
                    <Button
                      type="button"
                      variant="gold"
                      onClick={(e) => {
                        e.preventDefault();
                        setUploadOpen(true);
                      }}
                    >
                      <Icon name="camera" size={15} />
                      <span>Subir mi primera foto</span>
                    </Button>
                  </div>
                ) : (
                  <div className="profile-portfolio-grid">
                    {astroPhotos.map((p) => (
                      <article key={p.id} className="profile-portfolio-card">
                        <button
                          type="button"
                          className="profile-portfolio-card__img"
                          onClick={(e) => {
                            e.preventDefault();
                            setActivePhotoId(p.id);
                          }}
                          aria-label={`Ver detalles de ${p.title}`}
                        >
                          <img src={resolveAstroImage(p.image)} alt={p.title} loading="lazy" />
                          <span className="profile-portfolio-card__spot">
                            <Icon name="map-pin" size={12} />
                            <span>{p.spot}</span>
                          </span>
                          <span className="profile-portfolio-card__exif">
                            {p.exif?.iso || 'EXIF'} · {p.exif?.shutter || 'Ver'}
                          </span>
                        </button>
                        <div className="profile-portfolio-card__body">
                          <button
                            type="button"
                            className="profile-portfolio-card__title"
                            onClick={(e) => {
                              e.preventDefault();
                              setActivePhotoId(p.id);
                            }}
                          >
                            {p.title}
                          </button>
                          <div className="profile-portfolio-card__meta">
                            <small>{p.exif?.camera || 'Cámara'}</small>
                            <button
                              type="button"
                              className={`profile-like-pill ${p.liked ? 'liked' : ''}`}
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

              {/* Mis Reservas y Pases */}
              <section className="profile-menu-card profile-extra-card" aria-label="Mis reservas y pases">
                <div className="profile-recent-card__head">
                  <h2>Mis Reservas y Pases ({activeBookings.length + guideRequests.length})</h2>
                  <Link to="/explorar">Explorar lugares</Link>
                </div>
                {userBookings.length === 0 && guideRequests.length === 0 ? (
                  <p className="profile-extra-empty">
                    Aún no tienes pases emitidos. Reserva desde el submenú de Servicios y Reserva en cualquier lugar habilitado o solicita un guía certificado.
                  </p>
                ) : (
                  <div className="profile-passes-list">
                    {userBookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="profile-pass-item">
                        <div>
                          <span className="profile-pass-code">{b.codigo}</span>
                          <strong>{b.entity_name} · {b.package_name}</strong>
                          <p>
                            {b.fecha_inicio}
                            {b.hora_inicio ? ` · ${b.hora_inicio} hrs` : ''} ·{' '}
                            {b.total_clp > 0 ? `$${Number(b.total_clp).toLocaleString('es-CL')} CLP` : 'Sin costo'}
                          </p>
                        </div>
                        <span className={`profile-pass-status profile-pass-status--${b.estado}`}>
                          {b.estado}
                        </span>
                      </div>
                    ))}
                    {guideRequests.slice(0, 3).map((r) => (
                      <div key={r.id} className="profile-pass-item">
                        <div>
                          <span className="profile-pass-code">GUÍA</span>
                          <strong>{r.tour_guides?.nombre || 'Guía Local'}</strong>
                          <p>{r.fecha} · {r.personas} personas</p>
                        </div>
                        <span className={`profile-pass-status profile-pass-status--${r.estado}`}>
                          {r.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Insignias de Observación */}
              {astroBadges.length > 0 && (
                <section className="profile-menu-card profile-extra-card" aria-label="Insignias de observación">
                  <div className="profile-recent-card__head">
                    <h2>Insignias de Observación</h2>
                  </div>
                  <div className="profile-badges-grid">
                    {astroBadges.map((b, idx) => (
                      <div key={idx} className="profile-badge-card">
                        <Icon name={b.icon || 'award'} size={18} />
                        <div>
                          <strong>{b.title}</strong>
                          <span>{b.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {dashboard.recentFavorites.length > 0 && (
                <section className="profile-menu-card profile-recent-card" aria-label="Favoritos recientes">
                  <div className="profile-recent-card__head">
                    <h2>Tus favoritos recientes</h2>
                    <Link to="/favoritos">Ver todos</Link>
                  </div>
                  <div className="profile-recent-list">
                    {dashboard.recentFavorites.map((fav) => (
                      <Link key={fav.id} to={fav.to} className="profile-recent-chip">
                        <span className="profile-recent-chip__tag">{fav.label}</span>
                        <strong>{fav.title}</strong>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="profile-actions-footer">
            {profile?.rol === 'admin' && (
              <Link to="/admin" className="profile-admin-link">
                <Icon name="shield" size={16} />
                <span>Ir al Panel de Administración</span>
              </Link>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              <Icon name="log-out" size={16} />
              <span>Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </main>

      <AstroPhotoModal
        photo={activePhoto}
        onClose={() => setActivePhotoId(null)}
        onToggleLike={handleTogglePhotoLike}
        hideAuthorLink
      />

      <AstroPhotoUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handlePhotoUploaded}
      />

      <Footer />
    </>
  );
}
