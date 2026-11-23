import { useState, useEffect } from 'react';
import { getMapPins } from '../services/map.service';

export const MAP_FILTER_TYPES = ['Todos', 'Lugares', 'Restaurantes', 'Hospedajes', 'Rutas'];

export function useMapExplorer() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getMapPins({ typeFilter: activeFilter, search: searchQuery });
        if (!active) return;
        setPins(data);
        setSelectedPin((prev) => {
          if (prev && data.some((p) => p.id === prev.id)) return prev;
          return data[0] || null;
        });
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar los puntos del mapa.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [activeFilter, searchQuery]);

  return {
    filterTypes: MAP_FILTER_TYPES,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    pins,
    selectedPin,
    setSelectedPin,
    loading,
    error,
  };
}
