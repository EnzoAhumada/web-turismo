import Icon from '../Icon';
import './FilterTabs.css';

export default function FilterTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'tabs',
  ariaLabel = 'Opciones de filtrado',
  labelPrefix = '',
}) {
  const normalized = tabs.map((t) =>
    typeof t === 'string' ? { id: t, label: t } : t
  );

  if (variant === 'chips') {
    return (
      <div className="filter-chips" role="group" aria-label={ariaLabel}>
        {labelPrefix && <span className="filter-chips__label">{labelPrefix}</span>}
        {normalized.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`chip ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
              onClick={(e) => {
                e.preventDefault();
                onChange(item.id);
              }}
            >
              {item.icon && <Icon name={item.icon} size={15} />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'explorer') {
    return (
      <nav className="explorer-tabs" aria-label={ariaLabel}>
        {normalized.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`explorer-tab ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onChange(item.id);
              }}
            >
              {item.icon && (
                <span className="explorer-tab__icon">
                  <Icon name={item.icon} size={17} />
                </span>
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="tabs" aria-label={ariaLabel}>
      {normalized.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onChange(item.id);
            }}
          >
            {item.icon && <Icon name={item.icon} size={16} />}{' '}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
