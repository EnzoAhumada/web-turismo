import Icon from '../Icon';
import './StarRating.css';

export default function StarRating({ value, count }) {
  return (
    <div className="star-rating">
      <span className="star-rating__icon" aria-hidden="true">
        <Icon name="star" size={15} filled />
      </span>
      <span className="star-rating__value">{value}</span>
      {count !== undefined && count !== null && (
        <span className="star-rating__count">({count} reseñas)</span>
      )}
    </div>
  );
}
