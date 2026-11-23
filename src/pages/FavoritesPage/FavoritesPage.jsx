import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SmartImage from '../../components/ui/SmartImage';
import Icon from '../../components/ui/Icon';
import StarRating from '../../components/ui/StarRating';
import FilterTabs from '../../components/ui/FilterTabs';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const {
    tabs,
    activeTab,
    setActiveTab,
    favorites,
    removeFavorite,
    loading,
    error,
  } = useFavorites();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content">
          <header className="favs-header">
            <h1 className="section-title">Mis Favoritos</h1>
            <p className="favs-header__count">
              {loading ? '…' : favorites.length} guardados
            </p>
          </header>

          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            ariaLabel="Categorías de favoritos"
          />

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando tus favoritos..." />
          ) : favorites.length > 0 ? (
            <ul className="favs-list">
              {favorites.map((item) => (
                <li key={item.id} className="favs-item">
                  <Link to={item.to || `/lugar/${item.id}`} className="favs-item__link">
                    <div className="favs-item__img-wrap">
                      <SmartImage src={item.image} alt={item.title} className="favs-item__img" />
                    </div>
                    <div className="favs-item__body">
                      <p className="favs-item__category">{item.category}</p>
                      <h3 className="favs-item__title">{item.title}</h3>
                      <div className="favs-item__meta">
                        {item.rating !== undefined && item.rating !== null && (
                          <StarRating value={item.rating} />
                        )}
                        {item.distance && (
                          <span className="favs-item__dist">
                            <Icon name="map-pin" size={13} />
                            <span>{item.distance}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="favs-item__remove"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(item.favId);
                    }}
                    aria-label={`Quitar ${item.title} de favoritos`}
                  >
                    <Icon name="heart" size={20} filled />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="heart"
              title={`No tienes ${activeTab.toLowerCase()} guardados`}
              description="Explora Andacollo y guarda tus sitios y actividades favoritas"
              actionLabel="Explorar lugares"
              actionTo="/explorar"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
