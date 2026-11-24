import { useState } from 'react';
import { RichTextEditor } from '../../ui/RichText';
import '../AdminCrud.css';

export default function AdminCrudModal({ title, fields, record, onSave, onClose }) {
  const initial = {};
  fields.forEach((f) => {
    initial[f.key] = record ? (record[f.key] ?? '') : (f.default ?? '');
  });
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(form, record?.id);
    setSaving(false);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key} className="modal__field">
              <label htmlFor={`f-${field.key}`}>{field.label}</label>
              {field.type === 'richtext' ? (
                <RichTextEditor
                  id={`f-${field.key}`}
                  value={form[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ) : field.type === 'textarea' ? (
                <textarea
                  id={`f-${field.key}`}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={3}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  id={`f-${field.key}`}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                >
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={`f-${field.key}`}
                  type={field.type || 'text'}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  step={field.step}
                  min={field.min}
                />
              )}
            </div>
          ))}
          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
