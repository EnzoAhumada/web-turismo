import { useState, useEffect, useCallback } from 'react';
import {
  GUIDE_SPECIALTIES,
  deleteGuideAdmin,
  getAdminGuideRequests,
  getGuides,
  saveGuideAdmin,
  updateGuideRequestStatus,
} from '../../../services/guides.service';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import LoadingState from '../../../components/ui/LoadingState';
import FeedbackBanner from '../../../components/ui/FeedbackBanner';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import '../../../components/admin/AdminCrud.css';
import './GuidesAdminPage.css';

const EMPTY_GUIDE = {
  id: null,
  nombre: '',
  especialidad: 'Astroturismo & Cielo Profundo',
  certificacion: 'SERNATUR Sello R · Guía Local',
  experiencia: '5 años de experiencia',
  idiomas: 'Español',
  sectores: 'Cerro Yahuín, Observatorio Collowara',
  tarifa_referencial: '$18.000 CLP / persona',
  equipamiento: '',
  biografia: '',
  itinerario: '20:30 · Encuentro en Plaza de Andacollo\n21:15 · Actividad principal\n23:00 · Retorno',
  verificado: true,
  activo: true,
};

export default function GuidesAdminPage() {
  const [tab, setTab] = useState('guides');
  const [guides, setGuides] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_GUIDE);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [gList, rList] = await Promise.all([
        getGuides({ includeInactive: true }),
        getAdminGuideRequests(),
      ]);
      setGuides(gList);
      setRequests(rList);
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al cargar guías.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  function startEdit(guide) {
    setForm({
      ...guide,
      idiomas: (guide.idiomas || []).join(', '),
      sectores: (guide.sectores || []).join(', '),
      itinerario: Array.isArray(guide.itinerario) ? guide.itinerario.join('\n') : '',
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const saved = await saveGuideAdmin(form);
      setGuides((prev) => {
        const exists = prev.some((g) => g.id === saved.id);
        return exists ? prev.map((g) => (g.id === saved.id ? saved : g)) : [saved, ...prev];
      });
      setForm(EMPTY_GUIDE);
      setFeedback({ type: 'success', message: `Guía ${saved.nombre} guardado correctamente.` });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'No se pudo guardar el guía.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(guide) {
    try {
      const saved = await saveGuideAdmin({ ...guide, activo: !guide.activo });
      setGuides((prev) => prev.map((g) => (g.id === saved.id ? saved : g)));
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al cambiar estado.' });
    }
  }

  async function handleRequestStatus(reqId, estado) {
    try {
      const updated = await updateGuideRequestStatus(reqId, estado);
      setRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, estado: updated.estado } : r))
      );
      setFeedback({ type: 'success', message: `Solicitud actualizada a ${estado}.` });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al actualizar solicitud.' });
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-page-head">
          <div>
            <h1>Gestión de Guías Turísticos</h1>
            <p>Administra guías locales certificados, postulaciones y solicitudes directas.</p>
          </div>
          <div className="guides-admin-tabs">
            <button
              type="button"
              className={`guides-admin-tab ${tab === 'guides' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setTab('guides');
              }}
            >
              Directorio ({guides.length})
            </button>
            <button
              type="button"
              className={`guides-admin-tab ${tab === 'requests' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setTab('requests');
              }}
            >
              Solicitudes ({requests.length})
            </button>
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
          <LoadingState message="Cargando gestión de guías..." />
        ) : tab === 'guides' ? (
          <div className="guides-admin-layout">
            <form className="guides-admin-card" onSubmit={handleSave}>
              <h2>{form.id ? `Editar: ${form.nombre}` : 'Nuevo Guía Certificado'}</h2>
              <div className="guides-admin-grid-2">
                <label>
                  <span>Nombre completo</span>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  />
                </label>
                <label>
                  <span>Especialidad</span>
                  <select
                    value={form.especialidad}
                    onChange={(e) => setForm((f) => ({ ...f, especialidad: e.target.value }))}
                  >
                    {GUIDE_SPECIALTIES.filter((s) => s !== 'Todos').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="guides-admin-grid-2">
                <label>
                  <span>Certificación</span>
                  <input
                    type="text"
                    required
                    value={form.certificacion}
                    onChange={(e) => setForm((f) => ({ ...f, certificacion: e.target.value }))}
                  />
                </label>
                <label>
                  <span>Tarifa referencial</span>
                  <input
                    type="text"
                    required
                    value={form.tarifa_referencial}
                    onChange={(e) => setForm((f) => ({ ...f, tarifa_referencial: e.target.value }))}
                  />
                </label>
              </div>
              <div className="guides-admin-grid-2">
                <label>
                  <span>Sectores (coma)</span>
                  <input
                    type="text"
                    value={form.sectores}
                    onChange={(e) => setForm((f) => ({ ...f, sectores: e.target.value }))}
                  />
                </label>
                <label>
                  <span>Idiomas (coma)</span>
                  <input
                    type="text"
                    value={form.idiomas}
                    onChange={(e) => setForm((f) => ({ ...f, idiomas: e.target.value }))}
                  />
                </label>
              </div>
              <label>
                <span>Equipamiento incluido</span>
                <input
                  type="text"
                  value={form.equipamiento}
                  onChange={(e) => setForm((f) => ({ ...f, equipamiento: e.target.value }))}
                />
              </label>
              <label>
                <span>Biografía</span>
                <textarea
                  rows="2"
                  required
                  value={form.biografia}
                  onChange={(e) => setForm((f) => ({ ...f, biografia: e.target.value }))}
                />
              </label>
              <label>
                <span>Itinerario (una línea por paso)</span>
                <textarea
                  rows="3"
                  value={form.itinerario}
                  onChange={(e) => setForm((f) => ({ ...f, itinerario: e.target.value }))}
                />
              </label>
              <div className="guides-admin-actions">
                {form.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setForm(EMPTY_GUIDE);
                    }}
                  >
                    Cancelar edición
                  </Button>
                )}
                <Button type="submit" variant="gold" disabled={saving}>
                  {saving ? 'Guardando...' : form.id ? 'Actualizar Guía' : 'Crear Guía'}
                </Button>
              </div>
            </form>

            <div className="guides-admin-card">
              <h2>Guías Registrados</h2>
              <div className="guides-admin-list">
                {guides.map((g) => (
                  <div key={g.id} className="guides-admin-row">
                    <div>
                      <strong>{g.nombre}</strong>
                      <p>
                        {g.especialidad} · {g.tarifa_referencial} ·{' '}
                        <b>{g.activo ? 'Activo' : 'Oculto'}</b>
                      </p>
                    </div>
                    <div className="guides-admin-row__btns">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          startEdit(g);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleActive(g);
                        }}
                      >
                        {g.activo ? 'Ocultar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteTarget(g);
                        }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="guides-admin-card">
            <h2>Solicitudes de Reserva Directa</h2>
            <div className="guides-admin-list">
              {requests.map((r) => (
                <div key={r.id} className="guides-admin-row">
                  <div>
                    <strong>{r.tour_guides?.nombre || 'Guía'}</strong>
                    <p>
                      Fecha: {r.fecha} · {r.personas} personas · Contacto: {r.telefono} · Estado:{' '}
                      <b>{r.estado}</b>
                    </p>
                  </div>
                  <div className="guides-admin-row__btns">
                    {r.estado !== 'confirmada' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRequestStatus(r.id, 'confirmada');
                        }}
                      >
                        Confirmar
                      </button>
                    )}
                    {r.estado !== 'cancelada' && (
                      <button
                        type="button"
                        className="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRequestStatus(r.id, 'cancelada');
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <p className="guides-admin-muted">Aún no hay solicitudes de reserva para guías.</p>
              )}
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          title="Eliminar guía turístico"
          message={
            deleteTarget ? `¿Eliminar permanentemente a ${deleteTarget.nombre} del directorio?` : ''
          }
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          danger
          onConfirm={async () => {
            const target = deleteTarget;
            setDeleteTarget(null);
            if (target) {
              await deleteGuideAdmin(target.id);
              setGuides((prev) => prev.filter((g) => g.id !== target.id));
              setFeedback({ type: 'success', message: 'Guía eliminado.' });
            }
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      </main>
    </div>
  );
}
