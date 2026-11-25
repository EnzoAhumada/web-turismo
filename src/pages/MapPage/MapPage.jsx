import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMapExplorer } from '../../hooks/useMapExplorer';
import { googleMapsDirectionsUrl, googleMapsEmbedUrl, googleMapsPlaceUrl } from '../../lib/andacolloGeo';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const mapsQuery = selectedPin?.mapsQuery || 'Andacollo, Coquimbo, Chile';
  const externalMapsUrl = googleMapsPlaceUrl(mapsQuery);
  const hasActiveFilters = activeFilter !== 'Todos' || Boolean(searchQuery.trim());

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  function selectPin(pin) {
    setSelectedPin(pin);
    setZoom(18);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 48rem)').matches) {
      setIsDrawerOpen(false);
    }
  }

  return (
    <>
      <Header />
      <main className="map-page">
        {isDrawerOpen && (
          <div
            className="map-drawer-backdrop"
            onClick={(e) => {
              e.preventDefault();
              setIsDrawerOpen(false);
            }}
            aria-hidden="true"
          />
        )}

        <aside
          id="map-explorer-drawer"
          className={`map-panel ${isDrawerOpen ? 'map-panel--open' : ''}`}
          aria-label="Menú de exploración del mapa"
          aria-hidden={!isDrawerOpen}
        >
          <div className="map-panel__header">
            <div className="map-panel__top">
              <h2 className="map-panel__title">Explorar mapa</h2>
              <button
                type="button"
                className="map-panel__close"
                aria-label="Cerrar menú del mapa"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDrawerOpen(false);
                }}
              >
                <Icon name="x" size={18} />
              </button>
            </div>

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
                <div className="map-selected-card__actions">
                  <Link to={selectedPin.to} className="map-selected-card__link">
                    <span>Ver detalles</span>
                    <Icon name="arrow-right" size={14} />
                  </Link>
                  <a
                    href={externalMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-selected-card__maps-link"
                    aria-label={`Ver ${selectedPin.label} en Google Maps`}
                  >
                    <Icon name="external-link" size={12} />
                    <span>Ver en Maps</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </aside>

        <div className="map-area" role="region" aria-label="Mapa de Andacollo en Google Maps">
          {!isDrawerOpen && (
            <button
              type="button"
              className="map-drawer-toggle"
              aria-expanded={isDrawerOpen}
              aria-controls="map-explorer-drawer"
              aria-label="Abrir menú del mapa"
              onClick={(e) => {
                e.preventDefault();
                setIsDrawerOpen(true);
              }}
            >
              <Icon name="menu" size={18} />
              <span>Explorar lugares</span>
              {hasActiveFilters && (
                <span className="map-drawer-toggle__badge" aria-hidden="true" />
              )}
            </button>
          )}

          <div className="map-canvas">
            <iframe
              key={`${selectedPin?.id || 'andacollo'}-${zoom}`}
              className="map-canvas__frame"
              title={selectedPin ? `Google Maps: ${selectedPin.label}` : 'Google Maps de Andacollo'}
              src={googleMapsEmbedUrl(mapsQuery, zoom)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {selectedPin && !isDrawerOpen && (
              <article
                className="map-mobile-preview"
                aria-label={`Resumen de ${selectedPin.label}`}
              >
                <Link
                  to={selectedPin.to}
                  className="map-mobile-preview__img-wrap"
                  aria-label={`Ver detalles de ${selectedPin.label}`}
                >
                  <SmartImage
                    src={selectedPin.image}
                    alt={selectedPin.label}
                    className="map-mobile-preview__img"
                  />
                </Link>
                <div className="map-mobile-preview__body">
                  <Link to={selectedPin.to} className="map-mobile-preview__heading">
                    <h3 className="map-mobile-preview__title">{selectedPin.label}</h3>
                    <p className="map-mobile-preview__sub">{selectedPin.categoryLabel}</p>
                  </Link>
                  <div className="map-mobile-preview__meta">
                    <StarRating value={selectedPin.rating} />
                    {selectedPin.distance && (
                      <span className="map-mobile-preview__dist">
                        <Icon name="map-pin" size={12} />
                        <span>{selectedPin.distance}</span>
                      </span>
                    )}
                    <a
                      href={externalMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-mobile-preview__maps-link"
                      aria-label={`Ver ${selectedPin.label} en Google Maps`}
                    >
                      <Icon name="external-link" size={11} />
                      <span>Maps</span>
                    </a>
                  </div>
                </div>
                <Link
                  to={selectedPin.to}
                  className="map-mobile-preview__go"
                  aria-label={`Ver detalles de ${selectedPin.label}`}
                >
                  <Icon name="chevron-right" size={18} />
                </Link>
              </article>
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
