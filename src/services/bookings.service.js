import { supabase } from '../lib/supabase';

export const BOOKING_ENTITY_TYPES = [
  { id: 'lugar', label: 'Lugares turísticos', table: 'lugares' },
  { id: 'restaurante', label: 'Restaurantes / Comida', table: 'restaurantes' },
  { id: 'alojamiento', label: 'Alojamientos', table: 'alojamientos' },
  { id: 'evento', label: 'Eventos', table: 'eventos' },
  { id: 'experiencia', label: 'Experiencias / Servicios', table: 'experiencias' },
];

export const BOOKING_PROFILES = [
  {
    id: 'tour_horario',
    label: 'Tour / Visita por horario y cupos',
    desc: 'Ideal para observatorios, tours astronómicos y visitas guiadas con turnos y cupos.',
  },
  {
    id: 'mesa_comida',
    label: 'Mesa / Comida (Restaurante)',
    desc: 'Fecha, horario, cantidad de comensales y notas/alergias o preferencias.',
  },
  {
    id: 'estadia_noches',
    label: 'Estadía / Alojamiento por noches',
    desc: 'Fecha de entrada y salida con cálculo de noches, huéspedes y tipo de cabaña/habitación.',
  },
  {
    id: 'servicio_general',
    label: 'Servicio / Solicitud flexible',
    desc: 'Opción de servicio, fecha deseada, personas y comentarios para otros servicios.',
  },
];

export const PRICING_MODES = [
  { id: 'calculado', label: 'Tarifa calculada en CLP' },
  { id: 'sin_costo', label: 'Sin costo / Consumo en local' },
];

export const CONFIRMATION_MODES = [
  { id: 'inmediata', label: 'Confirmación inmediata' },
  { id: 'pendiente', label: 'Pendiente de aprobación en admin' },
];

export function computeNights(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) return 1;
  const start = new Date(`${fechaInicio}T12:00:00`);
  const end = new Date(`${fechaFin}T12:00:00`);
  const diff = Math.round((end - start) / 86400000);
  return Number.isFinite(diff) && diff > 0 ? diff : 0;
}

export function calculateBookingTotal({
  config,
  pkg,
  adults = 1,
  children = 0,
  nights = 1,
  isResident = false,
}) {
  if (!config || config.pricing_mode === 'sin_costo' || !pkg) {
    return 0;
  }

  const adultPrice = Number(pkg.precio_adulto || 0);
  const childPrice = Number(pkg.precio_nino || 0);
  const safeAdults = Math.max(1, Number(adults) || 1);
  const safeChildren = Math.max(0, Number(children) || 0);
  const safeNights = Math.max(1, Number(nights) || 1);

  let subtotal = 0;
  if (pkg.pricing_unit === 'tarifa_fija') {
    subtotal = adultPrice;
  } else if (pkg.pricing_unit === 'por_noche' || config.booking_profile === 'estadia_noches') {
    subtotal = adultPrice * safeNights;
  } else {
    subtotal = safeAdults * adultPrice + safeChildren * childPrice;
  }

  if (isResident && config.descuento_residente_activo) {
    const pct = Math.min(100, Math.max(0, Number(config.descuento_residente_pct || 0)));
    subtotal = Math.round(subtotal * (1 - pct / 100));
  }

  return Math.max(0, subtotal);
}

export async function getEntityBookingSetup(entityType, entityId) {
  const { data: config, error } = await supabase
    .from('booking_configs')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('activo', true)
    .maybeSingle();

  if (error || !config) return null;

  const [{ data: packages }, { data: slots }] = await Promise.all([
    supabase
      .from('booking_packages')
      .select('*')
      .eq('config_id', config.id)
      .eq('activo', true)
      .order('orden', { ascending: true }),
    supabase
      .from('booking_slots')
      .select('*')
      .eq('config_id', config.id)
      .eq('activo', true)
      .order('orden', { ascending: true }),
  ]);

  return {
    config,
    packages: packages || [],
    slots: slots || [],
  };
}

export async function getSlotAvailability(configId, fecha, slots = []) {
  if (!configId || !fecha || !slots.length) {
    return slots.map((s) => ({ ...s, disponibles: Number(s.capacidad_base || 0) }));
  }

  const { data, error } = await supabase.rpc('get_slot_occupancy', {
    p_config_id: configId,
    p_fecha: fecha,
  });

  const occMap = new Map();
  if (!error && Array.isArray(data)) {
    data.forEach((row) => occMap.set(row.slot_id, Number(row.ocupados || 0)));
  }

  return slots.map((slot) => {
    const used = occMap.get(slot.id) || 0;
    const base = Number(slot.capacidad_base || 0);
    return {
      ...slot,
      ocupados: used,
      disponibles: Math.max(0, base - used),
    };
  });
}

