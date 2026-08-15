import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/ui/SearchBar';
import Card from '../components/ui/Card';
import './ExplorerPage.css';

const TABS = [
  { id: 'lugares',       label: 'Lugares',       icon: '📍' },
  { id: 'restaurantes',  label: 'Restaurantes',   icon: '🍽️' },
  { id: 'alojamientos',  label: 'Alojamientos',   icon: '🏨' },
  { id: 'eventos',       label: 'Eventos',        icon: '🎉' },
  { id: 'experiencias',  label: 'Experiencias',   icon: '🎯' },
];

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'lugares');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [activeTab, searchQuery]);

  async function fetchItems() {
    setLoading(true);
    const q = searchQuery.trim();

    let data = [];

    if (activeTab === 'lugares') {
      let query = supabase
        .from('lugares')
        .select('*, categorias(nombre, slug)')
        .eq('activo', true);
      if (q) query = query.ilike('nombre', `%${q}%`);
      const { data: d } = await query.order('rating_promedio', { ascending: false });
      data = (d || []).map((item) => ({
        id: item.id,
        title: item.nombre,
        subtitle: item.categorias?.nombre,
        image: item.imagen_url,
        rating: item.rating_promedio,
        extra: item.horario,
        to: `/lugar/${item.id}`,
      }));
    } else if (activeTab === 'restaurantes') {
      let query = supabase.from('restaurantes').select('*').eq('activo', true);
      if (q) query = query.ilike('nombre', `%${q}%`);
      const { data: d } = await query.order('nombre');
      data = (d || []).map((item) => ({
        id: item.id,
        title: item.nombre,
        subtitle: item.precio_rango ? `Precio: ${item.precio_rango}` : 'Restaurante',
        image: item.imagen_url,
        extra: item.horario,
        badge: item.precio_rango,
        to: `/restaurantes/${item.id}`,
      }));
    } else if (activeTab === 'alojamientos') {
      let query = supabase.from('alojamientos').select('*').eq('activo', true);
      if (q) query = query.ilike('nombre', `%${q}%`);
      const { data: d } = await query.order('nombre');
      data = (d || []).map((item) => ({
        id: item.id,
        title: item.nombre,
        subtitle: item.precio_por_noche
          ? `$${Number(item.precio_por_noche).toLocaleString('es-CL')} / noche`
          : 'Alojamiento',
        image: item.imagen_url,
        extra: item.direccion,
        to: `/alojamientos/${item.id}`,
      }));
    } else if (activeTab === 'eventos') {
      let query = supabase.from('eventos').select('*').eq('activo', true);
      if (q) query = query.ilike('nombre', `%${q}%`);
      const { data: d } = await query.order('fecha_inicio', { ascending: true });
      data = (d || []).map((item) => ({
        id: item.id,
        title: item.nombre,
        subtitle: item.categoria,
        image: item.imagen_url,
        extra: item.fecha_inicio
          ? new Date(item.fecha_inicio + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
          : null,
        to: `/eventos/${item.id}`,
      }));
    } else if (activeTab === 'experiencias') {
      let query = supabase.from('experiencias').select('*');
      if (q) query = query.ilike('nombre', `%${q}%`);
      const { data: d } = await query.order('nombre');
      data = (d || []).map((item) => ({
        id: item.id,
        title: item.nombre,
        subtitle: item.categoria,
        image: item.imagen_url,
        extra: item.precio
          ? `$${Number(item.precio).toLocaleString('es-CL')} CLP`
          : null,
        to: `/experiencias/${item.id}`,
      }));
    }

    setItems(data);
    setLoading(false);
  }

  function changeTab(tabId) {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  }

  function handleSearch(val) {
    setSearchQuery(val);
  }

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="explorer-hero">
          <div className="explorer-hero__bg" aria-hidden="true" />
          <div className="explorer-hero__content container">
            <h1>Explorar Andacollo</h1>
            <p>Descubre lugares, gastronomía, alojamientos, eventos y experiencias únicas</p>
            <div className="explorer-hero__search">
              <SearchBar
                placeholder={`Buscar ${currentTab?.label.toLowerCase() || ''}…`}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="container page-content">
          {/* Tabs */}
          <nav className="explorer-tabs" aria-label="Tipo de contenido">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`explorer-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => changeTab(tab.id)}
              >
                <span className="explorer-tab__icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Results */}
          <section className="explorer-results" aria-label={`Lista de ${currentTab?.label}`}>
            <div className="section-header">
              <h2 className="section-title">
                {currentTab?.icon} {currentTab?.label}
                {searchQuery && ` · "${searchQuery}"`}
              </h2>
              {!loading && (
                <span className="section-link">{items.length} resultado{items.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {loading ? (
              <div className="explorer-loading">
                <div className="route-loading__spinner" />
              </div>
            ) : items.length > 0 ? (
              <div className="grid-3">
                {items.map((item) => (
                  <div key={item.id} className="explorer-item">
                    <Card
                      image={item.image}
                      title={item.title}
                      subtitle={item.subtitle}
                      rating={item.rating}
                      badge={item.badge}
                      to={item.to}
                    />
                    {item.extra && (
                      <p className="explorer-item__extra">{item.extra}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">{currentTab?.icon}</div>
                <h3>No se encontraron {currentTab?.label.toLowerCase()}</h3>
                <p>
                  {searchQuery
                    ? `No hay resultados para "${searchQuery}". Intenta con otra búsqueda.`
                    : 'Aún no hay elementos en esta categoría.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
