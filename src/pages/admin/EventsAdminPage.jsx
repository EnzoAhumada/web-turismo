import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminCrudModal from '../../components/admin/AdminCrudModal';
import '../../components/admin/AdminCrud.css';

const TABLE = 'eventos';

const FIELDS = [
  { key: 'nombre',       label: 'Nombre',          type: 'text',    required: true },
  { key: 'descripcion',  label: 'Descripción',      type: 'textarea' },
  { key: 'imagen_url',   label: 'URL de imagen',    type: 'url' },
  { key: 'fecha_inicio', label: 'Fecha inicio',     type: 'date' },
  { key: 'fecha_fin',    label: 'Fecha fin',        type: 'date' },
  { key: 'categoria',    label: 'Categoría',        type: 'text' },
  { key: 'activo', label: 'Estado', type: 'select', default: 'true', options: [{ value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }] },
];

export default function EventsAdminPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => { fetchRows(); }, []);

  async function fetchRows() {
    const { data } = await supabase.from(TABLE).select('*').order('fecha_inicio', { ascending: true });
    setRows(data || []);
    setLoading(false);
  }

  async function handleSave(form, id) {
    const payload = { ...form, activo: form.activo === 'true' || form.activo === true };
    if (id) {
      await supabase.from(TABLE).update(payload).eq('id', id);
    } else {
      await supabase.from(TABLE).insert(payload);
    }
    setModal(null);
    fetchRows();
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este evento?')) return;
    await supabase.from(TABLE).delete().eq('id', id);
    fetchRows();
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-crud">
          <div className="admin-crud__header">
            <h1 className="admin-crud__title">Eventos</h1>
            <button type="button" className="btn-primary" onClick={() => setModal({})}>
              + Nuevo evento
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
                    <th>Fecha inicio</th>
                    <th>Fecha fin</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={7} className="admin-crud__empty">No hay eventos.</td></tr>
                  ) : rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        {row.imagen_url && (
                          <img src={row.imagen_url} alt={row.nombre} className="admin-crud__table-img" />
                        )}
                      </td>
                      <td className="admin-crud__table-name">{row.nombre}</td>
                      <td>{formatDate(row.fecha_inicio)}</td>
                      <td>{formatDate(row.fecha_fin)}</td>
                      <td>{row.categoria || '—'}</td>
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
            title={modal.id ? 'Editar evento' : 'Nuevo evento'}
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
