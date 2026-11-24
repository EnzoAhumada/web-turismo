import { useAccommodations } from '../../hooks/useAccommodations';
import CatalogLayout from '../../components/layout/CatalogLayout';
import Card from '../../components/ui/Card';

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
    <CatalogLayout
      title="Alojamientos"
      subtitle="Hoteles, hostales, cabañas y hospedajes en Andacollo."
      searchPlaceholder="Buscar alojamiento"
      onSearch={setSearchQuery}
      count={accommodations.length}
      countNoun="alojamiento"
      loading={loading}
      loadingMessage="Cargando alojamientos de Andacollo..."
      error={error}
      isEmpty={accommodations.length === 0}
      emptyIcon="building"
      emptyTitle="No se encontraron alojamientos"
      emptyDescription={searchQuery ? 'Prueba con otra búsqueda.' : 'Aún no hay alojamientos publicados.'}
    >
      {accommodations.map((place) => (
        <Card
          key={place.id}
          image={place.imagen_url}
          title={place.nombre}
          subtitle={place.direccion}
          rating={place.rating_promedio}
          badge={place.precio_por_noche ? `${formatPrice(place.precio_por_noche)} / noche` : 'Consultar'}
          metaExtra={place.tipo || place.categoria}
          to={`/alojamientos/${place.id}`}
        />
      ))}
    </CatalogLayout>
  );
}
