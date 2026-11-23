import { Link } from 'react-router-dom';
import { useGamification } from '../../hooks/useGamification';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './GamificationPage.css';

const MEDAL_PALETTE = [
  { bg: '#FFB800', ring: '#d97706', text: '#ffffff' },
  { bg: '#10b981', ring: '#047857', text: '#ffffff' },
  { bg: '#4f46e5', ring: '#3730a3', text: '#ffffff' },
  { bg: '#ea580c', ring: '#c2410c', text: '#ffffff' },
  { bg: '#0284c7', ring: '#0369a1', text: '#ffffff' },
  { bg: '#9333ea', ring: '#7e22ce', text: '#ffffff' },
];

export default function GamificationPage() {
  const { levelInfo, badges, challenges, leaderboard, loading, error } = useGamification();

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="container page-content">
          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message="Cargando logros y tabla de posiciones..." />
          ) : (
            <>
              <section className="game-profile">
                <div className="game-profile__avatar">
                  <img src={levelInfo.avatar} alt={levelInfo.displayName} />
                  <span className="game-profile__level">Nv. {levelInfo.current}</span>
                </div>
                <div className="game-profile__info">
                  <h1 className="game-profile__name">{levelInfo.displayName}</h1>
                  <p className="game-profile__title">{levelInfo.name}</p>
                  <div className="game-xp">
                    <div className="game-xp__bar">
                      <div
                        className="game-xp__fill"
                        style={{ width: `${levelInfo.pct}%` }}
                      />
                    </div>
                    <span className="game-xp__text">
                      {levelInfo.xp} / {levelInfo.nextXp} XP
                    </span>
                  </div>
                </div>
                <div className="game-profile__stats">
                  <div className="game-stat">
                    <strong>{levelInfo.places}</strong>
                    <span>Lugares visitados</span>
                  </div>
                  <div className="game-stat">
                    <strong>{levelInfo.routes}</strong>
                    <span>Rutas completadas</span>
                  </div>
                  <div className="game-stat">
                    <strong>{levelInfo.badgesCount}</strong>
                    <span>Insignias</span>
                  </div>
                </div>
              </section>

              <div className="game-layout">
                <div className="game-main">
                  <section className="game-section">
                    <div className="section-header">
                      <h2 className="section-title">Logros</h2>
                      <Link to="/explorar" className="section-link">
                        Explorar más
                      </Link>
                    </div>
                    <div className="game-badges">
                      {badges.map((badge, idx) => {
                        const palette = MEDAL_PALETTE[idx % MEDAL_PALETTE.length];
                        return (
                          <div
                            key={badge.id}
                            className={`game-badge ${badge.earned ? '' : 'game-badge--locked'}`}
                          >
                            <div
                              className="game-badge__medal"
                              style={{
                                background: palette.bg,
                                borderColor: palette.ring,
                                color: palette.text,
                              }}
                            >
                              <Icon name={badge.icon || 'award'} size={26} />
                            </div>
                            <strong className="game-badge__name">{badge.name}</strong>
                            <p className="game-badge__desc">{badge.desc}</p>
                            {!badge.earned && (
                              <span className="game-badge__lock" aria-label="Bloqueada">
                                <Icon name="lock" size={14} />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="game-section">
                    <h2 className="section-title">Desafíos activos</h2>
                    <ul className="game-challenges">
                      {challenges.map((c) => (
                        <li
                          key={c.id}
                          className={`game-challenge ${c.done ? 'game-challenge--done' : ''}`}
                        >
                          <div className="game-challenge__header">
                            <div>
                              <h3 className="game-challenge__title">{c.title}</h3>
                              <p className="game-challenge__desc">{c.desc}</p>
                            </div>
                            <span className={`game-challenge__xp ${c.done ? 'done' : ''}`}>
                              +{c.xp} XP
                            </span>
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

                <aside className="game-sidebar">
                  <div className="game-leaderboard">
                    <h2 className="section-title">Tabla de posiciones</h2>
                    <ol className="game-leaderboard-list">
                      {leaderboard.map((u) => (
                        <li key={u.id || u.rank} className={`game-lb-item ${u.isMe ? 'me' : ''}`}>
                          <span
                            className={`game-lb-rank game-lb-rank--${
                              u.rank <= 3 ? u.rank : 'other'
                            }`}
                          >
                            {u.rank <= 3 ? <Icon name="trophy" size={18} /> : u.rank}
                          </span>
                          <img src={u.avatar} alt={u.name} className="game-lb-avatar" />
                          <div className="game-lb-info">
                            <strong>
                              {u.name}
                              {u.isMe ? ' (tú)' : ''}
                            </strong>
                            <p>
                              Nivel {u.level} · {u.xp.toLocaleString('es-CL')} XP
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Link to="/explorar" className="game-cta-card">
                    <span className="game-cta-card__icon">
                      <Icon name="compass" size={26} />
                    </span>
                    <div>
                      <strong>¡Sigue explorando!</strong>
                      <p>Descubre nuevos lugares y gana XP</p>
                    </div>
                  </Link>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
