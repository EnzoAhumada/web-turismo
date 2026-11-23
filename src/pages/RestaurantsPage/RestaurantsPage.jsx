import { Link } from 'react-router-dom';
import { useRestaurants } from '../../hooks/useRestaurants';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import StarRating from '../../components/ui/StarRating';
import SearchBar from '../../components/ui/SearchBar';
import PageHero from '../../components/ui/PageHero';
import FilterTabs from '../../components/ui/FilterTabs';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './RestaurantsPage.css';

export default function RestaurantsPage() {
  const {
    restaurants,
    featured,
    rest,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activePriceFilter,
    togglePriceFilter,
    priceLabels,
  } = useRestaurants();

  const priceChips = ['$', '$$', '$$$'].map((p) => ({
    id: p,
    label: `${p} — ${priceLabels[p]}`,
  }));

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <PageHero
          eyebrow="Gastronomía local"
          title="Restaurantes & Picadas"
          subtitle="La mejor cocina chilena y caprina tradicional en Andacollo"
          bgClass="rest-hero"
        >
          <SearchBar
            placeholder="Buscar restaurante o especialidad…"
            onSearch={(v) => setSearchQuery(v)}
          />
        </PageHero>

        <div className="container page-content">
          <FilterTabs
            tabs={priceChips}
            activeTab={activePriceFilter}
            onChange={togglePriceFilter}
            variant="chips"
            labelPrefix="Precio:"
            ariaLabel="Filtrar por rango de precio"
          />

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando restaurantes de Andacollo..." />
          ) : restaurants.length === 0 ? (
            <EmptyState
              icon="utensils"
              title="No se encontraron restaurantes"
              description="Intenta con otra búsqueda o quita los filtros"
            />
          ) : (
            <>
              {featured && !searchQuery && !activePriceFilter && (
                <section className="rest-featured" aria-label="Destacado">
                  <Link to={`/restaurantes/${featured.id}`} className="rest-featured__card">
                    <div className="rest-featured__img-wrap">
                      <SmartImage
                        src={featured.imagen_url}
                        alt={featured.nombre}
                        className="rest-featured__img"
                      />
                      <span className="rest-featured__badge">Destacado</span>
                    </div>
                    <div className="rest-featured__body">
                      <div className="rest-featured__meta">
                        {featured.precio_rango && (
                          <span className="rest-price-badge rest-price-badge--gold">
                            {featured.precio_rango} ·{' '}
                            {priceLabels[featured.precio_rango] || 'Precio variable'}
                          </span>
                        )}
                        <StarRating value={featured.rating_promedio} count={featured.resenas_count} />
                      </div>
                      <h2 className="rest-featured__title">{featured.nombre}</h2>
                      {featured.descripcion && (
                        <p className="rest-featured__desc">{featured.descripcion}</p>
                      )}
                      <div className="rest-featured__info">
                        {featured.horario && (
                          <div className="rest-info-row">
                            <Icon name="clock" size={16} />
                            <span>{featured.horario}</span>
                          </div>
                        )}
                        {featured.direccion && (
                          <div className="rest-info-row">
                            <Icon name="map-pin" size={16} />
                            <span>{featured.direccion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </section>
              )}

              <section className="rest-section" aria-label="Lista de restaurantes">
                <div className="section-header">
                  <h2 className="section-title">
                    {searchQuery || activePriceFilter ? 'Resultados' : 'Todos los restaurantes'}
                  </h2>
                  <span className="section-link">
                    {restaurants.length} restaurante{restaurants.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="rest-grid">
                  {(searchQuery || activePriceFilter ? restaurants : rest).map((r) => (
                    <article key={r.id} className="rest-card">
                      <Link to={`/restaurantes/${r.id}`} className="rest-card__img-wrap">
                        <SmartImage
                          src={r.imagen_url}
                          alt={r.nombre}
                          className="rest-card__img"
                        />
                        {r.precio_rango && (
                          <span className="rest-card__price">{r.precio_rango}</span>
                        )}
                      </Link>
                      <div className="rest-card__body">
                        <div className="rest-card__top">
                          <Link to={`/restaurantes/${r.id}`} className="rest-card__title-link">
                            <h3 className="rest-card__title">{r.nombre}</h3>
                          </Link>
                          <StarRating value={r.rating_promedio} />
                        </div>
                        {r.descripcion && <p className="rest-card__desc">{r.descripcion}</p>}
                        <div className="rest-card__info">
                          {r.horario && (
                            <div className="rest-info-row">
                              <Icon name="clock" size={14} />
                              <span>{r.horario}</span>
                            </div>
                          )}
                          {r.direccion && (
                            <div className="rest-info-row">
                              <Icon name="map-pin" size={14} />
                              <span>{r.direccion}</span>
                            </div>
                          )}
                        </div>
                        <Link to={`/restaurantes/${r.id}`} className="rest-card__detail-btn">
                          <span>Ver menú y detalles</span>
                          <Icon name="arrow-right" size={14} />
                        </Link>
                      </div>
                    </article>
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
