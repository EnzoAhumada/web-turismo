import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGuides } from '../../hooks/useGuides';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './GuidesPage.css';

function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function GuidesPage() {
  const { user } = useAuth();
  const {
    guides,
    specialties,
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
  } = useGuides();

  const [selectedGuide, setSelectedGuide] = useState(null);
  const [reqDate, setReqDate] = useState(getTomorrow());
  const [reqPeople, setReqPeople] = useState(2);
  const [reqPhone, setReqPhone] = useState('+56 9 ');
  const [reqNotes, setReqNotes] = useState('');
  const [sendingReq, setSendingReq] = useState(false);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applySaving, setApplySaving] = useState(false);
  const [applyForm, setApplyForm] = useState({
    nombre: '',
    especialidad: 'Astroturismo & Cielo Profundo',
    certificacion: 'SERNATUR Sello R · Guía Local',
    tarifaReferencial: '$18.000 CLP / persona',
    sectores: 'Cerro Yahuín, Mirador La Caldera',
    idiomas: 'Español',
    biografia: '',
  });

  async function handleRequestSubmit(e) {
    e.preventDefault();
    if (!selectedGuide) return;
    setSendingReq(true);
    const ok = await submitBookingRequest({
      guide: selectedGuide,
      fecha: reqDate,
      personas: reqPeople,
      telefono: reqPhone,
      notas: reqNotes,
    });
    setSendingReq(false);
    if (ok) {
      setSelectedGuide(null);
      setReqNotes('');
    }
  }

  async function handleApplySubmit(e) {
    e.preventDefault();
    setApplySaving(true);
    const ok = await submitGuideApplication(applyForm);
    setApplySaving(false);
    if (ok) {
      setApplyOpen(false);
      setApplyForm({
        nombre: '',
        especialidad: 'Astroturismo & Cielo Profundo',
        certificacion: 'SERNATUR Sello R · Guía Local',
        tarifaReferencial: '$18.000 CLP / persona',
        sectores: 'Cerro Yahuín, Mirador La Caldera',
        idiomas: 'Español',
        biografia: '',
      });
    }
  }

  function handleOpenApply(e) {
    e.preventDefault();
    if (!user?.id) {
      setFeedback({
        type: 'info',
        message: 'Inicia sesión para postular tu perfil como guía local.',
      });
      return;
    }
    setApplyOpen(true);
  }

  return (
    <>
      <Header darkNav />
      <main className="page-wrapper page-wrapper--dark">
        <div className="container page-content guides-wrap">
          <section className="guides-hero">
            <div className="guides-hero__copy">
              <span className="guides-hero__badge">
                <Icon name="award" size={14} />
                <span>Registro Local SERNATUR (Sello R &amp; Sello Q) · Red Starlight Coquimbo</span>
              </span>
              <h1>
                Guías Turísticos &amp; <span>Astroturísticos de Andacollo</span>
              </h1>
              <p>
                Conecta con anfitriones locales certificados para expediciones de observación
                profunda, talleres de astrofotografía nocturna, senderismo en Cerro Yahuín y rutas
                patrimoniales mineras.
              </p>
            </div>

            <Button type="button" variant="gold" onClick={handleOpenApply}>
              + Postular como Guía Local
            </Button>
          </section>

          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              onDismiss={() => setFeedback(null)}
            />
          )}
          <FeedbackBanner type="error" message={error} />

          <section className="guides-toolbar" aria-label="Filtros de guías">
            <div className="guides-filter-chips">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  className={`guides-chip ${specialty === spec ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSpecialty(spec);
                  }}
                >
                  {spec}
                </button>
              ))}
            </div>

            <div className="guides-search-box">
              <Icon name="search" size={16} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, sector o idioma..."
                aria-label="Buscar guías turísticos"
              />
            </div>
          </section>

          {loading ? (
            <LoadingState message="Cargando guías locales certificados..." />
          ) : guides.length === 0 ? (
            <EmptyState
              icon="compass"
              title="No se encontraron guías con ese filtro"
              description="Prueba con otra especialidad o borra el texto de búsqueda."
              actionLabel="Ver todos los guías"
              onAction={() => {
                setSpecialty('Todos');
                setSearch('');
              }}
            />
          ) : (
            <section className="guides-grid" aria-label="Listado de guías certificados">
              {guides.map((g) => (
                <article key={g.id} className="guide-card">
                  <div className="guide-card__top">
                    <div className="guide-card__identity">
                      <span className="guide-avatar">{(g.nombre || 'G').charAt(0)}</span>
                      <div>
                        <span className="guide-spec-badge">{g.especialidad}</span>
                        <h2>{g.nombre}</h2>
                        <p className="guide-cert">✓ {g.certificacion}</p>
                      </div>
                    </div>
                    <div className="guide-rating">
                      <strong>★ {Number(g.rating || 5).toFixed(1)}</strong>
                      <span>({g.resenas_count || 0} reseñas)</span>
                    </div>
                  </div>

                  <p className="guide-bio">{g.biografia}</p>

                  <div className="guide-meta-box">
                    <div className="guide-sectors">
                      <span className="guide-meta-label">Sectores:</span>
                      {(g.sectores || []).map((s) => (
                        <span key={s} className="guide-sector-pill">
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="guide-equip">
                      <span className="guide-meta-label">Equipamiento incluido: </span>
                      {g.equipamiento}
                    </p>
                    <div className="guide-foot-meta">
                      <span>Idiomas: {(g.idiomas || ['Español']).join(', ')}</span>
                      <span>{g.experiencia}</span>
                    </div>
                  </div>

                  <footer className="guide-card__foot">
                    <div>
                      <span className="guide-price-label">Tarifa referencial</span>
                      <strong className="guide-price-val">{g.tarifa_referencial}</strong>
                    </div>
                    <Button
                      type="button"
                      variant="gold"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedGuide(g);
                      }}
                    >
                      Ver Itinerario y Reservar
                    </Button>
                  </footer>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      {/* Modal Detalle + Solicitud Directa */}
      {selectedGuide && (
        <div
          className="guides-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-detail-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedGuide(null);
          }}
        >
          <div className="guides-modal">
            <header className="guides-modal__head">
              <div>
                <span className="guide-spec-badge">{selectedGuide.especialidad}</span>
                <h2 id="guide-detail-title">{selectedGuide.nombre}</h2>
                <p className="guide-cert">
                  {selectedGuide.certificacion} · {selectedGuide.experiencia}
                </p>
              </div>
              <button
                type="button"
                className="guides-modal__close"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedGuide(null);
                }}
              >
                <Icon name="x" size={18} />
              </button>
            </header>

            <div className="guides-itinerary">
              <h3>Itinerario Tipo en Andacollo</h3>
              <ol>
                {(Array.isArray(selectedGuide.itinerario) ? selectedGuide.itinerario : []).map(
                  (step, idx) => (
                    <li key={idx}>{step}</li>
                  )
                )}
              </ol>
            </div>

            <form className="guides-req-form" onSubmit={handleRequestSubmit}>
              <h3>Solicitar Reserva Directa con {selectedGuide.nombre}</h3>
              <div className="guides-req-grid">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={reqDate}
                  onChange={(e) => setReqDate(e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={reqPeople}
                  onChange={(e) => setReqPeople(Number(e.target.value) || 1)}
                  placeholder="Personas"
                />
                <input
                  type="tel"
                  required
                  value={reqPhone}
                  onChange={(e) => setReqPhone(e.target.value)}
                  placeholder="+56 9 8765 4321"
                />
              </div>
              <input
                type="text"
                value={reqNotes}
                onChange={(e) => setReqNotes(e.target.value)}
                placeholder="Comentario o consulta opcional para el guía..."
              />
              <div className="guides-req-foot">
                <strong>{selectedGuide.tarifa_referencial}</strong>
                <Button type="submit" variant="gold" disabled={sendingReq}>
                  {sendingReq ? 'Enviando...' : 'Enviar Solicitud al Guía'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Postular como Guía Local */}
      {applyOpen && (
        <div
          className="guides-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-apply-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setApplyOpen(false);
          }}
        >
          <div className="guides-modal">
            <header className="guides-modal__head">
              <div>
                <h2 id="guide-apply-title">Registro de Guía Local ThakiGo</h2>
                <p>Comparte tu experiencia y rutas certificadas en Andacollo</p>
              </div>
              <button
                type="button"
                className="guides-modal__close"
                onClick={(e) => {
                  e.preventDefault();
                  setApplyOpen(false);
                }}
              >
                <Icon name="x" size={18} />
              </button>
            </header>

            <form className="guides-apply-form" onSubmit={handleApplySubmit}>
              <div className="guides-apply-grid-2">
                <label>
                  <span>Nombre Completo</span>
                  <input
                    type="text"
                    required
                    value={applyForm.nombre}
                    onChange={(e) => setApplyForm((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: Rodrigo Campusano"
                  />
                </label>
                <label>
                  <span>Especialidad Principal</span>
                  <select
                    value={applyForm.especialidad}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, especialidad: e.target.value }))
                    }
                  >
                    {specialties
                      .filter((s) => s !== 'Todos')
                      .map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <div className="guides-apply-grid-2">
                <label>
                  <span>Certificación (SERNATUR / Starlight)</span>
                  <input
                    type="text"
                    required
                    value={applyForm.certificacion}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, certificacion: e.target.value }))
                    }
                  />
                </label>
                <label>
                  <span>Tarifa Referencial por Persona</span>
                  <input
                    type="text"
                    required
                    value={applyForm.tarifaReferencial}
                    onChange={(e) =>
                      setApplyForm((f) => ({ ...f, tarifaReferencial: e.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="guides-apply-grid-2">
                <label>
                  <span>Sectores donde opera (separados por coma)</span>
                  <input
                    type="text"
                    required
                    value={applyForm.sectores}
                    onChange={(e) => setApplyForm((f) => ({ ...f, sectores: e.target.value }))}
                  />
                </label>
                <label>
                  <span>Idiomas</span>
                  <input
                    type="text"
                    required
                    value={applyForm.idiomas}
                    onChange={(e) => setApplyForm((f) => ({ ...f, idiomas: e.target.value }))}
                  />
                </label>
              </div>

              <label>
                <span>Descripción de experiencia y equipamiento incluido</span>
                <textarea
                  rows="3"
                  required
                  value={applyForm.biografia}
                  onChange={(e) => setApplyForm((f) => ({ ...f, biografia: e.target.value }))}
                  placeholder="Describe tu ruta, telescopios o apoyo fotográfico incluido..."
                />
              </label>

              <div className="guides-apply-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    setApplyOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="gold" disabled={applySaving}>
                  {applySaving ? 'Publicando...' : 'Publicar Perfil de Guía'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
