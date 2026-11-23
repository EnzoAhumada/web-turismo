import './LoadingState.css';

export default function LoadingState({ fullPage = false, message = 'Cargando información...' }) {
  return (
    <div
      className={`loading-state ${fullPage ? 'loading-state--full' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="route-loading__spinner" aria-hidden="true" />
      {message && <p className="loading-state__text">{message}</p>}
    </div>
  );
}
