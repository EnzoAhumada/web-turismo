import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGamificationData } from '../services/gamification.service';

export function useGamification() {
  const { user, profile } = useAuth();
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getGamificationData(user?.id);
        if (!active) return;
        setBadges(data.badges);
        setChallenges(data.challenges);
        setLeaderboard(data.leaderboard);
      } catch (err) {
        if (active) setError(err?.message || 'Error al cargar gamificación.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const currentXp = profile?.xp ?? 1200;
  const currentLevel = profile?.nivel ?? 3;
  const nextXp = (Math.floor(currentXp / 1000) + 1) * 1000 + 2000;
  const levelInfo = {
    current: currentLevel,
    name: profile?.titulo_nivel || 'Viajero Experto',
    displayName: profile
      ? `${profile.nombre || ''} ${profile.apellido || ''}`.trim() || 'Viajero'
      : 'Ana Valdés',
    avatar: profile?.avatar_url || 'https://i.pravatar.cc/80?img=44',
    xp: currentXp,
    nextXp,
    pct: Math.min(Math.round((currentXp / nextXp) * 100), 100),
    places: profile?.lugares_visitados ?? 23,
    routes: profile?.rutas_completadas ?? 8,
    badgesCount: badges.filter((b) => b.earned).length || 3,
  };

  return {
    levelInfo,
    badges,
    challenges,
    leaderboard,
    loading,
    error,
  };
}
