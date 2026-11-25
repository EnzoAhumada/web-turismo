import { useMemo, useState } from 'react';
import { useExperiences } from '../../hooks/useExperiences';
import CatalogLayout from '../../components/layout/CatalogLayout';
import Card from '../../components/ui/Card';
import FilterTabs from '../../components/ui/FilterTabs';

export default function ExperiencesPage() {
  const { tabs, experiences, loading, error, formatPrice } = useExperiences();
  const [activeTab, setActiveTab] = useState('Todas');
  const [query, setQuery] = useState('');

  const visibleExperiences = useMemo(() => {
    const term = query.trim().toLowerCase();
    return experiences.filter((experience) => {
      if (activeTab !== 'Todas' && experience.categoria !== activeTab) return false;
      if (!term) return true;
      const text = `${experience.nombre || ''} ${experience.descripcion || ''} ${experience.categoria || ''}`.toLowerCase();
      return text.includes(term);
    });
  }, [experiences, activeTab, query]);

  return (
    <CatalogLayout
      title="Experiencias"
      subtitle="Tours, caminatas y visitas para recorrer Andacollo."
      searchPlaceholder="Buscar experiencia"
      onSearch={setQuery}
      toolbar={(
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          ariaLabel="Filtrar experiencias"
        />
      )}
      count={visibleExperiences.length}
      countNoun="experiencia"
      loading={loading}
      loadingMessage="Cargando experiencias de Andacollo..."
      error={error}
      isEmpty={visibleExperiences.length === 0}
      emptyIcon="compass"
      emptyTitle="No hay experiencias para mostrar"
      emptyDescription="Prueba con otra categoría o con otro texto de búsqueda."
    >
      {visibleExperiences.map((experience) => (
        <Card
          key={experience.id}
          image={experience.imagen_url}
          title={experience.nombre}
          subtitle={formatPrice(experience.precio)}
          badge={experience.disponible === false ? 'No disponible' : experience.categoria}
          metaExtra={experience.duracion}
          rating={experience.resenas_count > 0 ? experience.rating_promedio : null}
          to={`/experiencias/${experience.id}`}
        />
      ))}
    </CatalogLayout>
  );
}
