import { Link } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import Card from '../../components/ui/Card';
import LoadingState from '../../components/ui/LoadingState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './RecommendationsPage.css';

export default function RecommendationsPage() {
  const { highlights, forYou, otherRecs, loading, error } = useRecommendations();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content">
          <header className="recs-header">
            <h1 className="section-title recs-title">
              <span>Recomendado para ti</span>
              <Icon name="sparkles" size={24} className="recs-title__icon" />
            </h1>
            <p className="recs-header__sub">Basado en tus intereses y clima actual de Andacollo</p>
          </header>

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Personalizando recomendaciones para ti..." />
          ) : (
            <>
              <section className="recs-highlights" aria-label="Destacados del día">
                {highlights.map((h) => (
                  <div key={h.id} className={`recs-highlight recs-highlight--${h.variant}`}>
                    <span className="recs-highlight__icon">
                      <Icon name={h.icon || 'moon-star'} size={26} />
                    </span>
                    <div className="recs-highlight__body">
                      <strong>{h.title}</strong>
                      <p>{h.desc}</p>
                    </div>
                    <Link to={h.ctaTo} className="recs-highlight__cta">
                      <span>{h.cta}</span>
                      <Icon name="arrow-right" size={15} />
                    </Link>
                  </div>
                ))}
              </section>

              <section className="recs-section" aria-label="Para ti">
                <div className="section-header">
                  <h2 className="section-title">Te puede interesar</h2>
                  <Link to="/explorar" className="section-link">
                    Ver todo
                  </Link>
                </div>
                <div className="grid-3">
                  {forYou.map((p) => (
                    <Card
                      key={p.id}
                      image={p.image}
                      title={p.title}
                      subtitle={p.subtitle}
                      rating={p.rating}
                      reviewsCount={p.reviewsCount}
                      distance={p.distance}
                      badge={p.badge}
                      to={p.to}
                    />
                  ))}
                </div>
              </section>

              <section className="recs-section" aria-label="Otras recomendaciones">
                <h2 className="section-title">Otras recomendaciones</h2>
                <div className="recs-list">
                  {otherRecs.map((item) => (
                    <Link key={item.id} to={item.to} className="recs-row">
                      <div className="recs-row__img-wrap">
                        <SmartImage src={item.image} alt={item.title} className="recs-row__img" />
                      </div>
                      <div className="recs-row__body">
                        <p className="recs-row__category">{item.category}</p>
                        <h3 className="recs-row__title">{item.title}</h3>
                        <p className="recs-row__date">{item.date}</p>
                      </div>
                      <div className="recs-row__rating">
                        <Icon name="star" size={15} filled />
                        <span>{item.rating}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