function generateBookingCode(prefix = 'THK') {
  const cleanPrefix = String(prefix || 'THK')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4) || 'THK';
  const year = new Date().getFullYear();
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `${cleanPrefix}-${year}-${rnd}`;
}

export async function createEntityBooking({
  config,
  entityName,
  userId,
  pkg,
  slot,
  fechaInicio,
  fechaFin,
  adults,
  children,
  isResident,
  holderName,
  holderPhone,
  notas,
  availableSpots,
}) {
  if (!userId) throw new Error('Debes iniciar sesión para confirmar una reserva.');
  if (!fechaInicio) throw new Error('Selecciona una fecha válida para tu reserva.');

  const todayStr = new Date().toISOString().split('T')[0];
  if (fechaInicio < todayStr) {
    throw new Error('La fecha de reserva no puede ser anterior a hoy.');
  }

  let nights = 1;
  if (config.booking_profile === 'estadia_noches') {
    nights = computeNights(fechaInicio, fechaFin);
    if (nights < 1) {
      throw new Error('La fecha de salida debe ser posterior a la fecha de entrada (mínimo 1 noche).');
    }
  }

  const safeAdults = Math.max(1, Number(adults) || 1);
  const safeChildren = Math.max(0, Number(children) || 0);
  const cuposSolicitados =
    pkg?.pricing_unit === 'tarifa_fija'
      ? Math.max(1, Number(pkg.capacidad_maxima || safeAdults + safeChildren))
      : safeAdults + safeChildren;

  if (slot && availableSpots !== undefined && availableSpots !== null) {
    if (cuposSolicitados > availableSpots) {
      throw new Error(
        `Solo quedan ${availableSpots} cupos disponibles para las ${slot.hora_inicio} hrs en esa fecha.`
      );
    }
  }

  const totalClp = calculateBookingTotal({
    config,
    pkg,
    adults: safeAdults,
    children: safeChildren,
    nights,
    isResident,
  });

  const estado = config.confirmation_mode === 'pendiente' ? 'pendiente' : 'confirmada';
  const codigo = generateBookingCode(config.codigo_prefijo);

  const payload = {
    config_id: config.id,
    entity_type: config.entity_type,
    entity_id: config.entity_id,
    entity_name: entityName || config.titulo_modulo || 'Reserva ThakiGo',
    user_id: userId,
    package_id: pkg?.id || null,
    package_name: pkg?.nombre || 'Reserva General',
    slot_id: slot?.id || null,
    booking_profile: config.booking_profile,
    codigo,
    fecha_inicio: fechaInicio,
    fecha_fin: config.booking_profile === 'estadia_noches' ? fechaFin : null,
    hora_inicio: slot?.hora_inicio || null,
    adultos: safeAdults,
    ninos: safeChildren,
    cupos_reservados: cuposSolicitados,
    es_residente: Boolean(isResident && config.descuento_residente_activo),
    titular_nombre: holderName.trim(),
    titular_telefono: holderPhone.trim(),
    notas: (notas || '').trim(),
    total_clp: totalClp,
    estado,
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'No se pudo registrar la reserva.');
  }

  return data;
}

export async function getUserBookings(userId, { entityType = null, entityId = null } = {}) {
  if (!userId) return [];
  let query = supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (entityType) query = query.eq('entity_type', entityType);
  if (entityId) query = query.eq('entity_id', entityId);

  const { data, error } = await query;
  if (error) throw new Error(error.message || 'No se pudieron cargar tus reservas.');
  return data || [];
}

export async function cancelBooking(bookingId) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ estado: 'cancelada' })
    .eq('id', bookingId)
    .neq('estado', 'cancelada')
    .select('*')
    .single();

  if (error) throw new Error(error.message || 'No se pudo cancelar la reserva.');
  return data;
}

/* ── Funciones de Administración ─────────────────────────────────────────── */

export async function getAdminCatalogEntities(entityType) {
  const meta = BOOKING_ENTITY_TYPES.find((t) => t.id === entityType) || BOOKING_ENTITY_TYPES[0];
  const [{ data: entities, error: entErr }, { data: configs, error: cfgErr }] = await Promise.all([
    supabase.from(meta.table).select('id, nombre, imagen_url, activo').order('nombre', { ascending: true }),
    supabase.from('booking_configs').select('*').eq('entity_type', meta.id),
  ]);

  if (entErr || cfgErr) {
    throw new Error('No se pudieron cargar las entidades para configurar reservas.');
  }

  const cfgMap = new Map((configs || []).map((c) => [c.entity_id, c]));
  return (entities || []).map((e) => ({
    ...e,
    entity_type: meta.id,
    booking_config: cfgMap.get(e.id) || null,
  }));
}

