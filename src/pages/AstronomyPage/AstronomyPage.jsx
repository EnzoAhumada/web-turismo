import { Link } from 'react-router-dom';
import { useAstronomy } from '../../hooks/useAstronomy';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import StarRating from '../../components/ui/StarRating';
import LoadingState from '../../components/ui/LoadingState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './AstronomyPage.css';

export default function AstronomyPage() {
  const { conditions, times, spots, events, tip, gear, loading, error } = useAstronomy();

  return (
    <>
      <Header darkNav />
      <main className="page-wrapper page-wrapper--dark">
        <section className="astro-banner">
          <div className="container">
            <Link to="/explorar" className="astro-banner__back">
              <Icon name="arrow-left" size={18} />
              <span>Explorar</span>
            </Link>
            <span className="astro-banner__eyebrow">Turismo Astronómico</span>
            <h1 className="astro-banner__title">Ruta Astronómica</h1>
            <p className="astro-banner__subtitle">
              Observación de estrellas bajo los cielos más limpios del hemisferio sur
            </p>
          </div>
        </section>

        <div className="container page-content">
          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Consultando condiciones astronómicas de Andacollo..." />
          ) : (
            <div className="astro-layout">
              <div className="astro-main">
                <section className="astro-panel">
                  <h2 className="astro-panel__title">Condiciones actuales</h2>
                  <div className="astro-conditions-grid">
                    {conditions.map(({ id, icon, label, value }) => (
                      <div key={id || label} className="astro-condition-item">
                        <span className="astro-condition-item__icon">
                          <Icon name={icon || 'sun'} size={24} strokeWidth={1.65} />
                        </span>
                        <span className="astro-condition-item__label">{label}</span>
                        <strong className="astro-condition-item__value">{value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="astro-best-hours">
                    <div className="astro-best-hours__head">
                      <span className="astro-best-hours__label">Mejores horarios</span>
                      {times[0]?.time && (
                        <strong className="astro-best-hours__range">
                          {times[0].time}
                        </strong>
                      )}
                    </div>
                    <div className="astro-best-hours__list">
                      {times.map(({ id, time, label, icon, quality }) => (
                        <div key={id || time} className={`astro-hour-pill astro-hour-pill--${quality}`}>
                          <Icon name={icon || 'clock'} size={14} />
                          <strong>{time}</strong>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="astro-panel">
                  <div className="section-header">
                    <h2 className="astro-panel__title">Lugares recomendados</h2>
                    <Link to="/explorar?categoria=astronomia" className="astro-link">
                      Ver todos
                    </Link>
                  </div>
                  <div className="astro-spots-list">
                    {spots.map((spot) => (
                      <Link key={spot.id} to={`/lugar/${spot.id}`} className="astro-spot-row">
                        <div className="astro-spot-row__img-wrap">
                          <SmartImage src={spot.image} alt={spot.title} className="astro-spot-row__img" />
                        </div>
                        <div className="astro-spot-row__body">
                          <h3 className="astro-spot-row__title">{spot.title}</h3>
                          <p className="astro-spot-row__desc">{spot.desc}</p>
                          <div className="astro-spot-row__meta">
                            <StarRating value={spot.rating} />
                            <span className="astro-spot-row__dist">
                              <Icon name="map-pin" size={13} />
                              <span>{spot.distance}</span>
                            </span>
                          </div>
                        </div>
                        <span className="astro-spot-row__chevron">
                          <Icon name="chevron-right" size={18} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="astro-sidebar">
                <div className="astro-panel">
                  <h3 className="astro-panel__title">Próximos eventos celestes</h3>
                  <ul className="astro-events-list">
                    {events.map(({ id, date, title, desc }) => (
                      <li key={id || title} className="astro-event-item">
                        <span className="astro-event-item__date">{date}</span>
                        <strong className="astro-event-item__title">{title}</strong>
                        <p className="astro-event-item__desc">{desc}</p>
                      </li>
                    ))}
                  </ul>
                  <Link to="/eventos" className="astro-link">
                    Ver calendario completo
                  </Link>
                </div>

                {tip && (
                  <div className="astro-panel astro-panel--tip">
                    <h3 className="astro-panel__title astro-panel__title--icon">
                      <Icon name={tip.icono || 'lightbulb'} size={18} />
                      <span>{tip.titulo}</span>
                    </h3>
                    <p className="astro-panel__text">{tip.contenido}</p>
                  </div>
                )}

                {gear.length > 0 && (
                  <div className="astro-panel">
                    <h3 className="astro-panel__title">Equipo recomendado</h3>
                    <ul className="astro-gear-list">
                      {gear.map((g) => (
                        <li key={g.id}>
                          <Icon name={g.icono || 'telescope'} size={16} />
                          <span>{g.contenido}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
