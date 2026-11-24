import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPlaceById, getNearbyPlaces } from '../services/places.service';
import { getRestaurantById, getOtherRestaurants } from '../services/restaurants.service';
import { getAccommodationById, getOtherAccommodations } from '../services/accommodations.service';
import { getEventById, getOtherEvents } from '../services/events.service';
import { getExperienceById, getOtherExperiences } from '../services/experiences.service';
import { isItemFavorite, toggleFavoriteItem } from '../services/favorites.service';

export function useEntityDetail(entityType, id) {
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let active = true;

    async function loadEntity() {
      setLoading(true);
      setError('');
      try {
        let entityData = null;
        let relatedData = [];

        if (entityType === 'lugar') {
          entityData = await getPlaceById(id);
          if (entityData) {
            const more = await getNearbyPlaces(id, 3);
            relatedData = more.map((p) => ({
              id: p.id,
              image: p.imagen_url,
              title: p.nombre,
              subtitle: p.categorias?.nombre,
              rating: p.rating_promedio,
              to: `/lugar/${p.id}`,
            }));
          }
        } else if (entityType === 'restaurante') {
          entityData = await getRestaurantById(id);
          if (entityData) {
            const more = await getOtherRestaurants(id, 3);
            relatedData = more.map((r) => ({
              id: r.id,
              image: r.imagen_url,
              title: r.nombre,
              subtitle: r.precio_rango ? `Precio: ${r.precio_rango}` : 'Restaurante',
              to: `/restaurantes/${r.id}`,
            }));
          }
        } else if (entityType === 'alojamiento') {
          entityData = await getAccommodationById(id);
          if (entityData) {
            const more = await getOtherAccommodations(id, 3);
            relatedData = more.map((a) => ({
              id: a.id,
              image: a.imagen_url,
              title: a.nombre,
              subtitle: a.precio_por_noche
                ? `$${Number(a.precio_por_noche).toLocaleString('es-CL')} CLP / noche`
                : 'Alojamiento',
              to: `/alojamientos/${a.id}`,
            }));
          }
        } else if (entityType === 'evento') {
          entityData = await getEventById(id);
          if (entityData) {
            const more = await getOtherEvents(id, 3);
            relatedData = more.map((ev) => ({
              id: ev.id,
              image: ev.imagen_url,
              title: ev.nombre,
              subtitle: ev.categoria,
              to: `/eventos/${ev.id}`,
            }));
          }
        } else if (entityType === 'experiencia') {
          entityData = await getExperienceById(id);
          if (entityData) {
            const more = await getOtherExperiences(id, 3);
            relatedData = more.map((exp) => ({
              id: exp.id,
              image: exp.imagen_url,
              title: exp.nombre,
              subtitle: exp.categoria,
              to: `/experiencias/${exp.id}`,
            }));
          }
        }

        if (active) {
          setItem(entityData);
          setRelated(relatedData);
        }
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar el detalle.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEntity();
    return () => {
      active = false;
    };
  }, [entityType, id]);

  useEffect(() => {
    if (!user || !id) {
      setSaved(false);
      return;
    }
    isItemFavorite(user.id, entityType, id).then((fav) => setSaved(fav));
  }, [user, entityType, id]);

  async function toggleFavorite() {
    if (!user || !id) return;
    const nextState = await toggleFavoriteItem(user.id, entityType, id, saved);
    setSaved(nextState);
  }

  function toggleDesc() {
    setShowFullDesc((prev) => !prev);
  }

  const updateRatingSummary = useCallback(({ rating_promedio, resenas_count }) => {
    setItem((prev) => {
      if (!prev) return prev;
      if (
        prev.rating_promedio === rating_promedio &&
        prev.resenas_count === resenas_count
      ) {
        return prev;
      }
      return {
        ...prev,
        rating_promedio,
        resenas_count,
      };
    });
  }, []);

  return {
    item,
    related,
    saved,
    toggleFavorite,
    showFullDesc,
    toggleDesc,
    updateRatingSummary,
    loading,
    error,
  };
}
