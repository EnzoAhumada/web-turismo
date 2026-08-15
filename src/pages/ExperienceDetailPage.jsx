import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import './PlaceDetailPage.css';

export default function ExperienceDetailPage() {
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
        .from('experiencias')
        .select('*')
        .eq('id', id)
        .single();
      setItem(data);

      if (data) {
        const { data: more } = await supabase
          .from('experiencias')
          .select('*')
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
      .eq('tipo', 'experiencia')
      .eq('item_id', id)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, id]);

  async function toggleFavorite() {
    if (!user) return;
    if (saved) {
      await supabase.from('favoritos').delete()
        .eq('user_id', user.id).eq('tipo', 'experiencia').eq('item_id', id);
      setSaved(false);
    } else {
      await supabase.from('favoritos').insert({ user_id: user.id, tipo: 'experiencia', item_id: id });
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
            <div className="empty-icon">🎯</div>
            <h3>Experiencia no encontrada</h3>
            <Link to="/experiencias" className="section-link">Volver a experiencias</Link>
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
            <Link to="/experiencias" className="place-hero__back" aria-label="Volver">
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
                  {item.categoria ? `${item.categoria} · ` : ''}Experiencia local
                </p>
                <div className="place-meta-row">
                  {item.precio && (
                    <span className="place-status open">{formatPrice(item.precio)}</span>
                  )}
                  {item.duracion && (
                    <span className="place-hours">⏱ {item.duracion}</span>
                  )}
                  {item.disponible === false && (
                    <span className="place-status" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                      No disponible
                    </span>
                  )}
                </div>
              </header>

              <div className="place-actions">
                <button type="button" className="place-action-btn" onClick={toggleFavorite}>
                  <span className="place-action-btn__icon">{saved ? '❤️' : '🤍'}</span>
                  <span>{saved ? 'Guardado' : 'Guardar'}</span>
                </button>
                {item.disponible !== false && (
                  <button type="button" className="place-action-btn">
                    <span className="place-action-btn__icon">📞</span>
                    <span>Reservar</span>
                  </button>
                )}
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
                  {item.precio && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Precio
                      </dt>
                      <dd>{formatPrice(item.precio)} por persona</dd>
                    </div>
                  )}
                  {item.duracion && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                        </svg>
                        Duración
                      </dt>
                      <dd>{item.duracion}</dd>
                    </div>
                  )}
                  {item.categoria && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        Tipo
                      </dt>
                      <dd>{item.categoria}</dd>
                    </div>
                  )}
                  <div className="place-info-row">
                    <dt>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 8 12 12 14 14" />
                      </svg>
                      Disponibilidad
                    </dt>
                    <dd>{item.disponible !== false ? 'Disponible' : 'No disponible'}</dd>
                  </div>
                </dl>
              </section>

              {others.length > 0 && (
                <section className="place-section">
                  <div className="section-header">
                    <h2 className="section-title">Otras experiencias</h2>
                    <Link to="/experiencias" className="section-link">Ver todas</Link>
                  </div>
                  <div className="grid-3">
                    {others.map((exp) => (
                      <Card
                        key={exp.id}
                        image={exp.imagen_url}
                        title={exp.nombre}
                        subtitle={exp.categoria}
                        to={`/experiencias/${exp.id}`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="place-sidebar">
              <div className="place-sidebar-card">
                <h3>🎯 Actividad incluida</h3>
                <ul className="place-tips">
                  <li>Guía experto incluido</li>
                  <li>Equipamiento necesario</li>
                  <li>Seguro de actividad</li>
                </ul>
              </div>
              {item.precio && (
                <div className="place-sidebar-card">
                  <h3>💰 Precio</h3>
                  <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {formatPrice(item.precio)}
                  </p>
                  <p>por persona · {item.duracion || 'consultar duración'}</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
