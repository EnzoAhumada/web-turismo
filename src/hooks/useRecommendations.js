import { useState, useEffect } from 'react';
import { getRecommendationsPageData } from '../services/recommendations.service';

export function useRecommendations() {
  const [highlights, setHighlights] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [otherRecs, setOtherRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getRecommendationsPageData();
        if (!active) return;
        setHighlights(data.highlights);
        setForYou(data.forYou);
        setOtherRecs(data.otherRecs);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar recomendaciones.');
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
    highlights,
    forYou,
    otherRecs,
    loading,
    error,
  };
}
