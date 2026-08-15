import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const NAV_LINKS = [
  { to: '/inicio',       label: 'Inicio' },
  { to: '/explorar',     label: 'Explorar' },
  { to: '/restaurantes', label: 'Gastronomía' },
  { to: '/alojamientos', label: 'Alojamientos' },
  { to: '/eventos',      label: 'Eventos' },
  { to: '/experiencias', label: 'Experiencias' },
];

export default function Header() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const initials = profile?.nombre
    ? (profile.nombre[0] + (profile.apellido?.[0] || '')).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to={user ? '/inicio' : '/'} className="header__logo">
          <svg className="header__logo-icon" viewBox="0 0 36 36" aria-hidden="true">
            <polygon points="18,3 34,30 2,30" fill="var(--color-gold)" />
            <circle cx="18" cy="24" r="6" fill="var(--color-navy)" />
            <circle cx="18" cy="24" r="3" fill="var(--color-gold)" />
          </svg>
          <span className="header__logo-text">
            Thaki<span>Go</span>
          </span>
        </Link>

        <nav className={`header__nav ${menuOpen ? 'open' : ''}`} aria-label="Navegación principal">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'header__nav-link' + (isActive ? ' active' : '')
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                'header__nav-link header__nav-link--admin' + (isActive ? ' active' : '')
              }
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="header__actions">
          {user ? (
            <>
              <Link to="/favoritos" className="header__icon-btn" title="Mis favoritos">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </Link>

              <div className="header__user-menu">
                <button
                  type="button"
                  className="header__avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  title="Mi perfil"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="header__avatar" />
                  ) : (
                    <span className="header__avatar-initials">{initials}</span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="header__dropdown" role="menu">
                    <div className="header__dropdown-user">
                      <p className="header__dropdown-name">
                        {profile ? `${profile.nombre} ${profile.apellido}`.trim() : user.email}
                      </p>
                      <p className="header__dropdown-email">{user.email}</p>
                    </div>
                    <Link
                      to="/perfil"
                      className="header__dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/favoritos"
                      className="header__dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Mis favoritos
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="header__dropdown-item header__dropdown-item--admin"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Panel de administración
                      </Link>
                    )}
                    <button
                      type="button"
                      className="header__dropdown-item header__dropdown-item--danger"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              className="btn btn--gold"
              onClick={() => navigate('/')}
            >
              Ingresar
            </button>
          )}
        </div>

        <button
          type="button"
          className="header__menu-toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
