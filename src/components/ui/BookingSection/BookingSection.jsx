import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useEntityBooking } from '../../../hooks/useEntityBooking';
import { resolveAstroImage } from '../../../lib/astroScenes';
import Icon from '../Icon';
import Button from '../Button';
import FeedbackBanner from '../FeedbackBanner';
import ConfirmModal from '../ConfirmModal';
import './BookingSection.css';

const STATUS_LABELS = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
};

export default function BookingSection({ entityType, entityId, entityName }) {
  const { user } = useAuth();
  const {
    config,
    packages,
    slots,
    userBookings,
    loading,
    submitting,
    feedback,
    setFeedback,
    selectedPackage,
    selectedPackageId,
    setSelectedPackageId,
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
  } = useEntityBooking(entityType, entityId, entityName);

  const [lightboxItem, setLightboxItem] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  if (loading || !config) return null;

  const profileType = config.booking_profile || 'tour_horario';
  const highlights = Array.isArray(config.highlights) ? config.highlights : [];
  const gallery = Array.isArray(config.galeria) ? config.galeria : [];
  const activePassesCount = userBookings.filter((b) => b.estado !== 'cancelada').length;
  const todayStr = new Date().toISOString().split('T')[0];

  const hasFormOptions =
    profileType === 'tour_horario'
      ? packages.length > 0 && slots.length > 0
      : true;

  const peopleLabel =
    profileType === 'mesa_comida'
      ? 'Comensales'
      : profileType === 'estadia_noches'
        ? 'Huéspedes'
        : profileType === 'servicio_general'
          ? 'Personas'
          : 'Adultos';

  const packageStepLabel =
    profileType === 'mesa_comida'
      ? '1. Opción / Zona de mesa'
      : profileType === 'estadia_noches'
        ? '1. Tipo de habitación / cabaña'
        : profileType === 'servicio_general'
          ? '1. Servicio a reservar'
          : '1. Modalidad de Tour';

  return (
    <section className="booking-module" aria-label="Módulo de reservas">
      {/* Encabezado de infraestructura y logística */}
      <div className="booking-hero-card">
        <div className="booking-hero-card__badges">
          {config.badge_ubicacion && (
            <span className="booking-pill booking-pill--gold">{config.badge_ubicacion}</span>
          )}
          {config.badge_extra && (
            <span className="booking-pill booking-pill--sky">{config.badge_extra}</span>
          )}
          {config.estado_operacion && (
            <span className="booking-pill booking-pill--green">{config.estado_operacion}</span>
          )}
        </div>

        <h2 className="booking-hero-card__title">{config.titulo_modulo || 'Reserva tu experiencia'}</h2>
        {config.subtitulo_modulo && (
          <p className="booking-hero-card__sub">{config.subtitulo_modulo}</p>
        )}

        {highlights.length > 0 && (
          <div className="booking-highlights">
            {highlights.map((h, idx) => (
              <div key={idx} className={`booking-highlight booking-highlight--${h.accent || 'gold'}`}>
                <strong>{h.title}</strong>
                <span>{h.subtitle}</span>
              </div>
            ))}
          </div>
        )}

        {(config.nota_logistica_titulo || config.nota_logistica_detalle) && (
          <div className="booking-logistics">
            <Icon name="clock" size={18} />
            <div>
              {config.nota_logistica_titulo && <strong>{config.nota_logistica_titulo}</strong>}
              {config.nota_logistica_detalle && <span>{config.nota_logistica_detalle}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Galería fotográfica de instalaciones */}
      {gallery.length > 0 && (
        <div className="booking-gallery-block">
          <div className="booking-gallery-block__head">
            <h3>Instalaciones &amp; Experiencia</h3>
            <span>Haz clic para ampliar vista</span>
          </div>
          <div className="booking-gallery-grid">
            {gallery.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="booking-gallery-card"
                onClick={(e) => {
                  e.preventDefault();
                  setLightboxItem(item);
                }}
              >
                <div className="booking-gallery-card__img">
                  <img src={resolveAstroImage(item.img, 'collowara_dome')} alt={item.title || 'Instalación'} />
                </div>
                <div className="booking-gallery-card__meta">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <FeedbackBanner
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Grilla principal: Formulario adaptativo + Mis Pases */}
      <div className="booking-main-grid">
        <div className="booking-form-card">
          <div className="booking-form-card__head">
            <h3>
              <Icon name="calendar" size={18} />
              <span>Completar Reserva</span>
            </h3>
            <span className="booking-mode-tag">
              {config.confirmation_mode === 'pendiente'
                ? 'Sujeta a confirmación'
                : 'Confirmación inmediata'}
            </span>
          </div>

          {!hasFormOptions ? (
            <div className="booking-empty-notice">
              <Icon name="clock" size={22} />
              <p>Próximamente horarios y modalidades disponibles para este lugar.</p>
            </div>
          ) : (
            <form className="booking-form" onSubmit={handleSubmit}>
              {/* 1. Paquetes / Servicios si existen */}
              {packages.length > 0 && (
                <div className="booking-field">
                  <span className="booking-label">{packageStepLabel}</span>
                  <div className="booking-packages-grid">
                    {packages.map((pkg) => {
                      const active = pkg.id === (selectedPackage?.id || selectedPackageId);
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          className={`booking-pkg-btn ${active ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedPackageId(pkg.id);
                          }}
                        >
                          <strong>{pkg.nombre}</strong>
                          {config.pricing_mode !== 'sin_costo' ? (
                            <span className="booking-pkg-btn__price">
                              ${Number(pkg.precio_adulto || 0).toLocaleString('es-CL')}
                              {pkg.pricing_unit === 'por_noche'
                                ? ' / noche'
                                : pkg.pricing_unit === 'tarifa_fija'
                                  ? ' (fijo)'
                                  : ' / p.'}
                            </span>
                          ) : (
                            <span className="booking-pkg-btn__price">Sin costo</span>
                          )}
                          {pkg.descripcion && (
                            <span className="booking-pkg-btn__desc">{pkg.descripcion}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Fechas y Horarios adaptativos */}
              <div className="booking-row-2">
                <div className="booking-field">
                  <label htmlFor={`bk-date-${entityId}`} className="booking-label">
                    {profileType === 'estadia_noches' ? 'Fecha de entrada (Check-in)' : 'Fecha de visita'}
                  </label>
                  <input
                    id={`bk-date-${entityId}`}
                    type="date"
                    min={todayStr}
                    required
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>

                {profileType === 'estadia_noches' ? (
                  <div className="booking-field">
                    <label htmlFor={`bk-date-end-${entityId}`} className="booking-label">
                      Fecha de salida ({nights > 0 ? `${nights} noche${nights === 1 ? '' : 's'}` : 'inválida'})
                    </label>
                    <input
                      id={`bk-date-end-${entityId}`}
                      type="date"
                      min={fechaInicio || todayStr}
                      required
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </div>
                ) : slots.length > 0 ? (
                  <div className="booking-field">
                    <span className="booking-label">Bloque horario (Cupos en vivo)</span>
                    <div className="booking-slots-grid">
                      {slots.map((slot) => {
                        const active = slot.id === selectedSlotId;
                        const soldOut = slot.disponibles <= 0;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={soldOut}
                            className={`booking-slot-btn ${active ? 'active' : ''} ${soldOut ? 'soldout' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedSlotId(slot.id);
                            }}
                          >
                            <strong>{slot.hora_inicio} hrs</strong>
                            <span className={slot.disponibles <= 5 ? 'low' : 'ok'}>
                              {soldOut ? 'Sin cupos' : `${slot.disponibles} cupos`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* 3. Asistentes y Descuento Residente */}
              <div className="booking-row-3">
                <div className="booking-field">
                  <label htmlFor={`bk-adults-${entityId}`} className="booking-label">
                    {peopleLabel}
                  </label>
                  <input
                    id={`bk-adults-${entityId}`}
                    type="number"
                    min="1"
                    max={selectedPackage?.capacidad_maxima || 20}
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>

                {profileType === 'tour_horario' && (
                  <div className="booking-field">
                    <label htmlFor={`bk-children-${entityId}`} className="booking-label">
                      Niños / Adulto Mayor
                    </label>
                    <input
                      id={`bk-children-${entityId}`}
                      type="number"
                      min="0"
                      max="15"
                      value={children}
                      onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
                    />
                  </div>
                )}

                {config.descuento_residente_activo && config.pricing_mode !== 'sin_costo' && (
                  <label className="booking-resident-check">
                    <input
                      type="checkbox"
                      checked={isResident}
                      onChange={(e) => setIsResident(e.target.checked)}
                    />
                    <span>Residente Andacollo (-{config.descuento_residente_pct}%)</span>
                  </label>
                )}
              </div>

              {/* 4. Datos del Titular */}
              <div className="booking-row-2">
                <div className="booking-field">
                  <label htmlFor={`bk-name-${entityId}`} className="booking-label">
                    Nombre completo titular
                  </label>
                  <input
                    id={`bk-name-${entityId}`}
                    type="text"
                    required
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="Ej: Carolina Araya"
                  />
                </div>

                <div className="booking-field">
                  <label htmlFor={`bk-phone-${entityId}`} className="booking-label">
                    Teléfono / WhatsApp de contacto
                  </label>
                  <input
                    id={`bk-phone-${entityId}`}
                    type="tel"
                    required
                    value={holderPhone}
                    onChange={(e) => setHolderPhone(e.target.value)}
                    placeholder="+56 9 8765 4321"
                  />
                </div>
              </div>

              {/* 5. Notas / Preferencias (especialmente útil para comida, alojamientos y servicios) */}
              {profileType !== 'tour_horario' && (
                <div className="booking-field">
                  <label htmlFor={`bk-notes-${entityId}`} className="booking-label">
                    {profileType === 'mesa_comida'
                      ? 'Comentarios, preferencias de mesa o alergias'
                      : 'Notas o requerimientos especiales'}
                  </label>
                  <textarea
                    id={`bk-notes-${entityId}`}
                    rows="2"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Indica detalles adicionales para preparar tu visita..."
                  />
                </div>
              )}

              {/* 6. Resumen económico y envío */}
              <div className="booking-summary-bar">
                <div>
                  <span className="booking-summary-bar__label">
                    {config.pricing_mode === 'sin_costo'
                      ? 'Modalidad de reserva'
                      : 'Total estimado'}
                  </span>
                  <div className="booking-summary-bar__amount">
                    {config.pricing_mode === 'sin_costo' ? (
                      <strong>Sin costo · Pago/consumo en local</strong>
                    ) : (
                      <>
                        <strong>${estimatedTotal.toLocaleString('es-CL')} CLP</strong>
                        {isResident && config.descuento_residente_activo && (
                          <span className="booking-discount-pill">Dcto. Local Aplicado</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {user ? (
                  <Button type="submit" variant="gold" disabled={submitting}>
                    {submitting
                      ? 'Procesando...'
                      : config.confirmation_mode === 'pendiente'
                        ? 'Enviar Solicitud de Reserva'
                        : 'Confirmar Reserva y Generar Pase'}
                  </Button>
                ) : (
                  <Link to="/" className="btn btn--gold">
                    Iniciar sesión para reservar
                  </Link>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Panel derecho: Mis Pases / Reservas */}
        <aside className="booking-passes-card" aria-label="Mis reservas en este lugar">
          <div className="booking-passes-card__head">
            <div>
              <h3>Mis Pases y Reservas</h3>
              <p>Gestiona, copia tu código o cancela</p>
            </div>
            <span className="booking-passes-badge">
              {activePassesCount} activa{activePassesCount === 1 ? '' : 's'}
            </span>
          </div>

          {!user ? (
            <p className="booking-passes-empty">
              Inicia sesión para ver y administrar tus pases emitidos en este lugar.
            </p>
          ) : userBookings.length === 0 ? (
            <p className="booking-passes-empty">
              Aún no tienes reservas registradas aquí. Completa el formulario para generar tu pase.
            </p>
          ) : (
            <div className="booking-passes-list">
              {userBookings.map((b) => (
                <div key={b.id} className={`booking-pass booking-pass--${b.estado}`}>
                  <div className="booking-pass__top">
                    <div>
                      <span className="booking-pass__code">{b.codigo}</span>
                      <h4>{b.package_name}</h4>
                      <p>Titular: {b.titular_nombre}</p>
                    </div>
                    <span className={`booking-status booking-status--${b.estado}`}>
                      {STATUS_LABELS[b.estado] || b.estado}
                    </span>
                  </div>

                  <div className="booking-pass__meta">
                    <div>
                      <span>Fecha</span>
                      <strong>
                        {b.fecha_inicio}
                        {b.fecha_fin ? ` → ${b.fecha_fin}` : ''}
                      </strong>
                    </div>
                    <div>
                      <span>{b.hora_inicio ? 'Turno' : 'Personas'}</span>
                      <strong>
                        {b.hora_inicio
                          ? `${b.hora_inicio} hrs`
                          : `${b.adultos + b.ninos} p.`}
                      </strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>
                        {b.total_clp > 0
                          ? `$${Number(b.total_clp).toLocaleString('es-CL')}`
                          : 'Sin costo'}
                      </strong>
                    </div>
                  </div>

                  {b.estado !== 'cancelada' && (
                    <div className="booking-pass__actions">
                      <button
                        type="button"
                        className="booking-pass-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopyCode(b.codigo);
                        }}
                      >
                        Copiar Código
                      </button>
                      <button
                        type="button"
                        className="booking-pass-btn booking-pass-btn--danger"
                        onClick={(e) => {
                          e.preventDefault();
                          setCancelTarget(b);
                        }}
                      >
                        Cancelar Reserva
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* Lightbox galería */}
      {lightboxItem && (
        <div
          className="booking-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxItem(null);
          }}
        >
          <div className="booking-lightbox">
            <img
              src={resolveAstroImage(lightboxItem.img, 'collowara_dome')}
              alt={lightboxItem.title || 'Vista ampliada'}
            />
            <div className="booking-lightbox__bar">
              <div>
                <strong>{lightboxItem.title}</strong>
                <span>{lightboxItem.subtitle}</span>
              </div>
              <button
                type="button"
                className="booking-lightbox__close"
                onClick={(e) => {
                  e.preventDefault();
                  setLightboxItem(null);
                }}
              >
                <Icon name="x" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        title="Cancelar reserva"
        message={
          cancelTarget
            ? `¿Deseas cancelar el pase ${cancelTarget.codigo}? Los cupos reservados volverán a quedar disponibles.`
            : ''
        }
        confirmLabel="Sí, cancelar"
        cancelLabel="Mantener pase"
        danger
        onConfirm={async () => {
          const target = cancelTarget;
          setCancelTarget(null);
          if (target) await handleCancelBooking(target.id);
        }}
        onCancel={() => setCancelTarget(null)}
      />
    </section>
  );
}
