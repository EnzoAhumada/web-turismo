import { useState, useEffect } from 'react';
import { getAccommodations } from '../services/accommodations.service';

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getAccommodations({ search: searchQuery });
        if (active) setAccommodations(data);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar alojamientos.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [searchQuery]);

  function formatPrice(p) {
    if (!p) return null;
    return `$${Number(p).toLocaleString('es-CL')}`;
  }

  return {
    accommodations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    formatPrice,
  };
}
