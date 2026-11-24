import { useParams } from 'react-router-dom';
import { useEntityDetail } from '../../hooks/useEntityDetail';
import { googleMapsDirectionsUrl, googleMapsQuery } from '../../lib/andacolloGeo';
import DetailLayout from '../../components/layout/DetailLayout';
import ReviewsSection from '../../components/ui/ReviewsSection';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const {
    item: place,
    related: nearby,
    saved,
    toggleFavorite,
    showFullDesc,
    toggleDesc,
    updateRatingSummary,
    loading,
    error,
  } = useEntityDetail('lugar', id);

  const mapsQuery = place
    ? googleMapsQuery({ nombre: place.nombre, direccion: place.direccion })
    : '';

  const statusBadges = [];
  if (place?.categorias?.nombre) {
    statusBadges.push({ label: place.categorias.nombre, className: 'place-status open' });
  }
  if (place?.horario) {
    statusBadges.push({ label: place.horario, className: 'place-hours' });
  }

  const infoRows = [];
  if (place?.direccion) {
    infoRows.push({ icon: 'map-pin', label: 'Dirección', value: place.direccion });
  }
  if (place?.horario) {
    infoRows.push({ icon: 'clock', label: 'Horario', value: place.horario });
  }
  if (place?.categorias?.nombre) {
    infoRows.push({ icon: 'compass', label: 'Categoría', value: place.categorias.nombre });
  }
  if (place?.telefono) {
    infoRows.push({ icon: 'phone', label: 'Teléfono', value: place.telefono });
  }

  const actions = [
    {
      label: 'Cómo llegar',
      icon: 'navigation',
      onClick: () => window.open(googleMapsDirectionsUrl(mapsQuery), '_blank', 'noopener,noreferrer'),
    },
    ...(place?.telefono
      ? [{
          label: 'Llamar',
          icon: 'phone',
          href: `tel:${place.telefono.replace(/\s+/g, '')}`,
        }]
      : []),
    { label: saved ? 'Guardado' : 'Guardar', icon: 'bookmark', onClick: toggleFavorite },
    {
      label: 'Compartir',
      icon: 'share',
      onClick: () => {
        if (navigator.share && place) {
          navigator.share({ title: place.nombre, url: window.location.href }).catch(() => {});
        }
      },
    },
  ];

  const sidebarCards = [
    {
      icon: 'map-pin',
      title: 'En Andacollo',
      text: place?.direccion || 'Lugar turístico de la comuna de Andacollo, Región de Coquimbo.',
    },
  ];

  return (
    <DetailLayout
      loading={loading}
      item={place}
      notFoundConfig={{
        icon: 'map-pin',
        title: error || 'Lugar no encontrado',
        backTo: '/explorar',
        backLabel: 'Volver a explorar',
      }}
      backTo="/explorar"
      saved={saved}
      onToggleFavorite={toggleFavorite}
      subtitle={place?.subtitulo || place?.categorias?.nombre || 'Lugar turístico · Andacollo'}
      rating={place?.rating_promedio}
      reviewsCount={place?.resenas_count}
      statusBadges={statusBadges}
      actions={actions}
      showFullDesc={showFullDesc}
      onToggleDesc={toggleDesc}
      infoRows={infoRows}
      reviewsSection={
        <ReviewsSection
          entityType="lugar"
          entityId={id}
          entityName={place?.nombre}
          onSummaryChange={updateRatingSummary}
        />
      }
      relatedSection={{
        title: 'Otros lugares',
        linkTo: '/explorar',
        linkLabel: 'Ver todos',
        items: nearby,
      }}
      mapQuery={mapsQuery}
      sidebarCards={sidebarCards}
    />
  );
}
