import { useRestaurants } from '../../hooks/useRestaurants';
import CatalogLayout from '../../components/layout/CatalogLayout';
import Card from '../../components/ui/Card';
import FilterTabs from '../../components/ui/FilterTabs';
import { plainTextFromRich } from '../../components/ui/RichText';

export default function RestaurantsPage() {
  const {
    restaurants,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activePriceFilter,
    togglePriceFilter,
    priceLabels,
  } = useRestaurants();

  const priceChips = ['$', '$$', '$$$'].map((price) => ({
    id: price,
    label: `${price} · ${priceLabels[price]}`,
  }));

  return (
    <CatalogLayout
      title="Restaurantes"
      subtitle="Cocina local, picadas y restaurantes de Andacollo."
      searchPlaceholder="Buscar restaurante o especialidad"
      onSearch={setSearchQuery}
      toolbar={(
        <FilterTabs
          tabs={priceChips}
          activeTab={activePriceFilter}
          onChange={togglePriceFilter}
          variant="chips"
          labelPrefix="Precio:"
          ariaLabel="Filtrar por rango de precio"
        />
      )}
      count={restaurants.length}
      countNoun="restaurante"
      loading={loading}
      loadingMessage="Cargando restaurantes de Andacollo..."
      error={error}
      isEmpty={restaurants.length === 0}
      emptyIcon="utensils"
      emptyTitle="No se encontraron restaurantes"
      emptyDescription="Prueba con otra búsqueda o quita el filtro de precio."
    >
      {restaurants.map((restaurant, index) => (
        <Card
          key={restaurant.id}
          image={restaurant.imagen_url}
          title={restaurant.nombre}
          subtitle={restaurant.direccion || plainTextFromRich(restaurant.descripcion)}
          rating={restaurant.rating_promedio}
          badge={restaurant.precio_rango || (!searchQuery && !activePriceFilter && index === 0 ? 'Destacado' : '')}
          metaExtra={restaurant.horario}
          to={`/restaurantes/${restaurant.id}`}
        />
      ))}
    </CatalogLayout>
  );
}
