import { useAdminCrud } from '../../../hooks/useAdminCrud';
import AdminCrudView from '../../../components/admin/AdminCrudView';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const FIELDS = [
  { key: 'nombre',       label: 'Nombre',        type: 'text',     required: true },
  { key: 'descripcion',  label: 'Descripción',   type: 'textarea' },
  { key: 'imagen_url',   label: 'URL de imagen', type: 'url' },
  { key: 'fecha_inicio', label: 'Fecha inicio',  type: 'date' },
  { key: 'fecha_fin',    label: 'Fecha fin',     type: 'date' },
  { key: 'categoria',    label: 'Categoría',     type: 'text' },
  {
    key: 'activo',
    label: 'Estado',
    type: 'select',
    default: 'true',
    options: [
      { value: 'true', label: 'Activo' },
      { value: 'false', label: 'Inactivo' },
    ],
  },
];

const COLUMNS = [
  {
    key: 'imagen_url',
    label: 'Imagen',
    render: (row) =>
      row.imagen_url ? (
        <img src={row.imagen_url} alt={row.nombre} className="admin-crud__table-img" />
      ) : (
        '—'
      ),
  },
  { key: 'nombre', label: 'Nombre', isName: true },
  { key: 'fecha_inicio', label: 'Fecha inicio', render: (row) => formatDate(row.fecha_inicio) },
  { key: 'fecha_fin', label: 'Fecha fin', render: (row) => formatDate(row.fecha_fin) },
  { key: 'categoria', label: 'Categoría', render: (row) => row.categoria || '—' },
  {
    key: 'activo',
    label: 'Estado',
    render: (row) => (
      <span
        className={`admin-crud__badge ${
          row.activo ? 'admin-crud__badge--active' : 'admin-crud__badge--inactive'
        }`}
      >
        {row.activo ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

export default function EventsAdminPage() {
  const crud = useAdminCrud({
    table: 'eventos',
    singularLabel: 'evento',
    orderColumn: 'fecha_inicio',
    ascending: true,
    transformPayload: (form) => ({
      ...form,
      activo: form.activo === 'true' || form.activo === true,
    }),
  });

  return (
    <AdminCrudView
      title="Eventos"
      singularLabel="evento"
      createButtonLabel="+ Nuevo evento"
      columns={COLUMNS}
      fields={FIELDS}
      rows={crud.rows}
      loading={crud.loading}
      feedback={crud.feedback}
      onClearFeedback={crud.clearFeedback}
      modalRecord={crud.modalRecord}
      onOpenModal={crud.setModalRecord}
      onCloseModal={() => crud.setModalRecord(null)}
      onSave={crud.handleSave}
      confirmDeleteTarget={crud.confirmDeleteTarget}
      deleting={crud.deleting}
      onRequestDelete={crud.requestDelete}
      onCancelDelete={crud.cancelDelete}
      onConfirmDelete={crud.confirmDelete}
    />
  );
}
