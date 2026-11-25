import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfileDashboardData } from '../services/gamification.service';
import { getAstroPhotos, toggleAstroPhotoLike } from '../services/astrophotos.service';
import { updateUserGearBag } from '../services/photographers.service';
import { getUserBookings } from '../services/bookings.service';
import { getUserGuideRequests } from '../services/guides.service';

export function useProfileStats() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [ciudadOrigen, setCiudadOrigen] = useState('');
  const [biografia, setBiografia] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [handle, setHandle] = useState('');
  const [rolFotografico, setRolFotografico] = useState('');
  const [certificacion, setCertificacion] = useState('');
  const [offlineMode, setOfflineMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const [astroPhotos, setAstroPhotos] = useState([]);
  const [gearBag, setGearBag] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [guideRequests, setGuideRequests] = useState([]);

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
      setHandle(profile.handle || '');
      setRolFotografico(profile.rol_fotografico || '');
      setCertificacion(profile.certificacion || '');
      setOfflineMode(Boolean(profile.preferencia_offline));
      setGearBag(Array.isArray(profile.gear_bag) ? profile.gear_bag : []);
    }
  }, [profile]);

  const loadDashboard = useCallback(async () => {
    if (!user?.id) {
      setLoadingStats(false);
      return;
    }
    setLoadingStats(true);
    try {
      const [dashData, photosData, bookingsData, guideReqData] = await Promise.all([
        getProfileDashboardData(user.id).catch(() => null),
        getAstroPhotos({ authorId: user.id, userId: user.id }).catch(() => []),
        getUserBookings(user.id).catch(() => []),
        getUserGuideRequests(user.id).catch(() => []),
      ]);
      if (dashData) setDashboard(dashData);
      setAstroPhotos(photosData);
      setUserBookings(bookingsData);
      setGuideRequests(guideReqData);
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

    const cleanHandle = handle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');

    const { error } = await updateProfile({
      nombre: nombre.trim() || 'Viajero',
      apellido: apellido.trim(),
      ciudad_origen: ciudadOrigen.trim() || 'Región de Coquimbo',
      biografia: biografia.trim(),
      avatar_url: avatarUrl.trim() || null,
      handle: cleanHandle || null,
      rol_fotografico: rolFotografico.trim() || null,
      certificacion: certificacion.trim() || null,
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

  async function handleAddGear(name, detail) {
    if (!user?.id || !name.trim()) return false;
    const next = [
      ...gearBag,
      { id: `gear-${Date.now()}`, name: name.trim(), detail: (detail || '').trim() },
    ];
    try {
      const saved = await updateUserGearBag(user.id, next);
      setGearBag(saved);
      setFeedback({ type: 'success', message: 'Equipo agregado a tu Gear Bag.' });
      return true;
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo guardar tu equipo fotográfico.',
      });
      return false;
    }
  }

  async function handleRemoveGear(gearId) {
    if (!user?.id) return;
    const next = gearBag.filter((g) => g.id !== gearId);
    try {
      const saved = await updateUserGearBag(user.id, next);
      setGearBag(saved);
      setFeedback({ type: 'success', message: 'Equipo eliminado de tu Gear Bag.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo actualizar tu Gear Bag.',
      });
    }
  }

  function handlePhotoUploaded(newPhoto) {
    setAstroPhotos((prev) => [newPhoto, ...prev]);
    setFeedback({
      type: 'success',
      message: '¡Nueva captura publicada en tu portafolio y en la Galería de Astrofotos!',
    });
  }

  async function handleTogglePhotoLike(photo) {
    if (!user?.id || !photo?.id) return;
    try {
      const res = await toggleAstroPhotoLike(photo.id, user.id, Boolean(photo.liked));
      setAstroPhotos((prev) =>
        prev.map((item) =>
          item.id === photo.id
            ? { ...item, liked: res.liked, likes: res.likesCount }
            : item
        )
      );
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo actualizar el me gusta de la fotografía.',
      });
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

  const astroStats = useMemo(() => {
    const totalLikes = astroPhotos.reduce((sum, p) => sum + Number(p.likes || 0), 0);
    const uniqueSpots = [...new Set(astroPhotos.map((p) => p.spot))].length;
    return {
      capturesCount: astroPhotos.length,
      totalLikes,
      uniqueSpots,
    };
  }, [astroPhotos]);

  const astroBadges = Array.isArray(profile?.astro_badges) ? profile.astro_badges : [];

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
    handle,
    setHandle,
    rolFotografico,
    setRolFotografico,
    certificacion,
    setCertificacion,
    offlineMode,
    handleToggleOffline,
    saving,
    feedback,
    setFeedback,
    handleSave,
    signOut,
    astroPhotos,
    astroStats,
    astroBadges,
    gearBag,
    handleAddGear,
    handleRemoveGear,
    handlePhotoUploaded,
    handleTogglePhotoLike,
    userBookings,
    guideRequests,
  };
}
