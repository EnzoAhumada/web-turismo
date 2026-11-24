import { NavLink } from 'react-router-dom';
import BrandLogo from '../../ui/BrandLogo';
import Icon from '../../ui/Icon';
import './AdminSidebar.css';

const MENU = [
  { icon: 'grid',       label: 'Resumen',      to: '/admin' },
  { icon: 'newspaper',  label: 'Noticias',     to: '/admin/noticias' },
  { icon: 'map-pin',    label: 'Lugares',      to: '/admin/lugares' },
  { icon: 'moon-star',  label: 'Astronomía',   to: '/admin/astronomia' },
  { icon: 'compass',    label: 'Experiencias', to: '/admin/experiencias' },
  { icon: 'utensils',   label: 'Restaurantes', to: '/admin/restaurantes' },
  { icon: 'building',   label: 'Alojamientos', to: '/admin/alojamientos' },
  { icon: 'calendar',   label: 'Eventos',      to: '/admin/eventos' },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <BrandLogo variant="dark" size="sm" />
      </div>

      <nav className="admin-sidebar__nav" aria-label="Menú administrativo">
        {MENU.map(({ icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              'admin-sidebar__link' + (isActive ? ' active' : '')
            }
          >
            <span className="admin-sidebar__icon">
              <Icon name={icon} size={18} />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
