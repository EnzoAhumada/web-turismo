import { Link } from 'react-router-dom';
import './Card.css';

export default function Card({ image, title, subtitle, rating, distance, badge, to, onClick }) {
  const inner = (
    <article className="card">
      <div className="card__img-wrap">
        <img src={image} alt={title} className="card__img" loading="lazy" />
        {badge && <span className="card__badge">{badge}</span>}
      </div>
      <div className="card__body">
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        <h3 className="card__title">{title}</h3>
        <div className="card__meta">
          {rating !== undefined && (
            <span className="card__rating">
              <svg viewBox="0 0 24 24" fill="var(--color-gold)" width="14" height="14">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </span>
          )}
          {distance && (
            <span className="card__distance">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {distance}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (to) return <Link to={to} className="card-link">{inner}</Link>;
  if (onClick) return <button className="card-link" onClick={onClick}>{inner}</button>;
  return inner;
}
