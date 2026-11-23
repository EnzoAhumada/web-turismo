import { Link } from 'react-router-dom';
import { useAccommodations } from '../../hooks/useAccommodations';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import StarRating from '../../components/ui/StarRating';
import SearchBar from '../../components/ui/SearchBar';
import PageHero from '../../components/ui/PageHero';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './AccommodationsPage.css';

export default function AccommodationsPage() {
  const {
    accommodations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    formatPrice,
  } = useAccommodations();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <PageHero
          eyebrow="Dónde dormir"
          title="Alojamientos"
          subtitle="Hoteles, hostales, cabañas y domos astronómicos en Andacollo"
          bgClass="acc-hero"
        >
          <SearchBar
            placeholder="Buscar alojamiento…"
            onSearch={(v) => setSearchQuery(v)}
          />
        </PageHero>

        <div className="container page-content">
          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando alojamientos de Andacollo..." />
          ) : accommodations.length === 0 ? (
            <EmptyState
              icon="building"
              title="No se encontraron alojamientos"
              description="Intenta con otra búsqueda"
            />
          ) : (
            <>
              <div className="section-header" style={{ marginBottom: 'var(--space-5)' }}>
                <h2 className="section-title">
                  {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los alojamientos'}
                </h2>
                <span className="section-link">
                  {accommodations.length} alojamiento{accommodations.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="acc-grid">
                {accommodations.map((acc) => (
                  <article key={acc.id} className="acc-card">
                    <Link to={`/alojamientos/${acc.id}`} className="acc-card__img-wrap">
                      <SmartImage
                        src={acc.imagen_url}
                        alt={acc.nombre}
                        className="acc-card__img"
                      />
                      {acc.precio_por_noche && (
                        <div className="acc-card__price-tag">
                          <span className="acc-card__price-value">
                            {formatPrice(acc.precio_por_noche)}
                          </span>
                          <span className="acc-card__price-label">/ noche</span>
                        </div>
                      )}
                    </Link>

                    <div className="acc-card__body">
                      <div className="acc-card__top">
                        <Link to={`/alojamientos/${acc.id}`} className="acc-card__title-link">
                          <h3 className="acc-card__title">{acc.nombre}</h3>
                        </Link>
                        <StarRating value={acc.rating_promedio} />
                      </div>

                      {acc.descripcion && <p className="acc-card__desc">{acc.descripcion}</p>}

                      <div className="acc-card__info">
                        {acc.direccion && (
                          <div className="acc-info-row">
                            <Icon name="map-pin" size={14} />
                            <span>{acc.direccion}</span>
                          </div>
                        )}
                      </div>

                      <div className="acc-card__footer">
                        {acc.precio_por_noche ? (
                          <div className="acc-card__price-display">
                            <span className="acc-card__price-amount">
                              {formatPrice(acc.precio_por_noche)}
                            </span>
                            <span className="acc-card__price-night">CLP / noche</span>
                          </div>
                        ) : (
                          <span className="acc-card__price-night">Consultar precio</span>
                        )}
                        <Link to={`/alojamientos/${acc.id}`} className="acc-card__cta">
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
