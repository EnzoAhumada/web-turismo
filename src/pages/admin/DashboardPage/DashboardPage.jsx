import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import Icon from '../../../components/ui/Icon';
import LoadingState from '../../../components/ui/LoadingState';
import FeedbackBanner from '../../../components/ui/FeedbackBanner';
import './DashboardPage.css';

const QUICK_ACTIONS = [
  { to: '/admin/lugares',      label: 'Gestionar lugares',       icon: 'map-pin' },
  { to: '/admin/restaurantes', label: 'Gestionar restaurantes',  icon: 'utensils' },
  { to: '/admin/alojamientos', label: 'Gestionar alojamientos',  icon: 'building' },
  { to: '/admin/eventos',      label: 'Gestionar eventos',       icon: 'calendar' },
];

export default function DashboardPage() {
  const { stats, municipal, topPlaces, recentEvents, loading, error, formatDate } =
    useAdminDashboard();

  const flowPoints = municipal?.flujo_horario || [
    { hora: '00:00', valor: 8 },
    { hora: '06:00', valor: 18 },
    { hora: '12:00', valor: 26 },
    { hora: '18:00', valor: 29 },
    { hora: '24:00', valor: 16 },
  ];

  const maxFlow = Math.max(...flowPoints.map((p) => p.valor), 1);
  const svgPoints = flowPoints
    .map((p, idx) => {
      const x = 16 + (idx / Math.max(flowPoints.length - 1, 1)) * 288;
      const y = 96 - (p.valor / maxFlow) * 76;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const originList = municipal?.procedencia || [
    { etiqueta: 'Región de Coquimbo', porcentaje: 62, color: '#FFB800' },
    { etiqueta: 'Región Metropolitana', porcentaje: 20, color: '#0ea5e9' },
    { etiqueta: 'Otras regiones', porcentaje: 12, color: '#10b981' },
    { etiqueta: 'Extranjero', porcentaje: 6, color: '#071B3A' },
  ];

  const interestsList = municipal?.intereses || [
    { etiqueta: 'Religioso', porcentaje: 68 },
    { etiqueta: 'Astronomía', porcentaje: 42 },
    { etiqueta: 'Minero', porcentaje: 28 },
    { etiqueta: 'Naturaleza', porcentaje: 24 },
    { etiqueta: 'Gastronomía', porcentaje: 18 },
  ];

  let accumPct = 0;
  const donutGradient = originList
    .map((seg) => {
      const start = accumPct;
      accumPct += seg.porcentaje;
      return `${seg.color} ${start}% ${accumPct}%`;
    })
    .join(', ');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="dashboard">
          <div className="dashboard__header">
            <h1 className="dashboard__title">Resumen turístico – Andacollo</h1>
            <p className="dashboard__subtitle">
              Monitoreo municipal en tiempo real y gestión de catálogo turístico
            </p>
          </div>

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando métricas de ThakiGo..." />
          ) : (
            <>
              <div className="dashboard__kpis">
                <div className="kpi-card kpi-card--stack">
                  <span className="kpi-card__eyebrow">Visitantes hoy</span>
                  <p className="kpi-card__value">
                    {(municipal?.visitantes_hoy ?? 1248).toLocaleString('es-CL')}
                  </p>
                  <p className="kpi-card__trend">
                    <Icon name="trending-up" size={14} />
                    <span>{municipal?.variacion_visitantes_pct ?? 18}% vs ayer</span>
                  </p>
                </div>

                <div className="kpi-card kpi-card--stack">
                  <span className="kpi-card__eyebrow">Lugares más visitados</span>
                  <ol className="kpi-top-places">
                    {topPlaces.map((place, idx) => (
                      <li key={place.id}>
                        <span className="kpi-top-places__rank">{idx + 1}</span>
                        <span className="kpi-top-places__name">{place.nombre}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="kpi-card kpi-card--stack">
                  <span className="kpi-card__eyebrow">Tiempo promedio de visita</span>
                  <p className="kpi-card__value">{municipal?.tiempo_promedio_visita || '2h 15m'}</p>
                  <p className="kpi-card__trend">
                    <Icon name="trending-up" size={14} />
                    <span>{municipal?.variacion_tiempo_pct ?? 12}% vs semana pasada</span>
                  </p>
                  <div className="kpi-card__rating-row">
                    <strong>{municipal?.calificacion_global ?? 4.8}</strong>
                    <Icon name="star" size={15} filled />
                    <span>Excelentes reseñas</span>
                  </div>
                </div>
              </div>

              <div className="dashboard__charts-grid">
                <section className="dashboard__section">
                  <div className="dashboard__section-header">
                    <h2>Flujo de visitantes</h2>
                    <span className="dashboard__chip">Últimos 7 días</span>
                  </div>
                  <div className="dashboard__line-chart">
                    <svg viewBox="0 0 320 115" className="dashboard__svg-chart" role="img" aria-label="Flujo de visitantes">
                      <line x1="16" y1="20" x2="304" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="16" y1="58" x2="304" y2="58" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="16" y1="96" x2="304" y2="96" stroke="#e2e8f0" />
                      <polyline
                        fill="none"
                        stroke="#071B3A"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={svgPoints}
                      />
                      {flowPoints.map((p, idx) => {
                        const x = 16 + (idx / Math.max(flowPoints.length - 1, 1)) * 288;
                        const y = 96 - (p.valor / maxFlow) * 76;
                        return <circle key={p.hora} cx={x} cy={y} r="3.2" fill="#FFB800" stroke="#071B3A" strokeWidth="1.2" />;
                      })}
                    </svg>
                    <div className="dashboard__line-labels">
                      {flowPoints.map((p) => (
                        <span key={p.hora}>{p.hora}</span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="dashboard__section">
                  <div className="dashboard__section-header">
                    <h2>Procedencia de visitantes</h2>
                  </div>
                  <div className="admin-donut-wrap">
                    <div
                      className="dashboard__donut"
                      style={{ background: `conic-gradient(${donutGradient})` }}
                      aria-label="Distribución por procedencia"
                    >
                      <div className="dashboard__donut-hole" />
                    </div>
                    <div className="admin-donut-legend">
                      {originList.map((o) => (
                        <div key={o.etiqueta} className="admin-donut-legend-item">
                          <span
                            className="admin-donut-legend-dot"
                            style={{ background: o.color }}
                          />
                          <span className="admin-donut-legend-label">{o.etiqueta}</span>
                          <span className="admin-donut-legend-pct">{o.porcentaje}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="dashboard__section">
                  <div className="dashboard__section-header">
                    <h2>Intereses principales</h2>
                  </div>
                  <div className="admin-interests-list">
                    {interestsList.map((int) => (
                      <div key={int.etiqueta}>
                        <div className="admin-interest-header">
                          <span>{int.etiqueta}</span>
                          <span>{int.porcentaje}%</span>
                        </div>
                        <div className="admin-interest-bar">
                          <div
                            className="admin-interest-fill"
                            style={{ width: `${int.porcentaje}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="dashboard__section">
                <div className="dashboard__section-header">
                  <h2>Catálogo activo ({stats.lugares} lugares · {stats.restaurantes} restaurantes · {stats.alojamientos} alojamientos · {stats.eventos} eventos)</h2>
                  <Link to="/admin/eventos" className="section-link">
                    Ver todos los eventos
                  </Link>
                </div>
                <div className="dashboard__table-wrap">
                  <table className="admin-crud__table">
                    <thead>
                      <tr>
                        <th>Evento</th>
                        <th>Fecha</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEvents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="admin-crud__empty">
                            No hay eventos próximos.
                          </td>
                        </tr>
                      ) : (
                        recentEvents.map((ev) => (
                          <tr key={ev.id}>
                            <td className="admin-crud__table-name">{ev.nombre}</td>
                            <td>{formatDate(ev.fecha_inicio)}</td>
                            <td>{ev.categoria || '—'}</td>
                            <td>
                              <span
                                className={`admin-crud__badge ${
                                  ev.activo
                                    ? 'admin-crud__badge--active'
                                    : 'admin-crud__badge--inactive'
                                }`}
                              >
                                {ev.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="dashboard__section">
                <h2>Administración de contenido</h2>
                <div className="dashboard__quick-actions">
                  {QUICK_ACTIONS.map(({ to, label, icon }) => (
                    <Link key={to} to={to} className="dashboard__quick-btn">
                      <Icon name={icon} size={18} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
