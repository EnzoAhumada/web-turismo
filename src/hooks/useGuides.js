import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GUIDE_SPECIALTIES,
  createGuideApplication,
  createGuideBookingRequest,
  getGuides,
} from '../services/guides.service';

export function useGuides() {
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [specialty, setSpecialty] = useState('Todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadGuides = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await getGuides({ specialty, search });
      setGuides(list);
    } catch (err) {
      setError(err?.message || 'No se pudieron cargar los guías turísticos.');
    } finally {
      setLoading(false);
    }
  }, [specialty, search]);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  async function submitBookingRequest({ guide, fecha, personas, telefono, notas }) {
    if (!user?.id) {
      setFeedback({
        type: 'info',
        message: 'Inicia sesión para enviar una solicitud directa al guía.',
      });
      return false;
    }
    try {
      await createGuideBookingRequest({
        guideId: guide.id,
        userId: user.id,
        fecha,
        personas,
        telefono,
        notas,
      });
      setFeedback({
        type: 'success',
        message: `Solicitud enviada a ${guide.nombre}. Te contactará vía WhatsApp.`,
      });
      return true;
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo enviar tu solicitud.',
      });
      return false;
    }
  }

  async function submitGuideApplication(formValues) {
    if (!user?.id) {
      setFeedback({
        type: 'info',
        message: 'Inicia sesión para postular como guía local certificado.',
      });
      return false;
    }
    try {
      const created = await createGuideApplication({
        ...formValues,
        userId: user.id,
      });
      setGuides((prev) => [created, ...prev]);
      setFeedback({
        type: 'success',
        message: `Perfil de guía de ${created.nombre} publicado en el directorio.`,
      });
      return true;
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'No se pudo publicar tu postulación.',
      });
      return false;
    }
  }

  return {
    guides,
    specialties: GUIDE_SPECIALTIES,
    specialty,
    setSpecialty,
    search,
    setSearch,
    loading,
    error,
    feedback,
    setFeedback,
    submitBookingRequest,
    submitGuideApplication,
  };
}
