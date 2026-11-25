import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import BrandLogo from '../../ui/BrandLogo';
import Icon from '../../ui/Icon';
import BottomNav from '../BottomNav';
import './Header.css';

const NAV_LINKS = [
  { to: '/inicio',       label: 'Inicio' },
  { to: '/explorar',     label: 'Explorar' },
  { to: '/mapa',         label: 'Mapa' },
  { to: '/restaurantes', label: 'Gastronomía' },
  { to: '/alojamientos', label: 'Alojamientos' },
  { to: '/eventos',      label: 'Eventos' },
  { to: '/experiencias', label: 'Experiencias' },
  { to: '/astronomia',   label: 'Astronomía' },
  { to: '/fotografia',   label: 'Astrofotos' },
  { to: '/guias',        label: 'Guías' },
];

export default function Header({ darkNav = false }) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleSignOut(e) {
    if (e && e.preventDefault) e.preventDefault();
    await signOut();
    navigate('/');
  }

  const initials = profile?.nombre
    ? (profile.nombre[0] + (profile.apellido?.[0] || '')).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'T';

  return (
    <>
      <header className="header">
        <div className="header__inner container">
          <Link to="/inicio" className="header__logo" aria-label="Ir al inicio">
            <BrandLogo variant="dark" size="sm" />
          </Link>

          <nav className="header__nav" aria-label="Navegación principal">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  'header__nav-link' + (isActive ? ' active' : '')
                }
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
              >
                Admin
              </NavLink>
            )}
          </nav>

          <div className="header__actions">
            <Link to="/planificador" className="header__pill-btn" title="Planificar viaje">
              <Icon name="route" size={16} />
              <span>Planificar</span>
            </Link>

            {user ? (
              <>
                <Link to="/favoritos" className="header__icon-btn" title="Mis favoritos" aria-label="Mis favoritos">
                  <Icon name="heart" size={19} />
                </Link>

                <div className="header__user-menu">
                  <button
                    type="button"
                    className="header__avatar-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    title="Mi cuenta"
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
                        <Icon name="user" size={16} />
                        <span>Mi perfil</span>
                      </Link>
                      <Link
                        to="/gamificacion"
                        className="header__dropdown-item"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Icon name="award" size={16} />
                        <span>Logros y ranking</span>
                      </Link>
                      <Link
                        to="/favoritos"
                        className="header__dropdown-item"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Icon name="heart" size={16} />
                        <span>Mis favoritos</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="header__dropdown-item header__dropdown-item--admin"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Icon name="shield" size={16} />
                          <span>Panel municipal</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        className="header__dropdown-item header__dropdown-item--danger"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        <Icon name="log-out" size={16} />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                type="button"
                className="btn btn--gold"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </header>

      <BottomNav dark={darkNav} />
    </>
  );
}
