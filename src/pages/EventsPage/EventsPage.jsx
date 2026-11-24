import { useMemo, useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import CatalogLayout from '../../components/layout/CatalogLayout';
import Card from '../../components/ui/Card';
import FilterTabs from '../../components/ui/FilterTabs';
import Icon from '../../components/ui/Icon';

export default function EventsPage() {
  const {
    activeTab,
    setActiveTab,
    events,
    savedEventIds,
    toggleSaveEvent,
    loading,
    error,
    formatDate,
  } = useEvents();
  const [query, setQuery] = useState('');

  const visibleEvents = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) => {
      const text = `${event.nombre || ''} ${event.descripcion || ''} ${event.categoria || ''}`.toLowerCase();
      return text.includes(term);
    });
  }, [events, query]);

  return (
    <CatalogLayout
      title="Eventos"
      subtitle="Fiestas, celebraciones y actividades del calendario de Andacollo."
      searchPlaceholder="Buscar evento"
      onSearch={setQuery}
      toolbar={(
        <FilterTabs
          tabs={['Próximos', 'Mis eventos']}
          activeTab={activeTab}
          onChange={setActiveTab}
          ariaLabel="Filtrar eventos"
        />
      )}
      count={visibleEvents.length}
      countNoun="evento"
      loading={loading}
      loadingMessage="Cargando calendario de eventos..."
      error={error}
      isEmpty={visibleEvents.length === 0}
      emptyIcon="calendar"
      emptyTitle="No hay eventos para mostrar"
      emptyDescription="Guarda un evento con el marcador para verlo en Mis eventos."
    >
      {visibleEvents.map((event) => {
        const saved = savedEventIds.includes(event.id);
        return (
          <div key={event.id} className="catalog-item">
            <Card
              image={event.imagen_url}
              title={event.nombre}
              subtitle={formatDate(event.fecha_inicio, event.fecha_fin)}
              badge={event.categoria}
              metaExtra={event.lugar || event.direccion}
              to={`/eventos/${event.id}`}
            />
            <button
              type="button"
              className={`catalog-item__save${saved ? ' saved' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleSaveEvent(event.id);
              }}
              aria-label={saved ? 'Quitar evento guardado' : 'Guardar evento'}
            >
              <Icon name="bookmark" size={16} filled={saved} />
            </button>
          </div>
        );
      })}
    </CatalogLayout>
  );
}
