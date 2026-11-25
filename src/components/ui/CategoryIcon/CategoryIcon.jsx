import { Link } from 'react-router-dom';
import Icon from '../Icon';
import './CategoryIcon.css';

const CATEGORY_STYLES = {
  cultura:     { bg: '#8a5219', color: '#ffffff', icon: 'landmark' },
  gastronomia: { bg: '#c94a1a', color: '#ffffff', icon: 'utensils' },
  astronomia:  { bg: '#132756', color: '#ffffff', icon: 'moon-star' },
  naturaleza:  { bg: '#2c7d32', color: '#ffffff', icon: 'trees' },
  religion:    { bg: '#0c869c', color: '#ffffff', icon: 'church' },
  mineria:     { bg: '#1e242c', color: '#ffffff', icon: 'pickaxe' },
  trekking:    { bg: '#137b3d', color: '#ffffff', icon: 'mountain' },
  fotografia:  { bg: '#2b243c', color: '#ffffff', icon: 'camera' },
  eventos:     { bg: '#f26a4b', color: '#ffffff', icon: 'calendar' },
  guias:       { bg: '#16b3ac', color: '#ffffff', icon: 'compass' },
  otros:       { bg: '#16b3ac', color: '#ffffff', icon: 'compass' },
};

export default function CategoryIcon({ id, label, to, active = false, outlined = false }) {
  const style = CATEGORY_STYLES[id] || CATEGORY_STYLES.otros;

  const circleStyle = outlined
    ? {
        background: active ? style.bg : '#ffffff',
        color: active ? '#ffffff' : style.bg,
        borderColor: style.bg,
      }
    : {
        background: style.bg,
        color: style.color,
        borderColor: 'transparent',
      };

  const inner = (
    <div className={`cat-icon ${active ? 'active' : ''}`}>
      <div className="cat-icon__circle" style={circleStyle}>
        <Icon name={style.icon} size={24} strokeWidth={1.8} />
      </div>
      <span className="cat-icon__label">{label}</span>
    </div>
  );

  if (to) return <Link to={to} className="cat-icon-link">{inner}</Link>;
  return inner;
}
