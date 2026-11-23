import { useAdminCrud } from '../../../hooks/useAdminCrud';
import AdminCrudView from '../../../components/admin/AdminCrudView';

const FIELDS = [
  { key: 'nombre',          label: 'Nombre',        type: 'text',     required: true },
  { key: 'descripcion',     label: 'Descripción',   type: 'textarea' },
  { key: 'imagen_url',      label: 'URL de imagen', type: 'url' },
  { key: 'direccion',       label: 'Dirección',     type: 'text' },
  { key: 'horario',         label: 'Horario',       type: 'text' },
  { key: 'rating_promedio', label: 'Rating (0-5)',  type: 'number',   step: '0.1', min: '0' },
  { key: 'latitud',         label: 'Latitud',       type: 'number',   step: 'any' },
  { key: 'longitud',        label: 'Longitud',      type: 'number',   step: 'any' },
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
  { key: 'direccion', label: 'Dirección' },
  {
    key: 'rating_promedio',
    label: 'Rating',
    render: (row) => row.rating_promedio ?? '—',
  },
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

export default function PlacesAdminPage() {
  const crud = useAdminCrud({
    table: 'lugares',
    singularLabel: 'lugar',
    transformPayload: (form) => ({
      ...form,
      activo: form.activo === 'true' || form.activo === true,
      rating_promedio: form.rating_promedio ? Number(form.rating_promedio) : null,
      latitud: form.latitud ? Number(form.latitud) : null,
      longitud: form.longitud ? Number(form.longitud) : null,
    }),
  });

  return (
    <AdminCrudView
      title="Lugares"
      singularLabel="lugar"
      createButtonLabel="+ Nuevo lugar"
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
