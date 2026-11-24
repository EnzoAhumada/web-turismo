import { supabase } from '../lib/supabase';

function computeLevelFromXp(xp = 0) {
  const safeXp = Math.max(0, Number(xp) || 0);
  const level = Math.floor(safeXp / 500) + 1;
  const currentBandStart = (level - 1) * 500;
  const nextThreshold = level * 500;
  const pct = Math.min(100, Math.round(((safeXp - currentBandStart) / 500) * 100));
  return { xp: safeXp, level, nextThreshold, pct };
}

function getLevelTitle(level) {
  if (level >= 10) return 'Maestro de Andacollo';
  if (level >= 7) return 'Guía de las Estrellas';
  if (level >= 4) return 'Viajero Experto';
  if (level >= 2) return 'Explorador Curioso';
  return 'Viajero Inicial';
}

export async function getProfileDashboardData(userId) {
  if (!userId) {
    return {
      badgesCount: 0,
      earnedBadges: [],
      favoritesCount: 0,
      recentFavorites: [],
      userRank: null,
      totalTravelers: 0,
    };
  }

  const [
    { data: userBadges },
    { data: allBadges },
    { data: userFavs },
    { data: allProfiles },
  ] = await Promise.all([
    supabase
      .from('usuario_insignias')
      .select('insignia_id, obtenido_en')
      .eq('user_id', userId),
    supabase.from('insignias').select('id, nombre, icono, descripcion, xp_requerido').order('orden', { ascending: true }),
    supabase
      .from('favoritos')
      .select('id, tipo, item_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, xp')
      .order('xp', { ascending: false }),
  ]);

  const earnedIds = new Set((userBadges || []).map((ub) => ub.insignia_id));
  const earnedBadges = (allBadges || []).filter((b) => earnedIds.has(b.id));

  const favList = userFavs || [];
  const recentFavSlice = favList.slice(0, 4);

  const placeIds = recentFavSlice.filter((f) => f.tipo === 'lugar').map((f) => f.item_id);
  const expIds = recentFavSlice.filter((f) => f.tipo === 'experiencia').map((f) => f.item_id);
  const restIds = recentFavSlice.filter((f) => f.tipo === 'restaurante').map((f) => f.item_id);
  const eventIds = recentFavSlice.filter((f) => f.tipo === 'evento').map((f) => f.item_id);
  const accIds = recentFavSlice.filter((f) => f.tipo === 'alojamiento').map((f) => f.item_id);

  const [placesRes, expsRes, restsRes, eventsRes, accsRes] = await Promise.all([
    placeIds.length ? supabase.from('lugares').select('id, nombre').in('id', placeIds) : Promise.resolve({ data: [] }),
    expIds.length ? supabase.from('experiencias').select('id, nombre').in('id', expIds) : Promise.resolve({ data: [] }),
    restIds.length ? supabase.from('restaurantes').select('id, nombre').in('id', restIds) : Promise.resolve({ data: [] }),
    eventIds.length ? supabase.from('eventos').select('id, nombre').in('id', eventIds) : Promise.resolve({ data: [] }),
    accIds.length ? supabase.from('alojamientos').select('id, nombre').in('id', accIds) : Promise.resolve({ data: [] }),
  ]);

  const nameMap = new Map();
  for (const row of placesRes.data || []) nameMap.set(`lugar:${row.id}`, { title: row.nombre, to: `/lugar/${row.id}`, label: 'Lugar' });
  for (const row of expsRes.data || []) nameMap.set(`experiencia:${row.id}`, { title: row.nombre, to: `/experiencias/${row.id}`, label: 'Experiencia' });
  for (const row of restsRes.data || []) nameMap.set(`restaurante:${row.id}`, { title: row.nombre, to: `/restaurantes/${row.id}`, label: 'Restaurante' });
  for (const row of eventsRes.data || []) nameMap.set(`evento:${row.id}`, { title: row.nombre, to: `/eventos/${row.id}`, label: 'Evento' });
  for (const row of accsRes.data || []) nameMap.set(`alojamiento:${row.id}`, { title: row.nombre, to: `/alojamientos/${row.id}`, label: 'Alojamiento' });

  const recentFavorites = recentFavSlice
    .map((f) => {
      const info = nameMap.get(`${f.tipo}:${f.item_id}`);
      if (!info) return null;
      return { id: f.id, ...info };
    })
    .filter(Boolean);

  const rankingList = allProfiles || [];
  const rankIndex = rankingList.findIndex((p) => p.id === userId);

  return {
    badgesCount: earnedBadges.length,
    earnedBadges,
    favoritesCount: favList.length,
    recentFavorites,
    userRank: rankIndex >= 0 ? rankIndex + 1 : null,
    totalTravelers: rankingList.length,
  };
}

