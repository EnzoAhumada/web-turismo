import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/ui/SearchBar';
import Card from '../components/ui/Card';
import StarRating from '../components/ui/StarRating';
import './HomePage.css';

export default function HomePage() {
  const { profile } = useAuth();
  const [featured, setFeatured] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('lugares')
        .select('*, categorias(nombre, slug)')
        .eq('activo', true)
        .order('rating_promedio', { ascending: false })
        .limit(4);

      if (data && data.length > 0) {
        setFeatured(data[0]);
        setRecommended(data.slice(1));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const CATEGORIES = [
    { id: 'religion',   label: 'Religioso',  color: '#9333ea', bg: '#fdf2f8' },
    { id: 'astronomia', label: 'Astronomía',  color: '#a78bfa', bg: '#1e1b4b' },
    { id: 'mineria',    label: 'Minería',     color: '#ca8a04', bg: '#fef9c3' },
    { id: 'naturaleza', label: 'Naturaleza',  color: '#16a34a', bg: '#dcfce7' },
  ];

  const nombre = profile?.nombre || 'Viajero';

  return (
    <>
      <Header />

      <main className="page-wrapper">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero__bg" aria-hidden="true" />
          <div className="home-hero__content container">
            <h1 className="home-hero__greeting">
              ¡Hola, {nombre}! 👋
              <span>¿A dónde quieres ir hoy?</span>
            </h1>
            <div className="home-hero__search">
              <SearchBar />
            </div>
          </div>
        </section>

        <div className="container page-content">
          {loading ? (
            <div className="home-loading">
              <div className="route-loading__spinner" />
            </div>
          ) : (
            <>
              {/* Featured + side */}
              <section className="home-featured" aria-label="Lugar destacado">
                {featured && (
                  <Link to={`/lugar/${featured.id}`} className="home-featured__card">
                    <img
                      src={featured.imagen_url}
                      alt={featured.nombre}
                      className="home-featured__img"
                    />
                    <div className="home-featured__overlay">
                      <div className="home-featured__info">
                        <p className="home-featured__label">Lugar destacado</p>
                        <h2 className="home-featured__title">{featured.nombre}</h2>
                        <p className="home-featured__subtitle">{featured.categorias?.nombre}</p>
                        <StarRating value={featured.rating_promedio} />
                      </div>
                    </div>
                  </Link>
                )}

                <div className="home-featured__side">
                  <h2 className="section-title">Categorías rápidas</h2>
                  <div className="home-categories">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/explorar?categoria=${cat.id}`}
                        className="home-cat-chip"
                        style={{ '--cat-bg': cat.bg, '--cat-color': cat.color }}
                      >
                        <span>{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="home-weather-banner">
                    <div className="home-weather-banner__icon">🌙</div>
                    <div>
                      <strong>¡Cielo despejado esta noche!</strong>
                      <p>Condiciones perfectas para observar estrellas</p>
                    </div>
                    <Link to="/astronomia" className="home-weather-banner__cta">
                      Ver ruta astronómica →
                    </Link>
                  </div>
                </div>
              </section>

              {/* Recommended */}
              <section className="home-section" aria-label="Recomendados">
                <div className="section-header">
                  <h2 className="section-title">Recomendado para ti</h2>
                  <Link to="/explorar" className="section-link">Ver todo</Link>
                </div>
                <div className="grid-3">
                  {recommended.map((place) => (
                    <Card
                      key={place.id}
                      image={place.imagen_url}
                      title={place.nombre}
                      subtitle={place.categorias?.nombre}
                      rating={place.rating_promedio}
                      to={`/lugar/${place.id}`}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Quick links */}
          <section className="home-section home-quick-links" aria-label="Accesos rápidos">
            <h2 className="section-title">Descubre más</h2>
            <div className="grid-4">
              {[
                { to: '/restaurantes',  label: 'Gastronomía',   icon: '🍽️', desc: 'Cocina local' },
                { to: '/alojamientos',  label: 'Alojamientos',  icon: '🏨', desc: 'Dónde dormir' },
                { to: '/eventos',       label: 'Eventos',       icon: '🎉', desc: 'Próximas festividades' },
                { to: '/experiencias',  label: 'Experiencias',  icon: '🎯', desc: 'Actividades únicas' },
              ].map(({ to, label, icon, desc }) => (
                <Link key={to} to={to} className="home-quick-card">
                  <span className="home-quick-card__icon">{icon}</span>
                  <strong>{label}</strong>
                  <p>{desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
