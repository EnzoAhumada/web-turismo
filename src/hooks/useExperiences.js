import { useState, useEffect } from 'react';
import { getExperiences } from '../services/experiences.service';

export const EXPERIENCE_TABS = ['Todas', 'Tours', 'Gastronomía', 'Aventura', 'Astroturismo', 'Cultura'];

export function useExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getExperiences();
        if (active) setExperiences(data);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar experiencias.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  function formatPrice(p) {
    if (p === 0 || p === '0') return 'Gratis';
    if (p == null || p === '') return 'Consultar';
    return `$${Number(p).toLocaleString('es-CL')} CLP`;
  }

  return {
    tabs: EXPERIENCE_TABS,
    experiences,
    loading,
    error,
    formatPrice,
  };
}
