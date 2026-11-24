import { useState, useEffect, useCallback } from 'react';
import {
  getAstronomyAdminData,
  saveAstronomyCondition,
  deleteAstronomyCondition,
  saveAstronomySchedule,
  deleteAstronomySchedule,
  saveAstronomyResource,
  deleteAstronomyResource,
  togglePlaceAstronomical,
} from '../../../services/astronomy.service';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import LoadingState from '../../../components/ui/LoadingState';
import FeedbackBanner from '../../../components/ui/FeedbackBanner';
import './AstronomyAdminPage.css';

const ICON_OPTIONS = [
  { value: 'sun', label: 'Sol / Cielo' },
  { value: 'eye', label: 'Visibilidad' },
  { value: 'moon', label: 'Fase Lunar' },
  { value: 'moon-star', label: 'Estrellas' },
  { value: 'sparkles', label: 'Cielo despejado' },
  { value: 'clock', label: 'Horario' },
  { value: 'lightbulb', label: 'Consejo' },
  { value: 'shirt', label: 'Abrigo' },
  { value: 'flashlight', label: 'Linterna' },
];

export default function AstronomyAdminPage() {
  const [data, setData] = useState({ conditions: [], schedules: [], resources: [], places: [] });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [feedback, setFeedback] = useState(null);

  const [newCondition, setNewCondition] = useState({
    etiqueta: '',
    valor: '',
    icono: 'sun',
    orden: 4,
  });
  const [newSchedule, setNewSchedule] = useState({
    hora: '',
    etiqueta: '',
    icono: 'moon-star',
    calidad: 'best',
    orden: 4,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAstronomyAdminData();
      setData(result);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateLocalList(key, id, field, value) {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }

  async function handleSaveCondition(e, item) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingId(item.id || 'new-cond');
    setFeedback(null);
    try {
      await saveAstronomyCondition(item);
      setFeedback({ type: 'success', message: 'Condición astronómica guardada correctamente.' });
      if (!item.id) {
        setNewCondition({ etiqueta: '', valor: '', icono: 'sun', orden: data.conditions.length + 2 });
      }
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingId('');
    }
  }

  async function handleDeleteCondition(e, id) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingId(id);
    try {
      await deleteAstronomyCondition(id);
      setFeedback({ type: 'success', message: 'Condición eliminada.' });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingId('');
    }
  }

  async function handleSaveSchedule(e, item) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingId(item.id || 'new-sched');
    setFeedback(null);
    try {
      await saveAstronomySchedule(item);
      setFeedback({ type: 'success', message: 'Horario astronómico guardado correctamente.' });
      if (!item.id) {
        setNewSchedule({ hora: '', etiqueta: '', icono: 'moon-star', calidad: 'best', orden: data.schedules.length + 2 });
      }
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingId('');
    }
  }

  async function handleDeleteSchedule(e, id) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingId(id);
    try {
      await deleteAstronomySchedule(id);
      setFeedback({ type: 'success', message: 'Horario eliminado.' });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingId('');
    }
  }

  async function handleSaveResource(e, item) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingId(item.id);
    try {
      await saveAstronomyResource(item);
      setFeedback({ type: 'success', message: 'Recomendación astronómica actualizada.' });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingId('');
    }
  }

  async function handleDeleteResource(e, id) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingId(id);
    try {
      await deleteAstronomyResource(id);
      setFeedback({ type: 'success', message: 'Recurso eliminado.' });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingId('');
    }
  }

  async function handleTogglePlace(e, place) {
    if (e && e.preventDefault) e.preventDefault();
    setSavingId(place.id);
    try {
      await togglePlaceAstronomical(place.id, !place.es_astronomico);
      setFeedback({
        type: 'success',
        message: !place.es_astronomico
          ? `${place.nombre} ahora aparece en la Ruta Astronómica.`
          : `${place.nombre} fue retirado de la Ruta Astronómica.`,
      });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingId('');
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-astro-main">
        <header className="admin-astro-header">
          <div>
            <h1 className="admin-astro-title">Turismo Astronómico</h1>
            <p className="admin-astro-sub">
              Administra las condiciones actuales fijas, mejores horarios y lugares destacados de la Ruta Astronómica.
            </p>
          </div>
        </header>

        {feedback && (
          <FeedbackBanner
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        {loading ? (
          <LoadingState message="Cargando configuración astronómica..." />
        ) : (
          <div className="admin-astro-grid">
            <section className="admin-astro-card">
              <div className="admin-astro-card__head">
                <Icon name="moon-star" size={20} />
                <h2>Condiciones actuales del cielo</h2>
              </div>

              <div className="admin-astro-list">
                {data.conditions.map((item) => (
                  <form
                    key={item.id}
                    className="admin-astro-row"
                    onSubmit={(e) => handleSaveCondition(e, item)}
                  >
                    <input
                      type="text"
                      value={item.etiqueta || ''}
                      onChange={(e) => updateLocalList('conditions', item.id, 'etiqueta', e.target.value)}
                      placeholder="Etiqueta (ej: Cielo)"
                      required
                    />
                    <input
                      type="text"
                      value={item.valor || ''}
                      onChange={(e) => updateLocalList('conditions', item.id, 'valor', e.target.value)}
                      placeholder="Valor (ej: Despejado)"
                      required
                    />
                    <select
                      value={item.icono || 'sun'}
                      onChange={(e) => updateLocalList('conditions', item.id, 'icono', e.target.value)}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="admin-astro-row__actions">
                      <Button type="submit" variant="primary" size="sm" disabled={savingId === item.id}>
                        Guardar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleDeleteCondition(e, item.id)}
                        disabled={savingId === item.id}
                      >
                        Quitar
                      </Button>
                    </div>
                  </form>
                ))}

                <form
                  className="admin-astro-row admin-astro-row--new"
                  onSubmit={(e) => handleSaveCondition(e, newCondition)}
                >
                  <input
                    type="text"
                    value={newCondition.etiqueta}
                    onChange={(e) => setNewCondition((p) => ({ ...p, etiqueta: e.target.value }))}
                    placeholder="Nueva etiqueta (ej: Humedad)"
                    required
                  />
                  <input
                    type="text"
                    value={newCondition.valor}
                    onChange={(e) => setNewCondition((p) => ({ ...p, valor: e.target.value }))}
                    placeholder="Valor (ej: Baja 24%)"
                    required
                  />
                  <select
                    value={newCondition.icono}
                    onChange={(e) => setNewCondition((p) => ({ ...p, icono: e.target.value }))}
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <Button type="submit" variant="gold" size="sm" disabled={savingId === 'new-cond'}>
                    + Agregar
                  </Button>
                </form>
              </div>
            </section>

            <section className="admin-astro-card">
              <div className="admin-astro-card__head">
                <Icon name="clock" size={20} />
                <h2>Mejores horarios de observación</h2>
              </div>

              <div className="admin-astro-list">
                {data.schedules.map((item) => (
                  <form
                    key={item.id}
                    className="admin-astro-row"
                    onSubmit={(e) => handleSaveSchedule(e, item)}
                  >
                    <input
                      type="text"
                      value={item.hora || ''}
                      onChange={(e) => updateLocalList('schedules', item.id, 'hora', e.target.value)}
                      placeholder="Rango (ej: 20:00 – 02:00)"
                      required
                    />
                    <input
                      type="text"
                      value={item.etiqueta || ''}
                      onChange={(e) => updateLocalList('schedules', item.id, 'etiqueta', e.target.value)}
                      placeholder="Descripción"
                      required
                    />
                    <select
                      value={item.calidad || 'good'}
                      onChange={(e) => updateLocalList('schedules', item.id, 'calidad', e.target.value)}
                    >
                      <option value="best">Óptimo</option>
                      <option value="good">Bueno</option>
                    </select>
                    <div className="admin-astro-row__actions">
                      <Button type="submit" variant="primary" size="sm" disabled={savingId === item.id}>
                        Guardar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleDeleteSchedule(e, item.id)}
                        disabled={savingId === item.id}
                      >
                        Quitar
                      </Button>
                    </div>
                  </form>
                ))}

                <form
                  className="admin-astro-row admin-astro-row--new"
                  onSubmit={(e) => handleSaveSchedule(e, newSchedule)}
                >
                  <input
                    type="text"
                    value={newSchedule.hora}
                    onChange={(e) => setNewSchedule((p) => ({ ...p, hora: e.target.value }))}
                    placeholder="Nuevo horario (ej: 23:00 – 01:30)"
                    required
                  />
                  <input
                    type="text"
                    value={newSchedule.etiqueta}
                    onChange={(e) => setNewSchedule((p) => ({ ...p, etiqueta: e.target.value }))}
                    placeholder="Etiqueta (ej: Vía Láctea)"
                    required
                  />
                  <select
                    value={newSchedule.calidad}
                    onChange={(e) => setNewSchedule((p) => ({ ...p, calidad: e.target.value }))}
                  >
                    <option value="best">Óptimo</option>
                    <option value="good">Bueno</option>
                  </select>
                  <Button type="submit" variant="gold" size="sm" disabled={savingId === 'new-sched'}>
                    + Agregar
                  </Button>
                </form>
              </div>
            </section>

            <section className="admin-astro-card">
              <div className="admin-astro-card__head">
                <Icon name="map-pin" size={20} />
                <h2>Lugares recomendados en Ruta Astronómica</h2>
              </div>
              <div className="admin-astro-places">
                {data.places.map((place) => (
                  <div key={place.id} className="admin-astro-place-row">
                    <div>
                      <strong>{place.nombre}</strong>
                      <p>{place.subtitulo || 'Sitio turístico de Andacollo'}</p>
                    </div>
                    <Button
                      type="button"
                      variant={place.es_astronomico ? 'gold' : 'outline'}
                      size="sm"
                      onClick={(e) => handleTogglePlace(e, place)}
                      disabled={savingId === place.id}
                    >
                      {place.es_astronomico ? 'Destacado en Astronomía' : 'Agregar a Ruta'}
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-astro-card">
              <div className="admin-astro-card__head">
                <Icon name="lightbulb" size={20} />
                <h2>Consejos y equipamiento recomendado</h2>
              </div>
              <div className="admin-astro-list">
                {data.resources.map((res) => (
                  <form
                    key={res.id}
                    className="admin-astro-row admin-astro-row--resource"
                    onSubmit={(e) => handleSaveResource(e, res)}
                  >
                    <span className="admin-astro-tag">
                      {res.tipo === 'consejo' ? 'Consejo' : 'Equipo'}
                    </span>
                    <input
                      type="text"
                      value={res.contenido || ''}
                      onChange={(e) => updateLocalList('resources', res.id, 'contenido', e.target.value)}
                      required
                    />
                    <div className="admin-astro-row__actions">
                      <Button type="submit" variant="primary" size="sm" disabled={savingId === res.id}>
                        Guardar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleDeleteResource(e, res.id)}
                        disabled={savingId === res.id}
                      >
                        Quitar
                      </Button>
                    </div>
                  </form>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
