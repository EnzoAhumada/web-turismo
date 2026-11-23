import { Link } from 'react-router-dom';
import SmartImage from '../SmartImage';
import Icon from '../Icon';
import './Card.css';

export default function Card({
  image,
  title,
  subtitle,
  rating,
  reviewsCount,
  distance,
  badge,
  metaExtra,
  to,
  onClick,
}) {
  const inner = (
    <article className="card">
      <div className="card__img-wrap">
        <SmartImage src={image} alt={title} className="card__img" />
        {badge && <span className="card__badge">{badge}</span>}
      </div>
      <div className="card__body">
        <div className="card__top-row">
          <h3 className="card__title">{title}</h3>
          {rating !== undefined && rating !== null && (
            <span className="card__rating" aria-label={`Calificación ${rating}`}>
              <Icon name="star" size={14} filled />
              <span>{rating}</span>
            </span>
          )}
        </div>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        <div className="card__meta">
          {distance && (
            <span className="card__distance">
              <Icon name="map-pin" size={13} />
              <span>{distance}</span>
            </span>
          )}
          {reviewsCount !== undefined && reviewsCount !== null && (
            <span className="card__reviews">({reviewsCount} reseñas)</span>
          )}
          {metaExtra && <span className="card__extra">{metaExtra}</span>}
        </div>
      </div>
    </article>
  );

  if (to) return <Link to={to} className="card-link">{inner}</Link>;
  if (onClick) return <button type="button" className="card-link" onClick={onClick}>{inner}</button>;
  return inner;
}
