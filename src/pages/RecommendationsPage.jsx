import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import './RecommendationsPage.css';

const HIGHLIGHTS = [
  {
    id: 1,
    type: 'weather',
    icon: '🌙',
    title: '¡Cielo despejado esta noche!',
    desc: 'Condiciones perfectas para observar estrellas. Visibilidad excelente hasta las 02:00.',
    cta: 'Ver ruta astronómica',
    ctaTo: '/astronomia',
    variant: 'dark',
  },
  {
    id: 2,
    type: 'event',
    icon: '🎉',
    title: 'Fiesta de Andacollo en 12 días',
    desc: 'El evento más importante de la ciudad se aproxima. ¡Organiza tu visita ahora!',
    cta: 'Ver evento',
    ctaTo: '/eventos',
    variant: 'gold',
  },
];

const FOR_YOU = [
  { id: 2, title: 'Ruta Astronómica', subtitle: 'Ideal esta noche', rating: 4.9, distance: '5.4 km', image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&q=80', badge: 'Esta noche' },
  { id: 1, title: 'Museo Minero', subtitle: 'Historia local', rating: 4.6, distance: '2.8 km', image: 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=600&q=80' },
  { id: 3, title: 'Santuario', subtitle: 'Fe y tradición', rating: 4.8, distance: '1.2 km', image: 'https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=600&q=80' },
];

const OTHER_RECS = [
  { id: 3, title: 'Mirador El Toro', category: 'Naturaleza', date: 'Abierto ahora', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70', rating: 4.7 },
  { id: 5, title: 'Gastronomía Local', category: 'Restaurantes', date: 'Cierra a las 22:00', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=70', rating: 4.5 },
  { id: 6, title: 'Tour Minero Guiado', category: 'Experiencias', date: 'Mañana 10:00', image: 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=300&q=70', rating: 4.8 },
  { id: 7, title: 'Feria Gastronómica', category: 'Eventos', date: '15 Feb 2026', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=300&q=70', rating: 4.4 },
];

export default function RecommendationsPage() {
  return (
    <>
      <Header user={{ name: 'Ana Valdés' }} />
      <main className="page-wrapper">
        <div className="container page-content">
          <header className="recs-header">
            <h1 className="section-title">Recomendado para ti ✨</h1>
            <p className="recs-header__sub">Basado en tus intereses y clima actual</p>
          </header>

          {/* Highlight banners */}
          <section className="recs-highlights" aria-label="Destacados del día">
            {HIGHLIGHTS.map((h) => (
              <div key={h.id} className={`recs-highlight recs-highlight--${h.variant}`}>
                <span className="recs-highlight__icon">{h.icon}</span>
                <div className="recs-highlight__body">
                  <strong>{h.title}</strong>
                  <p>{h.desc}</p>
                </div>
                <Link to={h.ctaTo} className="recs-highlight__cta">
                  {h.cta} →
                </Link>
              </div>
            ))}
          </section>

          {/* For you grid */}
          <section className="recs-section" aria-label="Para ti">
            <div className="section-header">
              <h2 className="section-title">Te puede interesar</h2>
              <Link to="/explorar" className="section-link">Ver todo</Link>
            </div>
            <div className="grid-3">
              {FOR_YOU.map((p) => (
                <Card
                  key={p.id}
                  image={p.image}
                  title={p.title}
                  subtitle={p.subtitle}
                  rating={p.rating}
                  distance={p.distance}
                  badge={p.badge}
                  to={`/lugar/${p.id}`}
                />
              ))}
            </div>
          </section>

          {/* More recs */}
          <section className="recs-section" aria-label="Otras recomendaciones">
            <h2 className="section-title">Otras recomendaciones</h2>
            <div className="recs-list">
              {OTHER_RECS.map((item) => (
                <Link key={item.id} to={`/lugar/${item.id}`} className="recs-row">
                  <img src={item.image} alt={item.title} className="recs-row__img" />
                  <div className="recs-row__body">
                    <p className="recs-row__category">{item.category}</p>
                    <h3 className="recs-row__title">{item.title}</h3>
                    <p className="recs-row__date">{item.date}</p>
                  </div>
                  <div className="recs-row__rating">
                    <svg viewBox="0 0 24 24" fill="var(--color-gold)" width="14" height="14">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{item.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
