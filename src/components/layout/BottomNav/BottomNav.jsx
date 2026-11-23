import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Icon from '../../ui/Icon';
import './BottomNav.css';

export default function BottomNav({ dark = false }) {
  const { user } = useAuth();

  const items = [
    { to: user ? '/inicio' : '/explorar', label: 'Inicio', icon: 'home', matchExact: true },
    { to: '/explorar', label: 'Explorar', icon: 'search' },
    { to: '/mapa', label: 'Mapa', icon: 'map-pin' },
    { to: '/favoritos', label: 'Favoritos', icon: 'heart' },
    { to: user ? '/perfil' : '/', label: 'Perfil', icon: 'user' },
  ];

  return (
    <nav
      className={`bottom-nav ${dark ? 'bottom-nav--dark' : ''}`}
      aria-label="Navegación móvil principal"
    >
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.matchExact}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'active' : ''}`
          }
        >
          <span className="bottom-nav__icon">
            <Icon name={item.icon} size={21} strokeWidth={1.9} />
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
