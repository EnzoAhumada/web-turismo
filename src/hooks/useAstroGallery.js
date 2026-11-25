import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ASTRO_SPOTS,
  getAstroPhotos,
  toggleAstroPhotoLike,
} from '../services/astrophotos.service';
import { getAstronomyPageData } from '../services/astronomy.service';

const DEFAULT_TELEMETRY = {
  skyBadge: 'Cielo Despejado en Andacollo · Escala Bortle Clase 2',
  visibilityValue: '98%',
  visibilitySub: 'Seeing 0.8"',
  moonValue: '14%',
  moonSub: 'Menguante',
  coreValue: '22:40',
  coreSub: 'Cenit S-SO',
};

export function useAstroGallery() {
  const { user } = useAuth();
  const [allPhotos, setAllPhotos] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState('Todos');
  const [sortBy, setSortBy] = useState('recent');
  const [telemetry, setTelemetry] = useState(DEFAULT_TELEMETRY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [photosData, astroData] = await Promise.all([
        getAstroPhotos({ spot: 'Todos', sortBy: 'recent', userId: user?.id || null }),
        getAstronomyPageData().catch(() => null),
      ]);
      setAllPhotos(photosData);

      if (astroData?.conditions?.length) {
        const conds = astroData.conditions;
        const vis = conds.find((c) => /visib|despej|cielo/i.test(c.label));
        const moon = conds.find((c) => /luna/i.test(c.label));
        const bestTime = astroData.times?.[0];
        setTelemetry({
          skyBadge: 'Cielo Despejado en Andacollo · Escala Bortle Clase 2',
          visibilityValue: vis?.value || DEFAULT_TELEMETRY.visibilityValue,
          visibilitySub: vis?.label || DEFAULT_TELEMETRY.visibilitySub,
          moonValue: moon?.value || DEFAULT_TELEMETRY.moonValue,
          moonSub: moon?.label || DEFAULT_TELEMETRY.moonSub,
          coreValue: bestTime?.time?.split(' ')[0] || DEFAULT_TELEMETRY.coreValue,
          coreSub: bestTime?.label || DEFAULT_TELEMETRY.coreSub,
        });
      }
    } catch (err) {
      setError(err?.message || 'No se pudo cargar la galería de astrofotografías.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const spotCounts = useMemo(() => {
    const spots = ['Todos', ...ASTRO_SPOTS];
    return spots.map((spot) => ({
      id: spot,
      label: spot,
      count: spot === 'Todos' ? allPhotos.length : allPhotos.filter((p) => p.spot === spot).length,
    }));
  }, [allPhotos]);

  const photos = useMemo(() => {
    const list =
      selectedSpot === 'Todos'
        ? [...allPhotos]
        : allPhotos.filter((p) => p.spot === selectedSpot);

    if (sortBy === 'likes') {
      list.sort((a, b) => b.likes - a.likes);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [allPhotos, selectedSpot, sortBy]);

  async function handleToggleLike(photo) {
    if (!user?.id) {
      setFeedback({
        type: 'info',
        message: 'Inicia sesión para dar Me gusta a las astrofotografías.',
      });
      return null;
    }

    const optimisticLiked = !photo.liked;
    const optimisticLikes = Math.max(0, photo.likes + (optimisticLiked ? 1 : -1));
    setAllPhotos((prev) =>
      prev.map((p) =>
        p.id === photo.id ? { ...p, liked: optimisticLiked, likes: optimisticLikes } : p
      )
    );

    try {
      const result = await toggleAstroPhotoLike(photo.id, user.id, photo.liked);
      setAllPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, liked: result.liked, likes: result.likes } : p
        )
      );
      return result;
    } catch (err) {
      setAllPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, liked: photo.liked, likes: photo.likes } : p
        )
      );
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo actualizar tu valoración.',
      });
      return null;
    }
  }

  function handlePhotoUploaded(newPhoto) {
    setAllPhotos((prev) => [newPhoto, ...prev]);
    setSelectedSpot('Todos');
    setFeedback({
      type: 'success',
      message: '¡Astrofotografía publicada en la galería y añadida a tu perfil!',
    });
  }

  return {
    photos,
    spotCounts,
    selectedSpot,
    setSelectedSpot,
    sortBy,
    setSortBy,
    telemetry,
    loading,
    error,
    feedback,
    setFeedback,
    handleToggleLike,
    handlePhotoUploaded,
    reload: loadData,
  };
}
