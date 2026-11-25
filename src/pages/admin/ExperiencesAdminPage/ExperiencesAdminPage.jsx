import { useAdminCrud } from '../../../hooks/useAdminCrud';
import AdminCrudView from '../../../components/admin/AdminCrudView';

function formatClp(value) {
  if (value === 0 || value === '0') return 'Gratis';
  const num = Number(value);
  if (!num || Number.isNaN(num)) return 'Consultar';
  return `$${num.toLocaleString('es-CL')} CLP`;
}

function incluyeToText(value) {
  if (Array.isArray(value)) return value.join('\n');
  return value || '';
}

const FIELDS = [
  { key: 'nombre', label: 'Nombre de la experiencia', type: 'text', required: true },
  {
    key: 'categoria',
    label: 'Categoría',
    type: 'select',
    default: 'Tours',
    options: [
      { value: 'Tours', label: 'Tours' },
      { value: 'Gastronomía', label: 'Gastronomía' },
      { value: 'Aventura', label: 'Aventura' },
      { value: 'Astroturismo', label: 'Astroturismo' },
      { value: 'Cultura', label: 'Cultura' },
    ],
  },
  { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  { key: 'imagen_url', label: 'URL de imagen', type: 'url' },
  { key: 'precio', label: 'Precio referencial (CLP). 0 = gratis', type: 'number', min: '0', step: '1' },
  { key: 'duracion', label: 'Duración estimada', type: 'text', default: '1 hora 30 minutos' },
  {
    key: 'incluye',
    label: 'Qué incluye (una línea por ítem)',
    type: 'textarea',
  },
  {
    key: 'icono',
    label: 'Ícono',
    type: 'select',
    default: 'compass',
    options: [
      { value: 'compass', label: 'Brújula' },
      { value: 'moon-star', label: 'Astronomía' },
      { value: 'sun', label: 'Sol' },
      { value: 'church', label: 'Templo' },
      { value: 'landmark', label: 'Patrimonio' },
      { value: 'pickaxe', label: 'Minería' },
      { value: 'mountain', label: 'Cerro' },
      { value: 'camera', label: 'Fotografía' },
      { value: 'footprints', label: 'Caminata' },
    ],
  },
  { key: 'rating_promedio', label: 'Calificación (1.0 a 5.0)', type: 'number', min: '0', max: '5', step: '0.1' },
  { key: 'resenas_count', label: 'Cantidad de reseñas', type: 'number', min: '0', step: '1', default: '0' },
  { key: 'comuna', label: 'Comuna', type: 'text', default: 'Andacollo' },
  { key: 'region', label: 'Región', type: 'text', default: 'Coquimbo' },
  {
    key: 'disponible',
    label: 'Disponibilidad',
    type: 'select',
    default: 'true',
    options: [
      { value: 'true', label: 'Disponible' },
      { value: 'false', label: 'No disponible' },
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
  { key: 'nombre', label: 'Experiencia', isName: true },
  { key: 'categoria', label: 'Categoría', render: (row) => row.categoria || 'Tours' },
  { key: 'precio', label: 'Precio', render: (row) => formatClp(row.precio) },
  { key: 'duracion', label: 'Duración', render: (row) => row.duracion || '—' },
  { key: 'comuna', label: 'Comuna', render: (row) => row.comuna || 'Andacollo' },
  {
    key: 'disponible',
    label: 'Estado',
    render: (row) => (
      <span
        className={`admin-crud__badge ${
          row.disponible ? 'admin-crud__badge--active' : 'admin-crud__badge--inactive'
        }`}
      >
        {row.disponible ? 'Disponible' : 'No disponible'}
      </span>
    ),
  },
];

export default function ExperiencesAdminPage() {
  const crud = useAdminCrud({
    table: 'experiencias',
    singularLabel: 'experiencia',
    orderColumn: 'nombre',
    ascending: true,
    transformPayload: (form) => ({
      nombre: form.nombre?.trim(),
      categoria: form.categoria || 'Tours',
      descripcion: form.descripcion?.trim(),
      imagen_url: form.imagen_url?.trim() || null,
      precio: form.precio === '' || form.precio == null ? null : Number(form.precio),
      duracion: form.duracion?.trim() || null,
      incluye: incluyeToText(form.incluye)
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      icono: form.icono || 'compass',
      rating_promedio:
        form.rating_promedio === '' || form.rating_promedio == null
          ? null
          : Number(form.rating_promedio),
      resenas_count:
        form.resenas_count === '' || form.resenas_count == null
          ? 0
          : Number(form.resenas_count),
      comuna: form.comuna?.trim() || 'Andacollo',
      region: form.region?.trim() || 'Coquimbo',
      disponible: form.disponible === 'true' || form.disponible === true,
    }),
  });

  function openModal(record) {
    if (!record?.id) {
      crud.setModalRecord({});
      return;
    }
    crud.setModalRecord({
      ...record,
      incluye: incluyeToText(record.incluye),
      disponible: record.disponible === false ? 'false' : 'true',
      precio: record.precio ?? '',
      rating_promedio: record.rating_promedio ?? '',
      resenas_count: record.resenas_count ?? 0,
      comuna: record.comuna || 'Andacollo',
      region: record.region || 'Coquimbo',
      icono: record.icono || 'compass',
    });
  }

  return (
    <AdminCrudView
      title="Experiencias locales"
      singularLabel="experiencia"
      createButtonLabel="+ Nueva experiencia"
      columns={COLUMNS}
      fields={FIELDS}
      rows={crud.rows}
      loading={crud.loading}
      feedback={crud.feedback}
      onClearFeedback={crud.clearFeedback}
      modalRecord={crud.modalRecord}
      onOpenModal={openModal}
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
