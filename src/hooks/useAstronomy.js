import { useState, useEffect } from 'react';
import { getAstronomyPageData } from '../services/astronomy.service';

export function useAstronomy() {
  const [conditions, setConditions] = useState([]);
  const [times, setTimes] = useState([]);
  const [spots, setSpots] = useState([]);
  const [events, setEvents] = useState([]);
  const [tip, setTip] = useState(null);
  const [gear, setGear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getAstronomyPageData();
        if (!active) return;
        setConditions(data.conditions);
        setTimes(data.times);
        setSpots(data.spots);
        setEvents(data.events);
        setTip(data.tip);
        setGear(data.gear);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar la ruta astronómica.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return {
    conditions,
    times,
    spots,
    events,
    tip,
    gear,
    loading,
    error,
  };
}
