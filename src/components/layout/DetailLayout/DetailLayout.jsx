import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import SmartImage from '../../ui/SmartImage';
import Icon from '../../ui/Icon';
import RichText from '../../ui/RichText';
import LoadingState from '../../ui/LoadingState';
import EmptyState from '../../ui/EmptyState';
import Card from '../../ui/Card';
import StarRating from '../../ui/StarRating';
import BookingSection from '../../ui/BookingSection';
import { useEntityBooking } from '../../../hooks/useEntityBooking';
import { googleMapsDirectionsUrl, googleMapsEmbedUrl } from '../../../lib/andacolloGeo';
import './DetailLayout.css';

export default function DetailLayout({
  loading,
  item,
  notFoundConfig = {
    icon: 'search',
    title: 'Elemento no encontrado',
    backTo: '/explorar',
    backLabel: 'Volver al explorador',
  },
  backTo = '/explorar',
  saved = false,
  onToggleFavorite,
  subtitle = '',
  rating,
  reviewsCount,
  statusBadges = [],
  actions = [],
  showFullDesc = false,
  onToggleDesc,
  infoTitle = 'Información',
  infoRows = [],
  bookingProps = null,
  bookingSection = null,
  reviewsSection = null,
  relatedSection = null,
  mapPreview = false,
  mapQuery = '',
  sidebarCards = [],
}) {
  const [activeTab, setActiveTab] = useState('detalle');
  const booking = useEntityBooking(
    bookingProps?.entityType || null,
    bookingProps?.entityId || null,
    bookingProps?.entityName || item?.nombre || ''
  );

  useEffect(() => {
    setActiveTab('detalle');
  }, [bookingProps?.entityType, bookingProps?.entityId]);

  const hasBooking = Boolean(bookingProps && !booking.loading && booking.config);
  const activePassesCount = hasBooking
    ? booking.userBookings.filter((b) => b.estado !== 'cancelada').length
    : 0;
  if (loading) {
    return <LoadingState fullPage message="Cargando detalles..." />;
  }

  if (!item) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div className="container page-content">
            <EmptyState
              icon={notFoundConfig.icon}
              title={notFoundConfig.title}
              actionLabel={notFoundConfig.backLabel}
              actionTo={notFoundConfig.backTo}
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="place-hero">
          <SmartImage src={item.imagen_url} alt={item.nombre} className="place-hero__img" loading="eager" />
          <div className="place-hero__overlay" />
          <div className="place-hero__nav container">
            <Link to={backTo} className="place-hero__back" aria-label="Volver">
              <Icon name="arrow-left" size={20} />
            </Link>
            {onToggleFavorite && (
              <button
                type="button"
                className={`place-hero__save ${saved ? 'saved' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite();
                }}
                aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Icon name="heart" size={20} filled={saved} />
              </button>
            )}
          </div>
        </div>

        <div className="container place-sheet">
          <div className="place-layout">
            <article className="place-main">
              <header className="place-header">
                <h1 className="place-title">{item.nombre}</h1>
                {subtitle && <p className="place-subtitle">{subtitle}</p>}
                <div className="place-meta-row">
                  {rating !== undefined && rating !== null && (
                    <StarRating value={rating} count={reviewsCount} />
                  )}
                  {statusBadges.map((b, idx) => (
                    <span
                      key={idx}
                      className={b.className || 'place-status open'}
                      style={b.style}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </header>

              {actions.length > 0 && (
                <div className="place-actions">
                  {actions.map(({ label, icon, href, onClick }) =>
                    href ? (
                      <a key={label} href={href} className="place-action-btn">
                        <span className="place-action-btn__icon">
                          <Icon name={icon} size={20} />
                        </span>
                        <span>{label}</span>
                      </a>
                    ) : (
                      <button
                        key={label}
                        type="button"
                        className="place-action-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          if (onClick) onClick();
                        }}
                      >
                        <span className="place-action-btn__icon">
                          <Icon name={icon} size={20} />
                        </span>
                        <span>{label}</span>
                      </button>
                    )
                  )}
                </div>
              )}

              {hasBooking && (
                <nav
                  className="detail-submenu"
                  role="tablist"
                  aria-label="Secciones del detalle"
                >
                  <button
                    type="button"
                    role="tab"
                    id="detail-tab-info"
                    aria-selected={activeTab === 'detalle'}
                    className={`detail-submenu__tab ${activeTab === 'detalle' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('detalle');
                    }}
                  >
                    <Icon name="compass" size={16} />
                    <span>Información y Detalle</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="detail-tab-booking"
                    aria-selected={activeTab === 'reservas'}
                    className={`detail-submenu__tab ${activeTab === 'reservas' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('reservas');
                    }}
                  >
                    <Icon name="calendar" size={16} />
                    <span>Servicios y Reserva</span>
                    {activePassesCount > 0 && (
                      <span className="detail-submenu__badge">{activePassesCount}</span>
                    )}
                  </button>
                </nav>
              )}

              {hasBooking && activeTab === 'reservas' ? (
                <div
                  role="tabpanel"
                  aria-labelledby="detail-tab-booking"
                  className="detail-submenu-panel"
                >
                  <BookingSection
                    booking={booking}
                    entityType={bookingProps.entityType}
                    entityId={bookingProps.entityId}
                    entityName={bookingProps.entityName || item?.nombre}
                  />
                </div>
              ) : (
                <div role="tabpanel" aria-labelledby="detail-tab-info">
                  {item.descripcion && (
                    <section className="place-section">
                      <h2 className="place-section__title">Descripción</h2>
                      <RichText
                        value={item.descripcion}
                        className={`place-desc ${showFullDesc ? '' : 'truncated'}`}
                      />
                      {onToggleDesc && (
                        <button
                          type="button"
                          className="place-desc__toggle"
                          onClick={(e) => {
                            e.preventDefault();
                            onToggleDesc();
                          }}
                        >
                          {showFullDesc ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </section>
                  )}

                  {infoRows.length > 0 && (
                    <section className="place-section">
                      <h2 className="place-section__title">{infoTitle}</h2>
                      <dl className="place-info-list">
                        {infoRows.map((row) => (
                          <div key={row.label} className="place-info-row">
                            <dt>
                              {row.icon && <Icon name={row.icon} size={16} />}
                              <span>{row.label}</span>
                            </dt>
                            <dd>{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  )}

                  {!bookingProps && bookingSection}

                  {reviewsSection}

                  {relatedSection && relatedSection.items?.length > 0 && (
                    <section className="place-section">
                      <div className="section-header">
                        <h2 className="section-title">{relatedSection.title}</h2>
                        <Link to={relatedSection.linkTo} className="section-link">
                          {relatedSection.linkLabel || 'Ver todos'}
                        </Link>
                      </div>
                      <div className="grid-3">
                        {relatedSection.items.map((rel) => (
                          <Card
                            key={rel.id}
                            image={rel.image}
                            title={rel.title}
                            subtitle={rel.subtitle}
                            rating={rel.rating}
                            to={rel.to}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </article>

            <aside className="place-sidebar">
              {mapQuery && (
                <div className="place-map-preview">
                  <iframe
                    className="place-map-preview__frame"
                    title={`Ubicación de ${item.nombre}`}
                    src={googleMapsEmbedUrl(mapQuery, 16)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    className="place-map-preview__btn place-map-preview__btn--float"
                    href={googleMapsDirectionsUrl(mapQuery)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cómo llegar
                  </a>
                </div>
              )}
              {mapPreview && !mapQuery && (
                <div className="place-map-preview">
                  <SmartImage src={item.imagen_url} alt="Mapa de ubicación" />
                  <div className="place-map-preview__overlay">
                    <Link to="/mapa" className="place-map-preview__btn">
                      Ver en mapa
                    </Link>
                  </div>
                </div>
              )}
              {sidebarCards.map((card, idx) => (
                <div key={idx} className="place-sidebar-card">
                  <h3>
                    {card.icon && <Icon name={card.icon} size={17} />}
                    <span>{card.title}</span>
                  </h3>
                  {card.highlight && (
                    <p className="place-sidebar-card__highlight">{card.highlight}</p>
                  )}
                  {card.text && <p>{card.text}</p>}
                  {card.list && (
                    <ul className="place-tips">
                      {card.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
