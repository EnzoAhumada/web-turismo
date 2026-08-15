import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StarRating from '../components/ui/StarRating';
import './ExperiencesPage.css';

const TABS = ['Todas', 'Tours', 'Gastronomía', 'Aventura'];

export default function ExperiencesPage() {
  const [activeTab, setActiveTab] = useState('Todas');
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExp() {
      setLoading(true);
      let query = supabase.from('experiencias').select('*');
      if (activeTab !== 'Todas') {
        query = query.eq('categoria', activeTab);
      }
      const { data } = await query.order('created_at', { ascending: false });
      setExperiences(data || []);
      setLoading(false);
    }
    fetchExp();
  }, [activeTab]);

  function formatPrice(p) {
    if (!p) return '';
    return `$${Number(p).toLocaleString('es-CL')} CLP`;
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <section className="exp-hero">
          <div className="exp-hero__bg" aria-hidden="true" />
          <div className="exp-hero__content container">
            <h1>Experiencias</h1>
            <p>Reserva actividades únicas en Andacollo</p>
          </div>
        </section>

        <div className="container page-content">
          <nav className="tabs" aria-label="Filtrar por categoría">
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
          ) : (
            <div className="exp-grid">
              {experiences.map((exp) => (
                <article key={exp.id} className={`exp-card ${!exp.disponible ? 'exp-card--unavailable' : ''}`}>
                  <Link to={`/experiencias/${exp.id}`} className="exp-card__img-wrap">
                    <img src={exp.imagen_url} alt={exp.nombre} className="exp-card__img" loading="lazy" />
                    {!exp.disponible && (
                      <div className="exp-card__unavailable-overlay">
                        <span>No disponible</span>
                      </div>
                    )}
                  </Link>
                  <div className="exp-card__body">
                    <div className="exp-card__top">
                      <div>
                        <p className="exp-card__category">{exp.categoria}</p>
                        <Link to={`/experiencias/${exp.id}`} style={{ textDecoration: 'none' }}>
                          <h3 className="exp-card__title">{exp.nombre}</h3>
                        </Link>
                      </div>
                      <div className="exp-card__price">{formatPrice(exp.precio)}</div>
                    </div>
                    <p className="exp-card__category" style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{exp.descripcion}</p>
                    <div className="exp-card__footer">
                      <span className="exp-card__duration">⏱ {exp.duracion}</span>
                      <Link to={`/experiencias/${exp.id}`} className="exp-card__btn">
                        {exp.disponible !== false ? 'Reservar' : 'Ver detalles'}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
