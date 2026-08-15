import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setApellido(profile.apellido || '');
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    await updateProfile({ nombre, apellido });
    setSaving(false);
    setSuccessMsg('Perfil actualizado correctamente');
    setEditing(false);
  }

  const displayName = profile
    ? `${profile.nombre} ${profile.apellido}`.trim() || user?.email
    : user?.email;

  const LEVEL_PROGRESS = Math.min(((profile?.xp || 0) % 500) / 500, 1);

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content">
          {/* Profile Card */}
          <section className="profile-card">
            <div className="profile-avatar">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" />
              ) : (
                <span className="profile-avatar__initials">
                  {(profile?.nombre?.[0] || user?.email?.[0] || '?').toUpperCase()}
                </span>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{displayName}</h1>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-badges">
                <span className="profile-badge profile-badge--role">
                  {profile?.rol === 'admin' ? '⚡ Admin' : '🧭 Viajero'}
                </span>
                <span className="profile-badge">Nivel {profile?.nivel || 1}</span>
                <span className="profile-badge">{profile?.xp || 0} XP</span>
              </div>
              <div className="profile-xp">
                <div className="profile-xp__bar">
                  <div
                    className="profile-xp__fill"
                    style={{ width: `${LEVEL_PROGRESS * 100}%` }}
                  />
                </div>
                <p className="profile-xp__label">
                  {profile?.xp || 0} / {(Math.floor((profile?.xp || 0) / 500) + 1) * 500} XP para el siguiente nivel
                </p>
              </div>
            </div>
          </section>

          {/* Edit Form */}
          <section className="profile-section">
            <div className="profile-section__header">
              <h2 className="section-title">Datos personales</h2>
              <button
                type="button"
                className="section-link"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {successMsg && (
              <div className="profile-success" role="status">{successMsg}</div>
            )}

            <form className="profile-form" onSubmit={handleSave}>
              <div className="profile-field-row">
                <div className="profile-field">
                  <label htmlFor="pf-nombre">Nombre</label>
                  <input
                    id="pf-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div className="profile-field">
                  <label htmlFor="pf-apellido">Apellido</label>
                  <input
                    id="pf-apellido"
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
              <div className="profile-field">
                <label htmlFor="pf-email">Correo electrónico</label>
                <input
                  id="pf-email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              {editing && (
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              )}
            </form>
          </section>

          {/* Estadísticas */}
          <section className="profile-section">
            <h2 className="section-title">Mis estadísticas</h2>
            <div className="profile-stats">
              {[
                { label: 'Lugares visitados', value: '0', icon: '📍' },
                { label: 'Favoritos', value: '0', icon: '❤️' },
                { label: 'Reseñas',  value: '0', icon: '⭐' },
                { label: 'Nivel actual', value: String(profile?.nivel || 1), icon: '🏅' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="profile-stat">
                  <span className="profile-stat__icon">{icon}</span>
                  <div>
                    <p className="profile-stat__value">{value}</p>
                    <p className="profile-stat__label">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cerrar sesión */}
          <section className="profile-section">
            <Button variant="danger" onClick={signOut}>
              Cerrar sesión
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
