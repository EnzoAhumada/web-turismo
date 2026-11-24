import Icon from '../Icon';
import './StarRating.css';

export default function StarRating({ value, count }) {
  const numericCount = count !== undefined && count !== null ? Number(count) : null;
  const numericValue = value !== undefined && value !== null ? Number(value) : 0;
  const hasReviews = numericCount === null ? numericValue > 0 : numericCount > 0;
  const displayValue = hasReviews ? numericValue.toFixed(1) : 'Nuevo';

  const countLabel =
    numericCount === null
      ? null
      : numericCount === 0
        ? '(Sin reseñas)'
        : numericCount === 1
          ? '(1 reseña)'
          : `(${numericCount} reseñas)`;

  return (
    <div className="star-rating">
      <span className="star-rating__icon" aria-hidden="true">
        <Icon name="star" size={15} filled={hasReviews} />
      </span>
      <span className="star-rating__value">{displayValue}</span>
      {countLabel && <span className="star-rating__count">{countLabel}</span>}
    </div>
  );
}
