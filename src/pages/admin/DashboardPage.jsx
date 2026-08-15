import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/layout/AdminSidebar';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    lugares: 0,
    restaurantes: 0,
    alojamientos: 0,
    eventos: 0,
    usuarios: 0,
    favoritos: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: lugares },
        { count: restaurantes },
        { count: alojamientos },
        { count: eventos },
        { count: usuarios },
        { count: favoritos },
        { data: eventsData },
      ] = await Promise.all([
        supabase.from('lugares').select('*', { count: 'exact', head: true }),
        supabase.from('restaurantes').select('*', { count: 'exact', head: true }),
        supabase.from('alojamientos').select('*', { count: 'exact', head: true }),
        supabase.from('eventos').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('favoritos').select('*', { count: 'exact', head: true }),
        supabase.from('eventos').select('id, nombre, fecha_inicio, categoria, activo').order('fecha_inicio', { ascending: true }).limit(5),
      ]);

      setStats({
        lugares: lugares || 0,
        restaurantes: restaurantes || 0,
        alojamientos: alojamientos || 0,
        eventos: eventos || 0,
        usuarios: usuarios || 0,
        favoritos: favoritos || 0,
      });
      setRecentEvents(eventsData || []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  }

  const KPI_CARDS = [
    { label: 'Lugares',        value: stats.lugares,      icon: '📍', to: '/admin/lugares',       color: '#3b82f6' },
    { label: 'Restaurantes',   value: stats.restaurantes, icon: '🍽️', to: '/admin/restaurantes',  color: '#f59e0b' },
    { label: 'Alojamientos',   value: stats.alojamientos, icon: '🏨', to: '/admin/alojamientos',  color: '#10b981' },
    { label: 'Eventos',        value: stats.eventos,      icon: '🎉', to: '/admin/eventos',       color: '#8b5cf6' },
    { label: 'Usuarios',       value: stats.usuarios,     icon: '👥', to: '/admin',               color: '#ec4899' },
    { label: 'Favoritos totales', value: stats.favoritos,  icon: '❤️', to: '/admin',              color: '#ef4444' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="dashboard">
          <div className="dashboard__header">
            <h1 className="dashboard__title">Panel de administración</h1>
            <p className="dashboard__subtitle">Resumen general de ThakiGo</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="route-loading__spinner" />
            </div>
          ) : (
            <>
              {/* KPI Grid */}
              <div className="dashboard__kpis">
                {KPI_CARDS.map(({ label, value, icon, to, color }) => (
                  <Link to={to} key={label} className="kpi-card" style={{ '--kpi-color': color }}>
                    <div className="kpi-card__icon">{icon}</div>
                    <div className="kpi-card__body">
                      <p className="kpi-card__value">{value.toLocaleString()}</p>
                      <p className="kpi-card__label">{label}</p>
                    </div>
                    <div className="kpi-card__stripe" />
                  </Link>
                ))}
              </div>

              {/* Próximos eventos */}
              <section className="dashboard__section">
                <div className="dashboard__section-header">
                  <h2>Próximos eventos</h2>
                  <Link to="/admin/eventos" className="section-link">Ver todos</Link>
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
                        <tr><td colSpan={4} className="admin-crud__empty">No hay eventos próximos.</td></tr>
                      ) : recentEvents.map((ev) => (
                        <tr key={ev.id}>
                          <td className="admin-crud__table-name">{ev.nombre}</td>
                          <td>{formatDate(ev.fecha_inicio)}</td>
                          <td>{ev.categoria || '—'}</td>
                          <td>
                            <span className={`admin-crud__badge ${ev.activo ? 'admin-crud__badge--active' : 'admin-crud__badge--inactive'}`}>
                              {ev.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Quick actions */}
              <section className="dashboard__section">
                <h2>Acciones rápidas</h2>
                <div className="dashboard__quick-actions">
                  {[
                    { to: '/admin/lugares',      label: 'Nuevo lugar',       icon: '📍' },
                    { to: '/admin/restaurantes', label: 'Nuevo restaurante', icon: '🍽️' },
                    { to: '/admin/alojamientos', label: 'Nuevo alojamiento', icon: '🏨' },
                    { to: '/admin/eventos',      label: 'Nuevo evento',      icon: '🎉' },
                  ].map(({ to, label, icon }) => (
                    <Link key={to} to={to} className="dashboard__quick-btn">
                      <span>{icon}</span>
                      {label}
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
