import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StarRating from '../components/ui/StarRating';
import Card from '../components/ui/Card';
import './PlaceDetailPage.css';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlace() {
      setLoading(true);
      const { data } = await supabase
        .from('lugares')
        .select('*, categorias(nombre, slug)')
        .eq('id', id)
        .single();
      setPlace(data);

      if (data) {
        const { data: nearbyData } = await supabase
          .from('lugares')
          .select('*, categorias(nombre)')
          .eq('activo', true)
          .neq('id', id)
          .limit(3);
        setNearby(nearbyData || []);
      }
      setLoading(false);
    }
    fetchPlace();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', user.id)
      .eq('tipo', 'lugar')
      .eq('item_id', id)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, id]);

  async function toggleFavorite() {
    if (!user) return;
    if (saved) {
      await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('tipo', 'lugar')
        .eq('item_id', id);
      setSaved(false);
    } else {
      await supabase.from('favoritos').insert({ user_id: user.id, tipo: 'lugar', item_id: id });
      setSaved(true);
    }
  }

  if (loading) {
    return (
      <div className="route-loading">
        <div className="route-loading__spinner" />
      </div>
    );
  }

  if (!place) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div className="container page-content empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Lugar no encontrado</h3>
            <Link to="/explorar" className="section-link">Volver al explorador</Link>
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
          <img src={place.imagen_url} alt={place.nombre} className="place-hero__img" />
          <div className="place-hero__overlay" />
          <div className="place-hero__nav">
            <Link to="/explorar" className="place-hero__back" aria-label="Volver">
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
                <h1 className="place-title">{place.nombre}</h1>
                <p className="place-subtitle">{place.categorias?.nombre}</p>
                <div className="place-meta-row">
                  <StarRating value={place.rating_promedio} />
                  {place.horario && (
                    <>
                      <span className="place-status open">Abierto ahora</span>
                      <span className="place-hours">{place.horario}</span>
                    </>
                  )}
                </div>
              </header>

              <div className="place-actions">
                {[
                  { label: 'Cómo llegar', icon: '🗺️' },
                  { label: 'Guardar', icon: '🔖', action: toggleFavorite },
                  { label: 'Compartir', icon: '↗️' },
                ].map(({ label, icon, action }) => (
                  <button key={label} type="button" className="place-action-btn" onClick={action}>
                    <span className="place-action-btn__icon">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {place.descripcion && (
                <section className="place-section">
                  <h2 className="place-section__title">Descripción</h2>
                  <p className={`place-desc ${showFullDesc ? '' : 'truncated'}`}>{place.descripcion}</p>
                  <button type="button" className="place-desc__toggle" onClick={() => setShowFullDesc(!showFullDesc)}>
                    {showFullDesc ? 'Ver menos' : 'Ver más'}
                  </button>
                </section>
              )}

              <section className="place-section">
                <h2 className="place-section__title">Información</h2>
                <dl className="place-info-list">
                  {place.direccion && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        Dirección
                      </dt>
                      <dd>{place.direccion}</dd>
                    </div>
                  )}
                  {place.horario && (
                    <div className="place-info-row">
                      <dt>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                        </svg>
                        Horario
                      </dt>
                      <dd>{place.horario}</dd>
                    </div>
                  )}
                </dl>
              </section>

              {nearby.length > 0 && (
                <section className="place-section">
                  <div className="section-header">
                    <h2 className="section-title">Lugares cercanos</h2>
                    <Link to="/mapa" className="section-link">Ver en mapa</Link>
                  </div>
                  <div className="grid-3">
                    {nearby.map((p) => (
                      <Card
                        key={p.id}
                        image={p.imagen_url}
                        title={p.nombre}
                        subtitle={p.categorias?.nombre}
                        rating={p.rating_promedio}
                        to={`/lugar/${p.id}`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="place-sidebar">
              {place.latitud && (
                <div className="place-map-preview">
                  <img src={place.imagen_url} alt="Mapa de ubicación" />
                  <div className="place-map-preview__overlay">
                    <Link to="/mapa" className="place-map-preview__btn">Ver en mapa</Link>
                  </div>
                </div>
              )}
              <div className="place-sidebar-card">
                <h3>¿Cuándo ir?</h3>
                <p>La mejor época para visitar es entre <strong>octubre y abril</strong>.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
