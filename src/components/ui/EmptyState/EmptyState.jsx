import { Link } from 'react-router-dom';
import Icon from '../Icon';
import './EmptyState.css';

export default function EmptyState({
  icon = 'search',
  title = 'No se encontraron resultados',
  description = '',
  actionLabel = '',
  actionTo = '',
  onAction = null,
}) {
  return (
    <div className="empty-state" role="status">
      {icon && (
        <div className="empty-icon" aria-hidden="true">
          <Icon name={icon} size={36} strokeWidth={1.6} />
        </div>
      )}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="section-link empty-state__action">
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button
          type="button"
          className="section-link empty-state__action"
          onClick={(e) => {
            e.preventDefault();
            onAction();
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
