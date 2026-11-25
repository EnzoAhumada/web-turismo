import { useParams, useNavigate } from 'react-router-dom';
import { useEntityDetail } from '../../hooks/useEntityDetail';
import DetailLayout from '../../components/layout/DetailLayout';

export default function ExperienceDetailPage() {
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
  } = useEntityDetail('experiencia', id);

  function formatPrice(p) {
    if (p === 0 || p === '0') return 'Gratis';
    if (p == null || p === '') return null;
    return `$${Number(p).toLocaleString('es-CL')} CLP`;
  }

  const statusBadges = [];
  if (item?.precio != null && formatPrice(item.precio)) {
    statusBadges.push({ label: formatPrice(item.precio), className: 'place-status open' });
  }
  if (item?.duracion) {
    statusBadges.push({ label: item.duracion, className: 'place-hours' });
  }
  if (item?.disponible === false) {
    statusBadges.push({
      label: 'No disponible',
      className: 'place-status',
      style: { background: '#fee2e2', color: '#b91c1c' },
    });
  }

  const infoRows = [];
  if (item?.precio != null && formatPrice(item.precio)) {
    const priceLabel = formatPrice(item.precio);
    infoRows.push({
      icon: 'award',
      label: 'Precio',
      value: priceLabel === 'Gratis' ? 'Ingreso gratuito' : `${priceLabel} por persona`,
    });
  }
  if (item?.duracion) {
    infoRows.push({ icon: 'clock', label: 'Duración', value: item.duracion });
  }
  if (item?.categoria) {
    infoRows.push({ icon: 'compass', label: 'Tipo', value: item.categoria });
  }
  infoRows.push({
    icon: 'check-circle',
    label: 'Disponibilidad',
    value: item?.disponible !== false ? 'Disponible' : 'No disponible',
  });

  const actions = [
    { label: 'Cómo llegar', icon: 'navigation', onClick: () => navigate('/mapa') },
    { label: saved ? 'Guardado' : 'Guardar', icon: 'bookmark', onClick: toggleFavorite },
    { label: 'Favorito', icon: 'heart', onClick: toggleFavorite },
    { label: 'Compartir', icon: 'share' },
  ];

  const sidebarCards = [
    {
      icon: 'check-circle',
      title: 'Actividad incluida',
      list: item?.incluye || ['Guía experto incluido', 'Equipamiento necesario', 'Seguro de actividad'],
    },
  ];

  if (item?.precio != null && formatPrice(item.precio)) {
    const priceLabel = formatPrice(item.precio);
    sidebarCards.push({
      icon: 'award',
      title: 'Tarifa',
      highlight: priceLabel,
      text: priceLabel === 'Gratis' ? 'Ingreso gratuito' : `por persona · ${item.duracion || 'consultar duración'}`,
    });
  }

  return (
    <DetailLayout
      loading={loading}
      item={item}
      notFoundConfig={{
        icon: 'compass',
        title: 'Experiencia no encontrada',
        backTo: '/experiencias',
        backLabel: 'Volver a experiencias',
      }}
      backTo="/experiencias"
      saved={saved}
      onToggleFavorite={toggleFavorite}
      subtitle={`${item?.categoria ? `${item.categoria} · ` : ''}Experiencia local`}
      rating={item?.rating_promedio}
      reviewsCount={item?.resenas_count}
      statusBadges={statusBadges}
      actions={actions}
      showFullDesc={showFullDesc}
      onToggleDesc={toggleDesc}
      infoRows={infoRows}
      bookingProps={{
        entityType: 'experiencia',
        entityId: id,
        entityName: item?.nombre,
      }}
      relatedSection={{
        title: 'Otras experiencias',
        linkTo: '/experiencias',
        linkLabel: 'Ver todas',
        items: others,
      }}
      sidebarCards={sidebarCards}
    />
  );
}
