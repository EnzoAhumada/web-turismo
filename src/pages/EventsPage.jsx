import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { supabase } from '../lib/supabase';
import './EventsPage.css';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('Próximos');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data } = await supabase
        .from('eventos')
        .select('*')
        .eq('activo', true)
        .order('fecha_inicio', { ascending: true });
      setEvents(data || []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const featuredEvent = events[0];

  function formatDate(d1, d2) {
    if (!d1) return '';
    const opts = { day: 'numeric', month: 'short', year: 'numeric' };
    const start = new Date(d1 + 'T12:00:00').toLocaleDateString('es-CL', opts);
    if (!d2 || d1 === d2) return start;
    const end = new Date(d2 + 'T12:00:00').toLocaleDateString('es-CL', opts);
    return `${start} – ${end}`;
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        {activeTab === 'Próximos' && featuredEvent && (
          <section className="events-featured">
            <div
              className="events-featured__bg"
              style={{ backgroundImage: `url(${featuredEvent.imagen_url})` }}
              aria-hidden="true"
            />
            <div className="events-featured__content container">
              <span className="events-featured__eyebrow">Próximo evento destacado</span>
              <h1 className="events-featured__title">{featuredEvent.nombre}</h1>
              <p className="events-featured__date">
                📅 {formatDate(featuredEvent.fecha_inicio, featuredEvent.fecha_fin)}
              </p>
              <p className="events-featured__desc">{featuredEvent.descripcion}</p>
              {featuredEvent.categoria && (
                <div className="events-featured__tags">
                  <span className="chip">{featuredEvent.categoria}</span>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="container page-content">
          <nav className="tabs" aria-label="Mis eventos">
            {['Próximos', 'Mis eventos'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="route-loading__spinner" />
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event, idx) => (
                <article key={event.id} className={`event-card ${idx === 0 ? 'event-card--highlight' : ''}`}>
                  <Link to={`/eventos/${event.id}`} className="event-card__img-wrap">
                    <img src={event.imagen_url} alt={event.nombre} className="event-card__img" loading="lazy" />
                    {idx === 0 && <span className="event-card__highlight-badge">Destacado</span>}
                  </Link>
                  <div className="event-card__body">
                    <p className="event-card__date">📅 {formatDate(event.fecha_inicio, event.fecha_fin)}</p>
                    <Link to={`/eventos/${event.id}`} className="event-card__title-link">
                      <h3 className="event-card__title">{event.nombre}</h3>
                    </Link>
                    <p className="event-card__category">{event.descripcion}</p>
                    {event.categoria && (
                      <div className="event-card__tags">
                        <span className="chip">{event.categoria}</span>
                      </div>
                    )}
                    <Link to={`/eventos/${event.id}`} className="event-card__detail-btn">
                      Ver detalles →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
