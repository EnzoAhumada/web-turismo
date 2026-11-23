import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/admin.service';

export function useAdminDashboard() {
  const [stats, setStats] = useState({
    lugares: 0,
    restaurantes: 0,
    alojamientos: 0,
    eventos: 0,
    usuarios: 0,
    favoritos: 0,
  });
  const [municipal, setMunicipal] = useState(null);
  const [topPlaces, setTopPlaces] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getDashboardStats();
        if (!active) return;
        setStats(data.stats);
        setMunicipal(data.municipal);
        setTopPlaces(data.topPlaces || []);
        setRecentEvents(data.recentEvents || []);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar métricas del panel.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
    });
  }

  return {
    stats,
    municipal,
    topPlaces,
    recentEvents,
    loading,
    error,
    formatDate,
  };
}
