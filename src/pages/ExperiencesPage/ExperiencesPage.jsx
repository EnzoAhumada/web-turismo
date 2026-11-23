import { Link } from 'react-router-dom';
import { useExperiences } from '../../hooks/useExperiences';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import StarRating from '../../components/ui/StarRating';
import PageHero from '../../components/ui/PageHero';
import FilterTabs from '../../components/ui/FilterTabs';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './ExperiencesPage.css';

export default function ExperiencesPage() {
  const {
    tabs,
    activeTab,
    setActiveTab,
    experiences,
    loading,
    error,
    formatPrice,
  } = useExperiences();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <PageHero
          title="Experiencias"
          subtitle="Reserva actividades únicas guiadas por anfitriones de Andacollo"
          bgClass="exp-hero"
        />

        <div className="container page-content">
          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="chips"
            ariaLabel="Filtrar por categoría"
          />

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando experiencias en Andacollo..." />
          ) : experiences.length === 0 ? (
            <EmptyState
              icon="compass"
              title="No hay experiencias en esta categoría"
              description="Selecciona otra categoría para ver actividades disponibles."
            />
          ) : (
            <div className="exp-grid">
              {experiences.map((exp) => (
                <article
                  key={exp.id}
                  className={`exp-card ${!exp.disponible ? 'exp-card--unavailable' : ''}`}
                >
                  <Link to={`/experiencias/${exp.id}`} className="exp-card__img-wrap">
                    <SmartImage
                      src={exp.imagen_url}
                      alt={exp.nombre}
                      className="exp-card__img"
                    />
                    {!exp.disponible && (
                      <div className="exp-card__unavailable-overlay">
                        <span>No disponible</span>
                      </div>
                    )}
                  </Link>
                  <div className="exp-card__body">
                    <div className="exp-card__top">
                      <div>
                        <p className="exp-card__category">{exp.categoria}</p>
                        <Link to={`/experiencias/${exp.id}`} className="exp-card__title-link">
                          <h3 className="exp-card__title">{exp.nombre}</h3>
                        </Link>
                      </div>
                      <span className="exp-card__cat-icon" aria-hidden="true">
                        <Icon name={exp.icono || 'compass'} size={18} />
                      </span>
                    </div>
                    <p className="exp-card__desc">{exp.descripcion}</p>
                    <div className="exp-card__footer">
                      <div className="exp-card__meta">
                        <span className="exp-card__price">{formatPrice(exp.precio)}</span>
                        <span className="exp-card__duration">
                          <Icon name="clock" size={13} />
                          <span>{exp.duracion}</span>
                        </span>
                      </div>
                      <StarRating value={exp.rating_promedio} />
                    </div>
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
