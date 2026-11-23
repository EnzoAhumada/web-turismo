import { supabase } from '../lib/supabase';

export async function getGamificationData(userId) {
  const [
    { data: badgesData },
    { data: challengesData },
    { data: leaderboardData },
    userBadgesRes,
    userChallengesRes,
  ] = await Promise.all([
    supabase.from('insignias').select('*').order('orden', { ascending: true }),
    supabase.from('desafios').select('*').eq('activo', true).order('orden', { ascending: true }),
    supabase
      .from('profiles')
      .select('id, nombre, apellido, avatar_url, nivel, xp, lugares_visitados, rutas_completadas, titulo_nivel')
      .order('xp', { ascending: false })
      .limit(10),
    userId
      ? supabase.from('usuario_insignias').select('insignia_id').eq('user_id', userId)
      : Promise.resolve({ data: [] }),
    userId
      ? supabase.from('usuario_desafios').select('desafio_id, progreso_pct, completado').eq('user_id', userId)
      : Promise.resolve({ data: [] }),
  ]);

  const earnedIds = new Set((userBadgesRes?.data || []).map((u) => u.insignia_id));
  const userChallengesMap = new Map(
    (userChallengesRes?.data || []).map((c) => [c.desafio_id, c])
  );

  const badges = (badgesData || []).map((b) => ({
    id: b.id,
    icon: b.icono,
    name: b.nombre,
    desc: b.descripcion,
    earned: earnedIds.has(b.id) || Boolean(b.desbloqueada_por_defecto),
  }));

  const challenges = (challengesData || []).map((c) => {
    const userProg = userChallengesMap.get(c.id);
    const progress = userProg ? userProg.progreso_pct : (c.progreso_base ?? 0);
    const done = userProg ? userProg.completado : Boolean(c.completado_base);
    return {
      id: c.id,
      title: c.titulo,
      desc: c.descripcion,
      xp: c.xp_recompensa,
      progress,
      done,
    };
  });

  const leaderboard = (leaderboardData || []).map((p, index) => ({
    id: p.id,
    rank: index + 1,
    name: `${p.nombre || ''} ${p.apellido || ''}`.trim() || 'Viajero',
    level: p.nivel || 1,
    xp: p.xp || 0,
    avatar: p.avatar_url || 'https://i.pravatar.cc/80?img=44',
    isMe: userId ? p.id === userId : index === 2,
  }));

  return {
    badges,
    challenges,
    leaderboard,
  };
}
