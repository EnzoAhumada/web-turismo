import { useState, useEffect, useCallback } from 'react';
import {
  BOOKING_ENTITY_TYPES,
  BOOKING_PROFILES,
  CONFIRMATION_MODES,
  PRICING_MODES,
  deleteBookingPackage,
  deleteBookingSlot,
  getAdminBookingConfigDetails,
  getAdminBookings,
  getAdminCatalogEntities,
  saveBookingPackage,
  saveBookingSlot,
  updateBookingStatus,
  upsertBookingConfig,
} from '../../../services/bookings.service';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import LoadingState from '../../../components/ui/LoadingState';
import FeedbackBanner from '../../../components/ui/FeedbackBanner';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import '../../../components/admin/AdminCrud.css';
import './BookingsAdminPage.css';

const DEFAULT_CONFIG = {
  activo: false,
  booking_profile: 'tour_horario',
  pricing_mode: 'calculado',
  confirmation_mode: 'inmediata',
  titulo_modulo: 'Reserva tu experiencia',
  subtitulo_modulo: '',
  codigo_prefijo: 'THK',
  badge_ubicacion: '',
  badge_extra: '',
  nota_logistica_titulo: '',
  nota_logistica_detalle: '',
  estado_operacion: 'Disponible Hoy',
  descuento_residente_activo: false,
  descuento_residente_pct: 20,
  highlights: [],
  galeria: [],
};

