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
    routeStops,
    generated,
    loading,
    generating,
    feedback,
    setFeedback,
    handleGenerate,
    handleSaveRoute,
    resetPlanner,
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
            <LoadingState message="Cargando planificador de rutas de Andacollo..." />
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

              <section className="planner-result-section" aria-live="polite">
                {generated ? (
                  <>
                    <div className="planner-result-header">
                      <h2 className="section-title">Tu ruta para Andacollo</h2>
                      <div className="planner-result-meta">
                        <span className="chip active">{duration}</span>
                        <span className="chip active">{budget}</span>
                      </div>
                    </div>

                    <ol className="planner-timeline">
                      {routeStops.map((stop, idx) => (
                        <li key={stop.id || idx} className="planner-stop">
                          <div className="planner-stop__time">{stop.time}</div>
                          <div className="planner-stop__connector">
                            <span className="planner-stop__dot">
                              <Icon name={stop.icon || 'map-pin'} size={15} />
                            </span>
                            {idx < routeStops.length - 1 && (
                              <span className="planner-stop__line" aria-hidden="true" />
                            )}
                          </div>
                          <div className="planner-stop__card">
                            <strong className="planner-stop__title">{stop.title}</strong>
                            <p className="planner-stop__type">{stop.type}</p>
                            <p className="planner-stop__duration">
                              <Icon name="clock" size={13} />
                              <span>{stop.duration}</span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className="planner-result-actions">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={(e) => {
                          if (e && e.preventDefault) e.preventDefault();
                          handleSaveRoute();
                        }}
                      >
                        Guardar ruta
                      </Button>
                      <Button
                        variant="outline-dark"
                        size="md"
                        onClick={(e) => {
                          if (e && e.preventDefault) e.preventDefault();
                          resetPlanner();
                        }}
                      >
                        Nueva búsqueda
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="planner-empty">
                    <span className="planner-empty__icon">
                      <Icon name="route" size={38} strokeWidth={1.6} />
                    </span>
                    <h2>Tu ruta aparecerá aquí</h2>
                    <p>Configura tus preferencias y genera una ruta personalizada para Andacollo</p>
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
