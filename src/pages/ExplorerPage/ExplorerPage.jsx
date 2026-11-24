import { useExplorerData } from '../../hooks/useExplorerData';
import CatalogLayout from '../../components/layout/CatalogLayout';
import CategoryIcon from '../../components/ui/CategoryIcon';
import Card from '../../components/ui/Card';
import FilterTabs from '../../components/ui/FilterTabs';
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

  const hasFilters = Boolean(searchQuery || categoryFilter || popularFilter);
  const sectionName = currentTab?.label || 'Lugares';
  const nouns = {
    lugares: 'lugar',
    restaurantes: 'restaurante',
    alojamientos: 'alojamiento',
    eventos: 'evento',
    experiencias: 'experiencia',
  };

  return (
    <CatalogLayout
      title={sectionName}
      subtitle="Atractivos, gastronomía, alojamientos y actividades de Andacollo."
      searchPlaceholder="¿Qué lugar quieres descubrir?"
      onSearch={setSearchQuery}
      toolbar={(
        <>
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
          <FilterTabs
            tabs={popularFilters}
            activeTab={popularFilter}
            onChange={togglePopularFilter}
            variant="chips"
            ariaLabel="Filtros populares"
          />
          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={changeTab}
            variant="explorer"
            ariaLabel="Tipo de contenido"
          />
        </>
      )}
      count={items.length}
      countNoun={nouns[activeTab] || 'resultado'}
      loading={loading}
      loadingMessage={`Cargando ${sectionName.toLowerCase()}...`}
      error={error}
      isEmpty={!loading && items.length === 0}
      emptyIcon={currentTab?.icon || 'map-pin'}
      emptyTitle={`No se encontraron ${sectionName.toLowerCase()}`}
      emptyDescription={
        hasFilters
          ? 'No hay resultados para los filtros aplicados.'
          : 'Aún no hay elementos en esta categoría.'
      }
      emptyActionLabel={hasFilters ? 'Limpiar filtros' : ''}
      onEmptyAction={clearFilters}
    >
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
    </CatalogLayout>
  );
}
