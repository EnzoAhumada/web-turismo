import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGamificationData, completeUserChallenge } from '../services/gamification.service';

export function useGamification() {
  const { user, profile, reloadProfile } = useAuth();
  const [profileStats, setProfileStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyChallengeId, setBusyChallengeId] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGamificationData(user?.id);
      setProfileStats(data.profileStats);
      setBadges(data.badges);
      setChallenges(data.challenges);
      setLeaderboard(data.leaderboard);
    } catch (err) {
      setError(err?.message || 'Error al cargar logros y ranking.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCompleteChallenge(challenge) {
    if (!user?.id || !challenge || challenge.done) return;
    setBusyChallengeId(challenge.id);
    setFeedback(null);
    try {
      await completeUserChallenge(user.id, challenge.id, challenge.xp);
      if (reloadProfile) {
        await reloadProfile();
      }
      await load();
      setFeedback({
        type: 'success',
        message: `¡Desafío "${challenge.title}" completado! Ganaste +${challenge.xp} XP.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo completar el desafío.',
      });
    } finally {
      setBusyChallengeId('');
    }
  }

  const currentXp = profileStats?.xp ?? Number(profile?.xp || 0);
  const currentLevel = profileStats?.level ?? Number(profile?.nivel || 1);
  const nextXp = profileStats?.nextXp ?? currentLevel * 500;
  const pct = profileStats?.pct ?? Math.min(Math.round(((currentXp % 500) / 500) * 100), 100);

  const displayName =
    profileStats?.displayName ||
    (profile ? `${profile.nombre || ''} ${profile.apellido || ''}`.trim() : '') ||
    user?.email ||
    'Viajero';

  const levelInfo = {
    current: currentLevel,
    name: profileStats?.title || profile?.titulo_nivel || 'Viajero Inicial',
    displayName,
    initials: displayName.slice(0, 1).toUpperCase(),
    avatar: profileStats?.avatar || profile?.avatar_url || null,
    xp: currentXp,
    nextXp,
    pct,
    places: profileStats?.places ?? Number(profile?.lugares_visitados || 0),
    routes: profileStats?.routes ?? Number(profile?.rutas_completadas || 0),
    badgesCount: profileStats?.badgesCount ?? badges.filter((b) => b.earned).length,
    userRank: profileStats?.userRank ?? null,
    totalTravelers: profileStats?.totalTravelers ?? leaderboard.length,
  };

  return {
    levelInfo,
    badges,
    challenges,
    leaderboard,
    loading,
    busyChallengeId,
    error,
    feedback,
    setFeedback,
    handleCompleteChallenge,
  };
}
