import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StarRating from '../components/ui/StarRating';
import './FavoritesPage.css';

const TABS = ['Lugares', 'Experiencias', 'Eventos'];

export default function FavoritesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Lugares');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const tipoMap = { 'Lugares': 'lugar', 'Experiencias': 'experiencia', 'Eventos': 'evento' };

  useEffect(() => {
    if (!user) return;
    fetchFavorites();
  }, [user, activeTab]);

  async function fetchFavorites() {
    setLoading(true);
    const tipo = tipoMap[activeTab];

    const { data: favRows } = await supabase
      .from('favoritos')
      .select('id, item_id, tipo')
      .eq('user_id', user.id)
      .eq('tipo', tipo);

    if (!favRows || favRows.length === 0) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const ids = favRows.map((f) => f.item_id);

    let items = [];
    if (tipo === 'lugar') {
      const { data } = await supabase
        .from('lugares')
        .select('id, nombre, imagen_url, rating_promedio, categorias(nombre)')
        .in('id', ids);
      items = (data || []).map((d) => ({
        ...d,
        title: d.nombre,
        category: d.categorias?.nombre,
        image: d.imagen_url,
        rating: d.rating_promedio,
        favId: favRows.find((f) => f.item_id === d.id)?.id,
      }));
    } else if (tipo === 'experiencia') {
      const { data } = await supabase
        .from('experiencias')
        .select('id, nombre, imagen_url, categoria, precio')
        .in('id', ids);
      items = (data || []).map((d) => ({
        ...d,
        title: d.nombre,
        category: d.categoria,
        image: d.imagen_url,
        favId: favRows.find((f) => f.item_id === d.id)?.id,
      }));
    } else if (tipo === 'evento') {
      const { data } = await supabase
        .from('eventos')
        .select('id, nombre, imagen_url, categoria, fecha_inicio')
        .in('id', ids);
      items = (data || []).map((d) => ({
        ...d,
        title: d.nombre,
        category: d.categoria,
        image: d.imagen_url,
        favId: favRows.find((f) => f.item_id === d.id)?.id,
      }));
    }

    setFavorites(items);
    setLoading(false);
  }

  async function removeFavorite(favId) {
    await supabase.from('favoritos').delete().eq('id', favId);
    setFavorites((prev) => prev.filter((item) => item.favId !== favId));
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content">
          <header className="favs-header">
            <h1 className="section-title">Mis Favoritos</h1>
            <p className="favs-header__count">{loading ? '…' : favorites.length} guardados</p>
          </header>

          <nav className="tabs" aria-label="Categorías de favoritos">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="route-loading__spinner" />
            </div>
          ) : favorites.length > 0 ? (
            <ul className="favs-list">
              {favorites.map((item) => (
                <li key={item.id} className="favs-item">
                  <Link to={`/lugar/${item.id}`} className="favs-item__link">
                    <img src={item.image} alt={item.title} className="favs-item__img" />
                    <div className="favs-item__body">
                      <p className="favs-item__category">{item.category}</p>
                      <h3 className="favs-item__title">{item.title}</h3>
                      {item.rating !== undefined && (
                        <div className="favs-item__meta">
                          <StarRating value={item.rating} />
                        </div>
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="favs-item__remove"
                    onClick={() => removeFavorite(item.favId)}
                    aria-label={`Quitar ${item.title} de favoritos`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <h3>No tienes {activeTab.toLowerCase()} guardados</h3>
              <p>Explora Andacollo y guarda tus favoritos</p>
              <Link to="/explorar" className="section-link" style={{ marginTop: '1.6rem', display: 'inline-block' }}>
                Explorar →
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