export async function getGamificationData(userId) {
  const [
    { data: badgesData },
    { data: challengesData },
    { data: allProfilesData },
    { data: allUserBadgesData },
    userChallengesRes,
  ] = await Promise.all([
    supabase.from('insignias').select('*').order('orden', { ascending: true }),
    supabase.from('desafios').select('*').eq('activo', true).order('orden', { ascending: true }),
    supabase
      .from('profiles')
      .select('id, nombre, apellido, avatar_url, nivel, xp, lugares_visitados, rutas_completadas, resenas_count, titulo_nivel')
      .order('xp', { ascending: false }),
    supabase.from('usuario_insignias').select('user_id, insignia_id'),
    userId
      ? supabase.from('usuario_desafios').select('desafio_id, progreso_pct, completado').eq('user_id', userId)
      : Promise.resolve({ data: [] }),
  ]);

  const badgeCountByUser = new Map();
  const currentUserEarnedIds = new Set();

  for (const row of allUserBadgesData || []) {
    badgeCountByUser.set(row.user_id, (badgeCountByUser.get(row.user_id) || 0) + 1);
    if (userId && row.user_id === userId) {
      currentUserEarnedIds.add(row.insignia_id);
    }
  }

  const profilesList = allProfilesData || [];
  const myIndex = userId ? profilesList.findIndex((p) => p.id === userId) : -1;
  const myProfile = myIndex >= 0 ? profilesList[myIndex] : null;
  const myXpCalc = computeLevelFromXp(myProfile?.xp || 0);

  const badges = (badgesData || []).map((b) => {
    const earned = currentUserEarnedIds.has(b.id) || myXpCalc.xp >= (b.xp_requerido || 0);
    return {
      id: b.id,
      icon: b.icono,
      name: b.nombre,
      desc: b.descripcion,
      xpRequired: b.xp_requerido || 0,
      earned,
    };
  });

  const userChallengesMap = new Map(
    (userChallengesRes?.data || []).map((c) => [c.desafio_id, c])
  );

  const challenges = (challengesData || []).map((c) => {
    const userProg = userChallengesMap.get(c.id);
    const progress = userProg ? userProg.progreso_pct : 0;
    const done = userProg ? Boolean(userProg.completado) : false;
    return {
      id: c.id,
      title: c.titulo,
      desc: c.descripcion,
      xp: c.xp_recompensa,
      progress,
      done,
    };
  });

  const leaderboard = profilesList.slice(0, 15).map((p, index) => {
    const fullName = `${p.nombre || ''} ${p.apellido || ''}`.trim() || 'Viajero';
    const calc = computeLevelFromXp(p.xp || 0);
    return {
      id: p.id,
      rank: index + 1,
      name: fullName,
      initials: fullName.slice(0, 1).toUpperCase(),
      level: p.nivel || calc.level,
      xp: calc.xp,
      places: p.lugares_visitados || 0,
      routes: p.rutas_completadas || 0,
      badgesCount: badgeCountByUser.get(p.id) || 0,
      avatar: p.avatar_url || null,
      isMe: Boolean(userId && p.id === userId),
    };
  });

  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  return {
    profileStats: {
      displayName: myProfile
        ? `${myProfile.nombre || ''} ${myProfile.apellido || ''}`.trim() || 'Viajero'
        : 'Viajero',
      avatar: myProfile?.avatar_url || null,
      level: myProfile?.nivel || myXpCalc.level,
      title: myProfile?.titulo_nivel || getLevelTitle(myProfile?.nivel || myXpCalc.level),
      xp: myXpCalc.xp,
      nextXp: myXpCalc.nextThreshold,
      pct: myXpCalc.pct,
      places: myProfile?.lugares_visitados || 0,
      routes: myProfile?.rutas_completadas || 0,
      reviews: myProfile?.resenas_count || 0,
      badgesCount: earnedBadgesCount,
      userRank: myIndex >= 0 ? myIndex + 1 : null,
      totalTravelers: profilesList.length,
    },
    badges,
    challenges,
    leaderboard,
  };
}

export async function completeUserChallenge(userId, challengeId, xpReward = 100) {
  if (!userId || !challengeId) return null;

  const { error: upsertErr } = await supabase.from('usuario_desafios').upsert(
    {
      user_id: userId,
      desafio_id: challengeId,
      progreso_pct: 100,
      completado: true,
    },
    { onConflict: 'user_id,desafio_id' }
  );

  if (upsertErr) {
    throw new Error('No se pudo registrar el desafío completado.');
  }

  const { data: current } = await supabase
    .from('profiles')
    .select('xp, lugares_visitados')
    .eq('id', userId)
    .single();

  const nextXp = (current?.xp || 0) + Number(xpReward || 0);
  const nextLevel = Math.floor(nextXp / 500) + 1;

  const { error: profErr } = await supabase
    .from('profiles')
    .update({
      xp: nextXp,
      nivel: nextLevel,
      lugares_visitados: (current?.lugares_visitados || 0) + 1,
      titulo_nivel: getLevelTitle(nextLevel),
    })
    .eq('id', userId);

  if (profErr) {
    throw new Error('Desafío guardado, pero no se pudo actualizar tu puntaje XP.');
  }

  return { xp: nextXp, nivel: nextLevel };
}