export default function BookingsAdminPage() {
  const [activeTab, setActiveTab] = useState('config');
  const [entityType, setEntityType] = useState('lugar');
  const [entities, setEntities] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [configForm, setConfigForm] = useState(DEFAULT_CONFIG);
  const [packages, setPackages] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [newPkg, setNewPkg] = useState({
    nombre: '',
    descripcion: '',
    pricing_unit: 'por_persona',
    precio_adulto: 15000,
    precio_nino: 8000,
    capacidad_maxima: 10,
  });

  const [newSlot, setNewSlot] = useState({
    hora_inicio: '21:00',
    capacidad_base: 12,
  });

  const [newHighlight, setNewHighlight] = useState({
    title: '',
    subtitle: '',
    accent: 'gold',
  });

  // Tab 2: Reservas recibidas
  const [bookings, setBookings] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState(null);

  const loadEntities = useCallback(async (typeToLoad) => {
    setLoading(true);
    try {
      const list = await getAdminCatalogEntities(typeToLoad);
      setEntities(list);
      const preferred =
        list.find((e) => e.booking_config?.activo) || list[0] || null;
      if (preferred) {
        setSelectedEntityId(preferred.id);
      } else {
        setSelectedEntityId('');
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al cargar entidades.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntities(entityType);
  }, [entityType, loadEntities]);

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || null;

  useEffect(() => {
    let active = true;
    async function syncSelected() {
      if (!selectedEntity) {
        setConfigForm(DEFAULT_CONFIG);
        setPackages([]);
        setSlots([]);
        return;
      }
      const cfg = selectedEntity.booking_config;
      if (cfg) {
        setConfigForm({
          ...DEFAULT_CONFIG,
          ...cfg,
          highlights: Array.isArray(cfg.highlights) ? cfg.highlights : [],
          galeria: Array.isArray(cfg.galeria) ? cfg.galeria : [],
        });
        const details = await getAdminBookingConfigDetails(cfg.id);
        if (active) {
          setPackages(details.packages);
          setSlots(details.slots);
        }
      } else {
        const defaultProfile =
          entityType === 'restaurante'
            ? 'mesa_comida'
            : entityType === 'alojamiento'
              ? 'estadia_noches'
              : entityType === 'lugar'
                ? 'tour_horario'
                : 'servicio_general';
        setConfigForm({
          ...DEFAULT_CONFIG,
          entity_type: entityType,
          entity_id: selectedEntity.id,
          booking_profile: defaultProfile,
          pricing_mode: entityType === 'restaurante' ? 'sin_costo' : 'calculado',
          confirmation_mode: entityType === 'lugar' ? 'inmediata' : 'pendiente',
          titulo_modulo: `Reservar en ${selectedEntity.nombre}`,
          codigo_prefijo: selectedEntity.nombre.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'THK',
        });
        setPackages([]);
        setSlots([]);
      }
    }
    syncSelected();
    return () => {
      active = false;
    };
  }, [selectedEntity, entityType]);

  const loadBookings = useCallback(async () => {
    try {
      const rows = await getAdminBookings({
        entityType: filterType,
        estado: filterStatus,
        fecha: filterDate,
      });
      setBookings(rows);
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al cargar reservas.' });
    }
  }, [filterType, filterStatus, filterDate]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    }
  }, [activeTab, loadBookings]);

  async function handleSaveConfig(e) {
    e.preventDefault();
    if (!selectedEntity) return;
    setSaving(true);
    setFeedback(null);
    try {
      const saved = await upsertBookingConfig({
        ...configForm,
        entity_type: entityType,
        entity_id: selectedEntity.id,
      });
      setEntities((prev) =>
        prev.map((ent) =>
          ent.id === selectedEntity.id ? { ...ent, booking_config: saved } : ent
        )
      );
      setFeedback({
        type: 'success',
        message: `Configuración de reservas guardada para ${selectedEntity.nombre}.`,
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'No se pudo guardar.' });
    } finally {
      setSaving(false);
    }
  }

  async function ensureConfigId() {
    if (selectedEntity?.booking_config?.id) return selectedEntity.booking_config.id;
    const saved = await upsertBookingConfig({
      ...configForm,
      entity_type: entityType,
      entity_id: selectedEntity.id,
    });
    setEntities((prev) =>
      prev.map((ent) =>
        ent.id === selectedEntity.id ? { ...ent, booking_config: saved } : ent
      )
    );
    return saved.id;
  }

  async function handleAddPackage(e) {
    e.preventDefault();
    if (!selectedEntity || !newPkg.nombre.trim()) return;
    try {
      const configId = await ensureConfigId();
      const created = await saveBookingPackage({
        ...newPkg,
        config_id: configId,
        orden: packages.length + 1,
      });
      setPackages((prev) => [...prev, created]);
      setNewPkg({
        nombre: '',
        descripcion: '',
        pricing_unit: configForm.booking_profile === 'estadia_noches' ? 'por_noche' : 'por_persona',
        precio_adulto: 15000,
        precio_nino: 8000,
        capacidad_maxima: 10,
      });
      setFeedback({ type: 'success', message: 'Servicio/modalidad agregado.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al agregar servicio.' });
    }
  }

  async function handleDeletePackage(pkgId) {
    try {
      await deleteBookingPackage(pkgId);
      setPackages((prev) => prev.filter((p) => p.id !== pkgId));
      setFeedback({ type: 'success', message: 'Servicio eliminado.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al eliminar servicio.' });
    }
  }

  async function handleAddSlot(e) {
    e.preventDefault();
    if (!selectedEntity || !newSlot.hora_inicio.trim()) return;
    try {
      const configId = await ensureConfigId();
      const created = await saveBookingSlot({
        ...newSlot,
        config_id: configId,
        orden: slots.length + 1,
      });
      setSlots((prev) => [...prev, created]);
      setFeedback({ type: 'success', message: `Bloque ${created.hora_inicio} hrs agregado.` });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al agregar horario.' });
    }
  }

  async function handleDeleteSlot(slotId) {
    try {
      await deleteBookingSlot(slotId);
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      setFeedback({ type: 'success', message: 'Bloque horario eliminado.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Error al eliminar horario.' });
    }
  }

  function handleAddHighlight(e) {
    e.preventDefault();
    if (!newHighlight.title.trim()) return;
    setConfigForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), { ...newHighlight }],
    }));
    setNewHighlight({ title: '', subtitle: '', accent: 'gold' });
  }

  function handleRemoveHighlight(idx) {
    setConfigForm((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx),
    }));
  }

  async function handleChangeBookingStatus(bookingId, nuevoEstado) {
    try {
      const updated = await updateBookingStatus(bookingId, nuevoEstado);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      setFeedback({
        type: 'success',
        message: `Reserva ${updated.codigo} actualizada a ${nuevoEstado}.`,
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'No se pudo actualizar.' });
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-page-head">
          <div>
            <h1>Gestión de Reservas Adaptativas</h1>
            <p>
              Activa reservas en cualquier lugar, restaurante, alojamiento, evento o experiencia y
              personaliza su perfil, servicios, precios y cupos.
            </p>
          </div>
          <div className="bookings-admin-tabs">
            <button
              type="button"
              className={`bookings-admin-tab ${activeTab === 'config' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('config');
              }}
            >
              Configurar Entidades
            </button>
            <button
              type="button"
              className={`bookings-admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('bookings');
              }}
            >
              Reservas Recibidas
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

        {activeTab === 'config' ? (
          <div className="bookings-admin-workspace">
            {/* Selector de tipo de catálogo y lista */}
            <aside className="bookings-admin-sidebar-list">
              <div className="bookings-type-pills">
                {BOOKING_ENTITY_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`bookings-type-pill ${entityType === t.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setEntityType(t.id);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <LoadingState message="Cargando catálogo..." />
              ) : (
                <div className="bookings-entity-list">
                  {entities.map((ent) => {
                    const isSelected = ent.id === selectedEntityId;
                    const isActive = Boolean(ent.booking_config?.activo);
                    return (
                      <button
                        key={ent.id}
                        type="button"
                        className={`bookings-entity-item ${isSelected ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedEntityId(ent.id);
                        }}
                      >
                        <div>
                          <strong>{ent.nombre}</strong>
                          <span>
                            {ent.booking_config?.booking_profile || 'Sin configurar'}
                          </span>
                        </div>
                        <span className={`bookings-dot ${isActive ? 'on' : 'off'}`}>
                          {isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>

            {/* Panel de configuración de la entidad seleccionada */}
            {selectedEntity && (
              <div className="bookings-admin-editor">
                <form className="bookings-admin-card" onSubmit={handleSaveConfig}>
                  <div className="bookings-admin-card__head">
                    <div>
                      <h2>{selectedEntity.nombre}</h2>
                      <p>Configura cómo se comporta el módulo de reservas en esta ficha pública.</p>
                    </div>
                    <label className="bookings-active-switch">
                      <input
                        type="checkbox"
                        checked={Boolean(configForm.activo)}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, activo: e.target.checked }))
                        }
                      />
                      <span>{configForm.activo ? 'Reservas Activas' : 'Desactivado'}</span>
                    </label>
                  </div>

                  <div className="bookings-form-grid-3">
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-profile">Perfil de Reserva</label>
                      <select
                        id="cfg-profile"
                        value={configForm.booking_profile}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, booking_profile: e.target.value }))
                        }
                      >
                        {BOOKING_PROFILES.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-pricing">Modo de Precio</label>
                      <select
                        id="cfg-pricing"
                        value={configForm.pricing_mode}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, pricing_mode: e.target.value }))
                        }
                      >
                        {PRICING_MODES.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-confirm">Modo de Confirmación</label>
                      <select
                        id="cfg-confirm"
                        value={configForm.confirmation_mode}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, confirmation_mode: e.target.value }))
                        }
                      >
                        {CONFIRMATION_MODES.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bookings-form-grid-2">
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-title">Título del módulo</label>
                      <input
                        id="cfg-title"
                        type="text"
                        value={configForm.titulo_modulo}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, titulo_modulo: e.target.value }))
                        }
                      />
                    </div>
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-prefix">Prefijo de código (ej. COL)</label>
                      <input
                        id="cfg-prefix"
                        type="text"
                        maxLength={4}
                        value={configForm.codigo_prefijo}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, codigo_prefijo: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="bookings-admin-field">
                    <label htmlFor="cfg-sub">Subtítulo / Instrucciones</label>
                    <input
                      id="cfg-sub"
                      type="text"
                      value={configForm.subtitulo_modulo}
                      onChange={(e) =>
                        setConfigForm((prev) => ({ ...prev, subtitulo_modulo: e.target.value }))
                      }
                    />
                  </div>

                  <div className="bookings-form-grid-3">
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-badge1">Insignia ubicación</label>
                      <input
                        id="cfg-badge1"
                        type="text"
                        value={configForm.badge_ubicacion}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, badge_ubicacion: e.target.value }))
                        }
                      />
                    </div>
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-badge2">Insignia destacada</label>
                      <input
                        id="cfg-badge2"
                        type="text"
                        value={configForm.badge_extra}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, badge_extra: e.target.value }))
                        }
                      />
                    </div>
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-status">Estado de atención</label>
                      <input
                        id="cfg-status"
                        type="text"
                        value={configForm.estado_operacion}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, estado_operacion: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="bookings-form-grid-2">
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-log-title">Nota logística / traslado (título)</label>
                      <input
                        id="cfg-log-title"
                        type="text"
                        value={configForm.nota_logistica_titulo}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, nota_logistica_titulo: e.target.value }))
                        }
                      />
                    </div>
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-log-detail">Nota logística (detalle)</label>
                      <input
                        id="cfg-log-detail"
                        type="text"
                        value={configForm.nota_logistica_detalle}
                        onChange={(e) =>
                          setConfigForm((prev) => ({ ...prev, nota_logistica_detalle: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="bookings-form-grid-2">
                    <label className="bookings-check-inline">
                      <input
                        type="checkbox"
                        checked={Boolean(configForm.descuento_residente_activo)}
                        onChange={(e) =>
                          setConfigForm((prev) => ({
                            ...prev,
                            descuento_residente_activo: e.target.checked,
                          }))
                        }
                      />
                      <span>Habilitar descuento para residentes de Andacollo</span>
                    </label>
                    <div className="bookings-admin-field">
                      <label htmlFor="cfg-disc-pct">Porcentaje de descuento (%)</label>
                      <input
                        id="cfg-disc-pct"
                        type="number"
                        min="0"
                        max="100"
                        value={configForm.descuento_residente_pct}
                        onChange={(e) =>
                          setConfigForm((prev) => ({
                            ...prev,
                            descuento_residente_pct: Number(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Destacados de infraestructura */}
                  <div className="bookings-subblock">
                    <h3>Destacados de infraestructura / servicio</h3>
                    <div className="bookings-chips-wrap">
                      {(configForm.highlights || []).map((h, idx) => (
                        <span key={idx} className="bookings-chip">
                          <strong>{h.title}</strong> · {h.subtitle}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveHighlight(idx);
                            }}
                            aria-label="Quitar destacado"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="bookings-inline-add">
                      <input
                        type="text"
                        placeholder="Título (ej. Cúpula 14'')"
                        value={newHighlight.title}
                        onChange={(e) =>
                          setNewHighlight((prev) => ({ ...prev, title: e.target.value }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="Detalle breve"
                        value={newHighlight.subtitle}
                        onChange={(e) =>
                          setNewHighlight((prev) => ({ ...prev, subtitle: e.target.value }))
                        }
                      />
                      <Button type="button" variant="outline" onClick={handleAddHighlight}>
                        + Añadir
                      </Button>
                    </div>
                  </div>

                  <div className="bookings-admin-actions">
                    <Button type="submit" variant="gold" disabled={saving}>
                      {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                  </div>
                </form>

                {/* CRUD Servicios / Modalidades */}
                <div className="bookings-admin-card">
                  <h3>Modalidades, Servicios y Precios</h3>
                  <div className="bookings-list-items">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="bookings-list-row">
                        <div>
                          <strong>{pkg.nombre}</strong>
                          <p>
                            {pkg.descripcion} ·{' '}
                            <b>${Number(pkg.precio_adulto).toLocaleString('es-CL')} CLP</b> ({pkg.pricing_unit}) ·
                            Máx. {pkg.capacidad_maxima} p.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="bookings-del-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeletePackage(pkg.id);
                          }}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    ))}
                    {packages.length === 0 && (
                      <p className="bookings-muted">Aún no hay modalidades configuradas.</p>
                    )}
                  </div>

                  <form className="bookings-subform" onSubmit={handleAddPackage}>
                    <input
                      type="text"
                      required
                      placeholder="Nombre servicio / tour / habitación"
                      value={newPkg.nombre}
                      onChange={(e) => setNewPkg((p) => ({ ...p, nombre: e.target.value }))}
                    />
                    <input
                      type="text"
                      placeholder="Descripción breve"
                      value={newPkg.descripcion}
                      onChange={(e) => setNewPkg((p) => ({ ...p, descripcion: e.target.value }))}
                    />
                    <select
                      value={newPkg.pricing_unit}
                      onChange={(e) => setNewPkg((p) => ({ ...p, pricing_unit: e.target.value }))}
                    >
                      <option value="por_persona">Por persona</option>
                      <option value="tarifa_fija">Tarifa fija grupal</option>
                      <option value="por_noche">Por noche</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      placeholder="Precio base / adulto"
                      value={newPkg.precio_adulto}
                      onChange={(e) =>
                        setNewPkg((p) => ({ ...p, precio_adulto: Number(e.target.value) || 0 }))
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Precio niño"
                      value={newPkg.precio_nino}
                      onChange={(e) =>
                        setNewPkg((p) => ({ ...p, precio_nino: Number(e.target.value) || 0 }))
                      }
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Cupo máx."
                      value={newPkg.capacidad_maxima}
                      onChange={(e) =>
                        setNewPkg((p) => ({ ...p, capacidad_maxima: Number(e.target.value) || 1 }))
                      }
                    />
                    <Button type="submit" variant="gold">
                      + Agregar Servicio
                    </Button>
                  </form>
                </div>

                {/* CRUD Bloques Horarios */}
                <div className="bookings-admin-card">
                  <h3>Bloques Horarios y Cupos Base</h3>
                  <div className="bookings-chips-wrap">
                    {slots.map((slot) => (
                      <span key={slot.id} className="bookings-chip">
                        <strong>{slot.hora_inicio} hrs</strong> ({slot.capacidad_base} cupos)
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteSlot(slot.id);
                          }}
                          aria-label="Eliminar bloque horario"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {slots.length === 0 && (
                      <p className="bookings-muted">Sin bloques horarios (opcional para estadías o solicitudes).</p>
                    )}
                  </div>

                  <form className="bookings-inline-add" onSubmit={handleAddSlot}>
                    <input
                      type="time"
                      required
                      value={newSlot.hora_inicio}
                      onChange={(e) => setNewSlot((s) => ({ ...s, hora_inicio: e.target.value }))}
                    />
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={newSlot.capacidad_base}
                      onChange={(e) =>
                        setNewSlot((s) => ({ ...s, capacidad_base: Number(e.target.value) || 1 }))
                      }
                      placeholder="Cupos base"
                    />
                    <Button type="submit" variant="outline">
                      + Agregar Horario
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* TAB 2: RESERVAS RECIBIDAS */
          <section className="bookings-admin-card">
            <div className="bookings-filters-bar">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Todos los tipos</option>
                {BOOKING_ENTITY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={loadBookings}>
                Actualizar
              </Button>
            </div>

            <div className="bookings-table-wrap">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Lugar / Entidad</th>
                    <th>Modalidad</th>
                    <th>Fecha / Turno</th>
                    <th>Titular / Contacto</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td><code>{b.codigo}</code></td>
                      <td>
                        <strong>{b.entity_name}</strong>
                        <small>{b.entity_type}</small>
                      </td>
                      <td>{b.package_name}</td>
                      <td>
                        {b.fecha_inicio}
                        {b.fecha_fin ? ` → ${b.fecha_fin}` : ''}
                        {b.hora_inicio ? ` · ${b.hora_inicio}` : ''}
                      </td>
                      <td>
                        <strong>{b.titular_nombre}</strong>
                        <small>{b.titular_telefono}</small>
                      </td>
                      <td>
                        {b.total_clp > 0
                          ? `$${Number(b.total_clp).toLocaleString('es-CL')}`
                          : 'Sin costo'}
                      </td>
                      <td>
                        <span className={`bookings-state-pill bookings-state-pill--${b.estado}`}>
                          {b.estado}
                        </span>
                      </td>
                      <td>
                        <div className="bookings-row-actions">
                          {b.estado === 'pendiente' && (
                            <button
                              type="button"
                              className="bookings-action-ok"
                              onClick={(e) => {
                                e.preventDefault();
                                handleChangeBookingStatus(b.id, 'confirmada');
                              }}
                            >
                              Aprobar
                            </button>
                          )}
                          {b.estado !== 'cancelada' && (
                            <button
                              type="button"
                              className="bookings-action-cancel"
                              onClick={(e) => {
                                e.preventDefault();
                                setCancelConfirm(b);
                              }}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="8" className="bookings-empty-td">
                        No hay reservas registradas con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <ConfirmModal
          isOpen={Boolean(cancelConfirm)}
          title="Cancelar reserva de viajero"
          message={
            cancelConfirm
              ? `¿Confirmas cancelar la reserva ${cancelConfirm.codigo} de ${cancelConfirm.titular_nombre}?`
              : ''
          }
          confirmLabel="Sí, cancelar"
          cancelLabel="Volver"
          danger
          onConfirm={async () => {
            const target = cancelConfirm;
            setCancelConfirm(null);
            if (target) await handleChangeBookingStatus(target.id, 'cancelada');
          }}
          onCancel={() => setCancelConfirm(null)}
        />
      </main>
    </div>
  );
}
