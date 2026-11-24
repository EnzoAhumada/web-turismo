import { Link } from 'react-router-dom';
import { useProfileStats } from '../../hooks/useProfileStats';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
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
    offlineMode,
    handleToggleOffline,
    saving,
    feedback,
    setFeedback,
    handleSave,
    signOut,
  } = useProfileStats();

  const placesCount = Number(profile?.lugares_visitados || 0);
  const routesCount = Number(profile?.rutas_completadas || 0);
  const reviewsCount = Number(profile?.resenas_count || 0);

  return (
    <>
      <Header darkNav />
      <main className="page-wrapper page-wrapper--dark">
        <div className="container page-content profile-container">
          <section className="profile-hero-card">
            <div className="profile-avatar">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} />
              ) : (
                <span className="profile-avatar__initials">
                  {(profile?.nombre?.[0] || user?.email?.[0] || 'T').toUpperCase()}
                </span>
              )}
            </div>
            <h1 className="profile-name">{displayName}</h1>
            <p className="profile-level-label">
              Explorador nivel {nivel} · {profile?.titulo_nivel || 'Viajero Inicial'} ·{' '}
              {profile?.rol === 'admin' ? 'Administrador' : 'Viajero'}
            </p>
            {profile?.ciudad_origen && (
              <p className="profile-origin">
                <Icon name="map-pin" size={13} />
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

          <section className="profile-menu-card" aria-label="Configuración y preferencias">
            <button
              type="button"
              className="profile-row"
              onClick={(e) => {
                e.preventDefault();
                setEditing(!editing);
              }}
            >
              <span className="profile-row__icon">
                <Icon name="settings" size={20} />
              </span>
              <span className="profile-row__label">Configuración de cuenta</span>
              <span className="profile-row__value">{editing ? 'Cerrar' : 'Editar'}</span>
              <Icon name="chevron-right" size={18} className="profile-row__chevron" />
            </button>

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

          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              onDismiss={() => setFeedback(null)}
            />
          )}

          {editing && (
            <section className="profile-edit-card">
              <h2 className="profile-edit-card__title">Datos personales</h2>
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
                    <label htmlFor="pf-avatar">URL de foto de perfil (opcional)</label>
                    <input
                      id="pf-avatar"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
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
      <Footer />
    </>
  );
}
