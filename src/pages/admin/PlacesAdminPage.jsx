import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminCrudModal from '../../components/admin/AdminCrudModal';
import '../../components/admin/AdminCrud.css';

const TABLE = 'lugares';

const FIELDS = [
  { key: 'nombre',      label: 'Nombre',       type: 'text',     required: true },
  { key: 'descripcion', label: 'Descripción',   type: 'textarea' },
  { key: 'imagen_url',  label: 'URL de imagen', type: 'url' },
  { key: 'direccion',   label: 'Dirección',     type: 'text' },
  { key: 'horario',     label: 'Horario',       type: 'text' },
  { key: 'rating_promedio', label: 'Rating (0-5)', type: 'number', step: '0.1', min: '0' },
  { key: 'latitud',     label: 'Latitud',       type: 'number',  step: 'any' },
  { key: 'longitud',    label: 'Longitud',      type: 'number',  step: 'any' },
  { key: 'activo',      label: 'Estado',        type: 'select', default: 'true', options: [{ value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }] },
];

export default function PlacesAdminPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => { fetchRows(); }, []);

  async function fetchRows() {
    const { data } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  }

  async function handleSave(form, id) {
    const payload = {
      ...form,
      activo: form.activo === 'true' || form.activo === true,
      rating_promedio: form.rating_promedio ? Number(form.rating_promedio) : null,
      latitud: form.latitud ? Number(form.latitud) : null,
      longitud: form.longitud ? Number(form.longitud) : null,
    };
    if (id) {
      await supabase.from(TABLE).update(payload).eq('id', id);
    } else {
      await supabase.from(TABLE).insert(payload);
    }
    setModal(null);
    fetchRows();
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este lugar?')) return;
    await supabase.from(TABLE).delete().eq('id', id);
    fetchRows();
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-crud">
          <div className="admin-crud__header">
            <h1 className="admin-crud__title">Lugares</h1>
            <button type="button" className="btn-primary" onClick={() => setModal({})}>
              + Nuevo lugar
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="route-loading__spinner" />
            </div>
          ) : (
            <div className="admin-crud__table-wrap">
              <table className="admin-crud__table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Rating</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={6} className="admin-crud__empty">No hay lugares.</td></tr>
                  ) : rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        {row.imagen_url && (
                          <img src={row.imagen_url} alt={row.nombre} className="admin-crud__table-img" />
                        )}
                      </td>
                      <td className="admin-crud__table-name">{row.nombre}</td>
                      <td>{row.direccion}</td>
                      <td>{row.rating_promedio ?? '—'}</td>
                      <td>
                        <span className={`admin-crud__badge ${row.activo ? 'admin-crud__badge--active' : 'admin-crud__badge--inactive'}`}>
                          {row.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-crud__table-actions">
                          <button type="button" className="admin-crud__btn-edit" onClick={() => setModal(row)}>Editar</button>
                          <button type="button" className="admin-crud__btn-delete" onClick={() => handleDelete(row.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {modal !== null && (
          <AdminCrudModal
            title={modal.id ? 'Editar lugar' : 'Nuevo lugar'}
            fields={FIELDS}
            record={modal.id ? modal : null}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </main>
    </div>
  );
}
