import { Link } from 'react-router-dom';
import './CategoryIcon.css';

const COLORS = {
  cultura:     { bg: '#e8f4fd', icon: '#2563eb' },
  gastronomia: { bg: '#fef3e2', icon: '#ea580c' },
  astronomia:  { bg: '#1e1b4b', icon: '#a78bfa' },
  naturaleza:  { bg: '#dcfce7', icon: '#16a34a' },
  religion:    { bg: '#fdf2f8', icon: '#9333ea' },
  mineria:     { bg: '#fef9c3', icon: '#ca8a04' },
  trekking:    { bg: '#ecfdf5', icon: '#059669' },
  fotografia:  { bg: '#fce7f3', icon: '#db2777' },
  eventos:     { bg: '#fff7ed', icon: '#f97316' },
  otros:       { bg: '#f1f5f9', icon: '#64748b' },
};

const ICONS = {
  cultura: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  gastronomia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  astronomia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
    </svg>
  ),
  naturaleza: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 8C8 10 5.9 16.17 3.82 22M9.29 9.47c-2.49 3.66-2.14 8.6.27 11.8" />
      <path d="M21 5c-4-1-7.25 1.29-9 4.69C10.5 12.42 10.5 16 11 18.5" />
    </svg>
  ),
  religion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  mineria: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 14l-4-4m0 0l-4.5-4.5A3.18 3.18 0 0 0 3 7a3.18 3.18 0 0 0 2.5 1.5L10 14" />
      <path d="M14.5 9.5L19 5l-1-1-4.5 4.5" />
      <path d="M10 10l-3 9 9-3" />
    </svg>
  ),
  trekking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  ),
  fotografia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  eventos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  otros: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

export default function CategoryIcon({ id, label, to }) {
  const color = COLORS[id] || COLORS.otros;

  const inner = (
    <div className="cat-icon">
      <div
        className="cat-icon__circle"
        style={{ background: color.bg, color: color.icon }}
      >
        {ICONS[id] || ICONS.otros}
      </div>
      <span className="cat-icon__label">{label}</span>
    </div>
  );

  if (to) return <Link to={to} className="cat-icon-link">{inner}</Link>;
  return inner;
}
