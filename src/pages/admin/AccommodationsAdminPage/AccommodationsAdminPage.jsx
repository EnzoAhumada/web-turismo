import { useAdminCrud } from '../../../hooks/useAdminCrud';
import AdminCrudView from '../../../components/admin/AdminCrudView';

const FIELDS = [
  { key: 'nombre',           label: 'Nombre',                type: 'text',     required: true },
  { key: 'descripcion',      label: 'Descripción',           type: 'textarea' },
  { key: 'imagen_url',       label: 'URL de imagen',         type: 'url' },
  { key: 'direccion',        label: 'Dirección',             type: 'text' },
  { key: 'precio_por_noche', label: 'Precio por noche (CLP)', type: 'number',  step: '1', min: '0' },
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
    key: 'precio_por_noche',
    label: 'Precio/noche',
    render: (row) =>
      row.precio_por_noche
        ? `$${Number(row.precio_por_noche).toLocaleString('es-CL')}`
        : '—',
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

export default function AccommodationsAdminPage() {
  const crud = useAdminCrud({
    table: 'alojamientos',
    singularLabel: 'alojamiento',
    transformPayload: (form) => ({
      ...form,
      activo: form.activo === 'true' || form.activo === true,
      precio_por_noche: form.precio_por_noche ? Number(form.precio_por_noche) : null,
    }),
  });

  return (
    <AdminCrudView
      title="Alojamientos"
      singularLabel="alojamiento"
      createButtonLabel="+ Nuevo alojamiento"
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
