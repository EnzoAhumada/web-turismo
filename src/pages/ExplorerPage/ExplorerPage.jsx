import { useExplorerData } from '../../hooks/useExplorerData';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/ui/SearchBar';
import CategoryIcon from '../../components/ui/CategoryIcon';
import Card from '../../components/ui/Card';
import FilterTabs from '../../components/ui/FilterTabs';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './ExplorerPage.css';

export default function ExplorerPage() {
  const {
    tabs,
    categories,
    popularFilters,
    activeTab,
    currentTab,
    categoryFilter,
    popularFilter,
    searchQuery,
    setSearchQuery,
    changeTab,
    selectCategory,
    togglePopularFilter,
    clearFilters,
    items,
    loading,
    error,
  } = useExplorerData();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <section className="explorer-top">
          <div className="container">
            <h1 className="explorer-top__title">Explorar</h1>
            <p className="explorer-top__sub">
              Descubre atractivos reales, gastronomía, alojamientos y experiencias en Andacollo
            </p>
            <div className="explorer-top__search">
              <SearchBar
                placeholder="¿Qué quieres descubrir?"
                initialValue={searchQuery}
                onSearch={(val) => setSearchQuery(val)}
              />
            </div>
          </div>
        </section>

        <div className="container page-content">
          <section className="explorer-cats-section" aria-label="Categorías turísticas">
            <div className="explorer-cats-grid">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="explorer-cat-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    selectCategory(cat.id);
                  }}
                >
                  <CategoryIcon
                    id={cat.id}
                    label={cat.label}
                    active={categoryFilter === cat.id}
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="explorer-popular-section" aria-label="Filtros populares">
            <h2 className="explorer-popular__title">Filtros populares</h2>
            <FilterTabs
              tabs={popularFilters}
              activeTab={popularFilter}
              onChange={togglePopularFilter}
              variant="chips"
              ariaLabel="Filtros populares"
            />
          </section>

          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={changeTab}
            variant="explorer"
            ariaLabel="Tipo de contenido"
          />

          <FeedbackBanner type="error" message={error} />

          <section className="explorer-results" aria-label={`Lista de ${currentTab?.label}`}>
            <div className="section-header">
              <h2 className="section-title">
                {activeTab === 'lugares' && !categoryFilter && !searchQuery
                  ? 'Lugares destacados'
                  : currentTab?.label}
                {categoryFilter && ` · ${categoryFilter}`}
                {searchQuery && ` · "${searchQuery}"`}
              </h2>
              {!loading && (
                <span className="section-link">
                  {items.length} resultado{items.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <LoadingState message={`Cargando ${currentTab?.label.toLowerCase()}...`} />
            ) : items.length > 0 ? (
              <div className="grid-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    subtitle={item.subtitle}
                    rating={item.rating}
                    reviewsCount={item.reviewsCount}
                    distance={item.distance}
                    badge={item.badge}
                    metaExtra={item.metaExtra}
                    to={item.to}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={currentTab?.icon || 'search'}
                title={`No se encontraron ${currentTab?.label.toLowerCase()}`}
                description={
                  searchQuery || categoryFilter || popularFilter
                    ? 'No hay resultados para los filtros aplicados. Intenta con otra búsqueda.'
                    : 'Aún no hay elementos en esta categoría.'
                }
                actionLabel={searchQuery || categoryFilter || popularFilter ? 'Limpiar filtros' : ''}
                onAction={clearFilters}
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
