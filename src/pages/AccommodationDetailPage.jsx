import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import './PlaceDetailPage.css';

export default function AccommodationDetailPage() {
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
        .from('alojamientos')
        .select('*')
        .eq('id', id)
        .single();
      setItem(data);

      if (data) {
        const { data: more } = await supabase
          .from('alojamientos')
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
      .eq('tipo', 'alojamiento')
      .eq('item_id', id)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, id]);

  async function toggleFavorite() {
    if (!user) return;
    if (saved) {
      await supabase.from('favoritos').delete()
        .eq('user_id', user.id).eq('tipo', 'alojamiento').eq('item_id', id);
      setSaved(false);
    } else {
      await supabase.from('favoritos').insert({ user_id: user.id, tipo: 'alojamiento', item_id: id });
      setSaved(true);
    }
  }

  function formatPrice(p) {
    if (!p) return null;
    return `$${Number(p).toLocaleString('es-CL')} CLP`;
  }

  if (loading) return <div className="route-loading"><div className="route-loading__spinner" /></div>;

  if (!item) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div className="container page-content empty-state">
            <div className="empty-icon">🏨</div>
            <h3>Alojamiento no encontrado</h3>
            <Link to="/alojamientos" className="section-link">Volver a alojamientos</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="place-hero">
          <img src={item.imagen_url} alt={item.nombre} className="place-hero__img" />
          <div className="place-hero__overlay" />
          <div className="place-hero__nav">
            <Link to="/alojamientos" className="place-hero__back" aria-label="Volver">
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
                <p className="place-subtitle">Alojamiento · Andacollo</p>
                <div className="place-meta-row">
                  {item.precio_por_noche && (
                    <span className="place-status open">
                      {formatPrice(item.precio_por_noche)} / noche
                    </span>
                  )}
                </div>
              </header>

              <div className="place-actions">
                <button type="button" className="place-action-btn" onClick={toggleFavorite}>
                  <span className="place-action-btn__icon">{saved ? '❤️' : '🤍'}</span>
                  <span>{saved ? 'Guardado' : 'Guardar'}</span>
                </button>
                <button type="button" className="place-action-btn">
                  <span className="place-action-btn__icon">📞</span>
                  <span>Contactar</span>
                </button>
                <button type="button" className="place-action-btn">
                  <span className="place-action-btn__icon">🗺️</span>
                  <span>Cómo llegar</span>
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
                  {item.precio_por_noche && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Precio por noche
                      </dt>
                      <dd>{formatPrice(item.precio_por_noche)} CLP</dd>
                    </div>
                  )}
                </dl>
              </section>

              {others.length > 0 && (
                <section className="place-section">
                  <div className="section-header">
                    <h2 className="section-title">Otros alojamientos</h2>
                    <Link to="/alojamientos" className="section-link">Ver todos</Link>
                  </div>
                  <div className="grid-3">
                    {others.map((a) => (
                      <Card
                        key={a.id}
                        image={a.imagen_url}
                        title={a.nombre}
                        subtitle={a.precio_por_noche ? `${formatPrice(a.precio_por_noche)} / noche` : 'Alojamiento'}
                        to={`/alojamientos/${a.id}`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="place-sidebar">
              <div className="place-sidebar-card">
                <h3>🏨 Alojamiento</h3>
                <p>Descanso cómodo en el centro de Andacollo, cerca de todos los atractivos turísticos.</p>
              </div>
              <div className="place-sidebar-card">
                <h3>📅 Mejor temporada</h3>
                <p>La época de mayor afluencia es durante la <strong>Fiesta de Andacollo</strong> en diciembre. Reserva con anticipación.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
