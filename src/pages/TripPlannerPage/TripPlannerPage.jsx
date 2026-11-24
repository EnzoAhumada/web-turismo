import { Link } from 'react-router-dom';
import { useTripPlanner } from '../../hooks/useTripPlanner';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import CategoryIcon from '../../components/ui/CategoryIcon';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './TripPlannerPage.css';

export default function TripPlannerPage() {
  const {
    durations,
    interests,
    budgets,
    duration,
    setDuration,
    selectedInterests,
    toggleInterest,
    budget,
    setBudget,
    itinerary,
    loading,
    generating,
    saving,
    feedback,
    setFeedback,
    handleGenerate,
    handleSaveRoute,
    resetToExample,
  } = useTripPlanner();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content">
          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              onDismiss={() => setFeedback(null)}
            />
          )}

          {loading ? (
            <LoadingState message="Cargando planificador e itinerario de ejemplo de Andacollo..." />
          ) : (
            <div className="planner-layout">
              <section className="planner-form-section">
                <header className="planner-header">
                  <h1 className="section-title">Planifica tu viaje</h1>
                  <p className="planner-header__sub">Cuéntanos para armar tu ruta ideal</p>
                </header>

                <form className="planner-form" onSubmit={handleGenerate} noValidate>
                  <div className="planner-field">
                    <h2 className="planner-field__title">Tiempo disponible</h2>
                    <div className="planner-options">
                      {durations.map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`planner-option-btn ${duration === d ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setDuration(d);
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="planner-field">
                    <h2 className="planner-field__title">Intereses</h2>
                    <div className="planner-interests">
                      {interests.map(({ id, label }) => {
                        const isSelected = selectedInterests.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            className={`planner-interest-btn ${isSelected ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleInterest(id);
                            }}
                            aria-pressed={isSelected}
                          >
                            <CategoryIcon id={id} label={label} outlined active={isSelected} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="planner-field">
                    <h2 className="planner-field__title">Presupuesto</h2>
                    <div className="planner-options">
                      {budgets.map((b) => (
                        <button
                          key={b}
                          type="button"
                          className={`planner-option-btn ${budget === b ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setBudget(b);
                          }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" variant="gold" size="lg" fullWidth disabled={generating}>
                    {generating ? 'Generando itinerario...' : 'Generar mi ruta'}
                  </Button>
                </form>
              </section>

              <section className="planner-result" aria-label="Itinerario sugerido">
                {itinerary && (
                  <div className="planner-itinerary">
                    <div className="planner-itinerary__head">
                      <div>
                        <span className="planner-itinerary__kicker">
                          {itinerary.isExample ? 'Ejemplo de itinerario' : 'Ruta personalizada'}
                        </span>
                        <h2 className="planner-itinerary__title">{itinerary.title}</h2>
                        <p className="planner-itinerary__sub">{itinerary.subtitle}</p>
                      </div>
                      <div className="planner-itinerary__pills">
                        <span>
                          <Icon name="clock" size={14} /> {itinerary.duration}
                        </span>
                        <span>
                          <Icon name="sparkles" size={14} /> {itinerary.estimatedCost}
                        </span>
                      </div>
                    </div>

                    <div className="planner-days">
                      {itinerary.days.map((day) => (
                        <article key={day.dayNumber} className="planner-day-card">
                          <h3 className="planner-day-card__title">{day.label}</h3>

                          {day.blocks.map((block) => (
                            <div key={`${day.dayNumber}-${block.period}`} className="planner-period">
                              <span className="planner-period__badge">{block.period}</span>
                              <ol className="planner-timeline">
                                {block.stops.map((stop) => (
                                  <li key={stop.id} className="planner-stop">
                                    <div className="planner-stop__time">{stop.time}</div>
                                    <div className="planner-stop__card">
                                      <div className="planner-stop__top">
                                        <span className={`planner-stop__type planner-stop__type--${stop.entityType}`}>
                                          <Icon name={stop.icon} size={13} />
                                          <span>{stop.typeLabel}</span>
                                        </span>
                                        <span className="planner-stop__cost">{stop.costLabel}</span>
                                      </div>
                                      <h4 className="planner-stop__title">{stop.title}</h4>
                                      <p className="planner-stop__desc">{stop.description}</p>
                                      <div className="planner-stop__footer">
                                        <span className="planner-stop__dur">
                                          <Icon name="clock" size={13} /> {stop.duration}
                                        </span>
                                        {stop.routePath && (
                                          <Link to={stop.routePath} className="planner-stop__link">
                                            <span>Ver ficha</span>
                                            <Icon name="arrow-right" size={13} />
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          ))}
                        </article>
                      ))}
                    </div>

                    <div className="planner-itinerary__actions">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleSaveRoute}
                        disabled={saving}
                      >
                        <Icon name="check-circle" size={16} />
                        <span>{saving ? 'Guardando...' : 'Guardar en favoritos y completar (+120 XP)'}</span>
                      </Button>
                      {!itinerary.isExample && (
                        <Button type="button" variant="outline" onClick={resetToExample}>
                          Ver itinerario de ejemplo
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
