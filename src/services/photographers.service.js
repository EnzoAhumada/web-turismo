import { supabase } from '../lib/supabase';
import { getAstroPhotos } from './astrophotos.service';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPhotographerProfile(handleOrId, viewerUserId = null) {
  const cleanKey = decodeURIComponent(String(handleOrId || '')).trim();
  if (!cleanKey) return null;

  let query = supabase.from('profiles').select('*');
  if (UUID_REGEX.test(cleanKey)) {
    query = query.eq('id', cleanKey);
  } else {
    query = query.eq('handle', cleanKey);
  }

  const { data: profile, error } = await query.maybeSingle();
  if (error || !profile) return null;

  const [photos, { count: followersCount }, followRow] = await Promise.all([
    getAstroPhotos({ authorId: profile.id, userId: viewerUserId }),
    supabase
      .from('user_follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_profile_id', profile.id),
    viewerUserId
      ? supabase
          .from('user_follows')
          .select('id')
          .eq('follower_id', viewerUserId)
          .eq('following_profile_id', profile.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const totalLikes = photos.reduce((sum, p) => sum + Number(p.likes || 0), 0);
  const uniqueSpots = [...new Set(photos.map((p) => p.spot))].length;

  return {
    profile,
    displayName: `${profile.nombre || ''} ${profile.apellido || ''}`.trim() || 'Astrofotógrafo',
    photos,
    stats: {
      capturesCount: photos.length,
      totalLikes,
      uniqueSpots,
      followersCount: Number(followersCount || 0),
    },
    isFollowing: Boolean(followRow?.data?.id),
    gearBag: Array.isArray(profile.gear_bag) ? profile.gear_bag : [],
    astroBadges: Array.isArray(profile.astro_badges) ? profile.astro_badges : [],
  };
}

export async function toggleFollowPhotographer(profileId, followerUserId, currentlyFollowing) {
  if (!followerUserId) {
    throw new Error('Inicia sesión para seguir a otros astrofotógrafos.');
  }
  if (profileId === followerUserId) {
    throw new Error('No puedes seguirte a ti mismo.');
  }

  if (currentlyFollowing) {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', followerUserId)
      .eq('following_profile_id', profileId);
    if (error) throw new Error(error.message || 'No se pudo dejar de seguir.');
  } else {
    const { error } = await supabase
      .from('user_follows')
      .insert({ follower_id: followerUserId, following_profile_id: profileId });
    if (error && error.code !== '23505') {
      throw new Error(error.message || 'No se pudo seguir al perfil.');
    }
  }

  const { count } = await supabase
    .from('user_follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_profile_id', profileId);

  return {
    following: !currentlyFollowing,
    followersCount: Number(count || 0),
  };
}

export async function updateUserGearBag(userId, gearBag) {
  if (!userId) throw new Error('Sesión no válida.');
  const clean = (Array.isArray(gearBag) ? gearBag : []).map((item, idx) => ({
    id: item.id || `gear-${Date.now()}-${idx}`,
    name: String(item.name || '').trim(),
    detail: String(item.detail || '').trim(),
  })).filter((item) => item.name);

  const { data, error } = await supabase
    .from('profiles')
    .update({ gear_bag: clean })
    .eq('id', userId)
    .select('gear_bag')
    .single();

  if (error) throw new Error(error.message || 'No se pudo guardar tu equipo fotográfico.');
  return Array.isArray(data?.gear_bag) ? data.gear_bag : clean;
}
