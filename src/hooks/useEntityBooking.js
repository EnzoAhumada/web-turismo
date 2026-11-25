import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  calculateBookingTotal,
  cancelBooking,
  computeNights,
  createEntityBooking,
  getEntityBookingSetup,
  getSlotAvailability,
  getUserBookings,
} from '../services/bookings.service';

function getDefaultDate(daysAhead = 1) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export function useEntityBooking(entityType, entityId, entityName) {
  const { user, profile } = useAuth();
  const [setup, setSetup] = useState(null);
  const [slotsWithAvailability, setSlotsWithAvailability] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [fechaInicio, setFechaInicio] = useState(getDefaultDate(1));
  const [fechaFin, setFechaFin] = useState(getDefaultDate(2));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isResident, setIsResident] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [holderPhone, setHolderPhone] = useState('+56 9 ');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (profile) {
      const fullName = `${profile.nombre || ''} ${profile.apellido || ''}`.trim();
      if (fullName && !holderName) setHolderName(fullName);
    }
  }, [profile, holderName]);

  const loadSetup = useCallback(async () => {
    if (!entityType || !entityId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getEntityBookingSetup(entityType, entityId);
      setSetup(data);
      if (data?.packages?.length) {
        setSelectedPackageId((prev) => prev || data.packages[0].id);
      }
      if (data?.slots?.length) {
        setSelectedSlotId((prev) => prev || data.slots[0].id);
      }
      if (user?.id && data) {
        const list = await getUserBookings(user.id, { entityType, entityId });
        setUserBookings(list);
      } else {
        setUserBookings([]);
      }
    } catch {
      setSetup(null);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, user?.id]);

  useEffect(() => {
    loadSetup();
  }, [loadSetup]);

  const refreshAvailability = useCallback(async () => {
    if (!setup?.config?.id || !setup?.slots?.length) {
      setSlotsWithAvailability([]);
      return;
    }
    const avail = await getSlotAvailability(setup.config.id, fechaInicio, setup.slots);
    setSlotsWithAvailability(avail);
  }, [setup, fechaInicio]);

  useEffect(() => {
    refreshAvailability();
  }, [refreshAvailability]);

  const selectedPackage = useMemo(
    () => setup?.packages?.find((p) => p.id === selectedPackageId) || setup?.packages?.[0] || null,
    [setup, selectedPackageId]
  );

  const selectedSlot = useMemo(
    () =>
      slotsWithAvailability.find((s) => s.id === selectedSlotId) ||
      slotsWithAvailability[0] ||
      null,
    [slotsWithAvailability, selectedSlotId]
  );

  const nights = useMemo(
    () => (setup?.config?.booking_profile === 'estadia_noches' ? computeNights(fechaInicio, fechaFin) : 1),
    [setup?.config?.booking_profile, fechaInicio, fechaFin]
  );

  const estimatedTotal = useMemo(
    () =>
      calculateBookingTotal({
        config: setup?.config,
        pkg: selectedPackage,
        adults,
        children,
        nights,
        isResident,
      }),
    [setup?.config, selectedPackage, adults, children, nights, isResident]
  );

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!setup?.config) return;
    if (!user?.id) {
      setFeedback({
        type: 'info',
        message: 'Inicia sesión para confirmar tu reserva y emitir tu pase.',
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const created = await createEntityBooking({
        config: setup.config,
        entityName,
        userId: user.id,
        pkg: selectedPackage,
        slot: selectedSlot,
        fechaInicio,
        fechaFin,
        adults,
        children,
        isResident,
        holderName,
        holderPhone,
        notas,
        availableSpots: selectedSlot ? selectedSlot.disponibles : undefined,
      });

      setUserBookings((prev) => [created, ...prev]);
      setNotas('');
      await refreshAvailability();

      setFeedback({
        type: 'success',
        message:
          created.estado === 'pendiente'
            ? `Solicitud ${created.codigo} enviada y pendiente de confirmación.`
            : `Pase ${created.codigo} emitido y confirmado correctamente.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo completar la reserva.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancelBooking(bookingId) {
    try {
      const updated = await cancelBooking(bookingId);
      setUserBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, estado: updated.estado } : b))
      );
      await refreshAvailability();
      setFeedback({
        type: 'success',
        message: `Reserva ${updated.codigo} cancelada y cupos liberados.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo cancelar la reserva.',
      });
    }
  }

  function handleCopyCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setFeedback({
      type: 'success',
      message: `Código ${code} copiado al portapapeles.`,
    });
  }

  return {
    config: setup?.config || null,
    packages: setup?.packages || [],
    slots: slotsWithAvailability,
    userBookings,
    loading,
    submitting,
    feedback,
    setFeedback,
    selectedPackage,
    selectedPackageId,
    setSelectedPackageId,
    selectedSlot,
    selectedSlotId,
    setSelectedSlotId,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    nights,
    adults,
    setAdults,
    children,
    setChildren,
    isResident,
    setIsResident,
    holderName,
    setHolderName,
    holderPhone,
    setHolderPhone,
    notas,
    setNotas,
    estimatedTotal,
    handleSubmit,
    handleCancelBooking,
    handleCopyCode,
  };
}
