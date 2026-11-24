import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHomeData } from '../../hooks/useHomeData';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/ui/SearchBar';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import Card from '../../components/ui/Card';
import StarRating from '../../components/ui/StarRating';
import LoadingState from '../../components/ui/LoadingState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './HomePage.css';

const QUICK_LINKS = [
  { to: '/restaurantes', label: 'Gastronomía',  icon: 'utensils', desc: 'Cocina típica y picadas' },
  { to: '/alojamientos', label: 'Alojamientos', icon: 'building', desc: 'Hostales, cabañas y domos' },
  { to: '/eventos',      label: 'Eventos',      icon: 'calendar', desc: 'Fiestas y calendario local' },
  { to: '/experiencias', label: 'Experiencias', icon: 'compass',  desc: 'Tours y actividades guiadas' },
];

function formatNewsDate(value) {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function HomePage() {
  const { profile } = useAuth();
  const { featured, recommended, categories, weatherBanner, news, loading, error } = useHomeData();
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAllNews, setShowAllNews] = useState(false);
  const nombre = profile?.nombre || 'Viajero';
  const visibleNews = showAllNews ? news : news.slice(0, 6);

  return (
    <>
      <Header />

      <main className="page-wrapper">
        <section className="home-top">
          <div className="container">
            <div className="home-top__row">
              <div>
                <h1 className="home-top__greeting">¡Hola, {nombre}!</h1>
                <p className="home-top__sub">¿A dónde quieres ir hoy?</p>
              </div>
              <Link to="/planificador" className="home-top__bag" aria-label="Planificador de viaje" title="Planificar viaje">
                <Icon name="bag" size={20} />
              </Link>
            </div>
            <div className="home-top__search">
              <SearchBar placeholder="Buscar lugares, rutas, experiencias..." />
            </div>
          </div>
        </section>

        <div className="container page-content">
          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando recomendaciones de Andacollo..." />
          ) : (
            <>
              <section className="home-featured" aria-label="Lugar destacado">
                {featured && (
                  <Link to={`/lugar/${featured.id}`} className="home-featured__card">
                    <SmartImage
                      src={featured.imagen_url}
                      alt={featured.nombre}
                      className="home-featured__img"
                      loading="eager"
                    />
                    <div className="home-featured__overlay">
                      <div className="home-featured__info">
                        <span className="home-featured__badge">Destacado en Andacollo</span>
                        <h2 className="home-featured__title">{featured.nombre}</h2>
                        <p className="home-featured__subtitle">
                          {featured.subtitulo || featured.categorias?.nombre}
                        </p>
                        <div className="home-featured__rating">
                          <StarRating
                            value={featured.rating_promedio}
                            count={featured.resenas_count}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="home-featured__side">
                  {weatherBanner && (
                    <div className="home-weather-banner">
                      <div className="home-weather-banner__head">
                        <span className="home-weather-banner__icon">
                          <Icon name={weatherBanner.icono || 'moon-star'} size={24} />
                        </span>
                        <div>
                          <strong>{weatherBanner.titulo}</strong>
                          <p>{weatherBanner.descripcion}</p>
                        </div>
                      </div>
                      <Link to={weatherBanner.cta_ruta} className="home-weather-banner__cta">
                        <span>{weatherBanner.cta_texto}</span>
                        <Icon name="arrow-right" size={15} />
                      </Link>
                    </div>
                  )}

                  <div className="home-cat-panel">
                    <div className="home-cat-panel__head">
                      <h2 className="home-cat-panel__title">Explorar por pilar</h2>
                      <Link to="/explorar" className="section-link">Ver todos</Link>
                    </div>
                    <div className="home-categories">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/explorar?categoria=${cat.id}`}
                          className="home-cat-chip"
                        >
                          <Icon name={cat.icon || 'compass'} size={17} />
                          <span>{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="home-section" aria-label="Recomendado para ti">
                <div className="section-header">
                  <h2 className="section-title">Recomendado para ti</h2>
                  <Link to="/recomendaciones" className="section-link">
                    Ver todo
                  </Link>
                </div>
                <div className="grid-3">
                  {recommended.map((place) => (
                    <Card
                      key={place.id}
                      image={place.imagen_url}
                      title={place.nombre}
                      subtitle={place.subtitulo || place.categorias?.nombre}
                      rating={place.rating_promedio}
                      reviewsCount={place.resenas_count}
                      distance={place.distancia_km ? `${place.distancia_km} km` : null}
                      to={`/lugar/${place.id}`}
                    />
                  ))}
                </div>
              </section>

              {news.length > 0 && (
                <section className="home-section home-news" aria-label="Noticias de Andacollo">
                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Noticias de Andacollo</h2>
                      <p className="home-news__sub">
                        Actualidad comunal, cultura, patrimonio y novedades para tu visita
                      </p>
                    </div>
                    {news.length > 6 && (
                      <button
                        type="button"
                        className="section-link home-news__toggle"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAllNews((prev) => !prev);
                        }}
                      >
                        {showAllNews ? 'Ver menos' : `Ver las ${news.length} noticias`}
                      </button>
                    )}
                  </div>

                  <div className="home-news__grid">
                    {visibleNews.map((item) => (
                      <article key={item.id} className="home-news-card">
                        <div className="home-news-card__img-wrap">
                          <SmartImage
                            src={item.imagen_url}
                            alt={item.titulo}
                            className="home-news-card__img"
                          />
                          <span className="home-news-card__cat">{item.categoria || 'Comuna'}</span>
                        </div>
                        <div className="home-news-card__body">
                          <div className="home-news-card__meta">
                            <span>{item.fuente || 'Andacollo'}</span>
                            <span>·</span>
                            <time dateTime={item.fecha_publicacion}>
                              {formatNewsDate(item.fecha_publicacion)}
                            </time>
                          </div>
                          <h3 className="home-news-card__title">{item.titulo}</h3>
                          <p className="home-news-card__excerpt">{item.resumen}</p>
                          <button
                            type="button"
                            className="home-news-card__btn"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedNews(item);
                            }}
                          >
                            <span>Leer noticia</span>
                            <Icon name="arrow-right" size={14} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          <section className="home-section home-quick-links" aria-label="Accesos rápidos">
            <h2 className="section-title">Servicios y actividades</h2>
            <div className="grid-4">
              {QUICK_LINKS.map(({ to, label, icon, desc }) => (
                <Link key={to} to={to} className="home-quick-card">
                  <span className="home-quick-card__icon">
                    <Icon name={icon} size={22} />
                  </span>
                  <div>
                    <strong>{label}</strong>
                    <p>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {selectedNews && (
        <div
          className="home-news-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNews(null);
          }}
        >
          <article className="home-news-modal">
            <button
              type="button"
              className="home-news-modal__close"
              aria-label="Cerrar noticia"
              onClick={(e) => {
                e.preventDefault();
                setSelectedNews(null);
              }}
            >
              <Icon name="x" size={18} />
            </button>
            {selectedNews.imagen_url && (
              <div className="home-news-modal__hero">
                <SmartImage
                  src={selectedNews.imagen_url}
                  alt={selectedNews.titulo}
                  className="home-news-modal__img"
                />
              </div>
            )}
            <div className="home-news-modal__body">
              <div className="home-news-card__meta">
                <span className="home-news-modal__badge">{selectedNews.categoria || 'Comuna'}</span>
                <span>{selectedNews.fuente || 'Municipalidad de Andacollo'}</span>
                <span>·</span>
                <time dateTime={selectedNews.fecha_publicacion}>
                  {formatNewsDate(selectedNews.fecha_publicacion)}
                </time>
              </div>
              <h2 id="news-modal-title" className="home-news-modal__title">
                {selectedNews.titulo}
              </h2>
              <p className="home-news-modal__lead">{selectedNews.resumen}</p>
              <p className="home-news-modal__content">{selectedNews.contenido}</p>

              <div className="home-news-modal__actions">
                {selectedNews.url_externa && (
                  <a
                    href={selectedNews.url_externa}
                    target="_blank"
                    rel="noreferrer"
                    className="home-news-modal__ext"
                  >
                    <span>Ver fuente original</span>
                    <Icon name="external-link" size={14} />
                  </a>
                )}
                <button
                  type="button"
                  className="home-news-modal__done"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedNews(null);
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      <Footer />
    </>
  );
}
