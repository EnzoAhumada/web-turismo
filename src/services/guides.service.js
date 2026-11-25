import { supabase } from '../lib/supabase';

export const GUIDE_SPECIALTIES = [
  'Todos',
  'Astroturismo & Cielo Profundo',
  'Astrofotografía Guiada',
  'Patrimonio & Ruta Minera',
  'Trekking Nocturno',
];

export async function getGuides({
  specialty = 'Todos',
  search = '',
  includeInactive = false,
} = {}) {
  let query = supabase
    .from('tour_guides')
    .select('*')
    .order('verificado', { ascending: false })
    .order('rating', { ascending: false })
    .order('created_at', { ascending: false });

  if (!includeInactive) {
    query = query.eq('activo', true);
  }
  if (specialty && specialty !== 'Todos') {
    query = query.eq('especialidad', specialty);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message || 'No se pudieron cargar los guías turísticos.');

  let rows = data || [];
  const q = search.trim().toLowerCase();
  if (q) {
    rows = rows.filter((g) => {
      const nameMatch = (g.nombre || '').toLowerCase().includes(q);
      const specMatch = (g.especialidad || '').toLowerCase().includes(q);
      const sectorsMatch = (g.sectores || []).some((s) => s.toLowerCase().includes(q));
      const langMatch = (g.idiomas || []).some((l) => l.toLowerCase().includes(q));
      return nameMatch || specMatch || sectorsMatch || langMatch;
    });
  }

  return rows;
}

export async function createGuideApplication({
  userId,
  nombre,
  especialidad,
  certificacion,
  tarifaReferencial,
  sectores,
  biografia,
  equipamiento,
  idiomas,
  telefono,
}) {
  if (!userId) throw new Error('Inicia sesión para postular tu perfil como guía local.');
  if (!nombre?.trim()) throw new Error('Ingresa tu nombre completo.');

  const sectorList = Array.isArray(sectores)
    ? sectores
    : String(sectores || 'Andacollo')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const languageList = Array.isArray(idiomas)
    ? idiomas
    : String(idiomas || 'Español')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const payload = {
    user_id: userId,
    nombre: nombre.trim(),
    especialidad: especialidad || 'Astroturismo & Cielo Profundo',
    certificacion: certificacion?.trim() || 'SERNATUR Sello R · Guía Local',
    experiencia: 'Nuevo en ThakiGo',
    idiomas: languageList.length ? languageList : ['Español'],
    sectores: sectorList.length ? sectorList : ['Andacollo'],
    tarifa_referencial: tarifaReferencial?.trim() || '$18.000 CLP / persona',
    rating: 5.0,
    resenas_count: 1,
    equipamiento: equipamiento?.trim() || 'Equipamiento local verificado por ThakiGo.',
    biografia: biografia?.trim() || 'Guía local certificado en la comuna de Andacollo.',
    itinerario: [
      '20:30 · Punto de encuentro en Plaza de Andacollo y traslado',
      '21:30 · Actividad principal guiada en terreno',
      '23:00 · Cierre, consultas y retorno seguro',
    ],
    telefono: telefono?.trim() || '',
    verificado: true,
    activo: true,
  };

  const { data, error } = await supabase
    .from('tour_guides')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error(error.message || 'No se pudo registrar el perfil de guía.');
  return data;
}

export async function createGuideBookingRequest({
  guideId,
  userId,
  fecha,
  personas,
  telefono,
  notas,
}) {
  if (!userId) throw new Error('Inicia sesión para enviar una solicitud directa al guía.');
  if (!fecha) throw new Error('Selecciona una fecha para la actividad.');
  const todayStr = new Date().toISOString().split('T')[0];
  if (fecha < todayStr) throw new Error('La fecha no puede ser anterior a hoy.');

  const payload = {
    guide_id: guideId,
    user_id: userId,
    fecha,
    personas: Math.min(20, Math.max(1, Number(personas) || 1)),
    telefono: telefono?.trim() || '',
    notas: notas?.trim() || '',
    estado: 'pendiente',
  };

  const { data, error } = await supabase
    .from('guide_booking_requests')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error(error.message || 'No se pudo enviar la solicitud al guía.');
  return data;
}

export async function getUserGuideRequests(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('guide_booking_requests')
    .select('*, tour_guides:guide_id(id, nombre, especialidad, tarifa_referencial)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

/* ── Administración de Guías ─────────────────────────────────────────────── */

export async function saveGuideAdmin(guide) {
  const sectorList = Array.isArray(guide.sectores)
    ? guide.sectores
    : String(guide.sectores || 'Andacollo')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const languageList = Array.isArray(guide.idiomas)
    ? guide.idiomas
    : String(guide.idiomas || 'Español')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const itineraryList = Array.isArray(guide.itinerario)
    ? guide.itinerario
    : String(guide.itinerario || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

  const payload = {
    nombre: guide.nombre?.trim(),
    especialidad: guide.especialidad || 'Astroturismo & Cielo Profundo',
    certificacion: guide.certificacion?.trim() || 'SERNATUR Sello R',
    experiencia: guide.experiencia?.trim() || 'Guía Local',
    idiomas: languageList.length ? languageList : ['Español'],
    sectores: sectorList.length ? sectorList : ['Andacollo'],
    tarifa_referencial: guide.tarifa_referencial?.trim() || '$18.000 CLP / persona',
    equipamiento: guide.equipamiento?.trim() || '',
    biografia: guide.biografia?.trim() || '',
    itinerario: itineraryList,
    telefono: guide.telefono?.trim() || '',
    verificado: Boolean(guide.verificado),
    activo: guide.activo !== false,
  };

  const query = guide.id
    ? supabase.from('tour_guides').update(payload).eq('id', guide.id).select('*').single()
    : supabase.from('tour_guides').insert(payload).select('*').single();

  const { data, error } = await query;
  if (error) throw new Error(error.message || 'No se pudo guardar el guía turístico.');
  return data;
}

export async function deleteGuideAdmin(id) {
  const { error } = await supabase.from('tour_guides').delete().eq('id', id);
  if (error) throw new Error(error.message || 'No se pudo eliminar el guía.');
}

export async function getAdminGuideRequests() {
  const { data, error } = await supabase
    .from('guide_booking_requests')
    .select('*, tour_guides:guide_id(id, nombre, especialidad)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message || 'No se pudieron cargar las solicitudes de guías.');
  return data || [];
}

export async function updateGuideRequestStatus(id, estado) {
  const { data, error } = await supabase
    .from('guide_booking_requests')
    .update({ estado })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'No se pudo actualizar la solicitud.');
  return data;
}
