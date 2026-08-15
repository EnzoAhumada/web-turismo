import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/ui/SearchBar';
import './RestaurantsPage.css';

const PRICE_LABELS = {
  '$':   'Económico',
  '$$':  'Moderado',
  '$$$': 'Premium',
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePriceFilter, setActivePriceFilter] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, activePriceFilter]);

  async function fetchRestaurants() {
    setLoading(true);
    let query = supabase.from('restaurantes').select('*').eq('activo', true);

    if (searchQuery.trim()) {
      query = query.ilike('nombre', `%${searchQuery.trim()}%`);
    }
    if (activePriceFilter) {
      query = query.eq('precio_rango', activePriceFilter);
    }

    const { data } = await query.order('nombre');
    setRestaurants(data || []);
    setLoading(false);
  }

  const featured = restaurants[0];
  const rest = restaurants.slice(1);

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <section className="rest-hero">
          <div className="rest-hero__bg" aria-hidden="true" />
          <div className="rest-hero__overlay" aria-hidden="true" />
          <div className="rest-hero__content container">
            <span className="rest-hero__eyebrow">Gastronomía local</span>
            <h1>Restaurantes & Picadas</h1>
            <p>La mejor cocina chilena tradicional en Andacollo</p>
            <div className="rest-hero__search">
              <SearchBar
                placeholder="Buscar restaurante…"
                onSearch={(v) => setSearchQuery(v)}
              />
            </div>
          </div>
        </section>

        <div className="container page-content">
          {/* Price filters */}
          <div className="rest-filters">
            <span className="rest-filters__label">Precio:</span>
            {['$', '$$', '$$$'].map((p) => (
              <button
                key={p}
                type="button"
                className={`chip ${activePriceFilter === p ? 'active' : ''}`}
                onClick={() => setActivePriceFilter(activePriceFilter === p ? null : p)}
              >
                {p} — {PRICE_LABELS[p]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rest-loading">
              <div className="route-loading__spinner" />
            </div>
          ) : restaurants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No se encontraron restaurantes</h3>
              <p>Intenta con otra búsqueda o quita los filtros</p>
            </div>
          ) : (
            <>
              {/* Featured card */}
              {featured && !searchQuery && !activePriceFilter && (
                <section className="rest-featured" aria-label="Destacado">
                  <div className="rest-featured__card">
                    <div className="rest-featured__img-wrap">
                      <img src={featured.imagen_url} alt={featured.nombre} className="rest-featured__img" />
                      <span className="rest-featured__badge">Destacado</span>
                    </div>
                    <div className="rest-featured__body">
                      <div className="rest-featured__meta">
                        {featured.precio_rango && (
                          <span className="rest-price-badge rest-price-badge--gold">
                            {featured.precio_rango} · {PRICE_LABELS[featured.precio_rango] || 'Precio variable'}
                          </span>
                        )}
                      </div>
                      <h2 className="rest-featured__title">{featured.nombre}</h2>
                      {featured.descripcion && (
                        <p className="rest-featured__desc">{featured.descripcion}</p>
                      )}
                      <div className="rest-featured__info">
                        {featured.horario && (
                          <div className="rest-info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                            </svg>
                            <span>{featured.horario}</span>
                          </div>
                        )}
                        {featured.direccion && (
                          <div className="rest-info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{featured.direccion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Grid */}
              <section className="rest-section" aria-label="Lista de restaurantes">
                <div className="section-header">
                  <h2 className="section-title">
                    {searchQuery || activePriceFilter ? 'Resultados' : 'Todos los restaurantes'}
                  </h2>
                  <span className="section-link">
                    {restaurants.length} restaurante{restaurants.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="rest-grid">
                  {(searchQuery || activePriceFilter ? restaurants : rest).map((r) => (
                    <article key={r.id} className="rest-card">
                      <Link to={`/restaurantes/${r.id}`} className="rest-card__img-wrap">
                        <img src={r.imagen_url} alt={r.nombre} className="rest-card__img" loading="lazy" />
                        {r.precio_rango && (
                          <span className="rest-card__price">{r.precio_rango}</span>
                        )}
                      </Link>
                      <div className="rest-card__body">
                        <Link to={`/restaurantes/${r.id}`} style={{ textDecoration: 'none' }}>
                          <h3 className="rest-card__title">{r.nombre}</h3>
                        </Link>
                        {r.descripcion && (
                          <p className="rest-card__desc">{r.descripcion}</p>
                        )}
                        <div className="rest-card__info">
                          {r.horario && (
                            <div className="rest-info-row">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                              </svg>
                              <span>{r.horario}</span>
                            </div>
                          )}
                          {r.direccion && (
                            <div className="rest-info-row">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{r.direccion}</span>
                            </div>
                          )}
                        </div>
                        <Link to={`/restaurantes/${r.id}`} className="rest-card__detail-btn">
                          Ver menú y detalles →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
