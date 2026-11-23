import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserFavoritesByType, removeFavoriteById } from '../services/favorites.service';

export const FAVORITE_TABS = ['Lugares', 'Experiencias', 'Eventos', 'Restaurantes', 'Alojamientos'];

const TIPO_MAP = {
  Lugares: 'lugar',
  Experiencias: 'experiencia',
  Eventos: 'evento',
  Restaurantes: 'restaurante',
  Alojamientos: 'alojamiento',
};

export function useFavorites() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Lugares');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const tipo = TIPO_MAP[activeTab] || 'lugar';
        const data = await getUserFavoritesByType(user.id, tipo);
        if (active) setFavorites(data);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar favoritos.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user, activeTab]);

  async function removeFavorite(favId) {
    try {
      await removeFavoriteById(favId);
      setFavorites((prev) => prev.filter((item) => item.favId !== favId));
    } catch (err) {
      setError(err?.message || 'No se pudo quitar de favoritos.');
    }
  }

  return {
    tabs: FAVORITE_TABS,
    activeTab,
    setActiveTab,
    favorites,
    removeFavorite,
    loading,
    error,
  };
}
