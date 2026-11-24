import { useAdminCrud } from '../../../hooks/useAdminCrud';
import AdminCrudView from '../../../components/admin/AdminCrudView';

function formatClp(value) {
  const num = Number(value);
  if (!num || Number.isNaN(num)) return 'Consultar';
  return `$${num.toLocaleString('es-CL')} CLP`;
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
  { key: 'precio', label: 'Precio referencial (CLP)', type: 'number', default: '25000' },
  { key: 'duracion', label: 'Duración estimada', type: 'text', default: '2 horas' },
  { key: 'rating_promedio', label: 'Calificación (1.0 a 5.0)', type: 'number', default: '4.8' },
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
    orderColumn: 'created_at',
    ascending: false,
    transformPayload: (form) => ({
      nombre: form.nombre?.trim(),
      categoria: form.categoria || 'Tours',
      descripcion: form.descripcion?.trim(),
      imagen_url: form.imagen_url?.trim() || null,
      precio: form.precio !== '' && form.precio != null ? Number(form.precio) : null,
      duracion: form.duracion?.trim() || '2 horas',
      rating_promedio: form.rating_promedio ? Number(form.rating_promedio) : 4.8,
      disponible: form.disponible === 'true' || form.disponible === true,
    }),
  });

  return (
    <AdminCrudView
      title="Experiencias locales"
      singularLabel="experiencia"
      createButtonLabel="+ Nueva experiencia"
      columns={COLUMNS}
      fields={FIELDS}
      crud={crud}
    />
  );
}
