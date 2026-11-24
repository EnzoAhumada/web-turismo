import { useState, useEffect } from 'react';
import { getPlaces } from '../services/places.service';
import { getCategories } from '../services/categories.service';
import { getHomeHighlights } from '../services/recommendations.service';
import { getLatestNews, syncAndacolloNews } from '../services/news.service';

export function useHomeData() {
  const [featured, setFeatured] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [weatherBanner, setWeatherBanner] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [placesData, catsData, bannerData, newsData] = await Promise.all([
          getPlaces({ limit: 4 }),
          getCategories({ onlyHome: true }),
          getHomeHighlights(),
          getLatestNews({ limit: 10 }).catch(() => []),
        ]);
        if (!active) return;

        if (placesData.length > 0) {
          setFeatured(placesData[0]);
          setRecommended(placesData.slice(1));
        }

        setCategories(
          catsData.map((c) => ({
            id: c.slug,
            label: c.nombre,
            icon: c.icono || 'compass',
            color: c.color || '#071B3A',
            bg: c.color_fondo || '#F5F7FA',
          }))
        );
        setWeatherBanner(bannerData);
        setNews(newsData);

        // Sincronización automática no bloqueante desde fuente local de Andacollo
        syncAndacolloNews({ force: false }).then((syncResult) => {
          if (!active || !syncResult?.synced || !syncResult?.inserted) return;
          getLatestNews({ limit: 10 })
            .then((freshNews) => {
              if (active) setNews(freshNews);
            })
            .catch(() => {});
        });
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar el inicio.');
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
    featured,
    recommended,
    categories,
    weatherBanner,
    news,
    loading,
    error,
  };
}
