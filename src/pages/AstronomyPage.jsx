import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StarRating from '../components/ui/StarRating';
import './AstronomyPage.css';

const CONDITIONS = [
  { icon: '☀️', label: 'Cielo', value: 'Despejado' },
  { icon: '👁️', label: 'Visibilidad', value: 'Excelente' },
  { icon: '🌙', label: 'Luna', value: 'Creciente 35%' },
  { icon: '🌡️', label: 'Temperatura', value: '14°C' },
];

const TIMES = [
  { time: '20:00', label: 'Puesta de sol', icon: '🌅', quality: 'good' },
  { time: '21:30', label: 'Inicio observación', icon: '🔭', quality: 'best' },
  { time: '02:00', label: 'Fin recomendado', icon: '⭐', quality: 'best' },
];

const SPOTS = [
  { id: 2, title: 'Observatorio Collowara', desc: 'Telescopios profesionales y guías expertos', rating: 4.9, distance: '5.4 km', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', badge: 'Recomendado' },
  { id: 3, title: 'Mirador El Toro', desc: 'Vista panorámica sin contaminación lumínica', rating: 4.7, distance: '3.1 km', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { id: 9, title: 'Cerro Collowara', desc: 'Altitud óptima para observación', rating: 4.8, distance: '6.2 km', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
];

const EVENTS = [
  { date: '10 – 12 Ene 2026', title: 'Festival de las Estrellas', desc: 'Noches de observación y charlas científicas' },
  { date: '22 Mar 2026', title: 'Equinoccio de Otoño', desc: 'Evento especial de observación comunitaria' },
  { date: '15 Abr 2026', title: 'Lluvia de Meteoros', desc: 'Cuádridas visibles desde Andacollo' },
];

export default function AstronomyPage() {
  return (
    <>
      <Header user={{ name: 'Ana Valdés' }} />
      <main className="page-wrapper page-wrapper--dark">
        {/* Hero */}
        <section className="astro-hero">
          <div className="astro-hero__bg" aria-hidden="true" />
          <div className="astro-hero__content container">
            <p className="astro-hero__eyebrow">Turismo Astronómico</p>
            <h1 className="astro-hero__title">Ruta Astronómica</h1>
            <p className="astro-hero__subtitle">Observación de estrellas bajo los cielos más claros de Sudamérica</p>
          </div>
        </section>

        <div className="container page-content">
          <div className="astro-layout">
            {/* Main */}
            <div className="astro-main">
              {/* Conditions */}
              <section className="astro-section">
                <h2 className="astro-section-title">Condiciones actuales</h2>
                <div className="astro-conditions">
                  {CONDITIONS.map(({ icon, label, value }) => (
                    <div key={label} className="astro-condition-card">
                      <span className="astro-condition-card__icon">{icon}</span>
                      <p className="astro-condition-card__label">{label}</p>
                      <strong className="astro-condition-card__value">{value}</strong>
                    </div>
                  ))}
                </div>
              </section>

              {/* Best times */}
              <section className="astro-section">
                <h2 className="astro-section-title">Mejores horarios</h2>
                <div className="astro-times">
                  {TIMES.map(({ time, label, icon, quality }) => (
                    <div key={time} className={`astro-time-card astro-time-card--${quality}`}>
                      <span className="astro-time-card__icon">{icon}</span>
                      <div>
                        <strong className="astro-time-card__time">{time}</strong>
                        <p className="astro-time-card__label">{label}</p>
                      </div>
                      {quality === 'best' && (
                        <span className="astro-time-card__badge">Ideal</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Spots */}
              <section className="astro-section">
                <div className="section-header">
                  <h2 className="astro-section-title">Lugares recomendados</h2>
                  <Link to="/explorar?categoria=astronomia" className="section-link">Ver todos</Link>
                </div>
                <div className="grid-3">
                  {SPOTS.map((spot) => (
                    <Link key={spot.id} to={`/lugar/${spot.id}`} className="astro-spot-card">
                      <img src={spot.image} alt={spot.title} className="astro-spot-card__img" />
                      <div className="astro-spot-card__body">
                        {spot.badge && (
                          <span className="astro-spot-card__badge">{spot.badge}</span>
                        )}
                        <h3 className="astro-spot-card__title">{spot.title}</h3>
                        <p className="astro-spot-card__desc">{spot.desc}</p>
                        <div className="astro-spot-card__meta">
                          <StarRating value={spot.rating} />
                          <span className="astro-spot-card__dist">📍 {spot.distance}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="astro-sidebar">
              <div className="astro-sidebar-card">
                <h3>Próximos eventos astronómicos</h3>
                <ul className="astro-events-list">
                  {EVENTS.map(({ date, title, desc }) => (
                    <li key={title} className="astro-event-item">
                      <span className="astro-event-item__date">{date}</span>
                      <strong className="astro-event-item__title">{title}</strong>
                      <p className="astro-event-item__desc">{desc}</p>
                    </li>
                  ))}
                </ul>
                <Link to="/eventos" className="astro-sidebar-link">Ver todos los eventos →</Link>
              </div>

              <div className="astro-sidebar-card astro-sidebar-card--tip">
                <h3>💡 Consejo de observación</h3>
                <p>Llega al punto de observación al menos 30 minutos antes para que tus ojos se adapten a la oscuridad.</p>
              </div>

              <div className="astro-sidebar-card">
                <h3>Equipo recomendado</h3>
                <ul className="astro-gear-list">
                  <li>🔭 Binoculares o telescopio</li>
                  <li>🧥 Ropa abrigada</li>
                  <li>📱 App de mapas estelares</li>
                  <li>🔦 Linterna de luz roja</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
