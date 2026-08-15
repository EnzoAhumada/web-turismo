import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import './PlaceDetailPage.css';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [others, setOthers] = useState([]);
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();
      setItem(data);

      if (data) {
        const { data: more } = await supabase
          .from('restaurantes')
          .select('*')
          .eq('activo', true)
          .neq('id', id)
          .limit(3);
        setOthers(more || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', user.id)
      .eq('tipo', 'restaurante')
      .eq('item_id', id)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, id]);

  async function toggleFavorite() {
    if (!user) return;
    if (saved) {
      await supabase.from('favoritos').delete()
        .eq('user_id', user.id).eq('tipo', 'restaurante').eq('item_id', id);
      setSaved(false);
    } else {
      await supabase.from('favoritos').insert({ user_id: user.id, tipo: 'restaurante', item_id: id });
      setSaved(true);
    }
  }

  if (loading) return <div className="route-loading"><div className="route-loading__spinner" /></div>;

  if (!item) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div className="container page-content empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>Restaurante no encontrado</h3>
            <Link to="/restaurantes" className="section-link">Volver a restaurantes</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const PRICE_LABELS = { '$': 'Económico', '$$': 'Moderado', '$$$': 'Premium' };

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="place-hero">
          <img src={item.imagen_url} alt={item.nombre} className="place-hero__img" />
          <div className="place-hero__overlay" />
          <div className="place-hero__nav">
            <Link to="/restaurantes" className="place-hero__back" aria-label="Volver">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </Link>
            <button
              type="button"
              className={`place-hero__save ${saved ? 'saved' : ''}`}
              onClick={toggleFavorite}
              aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="container">
          <div className="place-layout">
            <article className="place-main">
              <header className="place-header">
                <h1 className="place-title">{item.nombre}</h1>
                <p className="place-subtitle">Restaurante · Gastronomía local</p>
                <div className="place-meta-row">
                  {item.precio_rango && (
                    <span className="place-status open">
                      {item.precio_rango} — {PRICE_LABELS[item.precio_rango] || 'Precio variable'}
                    </span>
                  )}
                  {item.horario && (
                    <span className="place-hours">⏰ {item.horario}</span>
                  )}
                </div>
              </header>

              <div className="place-actions">
                <button type="button" className="place-action-btn" onClick={toggleFavorite}>
                  <span className="place-action-btn__icon">{saved ? '❤️' : '🤍'}</span>
                  <span>{saved ? 'Guardado' : 'Guardar'}</span>
                </button>
                <button type="button" className="place-action-btn">
                  <span className="place-action-btn__icon">🗺️</span>
                  <span>Cómo llegar</span>
                </button>
                <button type="button" className="place-action-btn">
                  <span className="place-action-btn__icon">↗️</span>
                  <span>Compartir</span>
                </button>
              </div>

              {item.descripcion && (
                <section className="place-section">
                  <h2 className="place-section__title">Descripción</h2>
                  <p className={`place-desc ${showFullDesc ? '' : 'truncated'}`}>{item.descripcion}</p>
                  <button type="button" className="place-desc__toggle" onClick={() => setShowFullDesc(!showFullDesc)}>
                    {showFullDesc ? 'Ver menos' : 'Ver más'}
                  </button>
                </section>
              )}

              <section className="place-section">
                <h2 className="place-section__title">Información</h2>
                <dl className="place-info-list">
                  {item.direccion && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        Dirección
                      </dt>
                      <dd>{item.direccion}</dd>
                    </div>
                  )}
                  {item.horario && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                        </svg>
                        Horario
                      </dt>
                      <dd>{item.horario}</dd>
                    </div>
                  )}
                  {item.precio_rango && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Rango de precio
                      </dt>
                      <dd>{item.precio_rango} — {PRICE_LABELS[item.precio_rango] || 'Variable'}</dd>
                    </div>
                  )}
                </dl>
              </section>

              {others.length > 0 && (
                <section className="place-section">
                  <div className="section-header">
                    <h2 className="section-title">Otros restaurantes</h2>
                    <Link to="/restaurantes" className="section-link">Ver todos</Link>
                  </div>
                  <div className="grid-3">
                    {others.map((r) => (
                      <Card
                        key={r.id}
                        image={r.imagen_url}
                        title={r.nombre}
                        subtitle={r.precio_rango ? `Precio: ${r.precio_rango}` : 'Restaurante'}
                        to={`/restaurantes/${r.id}`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="place-sidebar">
              <div className="place-sidebar-card">
                <h3>🍽️ Gastronomía local</h3>
                <p>Disfruta de la auténtica cocina chilena en el corazón de Andacollo.</p>
              </div>
              <div className="place-sidebar-card">
                <h3>💡 Consejo del viajero</h3>
                <p>Reserva con anticipación durante la Fiesta de Andacollo en diciembre.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
