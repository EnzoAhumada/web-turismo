import { Link } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import FilterTabs from '../../components/ui/FilterTabs';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './EventsPage.css';

export default function EventsPage() {
  const {
    activeTab,
    setActiveTab,
    events,
    featuredEvent,
    savedEventIds,
    toggleSaveEvent,
    loading,
    error,
    formatDate,
  } = useEvents();

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
                <Icon name="calendar" size={16} />
                <span>{formatDate(featuredEvent.fecha_inicio, featuredEvent.fecha_fin)}</span>
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
          <FilterTabs
            tabs={['Próximos', 'Mis eventos']}
            activeTab={activeTab}
            onChange={setActiveTab}
            ariaLabel="Mis eventos"
          />

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando calendario de eventos..." />
          ) : events.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No hay eventos para mostrar"
              description="Explora las próximas festividades de Andacollo y guárdalas con el marcador."
            />
          ) : (
            <div className="events-grid">
              {events.map((event, idx) => {
                const isSaved = savedEventIds.includes(event.id);
                return (
                  <article
                    key={event.id}
                    className={`event-card ${idx === 0 ? 'event-card--highlight' : ''}`}
                  >
                    <Link to={`/eventos/${event.id}`} className="event-card__img-wrap">
                      <SmartImage
                        src={event.imagen_url}
                        alt={event.nombre}
                        className="event-card__img"
                      />
                      {idx === 0 && (
                        <span className="event-card__highlight-badge">Destacado</span>
                      )}
                    </Link>
                    <div className="event-card__body">
                      <div className="event-card__top">
                        <p className="event-card__date">
                          <Icon name="calendar" size={14} />
                          <span>{formatDate(event.fecha_inicio, event.fecha_fin)}</span>
                        </p>
                        <button
                          type="button"
                          className={`event-card__bookmark ${isSaved ? 'saved' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSaveEvent(event.id);
                          }}
                          aria-label={isSaved ? 'Quitar evento guardado' : 'Guardar evento'}
                        >
                          <Icon name="bookmark" size={18} filled={isSaved} />
                        </button>
                      </div>
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
                        <span>Ver detalles</span>
                        <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
