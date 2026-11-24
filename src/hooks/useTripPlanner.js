import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getPlannerOptions,
  getExampleItinerary,
  generateItinerary,
  completeItineraryForUser,
} from '../services/planner.service';
import { toggleFavoriteItem, isItemFavorite } from '../services/favorites.service';

export function useTripPlanner() {
  const { user, reloadProfile } = useAuth();

  const [durations, setDurations] = useState(['Medio día', '1 día', '2 – 3 días', '+3 días']);
  const [interests, setInterests] = useState([]);
  const [budgets, setBudgets] = useState(['Económico', 'Moderado', 'Premium']);

  const [duration, setDuration] = useState('1 día');
  const [selectedInterests, setSelectedInterests] = useState(['religion', 'astronomia']);
  const [budget, setBudget] = useState('Moderado');

  const [itinerary, setItinerary] = useState(null);
  const [exampleItinerary, setExampleItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadInitial() {
      setLoading(true);
      try {
        const [opts, example] = await Promise.all([
          getPlannerOptions(),
          getExampleItinerary(),
        ]);
        if (!active) return;

        setDurations(opts.durations);
        setInterests(opts.interests);
        setBudgets(opts.budgets);
        if (opts.interests.length >= 2) {
          setSelectedInterests([opts.interests[0].id, opts.interests[1].id]);
        }
        setExampleItinerary(example);
        setItinerary(example);
      } catch (err) {
        if (active) {
          setFeedback({ type: 'error', message: err?.message || 'Error al cargar el planificador.' });
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInitial();
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
      const next = await generateItinerary({
        selectedInterests,
        duration,
        budget,
      });
      setItinerary(next);
      setFeedback({
        type: 'success',
        message: 'Itinerario personalizado generado con lugares, experiencias y eventos de Andacollo.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo generar la ruta.',
      });
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveRoute(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!user || !itinerary) return;

    setSaving(true);
    setFeedback(null);
    try {
      const allStops = itinerary.days.flatMap((d) => d.blocks.flatMap((b) => b.stops));
      for (const stop of allStops) {
        if (stop.entityId && ['lugar', 'restaurante', 'evento', 'experiencia'].includes(stop.entityType)) {
          const already = await isItemFavorite(user.id, stop.entityType, stop.entityId);
          if (!already) {
            await toggleFavoriteItem(user.id, stop.entityType, stop.entityId, false);
          }
        }
      }

      await completeItineraryForUser(user.id, 120);
      if (reloadProfile) {
        await reloadProfile();
      }

      setFeedback({
        type: 'success',
        message: 'Ruta guardada en tus favoritos y registrada como completada (+120 XP en tu perfil).',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo guardar la ruta.',
      });
    } finally {
      setSaving(false);
    }
  }

  function resetToExample(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (exampleItinerary) {
      setItinerary(exampleItinerary);
    }
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
    itinerary,
    loading,
    generating,
    saving,
    feedback,
    setFeedback,
    handleGenerate,
    handleSaveRoute,
    resetToExample,
  };
}
