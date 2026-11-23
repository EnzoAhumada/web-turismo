import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPlannerOptions, generateItinerary } from '../services/planner.service';
import { toggleFavoriteItem, isItemFavorite } from '../services/favorites.service';

export function useTripPlanner() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [durations, setDurations] = useState(['Medio día', '1 día', '2 – 3 días', '+3 días']);
  const [interests, setInterests] = useState([]);
  const [budgets, setBudgets] = useState(['Económico', 'Moderado', 'Premium']);

  const [duration, setDuration] = useState('1 día');
  const [selectedInterests, setSelectedInterests] = useState(['religion', 'astronomia']);
  const [budget, setBudget] = useState('Moderado');

  const [routeStops, setRouteStops] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      setLoading(true);
      try {
        const opts = await getPlannerOptions();
        if (!active) return;
        setDurations(opts.durations);
        setInterests(opts.interests);
        setBudgets(opts.budgets);
        if (opts.interests.length >= 2) {
          setSelectedInterests([opts.interests[0].id, opts.interests[1].id]);
        }
      } catch (err) {
        if (active) {
          setFeedback({ type: 'error', message: err?.message || 'Error al cargar opciones.' });
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, []);

  function toggleInterest(id) {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleGenerate(e) {
    if (e && e.preventDefault) e.preventDefault();
    setGenerating(true);
    setFeedback(null);
    try {
      const stops = await generateItinerary({
        selectedInterests,
        duration,
        budget,
      });
      setRouteStops(stops);
      setGenerated(true);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo generar la ruta.',
      });
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveRoute() {
    if (user && routeStops.length > 0) {
      for (const stop of routeStops) {
        if (stop.lugarId) {
          const already = await isItemFavorite(user.id, 'lugar', stop.lugarId);
          if (!already) {
            await toggleFavoriteItem(user.id, 'lugar', stop.lugarId, false);
          }
        }
      }
    }
    navigate('/favoritos');
  }

  function resetPlanner() {
    setGenerated(false);
    setFeedback(null);
  }

  return {
    durations,
    interests,
    budgets,
    duration,
    setDuration,
    selectedInterests,
    toggleInterest,
    budget,
    setBudget,
    routeStops,
    generated,
    loading,
    generating,
    feedback,
    setFeedback,
    handleGenerate,
    handleSaveRoute,
    resetPlanner,
  };
}
