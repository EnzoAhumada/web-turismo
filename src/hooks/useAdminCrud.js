import { useState, useEffect, useCallback } from 'react';
import { getCrudRecords, saveCrudRecord, deleteCrudRecord } from '../services/admin.service';

export function useAdminCrud({
  table,
  singularLabel = 'registro',
  orderColumn = 'created_at',
  ascending = false,
  transformPayload = (form) => form,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalRecord, setModalRecord] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCrudRecords(table, orderColumn, ascending);
      setRows(data);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || `No se pudieron cargar los registros de ${table}.`,
      });
    } finally {
      setLoading(false);
    }
  }, [table, orderColumn, ascending]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  async function handleSave(form, id) {
    setFeedback(null);
    try {
      const payload = transformPayload(form);
      await saveCrudRecord(table, payload, id);
      setModalRecord(null);
      setFeedback({
        type: 'success',
        message: id
          ? `Se actualizó el ${singularLabel} correctamente.`
          : `Se creó el ${singularLabel} correctamente.`,
      });
      await fetchRows();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || `Error al guardar el ${singularLabel}.`,
      });
    }
  }

  function requestDelete(row) {
    setConfirmDeleteTarget(row);
  }

  function cancelDelete() {
    if (!deleting) {
      setConfirmDeleteTarget(null);
    }
  }

  async function confirmDelete() {
    if (!confirmDeleteTarget) return;
    setDeleting(true);
    setFeedback(null);
    try {
      await deleteCrudRecord(table, confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
      setFeedback({
        type: 'success',
        message: `El ${singularLabel} fue eliminado correctamente.`,
      });
      await fetchRows();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || `Error al eliminar el ${singularLabel}.`,
      });
    } finally {
      setDeleting(false);
    }
  }

  return {
    rows,
    loading,
    modalRecord,
    setModalRecord,
    confirmDeleteTarget,
    deleting,
    feedback,
    clearFeedback: () => setFeedback(null),
    handleSave,
    reload: fetchRows,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
