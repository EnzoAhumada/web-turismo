import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfileDashboardData } from '../services/gamification.service';

export function useProfileStats() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [ciudadOrigen, setCiudadOrigen] = useState('');
  const [biografia, setBiografia] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [offlineMode, setOfflineMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const [dashboard, setDashboard] = useState({
    badgesCount: 0,
    earnedBadges: [],
    favoritesCount: 0,
    recentFavorites: [],
    userRank: null,
    totalTravelers: 0,
  });

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setApellido(profile.apellido || '');
      setCiudadOrigen(profile.ciudad_origen || 'Región de Coquimbo');
      setBiografia(profile.biografia || '');
      setAvatarUrl(profile.avatar_url || '');
      setOfflineMode(Boolean(profile.preferencia_offline));
    }
  }, [profile]);

  const loadDashboard = useCallback(async () => {
    if (!user?.id) {
      setLoadingStats(false);
      return;
    }
    setLoadingStats(true);
    try {
      const data = await getProfileDashboardData(user.id);
      setDashboard(data);
    } catch {
      // Mantener métricas base del perfil si falla la consulta complementaria
    } finally {
      setLoadingStats(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const { error } = await updateProfile({
      nombre: nombre.trim() || 'Viajero',
      apellido: apellido.trim(),
      ciudad_origen: ciudadOrigen.trim() || 'Región de Coquimbo',
      biografia: biografia.trim(),
      avatar_url: avatarUrl.trim() || null,
    });

    setSaving(false);
    if (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'No se pudo actualizar el perfil.',
      });
    } else {
      setFeedback({
        type: 'success',
        message: 'Perfil actualizado correctamente en la base de datos.',
      });
      setEditing(false);
      loadDashboard();
    }
  }

  async function handleToggleOffline(e) {
    if (e && e.preventDefault) e.preventDefault();
    const nextValue = !offlineMode;
    setOfflineMode(nextValue);
    try {
      window.localStorage.setItem('thakigo_offline_pref', String(nextValue));
    } catch {
      // Ignorar restricciones de almacenamiento
    }
    const { error } = await updateProfile({ preferencia_offline: nextValue });
    if (error) {
      setOfflineMode(!nextValue);
      setFeedback({
        type: 'error',
        message: 'No se pudo guardar tu preferencia de modo offline.',
      });
    } else {
      setFeedback({
        type: 'success',
        message: nextValue
          ? 'Modo offline activado y guardado en tu cuenta.'
          : 'Modo offline desactivado.',
      });
    }
  }

  const displayName = profile
    ? `${profile.nombre || ''} ${profile.apellido || ''}`.trim() || user?.email || 'Viajero'
    : user?.email || 'Viajero';

  const xp = Number(profile?.xp || 0);
  const nivel = Number(profile?.nivel || Math.floor(xp / 500) + 1);
  const bandStart = (nivel - 1) * 500;
  const nextThreshold = nivel * 500;
  const levelProgress = Math.min(Math.max((xp - bandStart) / 500, 0), 1);

  return {
    user,
    profile,
    displayName,
    xp,
    nivel,
    nextThreshold,
    levelProgress,
    dashboard,
    loadingStats,
    editing,
    setEditing,
    nombre,
    setNombre,
    apellido,
    setApellido,
    ciudadOrigen,
    setCiudadOrigen,
    biografia,
    setBiografia,
    avatarUrl,
    setAvatarUrl,
    offlineMode,
    handleToggleOffline,
    saving,
    feedback,
    setFeedback,
    handleSave,
    signOut,
  };
}
