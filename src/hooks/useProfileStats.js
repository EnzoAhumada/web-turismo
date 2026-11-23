import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserFavoritesCount } from '../services/favorites.service';

export function useProfileStats() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setApellido(profile.apellido || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    getUserFavoritesCount(user.id).then((count) => setFavoritesCount(count));
  }, [user]);

  async function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    const { error } = await updateProfile({ nombre, apellido });
    setSaving(false);
    if (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'No se pudo actualizar el perfil.',
      });
    } else {
      setFeedback({
        type: 'success',
        message: 'Perfil actualizado correctamente.',
      });
      setEditing(false);
    }
  }

  const displayName = profile
    ? `${profile.nombre || ''} ${profile.apellido || ''}`.trim() || user?.email
    : user?.email;

  const xp = profile?.xp || 0;
  const nextThreshold = (Math.floor(xp / 500) + 1) * 500;
  const levelProgress = Math.min((xp % 500) / 500, 1);

  const stats = [
    { label: 'Lugares visitados', value: String(profile?.lugares_visitados || 0), icon: 'map-pin' },
    { label: 'Favoritos',         value: String(favoritesCount),                  icon: 'heart' },
    { label: 'Reseñas',           value: String(profile?.resenas_count || 0),     icon: 'star' },
    { label: 'Nivel actual',      value: String(profile?.nivel || 1),             icon: 'award' },
  ];

  return {
    user,
    profile,
    displayName,
    xp,
    nextThreshold,
    levelProgress,
    stats,
    editing,
    setEditing,
    nombre,
    setNombre,
    apellido,
    setApellido,
    saving,
    feedback,
    setFeedback,
    handleSave,
    signOut,
  };
}
