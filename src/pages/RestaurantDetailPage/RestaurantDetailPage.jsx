import { useParams, useNavigate } from 'react-router-dom';
import { useEntityDetail } from '../../hooks/useEntityDetail';
import { PRICE_LABELS } from '../../hooks/useRestaurants';
import DetailLayout from '../../components/layout/DetailLayout';
import ReviewsSection from '../../components/ui/ReviewsSection';

export default function RestaurantDetailPage() {
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
  } = useEntityDetail('restaurante', id);

  const statusBadges = [];
  if (item?.precio_rango) {
    statusBadges.push({
      label: `${item.precio_rango} — ${PRICE_LABELS[item.precio_rango] || 'Precio variable'}`,
      className: 'place-status open',
    });
  }
  if (item?.horario) {
    statusBadges.push({
      label: item.horario,
      className: 'place-hours',
    });
  }

  const infoRows = [];
  if (item?.direccion) {
    infoRows.push({ icon: 'map-pin', label: 'Dirección', value: item.direccion });
  }
  if (item?.horario) {
    infoRows.push({ icon: 'clock', label: 'Horario', value: item.horario });
  }
  if (item?.especialidad) {
    infoRows.push({ icon: 'utensils', label: 'Especialidad', value: item.especialidad });
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
      icon: 'utensils',
      title: 'Gastronomía local',
      text: 'Disfruta de la auténtica cocina chilena y preparaciones típicas de Andacollo.',
    },
    {
      icon: 'lightbulb',
      title: 'Consejo del viajero',
      text:
        item?.consejo_viajero ||
        'Reserva con anticipación durante la Fiesta de Andacollo en diciembre.',
    },
  ];

  return (
    <DetailLayout
      loading={loading}
      item={item}
      notFoundConfig={{
        icon: 'utensils',
        title: 'Restaurante no encontrado',
        backTo: '/restaurantes',
        backLabel: 'Volver a restaurantes',
      }}
      backTo="/restaurantes"
      saved={saved}
      onToggleFavorite={toggleFavorite}
      subtitle={item?.especialidad || 'Restaurante · Gastronomía local'}
      rating={item?.rating_promedio}
      reviewsCount={item?.resenas_count}
      statusBadges={statusBadges}
      actions={actions}
      showFullDesc={showFullDesc}
      onToggleDesc={toggleDesc}
      infoRows={infoRows}
      reviewsSection={
        <ReviewsSection
          entityType="restaurante"
          entityId={id}
          entityName={item?.nombre}
          onSummaryChange={updateRatingSummary}
        />
      }
      relatedSection={{
        title: 'Otros restaurantes',
        linkTo: '/restaurantes',
        linkLabel: 'Ver todos',
        items: others,
      }}
      sidebarCards={sidebarCards}
    />
  );
}
