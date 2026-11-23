import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEvents } from '../services/events.service';
import { getUserEventFavoritesIds, toggleFavoriteItem } from '../services/favorites.service';

export function useEvents() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Próximos');
  const [allEvents, setAllEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [eventsData, favIds] = await Promise.all([
          getEvents(),
          user ? getUserEventFavoritesIds(user.id) : Promise.resolve([]),
        ]);
        if (active) {
          setAllEvents(eventsData);
          setSavedEventIds(favIds);
        }
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar eventos.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  async function toggleSaveEvent(eventId) {
    const currentlySaved = savedEventIds.includes(eventId);
    setSavedEventIds((prev) =>
      currentlySaved ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
    if (user) {
      try {
        await toggleFavoriteItem(user.id, 'evento', eventId, currentlySaved);
      } catch {
        setSavedEventIds((prev) =>
          currentlySaved ? [...prev, eventId] : prev.filter((id) => id !== eventId)
        );
      }
    }
  }

  const events =
    activeTab === 'Mis eventos'
      ? allEvents.filter((ev) => savedEventIds.includes(ev.id))
      : allEvents;

  function formatDate(d1, d2) {
    if (!d1) return '';
    const opts = { day: 'numeric', month: 'short', year: 'numeric' };
    const start = new Date(d1 + 'T12:00:00').toLocaleDateString('es-CL', opts);
    if (!d2 || d1 === d2) return start;
    const end = new Date(d2 + 'T12:00:00').toLocaleDateString('es-CL', opts);
    return `${start} – ${end}`;
  }

  return {
    activeTab,
    setActiveTab,
    events,
    featuredEvent: allEvents[0] || null,
    savedEventIds,
    toggleSaveEvent,
    loading,
    error,
    formatDate,
  };
}