export async function getAdminBookingConfigDetails(configId) {
  if (!configId) return { packages: [], slots: [] };
  const [{ data: packages }, { data: slots }] = await Promise.all([
    supabase.from('booking_packages').select('*').eq('config_id', configId).order('orden', { ascending: true }),
    supabase.from('booking_slots').select('*').eq('config_id', configId).order('orden', { ascending: true }),
  ]);
  return { packages: packages || [], slots: slots || [] };
}

export async function upsertBookingConfig(config) {
  const payload = {
    entity_type: config.entity_type,
    entity_id: config.entity_id,
    activo: Boolean(config.activo),
    booking_profile: config.booking_profile || 'tour_horario',
    pricing_mode: config.pricing_mode || 'calculado',
    confirmation_mode: config.confirmation_mode || 'inmediata',
    titulo_modulo: config.titulo_modulo?.trim() || 'Reserva tu experiencia',
    subtitulo_modulo: config.subtitulo_modulo?.trim() || '',
    codigo_prefijo: (config.codigo_prefijo || 'THK').toUpperCase().slice(0, 4),
    badge_ubicacion: config.badge_ubicacion?.trim() || '',
    badge_extra: config.badge_extra?.trim() || '',
    nota_logistica_titulo: config.nota_logistica_titulo?.trim() || '',
    nota_logistica_detalle: config.nota_logistica_detalle?.trim() || '',
    estado_operacion: config.estado_operacion?.trim() || 'Disponible Hoy',
    descuento_residente_activo: Boolean(config.descuento_residente_activo),
    descuento_residente_pct: Math.min(100, Math.max(0, Number(config.descuento_residente_pct || 0))),
    highlights: Array.isArray(config.highlights) ? config.highlights : [],
    galeria: Array.isArray(config.galeria) ? config.galeria : [],
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('booking_configs')
    .upsert(payload, { onConflict: 'entity_type,entity_id' })
    .select('*')
    .single();

  if (error) throw new Error(error.message || 'No se pudo guardar la configuración de reservas.');
  return data;
}

export async function saveBookingPackage(pkg) {
  const payload = {
    config_id: pkg.config_id,
    nombre: pkg.nombre?.trim(),
    descripcion: pkg.descripcion?.trim() || '',
    pricing_unit: pkg.pricing_unit || 'por_persona',
    precio_adulto: Math.max(0, Number(pkg.precio_adulto || 0)),
    precio_nino: Math.max(0, Number(pkg.precio_nino || 0)),
    capacidad_maxima: Math.max(1, Number(pkg.capacidad_maxima || 10)),
    orden: Number(pkg.orden || 1),
    activo: pkg.activo !== false,
  };

  const query = pkg.id
    ? supabase.from('booking_packages').update(payload).eq('id', pkg.id).select('*').single()
    : supabase.from('booking_packages').insert(payload).select('*').single();

  const { data, error } = await query;
  if (error) throw new Error(error.message || 'No se pudo guardar el servicio/modalidad.');
  return data;
}

export async function deleteBookingPackage(id) {
  const { error } = await supabase.from('booking_packages').delete().eq('id', id);
  if (error) throw new Error(error.message || 'No se pudo eliminar el servicio.');
}

export async function saveBookingSlot(slot) {
  const payload = {
    config_id: slot.config_id,
    hora_inicio: slot.hora_inicio?.trim(),
    capacidad_base: Math.max(1, Number(slot.capacidad_base || 10)),
    orden: Number(slot.orden || 1),
    activo: slot.activo !== false,
  };

  const query = slot.id
    ? supabase.from('booking_slots').update(payload).eq('id', slot.id).select('*').single()
    : supabase.from('booking_slots').insert(payload).select('*').single();

  const { data, error } = await query;
  if (error) throw new Error(error.message || 'No se pudo guardar el bloque horario.');
  return data;
}

export async function deleteBookingSlot(id) {
  const { error } = await supabase.from('booking_slots').delete().eq('id', id);
  if (error) throw new Error(error.message || 'No se pudo eliminar el bloque horario.');
}

export async function getAdminBookings({ entityType = '', estado = '', fecha = '' } = {}) {
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(120);

  if (entityType) query = query.eq('entity_type', entityType);
  if (estado) query = query.eq('estado', estado);
  if (fecha) query = query.eq('fecha_inicio', fecha);

  const { data, error } = await query;
  if (error) throw new Error(error.message || 'No se pudieron cargar las reservas.');
  return data || [];
}

export async function updateBookingStatus(bookingId, nuevoEstado) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ estado: nuevoEstado })
    .eq('id', bookingId)
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'No se pudo actualizar el estado de la reserva.');
  return data;
}
