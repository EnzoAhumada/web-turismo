import { useState, useEffect } from 'react';
import { getRestaurants } from '../services/restaurants.service';

export const PRICE_LABELS = {
  $: 'Económico',
  $$: 'Moderado',
  $$$: 'Premium',
};

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePriceFilter, setActivePriceFilter] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getRestaurants({
          search: searchQuery,
          priceRange: activePriceFilter,
        });
        if (active) setRestaurants(data);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar restaurantes.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [searchQuery, activePriceFilter]);

  function togglePriceFilter(price) {
    setActivePriceFilter((prev) => (prev === price ? null : price));
  }

  return {
    restaurants,
    featured: restaurants[0] || null,
    rest: restaurants.slice(1),
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activePriceFilter,
    togglePriceFilter,
    priceLabels: PRICE_LABELS,
  };
}
