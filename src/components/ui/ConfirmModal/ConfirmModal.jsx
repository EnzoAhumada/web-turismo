import './ConfirmModal.css';

export default function ConfirmModal({
  isOpen,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas realizar esta acción?',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        e.preventDefault();
        if (!loading && onCancel) onCancel();
      }}
    >
      <div
        className="modal confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={(e) => {
              e.preventDefault();
              if (!loading && onCancel) onCancel();
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="confirm-modal__body">
          <p className="confirm-modal__message">{message}</p>
        </div>

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="btn-secondary"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              if (onCancel) onCancel();
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-modal__btn-danger"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              if (onConfirm) onConfirm();
            }}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
