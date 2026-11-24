import { useParams, useNavigate } from 'react-router-dom';
import { useEntityDetail } from '../../hooks/useEntityDetail';
import DetailLayout from '../../components/layout/DetailLayout';
import ReviewsSection from '../../components/ui/ReviewsSection';

export default function AccommodationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    item,
    related: others,
    saved,
    toggleFavorite,
    showFullDesc,
    toggleDesc,
    updateRatingSummary,
    loading,
  } = useEntityDetail('alojamiento', id);

  function formatPrice(p) {
    if (!p) return null;
    return `$${Number(p).toLocaleString('es-CL')} CLP`;
  }

  const statusBadges = [];
  if (item?.precio_por_noche) {
    statusBadges.push({
      label: `${formatPrice(item.precio_por_noche)} / noche`,
      className: 'place-status open',
    });
  }

  const infoRows = [];
  if (item?.tipo) {
    infoRows.push({ icon: 'building', label: 'Tipo', value: item.tipo });
  }
  if (item?.direccion) {
    infoRows.push({ icon: 'map-pin', label: 'Dirección', value: item.direccion });
  }
  if (item?.precio_por_noche) {
    infoRows.push({
      icon: 'star',
      label: 'Tarifa referencial',
      value: `${formatPrice(item.precio_por_noche)} / noche`,
    });
  }
  if (item?.telefono) {
    infoRows.push({ icon: 'phone', label: 'Teléfono', value: item.telefono });
  }

  const actions = [
    { label: 'Cómo llegar', icon: 'navigation', onClick: () => navigate('/mapa') },
    {
      label: 'Llamar',
      icon: 'phone',
      href: item?.telefono ? `tel:${item.telefono.replace(/\s+/g, '')}` : undefined,
    },
    { label: saved ? 'Guardado' : 'Guardar', icon: 'bookmark', onClick: toggleFavorite },
    { label: 'Compartir', icon: 'share' },
  ];

  const sidebarCards = [
    {
      icon: 'building',
      title: 'Servicios incluidos',
      list: item?.servicios || ['Wi-Fi', 'Estacionamiento', 'Desayuno local'],
    },
    {
      icon: 'calendar',
      title: 'Mejor temporada',
      text:
        item?.mejor_temporada ||
        'La época de mayor afluencia es durante la Fiesta de Andacollo en diciembre. Reserva con anticipación.',
    },
  ];

  return (
    <DetailLayout
      loading={loading}
      item={item}
      notFoundConfig={{
        icon: 'building',
        title: 'Alojamiento no encontrado',
        backTo: '/alojamientos',
        backLabel: 'Volver a alojamientos',
      }}
      backTo="/alojamientos"
      saved={saved}
      onToggleFavorite={toggleFavorite}
      subtitle={`${item?.tipo || 'Alojamiento'} · Andacollo`}
      rating={item?.rating_promedio}
      reviewsCount={item?.resenas_count}
      statusBadges={statusBadges}
      actions={actions}
      showFullDesc={showFullDesc}
      onToggleDesc={toggleDesc}
      infoRows={infoRows}
      reviewsSection={
        <ReviewsSection
          entityType="alojamiento"
          entityId={id}
          entityName={item?.nombre}
          onSummaryChange={updateRatingSummary}
        />
      }
      relatedSection={{
        title: 'Otros alojamientos',
        linkTo: '/alojamientos',
        linkLabel: 'Ver todos',
        items: others,
      }}
      sidebarCards={sidebarCards}
    />
  );
}
