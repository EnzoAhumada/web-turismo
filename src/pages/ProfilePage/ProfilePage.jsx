import { useState } from 'react';
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
    nextThreshold,
    levelProgress,
    editing,
    setEditing,
    nombre,
    setNombre,
    apellido,
    setApellido,
    saving,
    feedback,
    setFeedback,
    handleSave,
    signOut,
  } = useProfileStats();

  const [offlineMode, setOfflineMode] = useState(false);

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
              Explorador nivel {profile?.nivel || 1} · {profile?.rol === 'admin' ? 'Administrador' : 'Viajero'}
            </p>
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
              <span className="profile-row__label">Mis logros</span>
              <span className="profile-row__count">{profile?.resenas_count ?? 7}</span>
              <Icon name="chevron-right" size={18} className="profile-row__chevron" />
            </Link>
            <Link to="/planificador" className="profile-row">
              <span className="profile-row__icon">
                <Icon name="route" size={20} />
              </span>
              <span className="profile-row__label">Rutas completadas</span>
              <span className="profile-row__count">{profile?.rutas_completadas ?? 5}</span>
              <Icon name="chevron-right" size={18} className="profile-row__chevron" />
            </Link>
            <Link to="/explorar" className="profile-row">
              <span className="profile-row__icon">
                <Icon name="map-pin" size={20} />
              </span>
              <span className="profile-row__label">Lugares visitados</span>
              <span className="profile-row__count">{profile?.lugares_visitados ?? 18}</span>
              <Icon name="chevron-right" size={18} className="profile-row__chevron" />
            </Link>
          </section>

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
                onClick={(e) => {
                  e.preventDefault();
                  setOfflineMode(!offlineMode);
                }}
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
                <div className="profile-field">
                  <label htmlFor="pf-email">Correo electrónico</label>
                  <input id="pf-email" type="email" value={user?.email || ''} disabled />
                </div>
                <Button type="submit" variant="gold" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </form>
            </section>
          )}

          <div className="profile-signout-wrap">
            <Button
              variant="danger"
              fullWidth
              onClick={(e) => {
                if (e && e.preventDefault) e.preventDefault();
                signOut();
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
