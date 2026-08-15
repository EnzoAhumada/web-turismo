import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import StarRating from '../components/ui/StarRating';
import './MapPage.css';

const FILTER_TYPES = ['Lugares', 'Restaurantes', 'Hospedajes', 'Rutas'];

const MAP_PINS = [
  { id: 1, label: 'Santuario de Andacollo', type: 'lugar', x: 50, y: 45, color: 'var(--color-gold)' },
  { id: 2, label: 'Observatorio Collowara', type: 'lugar', x: 72, y: 28, color: 'var(--color-gold)' },
  { id: 3, label: 'Mirador El Toro', x: 30, y: 32, color: '#e74c3c', type: 'lugar' },
  { id: 4, label: 'Restaurante El Valle', x: 45, y: 60, color: '#e67e22', type: 'restaurante' },
  { id: 5, label: 'Hostal Minero', x: 62, y: 55, color: '#27ae60', type: 'hospedaje' },
  { id: 6, label: 'Museo Minero', x: 38, y: 70, color: '#9b59b6', type: 'lugar' },
];

export default function MapPage() {
  const [activeFilter, setActiveFilter] = useState('Lugares');
  const [selectedPin, setSelectedPin] = useState(MAP_PINS[0]);

  return (
    <>
      <Header user={{ name: 'Ana Valdés' }} />
      <main className="map-page">
        {/* Left panel */}
        <aside className="map-panel">
          <div className="map-panel__header">
            <div className="map-panel__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="search" placeholder="Buscar en el mapa" aria-label="Buscar en el mapa" />
            </div>

            <div className="map-panel__filters" role="group" aria-label="Filtrar por tipo">
              {FILTER_TYPES.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`map-filter-chip ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Place list */}
          <ul className="map-place-list">
            {MAP_PINS.map((pin) => (
              <li key={pin.id}>
                <button
                  type="button"
                  className={`map-place-item ${selectedPin?.id === pin.id ? 'active' : ''}`}
                  onClick={() => setSelectedPin(pin)}
                >
                  <span
                    className="map-place-item__dot"
                    style={{ background: pin.color }}
                  />
                  <span className="map-place-item__label">{pin.label}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          {/* Selected card */}
          {selectedPin && (
            <div className="map-selected-card">
              <img
                src={`https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=400&q=70`}
                alt={selectedPin.label}
                className="map-selected-card__img"
              />
              <div className="map-selected-card__info">
                <p className="map-selected-card__type">{selectedPin.type}</p>
                <h3 className="map-selected-card__title">{selectedPin.label}</h3>
                <div className="map-selected-card__meta">
                  <StarRating value={4.7} />
                  <span className="map-selected-card__dist">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    3.1 km
                  </span>
                </div>
                <Link to={`/lugar/${selectedPin.id}`} className="map-selected-card__link">
                  Ver detalles →
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Map area */}
        <div className="map-area" role="img" aria-label="Mapa interactivo de Andacollo">
          <div className="map-placeholder">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Andacollo_Andes.JPG/1280px-Andacollo_Andes.JPG"
              alt="Vista de Andacollo"
              className="map-placeholder__img"
            />
            <div className="map-placeholder__overlay">
              <p className="map-placeholder__text">
                🗺️ Mapa interactivo<br />
                <span>Se integrará con el servicio de mapas</span>
              </p>
            </div>
            {/* Simulated pins */}
            {MAP_PINS.map((pin) => (
              <button
                key={pin.id}
                type="button"
                className={`map-pin ${selectedPin?.id === pin.id ? 'selected' : ''}`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, '--pin-color': pin.color }}
                onClick={() => setSelectedPin(pin)}
                title={pin.label}
                aria-label={`Pin: ${pin.label}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="map-pin__label">{pin.label}</span>
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="map-controls">
            <button type="button" className="map-control-btn" aria-label="Acercar">+</button>
            <button type="button" className="map-control-btn" aria-label="Alejar">−</button>
            <button type="button" className="map-control-btn" aria-label="Mi ubicación">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
