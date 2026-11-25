import { useParams, useNavigate } from 'react-router-dom';
import { useEntityDetail } from '../../hooks/useEntityDetail';
import DetailLayout from '../../components/layout/DetailLayout';
import BookingSection from '../../components/ui/BookingSection';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    item,
    related: others,
    saved,
    toggleFavorite,
    showFullDesc,
    toggleDesc,
    loading,
  } = useEntityDetail('evento', id);

  function formatDate(d) {
    if (!d) return null;
    return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const dateRange =
    item?.fecha_inicio === item?.fecha_fin || !item?.fecha_fin
      ? formatDate(item?.fecha_inicio)
      : `${formatDate(item?.fecha_inicio)} — ${formatDate(item?.fecha_fin)}`;

  const statusBadges = [];
  if (dateRange) {
    statusBadges.push({ label: dateRange, className: 'place-status open' });
  }

  const infoRows = [];
  if (item?.fecha_inicio) {
    infoRows.push({ icon: 'calendar', label: 'Fecha inicio', value: formatDate(item.fecha_inicio) });
  }
  if (item?.fecha_fin && item.fecha_fin !== item.fecha_inicio) {
    infoRows.push({ icon: 'calendar', label: 'Fecha fin', value: formatDate(item.fecha_fin) });
  }
  if (item?.categoria) {
    infoRows.push({ icon: 'sparkles', label: 'Categoría', value: item.categoria });
  }
  infoRows.push({
    icon: 'map-pin',
    label: 'Lugar',
    value: item?.ubicacion || 'Andacollo, Región de Coquimbo, Chile',
  });

  const actions = [
    { label: 'Cómo llegar', icon: 'navigation', onClick: () => navigate('/mapa') },
    { label: saved ? 'Guardado' : 'Agendar', icon: 'bookmark', onClick: toggleFavorite },
    { label: 'Favorito', icon: 'heart', onClick: toggleFavorite },
    { label: 'Compartir', icon: 'share' },
  ];

  const sidebarCards = [
    {
      icon: 'calendar',
      title: 'Calendario cultural',
      text: 'Andacollo celebra festividades religiosas, mineras y astronómicas durante todo el año.',
    },
    {
      icon: 'lightbulb',
      title: 'Consejo',
      text: 'Reserva tu alojamiento con anticipación durante eventos masivos como la Fiesta Grande de diciembre.',
    },
  ];

  return (
    <DetailLayout
      loading={loading}
      item={item}
      notFoundConfig={{
        icon: 'calendar',
        title: 'Evento no encontrado',
        backTo: '/eventos',
        backLabel: 'Volver a eventos',
      }}
      backTo="/eventos"
      saved={saved}
      onToggleFavorite={toggleFavorite}
      subtitle={`${item?.categoria ? `${item.categoria} · ` : ''}Andacollo, Chile`}
      statusBadges={statusBadges}
      actions={actions}
      showFullDesc={showFullDesc}
      onToggleDesc={toggleDesc}
      infoTitle="Detalles del evento"
      infoRows={infoRows}
      bookingSection={
        <BookingSection
          entityType="evento"
          entityId={id}
          entityName={item?.nombre}
        />
      }
      relatedSection={{
        title: 'Otros eventos',
        linkTo: '/eventos',
        linkLabel: 'Ver todos',
        items: others,
      }}
      sidebarCards={sidebarCards}
    />
  );
}
