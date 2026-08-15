import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './GamificationPage.css';

const BADGES = [
  { id: 1, icon: '🏅', name: 'Explorador', desc: 'Visitaste 5 lugares', earned: true },
  { id: 2, icon: '⛏️', name: 'Ruta Minera', desc: 'Completaste el circuito minero', earned: true },
  { id: 3, icon: '⭐', name: 'Cazador de Estrellas', desc: 'Asististe a observación astronómica', earned: true },
  { id: 4, icon: '🍽️', name: 'Gourmet Local', desc: 'Probaste 3 restaurantes', earned: false },
  { id: 5, icon: '🏔️', name: 'Trekker', desc: 'Completaste 3 rutas de senderismo', earned: false },
  { id: 6, icon: '📸', name: 'Fotógrafo', desc: 'Compartiste 10 fotos', earned: false },
];

const CHALLENGES = [
  { id: 1, title: 'Visita el Santuario', desc: 'Ve al Santuario de Andacollo esta semana', xp: 150, progress: 100, done: true },
  { id: 2, title: 'Noche de estrellas', desc: 'Asiste a una observación astronómica', xp: 200, progress: 60, done: false },
  { id: 3, title: 'Ruta gastronómica', desc: 'Visita 3 restaurantes locales', xp: 100, progress: 33, done: false },
  { id: 4, title: 'Explorador activo', desc: 'Explora 5 lugares en un mes', xp: 300, progress: 40, done: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Carlos Muñoz', level: 12, xp: 5820, avatar: 'https://i.pravatar.cc/40?img=33' },
  { rank: 2, name: 'María Torres', level: 10, xp: 4950, avatar: 'https://i.pravatar.cc/40?img=47' },
  { rank: 3, name: 'Ana Valdés', level: 3, xp: 1200, avatar: 'https://i.pravatar.cc/40?img=44', isMe: true },
  { rank: 4, name: 'Pedro Silva', level: 2, xp: 840, avatar: 'https://i.pravatar.cc/40?img=12' },
  { rank: 5, name: 'Lucía Pérez', level: 1, xp: 620, avatar: 'https://i.pravatar.cc/40?img=9' },
];

const LEVEL = { current: 3, name: 'Viajero Experto', xp: 1200, nextXp: 3000, places: 23, routes: 8, badges: 12 };

export default function GamificationPage() {
  const pct = Math.round((LEVEL.xp / LEVEL.nextXp) * 100);

  return (
    <>
      <Header user={{ name: 'Ana Valdés' }} />
      <main className="page-wrapper">
        <div className="container page-content">
          {/* Profile header */}
          <section className="game-profile">
            <div className="game-profile__avatar">
              <img src="https://i.pravatar.cc/80?img=44" alt="Ana Valdés" />
              <span className="game-profile__level">Nv. {LEVEL.current}</span>
            </div>
            <div className="game-profile__info">
              <h1 className="game-profile__name">Ana Valdés</h1>
              <p className="game-profile__title">{LEVEL.name}</p>
              <div className="game-xp">
                <div className="game-xp__bar">
                  <div className="game-xp__fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="game-xp__text">{LEVEL.xp} / {LEVEL.nextXp} XP</span>
              </div>
            </div>
            <div className="game-profile__stats">
              <div className="game-stat">
                <strong>{LEVEL.places}</strong>
                <span>Lugares visitados</span>
              </div>
              <div className="game-stat">
                <strong>{LEVEL.routes}</strong>
                <span>Rutas completadas</span>
              </div>
              <div className="game-stat">
                <strong>{LEVEL.badges}</strong>
                <span>Insignias</span>
              </div>
            </div>
          </section>

          <div className="game-layout">
            <div className="game-main">
              {/* Badges */}
              <section className="game-section">
                <div className="section-header">
                  <h2 className="section-title">Logros</h2>
                  <button type="button" className="section-link">Ver todos</button>
                </div>
                <div className="game-badges">
                  {BADGES.map((badge) => (
                    <div key={badge.id} className={`game-badge ${badge.earned ? '' : 'game-badge--locked'}`}>
                      <span className="game-badge__icon">{badge.icon}</span>
                      <strong className="game-badge__name">{badge.name}</strong>
                      <p className="game-badge__desc">{badge.desc}</p>
                      {!badge.earned && <span className="game-badge__lock">🔒</span>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Challenges */}
              <section className="game-section">
                <h2 className="section-title">Desafíos activos</h2>
                <ul className="game-challenges">
                  {CHALLENGES.map((c) => (
                    <li key={c.id} className={`game-challenge ${c.done ? 'game-challenge--done' : ''}`}>
                      <div className="game-challenge__header">
                        <div>
                          <h3 className="game-challenge__title">{c.title}</h3>
                          <p className="game-challenge__desc">{c.desc}</p>
                        </div>
                        <span className={`game-challenge__xp ${c.done ? 'done' : ''}`}>+{c.xp} XP</span>
                      </div>
                      <div className="game-challenge__progress-wrap">
                        <div className="game-challenge__progress">
                          <div
                            className="game-challenge__progress-fill"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                        <span className="game-challenge__pct">{c.progress}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Leaderboard */}
            <aside className="game-sidebar">
              <div className="game-leaderboard">
                <h2 className="section-title">Tabla de posiciones</h2>
                <ol className="game-leaderboard-list">
                  {LEADERBOARD.map((user) => (
                    <li key={user.rank} className={`game-lb-item ${user.isMe ? 'me' : ''}`}>
                      <span className={`game-lb-rank game-lb-rank--${user.rank <= 3 ? user.rank : 'other'}`}>
                        {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
                      </span>
                      <img src={user.avatar} alt={user.name} className="game-lb-avatar" />
                      <div className="game-lb-info">
                        <strong>{user.name}{user.isMe ? ' (tú)' : ''}</strong>
                        <p>Nivel {user.level} · {user.xp.toLocaleString('es-CL')} XP</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <Link to="/explorar" className="game-cta-card">
                <span className="game-cta-card__icon">🗺️</span>
                <div>
                  <strong>¡Sigue explorando!</strong>
                  <p>Descubre nuevos lugares y gana XP</p>
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
