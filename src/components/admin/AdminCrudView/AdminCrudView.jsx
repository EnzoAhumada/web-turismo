import AdminSidebar from '../../layout/AdminSidebar';
import AdminCrudModal from '../AdminCrudModal';
import ConfirmModal from '../../ui/ConfirmModal';
import FeedbackBanner from '../../ui/FeedbackBanner';
import LoadingState from '../../ui/LoadingState';
import '../AdminCrud.css';
import './AdminCrudView.css';

export default function AdminCrudView({
  title,
  singularLabel,
  createButtonLabel,
  columns = [],
  fields = [],
  rows = [],
  loading = false,
  feedback = null,
  onClearFeedback,
  modalRecord = null,
  onOpenModal,
  onCloseModal,
  onSave,
  confirmDeleteTarget = null,
  deleting = false,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-crud">
          <div className="admin-crud__header">
            <h1 className="admin-crud__title">{title}</h1>
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                onOpenModal({});
              }}
            >
              {createButtonLabel}
            </button>
          </div>

          {feedback && (
            <FeedbackBanner
              type={feedback.type}
              message={feedback.message}
              onDismiss={onClearFeedback}
            />
          )}

          {loading ? (
            <LoadingState message={`Cargando ${title.toLowerCase()}...`} />
          ) : (
            <div className="admin-crud__table-wrap">
              <table className="admin-crud__table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="admin-crud__empty">
                        No hay registros de {title.toLowerCase()}.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id}>
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={col.isName ? 'admin-crud__table-name' : ''}
                          >
                            {col.render ? col.render(row) : row[col.key] ?? '—'}
                          </td>
                        ))}
                        <td>
                          <div className="admin-crud__table-actions">
                            <button
                              type="button"
                              className="admin-crud__btn-edit"
                              onClick={(e) => {
                                e.preventDefault();
                                onOpenModal(row);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="admin-crud__btn-delete"
                              onClick={(e) => {
                                e.preventDefault();
                                onRequestDelete(row);
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {modalRecord !== null && (
          <AdminCrudModal
            title={
              modalRecord.id
                ? `Editar ${singularLabel}`
                : `Nuevo ${singularLabel}`
            }
            fields={fields}
            record={modalRecord.id ? modalRecord : null}
            onSave={onSave}
            onClose={onCloseModal}
          />
        )}

        <ConfirmModal
          isOpen={Boolean(confirmDeleteTarget)}
          title={`Eliminar ${singularLabel}`}
          message={
            confirmDeleteTarget
              ? `¿Estás seguro de que deseas eliminar "${confirmDeleteTarget.nombre}"? Esta acción no se puede deshacer.`
              : ''
          }
          confirmLabel="Eliminar definitivamente"
          cancelLabel="Cancelar"
          loading={deleting}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      </main>
    </div>
  );
}
