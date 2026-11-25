import { useEffect, useMemo, useState } from 'react';
import { useAdminCrud } from '../../../hooks/useAdminCrud';
import { supabase } from '../../../lib/supabase';
import { ASTRO_SPOTS } from '../../../services/astrophotos.service';
import AdminCrudView from '../../../components/admin/AdminCrudView';

function authorLabel(profile) {
  const name = `${profile.nombre || ''} ${profile.apellido || ''}`.trim();
  if (name && profile.handle) return `${name} · @${profile.handle}`;
  return name || profile.handle || 'Perfil sin nombre';
}

export default function AstroPhotosAdminPage() {
  const [authors, setAuthors] = useState([]);
  const crud = useAdminCrud({
    table: 'astro_photos',
    singularLabel: 'astrofoto',
    orderColumn: 'created_at',
    ascending: false,
    transformPayload: (form) => {
      const baseLikes = form.base_likes === '' || form.base_likes == null ? 0 : Number(form.base_likes);
      const likesCount = form.likes_count === '' || form.likes_count == null ? baseLikes : Number(form.likes_count);
      return {
        author_id: form.author_id,
        titulo: form.titulo?.trim(),
        spot: form.spot?.trim() || ASTRO_SPOTS[0],
        descripcion: form.descripcion?.trim(),
        imagen_url: form.imagen_url?.trim(),
        exif_camera: form.exif_camera?.trim() || 'Cámara / Smartphone',
        exif_iso: form.exif_iso?.trim() || 'ISO 1600',
        exif_shutter: form.exif_shutter?.trim() || '30 seg',
        exif_aperture: form.exif_aperture?.trim() || 'f/2.8',
        base_likes: baseLikes,
        likes_count: likesCount,
        activo: form.activo === 'true' || form.activo === true,
      };
    },
  });

  useEffect(() => {
    let active = true;
    supabase
      .from('profiles')
      .select('id, nombre, apellido, handle')
      .order('nombre', { ascending: true })
      .then(({ data }) => {
        if (active) setAuthors(data || []);
      });
    return () => {
      active = false;
    };
  }, []);

  const authorNames = useMemo(() => {
    const map = new Map();
    authors.forEach((profile) => map.set(profile.id, authorLabel(profile)));
    return map;
  }, [authors]);

  const spotOptions = useMemo(() => {
    const extras = crud.rows
      .map((row) => row.spot)
      .filter((spot) => spot && !ASTRO_SPOTS.includes(spot));
    return [...ASTRO_SPOTS, ...new Set(extras)].map((spot) => ({ value: spot, label: spot }));
  }, [crud.rows]);

  const fields = useMemo(() => {
    return [
      { key: 'titulo', label: 'Título', type: 'text', required: true },
      {
        key: 'author_id',
        label: 'Autor',
        type: 'select',
        required: true,
        default: '',
        options: [
          { value: '', label: 'Selecciona un autor' },
          ...authors.map((profile) => ({ value: profile.id, label: authorLabel(profile) })),
        ],
      },
      {
        key: 'spot',
        label: 'Lugar de captura',
        type: 'select',
        default: ASTRO_SPOTS[2],
        options: spotOptions,
      },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
      { key: 'imagen_url', label: 'URL de imagen o preset', type: 'text', required: true },
      { key: 'exif_camera', label: 'Cámara', type: 'text', default: 'Cámara / Smartphone' },
      { key: 'exif_iso', label: 'ISO', type: 'text', default: 'ISO 1600' },
      { key: 'exif_shutter', label: 'Obturación', type: 'text', default: '30 seg' },
      { key: 'exif_aperture', label: 'Apertura', type: 'text', default: 'f/2.8' },
      { key: 'base_likes', label: 'Me gusta base', type: 'number', min: '0', step: '1', default: '0' },
      { key: 'likes_count', label: 'Me gusta mostrados', type: 'number', min: '0', step: '1', default: '0' },
      {
        key: 'activo',
        label: 'Estado',
        type: 'select',
        default: 'true',
        options: [
          { value: 'true', label: 'Publicada' },
          { value: 'false', label: 'Oculta' },
        ],
      },
    ];
  }, [authors, spotOptions]);

  const columns = useMemo(
    () => [
      {
        key: 'imagen_url',
        label: 'Imagen',
        render: (row) =>
          row.imagen_url && /^https?:/i.test(row.imagen_url) ? (
            <img src={row.imagen_url} alt={row.titulo} className="admin-crud__table-img" />
          ) : (
            row.imagen_url || '—'
          ),
      },
      { key: 'titulo', label: 'Título', isName: true },
      { key: 'spot', label: 'Lugar' },
      {
        key: 'author_id',
        label: 'Autor',
        render: (row) => authorNames.get(row.author_id) || '—',
      },
      { key: 'likes_count', label: 'Me gusta', render: (row) => row.likes_count ?? 0 },
      {
        key: 'activo',
        label: 'Estado',
        render: (row) => (
          <span
            className={`admin-crud__badge ${
              row.activo ? 'admin-crud__badge--active' : 'admin-crud__badge--inactive'
            }`}
          >
            {row.activo ? 'Publicada' : 'Oculta'}
          </span>
        ),
      },
    ],
    [authorNames]
  );

  function openModal(record) {
    if (!record?.id) {
      crud.setModalRecord({});
      return;
    }
    crud.setModalRecord({
      ...record,
      spot: record.spot || ASTRO_SPOTS[0],
      activo: record.activo === false ? 'false' : 'true',
      base_likes: record.base_likes ?? 0,
      likes_count: record.likes_count ?? 0,
    });
  }

  return (
    <AdminCrudView
      title="Astrofotos"
      singularLabel="astrofoto"
      createButtonLabel="+ Nueva astrofoto"
      columns={columns}
      fields={fields}
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
