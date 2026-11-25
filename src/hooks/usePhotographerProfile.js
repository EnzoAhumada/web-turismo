import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getPhotographerProfile,
  toggleFollowPhotographer,
} from '../services/photographers.service';

export function usePhotographerProfile(handleOrId) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPhotographerProfile(handleOrId, user?.id || null);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [handleOrId, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleFollow() {
    if (!data?.profile?.id) return;
    if (!user?.id) {
      setFeedback({
        type: 'info',
        message: 'Inicia sesión para seguir a este astrofotógrafo.',
      });
      return;
    }
    try {
      const res = await toggleFollowPhotographer(
        data.profile.id,
        user.id,
        data.isFollowing
      );
      setData((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: res.following,
              stats: { ...prev.stats, followersCount: res.followersCount },
            }
          : prev
      );
      setFeedback({
        type: 'success',
        message: res.following
          ? `Ahora sigues a ${data.displayName}.`
          : `Dejaste de seguir a ${data.displayName}.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo actualizar el seguimiento.',
      });
    }
  }

  return {
    data,
    loading,
    feedback,
    setFeedback,
    isOwnProfile: Boolean(user?.id && data?.profile?.id === user.id),
    handleToggleFollow,
  };
}
