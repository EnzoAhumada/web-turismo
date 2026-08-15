import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/ui/SearchBar';
import './AccommodationsPage.css';

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAccommodations();
  }, [searchQuery]);

  async function fetchAccommodations() {
    setLoading(true);
    let query = supabase.from('alojamientos').select('*').eq('activo', true);

    if (searchQuery.trim()) {
      query = query.ilike('nombre', `%${searchQuery.trim()}%`);
    }

    const { data } = await query.order('precio_por_noche', { ascending: true });
    setAccommodations(data || []);
    setLoading(false);
  }

  function formatPrice(p) {
    if (!p) return null;
    return `$${Number(p).toLocaleString('es-CL')}`;
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <section className="acc-hero">
          <div className="acc-hero__bg" aria-hidden="true" />
          <div className="acc-hero__overlay" aria-hidden="true" />
          <div className="acc-hero__content container">
            <span className="acc-hero__eyebrow">Dónde dormir</span>
            <h1>Alojamientos</h1>
            <p>Hostales, hosterías y cabañas en Andacollo</p>
            <div className="acc-hero__search">
              <SearchBar
                placeholder="Buscar alojamiento…"
                onSearch={(v) => setSearchQuery(v)}
              />
            </div>
          </div>
        </section>

        <div className="container page-content">
          {loading ? (
            <div className="acc-loading">
              <div className="route-loading__spinner" />
            </div>
          ) : accommodations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏨</div>
              <h3>No se encontraron alojamientos</h3>
              <p>Intenta con otra búsqueda</p>
            </div>
          ) : (
            <>
              <div className="section-header" style={{ marginBottom: 'var(--space-5)' }}>
                <h2 className="section-title">
                  {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los alojamientos'}
                </h2>
                <span className="section-link">
                  {accommodations.length} alojamiento{accommodations.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="acc-grid">
                {accommodations.map((acc) => (
                  <article key={acc.id} className="acc-card">
                    <Link to={`/alojamientos/${acc.id}`} className="acc-card__img-wrap">
                      <img src={acc.imagen_url} alt={acc.nombre} className="acc-card__img" loading="lazy" />
                      {acc.precio_por_noche && (
                        <div className="acc-card__price-tag">
                          <span className="acc-card__price-value">{formatPrice(acc.precio_por_noche)}</span>
                          <span className="acc-card__price-label">/ noche</span>
                        </div>
                      )}
                    </Link>

                    <div className="acc-card__body">
                      <Link to={`/alojamientos/${acc.id}`} style={{ textDecoration: 'none' }}>
                        <h3 className="acc-card__title">{acc.nombre}</h3>
                      </Link>

                      {acc.descripcion && (
                        <p className="acc-card__desc">{acc.descripcion}</p>
                      )}

                      <div className="acc-card__info">
                        {acc.direccion && (
                          <div className="acc-info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{acc.direccion}</span>
                          </div>
                        )}
                      </div>

                      <div className="acc-card__footer">
                        {acc.precio_por_noche ? (
                          <div className="acc-card__price-display">
                            <span className="acc-card__price-amount">{formatPrice(acc.precio_por_noche)}</span>
                            <span className="acc-card__price-night">CLP / noche</span>
                          </div>
                        ) : (
                          <span className="acc-card__price-night">Consultar precio</span>
                        )}
                        <Link to={`/alojamientos/${acc.id}`} className="acc-card__cta">Ver detalles</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
