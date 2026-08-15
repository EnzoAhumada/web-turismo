import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import './PlaceDetailPage.css';

export default function EventDetailPage() {
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
        .from('eventos')
        .select('*')
        .eq('id', id)
        .single();
      setItem(data);

      if (data) {
        const { data: more } = await supabase
          .from('eventos')
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
      .eq('tipo', 'evento')
      .eq('item_id', id)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, id]);

  async function toggleFavorite() {
    if (!user) return;
    if (saved) {
      await supabase.from('favoritos').delete()
        .eq('user_id', user.id).eq('tipo', 'evento').eq('item_id', id);
      setSaved(false);
    } else {
      await supabase.from('favoritos').insert({ user_id: user.id, tipo: 'evento', item_id: id });
      setSaved(true);
    }
  }

  function formatDate(d) {
    if (!d) return null;
    return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  if (loading) return <div className="route-loading"><div className="route-loading__spinner" /></div>;

  if (!item) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div className="container page-content empty-state">
            <div className="empty-icon">🎉</div>
            <h3>Evento no encontrado</h3>
            <Link to="/eventos" className="section-link">Volver a eventos</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const dateRange = item.fecha_inicio === item.fecha_fin || !item.fecha_fin
    ? formatDate(item.fecha_inicio)
    : `${formatDate(item.fecha_inicio)} — ${formatDate(item.fecha_fin)}`;

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="place-hero">
          <img src={item.imagen_url} alt={item.nombre} className="place-hero__img" />
          <div className="place-hero__overlay" />
          <div className="place-hero__nav">
            <Link to="/eventos" className="place-hero__back" aria-label="Volver">
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
                <p className="place-subtitle">
                  {item.categoria ? `${item.categoria} · ` : ''}Andacollo, Chile
                </p>
                <div className="place-meta-row">
                  {dateRange && (
                    <span className="place-status open">📅 {dateRange}</span>
                  )}
                </div>
              </header>

              <div className="place-actions">
                <button type="button" className="place-action-btn" onClick={toggleFavorite}>
                  <span className="place-action-btn__icon">{saved ? '❤️' : '🤍'}</span>
                  <span>{saved ? 'Guardado' : 'Guardar'}</span>
                </button>
                <button type="button" className="place-action-btn">
                  <span className="place-action-btn__icon">🗓️</span>
                  <span>Agendar</span>
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
                <h2 className="place-section__title">Detalles del evento</h2>
                <dl className="place-info-list">
                  {item.fecha_inicio && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Fecha inicio
                      </dt>
                      <dd>{formatDate(item.fecha_inicio)}</dd>
                    </div>
                  )}
                  {item.fecha_fin && item.fecha_fin !== item.fecha_inicio && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Fecha fin
                      </dt>
                      <dd>{formatDate(item.fecha_fin)}</dd>
                    </div>
                  )}
                  {item.categoria && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        Categoría
                      </dt>
                      <dd style={{ textTransform: 'capitalize' }}>{item.categoria}</dd>
                    </div>
                  )}
                  <div className="place-info-row">
                    <dt>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      Lugar
                    </dt>
                    <dd>Andacollo, Región de Coquimbo, Chile</dd>
                  </div>
                </dl>
              </section>

              {others.length > 0 && (
                <section className="place-section">
                  <div className="section-header">
                    <h2 className="section-title">Otros eventos</h2>
                    <Link to="/eventos" className="section-link">Ver todos</Link>
                  </div>
                  <div className="grid-3">
                    {others.map((ev) => (
                      <Card
                        key={ev.id}
                        image={ev.imagen_url}
                        title={ev.nombre}
                        subtitle={ev.categoria}
                        to={`/eventos/${ev.id}`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="place-sidebar">
              <div className="place-sidebar-card">
                <h3>📅 Próximos eventos</h3>
                <p>Andacollo celebra festividades durante todo el año. No te pierdas la <strong>Fiesta de Andacollo</strong> en diciembre.</p>
              </div>
              <div className="place-sidebar-card">
                <h3>💡 Consejo</h3>
                <p>Reserva tu alojamiento con anticipación durante eventos masivos. La ciudad se llena de visitantes.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
