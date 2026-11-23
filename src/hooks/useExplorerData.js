import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlaces } from '../services/places.service';
import { getRestaurants } from '../services/restaurants.service';
import { getAccommodations } from '../services/accommodations.service';
import { getEvents } from '../services/events.service';
import { getExperiences } from '../services/experiences.service';

export const EXPLORER_CATEGORIES = [
  { id: 'cultura',     label: 'Cultura' },
  { id: 'gastronomia', label: 'Gastronomía' },
  { id: 'astronomia',  label: 'Astronomía' },
  { id: 'naturaleza',  label: 'Naturaleza' },
  { id: 'religion',    label: 'Religión' },
  { id: 'mineria',     label: 'Minería' },
  { id: 'trekking',    label: 'Trekking' },
  { id: 'fotografia',  label: 'Fotografía' },
  { id: 'eventos',     label: 'Eventos' },
  { id: 'otros',       label: 'Otros' },
];

export const POPULAR_FILTERS = [
  { id: 'cerca',   label: 'Cerca de mí' },
  { id: 'gratis',  label: 'Gratis' },
  { id: 'familiar', label: 'Familiar' },
  { id: 'abierto', label: 'Abierto ahora' },
];

export const EXPLORER_TABS = [
  { id: 'lugares',      label: 'Lugares',      icon: 'map-pin' },
  { id: 'restaurantes', label: 'Restaurantes', icon: 'utensils' },
  { id: 'alojamientos', label: 'Alojamientos', icon: 'building' },
  { id: 'eventos',      label: 'Eventos',      icon: 'calendar' },
  { id: 'experiencias', label: 'Experiencias', icon: 'compass' },
];

export function useExplorerData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'lugares');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoria') || '');
  const [popularFilter, setPopularFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const catParam = searchParams.get('categoria');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    if (catParam !== null && catParam !== categoryFilter) {
      setCategoryFilter(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const q = searchQuery.trim();
        let data = [];

        if (activeTab === 'lugares') {
          const rows = await getPlaces({ search: q, categorySlug: categoryFilter });
          let filtered = rows;
          if (popularFilter === 'cerca') {
            filtered = rows.filter((r) => Number(r.distancia_km ?? 99) <= 3.5);
          } else if (popularFilter === 'gratis') {
            filtered = rows.filter((r) => r.es_gratis !== false);
          } else if (popularFilter === 'familiar') {
            filtered = rows.filter((r) => r.es_familiar !== false);
          } else if (popularFilter === 'abierto') {
            filtered = rows.filter((r) => r.abierto_ahora !== false);
          }

          data = filtered.map((item) => ({
            id: item.id,
            title: item.nombre,
            subtitle: item.subtitulo || item.categorias?.nombre,
            image: item.imagen_url,
            rating: item.rating_promedio,
            reviewsCount: item.resenas_count,
            distance: item.distancia_km ? `${item.distancia_km} km` : null,
            badge: item.badge_texto,
            to: `/lugar/${item.id}`,
          }));
        } else if (activeTab === 'restaurantes') {
          const rows = await getRestaurants({ search: q });
          data = rows.map((item) => ({
            id: item.id,
            title: item.nombre,
            subtitle: item.especialidad || (item.precio_rango ? `Precio: ${item.precio_rango}` : 'Restaurante'),
            image: item.imagen_url,
            rating: item.rating_promedio,
            reviewsCount: item.resenas_count,
            distance: item.distancia_km ? `${item.distancia_km} km` : null,
            badge: item.precio_rango,
            to: `/restaurantes/${item.id}`,
          }));
        } else if (activeTab === 'alojamientos') {
          const rows = await getAccommodations({ search: q });
          data = rows.map((item) => ({
            id: item.id,
            title: item.nombre,
            subtitle: item.tipo || 'Alojamiento en Andacollo',
            image: item.imagen_url,
            rating: item.rating_promedio,
            reviewsCount: item.resenas_count,
            distance: item.distancia_km ? `${item.distancia_km} km` : null,
            metaExtra: item.precio_por_noche
              ? `$${Number(item.precio_por_noche).toLocaleString('es-CL')} / noche`
              : null,
            to: `/alojamientos/${item.id}`,
          }));
        } else if (activeTab === 'eventos') {
          const rows = await getEvents({ search: q });
          data = rows.map((item) => ({
            id: item.id,
            title: item.nombre,
            subtitle: item.categoria,
            image: item.imagen_url,
            metaExtra: item.fecha_inicio
              ? new Date(item.fecha_inicio + 'T12:00:00').toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'short',
                })
              : null,
            to: `/eventos/${item.id}`,
          }));
        } else if (activeTab === 'experiencias') {
          const rows = await getExperiences({ search: q });
          data = rows.map((item) => ({
            id: item.id,
            title: item.nombre,
            subtitle: item.categoria,
            image: item.imagen_url,
            rating: item.rating_promedio,
            reviewsCount: item.resenas_count,
            metaExtra: item.precio
              ? `$${Number(item.precio).toLocaleString('es-CL')} CLP`
              : null,
            to: `/experiencias/${item.id}`,
          }));
        }

        if (active) {
          setItems(data);
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Error al cargar los elementos.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [activeTab, searchQuery, categoryFilter, popularFilter]);

  function changeTab(tabId) {
    setActiveTab(tabId);
    setCategoryFilter('');
    setPopularFilter('');
    setSearchParams({ tab: tabId });
  }

  function selectCategory(slug) {
    if (slug === 'eventos') {
      changeTab('eventos');
      return;
    }
    if (slug === 'gastronomia') {
      changeTab('restaurantes');
      return;
    }
    if (slug === 'otros') {
      setActiveTab('lugares');
      setCategoryFilter('');
      setSearchParams({ tab: 'lugares' });
      return;
    }
    const next = categoryFilter === slug ? '' : slug;
    setActiveTab('lugares');
    setCategoryFilter(next);
    setSearchParams(next ? { tab: 'lugares', categoria: next } : { tab: 'lugares' });
  }

  function togglePopularFilter(filterId) {
    setPopularFilter((prev) => (prev === filterId ? '' : filterId));
  }

  function clearFilters() {
    setSearchQuery('');
    setCategoryFilter('');
    setPopularFilter('');
    setSearchParams({ tab: activeTab });
  }

  const currentTab = EXPLORER_TABS.find((t) => t.id === activeTab) || EXPLORER_TABS[0];

  return {
    tabs: EXPLORER_TABS,
    categories: EXPLORER_CATEGORIES,
    popularFilters: POPULAR_FILTERS,
    activeTab,
    currentTab,
    categoryFilter,
    popularFilter,
    searchQuery,
    setSearchQuery,
    changeTab,
    selectCategory,
    togglePopularFilter,
    clearFilters,
    items,
    loading,
    error,
  };
}
