import { Link } from 'react-router-dom';
import { useMapExplorer } from '../../hooks/useMapExplorer';
import Header from '../../components/layout/Header';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import StarRating from '../../components/ui/StarRating';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './MapPage.css';

export default function MapPage() {
  const {
    filterTypes,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    pins,
    selectedPin,
    setSelectedPin,
    loading,
    error,
  } = useMapExplorer();

  return (
    <>
      <Header />
      <main className="map-page">
        <aside className="map-panel">
          <div className="map-panel__header">
            <div className="map-panel__search">
              <Icon name="search" size={17} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en el mapa"
                aria-label="Buscar en el mapa"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="map-panel__clear"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchQuery('');
                  }}
                  aria-label="Limpiar búsqueda"
                >
                  <Icon name="x" size={15} />
                </button>
              )}
            </div>

            <div className="map-panel__filters" role="group" aria-label="Filtrar por tipo">
              {filterTypes.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`map-filter-chip ${activeFilter === f ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveFilter(f);
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando puntos del mapa..." />
          ) : pins.length === 0 ? (
            <EmptyState
              icon="map"
              title="Sin puntos en el mapa"
              description="Prueba con otro filtro o término de búsqueda."
            />
          ) : (
            <ul className="map-place-list">
              {pins.map((pin) => (
                <li key={pin.id}>
                  <button
                    type="button"
                    className={`map-place-item ${selectedPin?.id === pin.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedPin(pin);
                    }}
                  >
                    <span
                      className="map-place-item__dot"
                      style={{ background: pin.color }}
                    />
                    <span className="map-place-item__label">{pin.label}</span>
                    <Icon name="chevron-right" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selectedPin && (
            <div className="map-selected-card">
              <div className="map-selected-card__img-wrap">
                <SmartImage
                  src={selectedPin.image}
                  alt={selectedPin.label}
                  className="map-selected-card__img"
                />
              </div>
              <div className="map-selected-card__info">
                <p className="map-selected-card__type">{selectedPin.categoryLabel}</p>
                <h3 className="map-selected-card__title">{selectedPin.label}</h3>
                <div className="map-selected-card__meta">
                  <StarRating value={selectedPin.rating} />
                  <span className="map-selected-card__dist">
                    <Icon name="map-pin" size={13} />
                    <span>{selectedPin.distance}</span>
                  </span>
                </div>
                <Link to={selectedPin.to} className="map-selected-card__link">
                  <span>Ver detalles</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          )}
        </aside>

        <div className="map-area" role="region" aria-label="Mapa interactivo de Andacollo">
          <div className="map-canvas">
            <svg className="map-canvas__grid" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
              <rect width="1000" height="700" fill="#eef2f6" />
              <path d="M0 180 Q 320 220 550 150 T 1000 210" stroke="#dbe4ee" strokeWidth="22" fill="none" />
              <path d="M120 0 Q 240 320 190 700" stroke="#ffffff" strokeWidth="18" fill="none" />
              <path d="M0 440 L 1000 280" stroke="#ffffff" strokeWidth="16" fill="none" />
              <path d="M460 0 L 580 700" stroke="#ffffff" strokeWidth="16" fill="none" />
              <path d="M720 0 Q 670 360 820 700" stroke="#ffffff" strokeWidth="14" fill="none" />
              <circle cx="500" cy="350" r="145" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 6" fill="rgba(255,255,255,0.28)" />
              <circle cx="500" cy="350" r="260" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="6 6" fill="none" />
            </svg>

            <div className="map-user-dot" title="Tu ubicación en Andacollo">
              <span />
            </div>

            {pins.map((pin) => (
              <button
                key={pin.id}
                type="button"
                className={`map-pin ${selectedPin?.id === pin.id ? 'selected' : ''}`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, '--pin-color': pin.color }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPin(pin);
                }}
                title={pin.label}
                aria-label={`Pin: ${pin.label}`}
              >
                <Icon name="map-pin" size={26} filled />
                <span className="map-pin__label">{pin.label}</span>
              </button>
            ))}

            {selectedPin && (
              <Link to={selectedPin.to} className="map-mobile-preview">
                <div className="map-mobile-preview__img-wrap">
                  <SmartImage
                    src={selectedPin.image}
                    alt={selectedPin.label}
                    className="map-mobile-preview__img"
                  />
                </div>
                <div className="map-mobile-preview__body">
                  <h3 className="map-mobile-preview__title">{selectedPin.label}</h3>
                  <p className="map-mobile-preview__sub">{selectedPin.categoryLabel}</p>
                  <div className="map-mobile-preview__meta">
                    <StarRating value={selectedPin.rating} />
                    <span className="map-mobile-preview__dist">
                      <Icon name="map-pin" size={12} />
                      <span>{selectedPin.distance}</span>
                    </span>
                  </div>
                </div>
                <Icon name="chevron-right" size={18} />
              </Link>
            )}
          </div>

          <div className="map-controls">
            <button
              type="button"
              className="map-control-btn"
              aria-label="Centrar ubicación"
              onClick={(e) => e.preventDefault()}
            >
              <Icon name="locate" size={18} />
            </button>
            <button
              type="button"
              className="map-control-btn map-control-btn--dark"
              aria-label="Brújula"
              onClick={(e) => e.preventDefault()}
            >
              <Icon name="compass" size={18} />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
