import { useParams, useNavigate } from 'react-router-dom';
import { useEntityDetail } from '../../hooks/useEntityDetail';
import DetailLayout from '../../components/layout/DetailLayout';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    item: place,
    related: nearby,
    saved,
    toggleFavorite,
    showFullDesc,
    toggleDesc,
    loading,
  } = useEntityDetail('lugar', id);

  const statusBadges = [];
  if (place?.horario) {
    statusBadges.push({
      label: place.abierto_ahora === false ? 'Cerrado ahora' : 'Abierto ahora',
      className: 'place-status open',
    });
    statusBadges.push({ label: place.horario, className: 'place-hours' });
  }

  const infoRows = [];
  if (place?.direccion) {
    infoRows.push({ icon: 'map-pin', label: 'Dirección', value: place.direccion });
  }
  if (place?.tiempo_estimado) {
    infoRows.push({ icon: 'clock', label: 'Tiempo estimado', value: place.tiempo_estimado });
  }
  if (place?.telefono) {
    infoRows.push({ icon: 'phone', label: 'Teléfono', value: place.telefono });
  }
  if (place?.comuna) {
    infoRows.push({
      icon: 'globe',
      label: 'Ubicación',
      value: `${place.comuna}, Región de ${place.region || 'Coquimbo'}`,
    });
  }

  const actions = [
    { label: 'Cómo llegar', icon: 'navigation', onClick: () => navigate('/mapa') },
    {
      label: 'Llamar',
      icon: 'phone',
      href: place?.telefono ? `tel:${place.telefono.replace(/\s+/g, '')}` : undefined,
    },
    { label: saved ? 'Guardado' : 'Guardar', icon: 'bookmark', onClick: toggleFavorite },
    {
      label: 'Compartir',
      icon: 'share',
      onClick: () => {
        if (navigator.share) {
          navigator.share({ title: place?.nombre, url: window.location.href }).catch(() => {});
        }
      },
    },
  ];

  const sidebarCards = [
    {
      icon: 'calendar',
      title: '¿Cuándo ir?',
      text: `La mejor época para visitar es: ${place?.mejor_epoca || 'Todo el año'}.`,
    },
  ];

  return (
    <DetailLayout
      loading={loading}
      item={place}
      notFoundConfig={{
        icon: 'search',
        title: 'Lugar no encontrado',
        backTo: '/explorar',
        backLabel: 'Volver al explorador',
      }}
      backTo="/explorar"
      saved={saved}
      onToggleFavorite={toggleFavorite}
      subtitle={place?.subtitulo || place?.categorias?.nombre}
      rating={place?.rating_promedio}
      reviewsCount={place?.resenas_count}
      statusBadges={statusBadges}
      actions={actions}
      showFullDesc={showFullDesc}
      onToggleDesc={toggleDesc}
      infoRows={infoRows}
      relatedSection={{
        title: 'Lugares cercanos',
        linkTo: '/mapa',
        linkLabel: 'Ver en mapa',
        items: nearby,
      }}
      mapPreview={Boolean(place?.latitud || place?.imagen_url)}
      sidebarCards={sidebarCards}
    />
  );
}
