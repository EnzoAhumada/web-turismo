import { useState, useEffect } from 'react';
import { getExperiences } from '../services/experiences.service';

export const EXPERIENCE_TABS = ['Todas', 'Tours', 'Gastronomía', 'Aventura'];

export function useExperiences() {
  const [activeTab, setActiveTab] = useState('Todas');
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getExperiences({ category: activeTab });
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
  }, [activeTab]);

  function formatPrice(p) {
    if (!p) return '';
    return `$${Number(p).toLocaleString('es-CL')} CLP`;
  }

  return {
    tabs: EXPERIENCE_TABS,
    activeTab,
    setActiveTab,
    experiences,
    loading,
    error,
    formatPrice,
  };
}
