import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import CategoryIcon from '../components/ui/CategoryIcon';
import './TripPlannerPage.css';

const DURATIONS = ['Medio día', '1 día', '2 – 3 días', '+3 días'];
const INTERESTS = [
  { id: 'cultura',     label: 'Cultura' },
  { id: 'naturaleza',  label: 'Naturaleza' },
  { id: 'trekking',    label: 'Aventura' },
  { id: 'gastronomia', label: 'Gastronomía' },
  { id: 'astronomia',  label: 'Astronomía' },
  { id: 'religion',    label: 'Religión' },
];
const BUDGETS = ['Económico', 'Moderado', 'Premium'];

const GENERATED_ROUTE = [
  { time: '09:00', title: 'Santuario de Andacollo', type: 'Cultura · Religión', duration: '1.5 h', icon: '⛪' },
  { time: '10:30', title: 'Desayuno en el Mercado Local', type: 'Gastronomía', duration: '45 min', icon: '☕' },
  { time: '11:30', title: 'Museo Minero de Andacollo', type: 'Cultura · Minería', duration: '1 h', icon: '⛏️' },
  { time: '13:00', title: 'Almuerzo en Restaurante El Valle', type: 'Gastronomía', duration: '1 h', icon: '🍽️' },
  { time: '14:30', title: 'Mirador El Toro', type: 'Naturaleza', duration: '2 h', icon: '🏔️' },
  { time: '20:00', title: 'Observatorio Collowara', type: 'Astronomía', duration: '2 h', icon: '🔭' },
];

export default function TripPlannerPage() {
  const [duration, setDuration] = useState('1 día');
  const [selectedInterests, setSelectedInterests] = useState(['cultura', 'astronomia']);
  const [budget, setBudget] = useState('Moderado');
  const [generated, setGenerated] = useState(false);
  const navigate = useNavigate();

  function toggleInterest(id) {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleGenerate(e) {
    e.preventDefault();
    setGenerated(true);
  }

  return (
    <>
      <Header user={{ name: 'Ana Valdés' }} />
      <main className="page-wrapper">
        <div className="container page-content">
          <div className="planner-layout">
            {/* Form */}
            <section className="planner-form-section">
              <header className="planner-header">
                <h1 className="section-title">Planifica tu viaje</h1>
                <p className="planner-header__sub">Cuéntanos para armar tu ruta ideal</p>
              </header>

              <form className="planner-form" onSubmit={handleGenerate} noValidate>
                {/* Duration */}
                <div className="planner-field">
                  <h2 className="planner-field__title">Tiempo disponible</h2>
                  <div className="planner-options">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`planner-option-btn ${duration === d ? 'active' : ''}`}
                        onClick={() => setDuration(d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="planner-field">
                  <h2 className="planner-field__title">Intereses</h2>
                  <div className="planner-interests">
                    {INTERESTS.map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        className={`planner-interest-btn ${selectedInterests.includes(id) ? 'active' : ''}`}
                        onClick={() => toggleInterest(id)}
                        aria-pressed={selectedInterests.includes(id)}
                      >
                        <CategoryIcon id={id} label={label} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="planner-field">
                  <h2 className="planner-field__title">Presupuesto</h2>
                  <div className="planner-options">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`planner-option-btn ${budget === b ? 'active' : ''}`}
                        onClick={() => setBudget(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="gold" size="lg" fullWidth>
                  Generar mi ruta
                </Button>
              </form>
            </section>

            {/* Result */}
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
                    {GENERATED_ROUTE.map((stop, idx) => (
                      <li key={idx} className="planner-stop">
                        <div className="planner-stop__time">{stop.time}</div>
                        <div className="planner-stop__connector">
                          <span className="planner-stop__dot">{stop.icon}</span>
                          {idx < GENERATED_ROUTE.length - 1 && (
                            <span className="planner-stop__line" aria-hidden="true" />
                          )}
                        </div>
                        <div className="planner-stop__card">
                          <strong className="planner-stop__title">{stop.title}</strong>
                          <p className="planner-stop__type">{stop.type}</p>
                          <p className="planner-stop__duration">⏱ {stop.duration}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="planner-result-actions">
                    <Button variant="primary" size="md" onClick={() => navigate('/favoritos')}>
                      Guardar ruta
                    </Button>
                    <Button variant="outline-dark" size="md" onClick={() => setGenerated(false)}>
                      Nueva búsqueda
                    </Button>
                  </div>
                </>
              ) : (
                <div className="planner-empty">
                  <span className="planner-empty__icon">🗺️</span>
                  <h2>Tu ruta aparecerá aquí</h2>
                  <p>Configura tus preferencias y genera una ruta personalizada para Andacollo</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
