import Icon from '../Icon';
import './FeedbackBanner.css';

export default function FeedbackBanner({ type = 'info', message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className={`feedback-banner feedback-banner--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className="feedback-banner__text">{message}</span>
      {onDismiss && (
        <button
          type="button"
          className="feedback-banner__close"
          onClick={(e) => {
            e.preventDefault();
            onDismiss();
          }}
          aria-label="Cerrar notificación"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
