import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMapExplorer } from '../../hooks/useMapExplorer';
import { googleMapsDirectionsUrl, googleMapsEmbedUrl } from '../../lib/andacolloGeo';
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
  const [zoom, setZoom] = useState(17);
  const mapsQuery = selectedPin?.mapsQuery || 'Andacollo, Coquimbo, Chile';

  function selectPin(pin) {
    setSelectedPin(pin);
    setZoom(18);
  }

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
                      selectPin(pin);
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
                <p className="map-selected-card__address">{selectedPin.address}</p>
                <div className="map-selected-card__meta">
                  <StarRating value={selectedPin.rating} />
                  {selectedPin.distance && (
                    <span className="map-selected-card__dist">
                      <Icon name="map-pin" size={13} />
                      <span>{selectedPin.distance}</span>
                    </span>
                  )}
                </div>
                <Link to={selectedPin.to} className="map-selected-card__link">
                  <span>Ver detalles</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          )}
        </aside>

        <div className="map-area" role="region" aria-label="Mapa de Andacollo en Google Maps">
          <div className="map-canvas">
            <iframe
              key={`${selectedPin?.id || 'andacollo'}-${zoom}`}
              className="map-canvas__frame"
              title={selectedPin ? `Google Maps: ${selectedPin.label}` : 'Google Maps de Andacollo'}
              src={googleMapsEmbedUrl(mapsQuery, zoom)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {selectedPin && (
              <div className="map-focus" aria-live="polite">
                <span className="map-focus__pin" style={{ '--pin-color': selectedPin.color }}>
                  <span className="map-focus__ring" />
                  <Icon name="map-pin" size={28} filled />
                </span>
                <div className="map-focus__card">
                  <span className="map-focus__kicker">Ubicación seleccionada</span>
                  <strong>{selectedPin.label}</strong>
                  <span>{selectedPin.address}</span>
                </div>
              </div>
            )}

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
              aria-label="Acercar"
              onClick={(e) => {
                e.preventDefault();
                setZoom((value) => Math.min(value + 1, 20));
              }}
            >
              <Icon name="plus" size={18} />
            </button>
            <button
              type="button"
              className="map-control-btn"
              aria-label="Alejar"
              onClick={(e) => {
                e.preventDefault();
                setZoom((value) => Math.max(value - 1, 12));
              }}
            >
              <Icon name="minus" size={18} />
            </button>
            <a
              className="map-control-btn map-control-btn--dark"
              href={googleMapsDirectionsUrl(mapsQuery)}
              target="_blank"
              rel="noreferrer"
              aria-label="Cómo llegar en Google Maps"
            >
              <Icon name="navigation" size={18} />
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
