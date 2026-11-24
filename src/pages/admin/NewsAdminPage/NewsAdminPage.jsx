import { useState } from 'react';
import { useAdminCrud } from '../../../hooks/useAdminCrud';
import { buildNewsSlug, syncAndacolloNews } from '../../../services/news.service';
import AdminCrudView from '../../../components/admin/AdminCrudView';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import FeedbackBanner from '../../../components/ui/FeedbackBanner';
import './NewsAdminPage.css';

function formatNewsDate(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const FIELDS = [
  { key: 'titulo', label: 'Titular', type: 'text', required: true },
  {
    key: 'categoria',
    label: 'Categoría',
    type: 'select',
    default: 'Comuna',
    options: [
      { value: 'Comuna', label: 'Comuna' },
      { value: 'Turismo', label: 'Turismo' },
      { value: 'Patrimonio', label: 'Patrimonio' },
      { value: 'Astronomía', label: 'Astronomía' },
      { value: 'Cultura', label: 'Cultura' },
      { value: 'Eventos', label: 'Eventos' },
    ],
  },
  { key: 'fuente', label: 'Fuente', type: 'text', default: 'Municipalidad de Andacollo', required: true },
  { key: 'resumen', label: 'Resumen breve', type: 'textarea', required: true },
  { key: 'contenido', label: 'Contenido completo', type: 'textarea', required: true },
  { key: 'imagen_url', label: 'URL de imagen', type: 'url' },
  { key: 'url_externa', label: 'Enlace externo (opcional)', type: 'url' },
  {
    key: 'destacada',
    label: 'Noticia destacada',
    type: 'select',
    default: 'false',
    options: [
      { value: 'false', label: 'No' },
      { value: 'true', label: 'Sí, destacar en Inicio' },
    ],
  },
  {
    key: 'activa',
    label: 'Estado',
    type: 'select',
    default: 'true',
    options: [
      { value: 'true', label: 'Publicada' },
      { value: 'false', label: 'Oculta' },
    ],
  },
];

const COLUMNS = [
  {
    key: 'imagen_url',
    label: 'Imagen',
    render: (row) =>
      row.imagen_url ? (
        <img src={row.imagen_url} alt={row.titulo} className="admin-crud__table-img" />
      ) : (
        '—'
      ),
  },
  { key: 'titulo', label: 'Titular', isName: true },
  { key: 'categoria', label: 'Categoría', render: (row) => row.categoria || 'Comuna' },
  { key: 'fuente', label: 'Fuente', render: (row) => row.fuente || '—' },
  {
    key: 'origen',
    label: 'Origen',
    render: (row) => (
      <span className="admin-news-origin">
        {row.origen === 'automatica' ? 'Automática' : 'Manual'}
      </span>
    ),
  },
  { key: 'fecha_publicacion', label: 'Fecha', render: (row) => formatNewsDate(row.fecha_publicacion) },
  {
    key: 'activa',
    label: 'Estado',
    render: (row) => (
      <span
        className={`admin-crud__badge ${
          row.activa ? 'admin-crud__badge--active' : 'admin-crud__badge--inactive'
        }`}
      >
        {row.activa ? 'Publicada' : 'Oculta'}
      </span>
    ),
  },
];

export default function NewsAdminPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const crud = useAdminCrud({
    table: 'noticias',
    singularLabel: 'noticia',
    orderColumn: 'fecha_publicacion',
    ascending: false,
    transformPayload: (form) => ({
      titulo: form.titulo?.trim(),
      slug: buildNewsSlug(form.titulo),
      categoria: form.categoria || 'Comuna',
      fuente: form.fuente?.trim() || 'Municipalidad de Andacollo',
      resumen: form.resumen?.trim(),
      contenido: form.contenido?.trim(),
      imagen_url: form.imagen_url?.trim() || null,
      url_externa: form.url_externa?.trim() || null,
      destacada: form.destacada === 'true' || form.destacada === true,
      activa: form.activa === 'true' || form.activa === true,
      origen: 'manual',
      updated_at: new Date().toISOString(),
    }),
  });

  async function handleSync(e) {
    if (e && e.preventDefault) e.preventDefault();
    setSyncing(true);
    setSyncFeedback(null);

    const result = await syncAndacolloNews({ force: true });
    setSyncing(false);

    if (result?.synced) {
      setSyncFeedback({
        type: 'success',
        message: `${result.message} (${result.inserted} incorporadas, ${result.skipped} omitidas por duplicado).`,
      });
      crud.reload();
    } else {
      setSyncFeedback({
        type: 'warning',
        message: result?.message || 'No se pudieron traer noticias externas. Se mantienen los registros locales.',
      });
    }
  }

  return (
    <div className="admin-news-wrapper">
      <div className="admin-news-sync-bar">
        <div className="admin-news-sync-bar__info">
          <Icon name="newspaper" size={18} />
          <div>
            <strong>Sincronización automática de Andacollo</strong>
            <p>Importa titulares recientes desde fuentes públicas locales sin duplicar noticias existentes.</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={syncing}
        >
          <Icon name="refresh" size={15} />
          <span>{syncing ? 'Sincronizando...' : 'Sincronizar fuente local'}</span>
        </Button>
      </div>

      {syncFeedback && (
        <div className="admin-news-sync-feedback">
          <FeedbackBanner
            type={syncFeedback.type}
            message={syncFeedback.message}
            onDismiss={() => setSyncFeedback(null)}
          />
        </div>
      )}

      <AdminCrudView
        title="Noticias de Andacollo"
        singularLabel="noticia"
        createButtonLabel="+ Nueva noticia"
        columns={COLUMNS}
        fields={FIELDS}
        crud={crud}
      />
    </div>
  );
}
